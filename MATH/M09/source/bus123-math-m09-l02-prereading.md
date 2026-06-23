---
title: "BUS 123 — MATH-M09-L02 — PMT Function & Annuities"
lesson: "MATH-M09-L02"
kind: "Pre-Reading"
status: "published"
output: "MATH/M09/bus123-math-m09-l02-prereading.pdf"
---

# BUS123 · MATH-M09 · L02 Pre-Reading
## PMT Function & Annuities

**Course:** Solving Business Problems with Technology · BUS123
**Track:** MATH · Module 09 · Lesson 02
**Semester:** Fall 2026 · Gerrish School of Business, Endicott College
**Case Study Company:** Meridian Advisory Group *(fictional — all data simulated for instructional purposes)*

---

## Connect to Prior Knowledge

In M09-L01 we used `=FV()` to grow a single lump sum forward in time. In every problem, the `pmt` argument was set to zero — because there were no recurring payments, only a one-time deposit.

Today that changes. In the real world, most financial decisions involve **regular payments**: you pay your mortgage every month, contribute to your retirement account every paycheck, and collect a pension every quarter. These payment streams are called **annuities**, and they are the most common financial structure in everyday life.

The good news: the same three Excel functions — `=PV()`, `=FV()`, and the new `=PMT()` — handle everything. The only change is that `pmt` is no longer zero. The sign rules and the period-matching rule from L01 carry forward unchanged.

---

## Core Concepts

### Part A — What Is an Annuity?

An **annuity** is a series of equal payments made at equal time intervals. Every mortgage payment, car loan installment, monthly retirement contribution, and lease payment is an annuity. Annuities are the most common financial structure in personal and business finance.

**Two types based on payment timing:**

| Type | When payments occur | Excel `type` argument | Common uses |
|---|---|---|---|
| **Ordinary Annuity** | End of each period | 0 (default — omit) | Loans, mortgages, most savings plans |
| **Annuity Due** | Beginning of each period | 1 | Lease payments, insurance premiums |

Annuity due always produces a slightly higher FV or lower required PMT than ordinary annuity, because each payment earns one extra period of interest. Unless a problem specifically states "beginning of period" or uses the word "due," assume ordinary annuity (type = 0).

**Two types based on what you're solving for:**

- **Loan amortization:** You know the loan amount (PV) — you want to know the required periodic payment (PMT).
- **Savings goal:** You know the target balance (FV) — you want to know the required periodic contribution (PMT).

Both use `=PMT()`. The difference is which argument holds the target value.

---

### Part B — The =PMT() Function

`=PMT()` calculates the periodic payment required to pay off a loan or reach a savings goal over a fixed number of periods at a fixed interest rate.

**Syntax:**

`=PMT(rate, nper, pv, [fv], [type])`

| Argument | Meaning | For loan problems | For savings goal problems |
|---|---|---|---|
| `rate` | Rate per period | Annual rate ÷ 12 (monthly) | Annual rate ÷ 12 (monthly) |
| `nper` | Total payment periods | Years × 12 (monthly) | Years × 12 (monthly) |
| `pv` | Present value (loan amount) | Loan amount — enter **positive** | Enter **0** |
| `fv` | Future value (savings target) | Enter **0** (loan paid off) | Target balance — enter **positive** |
| Result | Required payment | Returns **negative** | Returns **negative** |

The result is always **negative** — it represents money leaving your pocket each period (an outflow). When communicating the monthly payment to a client, use the absolute value: `=ABS(PMT(…))`.

**Worked Example — Meridian Advisory Group Mortgage:**
A client purchases a home for $320,000 at 6.5% annual interest, 30-year term, monthly payments.

- `rate = 6.5% ÷ 12 = 0.5417% per month`
- `nper = 30 × 12 = 360 months`
- `=PMT(6.5%/12, 360, 320000, 0)` → `−$2,023.13/month`

The client pays **$2,023.13 per month**. Over 30 years:

- `Total paid = $2,023.13 × 360 = $728,326`
- `Original PV = $320,000`
- `Total interest paid = $728,326 − $320,000 = $408,326`

The client will pay more than $400,000 in interest over the life of the loan — more than the original principal. This is one of the most important numbers a financial advisor can show a client.

> ⚠️ **The Most Common PMT Error: Wrong Period Match**
>
> `=PMT(6.5%, 30, 320000)` returns −$27,006 — a large *annual* payment that looks plausible. But the monthly payment is $2,023. The formulas are not wrong; the *inputs* are mismatched. Always ask: what is the payment frequency? Rate and nper must match that frequency.

