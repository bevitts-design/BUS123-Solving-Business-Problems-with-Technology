# BUS123 · EXCEL-M04-L01 Pre-Reading
## Getting Data, Charts & Visualization

*Solving Business Problems with Technology · Gerrish School of Business · Fall 2026*

---

## Connect to What You Know

In Module 3 you learned to make Excel do the math for you — SUM, AVERAGE, COUNT, MIN, and MAX — and to organize data in proper Excel Tables with sorting and filtering. That gave you accurate numbers. But here's the problem: accurate numbers sitting in a grid don't communicate. When Harborside Medical Center's CFO asks "which insurance categories drove our revenue last quarter?", nobody wants to squint at four rows of seven-digit figures. They want to *see* the answer. This module is the bridge from calculation to communication: getting data into Excel cleanly, and turning it into charts that answer business questions at a glance.

---

## Part 1 · Getting Data In (and Getting It Clean)

Real business data rarely arrives ready to use. It comes as printed reports, screenshots, CSV exports, and one giant column of text. Excel gives you three fast tools for turning that mess into a structured table.

### The foundation: a clean table

Before any chart can be built, your data must follow the structural rules you learned in M03:

- **Header row first.** Descriptive labels in Row 1, each starting with a letter (never a number), and each one unique.
- **One data type per column.** Don't mix text and currency in the same field.
- **No blank rows.** A blank row tells Excel your data is finished — anything below the gap gets ignored by sorting, filtering, and charting.
- **Keep the table isolated.** Leave at least one blank row and column between your table and anything else on the worksheet, so Excel can find the table's boundaries automatically.

### Tool 1 — Flash Fill (`Ctrl + E`)

Flash Fill is pattern recognition. Suppose Harborside's staff roster arrives with "Priya Nair" in one column, but payroll needs first and last names separated. Type **Priya** in the adjacent column, start typing the second name, and Excel shows a ghost preview of the whole column filled in. Press **Enter** (or `Ctrl + E`) and it's done — no formula required.

**The catch:** Flash Fill follows the pattern it sees. If your data is inconsistent (some rows "Last, First" and some "First Last"), the pattern breaks. For messy data, text functions like LEFT, RIGHT, MID, and LEN give you logical precision that holds up no matter what new rows arrive.

### Tool 2 — Text to Columns

When a CSV export dumps `Nair, Priya, RN, 40` into a single cell, the **Text to Columns** wizard (Data tab → Data Tools) splits it apart. You choose:

- **Delimited** — split wherever a specific character appears (comma, tab, semicolon)
- **Fixed Width** — split at set positions when the data is aligned in columns

### Tool 3 — Data from Picture

Got a *printed* report or a screenshot of a table? **Data → Get & Transform Data → From Picture** uses optical character recognition (OCR) to convert the image into editable cells. You can pull from a saved image file or directly from your clipboard after a screen capture. It requires a Microsoft 365 subscription — which you have through Endicott.

> **Why this matters:** every minute spent structuring data correctly saves five minutes of debugging a broken chart later. Dirty data — typos, mixed formats, blank rows — is a systemic toxin that quietly corrupts every calculation and chart built on top of it.

---

## Part 2 · Choosing the Right Chart

The single most important idea in this lesson: **chart type is a logic choice, not a style choice.** Each chart type answers one kind of question. Pick the wrong one and you don't just look sloppy — you actively mislead your audience.

Before inserting anything, ask: **"What am I showing?"**

| What you're showing | Chart to use | Why it works |
|---|---|---|
| Comparing values across categories | **Column / Bar** | Height or length = magnitude; the eye reads it instantly. Use Bar (horizontal) when category labels are long. |
| Change over time | **Line** | Connects the dots to reveal trend and momentum across months, quarters, or years. |
| Parts of a whole (2–4 pieces) | **Pie / Donut** | Shows proportional contribution. Always add data labels — the eye can't judge arc sizes accurately. |
| Relationship between two numeric variables | **XY Scatter** | The only chart that spaces the X-axis by actual numeric value, not equal intervals. |
| Multi-level hierarchy | **Treemap** | Nested rectangles sized by value — far easier to compare than circular slices. |

### Two warnings worth memorizing

**The pie chart trap.** Pie charts work for 2–4 slices, period. Nine payer sub-categories in a pie becomes a ring of unreadable wedges. Consolidate small categories into "Other," or switch to a column chart.

**The line chart trap.** A line chart treats X-axis values as equally spaced *labels*, even when they aren't equally spaced *numbers*. Plot boiling times for 100ml, 200ml, 500ml, and 1000ml of water on a line chart and Excel spaces them evenly — visually lying about the rate of change. When your X-axis is numeric with unequal intervals, use an **XY Scatter** instead.

### Not sure? Use the safety net

