# BUS123 Pre-Reading Workflow

Pre-reading PDFs are student-facing outputs. Markdown files in lesson/module `source/` folders are the editable source.

Accessibility is a release requirement, not an optional cleanup step. A PDF that renders correctly or contains extractable text is not necessarily accessible. Do not describe a pre-reading as ADA compliant, WCAG conformant, Section 508 conformant, or PDF/UA conformant unless it has passed the accessibility checks in this workflow.

## Accessibility Standard

Use WCAG 2.1 Level AA as the minimum content benchmark and properly tagged PDF as the required PDF structure. PDF/UA should be used as the technical target when the production toolchain supports it.

Every released pre-reading must provide:

- A meaningful document title and declared document language.
- Proper PDF tags for headings, paragraphs, lists, links, tables, and other structural elements.
- A logical tag and screen-reader reading order.
- Heading levels that form a logical outline without skipped levels.
- Real list and table structures rather than spaces or visual positioning used to imply structure.
- Header cells and associations for data tables.
- Alternative text for meaningful images, charts, diagrams, and instructional graphics; decorative images must be marked as artifacts.
- Descriptive link text instead of raw URLs or vague phrases such as “click here.”
- Sufficient color contrast, with meaning never communicated by color alone.
- Text that can be enlarged or reflowed without loss of content or meaning.
- Accessible mathematical expressions and symbols that are read correctly by assistive technology.
- No scanned or image-only instructional text unless accurate OCR and tags are supplied.

The current `scripts/build-prereadings.py` ReportLab pipeline creates visually formatted PDFs but does not create a PDF structure tree or fully tagged PDF output. Therefore, running the build command alone does **not** satisfy this accessibility standard. Until the generator is replaced or extended, generated PDFs require remediation in a tool capable of producing tagged PDF, followed by the verification steps below.

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

4. Remediate and verify the generated PDF according to **Accessibility Verification** below. Do not release an untagged build as accessibility-compliant.

5. If the reading is linked in `course-map.json`, rebuild the index:

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

## Accessible Source Authoring

Accessibility begins in the Markdown source. Before building:

1. Use one `#` heading for the document title, followed by logical `##` and `###` headings.
2. Use Markdown list syntax for lists and Markdown table syntax only for genuine tabular data.
3. Give every meaningful image concise alternative text. Use empty alternative text only for decorative images.
4. Write descriptive link labels that make sense out of context.
5. Explain charts, visual patterns, and color-coded information in the surrounding text.
6. Write equations in a form that remains understandable when read linearly. Include a plain-language explanation when notation alone may be ambiguous.
7. Avoid instructions based only on visual position, shape, or color, such as “use the green box on the right.”

## Accessibility Verification

Accessibility verification is required after the final PDF is generated or remediated. Record the result in the task notes or delivery summary.

### Automated and structural checks

- Confirm the PDF reports `Tagged PDF: Yes`.
- Confirm a document title and primary language are set.
- Run an accessibility checker such as PAC or Adobe Acrobat Pro Accessibility Check.
- Resolve all failed checks; manually review every item marked as requiring human inspection.
- Confirm fonts permit text extraction and content copying for accessibility.
- Verify that links are tagged and have meaningful accessible names.

### Manual checks

- Inspect the tags tree for correct headings, lists, tables, figures, and artifacts.
- Verify the reading order from the tags tree, not only the visual page order.
- Read the complete document with a screen reader such as NVDA, JAWS, or VoiceOver.
- Navigate by headings and links and confirm that labels make sense out of context.
- Check tables cell by cell with a screen reader.
- Confirm image alternative text communicates the instructional purpose.
- Test at 200% zoom and inspect for clipping, overlap, or lost information.
- Check text and meaningful graphical contrast against WCAG 2.1 AA thresholds.

### Release decision

Use one of these statuses in the delivery summary:

- **Accessibility verified**: automated and manual checks passed, including screen-reader review.
- **Accessibility remediation required**: the PDF contains known failures and must not be represented as compliant.
- **Visual QA only**: appearance was checked, but accessibility was not verified.

If an accessible PDF cannot yet be produced, keep the structured Markdown or an accessible HTML rendering available as an interim accommodation and clearly disclose that the PDF still requires remediation. An alternate format does not automatically make an inaccessible PDF compliant.
