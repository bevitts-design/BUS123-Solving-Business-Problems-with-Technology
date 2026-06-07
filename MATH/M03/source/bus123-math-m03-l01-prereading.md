---
title: "BUS 123 — MATH-M03-L01 — Discounts: Trade and Cash"
lesson: "MATH-M03-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M03/bus123-math-m03-l01-prereading.md"
---

<!--
  FORMATTING NOTE FOR INSTRUCTORS
  ─────────────────────────────────────────────────────────────────────────────
  This file is written in standard Markdown. To preserve all formatting:

  • Do NOT copy-paste into a plain text editor — use a Markdown-aware tool
    (VS Code, Typora, GitHub, Notion, or the Canvas rich-text editor in
    source/HTML mode).

  • All tables use the standard Markdown pipe-table format. GitHub, Canvas,
    and most LMS platforms render them as formatted tables automatically.

  • Callout blocks (> blockquote lines) render as indented/highlighted panels
    in most Markdown viewers and GitHub Pages.

  • To push to the public GitHub repo, place this file at:
    MATH/M03/bus123-math-m03-l01-prereading.md
    GitHub Pages will render it correctly with no additional configuration.
  ─────────────────────────────────────────────────────────────────────────────
-->

# BUS 123 · MATH-M03-L01 · Discounts: Trade and Cash

**Course:** Solving Business Problems with Technology · Fall 2026
**Track:** MATH · **Module:** M03 · **Lesson:** L01
**Case Study Company:** Tidal Goods Co.

---

## 1 · Connect to Prior Knowledge

In the last module, you worked with percentages — converting between decimals and percents, calculating percentage change, and finding amounts from percentages. Today's material builds directly on those skills. **Discounts are simply percentages applied to prices**, and once you can work with percentages confidently, discount math follows naturally.

You have probably encountered discounts as a consumer: "30% off" a jacket, or "buy within 10 days and save 2%." This pre-reading gives you the vocabulary and formulas to work with discounts the way businesses do — precisely and systematically.

---

## 2 · Core Concepts

### Part 1 — Trade Discounts

When a manufacturer or wholesaler publishes a **list price** (also called a catalog price), they rarely expect every buyer to pay that full amount. Businesses at different points in the supply chain receive different reductions from the list price, called **trade discounts**. A retailer might receive 30% off list. A large chain might receive 40%. The actual amount the buyer pays is called the **net price**.

To find the net price, we use the **complement** of the discount rate. The complement is simply (1 minus the discount rate). If the trade discount is 30%, the complement is 0.70 — meaning the buyer pays 70% of the list price.

**Net Price = List Price × (1 − Discount Rate)**

**Worked Example — Tidal Goods Co.:**

Tidal Goods Co. orders wetsuits from a supplier. The list price is $189.99 per unit, and Tidal Goods receives a 30% trade discount as a retail partner.

- Complement: 1 − 0.30 = **0.70**
- Net Price: $189.99 × 0.70 = **$132.99**
- Discount Amount: $189.99 − $132.99 = **$57.00**

> ✅ **Why the Complement Works**
>
> If you receive 30% off, you pay the remaining 70%. Multiplying by 0.70 gives you the net price in one step, rather than calculating the discount amount first and then subtracting it. Both approaches give the same answer — the complement method is faster.

---

### Part 2 — Chain Discounts

Sometimes a supplier offers more than one trade discount on the same item. For example, a standard trade discount might be 20%, with an additional 10% for large orders and another 5% for preferred accounts. When multiple discounts apply, they are called **chain discounts** and written as "20/10/5."

The critical rule: **each discount applies to the result of the previous discount, not to the original list price.** This means you cannot simply add the rates together. 20/10/5 is not the same as a single 35% discount.

**Net Price = List Price × (1 − d₁) × (1 − d₂) × (1 − d₃)**

**Worked Example — Surfboard Fins:**

Tidal Goods orders surfboard fins with a list price of $64.00 per set. The supplier offers a 20/10/5 chain discount.

- Step 1: $64.00 × (1 − 0.20) = $64.00 × 0.80 = $51.20
- Step 2: $51.20 × (1 − 0.10) = $51.20 × 0.90 = $46.08
- Step 3: $46.08 × (1 − 0.05) = $46.08 × 0.95 = **$43.78**

> ⚠️ **Common Mistake — Adding Rates**
>
> Adding 20 + 10 + 5 = 35% would give $64 × 0.65 = **$41.60** — a different (lower) answer. The chain method correctly gives **$43.78**. These are not equal because each discount is applied to an already-reduced base, not the original list price.

---

### Part 3 — Cash Discounts and Payment Terms

While trade discounts reduce the price of goods, **cash discounts** reward buyers who pay their invoices early. Suppliers offer cash discounts to improve their own cash flow — getting paid sooner is worth a small reduction in the amount received.

