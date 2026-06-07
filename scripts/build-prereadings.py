#!/usr/bin/env python3
"""Build BUS123 pre-reading PDFs from editable Markdown sources.

Usage:
  python3 scripts/build-prereadings.py --init-from-pdfs
  python3 scripts/build-prereadings.py --all
  python3 scripts/build-prereadings.py INTRO/M01/source/bus123-intro-m01-l02-prereading.md
"""

from __future__ import annotations

import argparse
import re
import textwrap
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable
from xml.sax.saxutils import escape

from pypdf import PdfReader
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parents[1]

COURSE = "BUS 123 - Solving Business Problems with Technology"
SCHOOL = "Gerrish School of Business - Endicott College"
TERM = "Fall 2026"

NAVY = colors.HexColor("#102033")
INK = colors.HexColor("#142033")
MUTED = colors.HexColor("#5B6470")
GOLD = colors.HexColor("#C68A2E")
GREEN = colors.HexColor("#4A7C5E")
TERRA = colors.HexColor("#9C4A2B")
PAPER = colors.HexColor("#FAF8F3")
LINE = colors.HexColor("#D9D3C7")

SOURCE_PATTERNS = ("*pre-reading.md", "*prereading.md", "*reading.md")
PDF_PATTERNS = ("*pre-reading.pdf", "*prereading.pdf", "*reading.pdf")


@dataclass
class SourceDoc:
    path: Path
    meta: dict[str, str]
    body: list[str]


def rel(path: Path) -> str:
    return path.resolve().relative_to(ROOT).as_posix()


def lesson_from_path(path: Path) -> str:
    match = re.search(r"bus123-([a-z]+)-m(\d{2})-l(\d{2})", path.name, re.I)
    if not match:
        return ""
    track, module, lesson = match.groups()
    return f"{track.upper()}-M{module}-L{lesson}"


def title_from_pdf(reader: PdfReader, path: Path) -> str:
    lines = clean_pdf_lines((reader.pages[0].extract_text() or "").splitlines(), path)
    for line in lines:
        if is_noise_line(line, path):
            continue
        if line.upper() in {"PRE-READING", "PRE-READING DOCUMENT", "PRE-READING GUIDE", "READING MATERIAL ONLY"}:
            continue
        if "PRE-READING" in line.upper() and len(line) < 70:
            continue
        if len(line) >= 8:
            return line.strip(" -")
    return path.stem.replace("bus123-", "").replace("-", " ").title()


def source_path_for_pdf(pdf_path: Path) -> Path:
    return pdf_path.parent / "source" / f"{pdf_path.stem}.md"


def output_path_for_source(source_path: Path, meta: dict[str, str]) -> Path:
    if meta.get("output"):
        output = Path(meta["output"])
        return output if output.is_absolute() else ROOT / output
    return source_path.parent.parent / f"{source_path.stem}.pdf"


def clean_pdf_lines(lines: Iterable[str], path: Path) -> list[str]:
    cleaned: list[str] = []
    lesson = lesson_from_path(path)
    for raw in lines:
        line = " ".join(raw.strip().split())
        if not line:
            cleaned.append("")
            continue
        if is_noise_line(line, path, lesson):
            continue
        cleaned.append(line)
    return collapse_blank_lines(cleaned)


