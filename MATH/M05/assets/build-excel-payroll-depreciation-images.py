#!/usr/bin/env python3
"""Generate Excel teaching visuals for BUS123 MATH-M05-L01."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
W, H = 1800, 760
GREEN, NAVY, TEXT = "#217346", "#102033", "#17212B"
WHITE, PALE, LINE, YELLOW, BLUE, ORANGE = "#FFFFFF", "#EAF4EE", "#B7C0C9", "#FFF1B8", "#2E75B6", "#D48324"

def font(size, bold=False):
    path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(path, size) if Path(path).exists() else ImageFont.load_default()

def base(title):
    im = Image.new("RGB", (W, H), WHITE); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 68), fill=GREEN)
    d.text((32, 16), title, font=font(30, True), fill=WHITE)
    return im, d

def worksheet(d, x, y, headers, rows, formula):
    widths = [430] + [230]*(len(headers)-1)
    total = sum(widths)
    d.rectangle((x, y, x+total, y+64), fill="#F3F5F7", outline=LINE, width=2)
    d.text((x+22, y+18), "fx", font=font(24, True), fill=GREEN)
    d.text((x+80, y+18), formula, font=font(21), fill=TEXT)
    y += 82
    left = x
    for i, head in enumerate(headers):
        d.rectangle((left, y, left+widths[i], y+60), fill=NAVY, outline=WHITE, width=2)
        d.text((left+14, y+18), head, font=font(19, True), fill=WHITE)
        left += widths[i]
    for r, row in enumerate(rows):
        top = y + 60 + r*62; left = x
        for c, value in enumerate(row):
            output = c == len(row)-1
            d.rectangle((left, top, left+widths[c], top+62), fill=PALE if output else YELLOW, outline=GREEN if output else LINE, width=3 if output else 2)
            d.text((left+14, top+18), value, font=font(18, output), fill=TEXT)
            left += widths[c]

im, d = base("Payroll and depreciation move on different timelines")
for x, title, timing, items, color in [
    (90, "PAYROLL", "Every pay period", ["Hours and staffing", "Current-period cash", "Overtime can change quickly"], BLUE),
    (930, "DEPRECIATION", "Across useful life", ["Long-lived equipment", "Accounting allocation", "Book value changes gradually"], ORANGE),
]:
    d.rounded_rectangle((x, 140, x+760, 625), radius=20, fill=PALE, outline=color, width=5)
    d.text((x+380, 195), title, anchor="ma", font=font(32, True), fill=NAVY)
    d.rounded_rectangle((x+170, 265, x+590, 345), radius=12, fill=YELLOW, outline=color, width=3)
    d.text((x+380, 305), timing, anchor="mm", font=font(24, True), fill=TEXT)
    for i, item in enumerate(items): d.text((x+115, 410+i*62), f"•  {item}", font=font(22), fill=TEXT)
im.save(OUT / "math-m05-two-cost-rhythms.png", quality=95)

im, d = base("Use MIN and MAX to separate regular and overtime pay")
headers = ["Employee", "Hours", "Rate", "OT Mult.", "Gross Pay"]
rows = [["Harborside Nurse", "43", "$44", "1.5", "=$1,958"]]
worksheet(d, 70, 120, headers, rows, "=MIN(B2,40)*C2 + MAX(B2-40,0)*C2*D2")
d.rounded_rectangle((70, 390, 840, 655), radius=16, fill=PALE, outline=GREEN, width=4)
d.text((455, 430), "Regular pay", anchor="ma", font=font(24, True), fill=NAVY)
d.text((455, 495), "=MIN(Hours,40)*Rate", anchor="ma", font=font(22), fill=TEXT)
d.text((455, 565), "MIN caps regular hours at 40", anchor="ma", font=font(20), fill=GREEN)
d.rounded_rectangle((960, 390, 1730, 655), radius=16, fill=YELLOW, outline=ORANGE, width=4)
d.text((1345, 430), "Overtime pay", anchor="ma", font=font(24, True), fill=NAVY)
d.text((1345, 495), "=MAX(Hours-40,0)*Rate*1.5", anchor="ma", font=font(22), fill=TEXT)
d.text((1345, 565), "MAX prevents negative overtime", anchor="ma", font=font(20), fill=ORANGE)
im.save(OUT / "math-m05-overtime-model.png", quality=95)

im, d = base("Pay frequency changes check size, not annual salary")
headers = ["Pay Cycle", "Annual Salary", "Periods", "Pay per Period"]
rows = [
    ["Weekly", "$52,000", "52", "=$1,000.00"], ["Biweekly", "$52,000", "26", "=$2,000.00"],
    ["Semimonthly", "$52,000", "24", "=$2,166.67"], ["Monthly", "$52,000", "12", "=$4,333.33"],
]
worksheet(d, 120, 115, headers, rows, "=AnnualSalary/PayPeriods")
d.rounded_rectangle((1290, 185, 1750, 570), radius=16, fill=YELLOW, outline=ORANGE, width=4)
d.text((1520, 230), "Do not interchange", anchor="ma", font=font(25, True), fill=NAVY)
d.text((1520, 330), "Biweekly = 26", anchor="ma", font=font(25, True), fill=TEXT)
d.text((1520, 405), "Semimonthly = 24", anchor="ma", font=font(25, True), fill=TEXT)
d.text((1520, 500), "Both total $52,000", anchor="ma", font=font(20), fill=GREEN)
im.save(OUT / "math-m05-pay-cycle-model.png", quality=95)

im, d = base("Build Year 3 depreciation as a three-formula sequence")
headers = ["Input or Output", "Value", "Excel Formula"]
rows = [
    ["Asset Cost", "$84,000", "input"], ["Residual Value", "$12,000", "input"],
    ["Useful Life", "6 years", "input"], ["Year", "3", "input"],
    ["Annual Depreciation", "$12,000", "=(B1-B2)/B3"],
    ["Accumulated Depreciation", "$36,000", "=B5*B4"], ["Book Value", "$48,000", "=B1-B6"],
]
worksheet(d, 65, 95, headers, rows, "=AssetCost-AccumulatedDepreciation")
d.rounded_rectangle((1210, 155, 1730, 590), radius=16, fill=PALE, outline=GREEN, width=4)
d.text((1470, 205), "Ending check", anchor="ma", font=font(25, True), fill=NAVY)
d.multiline_text((1470, 300), "After Year 6:\n\nBook value = $12,000\n\nResidual value, not $0", anchor="ma", align="center", spacing=10, font=font(23, True), fill=TEXT)
im.save(OUT / "math-m05-depreciation-model.png", quality=95)

im, d = base("Straight-line book value falls evenly to residual value")
x0, y0, x1, y1 = 180, 145, 1540, 625
d.line((x0, y1, x1, y1), fill=NAVY, width=4); d.line((x0, y0, x0, y1), fill=NAVY, width=4)
values = [84000, 72000, 60000, 48000, 36000, 24000, 12000]
pts = []
for year, value in enumerate(values):
    x = x0 + year*(x1-x0)/6; y = y1 - (value/84000)*(y1-y0)
    pts.append((x,y)); d.ellipse((x-10,y-10,x+10,y+10), fill=GREEN)
    d.text((x, y1+28), str(year), anchor="ma", font=font(18), fill=TEXT)
    d.text((x, y-42), f"${value//1000}K", anchor="ma", font=font(18, True), fill=TEXT)
d.line(pts, fill=GREEN, width=6)
d.text((860, 700), "Year", anchor="ma", font=font(22, True), fill=NAVY)
d.rounded_rectangle((1580, 235, 1750, 520), radius=14, fill=YELLOW, outline=ORANGE, width=3)
d.multiline_text((1665, 290), "$12K\nper year\n\nEnds at\nresidual\nvalue", anchor="ma", align="center", font=font(20, True), fill=TEXT)
im.save(OUT / "math-m05-book-value-timeline.png", quality=95)
