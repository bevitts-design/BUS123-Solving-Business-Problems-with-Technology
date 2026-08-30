---
title: "BUS 123 — EXCEL-M01-L01 — Creating and Editing Worksheets"
lesson: "EXCEL-M01-L01"
kind: "Pre-Reading"
status: "published"
output: "EXCEL/M01/bus123-excel-m01-l01-pre-reading.pdf"
---

# BUS 123 · EXCEL-M01-L01 · Creating and Editing Worksheets

**Course:** Solving Business Problems with Technology · Fall 2026 · **Track:** EXCEL · **Module:** M01 · **Lesson:** L01

**Case Study Company:** Harborside Medical Center

---

## 1 · Connect to Prior Knowledge

In the course introduction, you created a BUS 123 folder in OneDrive and saved your first file. That habit—**save first, save often, and save to the right place**—now moves inside Excel.

An Excel **workbook** is the file you save. A workbook can contain several **worksheets**, shown as tabs along the bottom. Each worksheet contains cells arranged in rows and columns. Business analysts use those cells to store assumptions, construct formulas, and show evidence for a decision.

Harborside Medical Center will use aggregate department and payer data in this lesson. The data are simplified for training and contain no patient-level information.

> ✅ **Your goal before class**
>
> Be ready to locate a cell, explain what is stored in it, distinguish a displayed format from an underlying value, and predict what should happen when a formula is copied.

---

## 2 · Find Your Way Around Excel

### The five interface zones

| Zone | Where it appears | What it tells you or lets you do |
|---|---|---|
| **Ribbon** | Across the top | Organizes commands into tabs such as Home, Insert, Formulas, and Data. |
| **Name Box** | Left of the Formula Bar | Shows the address of the active cell, such as `C8`; you can also type an address to jump there. |
| **Formula Bar** | Above the worksheet grid | Shows the underlying value or formula stored in the active cell. |
| **Worksheet grid** | Main work area | Organizes cells by column letter and row number. |
| **Sheet Tabs** | Along the bottom | Move among worksheets inside the same workbook. |

The intersection of a column and row is a **cell**. Column C and row 8 identify cell `C8`. A colon means “through,” so `C8:C11` means every cell from C8 through C11.

### Navigation shortcuts

Excel commands vary slightly by platform. Formula syntax and cell addresses remain the same.

| Goal | Windows | Mac |
|---|---|---|
| Return to cell A1 | `Ctrl+Home` | `Control+Home` or `Control+Fn+Left Arrow` on some MacBooks |
| Move to the last used cell | `Ctrl+End` | `Control+End` or `Control+Fn+Right Arrow` on some MacBooks |
| Move to the edge of the current data region | `Ctrl+Arrow` | `Command+Arrow` |

> 💡 **Use both the Name Box and Formula Bar**
>
> The Name Box answers **“Where am I?”** The Formula Bar answers **“What is actually stored here?”** A displayed result alone cannot answer both questions.

<!-- page break -->

## 3 · Separate the Stored Value from Its Display

Formatting changes how a value appears; it does not change the stored value.

| Stored value | Display format | What the worksheet may show |
|---:|---|---:|
| `84200` | Currency or Accounting | `$84,200` |
| `0.62` | Percentage | `62%` |
| `0.41` | Percentage | `41%` |

If you click a cell that displays `62%`, the Formula Bar may still show `0.62`. The displayed percentage is communication; the stored decimal is what formulas use.

### Useful formatting decisions

- Format dollar amounts as Currency or Accounting.
- Format rates and shares as Percentage.
- Use clear headers and enough column width to show complete labels.
- Let Excel’s default alignment help distinguish text from numbers, but treat alignment as a formatting convention—not a universal rule.
- Use borders and fills to clarify sections rather than decorating every cell.

> ⚠️ **Common mistake: entering 62 instead of 62%**
>
> `62%` and `0.62` represent the same stored rate. Entering `62` and applying Percentage format produces `6200%`, which is a different value.

---

## 4 · Build Formulas with Cell References

Every Excel formula begins with an equals sign. A cell reference tells Excel where to find an input.

### Relative references move

