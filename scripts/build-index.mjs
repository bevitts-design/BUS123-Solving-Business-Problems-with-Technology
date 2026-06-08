import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const data = JSON.parse(await fs.readFile(path.join(root, "course-map.json"), "utf8"));

const allowedStatuses = new Set(["Live", "Coming Soon", "In Progress", "Canvas Only", "Not Released"]);
const privatePathPattern = /(^|[/_-])(instructor|answer[-_ ]?key|solutions?|grading|qti)([/_.-]|$)|\.zip$/i;

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

const materialGroups = [
  { id: "before", label: "Before class", types: new Set(["Reading", "Pre-reading"]) },
  { id: "class", label: "In class", types: new Set(["Slides", "Company Profiles"]) },
  { id: "practice", label: "Workbook/Practice", types: new Set(["Starter Workbook", "Interactive Practice", "Activity Instructions", "Homework"]) }
];

const materialFilters = ["Slides", "Reading", "Starter Workbook", "Interactive Practice", "Activity Instructions"];
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
      if (!material.type) {
        issues.push(`${lesson.id} has a material without a type.`);
      }
      if (!material.path || material.path === "#") {
        issues.push(`${lesson.id} has a placeholder path for ${material.type ?? "a material"}.`);
        continue;
      }
      if (privatePathPattern.test(material.path)) {
        issues.push(`${lesson.id} links a private or non-public material: ${material.path}`);
      }
      if (!/^https?:\/\//i.test(material.path)) {
        const materialPath = path.join(root, material.path);
        if (!awaitFileExists(materialPath)) {
          issues.push(`${lesson.id} is missing ${material.type}: ${material.path}`);
        }
      }
    }
  }

  if (!seen.has(data.course.currentLessonId)) {
    issues.push(`currentLessonId "${data.course.currentLessonId}" does not match a lesson id.`);
  }

  if (issues.length) {
    throw new Error(`Course map validation failed:\n- ${issues.join("\n- ")}`);
  }
}

function awaitFileExists(filePath) {
  return fileExistsCache.get(filePath) ?? false;
}

const fileExistsCache = new Map();
await Promise.all((data.lessons ?? []).flatMap((lesson) =>
  (lesson.materials ?? [])
    .filter((material) => material.path && material.path !== "#" && !/^https?:\/\//i.test(material.path))
    .map(async (material) => {
      const materialPath = path.join(root, material.path);
      try {
        await fs.access(materialPath);
        fileExistsCache.set(materialPath, true);
      } catch {
        fileExistsCache.set(materialPath, false);
      }
    })
));

validateCourseMap();

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
    "Slides": "S",
    "Reading": "R",
    "Pre-reading": "R",
    "Starter Workbook": "W",
    "Interactive Practice": "P",
    "Activity Instructions": "A",
    "Homework": "H",
    "Company Profiles": "C"
  };
  return icons[type] ?? "M";
};

const materialLink = (material, options = {}) =>
  `<a class="${options.primary ? "primary-action" : "material-chip"} material-${esc(slug(material.type))}" href="${esc(material.path)}">
    <span class="material-icon" aria-hidden="true">${esc(materialIcon(material.type))}</span>
    <span>${esc(material.type)}</span>
  </a>`;

const groupMaterials = (materials) =>
  materialGroups.map((group) => ({
    ...group,
    materials: (materials ?? []).filter((material) => group.types.has(material.type))
  })).filter((group) => group.materials.length);

const primaryMaterial = (lesson) =>
  (lesson.materials ?? []).find((material) => material.type === "Slides") ?? (lesson.materials ?? [])[0];

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
  ...(lesson.materials ?? []).flatMap((item) => [item.type, item.path])
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

const currentIndex = sortedLessons.findIndex((lesson) => lesson.id === data.course.currentLessonId);
const current = sortedLessons[currentIndex];
const currentTrack = trackById.get(current.track);
const primary = primaryMaterial(current);

