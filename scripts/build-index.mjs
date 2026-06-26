import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const data = JSON.parse(await fs.readFile(path.join(root, "course-map.json"), "utf8"));

const allowedStatuses = new Set(["Live", "Coming Soon", "In Progress", "Canvas Only", "Not Released"]);
const privatePathPattern = /(^|[/_-])(instructor|answer[-_ ]?key|solutions?|grading|qti)([/_.-]|$)|\.zip$/i;
const validationWarnings = [];

const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const slug = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const trackById = new Map(data.tracks.map((track) => [track.id, track]));

const materialFilters = ["Slides", "Reading", "Syllabus", "Infographic", "Starter Workbook", "Closer Workbook", "Interactive Practice", "Activity Instructions", "Homework"];
const statusFilters = ["Current", "Live", "In Progress", "Coming Soon"];

function validateCourseMap() {
  const issues = [];
  const seen = new Set();
  const seenDisplayOrders = new Set();

  if (!data.course?.currentLessonId) {
    issues.push("course.currentLessonId is required.");
  }

  for (const track of data.tracks ?? []) {
    if (!track.id || !track.label) {
      issues.push(`Track is missing id or label: ${JSON.stringify(track)}`);
    }
  }

  for (const lesson of data.lessons ?? []) {
    if (!lesson.id) {
      issues.push(`Lesson is missing id: ${JSON.stringify(lesson)}`);
      continue;
    }
    if (seen.has(lesson.id)) {
      issues.push(`Duplicate lesson id: ${lesson.id}`);
    }
    seen.add(lesson.id);

    if (!trackById.has(lesson.track)) {
      issues.push(`${lesson.id} references unknown track "${lesson.track}".`);
    }
    if (!lesson.moduleType || !lesson.moduleLabel || !Number.isFinite(lesson.displayOrder)) {
      issues.push(`${lesson.id} is missing valid moduleType, moduleLabel, or displayOrder metadata.`);
    } else if (seenDisplayOrders.has(lesson.displayOrder)) {
      issues.push(`${lesson.id} reuses displayOrder ${lesson.displayOrder}.`);
    } else {
      seenDisplayOrders.add(lesson.displayOrder);
    }
    if (lesson.status === "Current") {
      issues.push(`${lesson.id} uses "Current" as a status. Set course.currentLessonId instead and keep lesson.status as a release state.`);
    } else if (!allowedStatuses.has(lesson.status)) {
      issues.push(`${lesson.id} uses unsupported status "${lesson.status}".`);
    }

    for (const material of lesson.materials ?? []) {
      validatePublicLink(material, issues, `${lesson.id} material`);
    }
  }

  for (const resource of data.course.resources ?? []) {
    validatePublicLink(resource, issues, "course resource");
  }

  if (!seen.has(data.course.currentLessonId)) {
    issues.push(`currentLessonId "${data.course.currentLessonId}" does not match a lesson id.`);
  }

  if (issues.length) {
    throw new Error(`Course map validation failed:\n- ${issues.join("\n- ")}`);
  }
}

function validatePublicLink(item, issues, context) {
  if (!item.type) {
    issues.push(`${context} is missing a type.`);
  }
  if (!item.path || item.path === "#") {
    issues.push(`${context} has a placeholder path for ${item.type ?? "a link"}.`);
    return;
  }
  if (privatePathPattern.test(item.path)) {
    issues.push(`${context} links a private or non-public file: ${item.path}`);
  }
  if (!/^https?:\/\//i.test(item.path)) {
    const itemPath = path.join(root, item.path);
    if (!awaitFileExists(itemPath)) {
      validationWarnings.push(`${context} is unavailable until rebuilt or committed: ${item.path}`);
    }
  }
}

function awaitFileExists(filePath) {
  return fileExistsCache.get(filePath) ?? false;
}

