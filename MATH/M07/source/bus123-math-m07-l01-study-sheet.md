# Math M03-M07 | Test Study Sheet

<!-- Maintained source. Rebuild the PDF only when requested. No page footer or page numbers. -->

## M03 | Trade, chain & cash discounts

### Complement / percent paid

```excel
=1-d
```

30% off: 1 - 30% = 70% paid.

### Discount amount

```excel
=ListPrice*d
```

$189.99 x 30% = $57.00 saved.

### Net price: one discount

```excel
=ListPrice*(1-d)
```

$189.99 x 70% = $132.99 paid.

### Net price: chain discounts

```excel
=ListPrice*(1-d1)*(1-d2)*(1-d3)
```

$64 x 80% x 90% x 95% = $43.78.

### Single equivalent discount

```excel
=1-(1-d1)*(1-d2)*(1-d3)
```

20/10/5: 1 - 0.684 = 31.6%. Also =1-NetPrice/ListPrice.

### Cash discount savings

```excel
=Invoice*CashRate
```

$4,200 x 2% = $84 saved if payment qualifies.

### Qualifying cash payment

```excel
=Invoice*(1-CashRate)
```

$4,200 x 98% = $4,116 paid.

### Test eligibility with IF

```excel
=IF(PaymentDay<=DeadlineDay,1,0)
```

Day 12, deadline 15: result 1 (Yes). Day 16: 0 (No).

### Check before you finish

- 2/10 net 30 means 2% off within 10 days; full payment due by day 30.
- Each chain discount applies to the reduced price. Never add the rates.
- Savings and payment are different outputs. Outside the discount window, pay the full invoice.

## M04 | Markup & markdown

### Markup dollars

```excel
=SellingPrice-Cost
```

$26.10 - $18 = $8.10.

### Markup on cost / on selling price

```excel
=MarkupAmount/Cost   |   =MarkupAmount/SellingPrice
```

$8.10 / $18 = 45%; $8.10 / $26.10 = 31.03%.

### Selling price: markup on cost

```excel
=Cost*(1+MarkupRate)
```

$18 x 1.45 = $26.10.

### Markdown price / markdown dollars

```excel
=OriginalPrice*(1-MarkdownRate)
```

$52 x 80% = $41.60. Reduction: $52 x 20% = $10.40.

### Sellable units after waste

```excel
=ProducedUnits*(1-WasteRate)
```

120 x 85% = 102 sellable boxes.

### Target revenue / required price

```excel
=ProducedUnits*CostPerUnit*(1+MarkupRate)
=TargetRevenue/SellableUnits
```

120 x $18 x 1.45 = $3,132; $3,132 / 102 = $30.71 per box.

### Check before you finish

- Waste leaves fewer units to recover the cost of all units produced. Keep precision until the final result.

## M05 | Payroll & straight-line depreciation

### Salary per pay period

```excel
=AnnualSalary/PayPeriods
```

$52,000 / 52 = $1,000 weekly; / 12 = $4,333.33 monthly.

### Regular pay

```excel
=MIN(Hours,Cap)*Rate
```

43 hours, 40-hour cap, $44/hour: 40 x $44 = $1,760.

### Overtime pay / gross pay

```excel
=MAX(Hours-Cap,0)*Rate*Multiplier
=RegularPay+OvertimePay
```

3 x $44 x 1.5 = $198 overtime; gross = $1,958 before deductions.

### Same-schedule team pay / service hours

```excel
=TeamSize*GrossPay   |   =TeamSize*Hours
```

9 x $1,958 = $17,622; 9 x 43 = 387 service hours.

### Equal-share alternative: team hours

```excel
=MIN(RequiredHours,TeamSize*Cap)
=MAX(RequiredHours-TeamSize*Cap,0)
```

10 nurses, 387 hours, cap 40: regular = 387, overtime = 0. Average = 387 / 10 = 38.7 hours.

### Alternative wages / weekly savings

```excel
=RegularTeamHours*Rate+OTTeamHours*Rate*Multiplier
=CurrentWages-AlternativeWages
```

387 x $44 = $17,028; $17,622 - $17,028 = $594 saved weekly.

### Annual savings / avoided OT premium

```excel
=WeeklySavings*52
=OTHours*Rate*(Multiplier-1)
```

$594 x 52 = $30,888 yearly; 27 x $44 x 0.5 = $594 premium avoided.

### Annual straight-line depreciation

```excel
=(Cost-ResidualValue)/UsefulLife
```

($84,000 - $12,000) / 6 = $12,000 per year.

### Accumulated depreciation / book value

```excel
=AnnualExpense*Year
=Cost-AccumulatedDepreciation
```

