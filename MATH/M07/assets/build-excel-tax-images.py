#!/usr/bin/env python3
"""Generate Excel teaching visuals for BUS123 MATH-M07-L01."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path(__file__).resolve().parent
W, H = 1800, 760
GREEN, DARK_GREEN, NAVY, TEXT = "#217346", "#185C37", "#102033", "#17212B"
WHITE, PALE, LINE = "#FFFFFF", "#EAF4EE", "#B7C0C9"
YELLOW, GOLD, BLUE, RED = "#FFF1B8", "#D19A00", "#2E75B6", "#A13B2B"


def font(size, bold=False):
    path = (
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
        if bold
        else "/System/Library/Fonts/Supplemental/Arial.ttf"
    )
    return ImageFont.truetype(path, size) if Path(path).exists() else ImageFont.load_default()


def base(title):
    image = Image.new("RGB", (W, H), WHITE)
    draw = ImageDraw.Draw(image)
    draw.rectangle((0, 0, W, 68), fill=GREEN)
    draw.text((32, 16), title, font=font(30, True), fill=WHITE)
    return image, draw


def formula_bar(draw, x, y, formula, selected="B6"):
    draw.rectangle((x, y, x + 1080, y + 70), fill="#F3F5F7", outline=LINE, width=2)
    draw.rectangle((x, y, x + 120, y + 70), fill=WHITE, outline=LINE, width=2)
    draw.text((x + 60, y + 35), selected, anchor="mm", font=font(22, True), fill=TEXT)
    draw.text((x + 150, y + 20), "fx", font=font(25, True), fill=GREEN)
    draw.text((x + 210, y + 20), formula, font=font(23), fill=TEXT)


def worksheet(draw, x, y, rows, formula=None, selected=None):
    formula_bar(draw, x, y, formula or "Select a formula cell to inspect it", selected or "B6")
    y += 88
    widths = [82, 470, 420]
    for column, label in enumerate(["", "A", "B"]):
        left = x + sum(widths[:column])
        right = left + widths[column]
        draw.rectangle((left, y, right, y + 50), fill="#E7EAED", outline=LINE, width=2)
        draw.text(((left + right) // 2, y + 25), label, anchor="mm", font=font(20, True), fill=NAVY)
    for row_number, (label, value, kind) in enumerate(rows, 1):
        top = y + row_number * 58
        draw.rectangle((x, top, x + 82, top + 58), fill="#E7EAED", outline=LINE, width=2)
        draw.text((x + 41, top + 29), str(row_number), anchor="mm", font=font(18), fill=TEXT)
        draw.rectangle((x + 82, top, x + 552, top + 58), fill=WHITE, outline=LINE, width=2)
        draw.text((x + 102, top + 16), label, font=font(19, kind == "output"), fill=TEXT)
        fill = YELLOW if kind == "input" else PALE
        outline = GREEN if kind == "output" else LINE
        width = 3 if kind == "output" else 2
        draw.rectangle((x + 552, top, x + 972, top + 58), fill=fill, outline=outline, width=width)
        draw.text((x + 572, top + 16), value, font=font(19, kind == "output"), fill=TEXT)


# 1. Ribbon and number-format visual.
image, draw = base("Format tax models from the Home tab")
draw.rectangle((0, 68, W, 122), fill="#F4F6F7")
tabs = [("File", 120), ("Home", 150), ("Insert", 150), ("Page Layout", 220), ("Formulas", 180), ("Data", 130)]
x = 35
for tab, width in tabs:
    active = tab == "Home"
    if active:
        draw.rectangle((x, 72, x + width, 120), fill=PALE)
        draw.rectangle((x, 116, x + width, 120), fill=GREEN)
    draw.text((x + 20, 84), tab, font=font(22, active), fill=TEXT)
    x += width
draw.rounded_rectangle((90, 165, 1120, 610), radius=18, fill="#F7F8F9", outline=GREEN, width=4)
draw.text((605, 205), "Number group", anchor="ma", font=font(27, True), fill=NAVY)
controls = [
    ("$", "Accounting", "Dollar inputs\nand outputs"),
    ("%", "Percent Style", "Tax and\nassessment rates"),
    (".00", "Decimals", "Cents or four\nrate decimals"),
]
for index, (symbol, label, note) in enumerate(controls):
    cx = 165 + index * 325
    draw.rounded_rectangle((cx, 280, cx + 250, 390), radius=10, fill=WHITE, outline=GREEN, width=3)
    draw.text((cx + 125, 335), symbol, anchor="mm", font=font(40, True), fill=DARK_GREEN)
    draw.text((cx + 125, 430), label, anchor="ma", font=font(21, True), fill=TEXT)
    draw.multiline_text((cx + 125, 480), note, anchor="ma", align="center", spacing=7, font=font(18), fill=TEXT)
draw.rounded_rectangle((1190, 165, 1710, 610), radius=18, fill=YELLOW, outline=GOLD, width=4)
draw.text((1450, 215), "Before formatting", anchor="ma", font=font(25, True), fill=NAVY)
draw.multiline_text(
    (1450, 315),
    "Enter 6.25% or 0.0625\n\nDo not enter 6.25 and then\nclick Percent Style\n\nThat would display 625%",
    anchor="ma",
    align="center",
    spacing=10,
    font=font(22, True),
    fill=RED,
)
image.save(OUT / "math-m07-excel-number-formats.png", quality=95)


# 2. Sales-tax formula-chain worksheet.
image, draw = base("Build sales tax in the required order")
rows = [
    ("Retail Price", "$480.00", "input"),
    ("Trade Discount", "$80.00", "input"),
    ("Sales Tax Rate", "6.25%", "input"),
    ("Shipping", "$15.00", "input"),
    ("Taxable Subtotal", "=B1-B2", "output"),
    ("Sales Tax Owed", "=B5*B3", "output"),
    ("Total Price", "=B5+B6+B4", "output"),
]
worksheet(draw, 70, 95, rows, "=B5+B6+B4", "B7")
draw.rounded_rectangle((1120, 150, 1720, 615), radius=18, fill=PALE, outline=GREEN, width=4)
draw.text((1420, 200), "Order check", anchor="ma", font=font(27, True), fill=NAVY)
draw.multiline_text(
    (1420, 290),
    "1  Subtract discount\n\n2  Calculate tax\n\n3  Add shipping last\n\nExpected total: $440.00",
    anchor="ma",
    align="center",
    spacing=9,
    font=font(22, True),
    fill=TEXT,
)
image.save(OUT / "math-m07-sales-tax-model.png", quality=95)


# 3. Massachusetts motor vehicle excise calculation.
image, draw = base("Massachusetts motor vehicle excise: original list price to annual bill")
rows = [("Original List Price", "$32,000", "input"),("Second-Year Percentage", "60%", "input"),("Excise Value", "=B1*B2", "output"),("Dollars per $1,000", "$25", "input"),("Annual Excise", "=B3/1000*B4", "output"),("Monthly Budget Amount", "=B5/12", "output")]
worksheet(draw, 70, 95, rows, "=B3/1000*B4", "B5")
for y,title,value in [(185,"Original list price","$32,000"),(340,"Excise value at 60%","$19,200"),(495,"Annual excise bill","$480")]:
    draw.rounded_rectangle((1120,y,1710,y+100),radius=16,fill=PALE,outline=GREEN,width=3)
    draw.text((1415,y+20),title,anchor="ma",font=font(24,True),fill=NAVY)
    draw.text((1415,y+58),value,anchor="ma",font=font(28,True),fill=DARK_GREEN)
for y in [292,447]:draw.text((1415,y),"↓",anchor="ma",font=font(30,True),fill=GREEN)
image.save(OUT / "math-m07-vehicle-excise-model.png", quality=95)


# 4. Beverly FY2026 commercial property-tax model.
image, draw = base("Beverly property tax: dollars per $1,000 of assessed value")
rows = [("Beverly FY2026", "Commercial", "input"),("Assessed Value", "$820,000", "input"),("Dollars per $1,000", "$20.98", "input"),("Thousands of Value", "=B2/1000", "output"),("Annual Property Tax", "=B4*B3", "output"),("Monthly Budget Amount", "=B5/12", "output")]
worksheet(draw, 70, 95, rows, "=B4*B3", "B5")
draw.rounded_rectangle((1120,150,1720,615),radius=18,fill=PALE,outline=GREEN,width=4)
draw.multiline_text((1420,205),"FY2026 commercial rate\n$20.98 per $1,000\n\n$820,000 / 1,000 = 820\n820 x $20.98 = $17,203.60\n\nMonthly savings: $1,433.63",anchor="ma",align="center",spacing=14,font=font(24,True),fill=TEXT)
image.save(OUT / "math-m07-property-tax-round.png",quality=95)
