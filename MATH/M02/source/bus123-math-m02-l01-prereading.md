---
title: "BUS 123 — MATH-M02-L01 — Solving Equations"
lesson: "MATH-M02-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M02/bus123-math-m02-l01-prereading.pdf"
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
    MATH/M02/bus123-math-m02-l01-prereading.md
    GitHub Pages will render it correctly with no additional configuration.
  ─────────────────────────────────────────────────────────────────────────────
-->

# BUS 123 · MATH-M02-L01 · Solving Equations

**Course:** Solving Business Problems with Technology · Fall 2026
**Track:** MATH · **Module:** M02 · **Lesson:** L01
**Case Study Company:** Anchor & Oak Events

---

## 1 · Connect to Prior Knowledge

In the previous module you built basic formulas — translating business sentences like *Revenue = Price × Quantity* into symbolic expressions. Every formula you wrote was an equation with a known output. That's a powerful starting point.

But in real business decisions, **the output is often what you know and one of the inputs is what you need to find.** If you know an event earned $4,080 in catering revenue from 60 guests, you can solve for the per-person rate. If you know Anchor & Oak can afford $7,300 in fixed costs, you can check whether a venue is in budget.

Solving equations is the technique that makes formulas work in both directions — and it underpins every financial model you will build this semester.

---

## 2 · Core Concepts

### The Balanced Scale Model

An equation is a statement that two expressions are equal. The equal sign is a fulcrum — a perfectly balanced scale. The **Golden Rule** of algebra follows directly from this image: whatever operation you apply to one side, you must apply to the other. If you add 50 to the left side without adding 50 to the right, the scale tips and the equation is no longer true.

> **Golden Rule: Whatever you do to one side of an equation, you MUST do to the other side. No exceptions.**

---

### Type 1 — One-Step Equations

A one-step equation has exactly one operation separating the variable from its value. The solve strategy is a single **inverse operation** — the opposite of what was done to the variable.

| Form              | Inverse Operation                    | Result     |
|-------------------|--------------------------------------|------------|
| `x + a = b`       | Subtract `a` from both sides         | `x = b - a` |
| `x - a = b`       | Add `a` to both sides                | `x = b + a` |
| `a * x = b`       | Divide both sides by `a`             | `x = b / a` |
| `x / a = b`       | Multiply both sides by `a`           | `x = b * a` |

**Worked Example — Anchor & Oak Events:**

Anchor & Oak budgeted $4,200 for floral arrangements. After booking three weddings, $1,650 remains. How much did the three weddings cost?

- The unknown is the total wedding floral cost (`x`).
- It was subtracted from the budget to leave the remainder: `x + 1,650 = 4,200`
- Subtract 1,650 from both sides: **x = 2,550**

The three weddings cost $2,550 combined.

---

### Type 2 — Two-Step Equations

Two-step equations require two inverse operations. The standard form is `ax + b = c`. The solve order is always: **undo addition or subtraction first, then undo multiplication or division.** This is the reverse of the standard order of operations — because building the equation applied multiplication before addition, solving it undoes addition before multiplication.

| Step | Operation                         | Result           |
|------|-----------------------------------|------------------|
| 1    | Subtract `b` from both sides      | `ax = c - b`     |
| 2    | Divide both sides by `a`          | `x = (c - b) / a` |

**Worked Example — Anchor & Oak Events:**

A coordinator earned $1,240 total in a week. The week included $120 in base pay and 8 overtime hours at an unknown rate.

- Equation: `8x + 120 = 1,240`
- Step 1 — subtract 120: `8x = 1,120`
- Step 2 — divide by 8: **x = 140**

The overtime hourly rate is $140.

---

### Type 3 — Variables on Both Sides

When the unknown variable appears on both sides of the equal sign, the first task is to **collect all variable terms on one side** before solving. The standard move is to subtract the smaller variable term from both sides — this keeps the remaining coefficient positive and reduces arithmetic errors. Once the variable is on one side only, the problem reduces to a two-step equation.

| Step | Operation                                      | Result                     |
|------|------------------------------------------------|----------------------------|
| 1    | Subtract smaller variable term from both sides | `(a - c)x + b = d`         |
| 2    | Subtract `b` from both sides                   | `(a - c)x = d - b`         |
| 3    | Divide by `(a - c)`                            | `x = (d - b) / (a - c)`    |

**Worked Example — Anchor & Oak Events:**

Comparing two tent vendors: Vendor A charges $500 flat plus $25 per guest; Vendor B charges $200 flat plus $40 per guest. At how many guests are the costs equal?

- Equation: `500 + 25g = 200 + 40g`
- Subtract 25g from both sides: `500 = 200 + 15g`
- Subtract 200: `300 = 15g`
- Divide by 15: **g = 20**

At exactly 20 guests, both vendors charge the same amount ($1,000).

---

