# BUS123 · MATH-M09 · L02 Pre-Reading
## Compound Interest and Present Value

**Course:** Solving Business Problems with Technology · BUS123  
**Track:** MATH · Module 09 · Lesson 02  
**Semester:** Fall 2026 · Gerrish School of Business, Endicott College

---

## Connect to Prior Knowledge

In Lesson 01 we calculated simple interest — a flat, linear amount earned only on the original principal. The ending balance grew by the same dollar amount every period: $5 on $100 at 5%, year after year. Today that changes. **Compound interest** earns interest on the accumulated balance, not just the original principal. The result is exponential growth — the same rate produces more money every single year, and the gap between simple and compound interest widens dramatically over time. This is the mathematical engine behind every savings account, investment portfolio, and retirement fund.

---

## Concept Explanation

### Simple vs. Compound: The Core Difference

Consider $100 invested at 5% for 3 years:

| Year | Simple Interest | Compound Interest | Difference |
|------|----------------|-------------------|------------|
| 1 | $105.00 | $105.00 | $0.00 |
| 2 | $110.00 | $110.25 | $0.25 |
| 3 | $115.00 | $115.76 | $0.76 |
| 10 | $150.00 | $162.89 | $12.89 |
| 30 | $250.00 | $432.19 | $182.19 |

The difference at year 3 is small. At year 30 it is enormous. This is the **snowball effect** — interest earning interest, compounding over time.

### The Compound Interest Formula

$$FV = PV \times (1 + i)^n$$

| Variable | Name | Definition |
|----------|------|-----------|
| **FV** | Future Value | The ending balance after compounding |
| **PV** | Present Value | The starting principal today |
| **i** | Rate per period | Annual rate ÷ compounding periods per year |
| **n** | Number of periods | Years × compounding periods per year |

**Example — Meridian Advisory Group:**  
A client deposits $40,000 at 4% compounded annually for 3 years:

```
FV = $40,000 × (1.04)³
FV = $40,000 × 1.124864
FV = $44,994.56
```

Simple interest over the same period would have produced only $44,800.00 — compound interest adds an extra $194.56.

---

### Non-Annual Compounding

When interest compounds more frequently than once per year, both **rate** and **nper** must be adjusted to match the compounding period. The annual rate alone is not enough.

| Compounding | Rate per period | Number of periods |
|------------|----------------|-------------------|
| Annually | R ÷ 1 | Years × 1 |
| Semiannually | R ÷ 2 | Years × 2 |
| Quarterly | R ÷ 4 | Years × 4 |
| Monthly | R ÷ 12 | Years × 12 |

**Example:** $100 at 8% for 4 years compounded quarterly:

```
Rate per period = 8% ÷ 4 = 2%
Nper = 4 × 4 = 16 periods
FV = $100 × (1.02)¹⁶ = $137.28
```

The same investment compounded annually would produce only $136.05. More frequent compounding always produces a higher ending balance.

---

### The Rule of 72

Before reaching for Excel, use this mental math shortcut to estimate how long it takes an investment to double:

$$\text{Years to Double} \approx \frac{72}{\text{Annual Rate (\%)}}$$

| Rate | Approximate doubling time |
|------|--------------------------|
| 4% | 72 ÷ 4 = **18 years** |
| 6% | 72 ÷ 6 = **12 years** |
| 8% | 72 ÷ 8 = **9 years** |
| 12% | 72 ÷ 12 = **6 years** |

This is an estimate — use `=FV()` in Excel for precise answers. The Rule of 72 is a powerful intuition-builder for quick planning conversations.

---

## The Excel FV Function

Excel calculates Future Value automatically with the `=FV()` function. You supply the inputs; Excel handles the exponent.

**Syntax:**

```
=FV(rate, nper, pmt, [pv], [type])
```

| Argument | Meaning | For lump sum problems |
|----------|---------|----------------------|
| `rate` | Interest rate per period | Annual rate ÷ periods per year |
| `nper` | Total number of periods | Years × periods per year |
| `pmt` | Recurring payment per period | Enter **0** |
| `pv` | Starting principal | Enter as a **negative number** |
| `type` | 0 = end of period (default) | Omit or enter 0 |

### The Sign Convention — Critical

Excel's financial functions assign direction to every cash flow:

- **Cash outflow (money leaving your pocket):** negative
- **Cash inflow (money coming back to you):** positive

When you invest $40,000, that money leaves your pocket. So PV = **−$40,000** in the formula. The FV result comes back positive — the money returning to you.

```excel
=FV(4%, 3, 0, -40000)   →   $44,994.56   ✓
=FV(4%, 3, 0, 40000)    →  -$44,994.56   ✗ (wrong sign — confusing)
```

Getting the sign wrong does not produce an error — it produces a plausible-looking answer with the wrong sign. Always sanity-check: does the result make sense directionally?

---

## The Excel PV Function

Present Value runs the calculation in reverse: given a future amount, what is it worth today? This is called **discounting** — peeling back the compounding to find the equivalent value right now.

**The Math:**

$$PV = \frac{FV}{(1 + i)^n}$$

**Syntax:**

```
=PV(rate, nper, pmt, [fv], [type])
```

