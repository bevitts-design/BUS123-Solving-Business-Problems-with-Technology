# Codex Project Guidance

This file is for Codex sessions working in this repository. Other AI tools may ignore it unless explicitly configured to use it.

Use these Drive files as the current source of truth for BUS123 work:

- Brand template: https://drive.google.com/file/d/1xty2pm0baSDRKKT1ncCyrVWJrD29cDfm
- Project instructions: https://docs.google.com/document/d/1OxAbv_Hpn7N8xT3Aw7YylfGPatpvmKLI4SZGk4_0m38/edit?usp=drivesdk

For new or revised course materials, follow the brand template and project instructions above. If these Drive files conflict with older patterns in the repository, treat the Drive files as the current guidance.

Existing HTML decks in this repository span multiple generations of the slide scaffold and should be treated as legacy deliverables, not as templates for new work. Do not copy an older deck's fonts, authored dimensions, navigation scripts, external scaffold imports, inline scaffold code, or Tweaks panel behavior into a new or revised deck unless the current Drive guidance explicitly requires that pattern. Do not bulk-migrate legacy decks unless Bethany explicitly asks for that work.

When the Drive brand template and project instructions are being revised, avoid filling gaps by combining incompatible scaffold patterns. If the current Drive files do not clearly resolve a deck-format decision, ask Bethany before building or substantially revising a slide deck.

## Local Operating Rules

Use this repository as the public, student-facing BUS123 course materials repo. Do not add instructor-only files here, including answer keys, instructor solutions, private lesson plans, or grading notes. Canvas QTI quiz ZIP files should not be added to GitHub unless Bethany explicitly asks for that in the current task.

When creating or revising lesson files, follow the existing course naming pattern:

- `bus123-[track]-m##-l##-[type].ext`
- Examples: `bus123-excel-m01-l01-slides.html`, `bus123-excel-m01-l01-starter.xlsx`, `bus123-intro-m01-l03-prereading.pdf`
- Do not include case-study business names in file names.

Place lesson-level materials inside the matching track and module folder, such as `EXCEL/M01/` or `INTRO/M01/`. Keep reusable case-study company assets under `assets/case-study-companies/[company-slug]/`. If a new asset is lesson-specific rather than reusable, place it in an `assets/` folder inside that lesson's module folder.

Expected public-facing lesson materials may include:

- HTML slide decks
- Student starter Excel workbooks
- Pre-reading PDFs
- Homework PDFs for students
- Student-facing interactive HTML activities
- Reusable or lesson-specific visual assets

Pre-reading PDFs should be treated as generated student-facing outputs. Create and revise the editable source in a lesson/module `source/` folder as Markdown, using the matching public filename with a `.md` extension, such as `INTRO/M01/source/bus123-intro-m01-l02-prereading.md`. Regenerate one ready source with `python3 scripts/build-prereadings.py [source-file]`, or regenerate all ready sources with `python3 scripts/build-prereadings.py --all`. Existing PDFs may have bootstrapped Markdown files marked `status: "draft-from-pdf"`; clean those Markdown drafts and remove the draft status before including them in bulk builds. Do not hand-edit a pre-reading PDF for content changes; direct PDF edits should be limited to page surgery such as merging, splitting, deleting, or reordering pages.

## Public Course Map

Treat `index.html` as the student-facing public course map, not just a decorative homepage. Its primary jobs are to help students know what to do next, find the right materials quickly, and trust that lesson titles, sequence, file paths, and links are accurate.

When revising the course map, prefer a static, data-driven setup over hand-maintaining all lesson cards directly in `index.html`. A recommended structure is:

- `course-map.json` for track, module, lesson, status, case-study company, skill focus, and student-facing material links
- `scripts/build-index.mjs` or a similar lightweight build script to regenerate `index.html`
- Separate cacheable assets such as `assets/index.css` and `assets/index.js` when the page becomes large enough to benefit from them

The generated page should remain plain static HTML/CSS/JavaScript that works on GitHub Pages. Do not introduce a frontend framework, bundler, package install, or client-side rendering layer unless Bethany explicitly asks or there is a strong, documented reason.

Prioritize student learning and navigation over visual novelty. A strong course map should include or support:

- A clear "Current" or "Next Up" area near the top for the active lesson and the materials students need next
- Browsing by week, module, and track
- Material-type labels such as Slides, Reading, Starter Workbook, Interactive Practice, Homework, and Canvas
- Search or filtering by lesson title, skill, track, module, material type, or case-study company when the lesson list grows
- Clear release states such as Live, Coming Soon, In Progress, Canvas Only, or Not Released
- No dead placeholder links; if Canvas, syllabus, or other external links are unknown, label them as unavailable rather than pointing to `#`

Whenever lesson titles, lesson numbers, sequence, file paths, or student-facing links change, update the course-map source data and regenerate `index.html` before delivery. Verify that all public links in the generated index resolve to files that should be student-facing. Do not surface instructor-only materials, answer keys, solution files, private lesson plans, grading notes, Canvas QTI ZIP files, or retired case-study company names in the public course map.

Do not touch `.git/`, generated dependency folders, or unrelated course modules unless the user explicitly asks. Do not edit binary PDFs or workbooks directly unless the task is specifically to revise that deliverable; when possible, regenerate from the appropriate source workflow instead.

For delivery, create or modify the requested files and summarize the changed paths. Do not commit, push, or open a pull request unless the user explicitly asks for that workflow.

For BUS123 student-facing materials, avoid “content-only” first passes. Whenever the lesson involves business decisions, percentages, Excel modeling, or scenario analysis, include at least one interactive or decision-based element and use varied instructional graphics throughout the deck. Repeated generic cards or diagrams should be treated as placeholders and replaced before delivery.