Year 3: $12,000 x 3 = $36,000 accumulated; $84,000 - $36,000 = $48,000 book value.

### Check before you finish

- MIN caps regular hours. MAX prevents negative overtime. Apply the supplied cap and multiplier.
- Team-hour formulas assume equal sharing under the lesson schedule. Benefits and hiring costs are excluded.
- Book value uses accumulated depreciation. Year 6 ends at $12,000 residual; do not extend past useful life.
- Depreciation is an expense allocation, not a new annual cash payment or market value.

## M06 | Inventory & COGS

### Layer cost / units left / ending value

```excel
=UnitsSold*UnitCost
=AvailableUnits-UnitsSold   |   =UnitsLeft*UnitCost
```

First FIFO layer: 10 x $16 = $160 cost sold; 10 - 10 = 0 left.

### FIFO: assign oldest costs first

```excel
=10*16+20*20
```

COGS = $560; ending inventory = 20 x $22 = $440.

### LIFO: assign newest costs first

```excel
=20*22+10*20
```

COGS = $640; ending inventory = 10 x $16 + 10 x $20 = $360.

### Weighted-average unit cost

```excel
=TotalCostAvailable/TotalUnitsAvailable
```

$1,000 / 50 = $20 per hoodie. Use quantities as weights.

### WAC COGS / ending inventory

```excel
=UnitsSold*WACUnitCost   |   =UnitsLeft*WACUnitCost
```

30 x $20 = $600 COGS; 20 x $20 = $400 ending inventory.

### Goods available / COGS

```excel
=BeginningInventory+Purchases
=GoodsAvailable-EndingInventory
```

$160 + $840 = $1,000 available. FIFO: $1,000 - $440 = $560 COGS.

### Revenue / gross profit / gross margin

```excel
=UnitsSold*SellingPrice
=Revenue-COGS   |   =GrossProfit/Revenue
```

Revenue $1,200; FIFO gross profit $640; margin $640 / $1,200 = 53.33%.

### Margin versus markup / conversions

```excel
=(Price-Cost)/Price   |   =(Price-Cost)/Cost
=Markup/(1+Markup)   |   =Margin/(1-Margin)
```

$40 price, $20 cost: margin 50%, markup 100%. 100% / (1 + 100%) = 50%.

### Check before you finish

- Reconcile units sold + units left = available; COGS + ending inventory = total available cost.
- A balanced total does not prove FIFO or LIFO: check the layer order too.
- Overstated ending inventory understates current COGS and overstates current profit.

## M07 | Sales, vehicle excise & property taxes

### Taxable subtotal

```excel
=Price-TradeDiscount
```

Tidal order: $480 - $80 = $400 taxable.

### Sales tax owed

```excel
=TaxableSubtotal*TaxRate
```

$400 x 6.25% = $25.

### Total customer payment

```excel
=TaxableSubtotal+Tax+Shipping
```

$400 + $25 + $15 = $440.

### Back-calculate pre-tax sales

```excel
=TaxInclusiveReceipts/(1+TaxRate)
```

$52,000 / 1.0625 = $48,941.18 pre-tax sales. Assumes all receipts subject to the same rate, no shipping.

### Collected tax in inclusive receipts

```excel
=TaxInclusiveReceipts-PreTaxSales
```

$52,000 - $48,941.18 = $3,058.82 collected tax.

### Vehicle excise value

```excel
=OriginalListPrice*YearPercent
```

Meridian car: $32,000 original list x 60% (second year) = $19,200.

### Annual vehicle excise

```excel
=ExciseValue/1000*25
```

$19,200 / 1,000 x $25 = $480 annual excise; full-year example.

### Property: thousands of assessed value

```excel
=AssessedValue/1000
```

Meridian illustrative office: $820,000 / 1,000 = 820.

### Annual property tax

```excel
=AssessedValue/1000*LocalRatePer1000
```

Beverly FY2026 commercial example: 820 x $20.98 = $17,203.60.

### Monthly amount to set aside

```excel
=AnnualTax/12
```

Property: $17,203.60 / 12 = $1,433.63. Vehicle: $480 / 12 = $40.

### Check before you finish

- Vehicle-year percentages: manufacture 90%; second 60%; third 40%; fourth 25%; fifth and later 10%.
- Property rates supplied in M07: commercial $20.98; residential $10.81 per $1,000, FY2026.
- Use assessed value directly for property. Use original manufacturer list price for vehicle excise.
- A rate per $1,000 is a dollar rate, not a percent. Monthly savings are budgeting amounts, not bill frequency.
- Collected sales tax is a liability, not sales revenue. Examples assume no exemptions or abatements.