**Insert → Recommended Charts** analyzes your selected data and suggests appropriate chart types. It's a good validation step: if your intended chart type isn't in the recommendations, double-check your logic.

---

## Part 3 · Polishing — From Classroom Chart to Boardroom Chart

A default Excel chart is a draft, not a deliverable. Three finishing moves:

1. **Title everything.** A chart title that states the takeaway ("Q3 Revenue by Payer Category") and a labeled value axis ("Revenue ($)").
2. **Delete the clutter.** Remove gridlines, drop the legend when there's only one data series, and resist 3D effects entirely.
3. **Let conditional formatting audit your data.** Apply a color scale to a numeric column *before* charting it. Outliers light up instantly — at Harborside, an average ICU bill of $38,200 against a hospital-wide range of $980–$12,400 jumps out in red, prompting a data-entry check before that number reaches the board. Find it at **Home → Styles → Conditional Formatting**.

---

## Formula & Tool Reference

| Need | Excel approach (use this first) | Manual math (understanding only) |
|---|---|---|
| Total of a range | `=SUM(range)` | value₁ + value₂ + value₃ … |
| Average of a range | `=AVERAGE(range)` | sum of values ÷ count of values |
| Largest / smallest value | `=MAX(range)` / `=MIN(range)` | scan the list |
| Average bill per visit | `=Revenue/Visits` | total revenue ÷ number of visits |
| Percent of total | `=Part/$Total$` (lock the total) | category value ÷ grand total |
| Percent change | `=(New-Old)/Old` | change amount ÷ starting value |
| Split names by pattern | `Ctrl + E` (Flash Fill) | — |
| Split a delimited column | Data → Text to Columns | — |
| Image of a table → cells | Data → From Picture | — |

---

## Check Your Understanding

1. Harborside's CFO wants to compare Q3 revenue across four insurance categories. Which chart type should you build, and why?
2. You receive a CSV where every row landed in column A as `"ED, 4812, 1820"`. Which tool splits this into three columns, and which option (Delimited or Fixed Width) applies?
3. What happens to sorting, filtering, and charts when a blank row sits in the middle of your data?
4. A classmate builds a pie chart with nine slices. Give two ways to fix it.
5. Why is Flash Fill risky when source data is inconsistently formatted — and what's the more reliable alternative?
6. You're plotting delivery cost against package weights of 1 lb, 5 lb, 20 lb, and 100 lb. Why is a line chart the wrong choice, and what should you use instead?
7. What business purpose does conditional formatting serve *beyond* making a worksheet look nice?

---

## Answer Key

1. **A column (or bar) chart** — the question compares discrete values across categories, and column height communicates magnitude instantly. A line chart would falsely imply a trend connecting the categories.
2. **Text to Columns** (Data tab → Data Tools), using the **Delimited** option with comma as the delimiter.
3. Excel treats the blank row as the end of the dataset — everything below the gap is excluded from sorts, filters, and chart ranges.
4. Consolidate the smallest categories into a single "Other" slice to get down to 2–4 slices, **or** switch to a clustered column chart, which handles many categories cleanly. (Adding data labels helps but doesn't fix the core problem.)
5. Flash Fill copies the pattern in your examples; inconsistent source rows break the pattern and produce silent errors. Text functions (LEFT, RIGHT, MID, LEN) apply explicit logic that works on every row regardless of inconsistency.
6. A line chart spaces X-axis points equally even though 1, 5, 20, and 100 are not equal intervals — visually distorting the relationship. Use an **XY Scatter**, which positions points by their true numeric value.
7. It acts as a **visual audit**: color scales and highlight rules surface outliers and data-entry errors instantly (an extra digit, a misplaced decimal) before flawed numbers flow into reports and decisions.

---

## Key Vocabulary

| Term | Definition |
|---|---|
| **Flash Fill** | Pattern-recognition tool (`Ctrl + E`) that fills a column based on one or two typed examples. |
| **Text to Columns** | Wizard that splits one column into several using a delimiter or fixed widths. |
| **Data from Picture** | OCR feature that converts an image or screenshot of a table into editable cells. |
| **Delimiter** | The character (comma, tab, semicolon) that separates values in a text file or cell. |
| **Column chart** | Vertical chart comparing discrete values across categories by bar height. |
| **Line chart** | Chart connecting data points to show change over time; spaces X-axis points equally. |
| **XY Scatter** | Chart plotting two numeric variables with true numeric spacing on both axes. |
| **Data labels** | Values printed directly on chart elements — required on every pie/donut chart. |
| **Conditional formatting** | Rules that change a cell's appearance based on its value; used as a visual audit tool. |
| **Recommended Charts** | Excel feature that analyzes selected data and suggests appropriate chart types. |

---

*Bring questions to class — we'll build all three chart types live using Harborside Medical Center's Q3 data.*
