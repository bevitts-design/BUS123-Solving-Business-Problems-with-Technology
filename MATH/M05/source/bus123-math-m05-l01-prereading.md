---
title: "BUS 123 — MATH-M05-L01 — Payroll and Depreciation"
lesson: "MATH-M05-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M05/bus123-math-m05-l01-prereading.pdf"
---

# BUS 123 · MATH-M05-L01 · Payroll and Depreciation

**Course:** Solving Business Problems with Technology · Fall 2026
**Case:** Harborside Medical Center

## 1 · One Management Brief, Two Models

Harborside's director asks: **What changes this week's wages, and how do we recognize equipment cost across years of service?** You will build one payroll model and extend it from one nurse to a staffing comparison. Then you will build one equipment model. The final challenge changes assumptions in those same models instead of asking you to start over.

Payroll creates current wage cash needs. Depreciation allocates an earlier equipment purchase across the periods benefiting from it. Depreciation is not a new cash payment each year, and a lower depreciation estimate does not itself save cash.

| Model | Time horizon | What the result means |
|---|---|---|
| Payroll | This week's service hours | Recurring wages and current cash needs |
| Equipment | Years of useful life | Allocation of an earlier purchase, not a new annual cash payment |

Use the same routine each time:

1. **Identify inputs:** What values and units does the problem give you?
2. **Label:** Choose clear input and output labels and your own cell locations.
3. **Calculate intermediate amounts:** Make each relationship visible.
4. **Calculate the result:** Link it to those intermediate amounts.
5. **Change one input:** Predict the direction, then test your model.
6. **Explain:** Connect the result to the business question and name a limitation.

Excel expressions below use descriptive names to explain relationships. These are not automatically defined Excel names. Replace them with references to the cells you choose in your worksheet.

## 2 · Build One Nurse's Pay, Then Extend It

### Salary warm-up

An employee earns $52,000 per year across 52 weekly pay periods. Use `=AnnualSalary/PayPeriods`. The weekly check is $1,000. Monthly pay uses 12 periods and gives $4,333.33 per check. Annual salary stays the same. Biweekly normally uses 26 periods; semimonthly uses 24.

### One nurse: three connected calculations

One nurse works **43 hours at $44/hour**. The regular-hours cap is **40**, and overtime pays **1.5 times** the rate. Label those four inputs before calculating.

| Step | Excel relationship | Result |
|---|---|---|
| Regular pay | `=MIN(Hours,Cap)*Rate` | 40 × $44 = $1,760 |
| Overtime pay | `=MAX(Hours-Cap,0)*Rate*Multiplier` | 3 × $44 × 1.5 = $198 |
| Gross pay | `=RegularPay+OvertimePay` | $1,958 |

`MIN` selects the smaller of hours worked and the regular cap. `MAX` prevents negative overtime. At **39 hours**, regular and gross pay are $1,716 and overtime is $0. Gross pay is earnings before deductions, not take-home pay.

Keep regular pay and overtime pay as separate intermediate results. A long combined formula is possible, but the separate steps make your model easier to inspect and explain.

### Extend to nine nurses

Harborside schedules **nine nurses**, each working those same 43 hours. Keep using your one-nurse inputs and results. Add a team-size input rather than retyping the rate and overtime rules.

| Team output | Relationship | Result |
|---|---|---|
| Required service hours | Team size × hours per nurse | 387 hours |
| Team regular pay | Team size × one-nurse regular pay | $15,840 |
| Team overtime pay | Team size × one-nurse overtime pay | $1,782 |
| Team gross payroll | Team regular pay + team overtime pay | $17,622 |

### Extend the same model to ten nurses at equal coverage

The question is now: **Can ten nurses provide those same 387 service hours at lower wage cost?** Assume the hours can be shared equally. Hold required hours, hourly rate, and overtime rules constant. Changing both headcount and total service hours would not answer the same question.

- Average hours per nurse: `=RequiredHours/AlternativeTeam`
- Regular team hours: `=MIN(RequiredHours,AlternativeTeam*Cap)`
- Overtime team hours: `=MAX(RequiredHours-AlternativeTeam*Cap,0)`
- Alternative wages: `=RegularHours*Rate+OvertimeHours*Rate*Multiplier`

