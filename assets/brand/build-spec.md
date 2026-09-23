# BUS123 Slide Deck — Portable Build Spec (build-spec.md)

**Engine-agnostic. Self-contained. Paste this whole document into any AI tool, then ask it to build a deck.**

This spec describes how to build a BUS123 lecture slide deck so that the result looks
and behaves the same whether the deck is built by Claude, ChatGPT, Gemini, Copilot, or any
other assistant. It deliberately contains no file paths, no repository links, no "skills,"
and no tool names — only literal values the model needs. Everything required to reproduce
the design is written out below.

This file is the single design source of truth for BUS123, maintained in the public
course repository at `assets/brand/build-spec.md`. The `bus123-branded-slides` skill
reads this repository copy; its bundled reference is only a fallback snapshot.
The former Drive copy is archival and is no longer required. This spec replaces
the retired `BRAND-TEMPLATE.md`.

---

## 0 · How to load this in any AI engine

- **ChatGPT** — Create a Custom GPT and paste this entire document into the *Instructions*
  field; also upload it as a *Knowledge* file. Or put it in a Project's instructions. Or
  simply paste it at the top of a new chat.
- **Gemini** — Create a Gem and paste this into its instructions. Or add it to *Saved Info*.
  Or paste it at the start of a conversation.
- **Microsoft Copilot / others** — Paste it as the first message, or into the agent's
  instructions field.
- **Any API / system-prompt context** — Drop it into the system prompt.

Because most engines have weak or no persistent memory, re-supply this spec each session
unless the engine stores it as Knowledge / a Gem / a Custom GPT.

---

## 1 · Course identity

- Course: **BUS123 — Solving Business Problems with Technology**
- School: Gerrish School of Business, Endicott College
- Semester: Fall 2026
- Audience: undergraduate business majors, many with no prior Excel experience
- Class format: 75-minute periods (lecture + in-class workshop), no textbook

---

## 2 · Output format (non-negotiable)

Produce **one single, fully self-contained HTML file**.

- All CSS and JavaScript are written **inline** inside that one file.
- **No** external asset files, no `../../assets/` paths, no linked `.css` or `.js`.
- The only external resource permitted is the Google Fonts `<link>` in section 4.
- The file must work when opened directly in a browser with no server and no other files.
- Deliver it as a downloadable `.html` file, or as a single HTML code block the user can
  save as `bus123-[track]-m[nn]-l[nn]-slides.html`.

This format is the reason the deck is portable: nothing depends on the environment that
built it.

**One exception — content images.** Deck *content* images (photos, charts you saved as
images) may be referenced forward-only from an `img/` subfolder beside the deck
(`img/bus123-[track]-m[nn]-l[nn]-[descriptor].jpg`). Referenced images render on GitHub
Pages but appear blank in a standalone/preview context — that is expected. If an image must
render everywhere, optimize it (≤1280px wide, compressed JPEG/WebP) and base64-embed it
instead. The scaffold (CSS/JS) is **never** referenced — only content images.

---

## 3 · Color palette (v2 Hybrid — locked)

Use exactly these tokens. Never introduce other hex values outside the `:root` block.

```css
:root{
  --ink:#0E1116;      /* dark slide backgrounds, body text in formula panels */
  --paper:#FAF8F3;    /* content slide background (warm cream) */
  --paper-2:#F2EEE5;  /* recessed surfaces */
  --white:#FFFFFF;    /* cards */
  --text:#1A1F2C;     /* body text on light */
  --text-soft:#4A5567;/* secondary text */
  --muted:#7A8290;    /* captions, slide numbers */
  --border:#E5E1D6;   /* card borders */
  --sage:#4A7C5E;     /* BUS123 accent · Section 1 tab · active state */
  --gold:#B8843D;     /* formula highlights · Section 2 tab */
  --terra:#9C4A2B;    /* warnings/mistakes · Section 3 tab */
  --steel:#355773;    /* navy accent, Excel syntax in formula panels */
  --formula-bg:#EAF3EC;/* light sage formula panel background */
  --gradient:linear-gradient(90deg,var(--gold),var(--terra),var(--sage));
}
```

Gradient bar appears on the title slide and section-break slides only — never on every
content slide.

