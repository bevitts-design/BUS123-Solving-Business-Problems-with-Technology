import fs from "node:fs/promises";
import path from "node:path";

const root = path.resolve(new URL("..", import.meta.url).pathname);
const data = JSON.parse(await fs.readFile(path.join(root, "course-map.json"), "utf8"));

const esc = (value) =>
  String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const materialLabel = (material) =>
  `<a href="${esc(material.path)}">${esc(material.type)}</a>`;

const lessonCard = (lesson) => {
  const search = [
    lesson.title,
    lesson.track,
    lesson.module,
    lesson.lesson,
    lesson.status,
    lesson.caseStudy,
    ...(lesson.skillFocus ?? []),
    ...(lesson.materials ?? []).map((item) => item.type)
  ].filter(Boolean).join(" ").toLowerCase();

  return `<article class="lesson" data-lesson data-track="${esc(lesson.track)}" data-search="${esc(search)}">
    <div class="lesson-header">
      <div>
        <div class="code">${esc(lesson.track)} · ${esc(lesson.module)} · ${esc(lesson.lesson)}</div>
        <h3>${esc(lesson.title)}</h3>
      </div>
      <span class="status ${esc(lesson.status.toLowerCase().replaceAll(" ", "-"))}">${esc(lesson.status)}</span>
    </div>
    <p>${esc(lesson.caseStudy || "General course foundation")}</p>
    <div class="skills">${esc((lesson.skillFocus ?? []).join(" · "))}</div>
    <div class="materials">${(lesson.materials ?? []).map(materialLabel).join("")}</div>
  </article>`;
};

const tracks = data.tracks.map((track) => {
  const lessons = data.lessons.filter((lesson) => lesson.track === track.id);
  return `<section id="${esc(track.id)}" class="track-section">
    <div class="track-heading">
      <h2>${esc(track.label)}</h2>
      <span>${lessons.length} lesson${lessons.length === 1 ? "" : "s"}</span>
    </div>
    <div class="lesson-grid">${lessons.map(lessonCard).join("\n")}</div>
  </section>`;
}).join("\n");

const current = data.lessons.find((lesson) => lesson.id === data.course.currentLessonId) ?? data.lessons[0];

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
        ${data.tracks.map((track) => `<a href="#${esc(track.id)}">${esc(track.label)}</a>`).join("")}
      </nav>
    </div>
  </header>

  <main>
    <section class="hero">
      <div class="shell">
        <div class="eyebrow">${esc(data.course.term)}</div>
        <h1>Find the right BUS123 materials quickly.</h1>
        <p>This course map is the student-facing source for live lesson slides, readings, workbooks, and practice materials.</p>
        <div class="current">
          <div>
            <div class="meta">Current · ${esc(current.track)} ${esc(current.module)} ${esc(current.lesson)}</div>
            <h2>${esc(current.title)}</h2>
            <p>${esc(current.caseStudy || "General course foundation")} · ${esc((current.skillFocus ?? []).join(" · "))}</p>
          </div>
          <div class="materials">${(current.materials ?? []).map(materialLabel).join("")}</div>
        </div>
      </div>
    </section>

    <section class="shell controls" aria-label="Search and filter">
      <input class="search" type="search" placeholder="Search by title, skill, track, module, material, or case company" data-search>
      <div class="filters">
        <button class="active" type="button" data-filter="all">All</button>
        ${data.tracks.map((track) => `<button type="button" data-filter="${esc(track.id)}">${esc(track.label)}</button>`).join("")}
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
