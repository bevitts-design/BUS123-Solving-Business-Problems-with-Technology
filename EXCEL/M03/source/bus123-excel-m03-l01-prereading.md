---
title: "Excel Functions for Business Analysis"
lesson: "EXCEL-M03-L01"
kind: "Pre-Reading"
status: "published"
output: "EXCEL/M03/bus123-excel-m03-l01-prereading.pdf"
---

# Excel Functions for Business Analysis

**Course:** BUS123 - Solving Business Problems with Technology
**Track:** Excel
**Module:** M03
**Lesson:** L01

This lesson is about using Excel functions to turn messy business data into useful answers. You do not need to memorize hundreds of functions. The goal is to understand the patterns behind the functions that handle most everyday business analysis work.

By the end of this reading, you should be able to explain what a function does, recognize when a formula should spill into multiple cells, and choose a useful function based on the business question.

## 1. From Basic Formulas to Functions

Excel formulas always begin with an equals sign. A basic formula can use arithmetic operators:

| Operator | Meaning | Example |
| --- | --- | --- |
| `+` | Add | `=B2+C2` |
| `-` | Subtract | `=B2-C2` |
| `*` | Multiply | `=B2*C2` |
| `/` | Divide | `=B2/C2` |
| `^` | Exponent | `=B2^2` |

For example, Tidal Goods Co. can calculate product revenue with:

`=Units_Sold*Unit_Price`

Functions are named formulas that perform a specific task. Instead of writing a long manual formula like:

`=B2+B3+B4+B5+B6+B7+B8+B9+B10+B11+B12+B13`

you can use:

`=SUM(B2:B13)`

The function version is shorter, easier to read, and safer when rows are inserted inside the range.

> **Key Idea**
> A function is not magic. It is a named formula that takes one or more inputs, called arguments, and returns an answer.

## 2. The Core Summary Functions

Many business questions begin with summary functions.

| Function | Syntax | Business Question |
| --- | --- | --- |
| `SUM` | `=SUM(range)` | What is the total? |
| `AVERAGE` | `=AVERAGE(range)` | What is typical? |
| `MAX` | `=MAX(range)` | What is the highest value? |
| `MIN` | `=MIN(range)` | What is the lowest value? |
| `COUNT` | `=COUNT(range)` | How many cells contain numbers? |
| `COUNTA` | `=COUNTA(range)` | How many cells contain anything? |

Anchor & Oak Events might use these functions to summarize monthly event revenue. `SUM` answers total annual revenue. `AVERAGE` gives a typical month. `MAX` and `MIN` identify the strongest and weakest months. `COUNT` and `COUNTA` help check whether the data is complete.

> **Common Mistake**
> Do not start a numeric range on a header row. `=COUNT(F6:F18)` may look close, but if row 6 is a header, the formula is asking Excel to count the wrong range. Start on the first data row: `=COUNT(F7:F18)`.

## 3. The Great Shift: Dynamic Arrays and Spilling

Older Excel often followed a "one formula, one cell" mindset. If you needed a formula to fill ten rows, you wrote it once and dragged it down.

Modern Excel can work differently. A dynamic array formula can return many values from one formula. The results automatically fill nearby empty cells. This is called **spilling**.

| Feature | Traditional Calculation | Modern Dynamic Arrays |
| --- | --- | --- |
| Output | One formula returns one result. | One formula can return many results. |
| Manual work | Often requires dragging or copying. | Results spill automatically. |
| Range behavior | Static ranges can miss new data. | Spilled results can grow or shrink. |
| Error risk | Copying errors are common. | One formula controls the full output. |

Spilling matters because it makes workbooks faster, cleaner, and easier to maintain. If a source table changes, a dynamic array result can update automatically instead of forcing the user to re-copy formulas.

## 4. The Spill Range and the Hash Sign

When a dynamic array formula spills, the first cell is the formula cell. The cells around it are spill results.