def is_noise_line(line: str, path: Path, lesson: str | None = None) -> bool:
    upper = line.upper()
    if not line:
        return False
    if upper.startswith("BUS 123") and ("GERRISH" in upper or "ENDICOTT" in upper):
        return True
    if upper.startswith("BUS123") and ("GERRISH" in upper or "ENDICOTT" in upper):
        return True
    if upper.startswith("BUS 123") and "SOLVING BUSINESS PROBLEMS" in upper:
        return True
    if upper.startswith("BUS123") and ("PRE-READING" in upper or "MATH" in upper or "EXCEL" in upper):
        return True
    if upper.startswith("GERRISH SCHOOL OF BUSINESS"):
        return True
    if upper.startswith("COURSE: BUS123"):
        return True
    if upper.startswith("TRACK: "):
        return True
    if upper.startswith("EST. READ:"):
        return True
    if upper.startswith("MODULE ") and "UNDERSTANDING" in upper:
        return True
    if re.fullmatch(r"PAGE \d+", upper):
        return True
    if re.fullmatch(r"PAGE \d+\s*\|.*", upper):
        return True
    if re.search(r"PAGE \d+$", upper) and ("ENDICOTT" in upper or "GERRISH" in upper):
        return True
    if upper in {
        "PRE-READING",
        "PRE-READING DOCUMENT",
        "PRE-READING GUIDE",
        "READING MATERIAL ONLY",
        "PRE-READING - READING MATERIAL ONLY",
        "PRE-READING · READING MATERIAL ONLY",
        "MATERIAL ONLY",
        "FOR STUDENT USE ONLY",
    }:
        return True
    if lesson and upper == lesson:
        return True
    if upper == path.stem.replace("-", " ").upper():
        return True
    return False


def collapse_blank_lines(lines: list[str]) -> list[str]:
    output: list[str] = []
    blank = False
    for line in lines:
        if not line:
            if not blank:
                output.append("")
            blank = True
            continue
        output.append(line)
        blank = False
    while output and not output[0]:
        output.pop(0)
    while output and not output[-1]:
        output.pop()
    return output


def heading_level(line: str) -> int | None:
    upper = line.upper().strip()
    if re.fullmatch(r"SECTION \d+", upper):
        return None
    if re.fullmatch(r"\d+\s*[·.]\s+.+", line):
        return 2
    if re.fullmatch(r"(PART|SECTION)\s+[A-Z0-9]+[ :·-].+", upper):
        return 2
    if upper.startswith(("CONNECT TO", "CONNECTING TO", "CONCEPT EXPLANATION", "KEY VOCABULARY", "WHY ", "HOW ")):
        return 2
    if upper.startswith(("PART ", "STEP ", "CHECKPOINT", "COMMON MISTAKE", "STRATEGY", "EXCEL TRANSLATION")):
        return 3
    return None


def markdown_from_pdf(pdf_path: Path, overwrite: bool = False) -> Path:
    source_path = source_path_for_pdf(pdf_path)
    if source_path.exists() and not overwrite:
        return source_path

    reader = PdfReader(str(pdf_path))
    title = title_from_pdf(reader, pdf_path)
    lesson = lesson_from_path(pdf_path)
    body: list[str] = []
    seen_title = False

    for page_index, page in enumerate(reader.pages, start=1):
        lines = clean_pdf_lines((page.extract_text() or "").splitlines(), pdf_path)
        paragraph: list[str] = []

        def flush_paragraph() -> None:
            nonlocal paragraph
            if paragraph:
                body.append(" ".join(paragraph))
                body.append("")
                paragraph = []

        if page_index > 1:
            flush_paragraph()
            body.append("<!-- page break -->")
            body.append("")

        for line in lines:
            if not line:
                flush_paragraph()
                continue
            if re.fullmatch(r"SECTION \d+", line.upper()):
                flush_paragraph()
                continue
            if not seen_title and line == title:
                seen_title = True
                continue
            if line.upper() in {"PRE-READING", "PRE-READING DOCUMENT", "PRE-READING GUIDE", "READING MATERIAL ONLY", "MATERIAL ONLY"}:
                continue
            level = heading_level(line)
            if level:
                flush_paragraph()
                body.append(f"{'#' * level} {line}")
                body.append("")
                continue
            paragraph.append(line)

        flush_paragraph()

    body = collapse_blank_lines(body)
    frontmatter = [
        "---",
        f'title: "{title}"',
        f'lesson: "{lesson}"',
        'kind: "Pre-Reading"',
        'status: "draft-from-pdf"',
        f'output: "{rel(pdf_path)}"',
        "---",
        "",
        f"# {title}",
        "",
    ]

    source_path.parent.mkdir(parents=True, exist_ok=True)
    source_path.write_text("\n".join(frontmatter + body) + "\n", encoding="utf-8")
    return source_path