const sequenceItem = (label, lesson) => {
  if (!lesson) {
    return `<div class="sequence-card is-empty">
      <span>${esc(label)}</span>
      <strong>None</strong>
    </div>`;
  }
  const track = trackById.get(lesson.track);
  return `<a class="sequence-card" href="#${esc(lesson.id)}">
    <span>${esc(label)}</span>
    <strong>${esc(displayLabel(lesson, track))}</strong>
    <em>${esc(lesson.title)}</em>
  </a>`;
};

const secondaryCurrentMaterials = (current.materials ?? []).filter((material) => material !== primary);
const currentGroups = groupMaterials(secondaryCurrentMaterials);
const currentGroupsHtml = currentGroups.map((group) => `<div class="material-group">
              <h3>${esc(group.label)}</h3>
              <div class="materials">${group.materials.map((material) => materialLink(material)).join("")}</div>
            </div>`).join("");

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
</head>
<body>
  <header class="topbar">
    <div class="shell topbar-inner">
      <a class="brand" href="#">
        <span class="brand-mark" aria-hidden="true"></span>
        <span><strong>${esc(data.course.code)}</strong><span>${esc(data.course.title)}</span></span>
      </a>
      <nav class="nav" aria-label="Course sections">
        ${orderedTracks.map((track) => `<a href="#${esc(track.id)}">${esc(track.label)}</a>`).join("")}
        ${data.course.canvasUrl ? `<a href="${esc(data.course.canvasUrl)}">Canvas</a>` : ""}
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="shell">
        <div class="eyebrow">${esc(data.course.term)}</div>
        <h1>Find the right BUS123 materials quickly.</h1>
        <p>This course map is the student-facing source for live lesson slides, readings, workbooks, and practice materials.</p>
        <section class="week-ahead" aria-labelledby="week-ahead-title" data-week-ahead data-week-ahead-src="assets/canvas-week-ahead.json">
          <div class="week-ahead-header">
            <div>
              <div class="meta">Canvas</div>
              <h2 id="week-ahead-title">Week Ahead</h2>
              <p>Upcoming BUS123 assignments and events for the next 7 days.</p>
            </div>
            <div class="week-ahead-actions">
              <span data-week-ahead-updated>Checking Canvas dates...</span>
              ${data.course.canvasUrl ? `<a href="${esc(data.course.canvasUrl)}">Open Canvas</a>` : ""}
            </div>
          </div>
          <div class="week-ahead-list" data-week-ahead-list>
            <p class="week-ahead-empty">Loading Canvas week-ahead dates...</p>
          </div>
        </section>
        <div class="current">
          <div class="current-copy">
            <div class="meta">Current · ${esc(displayLabel(current, currentTrack))}</div>
            <h2>${esc(current.title)}</h2>
            <p>${esc(current.caseStudy || "General course foundation")} · ${esc((current.skillFocus ?? []).join(" · "))}</p>
            ${primary ? `<div class="current-primary"><span class="launch-label">In class</span>${materialLink(primary, { primary: true })}</div>` : ""}
          </div>
          <div class="current-groups" aria-label="Current lesson materials">${currentGroupsHtml}</div>
        </div>
        <div class="sequence-strip" aria-label="Lesson sequence">
          ${sequenceItem("Previous", sortedLessons[currentIndex - 1])}
          ${sequenceItem("Current", current)}
          ${sequenceItem("Next", sortedLessons[currentIndex + 1])}
        </div>
      </div>
    </section>

    <section class="shell controls" aria-label="Search and filter">
      <input class="search" type="search" placeholder="Search by title, skill, track, module, material, or case company" data-search>
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

    <div class="shell">
      ${tracks}
      <p class="empty" data-empty hidden>No matching lessons found.</p>
    </div>
  </main>
  <script src="assets/index.js"></script>
</body>
</html>
`;

await fs.writeFile(path.join(root, "index.html"), html);

console.log(`Built index.html from course-map.json (${data.lessons.length} lessons, current: ${current.id}).`);