Cash discount terms are written in standardized shorthand. The most common format is:

```
2 / 10  net 30
│   │       │
│   │       └─ Full payment due — total credit period (days)
│   └─────── Discount period — pay within this window to earn the discount
└─────────── Cash discount rate
```

**Worked Example — Tidal Goods Invoice:**

Tidal Goods receives an invoice for $4,200.00 from their wetsuit supplier. Terms: **2/10 net 30**.

- Discount Amount: $4,200 × 0.02 = **$84.00**
- Payment if paid within 10 days: $4,200 × (1 − 0.02) = $4,200 × 0.98 = **$4,116.00**
- If Tidal Goods waits past 10 days: full **$4,200** is due by day 30.

> 💡 **The True Cost of Skipping a Cash Discount**
>
> Not taking a 2/10 net 30 discount is equivalent to borrowing money at roughly **37% annual interest**. The $84 "savings" from waiting buys only 20 extra days of payment deferral. For most businesses, it nearly always makes financial sense to take the cash discount when cash is available.

---

## 3 · Formula Reference

| Concept                      | Formula                                    | Example                                  |
|------------------------------|--------------------------------------------|------------------------------------------|
| **Net Price (single)**       | `= List × (1 − d)`                         | $189.99 × 0.70 = $132.99                 |
| **Discount Amount**          | `= List × d`                               | $189.99 × 0.30 = $57.00                  |
| **Complement**               | `= 1 − d`                                  | 1 − 0.30 = 0.70                          |
| **Net Price (chain)**        | `= List × (1−d₁) × (1−d₂) × (1−d₃)`       | $64 × 0.80 × 0.90 × 0.95 = $43.78       |
| **Single Equivalent Rate**   | `= 1 − [(1−d₁)(1−d₂)(1−d₃)]`              | 1 − 0.684 = 31.6%                        |
| **Cash Discount Payment**    | `= Invoice × (1 − cash rate)`              | $4,200 × 0.98 = $4,116                   |
| **Cash Discount Savings**    | `= Invoice × cash rate`                    | $4,200 × 0.02 = $84                      |

---

## 4 · Check Your Understanding

Answer these questions before class. Bring your work — we'll use these as discussion starters.

1. A surfboard has a list price of $525.00. A retailer receives a 22% trade discount. What is the net price?
2. Tidal Goods receives a chain discount of 25/10 on a $380 order of accessories. What is the net price?
3. An item has a list price of $75.00 and is subject to a 30/15/5 chain discount. Calculate the net price.
4. What is the single equivalent discount rate for a 30/15/5 chain discount?
5. An invoice for $6,500 has terms of 2/10 net 30. How much is saved by paying within 10 days?
6. Tidal Goods receives invoice terms of "3/15 net 45." What does each number represent?
7. A buyer can take a 2/10 net 30 cash discount or pay the full amount in 30 days. If the invoice is $2,800, what is the annualized cost of NOT taking the discount?

---

### Answer Key · Check Your Understanding

| # | Answer |
|---|--------|
| **1** | $525.00 × (1 − 0.22) = $525.00 × 0.78 = **$409.50** |
| **2** | $380 × (1 − 0.25) × (1 − 0.10) = $380 × 0.75 × 0.90 = **$256.50** |
| **3** | $75 × 0.70 × 0.85 × 0.95 = **$42.53** |
| **4** | 1 − (0.70 × 0.85 × 0.95) = 1 − 0.5673 = **43.3%** |
| **5** | $6,500 × 0.02 = **$130.00** |
| **6** | 3% discount if paid within 15 days; full amount due in 45 days |
| **7** | Cost = ($56 ÷ $2,744) × (365 ÷ 20) ≈ **37.2% annualized** |

---

## 5 · Key Vocabulary

| Term                      | Definition                                                                                                                                    |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| **List Price**            | The published catalog or manufacturer's suggested price before any discounts are applied.                                                      |
| **Trade Discount**        | A reduction from list price offered to buyers in the supply chain (retailers, wholesalers, etc.).                                              |
| **Net Price**             | The actual price paid after all trade discounts have been subtracted from list price.                                                          |
| **Complement**            | The portion of the price the buyer actually pays; calculated as (1 − discount rate).                                                          |
| **Chain Discount**        | A series of successive trade discounts applied one after the other to the same item.                                                           |
| **Single Equivalent Rate**| A single discount rate that produces the same net price as a chain of discounts.                                                               |
| **Cash Discount**         | A percentage reduction offered to buyers who pay their invoice within a specified early payment window.                                        |
| **Payment Terms**         | The notation describing a cash discount — e.g., 2/10 net 30 means 2% off if paid within 10 days, full amount due in 30 days.                 |
| **Discount Period**       | The number of days within which a buyer must pay to qualify for the cash discount.                                                             |
| **Net Period**            | The total number of days a buyer has to pay the full invoice amount.                                                                           |