def parse_source(path: Path) -> SourceDoc:
    text = path.read_text(encoding="utf-8")
    meta: dict[str, str] = {}
    body_text = text
    if text.startswith("---\n"):
        end = text.find("\n---", 4)
        if end != -1:
            frontmatter = text[4:end].strip().splitlines()
            body_text = text[end + 4 :].lstrip()
            for line in frontmatter:
                if ":" not in line:
                    continue
                key, value = line.split(":", 1)
                meta[key.strip()] = value.strip().strip('"').strip("'")
    return SourceDoc(path=path, meta=meta, body=body_text.splitlines())


def styles() -> dict[str, ParagraphStyle]:
    base = getSampleStyleSheet()
    return {
        "title": ParagraphStyle(
            "BUS123Title",
            parent=base["Title"],
            fontName="Helvetica",
            fontSize=19,
            leading=23,
            textColor=INK,
            alignment=TA_LEFT,
            spaceAfter=12,
        ),
        "h2": ParagraphStyle(
            "BUS123H2",
            parent=base["Heading2"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=13,
            textColor=GOLD,
            uppercase=True,
            spaceBefore=13,
            spaceAfter=6,
            borderWidth=0.5,
            borderColor=GOLD,
            borderPadding=(5, 0, 0),
        ),
        "h3": ParagraphStyle(
            "BUS123H3",
            parent=base["Heading3"],
            fontName="Helvetica-Bold",
            fontSize=10.5,
            leading=13,
            textColor=INK,
            spaceBefore=9,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "BUS123Body",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10.5,
            leading=15,
            textColor=colors.HexColor("#1D2530"),
            spaceAfter=7,
        ),
        "small": ParagraphStyle(
            "BUS123Small",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=8,
            leading=10,
            textColor=MUTED,
        ),
        "list": ParagraphStyle(
            "BUS123List",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10.3,
            leading=14,
            textColor=colors.HexColor("#1D2530"),
        ),
        "callout": ParagraphStyle(
            "BUS123Callout",
            parent=base["BodyText"],
            fontName="Helvetica",
            fontSize=10,
            leading=14,
            textColor=colors.HexColor("#173F31"),
            backColor=colors.HexColor("#EEF6F0"),
            borderColor=GREEN,
            borderWidth=0.6,
            borderPadding=8,
            spaceBefore=8,
            spaceAfter=8,
        ),
    }


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    code_spans: list[str] = []

    def stash_code(match: re.Match[str]) -> str:
        code_spans.append(match.group(1))
        return f"@@CODE{len(code_spans) - 1}@@"

    protected = re.sub(r"`([^`]+)`", stash_code, text)
    safe = escape(protected)
    safe = re.sub(r"\*\*([^*]+)\*\*", r"<b>\1</b>", safe)
    safe = re.sub(r"\*([^*]+)\*", r"<i>\1</i>", safe)
    for index, code in enumerate(code_spans):
        safe = safe.replace(f"@@CODE{index}@@", f'<font name="Courier">{escape(code)}</font>')
    return Paragraph(safe, style)


def parse_table(lines: list[str], style: ParagraphStyle) -> Table:
    header_style = ParagraphStyle(
        "BUS123TableHeader",
        parent=style,
        fontName="Helvetica-Bold",
        textColor=colors.white,
    )
    rows = []
    for row_index, line in enumerate(lines):
        cells = [cell.strip() for cell in line.strip().strip("|").split("|")]
        cell_style = header_style if row_index == 0 else style
        rows.append([paragraph(cell, cell_style) for cell in cells])
    col_count = max(len(row) for row in rows)
    for row in rows:
        while len(row) < col_count:
            row.append(paragraph("", style))
    table = Table(rows, hAlign="LEFT", repeatRows=1)
    table.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("GRID", (0, 0), (-1, -1), 0.35, LINE),
        ("BACKGROUND", (0, 1), (-1, -1), colors.HexColor("#F7F7F4")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
    ]))
    return table


