---
title: "BUS 123 — MATH-M12-L01 — Business Statistics: Central Tendency, Dispersion & Correlation"
lesson: "MATH-M12-L01"
kind: "Pre-Reading"
status: "published"
output: "MATH/M12/bus123-math-m12-l01-prereading.pdf"
---

# BUS 123 · MATH-M12-L01 · Business Statistics: Central Tendency, Dispersion & Correlation

**Course:** Solving Business Problems with Technology · Fall 2026
**Track:** MATH · **Module:** M12 · **Lesson:** L01
**Case Study Company:** Harborside Medical Center

---

## 1 · Connect to Prior Knowledge

In Module 08 you learned how to calculate financial metrics: loan payments, present value, and interest. Those formulas gave you exact answers for specific situations. Module 12 builds on that foundation by asking a different kind of question: **what does a collection of numbers tell us?**

When Harborside Medical Center tracks patient wait times across 30 days, or payroll hours across 50 nurses, a single formula is not enough. We need statistical tools to summarize, interpret, and compare datasets — and Excel has built-in functions for all of them.

---

## 2 · Core Concepts

### Part 1 — Measures of Central Tendency

A measure of central tendency answers the question: *what is a typical value in this dataset?* There are three: the **mean**, the **median**, and the **mode**. Each defines "typical" differently, and choosing the right one depends on your data.

---

#### Mean (Arithmetic Average)

The mean is the sum of all values divided by the count of values. It is the most commonly used average in business because it accounts for every data point equally.

- **Excel:** `=AVERAGE(range)`
- **Manual:** `Mean = Sum of all values / Count of values`

**Worked Example — Harborside Medical Center:**

Patient wait times for five days: 12, 15, 18, 11, and 42 minutes.

Mean = (12 + 15 + 18 + 11 + 42) ÷ 5 = 98 ÷ 5 = **19.6 minutes**

> ⚠️ **Watch Out — Outlier Effect**
>
> The 42-minute day pulls the mean up significantly. Four of the five days had waits between 11 and 18 minutes, yet the mean suggests nearly 20 minutes. This is the classic outlier problem — and it's why we need more than one measure of center.

---

#### Median

The median is the **middle value** when the data is sorted from smallest to largest. If the dataset has an even number of values, the median is the average of the two middle values. The median is resistant to outliers and is preferred when data is skewed.

- **Excel:** `=MEDIAN(range)`
- **Manual:** Sort data, find the value at position `(n+1)/2`

**Worked Example — Harborside Medical Center:**

Sorted wait times: 11, 12, **15**, 18, 42. The middle value is **15 minutes**.

Compared to the mean of 19.6, the median of 15 minutes is a far more representative picture of a typical day.

---

#### Mode

The mode is the value that appears **most frequently**. A dataset can have no mode (all values unique), one mode, or multiple modes (bimodal or multimodal). The mode is the only measure of central tendency that works on **categorical (text) data**.

- **Excel:** `=MODE.SNGL(range)` — returns one mode
- **Excel:** `=MODE.MULT(range)` — returns all modes (press Ctrl+Shift+Enter)

**Worked Example — Harborside Medical Center:**

Over ten days, the most frequently filed diagnosis code was Z00.0 (routine wellness visit), appearing 4 times. This is the mode. Harborside uses this to ensure adequate scheduling for routine appointments.

---

#### Choosing the Right Measure

| Situation                                  | Best Measure |
|--------------------------------------------|--------------|
| Symmetric data, no extreme outliers        | **Mean**     |
| Skewed data or data with outliers          | **Median**   |
| Categorical (text) data, or most-common occurrence | **Mode** |

---

### Part 2 — Standard Deviation: Measuring Spread

Central tendency tells you where the center of your data is. But two datasets can have the **same mean and look completely different**. Standard deviation measures how far the data points spread out from the mean.

Consider two hospitals, each with an average patient wait time of 20 minutes:
- Hospital A's times range from 18 to 22 minutes — **tightly clustered**.
- Hospital B's times range from 2 to 35 minutes — **wildly variable**.

Both have the same mean, but Hospital B has a much higher standard deviation, signaling a serious process problem that the mean alone completely hides.

