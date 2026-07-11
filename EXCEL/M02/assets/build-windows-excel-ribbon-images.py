#!/usr/bin/env python3
"""Generate focused Windows Excel ribbon teaching visuals for EXCEL-M02-L01."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
W, H = 1800, 500
NAVY = "#102033"
GREEN = "#217346"
PALE = "#EAF4EE"
LINE = "#B7C0C9"
TEXT = "#17212B"
WHITE = "#FFFFFF"
YELLOW = "#FFF1B8"


def font(size, bold=False):
    names = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
    ]
    for name in names:
        if Path(name).exists():
            return ImageFont.truetype(name, size)
    return ImageFont.load_default()


def base(title, active="Home"):
    im = Image.new("RGB", (W, H), WHITE)
    d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 62), fill=GREEN)
    d.text((32, 14), "Excel", font=font(30, True), fill=WHITE)
    tabs = ["File", "Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View"]
    x = 28
    for tab in tabs:
        width = d.textbbox((0, 0), tab, font=font(23))[2] + 38
        if tab == active:
            d.rectangle((x, 73, x + width, 116), fill=PALE)
            d.rectangle((x, 112, x + width, 116), fill=GREEN)
        d.text((x + 19, 82), tab, font=font(23, tab == active), fill=TEXT)
        x += width + 3
    d.line((0, 120, W, 120), fill=LINE, width=2)
    return im, d


def group(d, box, label, commands, highlight=None):
    x1, y1, x2, y2 = box
    d.rounded_rectangle(box, radius=8, outline=GREEN if highlight else LINE, width=5 if highlight else 2, fill="#FAFBFC")
    n = len(commands)
    cellw = (x2 - x1 - 24) / n
    for idx, (symbol, text) in enumerate(commands):
        cx = x1 + 12 + idx * cellw
        if highlight and text in highlight:
            d.rounded_rectangle((cx + 4, y1 + 18, cx + cellw - 4, y2 - 48), radius=7, fill=YELLOW, outline="#D19A00", width=2)
        d.text((cx + cellw / 2, y1 + 54), symbol, anchor="mm", font=font(32, True), fill=NAVY)
        d.multiline_text((cx + cellw / 2, y1 + 112), text, anchor="ma", align="center", spacing=3, font=font(17), fill=TEXT)
    d.rectangle((x1, y2 - 34, x2, y2), fill="#F0F2F4")
    d.text(((x1 + x2) / 2, y2 - 17), label, anchor="mm", font=font(17, True), fill="#4E5965")


im, d = base("Figure 1. Windows Excel: the Home tab contains the main worksheet-formatting groups")
group(d, (35, 140, 610, 425), "Font", [("B", "Bold"), ("BOX", "Borders"), ("FILL", "Fill Color"), ("A", "Font Color")], {"Bold", "Borders", "Fill Color"})
group(d, (630, 140, 1130, 425), "Alignment", [("LEFT", "Align Left"), ("MID", "Center"), ("WRAP", "Wrap Text")], {"Center", "Wrap Text"})
group(d, (1150, 140, 1765, 425), "Number", [("$", "Accounting"), ("%", "Percent"), (",", "Comma Style"), (".0", "Decimals")], {"Accounting", "Percent", "Decimals"})
im.save(OUT / "excel-windows-home-formatting-groups.png", quality=95)

im, d = base("Figure 2. Windows Excel: use the Number group to control meaning and displayed precision")
group(d, (250, 140, 1550, 425), "Number", [("General ▾", "Number Format\nmenu"), ("$", "Accounting\nNumber Format"), ("%", "Percent\nStyle"), (",", "Comma\nStyle"), (".00→.0", "Decrease\nDecimal"), (".0→.00", "Increase\nDecimal")], {"Number Format\nmenu", "Accounting\nNumber Format", "Percent\nStyle", "Decrease\nDecimal"})
im.save(OUT / "excel-windows-number-group.png", quality=95)

im, d = base("Figure 3. Windows Excel: the Font and Alignment groups create a readable hierarchy")
group(d, (80, 140, 860, 425), "Font", [("B", "Bold"), ("BOX", "Borders"), ("FILL", "Fill Color"), ("A", "Font Color")], {"Bold", "Borders", "Fill Color"})
group(d, (940, 140, 1720, 425), "Alignment", [("LEFT", "Left"), ("MID", "Center"), ("RIGHT", "Right"), ("WRAP", "Wrap Text")], {"Center", "Wrap Text"})
im.save(OUT / "excel-windows-font-alignment-groups.png", quality=95)

im, d = base("Figure 4. Windows Excel: Freeze Top Row is on the View tab", active="View")
group(d, (520, 140, 1280, 425), "Window", [("PANES", "Freeze\nPanes"), ("TOP", "Freeze\nTop Row"), ("FIRST", "Freeze First\nColumn")], {"Freeze\nPanes", "Freeze\nTop Row"})
im.save(OUT / "excel-windows-view-freeze-panes.png", quality=95)
