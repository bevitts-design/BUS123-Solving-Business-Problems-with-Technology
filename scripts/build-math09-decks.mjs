import fs from "node:fs/promises";
import path from "node:path";

const repo = path.resolve(import.meta.dirname, "..");
const outputDir = path.join(repo, "MATH", "M09");

const formulaPanel = (excel, manual, result = "") => `
  <div class="formula-panel" aria-label="Excel formula and verification">
    <span class="formula-excel">${excel}</span>
    <span class="formula-manual">${manual}</span>
    ${result ? `<span class="formula-result">${result}</span>` : ""}
  </div>`;

const cell = (content, className = "") => `<div class="excel-cell ${className}">${content ?? ""}</div>`;

function excelWindow({ title, tab, columns, active, formula, rows, caption }) {
  const letters = columns.map((letter) => cell(letter, "excel-letter")).join("");
  const rowMarkup = rows.map((row) => `
    <div class="excel-row">
      ${cell(row.number, "excel-rownum")}
      ${row.cells.map((entry) => cell(entry.value, `${entry.className ?? ""} ${entry.address === active ? "excel-active" : ""}`)).join("")}
    </div>`).join("");
  return `
    <figure class="excel-window" aria-label="${caption}">
      <div class="excel-titlebar"><span class="excel-app">Excel</span><strong>${title}</strong><span>Saved</span></div>
      <div class="excel-ribbon"><span>Home</span><span>Insert</span><span>Formulas</span><span>Data</span><span>Review</span></div>
      <div class="excel-formula"><span class="name-box" aria-label="Active cell">${active}</span><span class="fx">fx</span><span class="formula-bar" aria-label="Formula bar content">${formula || "Ready for your formula"}</span></div>
      <div class="excel-row excel-letters">${cell("", "excel-corner")}${letters}</div>
      ${rowMarkup}
      <div class="excel-tabs"><span>START HERE</span><span class="active-tab">${tab}</span><span>Class Challenge</span><span>FormulaReferenceCard</span></div>
      <figcaption>${caption}</figcaption>
    </figure>`;
}

const activityBrief = ({ what, how, time, deliverable, debrief, mastery }) => `
  <div class="activity-brief" aria-label="Activity directions">
    <div><span>WHAT</span><strong>${what}</strong></div>
    <div><span>HOW</span><strong>${how}</strong></div>
    <div><span>TIME</span><strong>${time}</strong></div>
    <div><span>DELIVERABLE</span><strong>${deliverable}</strong></div>
    <div><span>DEBRIEF</span><strong>${debrief}</strong></div>
    <div><span>MASTERY</span><strong>${mastery}</strong></div>
  </div>`;

const photo = (src, alt, caption, className = "") => `
  <figure class="photo-frame ${className}">
    <img src="${src}" alt="${alt}">
    <figcaption>${caption}</figcaption>
  </figure>`;

const section = (number, part, title, kicker) => `
  <section class="slide dark section-break has-gradient" data-section="${number}">
    <div class="break-number">${part}</div>
    <div><p class="eyebrow">PART ${part} OF 3</p><h2>${title}</h2><p class="lead on-dark">${kicker}</p></div>
  </section>`;

const slide = (number, dataSection, title, body, className = "") => `
  <section class="slide ${className}" data-section="${dataSection}" data-slide="${number}">
    ${title ? `<header class="slide-header"><p class="eyebrow">MATH M09 · SLIDE ${String(number).padStart(2, "0")}</p><h2>${title}</h2></header>` : ""}
    <div class="slide-body">${body}</div>
  </section>`;

const titleSlide = ({ lesson, title, subtitle, image, alt, caption }) => `
  <section class="slide dark title-slide has-gradient" data-section="0" data-slide="1">
    <img class="title-photo" src="${image}" alt="${alt}">
    <div class="title-shade" aria-hidden="true"></div>
    <div class="title-copy">
      <p class="eyebrow">${lesson} · MERIDIAN ADVISORY GROUP</p>
      <h1>${title}</h1>
      <p class="title-subtitle">${subtitle}</p>
      <p class="photo-credit">${caption}</p>
    </div>
  </section>`;

const agenda = (items) => `
  <div class="agenda-path" aria-label="Lesson agenda">
    ${items.map((item, i) => `<div class="agenda-step"><span>${i + 1}</span><strong>${item.title}</strong><p>${item.text}</p></div>`).join("")}
  </div>`;

const objectives = (items) => `
  <div class="objective-stack">
    ${items.map((item, i) => `<div class="objective"><span>${String(i + 1).padStart(2, "0")}</span><p>${item}</p></div>`).join("")}
  </div>`;

const l01ExcelInstructor = excelWindow({
  title: "bus123-math-m09-l01-starter.xlsx", tab: "Live You Try It", columns: ["D", "E", "F", "G", "H", "I", "J"], active: "H6",
  formula: "=FV(E6/G6,F6*G6,0,-D6)", caption: "Instructor model aligned to Live You Try It cells D5:J7; H6 is active.",
  rows: [
    { number: "5", cells: [
      { address: "D5", value: "Principal / Rate (%)", className: "excel-header" }, { address: "E5", value: "Annual Rate", className: "excel-header" }, { address: "F5", value: "Years", className: "excel-header" }, { address: "G5", value: "Periods / Year", className: "excel-header" }, { address: "H5", value: "FORMULA / RESULT", className: "excel-header" }, { address: "I5", value: "Formula Hint", className: "excel-header" }, { address: "J5", value: "FEEDBACK", className: "excel-header" },
    ]},
    { number: "6", cells: [
      { address: "D6", value: "$40,000.00", className: "excel-input" }, { address: "E6", value: "4.00%", className: "excel-input" }, { address: "F6", value: "3", className: "excel-input" }, { address: "G6", value: "1", className: "excel-input" }, { address: "H6", value: "$44,994.56", className: "excel-result" }, { address: "I6", value: "Use FV with row inputs." }, { address: "J6", value: "Correct formula and value.", className: "excel-ok" },
    ]},
    { number: "7", cells: [
      { address: "D7", value: "$40,000.00", className: "excel-input" }, { address: "E7", value: "4.00%", className: "excel-input" }, { address: "F7", value: "3", className: "excel-input" }, { address: "G7", value: "1", className: "excel-input" }, { address: "H7", value: "", className: "excel-result" }, { address: "I7", value: "Manual formula audit." }, { address: "J7", value: "Enter the manual formula." },
    ]},
  ],
});

