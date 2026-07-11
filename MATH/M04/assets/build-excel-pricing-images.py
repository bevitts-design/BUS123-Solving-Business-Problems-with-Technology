#!/usr/bin/env python3
"""Generate Excel teaching visuals for BUS123 MATH-M04-L01."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
W, H = 1800, 760
GREEN, NAVY, TEXT = "#217346", "#102033", "#17212B"
WHITE, PALE, LINE, YELLOW, BLUE = "#FFFFFF", "#EAF4EE", "#B7C0C9", "#FFF1B8", "#2E75B6"

def font(size, bold=False):
    path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(path, size) if Path(path).exists() else ImageFont.load_default()

def base(title):
    im = Image.new("RGB", (W, H), WHITE); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 68), fill=GREEN)
    d.text((32, 16), title, font=font(30, True), fill=WHITE)
    return im, d

def sheet(d, x, y, rows, formula=None):
    d.rectangle((x, y, x+980, y+70), fill="#F3F5F7", outline=LINE, width=2)
    d.text((x+25, y+20), "fx", font=font(25, True), fill=GREEN)
    d.text((x+85, y+20), formula or "Select a cell to inspect its formula", font=font(23), fill=TEXT)
    y += 90
    widths = [90, 470, 420]
    for c, label in enumerate(["", "A", "B"]):
        left = x + sum(widths[:c]); right = left + widths[c]
        d.rectangle((left, y, right, y+55), fill="#E7EAED", outline=LINE, width=2)
        d.text(((left+right)//2, y+27), label, anchor="mm", font=font(21, True), fill=NAVY)
    for r, (label, value, kind) in enumerate(rows, 1):
        top = y+r*62
        d.rectangle((x, top, x+90, top+62), fill="#E7EAED", outline=LINE, width=2)
        d.text((x+45, top+31), str(r), anchor="mm", font=font(19), fill=TEXT)
        d.rectangle((x+90, top, x+560, top+62), fill=WHITE, outline=LINE, width=2)
        d.text((x+110, top+18), label, font=font(20, kind == "output"), fill=TEXT)
        fill = YELLOW if kind == "input" else PALE
        d.rectangle((x+560, top, x+980, top+62), fill=fill, outline=GREEN if kind == "output" else LINE, width=3 if kind == "output" else 2)
        d.text((x+580, top+18), value, font=font(20, kind == "output"), fill=TEXT)

im, d = base("Name the base before choosing the formula")
cards = [
    ("MARKUP", "Base: cost", "Cost × (1 + rate)"),
    ("MARKDOWN", "Base: original price", "Price × (1 − rate)"),
    ("WASTE", "Base: produced units", "Units × (1 − rate)"),
    ("BREAK-EVEN", "Base: contribution margin", "Fixed costs ÷ CM"),
]
for i, (name, base_text, formula) in enumerate(cards):
    x = 70 + i*430
    d.rounded_rectangle((x, 145, x+385, 610), radius=18, fill=PALE, outline=GREEN, width=4)
    d.text((x+192, 195), name, anchor="ma", font=font(26, True), fill=NAVY)
    d.rounded_rectangle((x+35, 285, x+350, 370), radius=10, fill=YELLOW, outline="#D19A00", width=2)
    d.text((x+192, 325), base_text, anchor="mm", font=font(21, True), fill=TEXT)
    d.multiline_text((x+192, 465), formula, anchor="ma", align="center", font=font(22), fill=TEXT)
im.save(OUT / "math-m04-identify-the-base.png", quality=95)

im, d = base("Build the markup-and-waste model from labeled inputs")
rows = [
    ("Produced Units", "120", "input"), ("Cost per Unit", "$18.00", "input"),
    ("Markup Rate", "45%", "input"), ("Waste Rate", "15%", "input"),
    ("Sellable Units", "=B1*(1-B4)", "output"), ("Target Revenue", "=B1*B2*(1+B3)", "output"),
    ("Required Price", "=B6/B5", "output"),
]
sheet(d, 90, 105, rows, "=B6/B5")
d.rounded_rectangle((1160, 165, 1710, 600), radius=18, fill=PALE, outline=GREEN, width=4)
d.text((1435, 215), "Modeling habit", anchor="ma", font=font(27, True), fill=NAVY)
d.multiline_text((1435, 300), "Yellow cells = inputs\n\nGreen cells = formulas\n\nKeep each assumption\nin its own cell", anchor="ma", align="center", spacing=10, font=font(22), fill=TEXT)
im.save(OUT / "math-m04-markup-waste-model.png", quality=95)

im, d = base("Enter percentage assumptions as percentages")
d.rectangle((0, 68, W, 122), fill="#F4F6F7")
tabs = ["File", "Home", "Insert", "Page Layout", "Formulas", "Data"]
x = 35
for tab in tabs:
    active = tab == "Home"; width = 170 if tab != "Page Layout" else 230
    if active: d.rectangle((x, 72, x+width, 120), fill=PALE); d.rectangle((x, 116, x+width, 120), fill=GREEN)
    d.text((x+20, 84), tab, font=font(22, active), fill=TEXT); x += width
d.rounded_rectangle((220, 175, 760, 470), radius=16, fill=YELLOW, outline="#D19A00", width=4)
d.text((490, 220), "Number group", anchor="ma", font=font(25, True), fill=NAVY)
d.rounded_rectangle((300, 300, 450, 405), radius=8, fill=WHITE, outline=GREEN, width=3)
d.text((375, 350), "%", anchor="mm", font=font(45, True), fill=GREEN)
d.text((525, 318), "Percent Style", font=font(23, True), fill=TEXT)
d.text((525, 365), "Home → Number → %", font=font(21), fill=TEXT)
d.rounded_rectangle((900, 175, 1660, 590), radius=16, fill=PALE, outline=GREEN, width=4)
d.text((1280, 220), "Correct input", anchor="ma", font=font(25, True), fill=NAVY)
d.text((1280, 305), "45%", anchor="mm", font=font(58, True), fill=GREEN)
d.text((1280, 385), "Excel stores this as 0.45", anchor="ma", font=font(23), fill=TEXT)
d.text((1280, 470), "Do not type 45 and then\napply Percent Style", anchor="ma", align="center", font=font(23, True), fill="#A13B2B")
im.save(OUT / "math-m04-percent-style.png", quality=95)

im, d = base("Use ROUNDUP because Anchor & Oak cannot sell part of a guest")
rows = [
    ("Fixed Costs", "$3,600", "input"), ("Ticket Price", "$48", "input"),
    ("Variable Cost per Guest", "$27", "input"), ("Contribution Margin", "=B2-B3", "output"),
    ("Break-Even Guests", "=ROUNDUP(B1/B4,0)", "output"),
]
sheet(d, 90, 115, rows, "=ROUNDUP(B1/(B2-B3),0)")
d.rounded_rectangle((1160, 170, 1710, 575), radius=18, fill=YELLOW, outline="#D19A00", width=4)
d.text((1435, 220), "Reasonableness check", anchor="ma", font=font(26, True), fill=NAVY)
d.multiline_text((1435, 310), "$48 − $27 = $21 CM\n\n$3,600 ÷ $21 = 171.43\n\nROUND UP → 172 guests", anchor="ma", align="center", spacing=12, font=font(22, True), fill=TEXT)
im.save(OUT / "math-m04-break-even-roundup.png", quality=95)
