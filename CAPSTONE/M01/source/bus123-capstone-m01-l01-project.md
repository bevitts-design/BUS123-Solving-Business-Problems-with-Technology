---
course: BUS123
track: capstone
module: M01
lesson: L01
title: Northstar Athletic Studio Finance Capstone
status: example
student_facing: true
---

# Northstar Athletic Studio Finance Capstone

## Business Scenario

Northstar Athletic Studio is a new indoor cycling studio preparing to open near a college town. The founder needs financing for bikes, sound equipment, renovation, booking software, launch marketing, and an initial cash cushion.

Your role is to build an Excel model that helps the founder answer this question:

> Which financing option gives Northstar Athletic Studio the best chance of surviving its first year?

Your recommendation should use numbers from your workbook and explain the tradeoff between monthly cash flow, ownership, fixed payments, and membership growth assumptions.

This is both a formatting project and a calculation project. The starter workbook gives you the case data, but you are responsible for building the model tabs, adding row labels, adding column headers, formatting tables, writing formulas, creating charts, and designing the final dashboard.

You may use approved course resources, Excel help, and your own notes, but you must be able to explain every formula, formatting choice, chart, and recommendation in your workbook. Work that cannot be explained may lose credit even if the final workbook appears complete.

## Financing Options

Northstar needs $85,000 to launch. You will compare three financing options:

1. Bank loan: $85,000 borrowed, 8.25% APR, 5-year term, monthly payments.
2. Equipment financing: $50,500 financed, 10.5% APR, 4-year term. The remaining startup costs are paid with owner savings.
3. Investor funding: Investor contributes $85,000 and receives 18% of positive monthly operating profit for 5 years.

## Startup Costs

| Item | Cost |
|---|---:|
| Studio bikes | $42,000 |
| Sound system and lighting | $8,500 |
| Renovation and flooring | $16,000 |
| Booking/payment software setup | $2,500 |
| Opening marketing campaign | $6,000 |
| Permits, legal, insurance deposits | $4,000 |
| Initial cash cushion | $6,000 |
| Total funding needed | $85,000 |

## Revenue Assumptions

| Revenue Source | Assumption |
|---|---:|
| Monthly membership price | $119 |
| Average drop-in class price | $22 |
| Drop-in visits per month | 140 |
| Private event revenue per month | $600 |

## Membership Scenarios

| Month | Conservative Members | Expected Members | Optimistic Members |
|---:|---:|---:|---:|
| 1 | 80 | 110 | 135 |
| 2 | 90 | 125 | 155 |
| 3 | 100 | 140 | 175 |
| 4 | 108 | 155 | 195 |
| 5 | 115 | 165 | 210 |
| 6 | 120 | 175 | 225 |
| 7-12 | Hold Month 6 level | Hold Month 6 level | Hold Month 6 level |

## Monthly Operating Costs

| Expense | Monthly Cost |
|---|---:|
| Rent | $5,200 |
| Instructor payroll | $7,800 |
| Front desk/admin payroll | $2,400 |
| Utilities | $850 |
| Insurance | $650 |
| Software subscription | $375 |
| Cleaning and supplies | $500 |
| Marketing after launch | $1,200 |

## Required Workbook Build

Your starter workbook includes only:

1. `START HERE`: project overview and submission checklist.
2. `Assumptions`: the business facts you should use for your model.

You must create the remaining workbook tabs yourself. Your completed workbook should include:

1. `Startup Budget`: organize launch costs and confirm the total funding needed.
2. `Financing Model`: calculate fixed monthly payments using PMT for the debt options and model the investor option as a profit share.
3. `Revenue Forecast`: calculate monthly revenue under conservative, expected, and optimistic membership scenarios.
4. `Cash Flow Model`: compare monthly first-year cash flow for all three financing options.
5. `Break-Even Analysis`: estimate how many members are needed to cover monthly operating costs and financing obligations.
6. `Dashboard`: summarize the decision with charts and key metrics.
7. `Recommendation`: explain the recommended financing option and the risks to monitor.

## Workbook Construction Instructions

### 1. Create Your Model Tabs