If the formula starts in `E2`, the whole spilled range can be referenced as:

`=E2#`

The hash sign tells Excel to use the entire spilled result, even if it grows or shrinks later.

| Reference Type | Meaning |
| --- | --- |
| `$A$1:$A$10` | A fixed range. It does not automatically follow a spill. |
| `E2` | Only the first cell of the spill. |
| `E2#` | The full spilled range that starts in E2. |

This is one of the most important ideas in modern Excel. A formula can create a live list, and another formula can refer to the full list with `#`.

> **Why It Matters**
> If a `UNIQUE` list grows from five departments to seven departments, `E2#` grows with it. A downstream formula or drop-down list can stay synced without manual editing.

## 5. UNIQUE, SORT, and FILTER

Three dynamic array functions do a lot of everyday data organization work.

| Function | Core Purpose | Typical Spill Direction |
| --- | --- | --- |
| `UNIQUE` | Extracts distinct values from a list. | Down rows or across columns. |
| `SORT` | Reorders data alphabetically or numerically. | Same shape as the source. |
| `FILTER` | Extracts records that meet criteria. | Across columns and down rows. |

`UNIQUE` is useful for cleaning repeated categories. `SORT` makes the result organized. Together, they can replace a lot of manual sorting and duplicate removal.

`=SORT(UNIQUE(Department_Column))`

`FILTER` extracts rows that meet a condition. Harborside Medical Center could use it to pull patient billing records above a threshold:

`=FILTER(A2:F200,F2:F200>500,"No matches")`

The key is the include argument. Excel evaluates each row as TRUE or FALSE. Rows that evaluate to TRUE spill into the result.

## 6. Logic: IF, AND, and OR

Functions can also make decisions. The `IF` function checks a condition and returns one result if the condition is true and another if the condition is false.

`=IF(logical_test,value_if_true,value_if_false)`

Meridian Advisory Group might flag payroll records like this:

`=IF([@[Hours Worked]]>40,"Overtime","Regular")`

Sometimes one condition is not enough.

| Function | Use When | Example Pattern |
| --- | --- | --- |
| `AND` | Every condition must be true. | `=AND([@Department]="Nursing",[@Hours]>40)` |
| `OR` | At least one condition must be true. | `=OR([@Priority]="High",[@Priority]="Critical")` |

A common beginner mistake is writing:

`=OR([@Priority]="Critical","High")`

Excel cannot guess that "High" should also be compared to `[@Priority]`. You must repeat the full condition:

`=OR([@Priority]="Critical",[@Priority]="High")`

## 7. Conditional Reporting with SUMIFS and COUNTIFS

Business reporting often asks questions with conditions:

- What is total revenue for one region?
- How many records are late?
- What is the total for one department and one status?

The plural `IFS` functions are usually the best default because they can handle one condition or many.

| Function | Use It To | Example |
| --- | --- | --- |
| `SUMIFS` | Add values that meet one or more criteria. | `=SUMIFS(Sales,Region,"North",Category,"Kitchen")` |
| `COUNTIFS` | Count rows that meet one or more criteria. | `=COUNTIFS(Status,"Late",Department,"Nursing")` |
| `AVERAGEIFS` | Average values that meet one or more criteria. | `=AVERAGEIFS(Sales,Region,"North")` |

Tidal Goods Co. might use `SUMIFS` to total sales for a category and region. Harborside Medical Center might use `COUNTIFS` to count late timesheets by department.

> **Better Practice**
> Link criteria to input cells when possible. A report that uses `=SUMIFS(Sales,Region,C9)` is easier to update than a formula that hard-codes `"North"` in every cell.

## 8. XLOOKUP: The Modern Connector

`XLOOKUP` connects tables. It finds a lookup value in one range and returns a matching value from another range.

`=XLOOKUP(lookup_value,lookup_array,return_array,if_not_found)`

Meridian Advisory Group might use `XLOOKUP` to find an hourly rate based on an employee ID:

`=XLOOKUP(A2,EmployeeTable[Employee ID],EmployeeTable[Hourly Rate],"Check ID")`

Compared with older lookup functions, XLOOKUP is more flexible. It can look left or right, can return more than one column, and includes a built-in not-found message.

## 9. Date and Schedule Helpers

Excel dates are numbers behind the scenes, which means functions can calculate schedules.

| Function | Purpose | Example |
| --- | --- | --- |
| `EOMONTH` | Returns the last day of a month. | `=EOMONTH(A2,0)` |
| `WORKDAY.INTL` | Returns a workday while skipping custom weekends or holidays. | `=WORKDAY.INTL(A2,10,"0000011")` |
| `SEQUENCE` | Generates a list of numbers. | `=SEQUENCE(12)` |

`SEQUENCE` becomes especially useful when paired with date functions. A monthly report can generate month numbers or month-end dates without typing each row manually.

`=EOMONTH(Start_Date,SEQUENCE(12)-1)`

## 10. Troubleshooting Function Errors

Most Excel errors are clues. Read the clue before changing the formula.

| Error | Likely Meaning |
| --- | --- |
| `#######` | The column is too narrow to display the value. |
| `#NAME?` | Excel does not recognize text in the formula, often because of a typo. |
| `#VALUE!` | One or more arguments are the wrong type. |
| `#DIV/0!` | The formula is dividing by zero or a blank denominator. |
| `#REF!` | The formula refers to a deleted or invalid cell. |
| `#SPILL!` | The spill range is blocked or cannot expand. |

When a formula does not work, ask these questions:

1. Does the formula start with `=`?
2. Are all parentheses closed?
3. Are text criteria inside quotation marks?
4. Does the range start on the first data row?
5. Does the formula need an absolute reference?
6. Is the spill range empty?
7. Does the answer match the business question?

## 11. The 80/20 Function Toolkit

Excel has hundreds of functions, but a small toolkit handles most early business analysis work:

| Toolkit Area | Functions |
| --- | --- |
| Basic summaries | `SUM`, `AVERAGE`, `MAX`, `MIN`, `COUNT`, `COUNTA` |
| Logic | `IF`, `AND`, `OR` |
| Conditional reporting | `SUMIFS`, `COUNTIFS`, `AVERAGEIFS` |
| Lookup | `XLOOKUP` |
| Dynamic arrays | `FILTER`, `SORT`, `UNIQUE`, `SEQUENCE` |
| Text cleanup | `TEXTJOIN` |
| Dates | `EOMONTH`, `WORKDAY.INTL` |
| Multi-row math | `SUMPRODUCT` |

This lesson skips custom function building with `LAMBDA`. That is a powerful advanced tool, but it is not the first priority for BUS123. The first priority is choosing the right built-in function for the business question.

## Check Your Understanding

Answer these before class.

1. What is the main difference between a traditional formula copied down a column and a dynamic array formula?
2. What does the `#` symbol do when placed after the first cell of a spilled result?
3. Which function would return a clean list of unique department names?
4. Which function would extract all rows where a balance is greater than `$500`?
5. Why is `=OR([@Priority]="Critical","High")` incorrect?
6. When would you use `SUMIFS` instead of `SUM`?
7. What does `#SPILL!` usually mean?
8. Why is `XLOOKUP` generally better than older lookup tools for new Excel work?

## Key Vocabulary

| Term | Meaning |
| --- | --- |
| Function | A named formula that performs a specific task. |
| Argument | An input a function needs inside its parentheses. |
| Dynamic Array | A formula result that can return multiple values. |
| Spill | The behavior where dynamic array results fill neighboring cells. |
| Spill Range | The full output range created by a dynamic array formula. |
| Hash Reference | A reference like `E2#` that points to the full spill range. |
| Criteria | A rule or condition used by a function. |
| Structured Reference | A table-based reference that uses column names instead of cell coordinates. |