| Argument | Meaning | For lump sum problems |
|----------|---------|----------------------|
| `rate` | Interest rate per period | Annual rate ÷ periods per year |
| `nper` | Total number of periods | Years × periods per year |
| `pmt` | Recurring payment per period | Enter **0** |
| `fv` | Future amount you expect | Enter as a **positive number** |
| `type` | 0 = end of period (default) | Omit or enter 0 |

The PV result will be **negative** — it represents the amount you must invest (outflow) today to reach the future value.

**Example — Meridian Advisory Group:**  
A client is promised $115 in 3 years. Current rate is 5%. What is that worth today?

```
PV = $115 ÷ (1.05)³ = $99.34

Excel: =PV(5%, 3, 0, 115)   →   -$99.34
```

The negative means you would need to invest $99.34 today to have $115 in 3 years at 5%.

**Sanity check:** Plug that back in: `=FV(5%, 3, 0, -99.34)` → $115.00 ✓

### PV Over Time: Discounting Table

At 5% discount rate, the present value of $100 received in the future:

| Years from now | PV of $100 |
|---------------|-----------|
| 1 | $95.24 |
| 2 | $90.70 |
| 3 | $86.38 |
| 5 | $78.35 |
| 10 | $61.39 |

The farther away the payment, the less it is worth today. At 5%, a dollar promised in 10 years is worth only 61 cents right now.

---

## Formula Reference Table

| Formula | Use |
|---------|-----|
| `FV = PV × (1 + i)^n` | Compound interest — manual calculation |
| `PV = FV ÷ (1 + i)^n` | Present value — manual calculation |
| `72 ÷ Rate = Years to Double` | Rule of 72 estimate |

**Excel equivalents:**

| What you want | Excel formula |
|--------------|---------------|
| Future value (lump sum) | `=FV(rate, nper, 0, -pv)` |
| Present value (lump sum) | `=PV(rate, nper, 0, fv)` |
| Manual FV (annual) | `=(1+B3)^A5*B2` |
| Rate per period (monthly) | `=B3/12` |
| Nper (monthly) | `=B4*12` |

---

## Check Your Understanding

**1.** What is the key difference between simple interest and compound interest?

**2.** $1,000 is invested at 6% compounded annually for 5 years. Calculate the FV using the formula FV = PV × (1 + i)^n. Show your work.

**3.** Using the same scenario, write the Excel formula that would produce the same result. Include the correct sign on PV.

**4.** Use the Rule of 72 to estimate how long it takes to double $5,000 at 8% annual interest.

**5.** A client will receive $50,000 in 4 years. The current discount rate is 6%. What is the present value of that payment? Use both the manual formula and the Excel PV function.

**6.** True or False: In Excel's FV function, PV should always be entered as a negative number for investment problems. Explain why.

**7.** A Meridian client wants to know whether to accept $38,000 today or wait 5 years for $50,000, assuming a 5% discount rate. Use the PV function to advise them.

---

## Answer Key

**1.** Simple interest is calculated only on the original principal — the same dollar amount every period. Compound interest is calculated on the accumulated balance (principal plus prior interest), producing a growing amount each period. Compound interest grows exponentially; simple interest grows linearly.

**2.**  
FV = $1,000 × (1.06)⁵  
FV = $1,000 × 1.3382  
FV = **$1,338.23**

**3.** `=FV(6%, 5, 0, -1000)` → $1,338.23 ✓  
PV is negative because the $1,000 is money leaving the investor's pocket.

**4.** 72 ÷ 8 = **9 years** (approximate)

**5.**  
Manual: PV = $50,000 ÷ (1.06)⁴ = $50,000 ÷ 1.2625 = **$39,604.68**  
Excel: `=PV(6%, 4, 0, 50000)` → **−$39,604.68**  
(Negative because it represents the required investment today)

**6.** **True.** PV represents a cash outflow — money leaving the investor's pocket to fund the investment. Excel's sign convention treats outflows as negative and inflows as positive. Entering PV as positive reverses the sign of the result, producing a negative FV that is technically correct in magnitude but confusingly signed.

**7.**  
PV of $50,000 in 5 years at 5% = `=PV(5%, 5, 0, 50000)` → **−$39,176.31**  
Since $39,176.31 > $38,000, the future payment of $50,000 is worth more in today's dollars than the $38,000 offer. **The client should wait for the $50,000.**

---

## Key Vocabulary

| Term | Definition |
|------|-----------|
| **Compound Interest** | Interest calculated on the accumulated balance — principal plus all prior interest |
| **Future Value (FV)** | The value of an investment at a specific future date, after compounding |
| **Present Value (PV)** | The current worth of a future amount, discounted at a given interest rate |
| **Compounding** | The process of earning interest on previously earned interest |
| **Discounting** | Reversing the compounding process to find what a future amount is worth today |
| **Rule of 72** | Mental math shortcut: 72 ÷ annual rate ≈ years to double an investment |
| **Sign Convention** | In Excel TVM functions, outflows (money paid) are negative; inflows (money received) are positive |
| **Nper** | Total number of compounding periods (years × periods per year) |
| **Rate per period** | Annual rate divided by the number of compounding periods per year |
| **Time Value of Money (TVM)** | The principle that a dollar today is worth more than a dollar in the future because of its earning potential |

---

*⚠ I Can statements for this lesson are instructor drafts — not yet confirmed in Notion. Confirm before distributing to students.*

*Pre-reading for in-class use only. Questions go in the Canvas homework quiz — do not embed in this document.*
