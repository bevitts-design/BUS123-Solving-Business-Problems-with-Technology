# BUS123 Pre-Reading Workflow

Pre-reading PDFs are student-facing outputs. Markdown files in lesson/module `source/` folders are the editable source.

## New Pre-Readings

1. Create a Markdown source beside the lesson folder, for example:

   `MATH/M11/source/bus123-math-m11-l01-prereading.md`

2. Include frontmatter:

   ```md
   ---
   title: "Lesson Title"
   lesson: "MATH-M11-L01"
   kind: "Pre-Reading"
   output: "MATH/M11/bus123-math-m11-l01-prereading.pdf"
   ---
   ```

3. Build the PDF:

   ```bash
   python3 scripts/build-prereadings.py MATH/M11/source/bus123-math-m11-l01-prereading.md
   ```

4. If the reading is linked in `course-map.json`, rebuild the index:

   ```bash
   node scripts/build-index.mjs
   ```

## Existing Pre-Readings

Existing PDFs were bootstrapped into Markdown with:

```bash
python3 scripts/build-prereadings.py --init-from-pdfs
```

Those sources are marked:

```md
status: "draft-from-pdf"
```

PDF extraction preserves text, but it cannot reliably preserve tables, callouts, or section breaks. Before using a bootstrapped source as the official editable source, clean the Markdown and remove the `status: "draft-from-pdf"` line.

`--all` skips draft-from-PDF sources by default:

```bash
python3 scripts/build-prereadings.py --all
```

To deliberately preview draft output, build a specific draft file or pass `--include-drafts`.
