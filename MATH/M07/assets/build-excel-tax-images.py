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
    "Enter 6% or 0.06\n\nDo not enter 6 and then\nclick Percent Style\n\nThat would display 600%",
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
    ("Sales Tax Rate", "6%", "input"),
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
    "1  Subtract discount\n\n2  Calculate tax\n\n3  Add shipping last\n\nExpected total: $439.00",
    anchor="ma",
    align="center",
    spacing=9,
    font=font(22, True),
    fill=TEXT,
)
image.save(OUT / "math-m07-sales-tax-model.png", quality=95)


# 3. Formula-bar visual for keeping both taxes on the original base.
image, draw = base("Keep sales and excise taxes tied to the same base cost")
formula_bar(draw, 90, 125, "=B1*B3", "B5")
draw.rounded_rectangle((90, 245, 770, 590), radius=18, fill=PALE, outline=GREEN, width=4)
draw.text((430, 290), "Sales tax", anchor="ma", font=font(28, True), fill=NAVY)
draw.text((430, 375), "=B1*B2", anchor="mm", font=font(35, True), fill=DARK_GREEN)
draw.text((430, 460), "$6,200 × 7% = $434", anchor="ma", font=font(23), fill=TEXT)
draw.rounded_rectangle((820, 245, 1500, 590), radius=18, fill=PALE, outline=GREEN, width=4)
draw.text((1160, 290), "Excise tax", anchor="ma", font=font(28, True), fill=NAVY)
draw.text((1160, 375), "=B1*B3", anchor="mm", font=font(35, True), fill=DARK_GREEN)
draw.text((1160, 460), "$6,200 × 8% = $496", anchor="ma", font=font(23), fill=TEXT)
draw.rounded_rectangle((1540, 245, 1730, 590), radius=14, fill=YELLOW, outline=GOLD, width=4)
draw.multiline_text((1635, 315), "Both\nformulas\nstart with\nB1", anchor="ma", align="center", spacing=8, font=font(24, True), fill=RED)
image.save(OUT / "math-m07-same-base-formulas.png", quality=95)


# 4. Property-tax ROUND model.
image, draw = base("Round the property-tax rate before calculating tax due")
rows = [
    ("Market Value", "$820,000", "input"),
    ("Assessment Rate", "40%", "input"),
    ("Town Budget", "$310,000", "input"),
    ("Total Assessed Value", "$4,750,000", "input"),
    ("Assessed Value", "=B1*B2", "output"),
    ("Rounded Tax Rate", "=ROUND(B3/B4,4)", "output"),
    ("Annual Tax Due", "=B5*B6", "output"),
]
worksheet(draw, 70, 95, rows, "=ROUND(B3/B4,4)", "B6")
draw.rounded_rectangle((1120, 150, 1720, 615), radius=18, fill=YELLOW, outline=GOLD, width=4)
draw.text((1420, 200), "Use the rounded rate", anchor="ma", font=font(27, True), fill=NAVY)
draw.multiline_text(
    (1420, 300),
    "B6 stores 0.0653\n\nB7 uses =B5*B6\n\nExpected annual tax:\n$21,418.40\n\nOptional monthly reserve:\n=B7/12",
    anchor="ma",
    align="center",
    spacing=8,
    font=font(21, True),
    fill=TEXT,
)
image.save(OUT / "math-m07-property-tax-round.png", quality=95)