def build_story(doc: SourceDoc) -> list:
    st = styles()
    story: list = []
    lines = doc.body
    i = 0
    skip_first_h1 = False
    title = doc.meta.get("title", "")
    if lines and lines[0].startswith("# ") and lines[0][2:].strip() == title:
        skip_first_h1 = True

    while i < len(lines):
        line = lines[i].rstrip()
        stripped = line.strip()
        if not stripped:
            i += 1
            continue
        if stripped == "<!-- page break -->":
            story.append(PageBreak())
            i += 1
            continue
        if stripped.startswith("<!--"):
            i += 1
            while i < len(lines) and "-->" not in lines[i]:
                i += 1
            if i < len(lines):
                i += 1
            continue
        if stripped == "---":
            story.append(Spacer(1, 8))
            i += 1
            continue
        if stripped.startswith("|") and "|" in stripped[1:]:
            table_lines = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                if not re.fullmatch(r"\s*\|?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*", lines[i]):
                    table_lines.append(lines[i])
                i += 1
            if table_lines:
                story.append(parse_table(table_lines, st["body"]))
                story.append(Spacer(1, 8))
            continue
        if stripped.startswith(">"):
            callout_lines = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                quote_line = lines[i].strip()[1:].strip()
                if quote_line:
                    callout_lines.append(quote_line)
                i += 1
            label = "Note"
            if callout_lines and callout_lines[0].startswith("[!"):
                label = callout_lines.pop(0).replace("[!", "").replace("]", "").strip().title() or label
            elif callout_lines and len(callout_lines[0]) <= 80:
                label = re.sub(r"^[^\w]+", "", callout_lines.pop(0)).replace("**", "").strip() or label
            body = "<br/>".join(escape(re.sub(r"^[-*]\s+", "- ", item).replace("**", "")) for item in callout_lines)
            text = f"<b>{escape(label)}</b>{('<br/>' + body) if body else ''}"
            story.append(Paragraph(text, st["callout"]))
            continue
        if stripped.startswith("# "):
            if skip_first_h1:
                skip_first_h1 = False
            else:
                story.append(paragraph(stripped[2:].strip(), st["title"]))
            i += 1
            continue
        if stripped.startswith("## "):
            story.append(paragraph(stripped[3:].strip().upper(), st["h2"]))
            i += 1
            continue
        if stripped.startswith("### "):
            story.append(paragraph(stripped[4:].strip(), st["h3"]))
            i += 1
            continue
        if re.match(r"^[-*]\s+", stripped):
            items = []
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i].strip()):
                items.append(ListItem(paragraph(re.sub(r"^[-*]\s+", "", lines[i].strip()), st["list"])))
                i += 1
            story.append(ListFlowable(items, bulletType="bullet", leftIndent=18))
            story.append(Spacer(1, 4))
            continue
        if re.match(r"^\d+[.)]\s+", stripped):
            items = []
            while i < len(lines):
                if not lines[i].strip():
                    i += 1
                    continue
                if not re.match(r"^\d+[.)]\s+", lines[i].strip()):
                    break
                items.append(ListItem(paragraph(re.sub(r"^\d+[.)]\s+", "", lines[i].strip()), st["list"])))
                i += 1
            story.append(ListFlowable(items, bulletType="1", leftIndent=18))
            story.append(Spacer(1, 4))
            continue

        paragraph_lines = [stripped]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if not nxt or nxt.startswith(("#", "|", ">", "<!--")) or re.match(r"^[-*]\s+", nxt) or re.match(r"^\d+[.)]\s+", nxt):
                break
            paragraph_lines.append(nxt)
            i += 1
        story.append(paragraph(" ".join(paragraph_lines), st["body"]))

    return story


