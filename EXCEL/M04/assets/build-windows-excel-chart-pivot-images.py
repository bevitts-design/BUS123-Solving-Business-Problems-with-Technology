#!/usr/bin/env python3
"""Generate Windows Excel chart and PivotTable teaching visuals for EXCEL-M04-L01."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
W, H = 1800, 590
GREEN, NAVY, TEXT = "#217346", "#102033", "#17212B"
WHITE, PALE, LINE, YELLOW, BLUE = "#FFFFFF", "#EAF4EE", "#B7C0C9", "#FFF1B8", "#2E75B6"

def font(size, bold=False):
    path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(path, size) if Path(path).exists() else ImageFont.load_default()

def ribbon(active="Insert", height=H):
    im = Image.new("RGB", (W, height), WHITE); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 62), fill=GREEN); d.text((32, 14), "Excel", font=font(30, True), fill=WHITE)
    tabs = ["File", "Home", "Insert", "Page Layout", "Formulas", "Data", "Review", "View"]
    x = 28
    for tab in tabs:
        width = d.textbbox((0, 0), tab, font=font(23))[2] + 38
        if tab == active:
            d.rectangle((x, 73, x + width, 116), fill=PALE); d.rectangle((x, 112, x + width, 116), fill=GREEN)
        d.text((x + 19, 82), tab, font=font(23, tab == active), fill=TEXT); x += width + 3
    d.line((0, 120, W, 120), fill=LINE, width=2)
    return im, d

def button(d, box, symbol, label, hot=True):
    d.rounded_rectangle(box, radius=8, fill=YELLOW if hot else "#F7F8F9", outline="#D19A00" if hot else LINE, width=3)
    x1, y1, x2, y2 = box
    d.text(((x1+x2)/2, y1+52), symbol, anchor="mm", font=font(30, True), fill=NAVY)
    d.multiline_text(((x1+x2)/2, y1+118), label, anchor="ma", align="center", spacing=4, font=font(18), fill=TEXT)

im, d = ribbon(active="Home")
button(d, (180, 160, 520, 455), "TABLE", "Format as Table")
d.text((610, 165), "Source-data checklist", font=font(28, True), fill=NAVY)
for i, item in enumerate(["One header row", "One record per row", "No blank rows", "No manual totals"]):
    y = 225 + i*65; d.rounded_rectangle((610, y, 675, y+44), radius=8, fill=PALE, outline=GREEN, width=2)
    d.text((642, y+21), "OK", anchor="mm", font=font(18, True), fill=GREEN); d.text((705, y+8), item, font=font(23), fill=TEXT)
im.save(OUT / "excel-windows-format-as-table.png", quality=95)

im, d = ribbon()
button(d, (90, 155, 390, 450), "PIVOT", "PivotTable")
button(d, (430, 155, 730, 450), "REC", "Recommended\nCharts")
button(d, (770, 155, 1070, 450), "BAR", "Column or\nBar Chart")
button(d, (1110, 155, 1410, 450), "LINE", "Line or Area\nChart", False)
button(d, (1450, 155, 1725, 450), "XY", "Scatter\nChart", False)
im.save(OUT / "excel-windows-insert-charts.png", quality=95)

im = Image.new("RGB", (W, 740), WHITE); d = ImageDraw.Draw(im)
d.rectangle((0, 0, W, 64), fill=GREEN); d.text((30, 15), "Polish a chart with Chart Elements", font=font(30, True), fill=WHITE)
d.rectangle((150, 125, 1370, 650), outline=LINE, width=3); d.text((760, 155), "Revenue by Service Line", anchor="ma", font=font(30, True), fill=NAVY)
bars = [(310, 500, 440, 600), (520, 410, 650, 600), (730, 290, 860, 600), (940, 360, 1070, 600)]
for box, label, value in zip(bars, ["Lab", "Therapy", "Urgent Care", "Imaging"], ["$420K", "$610K", "$880K", "$690K"]):
    d.rectangle(box, fill=BLUE); d.text(((box[0]+box[2])/2, box[1]-35), value, anchor="mm", font=font(21, True), fill=TEXT)
    d.text(((box[0]+box[2])/2, 625), label, anchor="mm", font=font(20), fill=TEXT)
d.rounded_rectangle((1415, 145, 1505, 235), radius=44, fill=GREEN); d.text((1460, 188), "+", anchor="mm", font=font(52, True), fill=WHITE)
d.text((1540, 160), "Chart Elements", font=font(25, True), fill=NAVY)
for i, item in enumerate(["Chart Title", "Axis Titles", "Data Labels", "Legend", "Gridlines"]):
    y = 230 + i*65; selected = item in {"Chart Title", "Data Labels"}
    d.rectangle((1450, y, 1490, y+40), outline=GREEN, width=3, fill=PALE if selected else WHITE)
    if selected: d.text((1470, y+20), "x", anchor="mm", font=font(20, True), fill=GREEN)
    d.text((1510, y+7), item, font=font(21), fill=TEXT)
im.save(OUT / "excel-windows-chart-elements.png", quality=95)

im = Image.new("RGB", (W, 760), WHITE); d = ImageDraw.Draw(im)
d.rectangle((0, 0, W, 64), fill=GREEN); d.text((30, 15), "Arrange fields in the PivotTable Fields pane", font=font(30, True), fill=WHITE)
d.rectangle((75, 115, 930, 690), outline=LINE, width=3); d.text((110, 140), "PivotTable summary", font=font(25, True), fill=NAVY)
d.rectangle((125, 210, 820, 265), fill=NAVY); d.text((145, 225), "Service Line", font=font(21, True), fill=WHITE); d.text((560, 225), "Sum of Revenue", font=font(21, True), fill=WHITE)
for i, (name, value) in enumerate([("Imaging", "$690,000"), ("Lab", "$420,000"), ("Therapy", "$610,000"), ("Urgent Care", "$880,000")]):
    y = 265 + i*62; d.rectangle((125, y, 820, y+62), outline=LINE, width=2, fill="#FAFBFC")
    d.text((145, y+18), name, font=font(21), fill=TEXT); d.text((600, y+18), value, font=font(21), fill=TEXT)
d.rectangle((990, 105, 1735, 710), outline=GREEN, width=4); d.text((1020, 130), "PivotTable Fields", font=font(27, True), fill=NAVY)
for i, field in enumerate(["Month", "Service Line", "Payer", "Visits", "Revenue"]):
    y = 190 + i*48; d.rectangle((1025, y, 1060, y+35), outline=LINE, width=2, fill=PALE if field in {"Service Line", "Revenue"} else WHITE)
    d.text((1080, y+5), field, font=font(20), fill=TEXT)
for i, (area, value) in enumerate([("Filters", "Month"), ("Columns", ""), ("Rows", "Service Line"), ("Values", "Sum of Revenue")]):
    x = 1025 + (i%2)*350; y = 455 + (i//2)*115; d.text((x, y), area, font=font(19, True), fill=NAVY)
    d.rounded_rectangle((x, y+30, x+310, y+93), radius=6, fill=YELLOW if value else "#F5F6F7", outline=LINE, width=2)
    d.text((x+16, y+48), value or "Drop field here", font=font(18), fill=TEXT)
im.save(OUT / "excel-windows-pivottable-fields.png", quality=95)

im, d = ribbon(active="PivotTable Analyze")
button(d, (110, 155, 440, 450), "FIELD", "Field Settings")
button(d, (500, 155, 830, 450), "REFRESH", "Refresh or\nRefresh All")
button(d, (890, 155, 1220, 450), "SLICER", "Insert Slicer")
d.text((1300, 185), "Before presenting:", font=font(27, True), fill=NAVY)
for i, item in enumerate(["Check Sum vs. Count", "Refresh the data", "Test slicer filters"]):
    d.text((1325, 255+i*70), f"{i+1}. {item}", font=font(22), fill=TEXT)
im.save(OUT / "excel-windows-pivot-analyze-tools.png", quality=95)