Create new worksheet tabs with clear names. Put them in a logical order from inputs to outputs. A strong order is:

1. `START HERE`
2. `Assumptions`
3. `Startup Budget`
4. `Financing Model`
5. `Revenue Forecast`
6. `Cash Flow Model`
7. `Break-Even Analysis`
8. `Dashboard`
9. `Recommendation`

### 2. Build the Startup Budget Tab

Create a clean table with columns for startup cost item and cost. Link the cost values from the `Assumptions` tab instead of retyping them. Add a total row for total funding needed.

Formatting requirements:

- Use a bold title at the top.
- Format dollar amounts as currency.
- Use a distinct fill color for the table header.
- Use a border or shading to make the total row stand out.
- Make sure item names and dollar amounts are readable.

### 3. Build the Financing Model Tab

Create a table comparing the bank loan, equipment financing, and investor funding options.

Your table should include:

- Financing option
- Amount financed
- APR
- Term in years
- Monthly fixed payment
- Profit-share percentage
- Notes about risk or ownership

Use Excel's `PMT` function to calculate the bank loan and equipment financing payments. Remember that APR is annual but payments are monthly, so the rate should be divided by 12 and the number of years should be multiplied by 12.

For investor funding, the monthly fixed payment should be $0. The investor payment will be calculated later as a share of positive monthly operating profit.

Course skill reminder:

- PMT was covered in the time value of money lesson. Use the same monthly rate and monthly period logic here.
- Break-even was covered in the pricing lesson. Use contribution logic: what amount is available each month to cover the costs that still need to be paid?
- For the investor payment, remember the same guardrail logic used in overtime formulas: use a function such as `MAX` when a value should not drop below zero. Your job is to adapt that idea to positive monthly operating profit without typing the calculated answer manually.

Formatting requirements:

- Format APR and profit share as percentages.
- Format payments as currency.
- Use formula cells rather than typed calculated answers.
- Add short notes that explain fixed debt payment risk versus investor ownership tradeoff.

### 4. Build the Revenue Forecast Tab

Create a 12-month revenue forecast. You may build one table per scenario or one combined table with conservative, expected, and optimistic sections.

For each month, calculate:

- Membership revenue
- Drop-in revenue
- Private event revenue
- Total revenue

Use the membership counts and revenue assumptions from the `Assumptions` tab. Do not type calculated revenue values manually.

Formatting requirements:

- Months should be clearly labeled from 1 to 12.
- Scenario names should be easy to identify.
- Revenue values should be formatted as currency.
- Use consistent table formatting across the scenarios.

### 5. Build the Cash Flow Model Tab

Create a 12-month cash flow comparison for all three financing options using the expected membership scenario.

For each month, calculate:

- Expected revenue
- Monthly operating costs
- Bank loan financing cost
- Bank loan cash flow
- Equipment financing cost
- Equipment financing cash flow
- Investor payment
- Investor funding cash flow

The investor receives 18% of positive monthly operating profit. If operating profit is negative, the investor payment should be $0. Use a formula such as `MAX` to prevent negative investor payments.

Formatting requirements:

- Negative cash flow should be easy to identify.
- Use currency formatting throughout.
- Use formulas linked to your earlier tabs.
- Include a summary area for lowest monthly cash flow and total first-year cash flow.

### 6. Build the Break-Even Analysis Tab

Estimate the number of members needed each month to cover operating costs and financing obligations under each financing option.

Your analysis should account for:

- Monthly operating costs
- Fixed financing payments where applicable
- Drop-in revenue
- Private event revenue
- Monthly membership price

Formatting requirements:

- Show break-even members for all three financing options.
- Round member counts appropriately.
- Add a short interpretation of what the break-even result means.

### 7. Build the Dashboard Tab

Design a dashboard that helps the founder compare the options quickly.

Your dashboard should include:

- Monthly fixed financing cost by option
- Lowest monthly cash flow by option
- Total first-year cash flow by option
- Break-even members by option
- At least one chart comparing financing options
- At least one chart or visual showing cash flow over time
- A clear recommended option

Formatting requirements:

