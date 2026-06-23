---
title: "BUS 123 — MATH-M09-L01 — Compound Interest & Future Value"
lesson: "MATH-M09-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M09/bus123-math-m09-l01-prereading.pdf"
---

# BUS123 · MATH-M09 · L01 Pre-Reading
## Compound Interest & Future Value

**Course:** Solving Business Problems with Technology · BUS123
**Track:** MATH · Module 09 · Lesson 01
**Semester:** Fall 2026 · Gerrish School of Business, Endicott College
**Case Study Company:** Meridian Advisory Group *(fictional — all data simulated for instructional purposes)*

---

## Connect to Prior Knowledge

In M08 we worked with simple interest — a flat, linear amount earned only on the original principal. The ending balance grew by the same dollar amount every period: if $1,000 earns 5% simple interest, it adds exactly $50 per year, every year. The growth is predictable and constant.

Today that changes. **Compound interest** earns interest on the accumulated balance, not just the original principal. In year one the result is identical. In year two, the interest from year one has itself started earning — so the growth amount is slightly larger. By year 30, the difference is dramatic. This is the mathematical engine behind every savings account, investment portfolio, and retirement fund — and it is why starting to save early matters far more than most people realize.

---

## Core Concepts

### Part A — Simple vs. Compound: The Structural Difference

The formulas look similar but behave completely differently over time:

| | Simple Interest | Compound Interest |
|---|---|---|
| **Interest earns on** | Original principal only | Accumulated balance (principal + prior interest) |
| **Growth shape** | Linear — same dollar amount every period | Exponential — growing amount every period |
| **Formula** | FV = P × (1 + R × T) | FV = PV × (1 + i)ⁿ |
| **Excel function** | No built-in function — build directly | `=FV(rate, nper, 0, −pv)` |

The key structural change is the **exponent** n. In simple interest, time multiplies: (1 + R × T). In compound interest, time is an exponent: (1 + i)ⁿ. That one change — from multiplication to exponentiation — is what creates exponential growth.

**$1,000 at 5%: how the two methods diverge over time**

| Year | Simple Interest | Compound Interest | Difference |
|---|---|---|---|
| 1 | $1,050.00 | $1,050.00 | $0.00 |
| 2 | $1,100.00 | $1,102.50 | $2.50 |
| 3 | $1,150.00 | $1,157.63 | $7.63 |
| 5 | $1,250.00 | $1,276.28 | $26.28 |
| 10 | $1,500.00 | $1,628.89 | $128.89 |
| 30 | $2,500.00 | $4,321.94 | **$1,821.94** |

Year 1: identical. Year 30: compound interest produces 73% more than simple interest — with the same rate and the same principal. This is the **snowball effect**: each year's interest rolls forward and increases the base for the next calculation.

---

### Part B — The Compound Interest Formula

**Formula:** `FV = PV × (1 + i)^n`

| Variable | Name | Definition |
|---|---|---|
| **FV** | Future Value | The ending balance after compounding |
| **PV** | Present Value | The starting principal today |
| **i** | Rate per period | Annual rate ÷ compounding periods per year |
| **n** | Number of periods | Years × compounding periods per year |

> ⚠️ **Critical Rule: i and n must refer to the same unit of time.**
>
> If you compound annually, i = annual rate and n = years. If you compound monthly, i = annual rate ÷ 12 and n = years × 12. Mixing units — using an annual rate with monthly periods — produces wildly inflated results. This is the single most common compound interest error.

**Worked Example — Meridian Advisory Group:**
A client deposits $40,000 at 4% compounded annually for 3 years.

- `FV = $40,000 × (1.04)³`
- `FV = $40,000 × 1.124864`
- `FV = $44,994.56`

Simple interest over the same period: $40,000 × (1 + 0.04 × 3) = $44,800. Compound interest adds an extra $194.56 — earned entirely from interest-on-interest over three years.

---

### Part C — Non-Annual Compounding

When interest compounds more frequently than once per year, **both rate and nper must be adjusted** to match the compounding period. The annual rate alone is not sufficient.