---

### Part C — Solving for Required Savings Contribution

`=PMT()` also works in reverse: given a savings goal (FV), it tells you how much to contribute each period.

**Worked Example — Retirement Goal:**
A Meridian client wants $500,000 in 25 years. Their account earns 7% annual, compounded monthly. How much must they contribute each month?

`=PMT(7%/12, 25*12, 0, 500000)` → `−$576.57/month`

They must contribute **$576.57 per month**. Over 25 years:

- `Total contributed = $576.57 × 300 = $172,971`
- `Account balance at goal = $500,000`
- `Growth from compounding = $327,029`

They put in $172,971 and compounding nearly doubled it to $500,000. The gap — $327,029 — came entirely from interest earning interest over 25 years.

---

### Part D — =FV() with Regular Contributions

When a client makes regular monthly contributions, `=FV()` projects the ending balance. The `pmt` argument is no longer zero.

**Syntax (same as before, pmt now filled in):**

`=FV(rate, nper, pmt, [pv], [type])`

For a savings account with monthly contributions and no starting balance:

- `rate` = annual rate ÷ 12
- `nper` = years × 12
- `pmt` = monthly contribution — enter as **negative** (money leaving your pocket)
- `pv` = 0 (no starting lump sum)

**Worked Example:**
A Meridian client contributes $500/month to a retirement account earning 7% annual for 30 years.

`=FV(7%/12, 30*12, −500, 0)` → `$606,438.29`

They contributed $500 × 360 = **$180,000** total. Compounding grew it to **$606,438** — the extra $426,438 is entirely from compound interest on prior contributions.

**Starting with both a lump sum and regular contributions:**

If the client already has $10,000 saved and also contributes $500/month:

`=FV(7%/12, 360, −500, −10000)` → `$674,843.64`

Both `pmt` and `pv` are negative because both are outflows — money leaving the client's pocket.

---

### Part E — =PV() with Regular Payments

`=PV()` with a `pmt` value answers: *what is a stream of equal future payments worth today?*

**Worked Example:**
A Meridian client will receive $1,500/month for 10 years from a structured settlement. Discount rate: 5% annual. What is that stream worth in today's dollars?

`=PV(5%/12, 10*12, 1500, 0)` → `−$141,799`

The stream pays out $1,500 × 120 = **$180,000** total in nominal dollars. In today's dollars at 5%, it is worth only **$141,799**. The difference — $38,201 — represents the time value eroded by 10 years of waiting and discounting.

The result is negative because it represents the **cost to acquire this stream today** (outflow). If a buyer offers $130,000 for the settlement, the client should hold — it is worth more. If the offer is $155,000, the client should accept — the offer exceeds the present value.

---

### Part F — The Sign Convention Across All Three Functions

The same cash-flow rule applies in every TVM function:

- **Money leaving your pocket** (investing, paying a loan, making a deposit) → **negative**
- **Money coming to you** (receiving a loan, collecting a payment, withdrawing savings) → **positive**

| Scenario | pv sign | pmt sign | fv sign |
|---|---|---|---|
| Taking out a loan | + (received) | − (paying back) | 0 |
| Regular savings contributions | 0 or − (initial deposit) | − (monthly deposit) | + (balance received) |
| Valuing received annuity payments | 0 | + (payments received) | 0 |

Getting any one of these signs wrong does not cause a formula error — it produces a plausible-looking answer with the wrong sign or direction. Always verify: does the result make economic sense given what you entered?

---

## Formula Reference Table

| Formula | Use |
|---|---|
| `=PMT(rate/12, years×12, pv, 0)` | Monthly loan payment (pv = loan amount, positive) |
| `=PMT(rate/12, years×12, 0, fv)` | Required monthly savings contribution (fv = target) |
| `Total interest = ABS(PMT) × nper − PV` | Total interest cost over loan life |
| `=FV(rate/12, years×12, −pmt, 0)` | Future savings balance from regular contributions |
| `=FV(rate/12, years×12, −pmt, −pv)` | Future savings with starting balance + contributions |
| `=PV(rate/12, years×12, pmt, 0)` | Present value of a payment stream (pmt positive = received) |

---

## Check Your Understanding

Answer these questions before class. Show your work on questions 2–6.

**1.** In your own words, what is an annuity? Give two examples from everyday life — one involving money flowing out (a loan) and one involving money flowing in (a payment received).

