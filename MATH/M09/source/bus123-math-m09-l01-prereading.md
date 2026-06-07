# BUS123 · MATH-M09 · L01 Pre-Reading
## Simple Interest

**Course:** Solving Business Problems with Technology · BUS123  
**Track:** MATH · Module 09 · Lesson 01  
**Semester:** Fall 2026 · Gerrish School of Business, Endicott College

---

## Connect to Prior Knowledge

In Module 08 we worked with percentages as tools for comparing and adjusting values — markup rates, markdown percentages, and margin calculations. Interest is that same percentage logic applied across time. When a business borrows money or puts cash in a reserve account, the rate no longer just changes a price — it generates a dollar amount that grows the longer time passes. This lesson builds the first and simplest version of that relationship: **Simple Interest**.

---

## Concept Explanation

### What Is Simple Interest?

Simple interest is interest calculated only on the original principal — the starting amount. It does not accumulate; it does not earn interest on itself. Every period produces the same fixed dollar amount. That makes it predictable, easy to calculate, and the foundation for everything more complex that follows.

The formula has three inputs:

| Variable | Name | Definition |
|----------|------|-----------|
| **P** | Principal | The starting amount borrowed or invested |
| **R** | Rate | The annual interest rate, expressed as a decimal |
| **T** | Time | The length of the loan or investment, **in years** |

**Simple Interest Formula:**

```
I = P × R × T
```

**Ending Balance (Maturity Value):**

```
Ending Balance = P + I
```

### The Time Variable — The Most Common Source of Error

Rate is always stated as an **annual** rate. Time must therefore always be expressed in years. When a loan is stated in months or days, you must convert before using the formula.

| Stated term | Time (T) in years |
|-------------|-------------------|
| 6 months | 6 ÷ 12 = **0.5** |
| 18 months | 18 ÷ 12 = **1.5** |
| 90 days (ordinary) | 90 ÷ 360 = **0.25** |
| 90 days (exact) | 90 ÷ 365 = **0.2466…** |

In Excel, enter the conversion directly in the cell — `=6/12` — rather than typing the decimal. This makes your formula auditable and error-resistant.

---

## Two Methods for Day-Based Interest

When a loan term is expressed in days rather than months or years, two methods are in use:

### Method 1: Exact Interest (÷ 365)

$$T = \frac{\text{exact number of days}}{365}$$

Used by the **Federal Reserve** and the **US government**. Every day counts as 1/365 of a year.

### Method 2: Ordinary Interest — Banker's Rule (÷ 360)

$$T = \frac{\text{exact number of days}}{360}$$

Used by most **commercial banks**. Dividing by the smaller number (360) produces a slightly larger value for T, which produces slightly more interest — in the bank's favor. This is intentional.

**Practical impact:** On a $50,000 loan at 5% for 124 days, the difference between the two methods is approximately $11.79. Over a large loan portfolio, those differences add up significantly.

**Excel tip:** When loan dates are in cells, subtract them to get the day count automatically:

```
=B4 - B3        ← gives exact day count
```

Then divide by 365 or 360 in the interest formula, depending on which method applies.

---

## Solving for an Unknown

The simple interest formula rearranges cleanly to solve for any one variable when the other two are known. This is essential in real financial analysis — you often have two of the three variables and need to find the third.

| Solve for | Formula |
|-----------|---------|
| **Principal** | P = I ÷ (R × T) |
| **Rate** | R = I ÷ (P × T) |
| **Time** | T = I ÷ (P × R) |

**Example — Meridian Advisory Group:**  
A client's account shows $19.48 in interest charged at 9.5% for 90 days (ordinary interest). What was the principal?

```
T = 90 ÷ 360 = 0.25 years
P = $19.48 ÷ (0.095 × 0.25)
P = $19.48 ÷ 0.02375
P = $820.21
```

In Excel: `=B5/(B3*B4)` where B3 = rate, B4 = time as decimal, B5 = interest amount.

---

## Formula Reference Table

| Formula | Use |
|---------|-----|
| `I = P × R × T` | Calculate simple interest |
| `Ending Balance = P + I` | Calculate maturity value |
| `P = I ÷ (R × T)` | Solve for unknown principal |
| `R = I ÷ (P × T)` | Solve for unknown rate |
| `T = I ÷ (P × R)` | Solve for unknown time |
| `T = days ÷ 365` | Exact interest conversion |
| `T = days ÷ 360` | Ordinary interest (Banker's Rule) |

**Excel equivalents:**

| What you want | Excel formula |
|--------------|---------------|
| Simple interest | `=B2*B3*B4` |
| Ending balance | `=B2+B6` |
| Fractional year | `=6/12` or `=B4-B3` (dates) |
| Principal (unknown) | `=B5/(B3*B4)` |

---

## Check Your Understanding

Answer these questions before class. You do not need to submit them — they prepare you for the in-class activity.

**1.** A business deposits $25,000 in an account at 3.5% annual interest for 2 years. What is the simple interest earned?

**2.** Using the same scenario, what is the ending balance?

**3.** A loan is taken out for 9 months at 6% annual interest on $12,000. What is T in this problem?

**4.** Using your answer to Question 3, calculate the simple interest and ending balance.

**5.** Meridian Advisory Group has a client who paid $450 in interest on a 1-year loan at 4.5%. What was the original principal?

**6.** A $10,000 loan at 8% runs from April 1 to September 18 (170 days). Calculate the interest under (a) exact interest and (b) ordinary interest. Which produces more interest, and why?

**7.** True or False: If the rate doubles but everything else stays the same, the simple interest exactly doubles. Explain your reasoning.

---

## Answer Key

**1.** I = $25,000 × 0.035 × 2 = **$1,750**

**2.** Ending Balance = $25,000 + $1,750 = **$26,750**

**3.** T = 9 ÷ 12 = **0.75 years**

**4.** I = $12,000 × 0.06 × 0.75 = **$540**; Ending Balance = **$12,540**

**5.** P = $450 ÷ (0.045 × 1) = **$10,000**

**6.**  
(a) Exact: I = $10,000 × 0.08 × (170/365) = **$372.60**  
(b) Ordinary: I = $10,000 × 0.08 × (170/360) = **$377.78**  
Ordinary produces more because dividing by 360 (smaller) makes T larger, increasing interest. The bank benefits.

**7.** **True.** Because I = P × R × T, and rate R appears as a direct multiplier with no exponent, doubling R exactly doubles I. This is a property of simple interest — not true for compound interest.

---

## Key Vocabulary

| Term | Definition |
|------|-----------|
| **Simple Interest** | Interest calculated only on the original principal; does not compound |
| **Principal (P)** | The original amount borrowed or invested |
| **Rate (R)** | The annual interest rate, expressed as a decimal in calculations |
| **Time (T)** | The duration of the loan or investment, expressed in years |
| **Maturity Value** | The total amount owed or received at the end of the term; also called Ending Balance |
| **Exact Interest** | Day-based interest calculated using 365 days per year |
| **Ordinary Interest** | Day-based interest calculated using 360 days per year (Banker's Rule) |
| **Banker's Rule** | The convention of using 360 days to calculate daily interest, favoring the lender |

---

*⚠ I Can statements for this lesson are instructor drafts — not yet confirmed in Notion. Confirm before distributing to students.*

*Pre-reading for in-class use only. Questions go in the Canvas homework quiz — do not embed in this document.*