| Compounding | Rate per period | Number of periods |
|---|---|---|
| Annually | R ÷ 1 | Years × 1 |
| Semiannually | R ÷ 2 | Years × 2 |
| Quarterly | R ÷ 4 | Years × 4 |
| Monthly | R ÷ 12 | Years × 12 |

**$25,000 at 6% for 5 years — what compounding frequency does:**

| Frequency | rate arg | nper arg | FV |
|---|---|---|---|
| Annually | 6% | 5 | $33,455.64 |
| Quarterly | 1.5% | 20 | $33,672.54 |
| Monthly | 0.5% | 60 | $33,725.46 |

More frequent compounding always produces a higher ending balance, because interest starts earning interest sooner. The practical difference between annual and monthly compounding on a $25,000 investment over 5 years is $269.82 — not enormous, but meaningful across a large portfolio.

---

### Part D — The Excel =FV() Function

Excel calculates Future Value automatically. You supply the inputs; Excel handles the exponent.

**Syntax:**

`=FV(rate, nper, pmt, [pv], [type])`

| Argument | Meaning | For lump sum problems |
|---|---|---|
| `rate` | Interest rate per period | Annual rate ÷ periods per year |
| `nper` | Total number of periods | Years × periods per year |
| `pmt` | Recurring payment per period | Enter **0** (lump sums only) |
| `pv` | Starting principal | Enter as a **negative number** |
| `type` | 0 = end of period (default) | Omit or enter 0 |

**The Sign Convention:**
Excel's financial functions assign direction to every cash flow. When you invest $40,000, that money leaves your pocket — so PV = **−$40,000**. The FV result comes back positive, representing the money returning to you.

- `=FV(4%, 3, 0, −40000)` → `$44,994.56` ✓
- `=FV(4%, 3, 0, 40000)` → `−$44,994.56` ✗ (wrong sign — confusing, not an error)

Getting the sign wrong does not produce a formula error — it produces a plausible-looking answer with the wrong sign. Always sanity-check: FV should be **larger** than the absolute value of PV when the rate is positive.

**Manual verification habit:** After every `=FV()` result, run: `=ABS(pv)*(1+rate)^nper`. Both must produce the same number. If they don't, your inputs are inconsistent.

---

### Part E — The Rule of 72

Before reaching for Excel, use this mental math shortcut to estimate how long it takes an investment to double:

**Rule of 72:** `Years to Double ≈ 72 ÷ Annual Rate (%)`

| Rate | Approximate doubling time |
|---|---|
| 4% | 72 ÷ 4 = **18 years** |
| 6% | 72 ÷ 6 = **12 years** |
| 8% | 72 ÷ 8 = **9 years** |
| 12% | 72 ÷ 12 = **6 years** |

This is an approximation — use `=FV()` for precise answers. The Rule of 72 is a planning tool: useful in quick client conversations when you need a fast, credible estimate before opening a spreadsheet.

**Verification:** At 7%, the Rule of 72 estimates 72 ÷ 7 ≈ 10.3 years. `=FV(7%, 10, 0, −1000)` = $1,967.15 — very close to $2,000. The rule is accurate.

---

## Formula Reference Table

| Formula | Use |
|---|---|
| `FV = PV × (1 + i)ⁿ` | Compound interest — manual calculation |
| `=FV(rate, nper, 0, −pv)` | Compound FV — Excel (lump sum) |
| `=ABS(pv)*(1+rate)^nper` | Manual verify — must match =FV() |
| `rate per period = annual ÷ periods/yr` | Non-annual compounding adjustment |
| `nper = years × periods/yr` | Non-annual compounding adjustment |
| `72 ÷ rate (%) ≈ years to double` | Rule of 72 estimate |

---

## Check Your Understanding

Answer these questions before class. Show your work on questions 2–6.

**1.** What is the structural difference between simple interest and compound interest? Your answer should explain *why* compound interest grows exponentially while simple interest grows linearly — not just state that they use different formulas.

