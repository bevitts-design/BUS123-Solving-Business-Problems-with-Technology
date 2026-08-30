---
title: "BUS 123 — MATH-M08-L01 — Simple Interest, Discounting & Present Value"
lesson: "MATH-M08-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M08/bus123-math-m08-l01-prereading.pdf"
---

# BUS123 · MATH-M08 · L01 Pre-Reading
## Simple Interest, Discounting & Present Value

**Course:** Solving Business Problems with Technology · BUS123

**Case:** Meridian Advisory Group *(fictional; all data are simulated)*

---

## Before Class: What You Need to Understand

Rates now do more than change a price. In this lesson, an annual rate interacts with **time** to produce interest, move money forward, or discount money back to today.

By class, you should be able to:

- identify principal, annual rate, time, interest, future value, and present value;
- convert months or days into the year fraction required by a simple-interest model;
- explain why a manual simple-interest PV and Excel's `PV()` can give different answers;
- choose a model that matches the business question and state its assumptions.

## 1 · Why Timing Changes Value

Money available today can be used immediately. A future promise cannot. Three forces help explain why a business normally values the same dollar amount differently across dates.

| Force | Business meaning | Question to ask |
|---|---|---|
| **Opportunity cost** | Money today could earn a return elsewhere. | What return could we earn while waiting? |
| **Inflation** | The same dollars may buy less later. | How might purchasing power change? |
| **Risk** | A future payment may be delayed or fail. | How certain is the promise? |

The rate used to discount future money is a **decision input**, not a universal fact. Analysts may consider opportunity cost, inflation, and risk, but the way those components are estimated or combined depends on the contract and decision context.

## 2 · Simple Interest Moves One Principal Forward

Simple interest is calculated only on the original principal:

`I = P × R × T`

| Symbol | Meaning | Model requirement |
|---|---|---|
| `I` | Dollar interest | Result is a currency amount. |
| `P` | Principal | Original amount borrowed or invested. |
| `R` | Annual rate | Enter 6% as `0.06` in a manual formula. |
| `T` | Time in years | Convert months or days before calculating. |

The simple-interest ending balance is:

`FV = P + I = P × (1 + R × T)`

The factor `(1 + R × T)` is the **simple growth factor**. This training model does not add interest on prior interest. Compound growth begins in M09.

### The time conversion is part of the model

| Problem wording | Year fraction | Decision rule |
|---|---|---|
| Months | `months ÷ 12` | Use with an annual rate. |
| Exact-interest days | `days ÷ 365` | Use only when the problem or contract specifies this basis. |
| Ordinary-interest days | `days ÷ 360` | Use only when the problem or contract specifies a 360-day basis. |

For positive principal, rate, and days, dividing by 360 creates a slightly larger year fraction than dividing by 365. It therefore creates slightly more interest. Financial instruments and regulations use different day-count conventions, so do not assume one method applies to every bank, government instrument, or contract.

**Example — instructor model preview:** A $32,000 note at 4.5% for 80 exact-interest days uses `T = 80 ÷ 365`, not `T = 80`.

## 3 · Solve for the Missing Quantity

The relationship can be rearranged when the business question asks for a missing input.

| Missing quantity | Manual relationship | Excel pattern with cell references |
|---|---|---|
| Principal | `P = I ÷ (R × T)` | `=Interest/(Rate*Time)` |
| Rate | `R = I ÷ (P × T)` | `=Interest/(Principal*Time)` |
| Time | `T = I ÷ (P × R)` | `=Interest/(Principal*Rate)` |

**Decision rule:** identify the unknown first, convert time second, and then choose the relationship. A numerically correct formula that solves the wrong unknown does not answer the business question.

## 4 · Present Value Runs the Logic Backward

| Direction | Business question | Simple-interest relationship |
|---|---|---|
| **Forward** | What will today's principal become? | `FV = P × (1 + R × T)` |
| **Backward** | What is one future promise worth today? | `PV = FV ÷ (1 + R × T)` |

The manual denominator `(1 + R × T)` is the **simple-interest discount factor**. When rate and time are positive, it is greater than 1, so the present value is smaller than the future value in absolute dollars. At a zero rate or zero time, PV equals FV. Negative rates require separate interpretation.

