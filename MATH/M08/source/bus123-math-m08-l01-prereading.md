---
title: "BUS 123 — MATH-M08-L01 — Simple Interest & Discounting"
lesson: "MATH-M08-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M08/bus123-math-m08-l01-prereading.pdf"
---


# BUS 123 · MATH-M08-L01 · Simple Interest & Discounting

**Course:** Solving Business Problems with Technology · Fall 2026
**Track:** MATH · **Module:** M08 · **Lesson:** L01
**Case Study Company:** Meridian Advisory Group

*Simulated data for instructional purposes — Meridian Advisory Group is a fictional company.*

---

## 1 · Connect to Prior Knowledge

In MATH-M07, you worked with percentages and rates — calculating markups, markdowns, and proportional changes. You learned that a rate is a ratio that describes change relative to a base amount.

Today we put that skill to work in a new direction: using a rate to describe **how money changes over time.** Until now, a 6% rate was a label — it described a discount or a price change at a single moment. Starting today, a 6% rate is an **engine**. It tells us how fast money grows when it sits in an account or a loan, and it tells us how much we need to "shrink" a future promise to find out what it's worth right now.

That shrinking process is called **discounting**, and it is the single most important calculation in business finance.

---

## 2 · Core Concepts

### Part A — Why a Dollar Today Is Worth More Than a Dollar Tomorrow

The **Time Value of Money (TVM)** is the idea that money available today is worth more than the same amount promised in the future. Three forces explain why:

| Force               | Explanation                                                                                                    |
|---------------------|----------------------------------------------------------------------------------------------------------------|
| **Opportunity Cost**| Money today can be invested immediately. A dollar promised next year cannot earn anything until it arrives.    |
| **Inflation**       | Prices tend to rise over time. The same dollar amount will buy slightly less in the future.                    |
| **Risk**            | Future promises can fail. A payment guaranteed today carries no uncertainty; a future payment might not arrive.|

> 💡 **The So What**
>
> When a financial advisor at Meridian evaluates a client's future payment stream, they don't just add up the dollar amounts. They ask: what are these future dollars worth **today**, given the client's opportunity cost and the risk of waiting? That calculation — discounting — is what you will build in today's activity.

---

### Part B — Simple Interest: Moving Money Forward in Time

Simple interest calculates the interest earned on a principal amount using a flat annual rate applied to the **original principal only** — interest does not earn interest (that is compound interest, covered next module). Simple interest is common in short-term loans, notes payable, and bridge financing.

**The Formula: I = P × R × T**

| Variable | Stands For        | Notes                                                           |
|----------|-------------------|-----------------------------------------------------------------|
| **I**    | Interest earned   | The dollar amount of interest generated                         |
| **P**    | Principal         | The original amount borrowed or invested                        |
| **R**    | Annual interest rate | Always enter as a decimal: 6% = 0.06                        |
| **T**    | Time in years     | Must be in years — convert: months ÷ 12, days ÷ 365           |

> ⚠️ **The T Trap — Never Use Days or Months Directly**
>
> The most common error on simple interest problems is plugging in time without converting to years first.
> - A 90-day loan does NOT use T = 90. It uses T = 90 ÷ 365 = **0.247**.
> - A 6-month loan uses T = 6 ÷ 12 = **0.5**.
>
> If you forget to convert, your interest will be 90 or 12 times too large — a result that should immediately signal something is wrong.

#### Worked Example — Meridian Advisory Group

A Meridian client invests $8,000 in a short-term corporate note at 5.5% simple interest for 9 months.

- **Step 1 — Convert time to years:** T = 9 ÷ 12 = **0.75 years**
- **Step 2 — Calculate interest:** I = 8,000 × 0.055 × 0.75 = **$330.00**
- **Step 3 — Calculate Future Value:** FV = 8,000 + 330 = **$8,330.00**
- **In Excel:** `=8000*(1+0.055*0.75)` = $8,330.00

> ✅ **Key Insight: The Growth Factor**
>
> The term `(1 + R×T)` is the growth factor — it tells you how many times larger your money becomes. At 5.5% for 9 months, every dollar grows to $1.04125. Multiply by the principal and you have the Future Value.

---

### Part C — Discounting: Running the Math Backward

Future Value asks: *what will this grow to?* Present Value asks the reverse: *what is a future promise worth right now?*

To get Present Value, we rearrange the Future Value formula — instead of multiplying by the growth factor, we divide by it:

| Direction  | Question                         | Formula                      |
|------------|----------------------------------|------------------------------|
| **Forward →** | What will P grow to?          | `FV = P × (1 + R×T)`        |
| **← Backward** | What is FV worth today?      | `PV = FV ÷ (1 + R×T)`       |

The term `(1 + R×T)` in the denominator is the **discount factor**:

**`Discount Factor = 1 + R × T`**

The discount factor is always greater than 1 (as long as R and T are positive), so dividing by it always produces a Present Value **smaller** than the Future Value. The higher the rate or the longer the wait, the larger the discount factor — and the smaller the present value. This is the mathematical proof of TVM.

#### Worked Example — Meridian Advisory Group

A Meridian corporate client is owed $25,000 in 18 months from a contract receivable. They want to know what that future payment is worth today, using a 7% discount rate.

- **Step 1 — Convert time to years:** T = 18 ÷ 12 = **1.5 years**
- **Step 2 — Calculate discount factor:** DF = 1 + (0.07 × 1.5) = **1.105**
- **Step 3 — Calculate Present Value:** PV = 25,000 ÷ 1.105 = **$22,624.43**
- **In Excel:** `=25000/(1+0.07*1.5)` = $22,624.43

