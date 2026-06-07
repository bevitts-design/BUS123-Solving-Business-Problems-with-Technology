---
title: "BUS 123 — MATH-M01-L01 — Whole Numbers, Fractions & Percents"
lesson: "MATH-M01-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M01/bus123-math-m01-l01-prereading.pdf"
---

<!--
  FORMATTING NOTE FOR INSTRUCTORS
  ─────────────────────────────────────────────────────────────────────────────
  This file is written in standard Markdown. To preserve all formatting:

  • Do NOT copy-paste into a plain text editor — use a Markdown-aware tool
    (VS Code, Typora, GitHub, Notion, or the Canvas rich-text editor in
    source/HTML mode).

  • All tables use the standard Markdown pipe-table format. GitHub, Canvas,
    and most LMS platforms render them as formatted tables automatically.

  • Callout blocks (> blockquote lines) render as indented/highlighted panels
    in most Markdown viewers and GitHub Pages.

  • To push to the public GitHub repo, place this file at:
    MATH/M01/bus123-math-m01-l01-prereading.md
    GitHub Pages will render it correctly with no additional configuration.
  ─────────────────────────────────────────────────────────────────────────────
-->

# BUS 123 · MATH-M01-L01 · Whole Numbers, Fractions & Percents

**Course:** Solving Business Problems with Technology · Fall 2026
**Track:** MATH · **Module:** M01 · **Lesson:** L01

---

## 1 · Connect to Prior Knowledge

This module is the mathematical foundation for everything that follows in BUS 123. Every formula you will build — markup percentages, payroll calculations, breakeven analysis, and loan math — starts with the skills you'll practice here: whole number operations, fraction-to-decimal conversion, and percent calculations.

Some of this should feel very familiar; for this class pay close attention to the **business context** and the **Excel approach**, which add layers that go beyond a standard algebra class.

Our case study company for this module is **Meridian Advisory Group**, a wealth management firm whose day-to-day operations generate exactly the kinds of arithmetic problems we will solve.

---

## 2 · Core Concepts

### Part A — Whole Number Operations

The four arithmetic operations — addition, subtraction, multiplication, and division — are the building blocks of business math. In a business context, each operation maps to a specific type of question:

| Operation          | Business Meaning                              | Excel Formula              |
|--------------------|-----------------------------------------------|----------------------------|
| **Addition**       | Summing revenue across accounts               | `=SUM(B2:B10)` or `=B2+B3` |
| **Subtraction**    | Net income = Revenue − Expenses               | `=B5 - C5`                 |
| **Multiplication** | Total fees = Accounts × Fee per account       | `=B3 * C3`                 |
| **Division**       | Per-client fee = Total ÷ Client count         | `=B7 / C7`                 |

**Worked Example — Meridian Advisory Group:**

Meridian begins Q3 with 48 client accounts, adds 12 new clients, and loses 3. The management fee is $4,200 per account per quarter.

- Quarter-end accounts: 48 + 12 − 3 = **57**
- Total quarterly fees: 57 × $4,200 = **$239,400**
- In Excel: `=B2+B3-B4` for the account count, then `=D5*C2` for total fees

Always reference cells rather than typing numbers directly into the formula.

> ⚠️ **Unit Mismatch Warning**
>
> Before multiplying, check that both numbers use the same unit and time period. Multiplying a quarterly account count by an annual fee rate gives a meaningless result. Label every column header with its unit (e.g., `Fee/Account/Quarter`) to catch this error early.

---

### Part B — Fractions in Context

A fraction expresses a part of a whole: the **numerator** is the piece being measured, and the **denominator** is the total universe. In business, fractions appear as staff allocations, market share figures, and service-line proportions.

Excel converts fractions to decimals automatically when you divide the numerator by the denominator; format the result cell as a percentage or fraction if needed.

**Worked Example — Meridian Advisory Group:**

Meridian's 6-person advisory team is split evenly: 2 advisors each in Tax, Estate Planning, and Investment Management.

- Each service line represents 2/6 = 1/3 ≈ **0.3333** of total capacity.
- If Meridian hires 3 more Tax advisors, the Tax team grows to 5 of 9 total advisors: 5/9 ≈ 0.5556 = **55.6%**.
- Note that the denominator changed from 6 to 9 — **you must use the new total in the denominator**.

> ✅ **Tip: The Denominator Is the Whole Universe**
>
> When the total changes (e.g., new hires), update the denominator before recalculating. Using an outdated denominator is one of the most common fraction errors in business analysis.

---

### Part C — Percent Calculations

A percent is a fraction expressed out of 100. Business math involves **three distinct percent calculations**, each requiring a different formula structure. Confusing them is a frequent source of errors:

| Operation               | Excel Formula              | What It Calculates                                          |
|-------------------------|----------------------------|-------------------------------------------------------------|
| **Case 1 — % of a Whole** | `=whole * rate`          | What is 15% of $239,400? → `=239400*0.15`                  |
| **Case 2 — % Change**   | `=(new − old) / old`       | Fees: $1.2M → $1.255M → `=(1255000-1200000)/1200000`       |
| **Case 3 — Ratio as %** | `=part / whole`            | 4 of 25 clients renewed → `=4/25` (format as %)            |

