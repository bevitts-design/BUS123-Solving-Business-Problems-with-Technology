#!/usr/bin/env python3
"""Generate Windows Excel function visuals for EXCEL-M03-L01."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
W, H = 1800, 560
GREEN, NAVY, TEXT = "#217346", "#102033", "#17212B"
WHITE, PALE, LINE, YELLOW = "#FFFFFF", "#EAF4EE", "#B7C0C9", "#FFF1B8"


def font(size, bold=False):
    path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(path, size) if Path(path).exists() else ImageFont.load_default()


def ribbon(active="Formulas"):
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


def button(d, box, symbol, label, hot=True):
    d.rounded_rectangle(box, radius=8, fill=YELLOW if hot else "#F7F8F9", outline="#D19A00" if hot else LINE, width=3)
    x1, y1, x2, y2 = box
    d.text(((x1+x2)/2, y1+54), symbol, anchor="mm", font=font(31, True), fill=NAVY)
    d.multiline_text(((x1+x2)/2, y1+116), label, anchor="ma", align="center", spacing=4, font=font(18), fill=TEXT)


im, d = ribbon()
button(d, (120, 155, 440, 440), "fx", "Insert Function")
button(d, (470, 155, 790, 440), "SUM", "AutoSum")
button(d, (820, 155, 1140, 440), "RECENT", "Recently Used", False)
button(d, (1170, 155, 1490, 440), "LOGIC", "Logical", False)
d.rectangle((90, 460, 1520, 505), fill="#F0F2F4")
d.text((805, 483), "Function Library", anchor="mm", font=font(20, True), fill="#4E5965")
im.save(OUT / "excel-windows-formulas-function-library.png", quality=95)

im, d = ribbon(active="Home")
d.text((45, 145), "Name Box", font=font(19, True), fill=NAVY)
d.rectangle((45, 175, 360, 245), outline=GREEN, width=5, fill=YELLOW)
d.text((70, 193), "Monthly_Revenue", font=font(25, True), fill=TEXT)
d.text((410, 145), "Formula Bar", font=font(19, True), fill=NAVY)
d.rectangle((410, 175, 1720, 245), outline=LINE, width=2, fill="#FBFCFD")
d.text((435, 193), "fx", font=font(25, True), fill=NAVY)
for x in [80, 280, 480, 680, 880, 1080]:
    d.line((x, 300, x, 520), fill=LINE, width=2)
for y in [300, 355, 410, 465, 520]:
    d.line((80, y, 1080, y), fill=LINE, width=2)
d.rectangle((880, 355, 1080, 520), fill=PALE, outline="#2E75B6", width=5)
d.text((900, 372), "$4,800", font=font(23), fill=TEXT)
d.text((900, 427), "$3,950", font=font(23), fill=TEXT)
d.text((900, 482), "$6,225", font=font(23), fill=TEXT)
d.text((1160, 350), "1. Select the range", font=font(24, True), fill=NAVY)
d.text((1160, 410), "2. Type the name", font=font(24, True), fill=NAVY)
d.text((1160, 470), "3. Press Enter", font=font(24, True), fill=NAVY)
im.save(OUT / "excel-windows-create-named-range.png", quality=95)

im, d = ribbon(active="Home")
d.text((45, 145), "Name Box", font=font(19, True), fill=NAVY)
d.rectangle((45, 175, 245, 235), outline=LINE, width=2)
d.text((65, 190), "E2", font=font(24), fill=TEXT)
d.text((280, 145), "Formula Bar", font=font(19, True), fill=NAVY)
d.rectangle((280, 175, 1720, 235), outline=GREEN, width=4, fill="#FBFCFD")
d.text((305, 188), "fx   =SORT(UNIQUE(B2:B13))", font=font(26), fill=TEXT)
d.rectangle((285, 270, 1140, 345), fill=PALE, outline=GREEN, width=2)
d.text((310, 287), "SORT(array, [sort_index], [sort_order], [by_col])", font=font(23), fill=TEXT)
d.text((45, 395), "Type the formula, use Excel's argument hint to check the order, then press Enter.", font=font(25, True), fill=NAVY)
im.save(OUT / "excel-windows-formula-bar-arguments.png", quality=95)

im = Image.new("RGB", (W, 720), WHITE)
d = ImageDraw.Draw(im)
d.rectangle((0, 0, W, 64), fill=GREEN)
d.text((30, 15), "Dynamic array result", font=font(30, True), fill=WHITE)
cols = [70, 350, 720, 1080]
for x in cols:
    d.line((x, 120, x, 665), fill=LINE, width=2)
for y in range(120, 666, 78):
    d.line((70, y, 1500, y), fill=LINE, width=2)
d.rectangle((720, 198, 1080, 588), outline="#2E75B6", width=6)
d.rectangle((720, 198, 1080, 276), fill=YELLOW, outline="#2E75B6", width=4)
d.text((740, 215), "=SORT(UNIQUE(B2:B13))", font=font(21, True), fill=TEXT)
for i, value in enumerate(["Events", "Finance", "Marketing", "Operations", "Sales"]):
    d.text((745, 294 + i*78), value, font=font(24), fill=TEXT)
d.text((1140, 225), "Formula cell", font=font(25, True), fill=NAVY)
d.line((1120, 238, 1060, 238), fill=NAVY, width=4)
d.text((1140, 390), "Spill results", font=font(25, True), fill=NAVY)
d.line((1120, 405, 1060, 405), fill=NAVY, width=4)
d.text((720, 680), "Reference the changing result as E2#", anchor="ms", font=font(26, True), fill=GREEN)
im.save(OUT / "excel-windows-dynamic-array-spill.png", quality=95)

im = Image.new("RGB", (W, 680), WHITE)
d = ImageDraw.Draw(im)
d.rectangle((0, 0, W, 64), fill=GREEN)
d.text((30, 15), "Resolve a blocked spill range", font=font(30, True), fill=WHITE)
for x in [100, 430, 760, 1090, 1420]:
    d.line((x, 120, x, 600), fill=LINE, width=2)
for y in range(120, 601, 80):
    d.line((100, y, 1420, y), fill=LINE, width=2)
d.rectangle((430, 200, 760, 280), fill="#FCE8E6", outline="#C00000", width=4)
d.text((450, 218), "#SPILL!", font=font(30, True), fill="#C00000")
d.rectangle((430, 200, 760, 520), outline="#2E75B6", width=5)
d.rectangle((430, 360, 760, 440), fill=YELLOW, outline="#D19A00", width=3)
d.text((450, 378), "Blocking value", font=font(25, True), fill=TEXT)
d.text((830, 205), "1. Select the #SPILL! cell.", font=font(25, True), fill=NAVY)
d.text((830, 280), "2. Find the dashed intended range.", font=font(25, True), fill=NAVY)
d.text((830, 355), "3. Move or clear the blocking value.", font=font(25, True), fill=NAVY)
d.text((830, 430), "4. Confirm that the results spill.", font=font(25, True), fill=NAVY)
im.save(OUT / "excel-windows-spill-error.png", quality=95)