### Type 4 — Literal Equations and Formula Rearrangement

A **literal equation** contains two or more variables, like `P = R - C` (Profit = Revenue minus Costs). Solving a literal equation means isolating one specific variable while treating all others as constants. The exact same inverse operation rules apply — the only difference is that letters stand in for numbers you haven't specified yet.

This skill is the foundation of every formula rearrangement you will do in TVM, break-even analysis, markup/markdown, and loan math.

| Formula        | Solve For | Steps                             | Result          |
|----------------|-----------|-----------------------------------|-----------------|
| `R = VC + FC`  | `FC`      | Subtract VC from both sides       | `FC = R - VC`   |
| `R = VC + FC`  | `VC`      | Subtract FC from both sides       | `VC = R - FC`   |
| `P = R - C`    | `R`       | Add C to both sides               | `R = P + C`     |
| `P = R - C`    | `C`       | Add P to both sides, swap         | `C = R - P`     |

**Worked Example — Anchor & Oak Events:**

A corporate gala has projected revenue of $18,500. Variable costs (catering, staffing, linens) total $11,200.

- Using `FC = R - VC`: FC = 18,500 − 11,200 = **$7,300**
- Anchor & Oak can spend up to $7,300 on fixed costs (venue, permits, equipment) and still break even. Any fixed cost above $7,300 generates a loss.

---

## 3 · Formula Reference

| Equation Type          | Standard Form         | Solve Strategy                        | Result               |
|------------------------|-----------------------|---------------------------------------|----------------------|
| One-Step (add)         | `x + a = b`           | Subtract `a` from both sides          | `x = b - a`          |
| One-Step (multiply)    | `a · x = b`           | Divide both sides by `a`              | `x = b / a`          |
| Two-Step               | `a · x + b = c`       | 1. Subtract `b` · 2. Divide by `a`    | `x = (c - b) / a`    |
| Both Sides             | `ax + b = cx + d`     | 1. Collect var terms · 2. Two-step    | `x = (d - b) / (a - c)` |
| Literal                | `R = VC + FC`         | Isolate target variable               | `FC = R - VC`        |

---

## 4 · Check Your Understanding

Answer each question before looking at the answer key below. Show your equation setup — graders check the setup, not just the final number.

1. What is the Golden Rule of equation solving?
2. Solve: `x + 480 = 1,250`. What is `x`?
3. Solve: `12x = 900`. What is `x`?
4. Solve: `5x + 75 = 450`. What is `x`?
5. Solve: `400 + 30n = 100 + 60n`. What is `n`?
6. Using `FC = R - VC`, if R = $22,400 and VC = $14,900, what is FC?
7. Anchor & Oak earned $5,400 on a private dinner. Labor cost $28/hour and the event lasted 15 hours. The remaining revenue covers venue and supplies. Write and solve the equation to find non-labor revenue.

---

### Answer Key · Check Your Understanding

| # | Answer |
|---|--------|
| **1** | Whatever operation you apply to one side of an equation, you must apply to the other side. |
| **2** | `x = 1,250 − 480` = **770** |
| **3** | `x = 900 / 12` = **75** |
| **4** | Step 1: `5x = 450 − 75 = 375`. Step 2: `x = 375 / 5` = **75** |
| **5** | Subtract 30n from both sides: `400 = 100 + 30n`. Subtract 100: `300 = 30n`. Divide: **n = 10** |
| **6** | `FC = 22,400 − 14,900` = **$7,500** |
| **7** | Total revenue = $5,400. Labor = $28 × 15 = $420. Equation: `x + 420 = 5,400`. **x = $4,980** (non-labor revenue) |

---

## 5 · Key Vocabulary

| Term                  | Definition                                                                                                                              |
|-----------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| **Equation**          | A mathematical statement that two expressions are equal, connected by an equal sign.                                                    |
| **Variable**          | A letter (e.g., x, n, g) representing an unknown quantity to be solved for.                                                             |
| **Inverse Operation** | The operation that undoes another: addition undoes subtraction; multiplication undoes division.                                          |
| **One-Step Equation** | An equation requiring exactly one inverse operation to isolate the variable.                                                             |
| **Two-Step Equation** | An equation requiring two inverse operations, applied in reverse order of operations.                                                   |
| **Literal Equation**  | An equation containing two or more variables; solved by isolating one variable while treating others as constants.                       |
| **Break-Even**        | The point at which total revenue equals total costs, yielding zero profit.                                                              |
| **Coefficient**       | The numerical factor multiplied by a variable (e.g., in `8x`, the coefficient is 8).                                                   |

---

> 📝 **Before Next Class**
>
> During class, use the `Live You Try It` tab for the short Excel pauses after worked examples. Before the next checkpoint, complete the `Class Challenge` tab as the graded or next-level activity. Write your equation setup before solving so your process is visible, not just the final number.