**Worked Example — Forward and Backward:**

Meridian earned $1,200,000 in AUM fees last year and projects a 7.5% increase.

- Projected fees: `=1200000*(1+0.075)` = **$1,290,000**
- Actual fees came in at $1,255,000
- Actual percent change: `=(1255000−1200000)/1200000` = **4.58%** — below the 7.5% target

In Excel, always use cell references: `=(B5-B4)/B4`. Format the result cell as **Percentage** — do not manually multiply by 100.

> ⚠️ **Common Mistake: % Change vs. % of Total**
>
> These are different formulas.
> - **% change** compares a value to its earlier self: `(New − Old) / Old`
> - **% of total** compares a part to a whole at one point in time: `Part / Whole`
>
> Ask yourself: am I measuring how something **changed over time**, or what **share** it represents of a bigger number?

---

## 3 · Formula Reference

| Operation          | Excel Formula              | What It Calculates                     |
|--------------------|----------------------------|----------------------------------------|
| SUM range          | `=SUM(B2:B10)`             | Add all values in a range              |
| Arithmetic ops     | `=B2+B3-B4`                | Add/subtract individual cells          |
| Multiply           | `=B3 * C3`                 | Qty × Price, Accounts × Fee            |
| Divide             | `=B7 / C7`                 | Total ÷ Count = per-unit               |
| Fraction → Decimal | `=B2 / C2`                 | Numerator ÷ Denominator                |
| % of Whole         | `=whole * rate`            | e.g., `=B4 * 0.15`                     |
| % Change           | `=(new - old) / old`       | Base = older number always             |
| Ratio as %         | `=part / whole`            | Format result as Percentage            |
| Grow by rate       | `=B4 * (1 + rate)`         | e.g., `=B4*(1+0.075)`                  |

---

## 4 · Check Your Understanding

Answer each question before looking at the answer key below. Show your Excel formula approach, not just the arithmetic result.

1. Meridian starts a quarter with 57 accounts and loses 4. What is the new account total? Write the Excel formula.

2. Total quarterly fee revenue was $239,400. Tax services generated $85,000 of that. What fraction — and what percent — of total fees came from Tax?

3. Meridian is targeting a 12% increase in total AUM fees from a base of $239,400/quarter. What is the quarterly fee target? Write the Excel formula.

4. Actual fees came in at $268,200. The prior quarter was $239,400. What was the percent change? Which formula case does this represent?

5. Meridian's Investment team of 2 advisors represents what fraction of a 9-person total team? Express as a decimal rounded to 4 places.

6. True or False: the denominator in a percent change calculation should always be the newer (larger) number.

7. Meridian runs 4 service lines. Two lines each have 15 clients, one has 18 clients, one has 9 clients. What percent of total clients does the line with 18 clients represent?

---

### Answer Key · Check Your Understanding

| # | Answer |
|---|--------|
| **1** | **53 accounts.** Excel: `=57-4` or `=B2-B3`. Unit check: both are counts of accounts. |
| **2** | Fraction: 85,000/239,400 ≈ **0.3551**. Percent: ≈ **35.51%**. Excel: `=85000/239400` → format as Percentage. This is Case 3 (ratio as %). |
| **3** | **$268,128.** Excel: `=239400*(1+0.12)` or `=B4*(1+0.12)`. This is Case 1 (% of whole, grow-by variant). |
| **4** | Percent change = (268,200 − 239,400) / 239,400 ≈ **12.03%.** Excel: `=(268200-239400)/239400`. This is Case 2 (% change). The base is the older number ($239,400). |
| **5** | 2/9 ≈ **0.2222.** Excel: `=2/9`. Note: the denominator is 9 (total team), not 6 (old team). |
| **6** | **False.** The denominator in a percent change calculation should always be the **older (earlier)** number. |
| **7** | 18 clients out of (15+15+18+9) = 57 total. 18/57 ≈ **31.58%.** Excel: `=18/57` → format as Percentage. This is Case 3. |

---

## 5 · Key Vocabulary

| Term                  | Definition                                                                                                                                                 |
|-----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Numerator**         | The top number in a fraction; represents the part being measured.                                                                                          |
| **Denominator**       | The bottom number in a fraction; represents the total or whole.                                                                                            |
| **Percent**           | A ratio expressed as a fraction out of 100. Written with the % symbol.                                                                                     |
| **Percent Change**    | A measure of how much a value has grown or declined relative to its starting point. Formula: `(New − Old) / Old`.                                          |
| **Percent of Total**  | A ratio comparing a part to the whole at a single point in time. Formula: `Part / Whole`.                                                                  |
| **Cell Reference**    | In Excel, using a cell address (e.g., `B4`) in a formula rather than typing a number directly, so the formula recalculates automatically when input changes. |
| **Unit Mismatch**     | An error that occurs when two values being multiplied or compared use different units or time periods (e.g., mixing annual and quarterly rates).             |
| **AUM Fees**          | Assets Under Management fees — revenue a financial advisory firm earns based on the total value of client assets it manages.                                |
