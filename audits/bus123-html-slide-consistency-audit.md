# BUS123 HTML Slide Consistency Audit

Audit date: 2026-06-14  
Repository: `/Users/bethanyevittsair2/Documents/GitHub/BUS123-Solving-Business-Problems-with-Technology`  
Audit target: current BUS123 `bus123-branded-slides` build spec, especially the portable 1280 x 720 notebook-tabs scaffold, Bodoni Moda / DM Sans / JetBrains Mono typography, 22-slide sequence, and light sage `.formula-panel` standard.

## Executive Summary

The BUS123 slide deck set is complete enough to audit, but it is not yet visually or technically consistent with the current BUS123 build spec.

- 18 lecture slide decks were audited.
- 1 deck is fully `Ready` by the current spec.
- 2 decks are `Minor cleanup` candidates.
- 15 decks need a `Retrofit`.
- 0 decks are `Rebuild candidate`.

The most common remaining drift is scaffold generation: many decks are self-contained and classroom-usable, but not on the current BUS123 standard. Several use the older 1920 x 1080 `deck-stage` pattern, banned `Instrument Serif` / `Geist` fonts from the generic slide builder lineage, or older hand-rolled shells. A smaller set uses current-ish 1280 x 720 notebook-tabs markup but still needs sequence, palette-token, formula-panel, or case-company cleanup.

Post-rebuild note: `INTRO/M01/bus123-intro-m01-l02-slides.html` and `MATH/M04/bus123-math-m04-l01-slides.html` have been rebuilt and replaced in place. Original copies are saved beside them as `.original.html` files.

## Scope

Included deck pattern:

- `INTRO/M*/bus123-*-slides.html`
- `EXCEL/M*/bus123-*-slides.html`
- `MATH/M*/bus123-*-slides.html`

Excluded from this deck audit:

- Interactives, shared tools, company profile pages, activity templates, `index.html`, and `tmp/` HTML files.
- These files may deserve a separate consistency pass, but they are not lecture slide decks and should not be scored against the 22-slide lecture scaffold.

Machine-readable matrix:

- `audits/bus123-html-slide-consistency-audit.csv`

Helper script:

- `scripts/audit_bus123_html_slides.py`

## Priority Bands

| Band | Count | Meaning |
|---|---:|---|
| Ready | 1 | No static audit issues detected; still needs normal visual QA before reuse. |
| Minor cleanup | 2 | Close to current spec; patch one or two items before reuse. |
| Retrofit | 15 | Usable content, but needs conversion to current BUS123 spec before being treated as standard. |
| Rebuild candidate | 0 | Rebuild or substantially reconstruct because scaffold/dependencies conflict with portability requirements. |

## Highest-Risk Findings

1. The original critical rebuild candidates have been addressed. `MATH/M04/L01` now audits as `Ready`; `INTRO/M01/L02` audits as `Minor cleanup` only because it intentionally introduces all four case-study companies.

2. The 1920 x 1080 `deck-stage` generation appears in `MATH/M01`, `MATH/M02`, `MATH/M06`, `MATH/M07`, and parts of `MATH/M03`. Those decks are often self-contained and render, but they follow the generic slide-builder lineage rather than the current BUS123 spec.

3. Several decks are content-complete but structurally oversized or condensed: `INTRO/M01/L01` has 40 slides, `EXCEL/M03` has 44 slides, `MATH/M08` has 24, `MATH/M03` has 23, `MATH/M09/L01` has 20, and `MATH/M09/L02` has 18. These should be reconciled with the current 22-slide sequence during retrofit.

4. Formula treatment is inconsistent. The current standard is light sage `.formula-panel`; older dark formula panels remain in the math decks that came from the 1920 x 1080 generation, especially `MATH/M06` and `MATH/M07`. Some decks have formulas but lack the complete current token set (`--formula-bg`, `--steel`, or `--gradient`).

5. Typography is split across generations. Current BUS123 decks should use Bodoni Moda, DM Sans, and JetBrains Mono. Older/generic decks still include Instrument Serif, Geist, Inter, and/or old fallback stacks.

## Deck Status Table