**Banned palette:** the old "Terracotta Scholar" set (Ink Navy #0C1A2E, Storm Blue,
Aged Gold #D4A052, Terracotta #BE6B4A, Sage #7AAB8C, Cool Linen). Do not use it.

---

## 4 · Fonts (locked)

Three fonts, one job each.

| Role | Font | Token |
|------|------|-------|
| Display, headings, big numbers, italic subtitles | **Bodoni Moda** | `--serif` |
| Body, UI, bullets, captions | **DM Sans** | `--sans` |
| Formulas, Excel syntax, code, eyebrows | **JetBrains Mono** | `--mono` |

Load all three with one tag:

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,700;0,6..96,900;1,6..96,400;1,6..96,700&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
```

Token definitions (add to `:root`):

```css
--serif:"Bodoni Moda",serif;
--sans:"DM Sans",sans-serif;
--mono:"JetBrains Mono",monospace;
```

**Banned fonts:** Cinzel, Cormorant Garamond, DM Mono, Instrument Serif, Geist, Inter,
Roboto, Arial, or any system-font stack.

---

## 5 · Layout — Notebook Tabs

- A two-part shell: a vertical **tab strip** on the left (`--ink` background, ~84px wide)
  and a **paper "sheet"** on a dark stage to the right.
- Each tab is a clickable section jumper. Tabs are colored by section:
  Section 1 = `--sage`, Section 2 = `--gold`, Section 3 = `--terra`.
  The active tab turns `--paper` with a small colored dot.
- Slides carry a `data-section` attribute: `0` = pre-content, `1`/`2`/`3` = the three
  content parts, `4` = wrap-up. The tab strip highlights based on it.
- A small gradient "home dot" at the top of the strip jumps to slide 1.

### Authoring size and scaling (LOCKED)

- Author every slide at **1280 × 720**.
- Scale to the viewport with a lean inline script — no web-component framework, no React,
  no Babel, no Shadow DOM, no Tweaks panel:

```js
var W=1280, H=720, deck=document.querySelector('.deck-shell');
function fit(){
  var s=Math.min(window.innerWidth/W, window.innerHeight/H);
  deck.style.transform='scale('+s+')';
}
window.addEventListener('resize',fit); fit();
```

- If the deck centers within a larger viewport, offset in **pixels**, never
  `translate(-50%,-50%)` (which resolves against the element's own 1280px width and jams it
  upper-left):
  `transform = 'translate('+((innerWidth-W*s)/2)+'px,'+((innerHeight-H*s)/2)+'px) scale('+s+')'`
- Navigation: keyboard arrows + on-screen buttons + clickable tabs. Press **N** to toggle
  speaker notes.
- Do **not** use `clamp()` or viewport-based font scaling — type is fixed px (section 5a),
  the transform handles all scaling.

### 5a · Type scale — fixed px, authored at 1280×720

| Token | Size | Use |
|-------|------|-----|
| `--type-display` | 72px | title slide only |
| `--type-title` | 46px | content slide titles |
| `--type-subtitle` | 30px | subtitles |
| `--type-lead` | 24px | lead paragraph |
| `--type-body` | 20px | body — minimum reading size |
| `--type-small` | 16px | captions, labels — hard floor, never smaller |
| `--type-eyebrow` | 15px | section eyebrows (mono, letter-spaced) |
| `--type-stat` | 140px | big-number slides |

(Sizes are scaled to the 1280×720 canvas — roughly two-thirds of the old 1920×1080 values.
The transform enlarges them to fill any larger screen.)

---

## 6 · Slide sequence (22 slides)

| # | Type | Background | Section |
|---|------|-----------|---------|
| 1 | Title (module code, lesson title, course name) | dark | — |
| 2 | Agenda — 3–4 numbered parts | paper | 0 |
| 3 | Learning Objectives — 3–4 "I Can" statements | paper | 0 |
| 4 | Recap / bridge from prior lesson (one image + one line) | paper | 0 |
| 5 | Section Break — Part 1 of 3 | dark | 1 |
| 6–8 | Part 1 content (one idea per slide, image-led) | paper | 1 |
| 9 | Section Break — Part 2 of 3 | dark | 2 |
| 10–13 | Part 2 content (includes 1 worked example) | paper | 2 |
| 14 | Section Break — Part 3 of 3 | dark | 3 |
| 15–17 | Part 3 content (includes 1 stat or quote slide) | paper | 3 |
| 18 | **Common Mistake** (terra background, bold, distinct) | dark/terra | 3 |
| 19 | Discussion — 2 large questions | paper | 4 |
| 20 | Key Takeaways — 3 numbered statements | paper | 4 |
| 21 | Up Next (image + one-line teaser) | paper | 4 |
| 22 | Close / Questions? + office hours | dark | — |

Composition: one idea per slide, three visual chunks maximum, large readable type,
no font below the 16px floor at authored size, at least one large element per slide.

---

## 7 · Content rules

- **Excel syntax first, manual math second — always.** When a calculation is taught, show
  the Excel function in a `.formula-panel` first (e.g. `=PMT(rate, nper, pv)`), then the
  manual derivation below it. Never reverse this. Students learn the function before the
  algebra.
- **Formula panel brand standard (LOCKED).** The retired dark formula panel treatment is
  no longer used. Every `.formula-panel` uses `background:var(--formula-bg)`, text
  `var(--ink)`, `border-left:4px solid var(--sage)`, JetBrains Mono, 18px, and 500 weight.
  The first Excel syntax line gets its own span or equivalent element with 22px type,
  700 weight, `color:var(--steel)`, `display:block`, and `margin-bottom:14px`.
- **Pre-reading PDFs use the same formula hierarchy.** In ReportLab PDFs, formula blocks
  use `#EAF3EC` background, a 3pt `#4A7C5E` left border, and 12pt padding. The Excel
  function line uses `Courier-Bold`, 11pt, `#355773`; manual math lines use `Courier`,
  9.5pt, `#0E1116`. In Formula Reference tables, the Excel syntax column uses `#EAF3EC`
  background, `Courier-Bold`, and `#355773` text. Do not use the retired ink background
  with gold text.
- **Visual variety.** Every 3–4 slides, use a distinct visual mode: decision flow diagram,
  comparison card, break-even chart, pricing ladder, mistake/correction board, sensitivity
  graphic, case-company visual, mini spreadsheet mockup, or student decision prompt. No
  repeated generic diagrams; no all-text slides.
- **Excel worksheet replicas** (when a slide shows a spreadsheet): headers `#1a1a2e`
  background with `--gold` text and `#c9a84c` border; data cells white with `#0a3d6b` text;
  alternating rows `#f7f8fa`; result row `#fffbf0` with a 3px `#c9a84c` left border and
  `#1a6b3c` text. Page surround stays on the Hybrid slide background, not all-dark.
- **Common Mistake slide** is required — at slide 18, terra-styled.
- **Speaker notes**: a JSON array in `<script type="application/json" id="speaker-notes">`,
  one conversational string per slide, in order. Count must equal slide count.
- **Do not** tell students which Excel function to use up front — let them infer it from
  context.

---

## 8 · Case study companies

Use exactly one of these four to anchor every example. Never use abstract names
(Company A, Store B, Person X).

| Company | Focus |
|---------|-------|
| Tidal Goods Co. | Retail, inventory, COGS, markup/markdown |
| Meridian Advisory Group | Payroll, time value of money, interest, tax, loan math |
| Anchor & Oak Events | Breakeven, seasonal cash flow, labor costs |
| Harborside Medical Center | Data analysis, payer mix %, payroll complexity |

**Retired — never use:** Dune Road Apparel, Harbor View Surf Shop, Endicott Management
Group (EMG).

---

## 9 · File naming

`bus123-[track]-m[nn]-l[nn]-slides.html`

- track ∈ { intro, excel, math }; module and lesson are zero-padded two digits.
- Example: `bus123-excel-m01-l01-slides.html`
- Deck content images: `img/bus123-[track]-m[nn]-l[nn]-[descriptor].jpg` beside the deck.
- Never use day-numbered names or business-name-only names. Never use "Biz Tech" in any
  file name or formal document.

---

## 10 · Pre-emit checklist (the model self-verifies before delivering)

- [ ] One self-contained HTML file; all CSS/JS inline; no external asset paths.
- [ ] Only the Google Fonts `<link>` is external (content images via `img/` are allowed).
- [ ] `:root` palette matches section 3 exactly; no stray hex outside `:root`.
- [ ] Bodoni Moda + DM Sans + JetBrains Mono only; no banned fonts.
- [ ] Gradient bar on title + section-break slides only.
- [ ] Vertical tab strip present; tabs colored sage/gold/terra by section.
- [ ] `data-section` on every slide.
- [ ] Authored at 1280×720; lean inline scaler; no clamp(); no Shadow DOM.
- [ ] 22-slide sequence; Common Mistake slide present at 18, terra-styled.
- [ ] Every calculation shows Excel syntax (mono panel) before manual math.
- [ ] Examples use one of the four current companies; no retired or abstract names.
- [ ] Speaker-notes JSON array length equals slide count.
- [ ] No React, Babel, Shadow DOM, Tweaks panel, or web-component framework.

---

## 11 · Session starter prompt (paste after this spec)

> Build a BUS123 slide deck following the spec above.
> Module/lesson: `[e.g. MATH-M07-L01]`
> Topic / title: `[full title for the title slide]`
> Anchor company: `[one of the four]`
> Special notes: `[hooks, carry-overs, custom slides — or "none"]`
> Deliver one self-contained HTML file and run the pre-emit checklist before finishing.
