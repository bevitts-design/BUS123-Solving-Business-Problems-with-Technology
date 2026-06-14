#!/usr/bin/env python3
"""Audit BUS123 HTML slide decks against the current BUS123 build spec.

The script reads slide decks only; it does not modify them. It writes a CSV
summary for tracking retrofit work.
"""

from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from typing import Iterable


ROOT = Path(__file__).resolve().parents[1]
DECK_GLOBS = ("INTRO/M*/bus123-*-slides.html", "EXCEL/M*/bus123-*-slides.html", "MATH/M*/bus123-*-slides.html")
OUT_CSV = ROOT / "audits" / "bus123-html-slide-consistency-audit.csv"

CURRENT_COMPANIES = (
    "Tidal Goods Co.",
    "Meridian Advisory Group",
    "Anchor & Oak Events",
    "Harborside Medical Center",
)
RETIRED_OR_ABSTRACT_NAMES = (
    "Dune Road Apparel",
    "Harbor View Surf Shop",
    "Endicott Management Group",
    "Company A",
    "Company B",
    "Store A",
    "Store B",
    "Person X",
)
BANNED_FONTS = (
    "Cinzel",
    "Cormorant Garamond",
    "DM Mono",
    "Instrument Serif",
    "Geist",
    "Inter",
    "Roboto",
    "Arial",
)
REQUIRED_TOKENS = (
    "--ink",
    "--paper",
    "--paper-2",
    "--white",
    "--text",
    "--text-soft",
    "--muted",
    "--border",
    "--sage",
    "--gold",
    "--terra",
    "--steel",
    "--formula-bg",
    "--gradient",
)
OLD_PALETTE_HEX = ("#0C1A2E", "#D4A052", "#BE6B4A", "#7AAB8C")

SLIDE_COUNT_EXCEPTIONS = {
    "INTRO/M01/bus123-intro-m01-l01-slides.html": 40,
    "MATH/M08/bus123-math-m08-l01-slides.html": 24,
}

COMMON_MISTAKE_SLIDE_EXCEPTIONS = {
    "INTRO/M01/bus123-intro-m01-l01-slides.html": "20",
}

MULTI_COMPANY_EXCEPTIONS = {
    "INTRO/M01/bus123-intro-m01-l01-slides.html": "Approved 40-slide course orientation deck introducing the current BUS123 case-study companies.",
    "INTRO/M01/bus123-intro-m01-l02-slides.html": "Intentional introduction of all four current BUS123 case-study companies.",
    "MATH/M07/bus123-math-m07-l01-slides.html": "Intentional sales/excise/property tax comparison across current companies.",
}

ACCEPTED_AS_IS = {
    "EXCEL/M03/bus123-excel-m03-l01-slides.html": "Accepted as-is by Bethany; keep out of retrofit queue despite 44-slide lesson design.",
}


class DeckParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.slide_count = 0
        self.slide_tags: list[str] = []
        self.data_section_count = 0
        self.script_srcs: list[str] = []
        self.link_hrefs: list[str] = []
        self.img_srcs: list[str] = []
        self.external_nonfont_links: list[str] = []
        self.speaker_notes_text: list[str] = []
        self._in_notes = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = {k.lower(): v or "" for k, v in attrs}
        class_attr = attrs_dict.get("class", "")
        classes = set(class_attr.split())

        if "slide" in classes:
            self.slide_count += 1
            self.slide_tags.append(tag)
            if "data-section" in attrs_dict:
                self.data_section_count += 1

        if tag == "script":
            if attrs_dict.get("src"):
                self.script_srcs.append(attrs_dict["src"])
            if attrs_dict.get("id") == "speaker-notes":
                self._in_notes = True
        elif tag == "link" and attrs_dict.get("href"):
            href = attrs_dict["href"]
            self.link_hrefs.append(href)
            if "fonts.googleapis.com" not in href and attrs_dict.get("rel", "").lower() == "stylesheet":
                self.external_nonfont_links.append(href)
        elif tag == "img" and attrs_dict.get("src"):
            self.img_srcs.append(attrs_dict["src"])

    def handle_endtag(self, tag: str) -> None:
        if tag == "script" and self._in_notes:
            self._in_notes = False

    def handle_data(self, data: str) -> None:
        if self._in_notes:
            self.speaker_notes_text.append(data)


def find_decks() -> list[Path]:
    files: list[Path] = []
    for pattern in DECK_GLOBS:
        files.extend(ROOT.glob(pattern))
    return sorted(files)


def root_block(text: str) -> str:
    match = re.search(r":root\s*\{(?P<body>.*?)\}", text, flags=re.S)
    return match.group("body") if match else ""


def section_at_position(text: str, pos: int) -> str:
    start = text.rfind("<section", 0, pos)
    if start == -1:
        start = text.rfind("<article", 0, pos)
    end = text.find("</section>", start)
    if end == -1:
        end = text.find("</article>", start)
    return text[start:end] if start != -1 and end != -1 else ""