const l01ExcelGuided = excelWindow({
  title: "bus123-math-m09-l01-starter.xlsx", tab: "Live You Try It", columns: ["D", "E", "F", "G", "H", "I", "J"], active: "H6",
  formula: "", caption: "Student state: D6:G7 are supplied inputs; H6:H7 remain for students to complete.",
  rows: [
    { number: "5", cells: [
      { value: "Principal / Rate (%)", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Formula Hint", className: "excel-header" }, { value: "FEEDBACK", className: "excel-header" },
    ]},
    { number: "6", cells: [
      { value: "$40,000.00", className: "excel-input" }, { value: "4.00%", className: "excel-input" }, { value: "3", className: "excel-input" }, { value: "1", className: "excel-input" }, { address: "H6", value: "", className: "excel-result" }, { value: "Use FV with row inputs." }, { value: "Enter the FV formula." },
    ]},
    { number: "7", cells: [
      { value: "$40,000.00", className: "excel-input" }, { value: "4.00%", className: "excel-input" }, { value: "3", className: "excel-input" }, { value: "1", className: "excel-input" }, { address: "H7", value: "", className: "excel-result" }, { value: "Manual formula audit." }, { value: "Enter the manual formula." },
    ]},
  ],
});

const l01ExcelAudit = excelWindow({
  title: "bus123-math-m09-l01-starter.xlsx", tab: "Live You Try It", columns: ["D", "E", "F", "G", "H", "I", "J"], active: "H7",
  formula: "=D7*(1+E7)^F7", caption: "Audit state: two different formulas reconcile to the same $44,994.56 result.",
  rows: [
    { number: "5", cells: [
      { value: "Principal / Rate (%)", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Formula Hint", className: "excel-header" }, { value: "FEEDBACK", className: "excel-header" },
    ]},
    { number: "6", cells: [
      { value: "$40,000.00", className: "excel-input" }, { value: "4.00%", className: "excel-input" }, { value: "3", className: "excel-input" }, { value: "1", className: "excel-input" }, { value: "$44,994.56", className: "excel-result" }, { value: "FV model" }, { value: "Correct formula and value.", className: "excel-ok" },
    ]},
    { number: "7", cells: [
      { value: "$40,000.00", className: "excel-input" }, { value: "4.00%", className: "excel-input" }, { value: "3", className: "excel-input" }, { value: "1", className: "excel-input" }, { address: "H7", value: "$44,994.56", className: "excel-result" }, { value: "Manual formula" }, { value: "Correct formula and value.", className: "excel-ok" },
    ]},
  ],
});

const l01ExcelDecision = excelWindow({
  title: "bus123-math-m09-l01-starter.xlsx", tab: "Class Challenge", columns: ["B", "C", "D", "E", "F", "G", "H"], active: "G6",
  formula: "=FV(D6/F6,E6*F6,0,-C6)", caption: "Class Challenge evidence: Account A finishes $1,883.74 above Account B.",
  rows: [
    { number: "5", cells: [
      { value: "Scenario", className: "excel-header" }, { value: "Principal", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Decision Evidence / Hint", className: "excel-header" },
    ]},
    { number: "6", cells: [
      { value: "Account A" }, { value: "$100,000", className: "excel-input" }, { value: "4.00%", className: "excel-input" }, { value: "10", className: "excel-input" }, { value: "1", className: "excel-input" }, { address: "G6", value: "$148,024.43", className: "excel-result" }, { value: "Higher nominal rate" },
    ]},
    { number: "7", cells: [
      { value: "Account B" }, { value: "$100,000", className: "excel-input" }, { value: "3.80%", className: "excel-input" }, { value: "10", className: "excel-input" }, { value: "12", className: "excel-input" }, { value: "$146,140.69", className: "excel-result" }, { value: "More frequent compounding" },
    ]},
    { number: "8", cells: [
      { value: "A minus B" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "$1,883.74", className: "excel-result" }, { value: "Account A wins", className: "excel-ok" },
    ]},
  ],
});

const l02ExcelInstructor = excelWindow({
  title: "bus123-math-m09-l02-starter.xlsx", tab: "Live You Try It", columns: ["D", "E", "F", "G", "H", "I", "J"], active: "H6",
  formula: "=PMT(E6/G6,F6*G6,D6,0)", caption: "Instructor mortgage model aligned to Live You Try It D5:J8; H6 is active.",
  rows: [
    { number: "5", cells: [
      { value: "Amount / Payment", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Formula Hint", className: "excel-header" }, { value: "FEEDBACK", className: "excel-header" },
    ]},
    { number: "6", cells: [
      { value: "$320,000.00", className: "excel-input" }, { value: "6.50%", className: "excel-input" }, { value: "30", className: "excel-input" }, { value: "12", className: "excel-input" }, { address: "H6", value: "-$2,022.62", className: "excel-result" }, { value: "Monthly rate and months" }, { value: "Correct formula and value.", className: "excel-ok" },
    ]},
    { number: "7", cells: [
      { value: "$320,000.00", className: "excel-input" }, { value: "6.50%", className: "excel-input" }, { value: "30", className: "excel-input" }, { value: "12", className: "excel-input" }, { value: "$728,142.36", className: "excel-result" }, { value: "Payment x periods" }, { value: "Correct formula and value.", className: "excel-ok" },
    ]},
    { number: "8", cells: [
      { value: "$320,000.00", className: "excel-input" }, { value: "6.50%", className: "excel-input" }, { value: "30", className: "excel-input" }, { value: "12", className: "excel-input" }, { value: "$408,142.36", className: "excel-result" }, { value: "Total paid - principal" }, { value: "Correct formula and value.", className: "excel-ok" },
    ]},
  ],
});

const l02ExcelGuided = excelWindow({
  title: "bus123-math-m09-l02-starter.xlsx", tab: "Live You Try It", columns: ["D", "E", "F", "G", "H", "I", "J"], active: "H6",
  formula: "", caption: "Student state: D6:G8 are inputs; H6:H8 remain blank for payment and reconciliation formulas.",
  rows: [
    { number: "5", cells: [
      { value: "Amount / Payment", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Formula Hint", className: "excel-header" }, { value: "FEEDBACK", className: "excel-header" },
    ]},
    ...[6, 7, 8].map((number) => ({ number: String(number), cells: [
      { value: "$320,000.00", className: "excel-input" }, { value: "6.50%", className: "excel-input" }, { value: "30", className: "excel-input" }, { value: "12", className: "excel-input" }, { address: `H${number}`, value: "", className: "excel-result" }, { value: number === 6 ? "Monthly payment" : number === 7 ? "Total paid" : "Total interest" }, { value: "Enter a formula." },
    ]})),
  ],
});

const l02ExcelFv = excelWindow({
  title: "bus123-math-m09-l02-starter.xlsx", tab: "Live You Try It", columns: ["D", "E", "F", "G", "H", "I", "J"], active: "H9",
  formula: "=FV(E9/G9,F9*G9,-D9,0)", caption: "Recurring-contribution model aligned to Live You Try It D9:J10.",
  rows: [
    { number: "5", cells: [{ value: "Amount / Payment", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Formula Hint", className: "excel-header" }, { value: "FEEDBACK", className: "excel-header" }]},
    { number: "9", cells: [{ value: "$500.00", className: "excel-input" }, { value: "7.00%", className: "excel-input" }, { value: "30", className: "excel-input" }, { value: "12", className: "excel-input" }, { address: "H9", value: "$609,985.50", className: "excel-result" }, { value: "Monthly contribution is an outflow" }, { value: "Correct formula and value.", className: "excel-ok" }]},
    { number: "10", cells: [{ value: "$500.00", className: "excel-input" }, { value: "7.00%", className: "excel-input" }, { value: "30", className: "excel-input" }, { value: "12", className: "excel-input" }, { value: "$180,000.00", className: "excel-result" }, { value: "Contribution x months" }, { value: "Correct formula and value.", className: "excel-ok" }]},
  ],
});

const l02ExcelPv = excelWindow({
  title: "bus123-math-m09-l02-starter.xlsx", tab: "Live You Try It", columns: ["D", "E", "F", "G", "H", "I", "J"], active: "H11",
  formula: "=PV(E11/G11,F11*G11,D11,0)", caption: "Payment-stream model aligned to Live You Try It D11:J11; the sign is interpreted from the buyer perspective.",
  rows: [
    { number: "5", cells: [{ value: "Amount / Payment", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Formula Hint", className: "excel-header" }, { value: "FEEDBACK", className: "excel-header" }]},
    { number: "11", cells: [{ value: "$1,500.00", className: "excel-input" }, { value: "5.00%", className: "excel-input" }, { value: "10", className: "excel-input" }, { value: "12", className: "excel-input" }, { address: "H11", value: "-$141,422.03", className: "excel-result" }, { value: "Received payment is positive" }, { value: "Correct formula and value.", className: "excel-ok" }]},
  ],
});

const l02ExcelTransfer = excelWindow({
  title: "bus123-math-m09-l02-starter.xlsx", tab: "Class Challenge", columns: ["B", "C", "D", "E", "F", "G", "H"], active: "G13",
  formula: "Ready for your formula", caption: "Independent transfer state: identical $50,000 nominal contributions, different timing; G13:G16 remain student work.",
  rows: [
    { number: "12", cells: [{ value: "Independent transfer", className: "excel-header" }, { value: "Amount", className: "excel-header" }, { value: "Annual Rate", className: "excel-header" }, { value: "Years", className: "excel-header" }, { value: "Periods / Year", className: "excel-header" }, { value: "FORMULA / RESULT", className: "excel-header" }, { value: "Decision Evidence / Hint", className: "excel-header" }]},
    { number: "13", cells: [{ value: "$50,000 today" }, { value: "$50,000.00", className: "excel-input" }, { value: "6.00%", className: "excel-input" }, { value: "10", className: "excel-input" }, { value: "12", className: "excel-input" }, { address: "G13", value: "", className: "excel-result" }, { value: "Lump-sum model" }]},
    { number: "14", cells: [{ value: "$416.67 monthly" }, { value: "$416.67", className: "excel-input" }, { value: "6.00%", className: "excel-input" }, { value: "10", className: "excel-input" }, { value: "12", className: "excel-input" }, { value: "", className: "excel-result" }, { value: "Recurring-payment model" }]},
    { number: "15", cells: [{ value: "Difference" }, { value: "" }, { value: "" }, { value: "" }, { value: "" }, { value: "", className: "excel-result" }, { value: "Reference the two results" }]},
  ],
});

function makeL01() {
  const slides = [
    titleSlide({ lesson: "MATH-M09-L01", title: "Compound Interest<br>& Future Value", subtitle: "Build the model. Audit the evidence. Recommend the stronger account.", image: "img/bus123-math-m09-l01-compounding-client-review.jpg", alt: "Advisor and client reviewing two long-term savings projections.", caption: "Meridian compares how timing changes the client's ending balance." }),
    slide(2, 0, "Today's path", agenda([
      { title: "Choose", text: "Recognize the growth structure" }, { title: "Build", text: "Construct and audit the Excel model" }, { title: "Compare", text: "Test frequency and estimation" }, { title: "Decide", text: "Recommend with numerical evidence" },
    ])),
    slide(3, 0, "By the end, I can", objectives([
      "Explain why compound growth changes the base each period.",
      "Construct an FV formula with cell references, cash-flow perspective, and matched periods.",
      "Reconcile an Excel result to an independent manual formula.",
      "Compare account alternatives and defend a recommendation with ending-balance evidence.",
    ])),
    slide(4, 0, "Bridge from simple interest", `
      <div class="photo-question">
        ${photo("img/bus123-math-m09-l01-growth-pattern-review.jpg", "Two colleagues comparing straight and curved growth patterns.", "Before calculating, identify what changes in the growth process.")}
        <div class="question-panel"><p class="eyebrow">RETRIEVAL · 3 MIN</p><h3>Which path bends upward?</h3><p>Individually choose a curve. Then tell a partner what changes in the calculation base.</p><p class="deliverable">Deliverable: one curve choice + one because statement</p></div>
      </div>`),
    section(1, 1, "Choose the growth model", "Structure before syntax: identify what earns interest and how time enters the model."),
    slide(6, 1, "Same rate. Different structure", `
      <div class="chart-table-layout">
        <svg class="growth-chart" viewBox="0 0 920 390" role="img" aria-labelledby="growth-title growth-desc">
          <title id="growth-title">Simple and compound growth on $1,000 at 5 percent</title>
          <desc id="growth-desc">Simple interest reaches $2,500 after 30 years while compound interest reaches $4,321.94.</desc>
          <line class="axis" x1="100" y1="340" x2="880" y2="340"/><line class="axis" x1="100" y1="340" x2="100" y2="65"/>
          <polyline class="line simple" points="100,340 125,336 227,320 353,301 860,222"/>
          <polyline class="line compound" points="100,340 125,336 227,318 353,291 860,79"/>
          <text class="svg-label simple-label" x="695" y="239">Simple: $2,500</text>
          <text class="svg-label compound-label" x="667" y="70">Compound: $4,321.94</text>
          <text class="svg-small" x="88" y="365">0</text><text class="svg-small" x="213" y="365">5</text><text class="svg-small" x="338" y="365">10</text><text class="svg-small" x="845" y="365">30 years</text>
          <text class="svg-small" x="30" y="345">$1,000</text><text class="svg-small" x="30" y="70">$4,500</text>
        </svg>
        <table class="evidence-table"><caption>Underlying numerical evidence</caption><thead><tr><th>Year</th><th>Simple</th><th>Compound</th></tr></thead><tbody><tr><td>1</td><td>$1,050.00</td><td>$1,050.00</td></tr><tr><td>5</td><td>$1,250.00</td><td>$1,276.28</td></tr><tr><td>10</td><td>$1,500.00</td><td>$1,628.89</td></tr><tr><td>30</td><td>$2,500.00</td><td>$4,321.94</td></tr></tbody></table>
      </div>`),
    slide(7, 1, "Four inputs form one dependency system", `
      <svg class="dependency-map" viewBox="0 0 1080 390" role="img" aria-labelledby="dep-title dep-desc">
        <title id="dep-title">Future-value dependency map</title><desc id="dep-desc">Principal, annual rate, years, and periods per year determine periodic rate and total periods, which determine future value.</desc>
        <g class="node input-node"><rect x="35" y="50" width="220" height="90" rx="16"/><text x="145" y="88">PRESENT VALUE</text><text x="145" y="118">Starting principal</text></g>
        <g class="node input-node"><rect x="35" y="245" width="220" height="90" rx="16"/><text x="145" y="283">ANNUAL RATE</text><text x="145" y="313">Nominal rate</text></g>
        <g class="node timing-node"><rect x="425" y="50" width="230" height="90" rx="16"/><text x="540" y="88">RATE PER PERIOD</text><text x="540" y="118">annual ÷ frequency</text></g>
        <g class="node timing-node"><rect x="425" y="245" width="230" height="90" rx="16"/><text x="540" y="283">TOTAL PERIODS</text><text x="540" y="313">years × frequency</text></g>
        <g class="node result-node"><rect x="820" y="145" width="225" height="100" rx="20"/><text x="932" y="185">FUTURE VALUE</text><text x="932" y="218">Ending balance</text></g>
        <path class="connector" d="M255 95 H425"/><path class="connector" d="M255 290 H425"/><path class="connector" d="M655 95 C740 95 745 178 820 185"/><path class="connector" d="M655 290 C740 290 745 212 820 205"/>
      </svg>
      <div class="rule-strip"><strong>Period lock:</strong><span>If rate is monthly, nper must be months.</span><span>If rate is quarterly, nper must be quarters.</span></div>`),
    slide(8, 1, "Choose the model before the function", `
      <div class="decision-route" role="img" aria-label="Method choice flow">
        <div class="route-start"><span>START</span><strong>What changes over time?</strong></div>
        <div class="route-arrow" aria-hidden="true">→</div>
        <div class="route-option"><strong>Original principal only</strong><p>Build a simple-interest expression</p></div>
        <div class="route-option featured"><strong>Accumulated balance</strong><p>Use a compound future-value model</p></div>
      </div>
      <div class="scenario-row"><div><span>A</span>$8,000 grows at a stated rate for 6 years.</div><div><span>B</span>A client adds $300 each month.</div><div><span>C</span>A balance earns interest only on its original principal.</div></div>
      <p class="prompt-line">Prompt: classify each structure first. Function selection comes second.</p>`),
    section(2, 2, "Build and audit in Excel", "The formula bar is evidence: inputs, references, timing, and signs must all agree."),
    slide(10, 2, "Instructor model: build from cells", `<div class="excel-with-formula">${l01ExcelInstructor}${formulaPanel("=FV(E6/G6,F6*G6,0,-D6)", "Manual audit: =D6*(1+E6/G6)^(F6*G6)", "Both produce $44,994.56")}</div>`),
    slide(11, 2, "Live You Try It: build, then audit", `<div class="activity-slide">${l01ExcelGuided}${activityBrief({ what: "Complete H6 with FV and H7 with the manual check.", how: "Individual build, then pair formula-bar audit.", time: "6 + 2 minutes", deliverable: "Two formulas and one matching result.", debrief: "Formula-bar reveal and one student explanation.", mastery: "Both cells contain formulas, reference inputs, and reconcile." })}</div>`, "activity-mode"),
    slide(12, 2, "Convincing evidence: two routes reconcile", `<div class="audit-layout">${l01ExcelAudit}<div class="audit-stamp reveal" data-reveal><span>RECONCILED</span><strong>$44,994.56</strong><p>Same assumptions. Different formula path. Same result.</p></div></div>`),
    slide(13, 2, "Frequency changes both rate and periods", `
      <div class="frequency-layout">
        <table class="evidence-table wide"><caption>$25,000 at 6% nominal annual rate for 5 years</caption><thead><tr><th>Frequency</th><th>Periodic rate</th><th>Periods</th><th>FV</th></tr></thead><tbody><tr><td>Annual</td><td>6.0000%</td><td>5</td><td>$33,455.64</td></tr><tr><td>Quarterly</td><td>1.5000%</td><td>20</td><td>$33,671.38</td></tr><tr><td>Monthly</td><td>0.5000%</td><td>60</td><td>$33,721.25</td></tr><tr><td>Daily</td><td>0.0164%</td><td>1,825</td><td>$33,745.64</td></tr></tbody></table>
        <div class="bar-chart" role="img" aria-label="Future values by compounding frequency"><div><span>Annual</span><i style="--w:73%"></i><strong>$33,455.64</strong></div><div><span>Quarterly</span><i style="--w:82%"></i><strong>$33,671.38</strong></div><div><span>Monthly</span><i style="--w:90%"></i><strong>$33,721.25</strong></div><div><span>Daily</span><i style="--w:96%"></i><strong>$33,745.64</strong></div></div>
      </div>
      <p class="model-note">Controlled comparison: principal, nominal rate, and years are held constant.</p>`),
    section(3, 3, "Compare and recommend", "Estimates support judgment; controlled Excel evidence decides between alternatives."),
    slide(15, 3, "Estimate first. Verify exactly", `
      <div class="rule72-visual">
        <div class="estimate-card"><span>FAST ESTIMATE</span><strong>72 ÷ 7 = 10.286 years</strong><p>Useful for a quick client conversation</p></div>
        <div class="timeline" role="img" aria-label="Rule of 72 estimate and exact NPER doubling time"><span class="start">$1</span><div class="track"><i class="exact" style="--x:88%"></i><i class="estimate" style="--x:91%"></i></div><span class="end">$2</span><p class="exact-label">Exact: 10.245</p><p class="estimate-label">Estimate: 10.286</p></div>
        ${formulaPanel("=NPER(7%,0,-1,2)", "Exact periodic doubling time", "10.245 years")}
      </div>
      <a class="tool-link" href="../shared/bus123-tvm-toolkit.html#rule-72">Open the Rule of 72 toolkit mode</a>`),
    slide(16, 3, "Decision lab: which account wins", `
      <div class="decision-photo-layout">
        ${photo("img/bus123-math-m09-l01-account-choice-review.jpg", "Advisor comparing two account options with a client.", "A higher nominal rate and higher frequency do not point to the same option.", "decision-photo")}
        <div class="decision-prompt"><p class="eyebrow">CLASS CHALLENGE</p><h3>$100,000 · 10 years</h3><div class="choice"><span>A</span><strong>4.0% annual</strong></div><div class="choice"><span>B</span><strong>3.8% monthly</strong></div></div>
      </div>
      ${activityBrief({ what: "Calculate both ending balances and the dollar difference.", how: "Pairs; one builder and one formula auditor, then switch.", time: "10 minutes", deliverable: "G6:G8 plus a two-sentence recommendation in G9.", debrief: "Vote, reveal workbook evidence, defend the winner.", mastery: "Matched timing, cell references, correct values, evidence-based choice." })}`,
      "activity-mode dominant-activity"),
    slide(17, 3, "Debrief: frequency did not overcome rate", `<div class="debrief-layout">${l01ExcelDecision}<div class="verdict-card reveal" data-reveal><span>RECOMMEND</span><strong>Account A</strong><p>$148,024.43 vs $146,140.69</p><em>Advantage: $1,883.74</em></div></div>`),
    slide(18, 3, "Common mistake: annual rate with monthly periods", `
      <div class="mistake-board">
        <div class="wrong"><span>WRONG MODEL</span><code>=FV(6%,20,0,-25000)</code><strong>$80,178.38</strong><p>6% per quarter was accidentally modeled.</p></div>
        <div class="correction"><span>CORRECT MODEL</span><code>=FV(6%/4,5*4,0,-25000)</code><strong>$33,671.38</strong><p>Quarterly rate and quarterly periods match.</p></div>
      </div>
      <p class="mistake-question">Excel calculated both formulas correctly. Which model did the business question require?</p>`, "mistake-slide"),
    slide(19, 4, "Discuss the model boundary", `
      <div class="discussion-pair"><div><span>01</span><h3>When is a fixed-rate FV model useful?</h3><p>Name one decision it supports and one assumption that must be disclosed.</p></div><div><span>02</span><h3>What evidence makes a recommendation defensible?</h3><p>Is a larger ending balance enough, or must the inputs and perspective also be audited?</p></div></div>`),
    slide(20, 4, "Three takeaways", `<div class="takeaway-list"><div><span>1</span><p>Compound growth changes the calculation base each period.</p></div><div><span>2</span><p>Rate and nper must use the same time unit, and signs must reflect a stated perspective.</p></div><div><span>3</span><p>A defensible decision combines formulas, reconciliation, and business interpretation.</p></div></div>`),
    slide(21, 4, "Up next: recurring cash flows", `<div class="up-next">${photo("img/bus123-math-m09-l01-recurring-payments-preview.jpg", "Household reviewing a recurring-payment schedule with an advisor.", "Next: model repeated payments for loans and savings goals.")}<div><p class="eyebrow">MATH-M09-L02</p><h3>From one deposit to a stream of payments</h3><p>PMT, annuities, loan terms, savings goals, and present-value decisions.</p></div></div>`),
    slide(22, 0, "", `<div class="close-copy"><p class="eyebrow">MATH-M09-L01 COMPLETE</p><h2>Questions</h2><p>Keep the workbook open. Your next model adds recurring payments.</p><span>BUS123 · Gerrish School of Business</span></div>`, "dark close-slide"),
  ];
  const notes = [
    "Welcome students and frame the lesson as a decision problem, not a formula recital. In about two minutes, point to the client scene and ask what evidence a client would need before choosing an account.",
    "Preview the four-part path in one minute. Tell students the workbook will be used during the Build and Decide sections, so it should already be open.",
    "Read the objectives as observable work products. Emphasize that a correct final value without a formula or interpretation will not satisfy the lesson standard.",
    "Retrieval activity, three minutes. Students choose the line or curve individually, then explain to a partner that compound interest changes the base. Likely misconception: compound simply means a higher rate. Debrief by asking what earns interest in period two.",
    "Section transition. State that structure comes before syntax; do not reveal the function students will need for later cases yet.",
    "Use the selected reading data, not every row. Ask students to predict where the gap becomes material. Expected response: the curves separate slowly at first, then faster because prior interest remains in the base.",
    "Trace the dependency map from assumptions to future value. Stress the period lock. Likely misconception: adjusting either rate or nper is enough. Response: require students to name both converted quantities.",
    "Have students classify the three cases before naming any function. Case B is not a lump-sum-only structure. The goal is method choice, not rapid calculation.",
    "Transition to Excel. Ask students to locate Live You Try It and keep H6:H7 blank until instructed.",
    "Model H6 slowly. Narrate the name box, formula bar, active cell, inputs, and result. Explain the investor perspective for the negative present value. Then point to the manual audit row without completing it for students.",
    "Activity: individual for six minutes, then pair audit for two. Deliverable is H6 and H7 with formulas. Mastery evidence: ISFORMULA, expected references, matching values. Likely misconceptions are hardcoding the answer or omitting the sign. Debrief by inspecting one formula bar rather than only the result.",
    "Reveal the completed audit after students have attempted both cells. Expected result is $44,994.56 in each. Rationale: two independent paths provide stronger evidence than a clean formula-error scan.",
    "Give students 45 seconds to rank the four results before reading the table. The chart and table use the same data. Emphasize that the comparison is controlled because principal, nominal rate, and years are held constant.",
    "Transition to judgment. Tell students that estimates and frequency effects matter only when interpreted alongside the complete set of assumptions.",
    "Compare Rule of 72 with exact NPER. Expected figures are 10.286 and 10.245 years. Likely misconception: the heuristic is guaranteed. Response: label it an estimate under a fixed-rate model.",
    "Class Challenge: pairs for ten minutes. One student builds and one audits, then switch. Required deliverable is G6:G8 and a two-sentence recommendation in G9. Mastery requires correct timing and evidence. Likely misconception: monthly compounding always wins. Do not reveal the winner until the debrief.",
    "Debrief by polling first, then reveal. Account A is $148,024.43; Account B is $146,140.69; A leads by $1,883.74. Ask which input overcame frequency and why.",
    "Common mistake diagnosis, four minutes. Excel returns $80,178.38 for the wrong formula because it was asked to model 6 percent each quarter. Instructor response: ask students to state the unit attached to rate and nper before touching the formula.",
    "Discussion, five minutes. Question one should surface fixed-rate, tax, fee, inflation, and volatility boundaries. Question two should produce formula references, reconciled values, and stated assumptions as evidence.",
    "Close the concept loop. Ask students to point to one takeaway they used in the Account A/B decision.",
    "Preview L02 with the image. The key shift is that pmt will no longer be zero. Do not begin teaching PMT here; keep this as a one-minute transfer preview.",
    "Invite final questions and remind students to save the starter workbook. Total planned time is 75 minutes including transitions, troubleshooting, and activity debriefs.",
  ];
  return { title: "Compound Interest & Future Value", sectionLabels: ["CHOOSE", "BUILD", "DECIDE"], sectionStarts: [5, 9, 14], slides, notes };
}

function makeL02() {
  const slides = [
    titleSlide({ lesson: "MATH-M09-L02", title: "PMT Function<br>& Annuities", subtitle: "Model recurring cash flows. Compare tradeoffs. Defend the recommendation.", image: "img/bus123-math-m09-l02-payment-plan-review.jpg", alt: "Clients reviewing mortgage and savings-payment alternatives with an advisor.", caption: "Recurring payments connect today's choices to long-term outcomes." }),
    slide(2, 0, "Today's path", agenda([{ title: "Classify", text: "Recognize timing and viewpoint" }, { title: "Build", text: "Construct and reconcile the payment model" }, { title: "Compare", text: "Test term and cash-flow tradeoffs" }, { title: "Decide", text: "Recommend with controlled evidence" }])),
    slide(3, 0, "By the end, I can", objectives([
      "Classify recurring cash flows by timing and perspective.",
      "Construct PMT, total-paid, and total-interest formulas with cell references.",
      "Choose among PMT, FV, and PV by identifying the unknown business quantity.",
      "Evaluate a loan or savings alternative and defend a recommendation with evidence.",
    ])),
    slide(4, 0, "Bridge: one amount becomes a stream", `<div class="photo-question">${photo("img/bus123-math-m09-l02-recurring-cash-flow-context.jpg", "Two colleagues mapping repeated payments on a calendar.", "The timing pattern determines the model.")}<div class="question-panel"><p class="eyebrow">RETRIEVAL · 3 MIN</p><h3>What repeats?</h3><p>Identify the amount, interval, start point, end point, and cash-flow direction.</p><p class="deliverable">Deliverable: one five-part cash-flow description</p></div></div>`),
    section(1, 1, "Classify the cash-flow pattern", "Timing and perspective determine how recurring payments enter the model."),
    slide(6, 1, "End of period or beginning", `
      <div class="annuity-timelines">
        <div class="annuity ordinary"><h3>Ordinary annuity</h3><p>Payment at each period end · type = 0</p><div class="cash-timeline" role="img" aria-label="Ordinary annuity payments at the end of each period"><span class="today">Today</span><i></i><b>1</b><i></i><b>2</b><i></i><b>3</b><em class="p1">↓</em><em class="p2">↓</em><em class="p3">↓</em></div><strong>Mortgage · month-end savings</strong></div>
        <div class="annuity due"><h3>Annuity due</h3><p>Payment at each period beginning · type = 1</p><div class="cash-timeline" role="img" aria-label="Annuity-due payments at the beginning of each period"><span class="today">Today</span><i></i><b>1</b><i></i><b>2</b><i></i><b>3</b><em class="p0">↓</em><em class="p1">↓</em><em class="p2">↓</em></div><strong>Beginning-of-period lease or premium</strong></div>
      </div>
      <p class="prompt-line">Pair check: classify rent paid on the first day of each month and a mortgage paid after each month.</p>`),
    slide(7, 1, "Signs describe one viewpoint", `
      <div class="perspective-map" role="img" aria-label="Borrower and investor cash-flow perspectives">
        <div class="perspective borrower"><span>BORROWER VIEW</span><div class="flow in"><b>Principal received</b><em>+</em></div><div class="flow out"><b>Payments made</b><em>-</em></div></div>
        <div class="perspective-center"><strong>Opposite directions</strong><p>Excel needs opposite signs across cash flows.</p><p>The chosen viewpoint determines which is positive.</p></div>
        <div class="perspective saver"><span>SAVER VIEW</span><div class="flow out"><b>Deposits made</b><em>-</em></div><div class="flow in"><b>Future balance received</b><em>+</em></div></div>
      </div>
      <p class="model-note">Never describe PMT, PV, or FV as universally positive or negative without naming the perspective.</p>`),
    slide(8, 1, "Choose by the unknown business quantity", `
      <svg class="function-map" viewBox="0 0 1080 410" role="img" aria-labelledby="fn-title fn-desc"><title id="fn-title">Function choice by unknown quantity</title><desc id="fn-desc">A payment question routes to PMT, a future balance question routes to FV, and a today's value question routes to PV.</desc>
        <g class="node question-node"><rect x="35" y="145" width="250" height="110" rx="18"/><text x="160" y="188">WHAT IS UNKNOWN?</text><text x="160" y="224">Name the business output</text></g>
        <path class="connector" d="M285 200 H410"/><path class="connector" d="M410 200 V75 H525"/><path class="connector" d="M410 200 H525"/><path class="connector" d="M410 200 V330 H525"/>
        <g class="node pm-node"><rect x="525" y="25" width="500" height="95" rx="16"/><text x="775" y="65">EQUAL PERIODIC PAYMENT</text><text x="775" y="95">loan payment or required deposit → PMT family</text></g>
        <g class="node fv-node"><rect x="525" y="152" width="500" height="95" rx="16"/><text x="775" y="192">FUTURE ENDING BALANCE</text><text x="775" y="222">recurring savings grows forward → FV family</text></g>
        <g class="node pv-node"><rect x="525" y="280" width="500" height="95" rx="16"/><text x="775" y="320">TODAY'S EQUIVALENT VALUE</text><text x="775" y="350">future payment stream discounts back → PV family</text></g>
      </svg>`),
    section(2, 2, "Build and reconcile the payment model", "Monthly payment is only one output; total paid and total interest make the decision evidence visible."),
    slide(10, 2, "Instructor model: financed principal to payment", `<div class="excel-with-formula">${l02ExcelInstructor}${formulaPanel("=PMT(E6/G6,F6*G6,D6,0)", "Reconcile: =ABS(H6)*F6*G6 and =H7-D8", "PMT = -$2,022.62 · Interest = $408,142.36")}</div>`, "model-compact"),
    slide(11, 2, "Live You Try It: payment plus reconciliation", `<div class="activity-slide">${l02ExcelGuided}${activityBrief({ what: "Complete H6 payment, H7 total paid, and H8 total interest.", how: "Individual build, then pair formula-bar audit.", time: "6 + 2 minutes", deliverable: "Three cell-referenced formulas.", debrief: "Trace payment → total paid → total interest.", mastery: "Correct formula signs, references, and reconciliation." })}</div>`, "activity-mode"),
    slide(12, 2, "Term tradeoff: payment relief has a lifetime cost", `
      <div class="term-visual">
        <div class="dual-bars" role="img" aria-label="Mortgage payment and total interest by term">
          <div class="bar-head"><span>Term</span><span>Monthly payment</span><span>Total interest</span></div>
          <div><b>10 yr</b><i class="pay" style="--w:100%"></i><strong>$3,633.54</strong><i class="interest" style="--w:28%"></i><strong>$116,024</strong></div>
          <div><b>15 yr</b><i class="pay" style="--w:77%"></i><strong>$2,787.54</strong><i class="interest" style="--w:45%"></i><strong>$181,758</strong></div>
          <div><b>20 yr</b><i class="pay" style="--w:66%"></i><strong>$2,385.83</strong><i class="interest" style="--w:62%"></i><strong>$252,600</strong></div>
          <div><b>30 yr</b><i class="pay" style="--w:56%"></i><strong>$2,022.62</strong><i class="interest" style="--w:100%"></i><strong>$408,142</strong></div>
        </div>
        <table class="evidence-table"><caption>Underlying loan-term evidence</caption><thead><tr><th>Term</th><th>Payment</th><th>Interest</th></tr></thead><tbody><tr><td>10</td><td>$3,633.54</td><td>$116,024.23</td></tr><tr><td>15</td><td>$2,787.54</td><td>$181,757.84</td></tr><tr><td>20</td><td>$2,385.83</td><td>$252,600.17</td></tr><tr><td>30</td><td>$2,022.62</td><td>$408,142.36</td></tr></tbody></table>
      </div>
      <p class="model-note">Separate scales: bars compare within each column; exact values remain visible.</p>`),
    slide(13, 2, "Decision lab: change one loan input", `
      <div class="decision-photo-layout">${photo("img/bus123-math-m09-l02-loan-tradeoff-decision.jpg", "Advisor and client discussing loan-term tradeoffs.", "A lower monthly payment can create a higher lifetime cost.", "decision-photo")}<div class="decision-prompt"><p class="eyebrow">TOOLKIT SENSITIVITY</p><h3>Change one input only</h3><p>Choose principal, rate, or term. Record what improves and what worsens.</p><a class="tool-link light" href="../shared/bus123-tvm-toolkit.html#loan-payment">Open Loan Payment mode</a></div></div>
      ${activityBrief({ what: "Change one driver and compare payment with total interest.", how: "Pairs; one controls the tool and one records evidence.", time: "8 minutes", deliverable: "One before/after table and one recommendation.", debrief: "Two pairs share opposite tradeoffs.", mastery: "Names the controlled input and both output effects." })}`, "activity-mode dominant-activity"),
    section(3, 3, "Transfer across recurring cash flows", "Choose the unknown, preserve perspective, and make a controlled comparison."),
    slide(15, 3, "Future value with monthly contributions", `<div class="excel-with-formula">${l02ExcelFv}${formulaPanel("=FV(E9/G9,F9*G9,-D9,0)", "Contributions: $500 × 360 = $180,000", "Modeled ending balance: $609,985.50")}</div>`),
    slide(16, 3, "Present value becomes a decision threshold", `<div class="pv-layout">${l02ExcelPv}<div class="offer-choice"><div><span>OFFER A</span><strong>$130,000</strong><p>Below |PV| → hold under stated assumptions</p></div><div><span>OFFER B</span><strong>$155,000</strong><p>Above |PV| → consider accepting</p></div><p>Contract, fees, taxes, and risk remain outside this simplified comparison.</p></div></div>`),
    slide(17, 3, "Independent transfer: equal dollars, different timing", `<div class="activity-slide">${l02ExcelTransfer}${activityBrief({ what: "Compare $50,000 today with $416.6667 at each month-end.", how: "Individual build; peer audit only after both formulas are complete.", time: "8 + 2 minutes", deliverable: "G13:G15 and a two-sentence timing explanation in G16.", debrief: "Compare formulas before revealing ending balances.", mastery: "Same total contribution, correct timing, valid cell references, defensible explanation." })}</div>`, "activity-mode transfer-activity"),
    slide(18, 3, "Common mistake: Excel obeys the periods you enter", `
      <div class="mistake-board"><div class="wrong"><span>WRONG MONTHLY MODEL</span><code>=PMT(6.5%,30,320000)</code><strong>-$24,504.78</strong><p>Thirty periods at 6.5% each.</p></div><div class="correction"><span>CORRECT MONTHLY MODEL</span><code>=PMT(6.5%/12,30*12,320000,0)</code><strong>-$2,022.62</strong><p>Monthly rate and 360 months.</p></div></div><p class="mistake-question">The formula is not broken. The modeler specified the wrong period unit.</p>`, "mistake-slide"),
    slide(19, 4, "Debrief the decisions", `
      <div class="discussion-pair"><div><span>01</span><h3>Loan term</h3><p>Which term supports monthly flexibility? Which minimizes lifetime interest? What client priority changes the recommendation?</p></div><div><span>02</span><h3>Contribution timing</h3><p>Why can equal nominal contributions produce different ending balances?</p></div></div>
      <div class="answer-strip reveal" data-reveal><strong>Transfer evidence:</strong><span>$50,000 today → $90,969.84</span><span>$416.67 monthly → $68,283.06</span><span>Timing advantage → $22,686.78</span></div>`),
    slide(20, 4, "Three takeaways", `<div class="takeaway-list"><div><span>1</span><p>Choose the function family by the unknown business quantity.</p></div><div><span>2</span><p>Match rate and nper, name the cash-flow perspective, and reconcile dependent outputs.</p></div><div><span>3</span><p>Payment, lifetime cost, timing, and model boundaries all belong in the recommendation.</p></div></div>`),
    slide(21, 4, "Up next: investment choices", `<div class="up-next">${photo("img/bus123-math-m09-l02-investment-preview.jpg", "Investment committee reviewing a diversified set of investment choices.", "Next: connect financial instruments to risk, return, and investor goals.")}<div><p class="eyebrow">MATH-M10</p><h3>Stocks, Bonds and Mutual Funds</h3><p>Move from deterministic cash-flow models to instruments with different risk and return profiles.</p></div></div>`),
    slide(22, 0, "", `<div class="close-copy"><p class="eyebrow">MATH-M09-L02 COMPLETE</p><h2>Questions</h2><p>Save the workbook with your formulas and recommendations.</p><span>BUS123 · Gerrish School of Business</span></div>`, "dark close-slide"),
  ];
  const notes = [
    "Open by asking students which is harder to evaluate: one deposit or a repeated payment commitment. Frame the lesson around payment, lifetime cost, and recommendation evidence.",
    "Preview the four-part path in one minute. Students should have the L02 starter open before the first Excel model.",
    "Emphasize observable outcomes. A student must select the method, construct formulas, reconcile outputs, and make a defensible recommendation.",
    "Retrieval, three minutes. Students name amount, interval, start, end, and direction. Likely misconception: every repeated payment has the same timing. Debrief by comparing rent at the beginning of a month with a mortgage paid at month-end.",
    "Transition to cash-flow classification. Tell students that timing and viewpoint come before function syntax.",
    "Pair classification, three minutes. Ordinary annuity payments occur at period end; annuity-due payments occur at period beginning. Likely misconception: annuity means investment only. Respond with loan, lease, and settlement examples.",
    "Use the borrower and saver maps to explain signs. Expected response: cash received and cash paid must have opposite signs. Correct any claim that PMT is always negative by naming the viewpoint.",
    "Ask students to identify the unknown in three spoken cases before revealing the routing labels. The teaching message is to choose by business output, not by surface vocabulary.",
    "Transition to the mortgage model. Define $320,000 as financed principal and state the simplified-model exclusions before opening the formula bar.",
    "Model H6, H7, and H8 as a dependency chain. Expected outputs are -$2,022.62, $728,142.36, and $408,142.36. Keep full PMT precision. The visible Excel replica matches the workbook's cells and tab.",
    "Activity: individual six minutes, pair audit two. Deliverable is H6:H8 with formulas. Mastery requires references and reconciliation. Likely misconception: multiplying the rounded displayed payment. Response: inspect the formula bar and retain full precision.",
    "Explain that payment and total interest use separate visual scales; exact evidence remains in the table. Ask students to describe the tradeoff without saying one term is universally best.",
    "Toolkit activity: pairs for eight minutes. Change one input only, record before/after payment and interest, then recommend. Mastery evidence is a controlled comparison. Likely misconception: the lowest monthly payment is automatically best. Debrief with two contrasting changes.",
    "Transition to transfer. Students will now apply the same period and perspective rules to savings and present-value questions.",
    "Walk through H9 and H10. Expected FV is $609,985.50 and total contribution is $180,000. Label the fixed 7 percent return as a training assumption, not a forecast.",
    "Model H11 and interpret the negative sign as the buyer's cost for a positive receipt stream. Compare $130,000 and $155,000 only under the stated discount rate and exclusions.",
    "Independent activity: eight minutes, then peer audit for two. Do not reveal results until both formulas are complete. Mastery requires equal total nominal contributions, correct timing, cell references, and a written explanation. Likely misconception: monthly contributions have the same time invested as the lump sum.",
    "Mistake diagnosis, four minutes. The wrong formula produces -$24,504.78 because Excel sees 30 periods at 6.5 percent each. Ask students to state the intended payment unit and repair both rate and nper.",
    "Discussion and debrief, six minutes. Reveal the answer strip after student explanations. Expected transfer values are $90,969.84 and $68,283.06; difference $22,686.78. Rationale: the lump sum has the full ten years to compound.",
    "Use the three takeaways as a retrieval check. Ask one student to connect each takeaway to a specific workbook cell or decision.",
    "Preview M10 accurately: Stocks, Bonds and Mutual Funds. Explain that the next module adds instrument risk and return rather than assuming one fixed periodic rate.",
    "Invite final questions and remind students to save formulas and recommendations. Total planned time is 75 minutes including setup, troubleshooting, activities, and debrief.",
  ];
  return { title: "PMT Function & Annuities", sectionLabels: ["CLASSIFY", "BUILD", "TRANSFER"], sectionStarts: [5, 9, 14], slides, notes };
}

function renderDeck(config) {
  const tabButtons = config.sectionLabels.map((label, i) => `<button class="section-tab tab-${i + 1}" data-jump="${config.sectionStarts[i] - 1}" aria-label="Jump to ${label}"><span></span>${label}</button>`).join("");
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<link rel="icon" href="data:,">
<title>BUS123 · MATH-M09 · ${config.title}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<style>
:root{
  --ink:#0E1116;--paper:#FAF8F3;--paper-2:#F2EEE5;--white:#FFFFFF;--text:#1A1F2C;--text-soft:#4A5567;--muted:#7A8290;--border:#E5E1D6;--sage:#4A7C5E;--gold:#B8843D;--terra:#9C4A2B;--steel:#355773;--formula-bg:#EAF3EC;--gradient:linear-gradient(90deg,var(--gold),var(--terra),var(--sage));
  --serif:"Bodoni Moda",serif;--sans:"DM Sans",sans-serif;--mono:"JetBrains Mono",monospace;
  --type-display:72px;--type-title:46px;--type-subtitle:30px;--type-lead:24px;--type-body:20px;--type-small:16px;--type-eyebrow:15px;--type-stat:140px;
}
*{box-sizing:border-box}html,body{margin:0;width:100%;height:100%;overflow:hidden;background:var(--ink);color:var(--text);font-family:var(--sans)}button,a{font:inherit}.deck-shell{width:1280px;height:720px;transform-origin:0 0;position:absolute;display:grid;grid-template-columns:84px 1196px;background:var(--ink)}.tabs{background:var(--ink);display:flex;flex-direction:column;align-items:center;padding:18px 8px;gap:14px;z-index:20}.home-dot{width:42px;height:42px;border:0;border-radius:50%;background:var(--gradient);cursor:pointer}.section-tab{width:68px;min-height:104px;padding:8px 4px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--white);font-family:var(--mono);font-size:var(--type-eyebrow);font-weight:700;letter-spacing:.08em;writing-mode:vertical-rl;transform:rotate(180deg);cursor:pointer}.section-tab span{display:inline-block;width:9px;height:9px;border-radius:50%;margin-bottom:8px}.tab-1 span{background:var(--sage)}.tab-2 span{background:var(--gold)}.tab-3 span{background:var(--terra)}.section-tab.active{background:var(--paper);color:var(--ink);border-color:var(--border)}.stage{position:relative;width:1196px;height:720px;background:var(--ink);overflow:hidden}.slide{position:absolute;inset:0;background:var(--paper);padding:48px 62px 70px;display:none;overflow:hidden}.slide.active{display:block}.slide.dark{background:var(--ink);color:var(--white)}.slide.has-gradient::before{content:"";position:absolute;top:0;left:0;right:0;height:9px;background:var(--gradient)}.slide-header{margin-bottom:22px}.eyebrow{font:700 var(--type-eyebrow)/1.2 var(--mono);letter-spacing:.11em;text-transform:uppercase;color:var(--sage);margin:0 0 10px}.dark .eyebrow{color:var(--gold)}h1,h2,h3,p{margin-top:0}h1{font:900 var(--type-display)/.98 var(--serif);letter-spacing:-.035em;margin-bottom:20px}h2{font:900 var(--type-title)/1.02 var(--serif);letter-spacing:-.025em;margin-bottom:0}h3{font:700 30px/1.1 var(--serif);margin-bottom:12px}p,li,td,th{font-size:var(--type-body);line-height:1.35}.lead{font-size:var(--type-lead);line-height:1.35;color:var(--text-soft)}.lead.on-dark{color:var(--paper-2)}.slide-body{height:calc(100% - 88px)}.title-slide{padding:0}.title-photo{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.title-shade{position:absolute;inset:0;background:linear-gradient(90deg,var(--ink) 0%,var(--ink) 34%,transparent 76%);opacity:.94}.title-copy{position:absolute;left:70px;top:92px;width:620px}.title-copy h1{max-width:600px}.title-subtitle{font:400 var(--type-subtitle)/1.3 var(--serif);font-style:italic;color:var(--paper-2);max-width:560px}.photo-credit{position:absolute;top:500px;left:0;width:570px;font-size:var(--type-small);color:var(--paper-2);border-left:4px solid var(--sage);padding-left:14px}.section-break{display:none;grid-template-columns:250px 1fr;align-items:center;gap:60px;padding:90px}.section-break.active{display:grid}.break-number{font:900 var(--type-stat)/1 var(--serif);color:var(--gold);border-right:2px solid var(--text-soft);padding-right:50px;text-align:right}.section-break h2{font-size:62px}.agenda-path{display:grid;grid-template-columns:repeat(4,1fr);gap:22px;align-items:stretch;height:390px;margin-top:36px}.agenda-step{position:relative;background:var(--white);border:1px solid var(--border);border-top:8px solid var(--sage);padding:30px 24px;border-radius:10px}.agenda-step:nth-child(2){border-top-color:var(--gold)}.agenda-step:nth-child(3){border-top-color:var(--terra)}.agenda-step:nth-child(4){border-top-color:var(--steel)}.agenda-step span{display:block;font:700 56px/1 var(--serif);color:var(--paper-2);margin-bottom:26px}.agenda-step strong{font-size:26px}.agenda-step p{font-size:18px;color:var(--text-soft);margin-top:12px}.objective-stack{display:grid;grid-template-columns:1fr 1fr;gap:22px;margin-top:28px}.objective{display:grid;grid-template-columns:72px 1fr;align-items:center;min-height:150px;background:var(--white);border:1px solid var(--border);padding:22px;border-radius:12px}.objective span{font:700 36px/1 var(--mono);color:var(--sage)}.objective p{margin:0;font-size:22px}.photo-frame{margin:0;position:relative;border-radius:14px;overflow:hidden;background:var(--paper-2)}.photo-frame img{width:100%;height:100%;object-fit:cover;display:block}.photo-frame figcaption{position:absolute;left:0;right:0;bottom:0;background:var(--ink);color:var(--white);padding:12px 16px;font-size:var(--type-small)}.photo-question{display:grid;grid-template-columns:58% 42%;height:450px;border-radius:14px;overflow:hidden}.photo-question .photo-frame{border-radius:0}.question-panel{background:var(--white);padding:45px 36px;border:1px solid var(--border)}.question-panel h3{font-size:38px}.question-panel .deliverable{margin-top:38px;border-left:4px solid var(--gold);padding:12px;background:var(--paper-2);font-size:18px}.chart-table-layout{display:grid;grid-template-columns:65% 35%;gap:24px;align-items:center}.growth-chart{width:100%;height:390px;background:var(--white);border:1px solid var(--border);border-radius:12px}.axis{stroke:var(--muted);stroke-width:2}.line{fill:none;stroke-width:7;stroke-linecap:round;stroke-linejoin:round}.line.simple{stroke:var(--steel)}.line.compound{stroke:var(--sage)}.svg-label{font:700 20px var(--sans)}.simple-label{fill:var(--steel)}.compound-label{fill:var(--sage)}.svg-small{font:500 16px var(--mono);fill:var(--text-soft)}.evidence-table{width:100%;border-collapse:collapse;background:var(--white);border:1px solid var(--border)}.evidence-table caption{font:700 var(--type-small) var(--mono);text-align:left;padding:10px;color:var(--text-soft)}.evidence-table th{background:var(--ink);color:var(--gold);font-size:16px;padding:10px;text-align:left}.evidence-table td{font-size:16px;padding:10px;border-bottom:1px solid var(--border)}.evidence-table tbody tr:last-child{background:var(--formula-bg);font-weight:700}.dependency-map{width:100%;height:390px}.node rect{stroke-width:3}.node text{text-anchor:middle;font:700 18px var(--sans);fill:var(--text)}.node text+text{font:400 16px var(--sans);fill:var(--text-soft)}.input-node rect{fill:var(--white);stroke:var(--sage)}.timing-node rect{fill:var(--formula-bg);stroke:var(--gold)}.result-node rect{fill:var(--paper-2);stroke:var(--steel)}.connector{fill:none;stroke:var(--text-soft);stroke-width:4}.rule-strip{display:flex;gap:24px;align-items:center;background:var(--ink);color:var(--white);padding:16px 22px;border-radius:8px;font-size:18px}.rule-strip strong{color:var(--gold)}.decision-route{display:grid;grid-template-columns:220px 50px 1fr 1fr;gap:18px;align-items:stretch;margin:30px 0}.route-start,.route-option{background:var(--white);border:2px solid var(--border);border-radius:12px;padding:24px;min-height:170px}.route-start span{font:700 var(--type-small) var(--mono);color:var(--sage)}.route-start strong,.route-option strong{display:block;font-size:23px;margin-top:14px}.route-option.featured{background:var(--formula-bg);border-color:var(--sage)}.route-option p{font-size:18px;color:var(--text-soft)}.route-arrow{font:700 50px var(--serif);display:grid;place-items:center;color:var(--gold)}.scenario-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.scenario-row div{font-size:18px;background:var(--paper-2);padding:16px;border-left:4px solid var(--steel)}.scenario-row span{font:700 22px var(--mono);color:var(--steel);margin-right:10px}.prompt-line{font-weight:600;margin-top:24px}.excel-window{margin:0;background:var(--white);border:2px solid var(--ink);border-radius:9px;overflow:hidden;box-shadow:0 10px 24px rgba(0,0,0,.12)}.excel-titlebar{height:32px;background:var(--ink);color:var(--white);display:grid;grid-template-columns:70px 1fr 70px;align-items:center;padding:0 10px;font-size:16px}.excel-titlebar strong{text-align:center}.excel-app{color:var(--gold);font-weight:700}.excel-ribbon{display:flex;gap:28px;padding:7px 14px;background:var(--paper-2);font-size:16px;border-bottom:1px solid var(--border)}.excel-formula{height:39px;display:grid;grid-template-columns:82px 38px 1fr;align-items:center;border-bottom:1px solid var(--border);font-family:var(--mono);font-size:16px}.name-box{padding:9px;border-right:1px solid var(--border);font-weight:700}.fx{text-align:center;color:var(--sage);font-style:italic}.formula-bar{padding:8px 12px;border-left:1px solid var(--border);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.excel-row{display:grid;grid-template-columns:38px 128px 112px 86px 110px 150px 176px 176px}.excel-cell{min-height:36px;padding:7px 8px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);font-size:16px;line-height:1.15;overflow:hidden}.excel-rownum,.excel-letter,.excel-corner{background:var(--paper-2);text-align:center;font-family:var(--mono);color:var(--text-soft)}.excel-letters .excel-cell{min-height:28px;padding:5px}.excel-header{background:var(--ink);color:var(--gold);font-weight:700}.excel-input{background:var(--paper-2);font-weight:600}.excel-result{background:var(--formula-bg);color:var(--steel);font-weight:700;border-left:3px solid var(--gold)}.excel-active{outline:4px solid var(--steel);outline-offset:-4px;position:relative}.excel-active::after{content:"ACTIVE";position:absolute;right:3px;bottom:2px;font:700 10px var(--mono);color:var(--steel)}.excel-ok{color:var(--sage);font-weight:700}.excel-tabs{display:flex;gap:5px;background:var(--paper-2);padding:7px 12px;font-size:14px;white-space:nowrap}.excel-tabs span{padding:5px 8px;border:1px solid var(--border)}.excel-tabs .active-tab{background:var(--white);border-bottom:3px solid var(--sage);font-weight:700}.excel-window figcaption{font-size:16px;color:var(--text-soft);padding:7px 12px}.excel-with-formula{display:grid;grid-template-columns:1fr;gap:15px}.formula-panel{background:var(--formula-bg);color:var(--ink);border-left:4px solid var(--sage);font:500 18px/1.35 var(--mono);padding:16px 20px;border-radius:4px}.formula-excel{font-size:22px;font-weight:700;color:var(--steel);display:block;margin-bottom:14px}.formula-manual{display:inline-block;margin-right:24px}.formula-result{font-weight:700;color:var(--sage)}.activity-slide{display:grid;gap:16px}.activity-brief{display:grid;grid-template-columns:repeat(3,1fr);gap:8px;background:var(--ink);padding:12px;border-radius:10px}.activity-brief div{background:var(--white);padding:10px 12px;min-height:72px}.activity-brief span{display:block;font:700 13px var(--mono);color:var(--terra);margin-bottom:5px}.activity-brief strong{font-size:16px;line-height:1.25}.audit-layout,.debrief-layout{display:grid;grid-template-columns:1fr 250px;gap:20px;align-items:center}.audit-stamp,.verdict-card{background:var(--ink);color:var(--white);padding:28px 20px;border-radius:14px;text-align:center;border-top:8px solid var(--sage)}.audit-stamp span,.verdict-card span{font:700 var(--type-small) var(--mono);color:var(--gold)}.audit-stamp strong,.verdict-card strong{font:900 36px var(--serif);display:block;margin:18px 0}.audit-stamp p,.verdict-card p{font-size:18px}.verdict-card em{display:block;font:700 20px var(--mono);color:var(--gold)}.reveal{opacity:0;transform:translateY(12px);transition:opacity .2s,transform .2s}.reveal.shown{opacity:1;transform:none}.frequency-layout{display:grid;grid-template-columns:58% 42%;gap:22px}.evidence-table.wide td,.evidence-table.wide th{font-size:17px}.bar-chart{display:grid;gap:18px;padding:20px;background:var(--white);border:1px solid var(--border);border-radius:10px}.bar-chart div{display:grid;grid-template-columns:82px 1fr 112px;gap:8px;align-items:center;font-size:16px}.bar-chart i{display:block;width:var(--w);height:26px;background:var(--sage);border-left:5px solid var(--gold)}.bar-chart strong{font-family:var(--mono);font-size:16px}.model-note{font-size:16px;color:var(--text-soft);margin-top:12px}.rule72-visual{display:grid;grid-template-columns:33% 37% 30%;gap:18px;align-items:center}.estimate-card{background:var(--ink);color:var(--white);padding:28px;border-radius:12px}.estimate-card span{font:700 15px var(--mono);color:var(--gold)}.estimate-card strong{font:900 33px/1.15 var(--serif);display:block;margin:20px 0}.estimate-card p{font-size:17px}.timeline{position:relative;height:220px;background:var(--white);border:1px solid var(--border);border-radius:12px;padding:80px 42px}.timeline .track{height:8px;background:var(--border);position:relative}.timeline i{position:absolute;left:var(--x);top:-17px;width:4px;height:42px}.timeline .exact{background:var(--sage)}.timeline .estimate{background:var(--terra)}.timeline .start,.timeline .end{position:absolute;top:70px;font:700 22px var(--mono)}.timeline .start{left:10px}.timeline .end{right:10px}.exact-label,.estimate-label{position:absolute;font-size:15px}.exact-label{left:38%;bottom:34px;color:var(--sage)}.estimate-label{left:47%;bottom:8px;color:var(--terra)}.tool-link{display:inline-block;margin-top:20px;background:var(--steel);color:var(--white);padding:12px 18px;border-radius:7px;text-decoration:none;font-weight:700}.tool-link:focus{outline:4px solid var(--gold);outline-offset:3px}.tool-link.light{background:var(--white);color:var(--ink)}.decision-photo-layout{display:grid;grid-template-columns:62% 38%;height:285px;border-radius:14px;overflow:hidden;margin-bottom:14px}.decision-photo-layout .photo-frame{border-radius:0}.decision-prompt{background:var(--ink);color:var(--white);padding:26px}.decision-prompt h3{font-size:34px}.choice{display:flex;gap:12px;align-items:center;margin:12px 0;background:var(--paper);color:var(--ink);padding:10px 14px}.choice span{font:700 23px var(--mono);color:var(--terra)}.dominant-activity .slide-header{margin-bottom:14px}.mistake-slide{background:var(--terra);color:var(--white)}.mistake-slide .eyebrow{color:var(--paper)}.mistake-board{display:grid;grid-template-columns:1fr 1fr;gap:26px}.mistake-board>div{padding:34px;border-radius:12px;min-height:270px}.mistake-board span{font:700 15px var(--mono);letter-spacing:.1em}.mistake-board code{display:block;font:700 20px var(--mono);margin:24px 0;background:var(--paper);color:var(--ink);padding:16px}.mistake-board strong{display:block;font:900 42px var(--serif)}.mistake-board p{font-size:18px}.wrong{background:var(--ink)}.correction{background:var(--paper);color:var(--ink);border:5px solid var(--gold)}.mistake-question{font-size:23px;font-weight:700;margin-top:28px;text-align:center}.discussion-pair{display:grid;grid-template-columns:1fr 1fr;gap:30px;margin-top:30px}.discussion-pair>div{background:var(--white);border:2px solid var(--border);padding:36px;border-radius:14px;min-height:300px}.discussion-pair span{font:700 40px var(--mono);color:var(--sage)}.discussion-pair h3{font-size:34px;margin-top:25px}.discussion-pair p{font-size:21px}.takeaway-list{display:grid;gap:22px;margin-top:28px}.takeaway-list div{display:grid;grid-template-columns:80px 1fr;align-items:center;background:var(--white);border:1px solid var(--border);padding:22px;border-radius:10px}.takeaway-list span{font:900 44px var(--serif);color:var(--gold)}.takeaway-list p{font-size:24px;margin:0}.up-next{display:grid;grid-template-columns:58% 42%;height:450px;background:var(--ink);color:var(--white);border-radius:14px;overflow:hidden}.up-next .photo-frame{border-radius:0}.up-next>div{padding:50px 36px}.up-next h3{font-size:40px}.up-next p{color:var(--paper-2)}.close-slide{display:none;place-items:center;text-align:center}.close-slide.active{display:grid}.close-copy h2{font-size:86px}.close-copy p{font-size:24px}.close-copy span{font:700 16px var(--mono);color:var(--muted)}.annuity-timelines{display:grid;grid-template-columns:1fr 1fr;gap:24px}.annuity{background:var(--white);border:2px solid var(--border);padding:28px;border-radius:12px}.annuity h3{font-size:32px}.annuity p{font-size:18px;color:var(--text-soft)}.cash-timeline{position:relative;display:grid;grid-template-columns:70px 1fr 30px 1fr 30px 1fr 30px;align-items:center;height:150px}.cash-timeline i{height:4px;background:var(--text-soft)}.cash-timeline b{font:700 18px var(--mono);text-align:center}.cash-timeline em{position:absolute;font:700 36px var(--mono);color:var(--terra);top:68px}.cash-timeline .p0{left:56px}.cash-timeline .p1{left:34%}.cash-timeline .p2{left:64%}.cash-timeline .p3{right:8px}.cash-timeline .today{font-size:16px}.perspective-map{display:grid;grid-template-columns:1fr 280px 1fr;gap:20px;align-items:center}.perspective{padding:28px;border-radius:14px;background:var(--white);border:2px solid var(--border)}.perspective>span{font:700 15px var(--mono);color:var(--sage)}.flow{display:flex;justify-content:space-between;align-items:center;padding:20px;margin-top:18px;border-left:5px solid var(--sage);background:var(--formula-bg)}.flow.out{border-left-color:var(--terra);background:var(--paper-2)}.flow em{font:900 38px var(--serif)}.perspective-center{text-align:center}.perspective-center strong{font:900 30px var(--serif)}.perspective-center p{font-size:17px}.function-map{width:100%;height:410px}.question-node rect{fill:var(--ink);stroke:var(--gold);stroke-width:3}.question-node text{fill:var(--white)}.pm-node rect,.fv-node rect,.pv-node rect{fill:var(--white);stroke:var(--sage);stroke-width:3}.term-visual{display:grid;grid-template-columns:63% 37%;gap:20px}.dual-bars{background:var(--white);padding:18px;border:1px solid var(--border);border-radius:10px}.dual-bars>div{display:grid;grid-template-columns:60px 1fr 104px 1fr 104px;gap:8px;align-items:center;min-height:55px;font-size:16px}.dual-bars .bar-head{font:700 14px var(--mono);color:var(--text-soft);grid-template-columns:60px 1fr 104px 1fr 104px}.dual-bars i{display:block;height:22px;width:var(--w)}.dual-bars .pay{background:var(--steel)}.dual-bars .interest{background:var(--terra)}.dual-bars strong{font:700 15px var(--mono)}.pv-layout{display:grid;grid-template-columns:70% 30%;gap:18px}.offer-choice{display:grid;gap:12px}.offer-choice>div{background:var(--white);padding:17px;border:2px solid var(--border);border-left:6px solid var(--sage)}.offer-choice span{font:700 14px var(--mono);color:var(--terra)}.offer-choice strong{display:block;font:900 34px var(--serif);margin:7px 0}.offer-choice p{font-size:16px}.offer-choice>p{font-size:15px;color:var(--text-soft)}.answer-strip{display:flex;gap:14px;align-items:center;background:var(--ink);color:var(--white);padding:14px 18px;margin-top:18px;border-left:6px solid var(--gold)}.answer-strip strong{color:var(--gold)}.answer-strip span{font:600 16px var(--mono)}.notes-panel{position:absolute;left:104px;right:24px;bottom:70px;max-height:245px;overflow:auto;background:var(--ink);color:var(--white);padding:18px 24px;border:2px solid var(--gold);border-radius:8px;z-index:50;font-size:18px;line-height:1.45;display:none}.notes-panel.open{display:block}.notes-panel strong{color:var(--gold)}.controls{position:absolute;right:22px;bottom:18px;display:flex;gap:10px;align-items:center;z-index:60}.controls button{width:46px;height:38px;border:1px solid var(--border);border-radius:7px;background:var(--white);color:var(--ink);font-weight:700;cursor:pointer}.controls button:focus,.home-dot:focus,.section-tab:focus{outline:4px solid var(--gold);outline-offset:2px}.counter{font:700 16px var(--mono);color:var(--white);background:var(--ink);padding:8px 12px;border-radius:6px}.keyboard-hint{position:absolute;left:104px;bottom:22px;color:var(--muted);font:500 13px var(--mono);z-index:40}@media (prefers-reduced-motion:reduce){*,*::before,*::after{transition:none!important;animation:none!important}}
.excel-tabs{font-size:15px;padding:5px 10px}.excel-active::after{display:none}.excel-with-formula{gap:8px}.formula-panel{padding:10px 18px}.formula-excel{margin-bottom:6px}.activity-slide{gap:8px}.activity-mode .activity-slide{gap:6px}.activity-slide .excel-window figcaption{display:none}.activity-brief{gap:6px;padding:8px}.activity-brief div{display:grid;grid-template-columns:100px 1fr;gap:8px;align-items:start;min-height:58px;padding:8px 10px}.activity-brief span{font-size:15px;line-height:1.1;margin:0}.activity-brief strong{font-size:16px;line-height:1.18}.dual-bars .bar-head{font-size:15px}.offer-choice span{font-size:15px}.keyboard-hint{font-size:15px}.model-compact h2{font-size:42px}.model-compact .slide-header{margin-bottom:12px}.model-compact .excel-window figcaption{display:none}.model-compact .formula-panel{display:flex;align-items:center;gap:18px;padding:7px 14px;font-size:16px;white-space:nowrap}.model-compact .formula-excel{font-size:20px;margin:0}.model-compact .formula-manual{margin:0}.transfer-activity h2{font-size:40px}.transfer-activity .slide-header{margin-bottom:8px}.transfer-activity .excel-ribbon{display:none}.transfer-activity .excel-titlebar{height:28px}.transfer-activity .excel-formula{height:32px}.transfer-activity .excel-cell{min-height:28px;padding:4px 7px}.transfer-activity .excel-letters .excel-cell{min-height:22px;padding:2px}.transfer-activity .excel-tabs{padding:3px 8px}.transfer-activity .activity-brief{gap:4px;padding:6px}.transfer-activity .activity-brief div{min-height:52px;padding:5px 8px}.transfer-activity .activity-brief strong{line-height:1.1}
</style>
</head>
<body>
<main class="deck-shell" aria-label="BUS123 slide deck">
  <nav class="tabs" aria-label="Deck sections"><button class="home-dot" data-jump="0" aria-label="Go to title slide"></button>${tabButtons}</nav>
  <div class="stage">
    ${config.slides.join("\n")}
    <aside class="notes-panel" aria-live="polite"><strong>Speaker notes</strong><div id="note-text"></div></aside>
    <div class="keyboard-hint">← → navigate · SPACE reveals · N notes · HOME/END</div>
    <div class="controls"><span class="counter" aria-live="polite">1 / 22</span><button id="prev" aria-label="Previous slide">←</button><button id="next" aria-label="Next slide or reveal">→</button><button id="notes" aria-label="Toggle speaker notes">N</button></div>
  </div>
</main>
<script type="application/json" id="speaker-notes">${JSON.stringify(config.notes)}</script>
<script>
(function(){
  var W=1280,H=720,deck=document.querySelector('.deck-shell');
  function fit(){var s=Math.min(window.innerWidth/W,window.innerHeight/H);deck.style.transform='translate('+((innerWidth-W*s)/2)+'px,'+((innerHeight-H*s)/2)+'px) scale('+s+')'}
  window.addEventListener('resize',fit);fit();
  var slides=Array.from(document.querySelectorAll('.slide')),notes=JSON.parse(document.getElementById('speaker-notes').textContent),index=0;
  var counter=document.querySelector('.counter'),notePanel=document.querySelector('.notes-panel'),noteText=document.getElementById('note-text');
  function update(){slides.forEach(function(s,i){s.classList.toggle('active',i===index)});counter.textContent=(index+1)+' / '+slides.length;noteText.textContent=notes[index]||'';document.querySelectorAll('.section-tab').forEach(function(tab,i){tab.classList.toggle('active',slides[index].dataset.section===String(i+1))});}
  function show(i){index=Math.max(0,Math.min(slides.length-1,i));update()}
  function next(){var hidden=slides[index].querySelector('.reveal:not(.shown)');if(hidden){hidden.classList.add('shown');return}show(index+1)}
  function prev(){var shown=Array.from(slides[index].querySelectorAll('.reveal.shown'));if(shown.length){shown[shown.length-1].classList.remove('shown');return}show(index-1)}
  document.getElementById('next').addEventListener('click',next);document.getElementById('prev').addEventListener('click',prev);document.getElementById('notes').addEventListener('click',function(){notePanel.classList.toggle('open')});
  document.querySelectorAll('[data-jump]').forEach(function(btn){btn.addEventListener('click',function(){show(Number(btn.dataset.jump))})});
  document.addEventListener('keydown',function(e){if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();next()}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();prev()}else if(e.key==='Home'){show(0)}else if(e.key==='End'){show(slides.length-1)}else if(e.key.toLowerCase()==='n'){notePanel.classList.toggle('open')}else if(e.key==='Escape'){notePanel.classList.remove('open')}});update();
})();
</script>
</body>
</html>`;
}

for (const [filename, deck] of [
  ["bus123-math-m09-l01-slides.html", makeL01()],
  ["bus123-math-m09-l02-slides.html", makeL02()],
]) {
  if (deck.slides.length !== 22 || deck.notes.length !== 22) throw new Error(`${filename}: slide/note count must be 22`);
  await fs.writeFile(path.join(outputDir, filename), renderDeck(deck).replace(/[ \t]+$/gm, ""));
  console.log(`Built ${filename}: ${deck.slides.length} slides, ${deck.notes.length} notes`);
}