| Output | Nine nurses | Ten nurses |
|---|---|---|
| Required service hours | 387 | 387 |
| Average hours per nurse | 43 | 38.7 |
| Regular team hours | 360 | 387 |
| Overtime team hours | 27 | 0 |
| Weekly wages | $17,622 | $17,028 |

The difference is **$594 per week**, or **$30,888 across 52 weeks**. This is the extra overtime premium avoided: `=27*44*(1.5-1)`. Both options still pay for all 387 service hours.

The model supports a wage-only comparison. Hiring, benefits, training, scheduling, and continuity of care could change the recommendation. Equal total hours also does not guarantee that every shift or role is covered appropriately.

## 3 · Build One Equipment Cost Model

Return to the management brief. Payroll concerns current wages; the ultrasound model concerns recognizing an earlier purchase across years of service.

Harborside purchased an ultrasound unit for **$84,000**. Its estimated **residual value is $12,000** after a **six-year useful life**.

| Quantity | Meaning | Excel relationship |
|---|---|---|
| Annual depreciation expense | One year's allocation | `=(Cost-ResidualValue)/UsefulLife` |
| Accumulated depreciation | All allocations through a selected year | `=AnnualExpense*Year` |
| Book value | Recorded cost remaining | `=Cost-AccumulatedDepreciation` |

Annual expense is ($84,000 − $12,000) ÷ 6 = **$12,000**. Build one schedule using the same input cells throughout:

| Year | Annual expense | Accumulated depreciation | Book value |
|---|---|---|---|
| 1 | $12,000 | $12,000 | $72,000 |
| 2 | $12,000 | $24,000 | $60,000 |
| 3 | $12,000 | $36,000 | $48,000 |
| 4 | $12,000 | $48,000 | $36,000 |
| 5 | $12,000 | $60,000 | $24,000 |
| 6 | $12,000 | $72,000 | $12,000 |

Expense stays constant; accumulated depreciation rises; book value falls to residual. Subtracting one year's expense gives book value only in the first year.

**Copying formulas:** use `$` to keep shared input references fixed while the year changes. If your annual expense is in B68, `=$B$68` keeps that input fixed. A formula such as `=B72*A72` moves to the next year when copied down. Your own model may use different addresses.

Book value is an accounting amount, not necessarily market value. It cannot determine a replacement date by itself. A replacement decision needs evidence about condition, reliability, maintenance, service demand, and the costs of alternatives.

## 4 · Test Your Existing Models

In class, record these tests in **Class Challenge**. Use the models already built on **Live You Try It**; do not rebuild them. Predict first, change one input, record the effect, and restore the original input.

### Payroll test

Change the hourly rate from **$44 to $46**. Keep 387 service hours, nine versus ten nurses, the 40-hour cap, and the 1.5× multiplier unchanged. Observe nurse gross pay, both team wages, and weekly/annualized savings. Explain which staffing option has lower wages and one factor the model omits. Restore $44.

### Equipment test

Change the estimated useful life from **six to eight years**. Keep cost and residual unchanged. Observe annual depreciation and its difference from the original expense. Does the lower annual expense prove a cash saving or that the unit can safely operate longer? Restore six years before checking the original schedule's endpoint.

An eight-year estimate needs eight years for a complete revised schedule. Year 6 is not its endpoint. This test concerns annual expense; restore six years afterward.

### Check your understanding before class

1. Why do regular and overtime pay belong in separate intermediate calculations?
2. What should the overtime result be when hours worked are below the cap?
3. Why must both staffing options provide 387 hours?
4. Why is the additional overtime premium smaller than all overtime-hours pay?
5. How do annual expense, accumulated depreciation, and book value differ?
6. What changes when estimated useful life increases, and what does that change fail to prove?

## 5 · Bring to Class

Be ready to label your own inputs and construct models in empty worksheet spaces. Keep one payroll model as the case grows from one nurse to nine nurses and then a ten-nurse comparison. Keep one equipment schedule for the useful-life test. Use slide reveals after your attempts; different correct layouts are welcome.

The interactive decision lab is an **optional cross-check after Excel work**. Your models and final explanations stay in the workbook.

**Background vocabulary:** hourly pay varies with hours; salary distributes fixed annual compensation across periods. Per-visit pay and incentive pay reward different behaviors. In class, focus on salary conversion, hourly payroll, and depreciation.