**Example — manual simple-interest promise:** Meridian expects one $18,000 payment in 15 months and uses a 6% simple-interest rate.

`T = 15 ÷ 12 = 1.25`

`PV = $18,000 ÷ (1 + 0.06 × 1.25) = $16,744.19`

This manual calculation is appropriate only when the underlying promise is being modeled with simple interest.

## 5 · Excel `PV()` Uses a Different Growth Assumption

Excel's `PV()` discounts with a **compound-periodic** model:

`=PV(rate, nper, pmt, fv)`

| Argument | Meaning in this lesson | Boundary to remember |
|---|---|---|
| `rate` | Rate **per period** | Match it to the period used in `nper`. |
| `nper` | Total number of periods | Annual rate with annual periods; monthly rate with monthly periods. |
| `pmt` | Repeating payment | Enter `0` for one future lump sum. |
| `fv` | Future lump sum | A positive future inflow normally produces a negative PV outflow. |

For the same $18,000, 6%, and 1.25 years, Excel's compound-periodic model is:

`=PV(6%, 1.25, 0, 18000)`

Its magnitude will differ slightly from `$18,000 ÷ (1 + 0.06 × 1.25)` because the two formulas use different growth assumptions. The difference is a **model difference**, not a rounding error.

Use a round trip to test the Excel function:

`=FV(rate, nper, 0, PV_result)`

If the inputs and signs are consistent, the round trip should reproduce the original future value.

## 6 · Discount a Payment Stream Before Comparing Offers

A multi-year discounted cash-flow comparison should discount each payment to the same date and then add the present values. In this lesson, the class decision activity uses Excel's compound-periodic model so it matches the `PV()` function and the Cash Flow Timeline tool.

1. Put the discount rate in one labeled input cell.
2. Put each future payment and its year in its own row.
3. Discount each row with a compound-periodic PV formula.
4. Sum the present values.
5. Compare the total with the cash-today offer.
6. State the model and discount-rate assumption when recommending an option.

Do not add future dollars first and discount the total once when the payments arrive on different dates.

### Coming in class—not pre-class work

You do **not** need to open or complete the Cash Flow Timeline tool or the class decision activity before class. Before class, complete only the five **Check Your Understanding** questions below.

During class, the instructor will use the Cash Flow Timeline tool for a brief whole-class visualization. You will then complete the decision activity with a partner in the starter workbook.

## Excel Habits for Class

- Put assumptions in separate cells and use cell references in formulas.
- Use Percentage format for rates, Number for time, and Currency or Accounting for dollar amounts.
- Check direction: positive rate and time increase simple FV and reduce the magnitude of PV.
- Treat Excel's negative PV as a cash-flow sign, not as an error.
- Use the workbook's text feedback as evidence; color is only a secondary cue.

## Check Your Understanding

Complete these five questions before class. Bring your reasoning, not only your final numbers.

**1.** Name two reasons a business may value $20,000 today more than $20,000 promised later.

**2.** A $14,000 note earns 5.2% simple interest for 10 months. Write the Excel cell-reference pattern needed to calculate the year fraction, interest, and ending balance. Do not calculate the final answer.

**3.** A contract specifies 92 exact-interest days. What denominator belongs in the time conversion, and why would using 360 change the result?

**4.** A $28,000 payment is due in 18 months at a 6.5% rate. Explain why the manual simple-interest PV and Excel's `PV()` should not be expected to match exactly.

**5.** A client can take cash today or a stream of future payments. List the steps needed to make a defensible comparison, including the model assumption that must be disclosed.

## Key Vocabulary

| Term | Meaning |
|---|---|
| **Simple interest** | Interest calculated only on the original principal. |
| **Future value (FV)** | A present amount moved forward in time under a stated model. |
| **Present value (PV)** | A future amount moved back to a common valuation date. |
| **Discount rate** | The rate used to translate future cash flows into present value. |
| **Day-count convention** | The rule that determines the year fraction for a day-based calculation. |
| **Discounted cash-flow comparison** | A comparison that discounts each future payment to the same date before summing. |

---