**2.** $1,000 is invested at 6% compounded annually for 5 years. Calculate the FV using the formula FV = PV × (1 + i)ⁿ. Show your work including the exponent calculation.

**3.** Using the same scenario as Question 2, write the Excel `=FV()` formula exactly as you would type it into a cell. Include the correct sign on pv.

**4.** Use the Rule of 72 to estimate how long it takes to double $5,000 at 8% annual interest. Then verify with `=FV()` at your estimated number of years — is the result close to $10,000?

**5.** A Meridian client invests $25,000 at 6% for 5 years. Calculate the FV under (a) annual compounding and (b) monthly compounding. For monthly, show the adjusted rate and nper values before calculating.

**6.** True or False: In Excel's =FV() function, pv should always be entered as a negative number for investment problems. Explain why in one or two sentences.

**7.** A Meridian client considers two options: (a) invest $15,000 today at 5% compounded annually for 10 years, or (b) invest the same $15,000 at 5% compounded monthly for 10 years. Which produces more? Calculate both and explain the difference.

---

## Answer Key

**1.** Simple interest applies the rate to the original principal only — the same dollar amount is added every period, producing linear growth. Compound interest applies the rate to the accumulated balance, so each period's interest is slightly larger than the last because prior interest is now itself earning a return. The exponent n is the structural cause: (1+i)ⁿ raises the growth factor to a power, producing exponential rather than linear growth.

**2.** FV = $1,000 × (1.06)⁵ = $1,000 × 1.3382 = **$1,338.23**.

**3.** `=FV(6%, 5, 0, −1000)` → $1,338.23. PV is negative because the $1,000 is money leaving the investor's pocket (an outflow).

**4.** 72 ÷ 8 = **9 years** (estimate). Verification: `=FV(8%, 9, 0, −5000)` = $9,993.50 — very close to $10,000. The Rule of 72 is accurate here.

**5.** (a) Annual: rate = 6%, nper = 5. `=FV(6%, 5, 0, −25000)` = **$33,455.64**. (b) Monthly: rate = 6%/12 = 0.5%, nper = 5 × 12 = 60. `=FV(0.5%, 60, 0, −25000)` = **$33,725.46**. Monthly produces $269.82 more.

**6.** **True.** pv represents the starting investment — money leaving the investor's pocket on day one. Excel's sign convention treats outflows as negative. Entering pv as positive reverses the sign of the FV result, producing a negative FV that is correct in magnitude but wrong in directional meaning.

**7.** (a) Annual: `=FV(5%, 10, 0, −15000)` = **$24,433.42**. (b) Monthly: `=FV(5%/12, 120, 0, −15000)` = **$24,706.71**. Monthly produces **$273.29 more**. The difference arises because monthly compounding applies the rate more frequently, so interest begins earning on interest 12 times per year instead of once.

---

## Key Vocabulary

| Term | Definition |
|---|---|
| **Compound Interest** | Interest calculated on the accumulated balance — principal plus all prior interest earned. |
| **Future Value (FV)** | The value of an investment at a specific future date, after compounding at a given rate and for a given number of periods. |
| **Present Value (PV)** | The current worth of a future amount. In =FV(): the starting principal, entered as negative. |
| **i (rate per period)** | The interest rate per compounding period. Annual rate ÷ compounding periods per year. |
| **n (number of periods)** | Total number of compounding periods. Years × compounding periods per year. |
| **Compounding** | The process of earning interest on previously earned interest. The source of exponential growth. |
| **Non-annual Compounding** | Compounding more than once per year (monthly, quarterly, semiannual). Requires adjusting both rate and nper. |
| **Sign Convention** | In Excel TVM functions, outflows (money paid out) are negative; inflows (money received) are positive. |
| **Rule of 72** | Mental math shortcut: 72 ÷ annual rate (%) ≈ years to double an investment. An approximation — verify with =FV(). |
| **Snowball Effect** | The accelerating growth dynamic of compound interest: each period's interest increases the base for the next calculation. |
| **Growth Factor** | The term (1 + i)ⁿ. Tells you how many times larger your principal becomes after n periods at rate i. |

---