- **Excel (sample):** `=STDEV.S(range)` ← use for samples (almost always)
- **Excel (population):** `=STDEV.P(range)` ← use only when you have ALL observations
- **Manual:** `s = √[ Σ(x − mean)² / (n − 1) ]`

#### Sample vs. Population Standard Deviation

Use **`STDEV.S`** (sample) almost everywhere in business. When you analyze last month's wait times, you are working with a sample — not every patient visit that will ever happen. The sample formula divides by `n − 1`, which produces a slightly larger (and more accurate) estimate of the true population spread.

Use **`STDEV.P`** only when you have data for literally every member of the group — for example, all 18 nurses currently employed at Harborside.

#### Worked Example — Nurse Overtime Hours

Five nurses logged 4, 6, 8, 10, and 12 overtime hours last week. The mean is 8 hours.

| Nurse   | Overtime (hrs) | x − mean  | (x − mean)² |
|---------|---------------|-----------|-------------|
| Rivera  | 4             | −4        | 16          |
| Chen    | 6             | −2        | 4           |
| O'Brien | 8             | 0         | 0           |
| Patel   | 10            | +2        | 4           |
| Walsh   | 12            | +4        | 16          |
| **Total** |             |           | **40**      |

`s = √(40 ÷ 4) = √10 ≈ 3.16 hours`

In Excel: `=STDEV.S(C2:C6)` returns the same result. Most nurses worked within about ±3 hours of the mean — the overtime schedule is reasonably balanced.

> ✅ **Key Principle**
>
> Always report the standard deviation **alongside the mean**. A mean of 8 hours with SD = 3.16 is very different from a mean of 8 hours with SD = 12 hours. The second scenario would indicate extreme inequality in overtime distribution — an HR red flag.

---

### Part 3 — Correlation: Measuring Relationships

Correlation measures whether two variables move together, and how strongly. The result is a number called the **correlation coefficient**, written as **r**, which always falls between −1 and +1.

- **Excel:** `=CORREL(array1, array2)` — returns a coefficient between −1 and +1
- **Strength guide:** |r| > 0.7 = Strong · 0.4–0.7 = Moderate · < 0.4 = Weak

| r value        | Meaning              | Business Example                                       |
|----------------|----------------------|--------------------------------------------------------|
| +1.0           | Perfect positive     | Every extra nurse-hour → proportional patients seen    |
| +0.7 to +0.9   | Strong positive      | More marketing spend → more patient inquiries          |
| +0.4 to +0.7   | Moderate positive    | Slight link between staffing and throughput            |
| 0              | No correlation       | Day of week vs. patient zip code                       |
| −0.4 to −0.7   | Moderate negative    | More red tape → slightly lower satisfaction            |
| −0.7 to −0.9   | Strong negative      | Longer wait time → lower satisfaction score            |
| −1.0           | Perfect negative     | Every extra minute waited → exact drop in score        |

#### Worked Example — Wait Time vs. Patient Satisfaction

Harborside tracked average daily wait time (minutes) and patient satisfaction scores (1–10) for seven days. Running `=CORREL(B2:B8, C2:C8)` returned **r = −0.98** — a very strong negative correlation. As wait times increase, satisfaction scores drop sharply and consistently.

#### Correlation Does Not Mean Causation

> ⚠️ **Correlation ≠ Causation**
>
> Finding r = −0.98 between wait time and satisfaction does **not** prove that reducing wait time causes higher satisfaction scores. Both variables might be driven by a third factor — for example, Mondays may have high wait times and lower satisfaction for entirely independent reasons (sicker patients, fewer staff).
>
> Classic example: Ice cream sales and hospital admissions are both higher in summer. Correlation: strong positive. Cause: neither one. **Heat causes both.**
>
> Never recommend a business action based on correlation alone — always investigate the underlying mechanism first.

---

## 3 · Formula Reference