**2.** A Meridian client takes out a $200,000 mortgage at 5.5% annual interest for 15 years, with monthly payments. (a) Write the `=PMT()` formula. (b) What is the monthly payment? (c) What is the total interest paid over the life of the loan?

**3.** A client wants to accumulate $300,000 in 20 years. Their account earns 6% annual, compounded monthly. How much must they contribute each month? Write the `=PMT()` formula and identify which argument holds the savings goal.

**4.** A Meridian client contributes $400/month to an account earning 6% annual for 25 years, starting with no existing balance. Use `=FV()` to project the ending balance. What is the total amount contributed, and how much of the balance came from compounding?

**5.** A client will receive $2,000/month for 12 years from a structured settlement. The current discount rate is 6% annual. Use `=PV()` to find the present value of this stream. Is a lump-sum offer of $170,000 a good deal for the client — or should they collect the payments?

**6.** True or False: In `=PMT()`, the result is always negative. Explain what the negative sign means economically.

**7.** A client is weighing two options over 10 years at 5% annual (monthly compounding): (a) invest $40,000 today as a lump sum, or (b) contribute $350/month with no starting balance. Which produces a higher account balance at year 10? Show both calculations.

---

## Answer Key

**1.** An annuity is a series of equal payments made at equal time intervals. Examples: outflow — monthly car loan or mortgage payments (money leaves your pocket each month). Inflow — monthly pension payments or a structured settlement (money arrives each month).

**2.** (a) `=PMT(5.5%/12, 15*12, 200000, 0)`. (b) Monthly payment = **$1,634.17**. (c) Total paid = $1,634.17 × 180 = $294,150.60. Total interest = $294,150.60 − $200,000 = **$94,150.60**.

**3.** `=PMT(6%/12, 20*12, 0, 300000)` → **−$671.93/month**. The savings goal lives in the `fv` argument (the fourth argument). `pv` is 0 because the client is not starting with a lump sum.

**4.** `=FV(6%/12, 300, −400, 0)` → **$401,806.46**. Total contributed = $400 × 300 = $120,000. Growth from compounding = $401,806 − $120,000 = **$281,806**. Compounding produced more than twice the total contributions.

**5.** `=PV(6%/12, 144, 2000, 0)` → **−$200,904.37**. The stream is worth $200,904 in today's dollars. A lump-sum offer of $170,000 is **below** present value — the client should decline and collect the payments. If offered more than $200,904, the client should consider accepting.

**6.** **True.** The `=PMT()` result is always negative because it represents money leaving the borrower's or saver's pocket each period — an outflow. For a loan, you are paying the lender. For a savings goal, you are making a deposit. In both cases the cash flows in the negative direction from your perspective. Report the payment to clients as `ABS(PMT())`.

**7.** (a) Lump sum: `=FV(5%/12, 120, 0, −40000)` = **$65,926.88**. (b) Monthly contributions: `=FV(5%/12, 120, −350, 0)` = **$54,428.77**. The lump sum wins by **$11,498** because the full $40,000 compounds for all 10 years, while the $350/month contributions average only about 5 years of compounding. Starting early with a larger amount generally beats smaller regular contributions over the same horizon at the same rate.

---

## Key Vocabulary

| Term | Definition |
|---|---|
| **Annuity** | A series of equal payments made at equal time intervals. |
| **Ordinary Annuity** | Payments made at the end of each period. The Excel default (type = 0). Used for most loans and savings plans. |
| **Annuity Due** | Payments made at the beginning of each period (type = 1). Used for leases and some insurance products. |
| **=PMT()** | Excel function that calculates the required periodic payment given rate, nper, and either PV (loan) or FV (savings goal). |
| **Loan Amortization** | The process of paying off a loan through regular equal payments, each of which covers some interest and some principal. |
| **Total Interest** | The total cost of borrowing: ABS(PMT) × nper − PV. |
| **Savings Contribution** | A periodic deposit toward a future savings goal. In =FV() and =PMT(), entered as a negative number (outflow). |
| **pmt (argument)** | The recurring payment per period in Excel TVM functions. Negative for money leaving your pocket; positive for money received. |
| **Sign Convention** | In Excel TVM functions, outflows are negative and inflows are positive. Applies to pv, pmt, and fv. |
| **Structured Settlement** | A financial arrangement that pays a fixed amount at regular intervals — a real-world annuity commonly valued using =PV(). |

---
