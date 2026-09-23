# Codex Project Guidance

This file is for Codex sessions working in this repository. Other AI tools may ignore it unless explicitly configured to use it.

## Collaboration Style

- When giving manual instructions, use small numbered steps and say where each action should be performed.
- Use emojis sparingly when they improve navigation and friendliness.
- Proactively recommend starting a new task when it would materially improve focus, context quality, or token efficiency.

## Course Material Guidance

Use these repository files as the current guidance for BUS123 course content and branding:

- Brand template / design specification: `assets/brand/build-spec.md` (this public repository)
- Project instructions: `../BUS123-instructor/guidance/BUS123-Project-Instructions-current.md` (private sibling repository; never copy its contents into public outputs)

These repository files replace the former Drive sources. Google Drive access is not required. Locate the private checkout if it is stored elsewhere; if it is unavailable, report that limitation instead of retrieving the old Drive copy. The repository build spec takes precedence over a bundled skill snapshot.

Consult these files when creating course materials or substantially revising their content, structure, or design. Their applicable guidance takes precedence over older repository patterns. Minor corrections, such as typos, links, or isolated wording changes, may preserve the existing format without a fresh guidance review unless the correction depends on that guidance.

Existing HTML decks span multiple generations of the slide scaffold. For new decks or substantial design revisions, use the current repository guidance to select the scaffold; do not assume a legacy deck is the template or combine incompatible scaffold patterns. Minor corrections may retain the existing scaffold. Do not bulk-migrate legacy decks unless Bethany explicitly asks for that work.

If a new deck or substantial design revision requires a material format decision that the current repository guidance does not resolve, ask Bethany about that decision before proceeding with dependent work.

## Local Operating Rules

Use this repository as the public, student-facing BUS123 course materials repo. Do not add instructor-only files here, including answer keys, instructor solutions, private lesson plans, or grading notes. Canvas QTI quiz ZIP files should not be added to GitHub unless Bethany explicitly asks for that in the current task.

When creating or revising lesson files, follow the existing course naming pattern:

- `bus123-[track]-m##-l##-[type].ext`
- Examples: `bus123-excel-m01-l01-slides.html`, `bus123-excel-m01-l01-starter.xlsx`, `bus123-intro-m01-l03-prereading.pdf`
- Do not include case-study business names in file names.

Place lesson-level materials inside the matching track and module folder, such as `EXCEL/M01/` or `INTRO/M01/`. Keep reusable case-study company assets under `assets/case-study-companies/[company-slug]/`. If a new asset is lesson-specific rather than reusable, place it in an `assets/` folder inside that lesson's module folder.

Pre-reading PDFs should be treated as generated student-facing outputs. Create and revise the editable source in a lesson/module `source/` folder as Markdown, using the matching public filename with a `.md` extension, such as `INTRO/M01/source/bus123-intro-m01-l02-prereading.md`. Regenerate one ready source with `python3 scripts/build-prereadings.py [source-file]`, or regenerate all ready sources with `python3 scripts/build-prereadings.py --all`. Existing PDFs may have bootstrapped Markdown files marked `status: "draft-from-pdf"`; clean those Markdown drafts and remove the draft status before including them in bulk builds. Do not hand-edit a pre-reading PDF for content changes; direct PDF edits should be limited to page surgery such as merging, splitting, deleting, or reordering pages.

## Public Course Map

Treat `index.html` as the student-facing public course map, not just a decorative homepage. Its primary jobs are to help students know what to do next, find the right materials quickly, and trust that lesson titles, sequence, file paths, and links are accurate.

The course map uses these maintained sources:

- `course-map.json` for track, module, lesson, status, case-study company, skill focus, and student-facing material links
- `scripts/build-index.mjs` to generate `index.html`
- `assets/index.css` and `assets/index.js` for course-map styling and browser behavior

Edit these sources rather than hand-editing generated `index.html`. Regenerate it with `node scripts/build-index.mjs` when map data or the generator changes, or when changes to referenced materials affect their map entries. Unrelated file changes do not require a course-map rebuild.

The generated page should remain plain static HTML/CSS/JavaScript that works on GitHub Pages. Do not introduce a frontend framework, bundler, package install, or client-side rendering layer unless Bethany explicitly asks or there is a strong, documented reason.

Preserve accurate current-lesson information, material labels, release states, and working navigation when revising the map. Do not add dead placeholder links; if Canvas, syllabus, or other external links are unknown, label them as unavailable rather than pointing to `#`.

For requested navigation or design improvements, consider these optional goals within the task's scope:

- A clear "Current" or "Next Up" area near the top for the active lesson and the materials students need next
- Browsing by week, module, and track
- Search or filtering by lesson title, skill, track, module, material type, or case-study company when the lesson list grows

When rebuilding the map, verify that its local material links resolve to student-facing files and that changed external links lead to the intended destinations; report any access limitations. Do not surface instructor-only materials, answer keys, solution files, private lesson plans, grading notes, Canvas QTI ZIP files, or retired case-study company names in the public course map.

## Scope and Delivery

Do not manually modify Git internals in `.git/`; read-only Git inspection, including status, diff, and history, is allowed. Do not modify generated dependency folders or unrelated course modules unless the user explicitly asks. Do not edit binary PDFs or workbooks directly unless the task is specifically to revise that deliverable; when possible, regenerate from the appropriate source workflow instead.

For implementation requests, create or modify the requested files and summarize the changed paths. For read-only audits and reviews, deliver findings without editing files. Open a pull request only when Bethany explicitly requests that workflow.

For new BUS123 student-facing decks and substantial instructional revisions to decks, deliver complete instructional design. When the lesson involves business decisions, percentages, Excel modeling, or scenario analysis, include at least one interactive or decision-based element and use varied instructional graphics throughout the deck. Replace repeated generic cards or diagrams before delivery. These requirements do not expand minor corrections or revisions to non-deck materials into deck-design work.