const fileExistsCache = new Map();
const publicLinks = [
  ...(data.course.resources ?? []),
  ...(data.lessons ?? []).flatMap((lesson) => lesson.materials ?? [])
];
await Promise.all(publicLinks
  .filter((item) => item.path && item.path !== "#" && !/^https?:\/\//i.test(item.path))
  .map(async (item) => {
    const itemPath = path.join(root, item.path);
    try {
      await fs.access(itemPath);
      fileExistsCache.set(itemPath, true);
    } catch {
      fileExistsCache.set(itemPath, false);
    }
  }));

validateCourseMap();

if (validationWarnings.length) {
  console.warn(`Course map warnings:\n- ${validationWarnings.join("\n- ")}`);
}

const orderedLessons = (lessons) =>
  lessons
    .map((lesson, index) => ({ lesson, index }))
    .sort((a, b) =>
      (a.lesson.displayOrder ?? Number.MAX_SAFE_INTEGER) - (b.lesson.displayOrder ?? Number.MAX_SAFE_INTEGER) ||
      a.index - b.index
    )
    .map(({ lesson }) => lesson);

const sortedLessons = orderedLessons(data.lessons ?? []);

const displayLabel = (lesson, track) =>
  lesson.moduleLabel ?? [track?.label ?? lesson.track, lesson.module, lesson.lesson].filter(Boolean).join(" ");

const materialIcon = (type) => {
  const icons = {
    "Slides": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1.5" y="2.5" width="13" height="9" rx="1"/><path d="M8 11.5v2M5.5 14.5h5"/></svg>',
    "Reading": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3.5C6.5 2.3 4.2 2.2 2 2.8v10c2.2-.6 4.5-.5 6 .7 1.5-1.2 3.8-1.3 6-.7v-10c-2.2-.6-4.5-.5-6 .7z"/><path d="M8 3.5v10"/></svg>',
    "Pre-reading": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M8 3.5C6.5 2.3 4.2 2.2 2 2.8v10c2.2-.6 4.5-.5 6 .7 1.5-1.2 3.8-1.3 6-.7v-10c-2.2-.6-4.5-.5-6 .7z"/><path d="M8 3.5v10"/></svg>',
    "Starter Workbook": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M2 6.5h12M6.5 2v12"/></svg>',
    "Closer Workbook": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="2" width="12" height="12" rx="1"/><path d="M2 6.5h12M6.5 6.5V14"/><path d="M8.5 10.5l1.5 1.5 2.5-3"/></svg>',
    "Interactive Practice": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="8" cy="8" r="6.5"/><path d="M6.5 5.5l4 2.5-4 2.5z" fill="currentColor" stroke="none"/></svg>',
    "Activity Instructions": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 4h9M5 8h9M5 12h9"/><circle cx="2.2" cy="4" r="1" fill="currentColor" stroke="none"/><circle cx="2.2" cy="8" r="1" fill="currentColor" stroke="none"/><circle cx="2.2" cy="12" r="1" fill="currentColor" stroke="none"/></svg>',
    "Homework": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 1.5h8v13H4z"/><path d="M6 5h4M6 8h4M6 11h2"/></svg>',
    "Company Profiles": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 14V3.5L8 1.5l6 2V14M2 14h12M5.5 6h1M5.5 9h1M9.5 6h1M9.5 9h1M7 14v-2.5h2V14"/></svg>',
    "Syllabus": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 1.5h6l3 3v10H4z"/><path d="M10 1.5v3h3M6 8h5M6 10.5h5"/></svg>',
    "Infographic": '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M2 14h12M4 14V8M8 14V4M12 14v-4"/></svg>'
  };
  return icons[type] ?? '<svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2.5" y="2.5" width="11" height="11" rx="2"/><path d="M5.5 6h5M5.5 8.5h5M5.5 11h3"/></svg>';
};

const materialIsAvailable = (material) => {
  if (!material?.path || material.path === "#") return false;
  if (/^https?:\/\//i.test(material.path)) return true;
  return awaitFileExists(path.join(root, material.path));
};

const materialLink = (material, options = {}) => {
  const label = material.label ?? material.type;
  const classes = `${options.primary ? "primary-action" : "material-chip"} material-${esc(slug(material.type))}`;
  const unavailablePath = material?.path && material.path !== "#" ? ` data-href="${esc(material.path)}"` : "";
  if (!materialIsAvailable(material)) {
    return `<span class="${classes} is-unavailable"${unavailablePath} aria-disabled="true" title="${esc(label)} is not available yet">
    <span class="material-icon" aria-hidden="true">${materialIcon(material.type)}</span>
    <span>${esc(label)} unavailable</span>
  </span>`;
  }
  return `<a class="${classes}" href="${esc(material.path)}">
    <span class="material-icon" aria-hidden="true">${materialIcon(material.type)}</span>
    <span>${esc(label)}</span>
  </a>`;
};

const primaryMaterial = (lesson) =>
  (lesson.materials ?? []).find((material) => material.type === "Slides" && materialIsAvailable(material)) ??
  (lesson.materials ?? []).find((material) => materialIsAvailable(material));

const effectiveStatus = (lesson) =>
  lesson.id === data.course.currentLessonId ? "Current" : lesson.status;

const searchText = (lesson, track) => [
  lesson.title,
  lesson.track,
  track?.label,
  lesson.moduleType,
  lesson.moduleLabel,
  lesson.module,
  lesson.lesson,
  lesson.displayOrder,
  effectiveStatus(lesson),
  lesson.caseStudy,
  ...(lesson.skillFocus ?? []),
  ...(lesson.materials ?? []).flatMap((item) => [item.type, item.label, item.path])
].filter(Boolean).join(" ").toLowerCase();

const lessonCard = (lesson) => {
  const track = trackById.get(lesson.track);
  const materialSlugs = (lesson.materials ?? []).map((item) => slug(item.type)).join(" ");
  const status = effectiveStatus(lesson);

  return `<article id="${esc(lesson.id)}" class="lesson track-${esc(slug(lesson.track))}" data-lesson data-track="${esc(lesson.track)}" data-track-label="${esc(track?.label ?? lesson.track)}" data-status="${esc(slug(status))}" data-materials="${esc(materialSlugs)}" data-search="${esc(searchText(lesson, track))}">
    <div class="lesson-header">
      <div>
        <div class="code">${esc(displayLabel(lesson, track))}</div>
        <h3>${esc(lesson.title)}</h3>
      </div>
      <span class="status ${esc(slug(status))}">${esc(status)}</span>
    </div>
    <p>${esc(lesson.caseStudy || "General course foundation")}</p>
    <div class="skills">${esc((lesson.skillFocus ?? []).join(" · "))}</div>
    <div class="materials">${(lesson.materials ?? []).map((material) => materialLink(material)).join("")}</div>
  </article>`;
};

const orderedTracks = data.tracks
  .map((track, index) => ({
    track,
    index,
    firstDisplayOrder: Math.min(
      ...sortedLessons
        .filter((lesson) => lesson.track === track.id)
        .map((lesson) => lesson.displayOrder ?? Number.MAX_SAFE_INTEGER)
    )
  }))
  .sort((a, b) => a.firstDisplayOrder - b.firstDisplayOrder || a.index - b.index)
  .map(({ track }) => track);

const tracks = orderedTracks.map((track) => {
  const lessons = sortedLessons.filter((lesson) => lesson.track === track.id);
  return `<section id="${esc(track.id)}" class="track-section">
    <div class="track-heading">
      <h2>${esc(track.label)}</h2>
      <span>${lessons.length} lesson${lessons.length === 1 ? "" : "s"}</span>
    </div>
    <div class="lesson-grid">${lessons.map(lessonCard).join("\n")}</div>
  </section>`;
}).join("\n");

const current = sortedLessons.find((lesson) => lesson.id === data.course.currentLessonId);
const currentTrack = trackById.get(current.track);
const primary = primaryMaterial(current);

const unavailableChip = (label = "Not posted yet", type = "Activity Instructions") =>
  `<span class="material-chip is-unavailable" aria-disabled="true">
    <span class="material-icon" aria-hidden="true">${materialIcon(type)}</span>
    <span>${esc(label)}</span>
  </span>`;

const findMaterial = (lesson, types) =>
  (lesson?.materials ?? []).find((material) => types.includes(material.type));

const courseResources = data.course.resources ?? [];
const courseResourcesHtml = courseResources.length
  ? `<div class="course-resources" aria-label="Course resources">
          ${courseResources.map((resource) => materialLink(resource, { resource: true })).join("")}
        </div>`
  : "";

const currentReading = findMaterial(current, ["Reading", "Pre-reading"]);
const currentSlides = findMaterial(current, ["Slides"]);
const currentWorkbook = findMaterial(current, ["Starter Workbook", "Closer Workbook"]);
const currentPractice = findMaterial(current, ["Interactive Practice", "Activity Instructions", "Homework"]) ?? currentWorkbook;
const currentLaunch = currentSlides ?? primary;
const currentCase = current.caseStudy || "General course foundation";
const currentSkills = (current.skillFocus ?? []).join(" · ");
const currentContext = [displayLabel(current, currentTrack), currentCase, currentSkills].filter(Boolean).join(" · ");

const classPackCards = [
  {
    label: "Before class",
    title: "Preview the lesson",
    detail: "Skim the reading and bring one question or term to class.",
    material: currentReading,
    fallback: unavailableChip("Reading not posted yet", "Reading")
  },
  {
    label: "In class",
    title: "Launch the class materials",
    detail: "Use the slides or primary activity while we work together.",
    material: currentLaunch,
    fallback: unavailableChip("Lesson materials not posted yet", "Slides")
  },
  {
    label: "Practice",
    title: "Save your working file",
    detail: "Download the workbook or practice file before you start editing.",
    material: currentPractice,
    fallback: unavailableChip("Practice not posted yet", "Starter Workbook")
  }
];
const classPackHtml = classPackCards.map((step) => {
  const action = step.material ? materialLink(step.material) : step.fallback;
  return `<article class="class-pack-step">
              <span>${esc(step.label)}</span>
              <strong>${esc(step.title)}</strong>
              <p>${esc(step.detail)}</p>
              ${action}
            </article>`;
}).join("");

const quickAction = ({ label, title, detail, material, href, iconType }) => {
  const target = material && materialIsAvailable(material) ? material.path : href;
  const tag = target ? "a" : "span";
  const hrefAttr = target ? ` href="${esc(target)}"` : ` aria-disabled="true"`;
  const unavailableClass = target ? "" : " is-unavailable";
  return `<${tag} class="catch-up-action${unavailableClass}"${hrefAttr}>
    <span class="material-icon" aria-hidden="true">${materialIcon(iconType ?? material?.type ?? "Activity Instructions")}</span>
    <span>
      <small>${esc(label)}</small>
      <strong>${esc(title)}</strong>
      <em>${esc(detail)}</em>
    </span>
  </${tag}>`;
};

const catchUpHtml = [
  quickAction({
    label: "I missed class",
    title: "Review today's lesson",
    detail: currentSlides ? "Open the slides." : "Jump to the lesson card.",
    material: currentSlides,
    href: `#${current.id}`,
    iconType: "Slides"
  }),
  quickAction({
    label: "I need the workbook",
    title: currentWorkbook ? "Download the workbook" : "Workbook not posted",
    detail: currentWorkbook ? "Start from a clean copy." : "Check the lesson card below.",
    material: currentWorkbook,
    href: currentWorkbook ? undefined : `#${current.id}`,
    iconType: "Starter Workbook"
  }),
  quickAction({
    label: "I need practice",
    title: currentPractice ? "Open practice materials" : "Practice not posted",
    detail: currentPractice ? "Use the current activity file." : "Use the lesson card when posted.",
    material: currentPractice,
    href: currentPractice ? undefined : `#${current.id}`,
    iconType: currentPractice?.type ?? "Interactive Practice"
  }),
  quickAction({
    label: "I am looking around",
    title: "Search by skill or material",
    detail: "Use filters for track, status, and file type.",
    href: "#course-controls",
    iconType: "Infographic"
  })
].join("");

const catchUpSectionHtml = `<section class="catch-up catch-up-section" aria-labelledby="catch-up-title">
        <div class="panel-heading compact">
          <div>
            <div class="meta">Need a shortcut?</div>
            <h2 id="catch-up-title">Catch Up</h2>
          </div>
        </div>
        <div class="catch-up-grid">${catchUpHtml}</div>
      </section>`;

const filterButton = (group, value, label, active = false) =>
  `<button ${active ? `class="active"` : ""} type="button" data-filter-group="${esc(group)}" data-filter-value="${esc(value)}" aria-pressed="${active ? "true" : "false"}">${esc(label)}</button>`;

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(data.course.code)} · ${esc(data.course.title)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="assets/index.css">
  <link rel="icon" href="data:,">
  <meta name="description" content="${esc(data.course.code)} course hub: slides, readings, workbooks, and practice files for ${esc(data.course.title)} at Endicott College.">
</head>
<body>
  <a class="skip-link" href="#main-content">Skip to content</a>
  <header class="topbar">
    <div class="shell topbar-inner">
      <a class="brand" href="#">
        <span class="brand-mark" aria-hidden="true"></span>
        <span><strong>${esc(data.course.code)}</strong><span>${esc(data.course.title)}</span></span>
      </a>
      <nav class="nav" aria-label="Course sections">
        ${orderedTracks.map((track) => `<a href="#${esc(track.id)}">${esc(track.label)}</a>`).join("")}
        ${courseResources.map((resource) => `<a href="${esc(resource.path)}">${esc(resource.label ?? resource.type)}</a>`).join("")}
      </nav>
    </div>
  </header>

  <main id="main-content">
    <section class="hero">
      <div class="shell">
        <div class="eyebrow">${esc(data.course.term)}</div>
        <h1>BUS123 Course Hub</h1>
        <p>Open today's class materials, then use the lesson cards below for slides, readings, workbooks, and practice files.</p>
        ${courseResourcesHtml}
        <div class="command-center" aria-label="Course command center">
          <section class="class-pack" aria-labelledby="class-pack-title">
            <div class="panel-heading">
              <div>
                <div class="meta">Today's class pack</div>
                <h2 id="class-pack-title">${esc(current.title)}</h2>
                <p>${esc(currentContext)}</p>
              </div>
              <span class="status current">Current</span>
            </div>
            <div class="class-pack-grid">${classPackHtml}</div>
          </section>
        </div>
      </div>
    </section>

    <div class="shell">
      ${tracks}
      ${catchUpSectionHtml}
      <p class="empty" data-empty hidden>No matching lessons found.</p>
    </div>

    <section id="course-controls" class="shell controls" aria-label="Search and filter">
      <input class="search" type="search" aria-label="Search lessons by title, skill, track, module, material, or case company" placeholder="Search by title, skill, track, module, material, or case company" data-search>
      <div class="filter-panel">
        <div class="filters" aria-label="Track filters">
          ${filterButton("track", "all", "All", true)}
          ${orderedTracks.map((track) => filterButton("track", track.id, track.label)).join("")}
        </div>
        <div class="filters" aria-label="Material filters">
          ${filterButton("material", "all", "Any Material", true)}
          ${materialFilters.map((type) => filterButton("material", slug(type), type)).join("")}
        </div>
        <div class="filters" aria-label="Status filters">
          ${filterButton("status", "all", "Any Status", true)}
          ${statusFilters.map((status) => filterButton("status", slug(status), status)).join("")}
        </div>
      </div>
    </section>
  </main>
  <script src="assets/index.js?v=20260626"></script>
</body>
</html>
`;

await fs.writeFile(path.join(root, "index.html"), html.replace(/^[ \t]+$/gm, ""));

console.log(`Built index.html from course-map.json (${data.lessons.length} lessons, current: ${current.id}).`);