A relative reference such as `C17` changes when a formula is copied to another row. If the formula in C23 is copied down one row, `C23` becomes `C24`.

### Absolute references stay fixed

An absolute reference such as `$C$21` keeps both the column and row fixed. Use it when every copied formula must use the same shared assumption.

Harborside’s starter workbook uses a **simplified training contract**:

> Expected reimbursement = stated charge × supplied reimbursement rate

The supplied rate is stored in cell C21 on the **Charge Analysis** tab. The first reimbursement formula is:

> **Excel syntax:** `=C23*$C$21`
>
> **Manual check:** `$84,200 × 62% = $52,204`

When copied from D23 to D24:

- `C23` changes to `C24` because the department charge should move with the row.
- `$C$21` remains `$C$21` because every department uses the same supplied rate.

On Windows, `F4` cycles a reference through its locking modes. On Mac, use `Command+T` or `F4`; MacBook function-key settings may affect whether you also need the `Fn` key. The important decision comes first: **identify what must move and what must remain fixed.**

> 📘 **Model boundary**
>
> This charge-times-rate calculation is a simplified classroom assumption supplied for this lesson. Real payer contracts and Medicare payment methodologies vary. Do not describe this training calculation as a universal hospital reimbursement rule.

## 5 · Choose a Formula from the Business Question

Do not choose a function merely because you remember its name. First identify the evidence the manager needs.

| Business question | Evidence needed | Excel pattern |
|---|---|---|
| What are total monthly charges? | One combined total | `=SUM(C6:C10)` |
| What is the typical department charge? | Arithmetic mean | `=AVERAGE(C6:C10)` |
| How many numeric charge entries are present? | Count of numeric cells | `=COUNT(C6:C10)` |
| What is the largest charge? | Highest value | `=MAX(C6:C10)` |
| What is the smallest charge? | Lowest value | `=MIN(C6:C10)` |

### Verification is part of the model

A worksheet without visible errors can still be wrong. Use evidence that tests the model’s logic:

1. **Formula Bar check:** confirm the cell contains a formula, not a typed answer.
2. **Range check:** confirm the formula includes every intended input and no unintended cells.
3. **Reference check:** confirm shared assumptions stay fixed when formulas are copied.
4. **Reconciliation check:** calculate the same total a second way and subtract. A correct difference should equal zero.
5. **Reasonableness check:** ask whether the result fits the business context.

For example, the five Harborside department reimbursements should total the same amount as total charges multiplied by the shared rate. If those two totals differ, the model does not reconcile.

> ⚠️ **Syntax errors and logic errors are different**
>
> Excel often flags a syntax error. It may not flag a formula that uses the wrong range, omits a row, or hard-codes an assumption. Those silent logic errors require an audit check.

---

## 6 · Prepare for Class

Answer these five questions before class. Bring your reasoning, not only a final answer.

**1. [Retrieval]** Which interface element shows the address of the active cell, and which element shows the value or formula stored in that cell?

**2. [Interpretation]** A cell displays `62%`, while the Formula Bar shows `0.62`. Did formatting change the stored value? Explain.

**3. [Reference prediction]** Cell D23 contains `=C23*$C$21`. What should the formula become when copied to D24? Identify what moves and what stays fixed.

**4. [Method choice]** A manager asks, “What is the highest department charge?” Which Excel pattern matches the evidence needed, and why would `SUM` answer a different question?

**5. [Error diagnosis]** A student types `176886` into a total cell and sees no formula error. Why is that not convincing proof that the reimbursement model is correct? Name one stronger check.

---

## Key Vocabulary

| Term | Meaning |
|---|---|
| **Workbook** | The Excel file that can contain one or more worksheets. |
| **Worksheet** | One tabbed grid inside a workbook. |
| **Active cell** | The currently selected cell. |
| **Cell address** | A column letter and row number, such as `C8`. |
| **Range** | A group of cells, such as `C8:C11`. |
| **Formula Bar** | The interface area that shows the active cell’s underlying value or formula. |
| **Relative reference** | A reference that changes when copied. |
| **Absolute reference** | A reference, such as `$C$21`, that remains fixed when copied. |
| **Reconciliation** | An independent comparison used to prove that two logically equivalent totals agree. |
