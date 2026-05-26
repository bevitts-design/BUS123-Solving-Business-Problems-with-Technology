# Excel Mission Workbench Template

Use this template when students need to practice small Excel moves inside a browser: selecting cells, entering labels and values, formatting cells, writing simple formulas, and checking the formula bar.

## Files

- `template.html`: copy this file into a lesson folder and rename it using the BUS123 naming pattern.
- `template.css`: reusable layout and worksheet styling for this activity type.
- `template.js`: reusable activity engine. Do not edit this for normal lesson activities.
- `../../shared/bus123-activity.css`: shared BUS123 activity colors, typography, buttons, reset style, toast, and reduced-motion support.

## Create A New Lesson Activity

1. Copy `activities/templates/excel-mission-workbench/template.html`.
2. Paste it into the lesson module folder, such as `EXCEL/M01/`.
3. Rename it with the course naming pattern, such as `bus123-excel-m01-l03-interactive.html`.
4. In the copied HTML file, update the stylesheet and script paths if needed.
5. Edit only the `window.BUS123_ACTIVITY` object near the bottom of the copied file.
6. Update `storageKey` so student progress for one activity does not collide with another.
7. Update the `meta` fields for the lesson title, company, subtitle, and worksheet title.
8. Update `sheet.columns`, `sheet.rows`, `resultCells`, `defaultHeaderCells`, and any `initialCells`.
9. Replace the `missions` with the lesson-specific tasks, hints, success messages, highlighted cells, and checks.
10. Open the copied HTML file in a browser and complete every mission as a student would.
11. Link the new activity from `index.html` as `Interactive practice`.

## Path Examples

For a copied file in `EXCEL/M01/`, these paths are correct:

```html
<link rel="stylesheet" href="../../activities/shared/bus123-activity.css">
<link rel="stylesheet" href="../../activities/templates/excel-mission-workbench/template.css">
<script src="../../activities/templates/excel-mission-workbench/template.js"></script>
```

For the original `template.html` file inside this folder, these paths are correct:

```html
<link rel="stylesheet" href="../../shared/bus123-activity.css">
<link rel="stylesheet" href="./template.css">
<script src="./template.js"></script>
```

## Supported Check Types

Each mission has a `checks` array. A mission is complete only when all checks pass.

```js
{ type: "activeCell", address: "C3" }
{ type: "formulaBarChecked" }
{ type: "cellText", address: "A2", equals: "Product" }
{ type: "cellNumber", address: "B3", equals: 24 }
{ type: "cellFormat", address: "C3", equals: "currency" }
{ type: "cellAlign", address: "B3", equals: "right" }
{ type: "cellBold", address: "A2", equals: true }
{ type: "headerFormatted", addresses: ["A2", "B2", "C2", "D2"], align: "center" }
{ type: "productFormula", address: "D3", first: "B3", second: "C3" }
```

## Initial Cells

Use `initialCells` when the activity should begin with labels, values, formulas, formatting, or locked cells already in place.

```js
initialCells: {
  A2: { value: "Product", bold: true, align: "center" },
  B2: { value: "Units", bold: true, align: "center" },
  C2: { value: "Unit Cost", bold: true, align: "center" },
  A3: { value: "Canvas Tote" },
  B3: { value: "24", align: "right" },
  C3: { value: "8.5", format: "currency", align: "right" },
  D3: { formula: "=B3*C3", format: "currency", locked: true }
}
```

## Good Template Habits

- Keep the copied lesson file student-facing only.
- Do not put answer keys, grading notes, or instructor-only comments in the public activity.
- Make each mission short enough that students can complete it in class.
- Write hints that teach the next move rather than simply giving away the answer.
- Test with keyboard navigation: click a cell, type, press Enter/Tab/arrows, and use the formula bar.