def draw_page(canvas, doc, source: SourceDoc) -> None:
    width, height = letter
    title = source.meta.get("title", "Pre-Reading")
    lesson = source.meta.get("lesson", lesson_from_path(source.path))
    canvas.saveState()
    canvas.setFillColor(NAVY)
    canvas.rect(0.65 * inch, height - 1.25 * inch, width - 1.3 * inch, 0.72 * inch, fill=1, stroke=0)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica", 16)
    canvas.drawCentredString(width / 2, height - 0.78 * inch, COURSE)
    canvas.setFillColor(GOLD)
    canvas.rect(0.65 * inch, height - 1.28 * inch, width - 1.3 * inch, 0.04 * inch, fill=1, stroke=0)
    canvas.setFont("Helvetica", 8.5)
    canvas.drawString(0.78 * inch, height - 1.55 * inch, lesson)
    canvas.drawCentredString(width / 2, height - 1.55 * inch, textwrap.shorten(title, width=58, placeholder="..."))
    canvas.setFillColor(TERRA)
    canvas.drawRightString(width - 0.78 * inch, height - 1.55 * inch, "PRE-READING")
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 7.5)
    footer = f"{COURSE} - {lesson} - {title}"
    canvas.drawString(0.65 * inch, 0.45 * inch, textwrap.shorten(footer, width=80, placeholder="..."))
    canvas.drawRightString(width - 0.65 * inch, 0.45 * inch, f"{SCHOOL} - Page {doc.page}")
    canvas.restoreState()


def build_pdf(source_path: Path) -> Path:
    source = parse_source(source_path)
    output = output_path_for_source(source_path, source.meta)
    output.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(
        str(output),
        pagesize=letter,
        rightMargin=0.65 * inch,
        leftMargin=0.65 * inch,
        topMargin=1.85 * inch,
        bottomMargin=0.72 * inch,
        title=source.meta.get("title", "BUS123 Pre-Reading"),
        author="BUS123",
    )
    story = build_story(source)
    doc.build(story, onFirstPage=lambda c, d: draw_page(c, d, source), onLaterPages=lambda c, d: draw_page(c, d, source))
    return output


def all_sources() -> list[Path]:
    paths: set[Path] = set()
    for pattern in SOURCE_PATTERNS:
        paths.update(ROOT.glob(f"**/source/{pattern}"))
    return sorted(path for path in paths if ".git" not in path.parts)


def all_pdfs() -> list[Path]:
    paths: set[Path] = set()
    for pattern in PDF_PATTERNS:
        paths.update(ROOT.glob(f"**/{pattern}"))
    return sorted(path for path in paths if ".git" not in path.parts and "tmp" not in path.parts and "output" not in path.parts)


def main() -> int:
    parser = argparse.ArgumentParser(description="Build BUS123 pre-reading PDFs from Markdown.")
    parser.add_argument("sources", nargs="*", help="Markdown source files to build.")
    parser.add_argument("--all", action="store_true", help="Build every pre-reading Markdown source.")
    parser.add_argument("--init-from-pdfs", action="store_true", help="Create missing Markdown sources from existing PDFs.")
    parser.add_argument("--force-init", action="store_true", help="Overwrite Markdown sources while bootstrapping from PDFs.")
    parser.add_argument("--include-drafts", action="store_true", help="Allow --all to build sources marked status: draft-from-pdf.")
    args = parser.parse_args()

    if args.init_from_pdfs:
        created = []
        for pdf in all_pdfs():
            source = markdown_from_pdf(pdf, overwrite=args.force_init)
            created.append(source)
        for source in created:
            print(f"source {rel(source)}")

    targets: list[Path] = []
    explicit_targets = [(ROOT / source).resolve() if not Path(source).is_absolute() else Path(source) for source in args.sources]
    if args.all:
        for source in all_sources():
            parsed = parse_source(source)
            if parsed.meta.get("status") == "draft-from-pdf" and not args.include_drafts:
                print(f"skip draft {rel(source)}")
                continue
            targets.append(source)
    targets.extend(explicit_targets)

    seen: set[Path] = set()
    for target in targets:
        target = target.resolve()
        if target in seen:
            continue
        seen.add(target)
        output = build_pdf(target)
        print(f"built {rel(output)} from {rel(target)}")

    if not args.init_from_pdfs and not args.all and not targets:
        parser.error("provide --all, --init-from-pdfs, or one or more Markdown source files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