def count_cream_dark_panels(text: str) -> int:
    count = 0
    for match in re.finditer(r'class=["\'][^"\']*\bdark-panel\b[^"\']*["\']', text):
        section = section_at_position(text, match.start())
        if re.search(r'class=["\'][^"\']*\bslide\b[^"\']*\bcream\b', section):
            count += 1
    return count


def parse_notes_count(parser: DeckParser) -> int | str:
    raw = "".join(parser.speaker_notes_text).strip()
    if not raw:
        return ""
    try:
        notes = json.loads(raw)
    except json.JSONDecodeError:
        return "invalid"
    if isinstance(notes, list):
        return len(notes)
    return "invalid"


def relative_asset_issues(path: Path, parser: DeckParser) -> list[str]:
    issues: list[str] = []
    for src in parser.img_srcs:
        if src.startswith(("http://", "https://", "data:", "#")):
            continue
        if src.startswith("../../assets/"):
            issues.append(f"shared asset path: {src}")
        candidate = (path.parent / src).resolve()
        if not candidate.exists():
            issues.append(f"missing image: {src}")
    return issues


def severity_for(critical: int, major: int, minor: int) -> str:
    if critical:
        return "Critical"
    if major >= 4:
        return "High"
    if major:
        return "Medium"
    if minor:
        return "Low"
    return "None"


def priority_band(severity: str, issues: list[str]) -> str:
    if severity == "Critical":
        return "Rebuild candidate"
    if any(issue.startswith("external scaffold") for issue in issues):
        return "Rebuild candidate"
    if severity in {"High", "Medium"}:
        return "Retrofit"
    if severity == "Low":
        return "Minor cleanup"
    return "Ready"


def action_for(priority: str, issues: list[str]) -> str:
    if priority == "Accepted as-is":
        return "No retrofit; keep as approved exception."
    if priority == "Ready":
        return "No immediate action beyond visual QA."
    if priority == "Minor cleanup":
        return "Patch small spec drift, then browser-check."
    if priority == "Retrofit":
        return "Retrofit to BUS123 build spec before reuse."
    if any(issue.startswith("external scaffold") for issue in issues):
        return "Rebuild or fully inline scaffold before classroom use."
    return "Consider rebuilding from current BUS123 spec."


@dataclass
class AuditRow:
    data: dict[str, str]