| Deck | Band | Main reason |
|---|---|---|
| `MATH/M04/bus123-math-m04-l01-slides.html` | Ready | Rebuilt to current 22-slide self-contained notebook scaffold with speaker notes and local image asset. |
| `EXCEL/M02/bus123-excel-m02-l01-slides.html` | Minor cleanup | Close to current spec; needs explicit current case-study anchor review. |
| `INTRO/M01/bus123-intro-m01-l02-slides.html` | Minor cleanup | Rebuilt to current scaffold; static audit flags multiple current companies because the lesson intentionally introduces all four. |
| `EXCEL/M01/bus123-excel-m01-l01-slides.html` | Retrofit | Mostly current notebook scaffold, but missing full current token set and formula-panel standard markers. |
| `EXCEL/M03/bus123-excel-m03-l01-slides.html` | Retrofit | Strong content and current formula panels, but 44 slides and no clean 22-slide sequence. |
| `EXCEL/M04/bus123-excel-m04-l01-slides.html` | Retrofit | Current-ish scaffold, but missing Common Mistake detection and older palette/token drift. |
| `INTRO/M01/bus123-intro-m01-l01-slides.html` | Retrofit | Self-contained notebook shell, but 40 slides and combined L01-L02 scope need normalization. |
| `MATH/M01/bus123-math-m01-l01-slides.html` | Retrofit | 1920 x 1080 generic deck-stage, banned fonts, no `data-section`, notes count mismatch. |
| `MATH/M02/bus123-math-m02-l01-slides.html` | Retrofit | Same 1920 x 1080/generic scaffold family, banned fonts, no `data-section`, notes count mismatch. |
| `MATH/M03/bus123-math-m03-l01-slides.html` | Retrofit | Mixed hybrid: 1280 x 720 deck-stage, 23 slides, no notebook tabs, banned fallback font. |
| `MATH/M05/bus123-math-m05-l01-slides.html` | Retrofit | Current-ish self-contained 22-slide deck, but Inter/fallback drift and incomplete formula token set. |
| `MATH/M06/bus123-math-m06-l01-slides.html` | Retrofit | 1920 x 1080 generic scaffold, banned fonts, notes count mismatch, legacy dark-panel formula treatment. |
| `MATH/M07/bus123-math-m07-l01-slides.html` | Retrofit | 1920 x 1080 generic scaffold, banned fonts, notes count mismatch, legacy dark-panel formula treatment. |
| `MATH/M08/bus123-math-m08-l01-slides.html` | Retrofit | 24 slides, older scaffold markers, banned fallback font, incomplete formula token set. |
| `MATH/M09/bus123-math-m09-l01-slides.html` | Retrofit | 20 slides, older scaffold markers, banned fallback font, incomplete formula token set. |
| `MATH/M09/bus123-math-m09-l02-slides.html` | Retrofit | 18 slides, notes count mismatch, older scaffold markers, banned fallback font. |
| `MATH/M11/bus123-math-m11-l01-slides.html` | Retrofit | Current-ish 22-slide shell but incomplete current formula/gradient token set. |
| `MATH/M12/bus123-math-m12-l01-slides.html` | Retrofit | Current-ish 22-slide shell but Inter/fallback drift and incomplete token set. |

## Browser Spot Checks

Representative decks were opened from `file://` in Google Chrome via the bundled Node/Playwright package. The original audit screenshots and results are in `output/playwright/slide-audit-spotcheck/`; the post-rebuild checks are in `output/playwright/critical-rebuild-check/`.

| Deck | Result |
|---|---|
| `EXCEL/M02/bus123-excel-m02-l01-slides.html` | Rendered, one visible slide, keyboard navigation worked, notes toggled, no console/page errors. |
| `MATH/M01/bus123-math-m01-l01-slides.html` | Rendered, one visible slide, keyboard navigation worked, notes toggled, no console/page errors. Confirms it is usable but not current spec. |
| `EXCEL/M01/bus123-excel-m01-l01-slides.html` | Rendered, one visible slide, keyboard navigation worked, notes toggled, no console/page errors. |
| `INTRO/M01/bus123-intro-m01-l02-slides.html` | Post-rebuild: rendered, one visible slide, keyboard navigation worked, notes toggled, all four local badge images loaded, no console/page errors. |
| `MATH/M04/bus123-math-m04-l01-slides.html` | Post-rebuild: rendered, one visible slide, keyboard navigation worked, notes toggled, local Anchor & Oak image loaded, no console/page errors. |

`npx` was not available, so the standard Playwright CLI wrapper could not run. The spot check used the bundled Node runtime with the installed Playwright package and system Google Chrome.

## Recommended Retrofit Order

1. Retrofit the 1920 x 1080 generic deck-stage math decks: `MATH/M01`, `MATH/M02`, `MATH/M06`, and `MATH/M07`. These are visually and technically from a different generation.
2. Normalize overlong or underlength decks: `INTRO/M01/L01`, `EXCEL/M03`, `MATH/M08`, `MATH/M09/L01`, and `MATH/M09/L02`.
3. Patch current-ish 1280 x 720 decks with token/font/formula drift: `EXCEL/M01`, `EXCEL/M04`, `MATH/M05`, `MATH/M11`, and `MATH/M12`.
4. Finish with `EXCEL/M02` and `INTRO/M01/L02`, which mainly need content-anchor review rather than scaffold repair.

## Notes For Future Work

- Treat the CSV as a tracking matrix, not a perfect visual judgment. It is intentionally conservative where slide numbering, Common Mistake position, and formula ordering cannot be confirmed safely by static parsing alone.
- When retrofitting an existing deck, preserve slide count only if the goal is a narrow CSS/formula cleanup. If the goal is full BUS123 spec compliance, normalize toward the 22-slide sequence.
- Do not use the generic `bus-slide-builder` v2 rules as the target for BUS123. The BUS123 build spec supersedes it for this repo.
