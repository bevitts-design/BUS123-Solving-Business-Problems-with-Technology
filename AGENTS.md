# Codex Project Guidance

This file is for Codex sessions working in this repository. Other AI tools may ignore it unless explicitly configured to use it.

Use these Drive files as the current source of truth for BUS123 work:

- Brand template: https://drive.google.com/file/d/1xty2pm0baSDRKKT1ncCyrVWJrD29cDfm
- Project instructions: https://docs.google.com/document/d/1OxAbv_Hpn7N8xT3Aw7YylfGPatpvmKLI4SZGk4_0m38/edit?usp=drivesdk

For new or revised course materials, follow the brand template and project instructions above. If these Drive files conflict with older patterns in the repository, treat the Drive files as the current guidance.

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

Do not touch `.git/`, generated dependency folders, or unrelated course modules unless the user explicitly asks. Do not edit binary PDFs or workbooks directly unless the task is specifically to revise that deliverable; when possible, regenerate from the appropriate source workflow instead.

For delivery, create or modify the requested files and summarize the changed paths. Do not commit, push, or open a pull request unless the user explicitly asks for that workflow.