def audit_deck(path: Path) -> AuditRow:
    text = path.read_text(encoding="utf-8", errors="ignore")
    parser = DeckParser()
    parser.feed(text)

    rel = path.relative_to(ROOT)
    notes_count = parse_notes_count(parser)
    root_css = root_block(text)
    body_text = re.sub(r"<style.*?</style>", "", text, flags=re.S | re.I)
    decoded_text = unescape(text)

    external_scaffold = [
        src
        for src in parser.script_srcs
        if not src.startswith(("https://fonts.", "data:"))
    ]
    external_cdn_scripts = [src for src in parser.script_srcs if src.startswith(("http://", "https://"))]
    asset_issues = relative_asset_issues(path, parser)
    font_context = "\n".join(re.findall(r"(?:font-family\s*:[^;}]+|fonts\.googleapis\.com[^\"']+|--font-[^:]+:[^;}]+|--serif:[^;}]+|--sans:[^;}]+|--mono:[^;}]+)", text, flags=re.I))
    detected_fonts = [font for font in ("Bodoni Moda", "DM Sans", "JetBrains Mono", *BANNED_FONTS) if font in font_context]
    banned_fonts = [font for font in BANNED_FONTS if font in font_context]
    companies = [name for name in CURRENT_COMPANIES if name in decoded_text]
    retired_names = [name for name in RETIRED_OR_ABSTRACT_NAMES if name in decoded_text]
    missing_tokens = [token for token in REQUIRED_TOKENS if token not in root_css]
    old_palette = [hex_value for hex_value in OLD_PALETTE_HEX if hex_value.lower() in text.lower()]

    has_1280 = bool(re.search(r"\b1280\b", text) and re.search(r"\b720\b", text))
    has_1920_deck_stage = bool(re.search(r"<deck-stage[^>]+width=[\"']1920[\"'][^>]+height=[\"']1080[\"']", text))
    has_notebook = "tab-strip" in text or "deck-shell" in text or "data-section" in text
    has_formula_spec = "formula-panel" in text and "--formula-bg" in text
    cream_dark_panels = count_cream_dark_panels(text)
    has_common_mistake = bool(re.search(r"Common\s+Mistake|common\s+mistake", text))
    common_mistake_18 = bool(re.search(r'data-slide=["\']18["\'][^>]*>.*?Common\s+Mistake|Common\s+Mistake.*?data-slide=["\']18["\']', text, flags=re.S | re.I))

    issues: list[str] = []
    critical = major = minor = 0

    if external_scaffold:
        issues.append("external scaffold/script imports")
        critical += 1
    if external_cdn_scripts:
        issues.append("external CDN scripts")
        critical += 1
    if parser.external_nonfont_links:
        issues.append("external stylesheet outside Google Fonts")
        major += 1
    if not has_1280 or has_1920_deck_stage:
        issues.append("not current 1280x720 authored scaffold")
        major += 1
    if not has_notebook:
        issues.append("missing notebook/tab scaffold markers")
        major += 1
    expected_slides = SLIDE_COUNT_EXCEPTIONS.get(str(rel), 22)
    if parser.slide_count != expected_slides:
        issues.append(f"slide count {parser.slide_count}, expected {expected_slides}")
        major += 1
    if parser.data_section_count < parser.slide_count:
        issues.append(f"data-section coverage {parser.data_section_count}/{parser.slide_count}")
        major += 1
    if not has_common_mistake:
        issues.append("missing Common Mistake slide")
        major += 1
    expected_common_mistake_slide = COMMON_MISTAKE_SLIDE_EXCEPTIONS.get(str(rel), "18")
    if has_common_mistake and expected_common_mistake_slide != "18":
        slide_pattern = re.escape(expected_common_mistake_slide)
        common_mistake_expected = bool(
            re.search(
                rf"data-slide=[\"']{slide_pattern}[\"'][^>]*>.*?Common\s+Mistake|"
                rf"Common\s+Mistake.*?data-slide=[\"']{slide_pattern}[\"']",
                text,
                flags=re.S | re.I,
            )
        )
    else:
        common_mistake_expected = common_mistake_18
    if has_common_mistake and not common_mistake_expected:
        issues.append(f"Common Mistake not verifiably slide {expected_common_mistake_slide}")
        minor += 1
    if not parser.speaker_notes_text:
        issues.append("missing speaker notes JSON")
        major += 1
    elif notes_count != parser.slide_count:
        issues.append(f"speaker notes count {notes_count}, slide count {parser.slide_count}")
        major += 1
    if banned_fonts:
        issues.append("banned fonts: " + ", ".join(banned_fonts))
        major += 1
    if missing_tokens:
        issues.append("missing palette tokens: " + ", ".join(missing_tokens))
        major += 1
    if old_palette:
        issues.append("old palette hexes present: " + ", ".join(old_palette))
        major += 1
    if "clamp(" in text:
        issues.append("uses clamp()")
        major += 1
    if "attachShadow" in text or "::slotted" in text:
        issues.append("uses Shadow DOM marker")
        major += 1
    if any(marker in text for marker in ("text/babel", "ReactDOM", "TweaksPanel", "tweaks-root")):
        issues.append("React/Babel/Tweaks marker")
        critical += 1
    if not companies:
        issues.append("no current case-study company detected")
        minor += 1
    elif len(companies) > 1 and str(rel) not in MULTI_COMPANY_EXCEPTIONS:
        issues.append("multiple current companies detected")
        minor += 1
    if retired_names:
        issues.append("retired/abstract names: " + ", ".join(retired_names))
        major += 1
    if "dark-panel" in body_text and not has_formula_spec:
        issues.append("legacy dark-panel formula treatment")
        major += 1
    elif cream_dark_panels:
        issues.append(f"dark-panel on cream slides: {cream_dark_panels}")
        major += 1
    if asset_issues:
        issues.append("; ".join(asset_issues[:3]))
        major += 1

    severity = severity_for(critical, major, minor)
    priority = priority_band(severity, issues)
    rel_key = str(rel)
    accepted_note = ACCEPTED_AS_IS.get(rel_key)
    if accepted_note:
        severity = "None"
        priority = "Accepted as-is"
        issues = [accepted_note]

    return AuditRow(
        {
            "file": str(rel),
            "slides": str(parser.slide_count),
            "speaker_notes": str(notes_count),
            "data_sections": f"{parser.data_section_count}/{parser.slide_count}",
            "scaffold": "1280 notebook" if has_1280 and has_notebook and not has_1920_deck_stage else "legacy/mixed",
            "self_contained": "no" if external_scaffold or external_cdn_scripts or parser.external_nonfont_links else "yes",
            "fonts_detected": "; ".join(dict.fromkeys(detected_fonts)),
            "case_companies": "; ".join(companies),
            "formula_panel": "current" if has_formula_spec and not cream_dark_panels else ("legacy/mixed" if "dark-panel" in body_text else "not detected"),
            "severity": severity,
            "priority_band": priority,
            "recommended_action": action_for(priority, issues),
            "issues": " | ".join(issues) if issues else "None detected by static audit",
        }
    )


def write_csv(rows: Iterable[AuditRow]) -> None:
    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    rows = list(rows)
    with OUT_CSV.open("w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=list(rows[0].data.keys()), lineterminator="\n")
        writer.writeheader()
        for row in rows:
            writer.writerow(row.data)


def main() -> int:
    decks = find_decks()
    if not decks:
        raise SystemExit("No BUS123 slide decks found.")
    rows = [audit_deck(path) for path in decks]
    write_csv(rows)
    print(f"Wrote {OUT_CSV.relative_to(ROOT)} with {len(rows)} decks.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
