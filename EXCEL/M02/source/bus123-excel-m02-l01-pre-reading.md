---
title: "Essential Functions: SUM, AVERAGE, MAX, MIN,"
lesson: "EXCEL-M02-L01"
kind: "Pre-Reading"
status: "draft-from-pdf"
output: "EXCEL/M02/bus123-excel-m02-l01-pre-reading.pdf"
---

# Essential Functions: SUM, AVERAGE, MAX, MIN,

COUNT Pre-Reading — Complete before class

## Connect to Prior Knowledge

Last class you built the three skills that every Excel user needs: navigating the interface, applying formatting that communicates clearly, and writing formulas with relative and absolute cell references. Today those skills become the platform for something more powerful. Excel functions are pre-built formulas that answer specific business questions — and they use the exact same reference rules you learned in L01. If you understand that B3 moves when copied and $B$1 stays locked, you already understand how ranges work inside functions. The only new thing today is the function name that wraps around the range. That is a much smaller learning lift than it looks.

## Concept Explanation

## Part A — What a Function Is

A function is a named, pre-built formula stored inside Excel. Instead of writing =B2+B3+B4+B5+B6+B7+B8+B9+B10+B11+B12+B13 to total twelve months of revenue, you write =SUM(B2:B13). Both produce the same result — but the function version has a critical advantage: if you insert a new row inside the range, Excel automatically expands the range to include it. The manual formula silently misses the new row with no error message. Every function follows the same pattern: function name, opening parenthesis, one or more arguments (the inputs the function needs), closing parenthesis. Learn this pattern once and you can use any function in Excel.

## Part B — The Five Functions and When to Use Each

Anchor and Oak Events is a boutique event planning company that handles weddings, corporate events, and private parties. Their monthly revenue data illustrates all five functions. SUM totals every number in a range. For Anchor and Oak, =SUM(B2:B13) gives the annual revenue across all twelve months. This is the most commonly used function in any business spreadsheet. AVERAGE calculates the arithmetic mean of a range. For Anchor and Oak, =AVERAGE(B2:B13) reveals what a typical month looks like — the benchmark against which every other month can be compared. A month below average is not necessarily bad, but knowing how far below matters.

<!-- page break -->

MAX returns the single highest value in a range. =MAX(B2:B13) identifies Anchor and Oak's peak revenue month — June, at $89,500 — driven by wedding season. MIN returns the single lowest: =MIN(B2:B13) reveals January at $18,400, the deepest slow season point. Together, MAX and MIN define the range of the data. COUNT counts cells that contain numbers. COUNTA counts cells that contain any content — numbers, text, or dates. If =COUNT(B2:B13) returns 10 in a 12-row range, two months have no revenue data entered. This makes COUNT a data-quality check, not just a counter. ■ Watch Out Never start your range on a header row. =COUNT(B1:B13) may include or exclude the header depending on whether it contains text or a number — and the behavior changes silently if the header is later edited. Always start on the first data row: =COUNT(B2:B13).

## Part C — References Inside Functions Follow the Same Rules

The range inside a function argument is a cell reference, and it obeys the same relative and absolute rules as any other reference. =SUM(B2:B13) uses a relative range — copy it one column right and it becomes =SUM(C2:C13). That is usually exactly what you want when applying the same function to multiple columns of data. When a formula needs to compare each row to a single fixed value — such as a budget target stored in one cell — that reference must be absolute. For Anchor and Oak, if the annual budget target is in cell E1, the formula =B2-$E$1 uses a relative reference for B2 (so it shifts down each row) and an absolute reference for $E$1 (so it always reads the same budget target). Press F4 after typing E1 to lock it.

Formula Reference Function Syntax Business Question Answered SUM =SUM(range) What is the total of all values in this range? AVERAGE =AVERAGE(range) What is the typical (mean) value in this range? MAX =MAX(range) What is the highest value in this range? MIN =MIN(range) What is the lowest value in this range? COUNT =COUNT(range)

## How many cells in this range contain numbers?

COUNTA =COUNTA(range)

## How many cells in this range contain any content?

Reminder: press F4 after typing a cell address inside any function argument to cycle through reference modes ($A$1 → A$1 → $A1 → A1).

<!-- page break -->

Check Your Understanding Answer all seven questions before class. Answers appear at the end of this document.

## 1. What advantage does =SUM(B2:B13) have over the manual formula =B2+B3+B4+...+B13 when rows

are inserted into the range?

## 2. Anchor and Oak Events has 12 months of revenue data in cells B2:B13. Write the formula that

calculates the average monthly revenue.

## 3. What does =MAX(B2:B13) return, and what business question does it answer for Anchor and Oak?

## 4. The formula =COUNT(B2:B13) returns 9 in a 12-row range. What does this tell you?

## 5. What is the difference between COUNT and COUNTA?

## 6. You write =SUM(B2:B13) in cell B14 and copy it to C14. What formula does Excel place in C14, and

why?

## 7. Anchor and Oak's budget target is in cell E1. You want to compare each monthly revenue (in B2:B13)

to that target in a formula copied down 12 rows. Write the formula for C2 using the correct reference types.

## Key Vocabulary

Function A named, pre-built formula in Excel that performs a specific calculation on a range of cells or values. Argument The input(s) a function requires, placed inside the parentheses (e.g., the range in =SUM(B2:B13)). Range A rectangular block of cells referenced by their start and end addresses, separated by a colon (e.g., B2:B13). SUM A function that adds all numeric values in a specified range. AVERAGE A function that calculates the arithmetic mean (total ÷ count) of a range. MAX / MIN Functions that return the highest (MAX) or lowest (MIN) numeric value in a range.

<!-- page break -->

COUNT A function that counts the number of cells in a range that contain numeric values. COUNTA A function that counts the number of cells in a range that contain any non-empty content. CHECK YOUR UNDERSTANDING — ANSWER KEY

## 1. SUM automatically expands to include any rows inserted inside the range. The manual formula silently

misses new rows with no error or warning.

## 2. =AVERAGE(B2:B13)

## 3. MAX(B2:B13) returns the highest monthly revenue value — the peak month. For Anchor and Oak this

answers: "What was our best month?"

## 4. Three of the twelve cells in the range contain no numeric data — those months have not had revenue

entered yet. COUNT is showing incomplete data.

## 5. COUNT counts only cells with numbers. COUNTA counts cells with any content including text and dates. Use

COUNT for numeric completeness checks; use COUNTA to count rows that have labels or any entries.

## 6. =SUM(C2:C13). Because B2:B13 is a relative range, copying one column right shifts both column letters

from B to C.

## 7. =B2-$E$1. B2 is relative so it shifts to B3, B4, etc. as the formula is copied down. $E$1 is absolute so it

always references the budget target in E1 regardless of which row the formula is in.