| Function        | Excel Syntax                   | Returns                            |
|-----------------|--------------------------------|------------------------------------|
| **AVERAGE**     | `=AVERAGE(range)`              | Arithmetic mean                    |
| **MEDIAN**      | `=MEDIAN(range)`               | Middle value (sorted)              |
| **MODE.SNGL**   | `=MODE.SNGL(range)`            | Single most frequent value         |
| **MODE.MULT**   | `=MODE.MULT(range)` [CSE]      | All modes (array formula)          |
| **MIN / MAX**   | `=MIN(range)` / `=MAX(range)`  | Smallest / largest value           |
| **COUNT**       | `=COUNT(range)`                | Count of numeric values            |
| **STDEV.S**     | `=STDEV.S(range)`              | Sample standard deviation          |
| **STDEV.P**     | `=STDEV.P(range)`              | Population standard deviation      |
| **CORREL**      | `=CORREL(array1, array2)`      | Pearson correlation coefficient    |

---

## 4 · Check Your Understanding

Answer these questions after completing the reading. Answers appear at the end of this document.

1. Harborside records these ER wait times (in minutes): 8, 12, 9, 47, 11. What is the mean? What is the median? Which better represents a typical wait?

2. A dataset of weekly supply orders has values: 50, 50, 60, 70, 50. What is the mode? What Excel function returns it?

3. Hospital A has a mean wait time of 15 minutes with STDEV.S = 2. Hospital B has a mean of 15 minutes with STDEV.S = 10. Which hospital's wait times are more consistent, and why?

4. You run `=STDEV.S` on a range of 20 patient satisfaction scores. When would you use `=STDEV.P` instead?

5. Harborside finds `CORREL(wait times, satisfaction scores)` = −0.94. Describe what this tells management about the relationship.

6. A manager says: "Satisfaction and wait times are strongly correlated — so cutting wait times will definitely improve satisfaction." What is wrong with this statement?

7. You have categorical data: the most common insurance type filed each day for 14 days. Which measure of central tendency is appropriate, and why?

---

### Answer Key · Check Your Understanding

| # | Answer |
|---|--------|
| **1** | Mean = (8+12+9+47+11) ÷ 5 = 87 ÷ 5 = **17.4 min**. Median (sorted: 8, 9, 11, 12, 47) = **11 min**. The **median** better represents a typical wait because the outlier (47 min) inflates the mean. |
| **2** | Mode = **50** (appears 3 times). Excel function: `=MODE.SNGL(range)`. |
| **3** | **Hospital A** is more consistent. A SD of 2 minutes means nearly all wait times are within a few minutes of the mean. Hospital B's SD of 10 means some patients wait far longer or shorter than the mean suggests. |
| **4** | Only when you have data for **every single member of the group** — for example, if you surveyed all 18 nurses on staff, not a sample of them. |
| **5** | There is a **strong negative relationship**: as wait times increase, satisfaction scores decrease consistently. The relationship is strong (|r| = 0.94 > 0.7) and negative. |
| **6** | **Correlation does not prove causation.** The correlation shows the two variables move together, but a third factor (patient severity, day of week, staffing levels) could be driving both. Further analysis is needed before recommending an action. |
| **7** | **Mode.** Mean and median require numeric data that can be ranked or averaged. Insurance type is categorical — only mode (most frequent category) is meaningful. |

---

## 5 · Key Vocabulary

| Term                      | Definition                                                                                                                                          |
|---------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------|
| **Mean**                  | The arithmetic average of a dataset: sum of values divided by count.                                                                                |
| **Median**                | The middle value in a sorted dataset; resistant to outliers.                                                                                        |
| **Mode**                  | The most frequently occurring value; the only central tendency measure that works on categorical data.                                              |
| **Standard Deviation**    | A measure of spread: how far data points deviate from the mean on average. Reported alongside the mean for a complete picture.                      |
| **STDEV.S**               | Excel function for sample standard deviation (divides by n−1); used when data is a sample from a larger population.                                |
| **STDEV.P**               | Excel function for population standard deviation (divides by n); used only when data includes every member of the group.                           |
| **Correlation Coefficient**| A number from −1 to +1 measuring the strength and direction of a linear relationship between two variables.                                       |
| **CORREL**                | Excel function that returns the Pearson correlation coefficient between two data arrays.                                                             |
| **Outlier**               | A data point that differs greatly from the rest of the dataset; can distort the mean but has minimal effect on the median.                         |
| **Causation**             | A relationship where one variable directly causes a change in another — distinct from correlation, which only measures co-movement.                |

---

> 📝 **Before Class**
>
> Complete this reading before attending class. Bring any questions to the start of the session — the lecture will build directly on these concepts.
