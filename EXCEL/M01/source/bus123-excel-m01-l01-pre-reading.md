---
title: "Navigating Excel, Formatting & Cell References"
lesson: "EXCEL-M01-L01"
kind: "Pre-Reading"
status: "draft-from-pdf"
output: "EXCEL/M01/bus123-excel-m01-l01-pre-reading.pdf"
---

# Navigating Excel, Formatting & Cell References

Pre-Reading — Complete before your first Excel class session

## Connect to Prior Knowledge

In the course introduction you practiced setting up your BUS 123 folder in OneDrive and saving your first file. That habit — save first, save often, save to the right place — carries directly into this module. Every Excel workbook you build this semester will live in that folder structure. Now that your workspace is organized, you are ready to work inside Excel itself. Excel is the most widely used business software in the world. Accountants use it to build financial models. Operations managers use it to track inventory. Marketing teams use it to analyze campaign data. Regardless of your career path in business, fluency with Excel is a baseline expectation. This module builds that foundation.

## Concept Explanation

## Part A — The Excel Interface

When you open a new Excel workbook you see a grid of rows and columns. Every intersection of a row and column is a cell. Cells are addressed by column letter and row number: A1, B3, C10. The five zones you must know before class are listed below. Zone Location What It Does Quick Access Toolbar Top-left corner Stores your most-used commands for one-click access Ribbon Top band Organizes all commands into tabs: Home, Insert, Formulas, Data, and more Name Box Left of formula bar Shows the address of the selected cell (e.g., C3) Formula Bar Right of Name Box Shows the raw content of the active cell — a value or a formula Sheet Tabs Bottom of window Each tab is a separate worksheet within the same workbook file Navigation shortcuts save time in large files. Tidal Goods Co., one of our case study businesses, manages a product catalog with hundreds of rows. Three shortcuts you must know: Ctrl+End jumps to the last used cell; Ctrl+Home returns to A1; Ctrl+Arrow jumps to the edge of a contiguous data range. Practice these before class.

<!-- page break -->

## Part B — Formatting Essentials

Formatting does not change the underlying value in a cell — it changes how that value is displayed. Professional formatting serves one purpose: communication. A reader should be able to glance at your spreadsheet and immediately understand what type of data they are looking at. The three most important formatting decisions are: (1) Number format — is this a dollar amount, a percentage, or a plain number? Apply the correct format every time. (2) Alignment — numbers always align right; text always aligns left. This is a professional convention you must follow. (3) Headers and borders — bold your column headers and add borders to separate data sections from totals. ■ Common Mistake 0.15 is not the same as 15%. If you type a decimal like 0.15 into a cell without applying Percentage format, your reader has no idea whether that represents 15%, 15 cents, or some other quantity. Always apply number format before sharing any file.

## Part C — Cell References: Relative and Absolute

This is the most important concept in the lesson. Every formula you write in Excel contains cell references. A reference tells Excel which cell to pull data from. There are two kinds. Relative references (written as A1, B3, etc.) update automatically when you copy a formula to a new location. If you copy a formula one row down, every relative reference shifts one row down with it. This is the default behavior — and it is usually exactly what you want when applying the same calculation to multiple rows of data. Absolute references (written as $A$1, $B$1, etc.) are locked. The dollar signs tell Excel: do not move this reference when I copy the formula. Use an absolute reference whenever every formula in a range needs to point back to the same single cell — such as a tax rate, a markup percentage, or a fixed cost stored in one place. Tidal Goods Co. example. Tidal Goods stores its 40% product markup rate in cell B1. Column B holds product costs; column C will hold the selling price calculated as: cost × (1 + markup rate). The formula in C3 should be =B3*(1+$B$1). B3 is relative — it moves down to B4, B5, B6 as we copy the formula. $B$1 is absolute — it always reads the 40% markup stored in B1, regardless of which row the formula is copied to. The F4 shortcut. After typing a cell address inside a formula, press F4 to cycle through the four reference modes: $A$1 (both locked) → A$1 (row locked) → $A1 (column locked) → A1 (relative, back to start). Professional analysts never type dollar signs manually — they always use F4.

Formula Reference Relative =B3*(1+B1) Reference moves when formula is copied Absolute =B3*(1+$B$1) Reference stays fixed regardless of copy destination

<!-- page break -->

Row locked =B3*(1+A$1) Row number is locked; column can shift Col locked =B3*(1+$A1) Column letter is locked; row can shift Shortcut: Press F4 after typing a cell address in a formula to cycle through all four modes.

Check Your Understanding Answer these seven questions on your own before class. Answers appear at the end of this document.

## 1. Which part of the Excel interface shows the address of the currently selected cell?

## 2. A cell displays $14.99. You click the cell and the Formula Bar shows =B3*1.4. What does this tell you

about what is stored in the cell?

## 3. You press Ctrl+End in a large worksheet. What happens?

## 4. You type 0.15 into a cell that represents a 15% discount rate. What formatting step should you take,

and why?

## 5. A formula in C3 reads =B3*(1+B1). When you copy this formula to C4, what does the formula in C4

become?

## 6. You want C4 to always reference the markup rate in B1 regardless of where the formula is copied.

## How do you rewrite the reference to B1?

## 7. You have typed =B3 inside a formula. What does pressing F4 once do?

## Key Vocabulary

Cell address The unique identifier for a cell, expressed as a column letter followed by a row number (e.g., B3, C10). Name Box The box to the left of the Formula Bar that displays the address of the currently selected cell. Formula Bar

<!-- page break -->

The bar above the worksheet grid that displays the raw content — value or formula — of the active cell. Number format A display setting that controls how a numeric value appears in a cell (currency, percentage, decimal places, etc.) without altering the underlying value. Relative reference A cell reference that automatically adjusts when a formula is copied to a new location. Absolute reference A cell reference locked with dollar signs ($A$1) that does not change when a formula is copied. F4 Keyboard shortcut that cycles a cell reference through four modes: $A$1, A$1, $A1, A1. Ribbon The horizontal band of tabs and command groups at the top of the Excel window. CHECK YOUR UNDERSTANDING — ANSWER KEY

## 1. The Name Box (located to the left of the Formula Bar).

## 2. The cell contains a formula (=B3*1.4), not a typed value. The cell displays the formula's result ($14.99).

## 3. Excel jumps to the last used cell in the worksheet — the bottom-right corner of your data range.

## 4. Apply Percentage format (Home tab > Number group). Without it, a reader cannot tell whether 0.15

represents 15%, $0.15, or another quantity.

## 5. =B4*(1+B2). Both references are relative, so each shifts one row down when copied.

## 6. Write $B$1. The dollar signs lock both the column and row, so the reference always points to B1 regardless

of where the formula is copied.

## 7. F4 changes =B3 to =$B$3 — locking both the column and row with dollar signs.