- Use a professional layout with aligned sections.
- Use consistent colors, fonts, and number formats.
- Make the dashboard readable without needing to inspect every formula.
- Avoid clutter. Highlight the metrics that matter most for the decision.

### 8. Build the Recommendation Tab

Write a short recommendation that answers the project question. Your recommendation should refer to specific metrics from your model.

Address:

- Which financing option you recommend.
- Why the numbers support that recommendation.
- What risk could make your recommendation change.
- Whether the owner is giving up cash, control, or flexibility.

## Recommendation Prompt

Write a short business recommendation that answers:

> Based on your model, which financing option gives Northstar Athletic Studio the best chance of surviving its first year?

Your answer should use numbers from your workbook and explain the tradeoff between risk, ownership, monthly cash flow, and growth assumptions.

## Process Evidence and Checkpoints

Because this project assesses how you build a spreadsheet model, you must submit evidence of your process in addition to the finished workbook.

### Build Log

Create a `Build Log` section in your `Recommendation` tab or add a separate `Build Log` tab. Write 5-8 short bullets that explain how you built the workbook.

Include:

- Which tabs you created first and why.
- One formatting choice that made the workbook easier to read.
- One formula or model section you had to revise.
- One check you used to make sure the model was reasonable.
- One decision you made about the dashboard layout.

### Formula Explanations

Explain at least four formulas in plain English. Your explanations should be specific enough that someone could understand what the formula is doing without reading the formula itself.

Required explanations:

1. Bank loan monthly payment formula.
2. Equipment financing monthly payment formula.
3. Investor payment formula.
4. Break-even members formula.

### In-Class Checkpoint

During class, be prepared to show one partially built section of your workbook. Your instructor may ask to see:

- Your startup budget table.
- Your financing model table.
- Your cash flow model skeleton.
- Your first dashboard layout draft.

### Version Evidence

If you work in OneDrive or Excel online, keep your version history available. Your instructor may ask you to show how the workbook developed over time. Version history does not replace understanding, but it helps document your process.

### Short Defense

Be ready for a 2-3 minute explanation of your work. You may be asked:

- Walk me through your cash flow model.
- Explain how your investor payment formula works.
- Why did you recommend this financing option?
- What would change if expected membership was 10% lower?
- Which formatting choice made your workbook easier for a manager to read?

### Individual Variation

Your instructor may give you or your group one changed assumption, such as a different APR, rent amount, investor percentage, or membership forecast. If assigned, update your model and explain whether your recommendation changes.

## Deliverables

Submit:

1. Completed Excel workbook.
2. Short recommendation brief, either in the workbook or as a separate document.
3. Build log and formula explanations.
4. Version evidence if requested.
5. 3-5 slide or 3-minute walkthrough explaining your recommendation.

## Rubric

| Category | Points | What Strong Work Includes |
|---|---:|---|
| Workbook Structure and Formatting | 15 | Student-created tabs, row labels, column headers, readable layout, consistent formatting, and professional table design. |
| Startup Budget | 10 | Startup costs are organized, linked from assumptions, total funding needed is correct, and assumptions are clearly labeled. |
| Financing Calculations | 15 | PMT is used correctly, APR and term logic are accurate, and fixed payments are separated from investor funding. |
| Investor Profit-Share Logic | 10 | Investor payment is modeled as 18% of positive operating profit and does not create negative payments. |
| Revenue Forecast | 10 | Membership, drop-in, and event revenue are calculated correctly across all scenarios using linked formulas. |
| Cash Flow Model | 15 | Operating costs and financing costs are subtracted correctly, 12 months are modeled, and all three financing options are compared. |
| Break-Even Analysis | 10 | Break-even membership levels are calculated and interpreted in business terms. |
| Dashboard and Charts | 10 | Key results are presented clearly with useful charts, labels, summary metrics, and professional formatting. |
| Business Recommendation | 10 | Recommendation is clear, supported by evidence, and explains risk, ownership, and cash flow tradeoffs. |
| Process Evidence and Defense Readiness | 5 | Build log, formula explanations, checkpoint participation, and ability to explain the submitted workbook. |
| Total | 100 |  |

## Optional Extension

Run a stress test. Reduce expected members by 10% and explain whether your recommendation changes.