The gap tells the story: $25,000 − $22,624 = **$2,376**. That $2,376 is the **cost of waiting** 18 months at 7% — the combined effect of opportunity cost and risk. This gap is what the entire field of discounted cash flow (DCF) analysis is built on.

---

## 3 · Formula Reference

| Formula              | Algebraic Form             | Excel Form              | Use When                                    |
|----------------------|----------------------------|-------------------------|---------------------------------------------|
| **Simple Interest**  | `I = P × R × T`            | `=C2*D2*E2`             | Finding interest earned on a short-term note|
| **Future Value**     | `FV = P × (1 + R×T)`       | `=C2*(1+D2*E2)`         | Finding the total maturity value            |
| **Present Value**    | `PV = FV ÷ (1 + R×T)`      | `=C2/(1+D2*E2)`         | Discounting a future payment to today       |
| **Discount Factor**  | `DF = 1 + R × T`           | `=1+D2*E2`              | Intermediate step in PV calculation         |
| **Time Conversion**  | `T = months ÷ 12` or `days ÷ 365` | `=A2/12` or `=A2/365` | Always convert before using in formulas |

---

## 4 · Check Your Understanding

Answer these seven questions before class. Show your work on questions 2–5. The answer key appears at the end.

1. **(Conceptual)** In one or two sentences, explain why a financial advisor would tell a client that $15,000 promised in two years is not worth $15,000 today. Do not use a formula — explain the economic logic.

2. **(Calculation)** A Meridian client borrows $10,000 at 6% simple interest for 2 years. Calculate (a) the interest earned and (b) the future value at maturity.

3. **(Calculation)** A 180-day commercial note has a principal of $7,500 and an annual rate of 4.8%. Calculate the interest earned using the exact interest method (365-day year).

4. **(Calculation)** A Meridian client will receive $18,000 in 2 years. Using a 7% discount rate, calculate the present value of that payment.

5. **(Calculation)** Using a 6% discount rate, calculate the present value of each payment, then find the total present value of this two-payment stream:
   - Payment A: $12,000 due in 1 year
   - Payment B: $20,000 due in 3 years

6. **(Conceptual)** A student calculates the present value of a payment and gets an answer larger than the future value. Without doing the math, explain what error the student must have made.

7. **(Analysis)** Suppose the discount rate in Question 4 increases from 7% to 12%. Without recalculating, predict whether the present value will be higher or lower. Then calculate the new PV to verify your prediction.

---

### Answer Key · Check Your Understanding

| # | Answer |
|---|--------|
| **1** | Three forces reduce the value of future money: (1) opportunity cost — the $15,000 today could be invested to earn a return; (2) inflation — prices will likely rise, so $15,000 buys less in two years; (3) risk — the future payment might not be received. Any two of these forces, explained clearly, is a complete answer. |
| **2** | (a) I = 10,000 × 0.06 × 2 = **$1,200.00**. (b) FV = 10,000 + 1,200 = **$11,200.00** [or: `=10000*(1+0.06*2)`] |
| **3** | T = 180 ÷ 365 = 0.4932 years. I = 7,500 × 0.048 × 0.4932 = **$177.53** |
| **4** | DF = 1 + (0.07 × 2) = 1.14. PV = 18,000 ÷ 1.14 = **$15,789.47** |
| **5** | Payment A: PV = 12,000 ÷ (1 + 0.06×1) = 12,000 ÷ 1.06 = **$11,320.75**. Payment B: PV = 20,000 ÷ (1 + 0.06×3) = 20,000 ÷ 1.18 = **$16,949.15**. Total PV = **$28,269.90** |
| **6** | PV must always be **less** than FV (because the discount factor is always greater than 1). If PV > FV, the student likely **multiplied** instead of divided by the discount factor — running the formula in the wrong direction. |
| **7** | **Prediction:** PV will be lower. A higher discount rate means a larger denominator → smaller present value. **Verification:** DF = 1 + (0.12 × 2) = 1.24. New PV = 18,000 ÷ 1.24 = **$14,516.13** (vs. $15,789.47 at 7% — lower, as predicted). |

---

## 5 · Key Vocabulary

| Term                          | Definition                                                                                                                                                   |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Time Value of Money (TVM)** | The principle that a dollar today is worth more than a dollar in the future, because today's dollar can be invested to earn a return.                        |
| **Principal (P)**             | The original amount of money borrowed, invested, or lent — before interest is added.                                                                        |
| **Simple Interest**           | Interest calculated only on the original principal. Interest does not earn interest.                                                                         |
| **Future Value (FV)**         | The value a present sum of money will reach at a specified future date, given a specific interest rate and time period.                                      |
| **Present Value (PV)**        | The current worth of a future sum of money, calculated by discounting at a specific rate. Also called the discounted value.                                  |
| **Discount Rate**             | The interest rate used to convert future cash flows back to present value. Reflects the investor's required return — opportunity cost plus a risk premium.   |
| **Discount Factor**           | The denominator in the PV formula: `(1 + R × T)`. A number always greater than 1 that shrinks a future value down to its present equivalent.               |
| **Discounted Cash Flow (DCF)**| A valuation method that finds the present value of a stream of future cash flows by discounting each one back to today and summing the results.             |
| **Opportunity Cost**          | The return foregone by choosing one option over the next best alternative. In TVM, it is why money today is more valuable — you could be earning a return on it right now. |
| **Exact Interest**            | Simple interest calculated using a 365-day year in the denominator for time conversion.                                                                      |
