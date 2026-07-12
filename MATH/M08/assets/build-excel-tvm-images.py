#!/usr/bin/env python3
"""Generate Excel teaching visuals for BUS123 MATH-M08-L01."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).resolve().parent
W, H = 1800, 760
GREEN, NAVY, TEXT = "#217346", "#102033", "#17212B"
WHITE, PALE, LINE, YELLOW = "#FFFFFF", "#EAF4EE", "#B7C0C9", "#FFF1B8"
GOLD, BLUE, RED = "#D19A00", "#2E75B6", "#A13B2B"

def font(size, bold=False):
    path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf" if bold else "/System/Library/Fonts/Supplemental/Arial.ttf"
    return ImageFont.truetype(path, size) if Path(path).exists() else ImageFont.load_default()

def base(title):
    im = Image.new("RGB", (W, H), WHITE); d = ImageDraw.Draw(im)
    d.rectangle((0, 0, W, 68), fill=GREEN)
    d.text((32, 16), title, font=font(30, True), fill=WHITE)
    return im, d

def formula_bar(d, x, y, formula, selected):
    d.rectangle((x, y, x+1080, y+70), fill="#F3F5F7", outline=LINE, width=2)
    d.rectangle((x, y, x+120, y+70), fill=WHITE, outline=LINE, width=2)
    d.text((x+60, y+35), selected, anchor="mm", font=font(22, True), fill=TEXT)
    d.text((x+150, y+20), "fx", font=font(25, True), fill=GREEN)
    d.text((x+210, y+20), formula, font=font(23), fill=TEXT)

def worksheet(d, x, y, rows, formula, selected):
    formula_bar(d, x, y, formula, selected); y += 88
    widths = [82, 470, 420]
    for c, label in enumerate(["", "A", "B"]):
        left = x + sum(widths[:c]); right = left + widths[c]
        d.rectangle((left, y, right, y+50), fill="#E7EAED", outline=LINE, width=2)
        d.text(((left+right)//2, y+25), label, anchor="mm", font=font(20, True), fill=NAVY)
    for n, (label, value, kind) in enumerate(rows, 1):
        top = y+n*58
        d.rectangle((x, top, x+82, top+58), fill="#E7EAED", outline=LINE, width=2)
        d.text((x+41, top+29), str(n), anchor="mm", font=font(18), fill=TEXT)
        d.rectangle((x+82, top, x+552, top+58), fill=WHITE, outline=LINE, width=2)
        d.text((x+102, top+16), label, font=font(19, kind == "output"), fill=TEXT)
        fill = YELLOW if kind == "input" else PALE
        d.rectangle((x+552, top, x+972, top+58), fill=fill, outline=GREEN if kind == "output" else LINE, width=3 if kind == "output" else 2)
        d.text((x+572, top+16), value, font=font(19, kind == "output"), fill=TEXT)

im, d = base("Convert time before using an annual interest rate")
cards = [("MONTHS", "=Months/12", "9 months / 12\n= 0.75 years", PALE, GREEN), ("EXACT DAYS", "=Days/365", "124 days / 365\n= 0.3397 years", "#EAF1F8", BLUE), ("ORDINARY DAYS", "=Days/360", "124 days / 360\n= 0.3444 years", YELLOW, GOLD)]
for i, (title, formula, example, fill, outline) in enumerate(cards):
    x = 75+i*570
    d.rounded_rectangle((x,145,x+510,595), radius=18, fill=fill, outline=outline, width=4)
    d.text((x+255,200), title, anchor="ma", font=font(27,True), fill=NAVY)
    d.rounded_rectangle((x+55,285,x+455,375), radius=10, fill=WHITE, outline=outline, width=3)
    d.text((x+255,330), formula, anchor="mm", font=font(31,True), fill=GREEN)
    d.multiline_text((x+255,455), example, anchor="ma", align="center", spacing=10, font=font(23,True), fill=TEXT)
im.save(OUT/"math-m08-time-conversions.png", quality=95)

im, d = base("Build simple interest and future value with cell references")
rows = [("Principal","$8,000.00","input"),("Annual Rate","5.5%","input"),("Months","9","input"),("Time in Years","=B3/12","output"),("Simple Interest","=B1*B2*B4","output"),("Future Value","=B1*(1+B2*B4)","output")]
worksheet(d,70,105,rows,"=B1*(1+B2*B4)","B6")
d.rounded_rectangle((1120,165,1720,610), radius=18, fill=PALE, outline=GREEN, width=4)
d.text((1420,215),"Expected results",anchor="ma",font=font(27,True),fill=NAVY)
d.multiline_text((1420,315),"Time = 0.75 years\n\nInterest = $330.00\n\nFuture Value = $8,330.00\n\nFV must be greater\nthan principal",anchor="ma",align="center",spacing=9,font=font(22,True),fill=TEXT)
im.save(OUT/"math-m08-simple-interest-model.png", quality=95)

im, d = base("Compare exact and ordinary interest from the same loan inputs")
formula_bar(d,90,110,"=B1*B2*(B3/360)","B5")
for x, title, formula, calc, result, fill, outline in [(90,"Exact interest","=B1*B2*(B3/365)","$50,000 x 5% x (124/365)","$849.32","#EAF1F8",BLUE),(880,"Ordinary interest","=B1*B2*(B3/360)","$50,000 x 5% x (124/360)","$861.11",YELLOW,GOLD)]:
    d.rounded_rectangle((x,240,x+730,600),radius=18,fill=fill,outline=outline,width=4)
    d.text((x+365,290),title,anchor="ma",font=font(28,True),fill=NAVY)
    d.text((x+365,380),formula,anchor="mm",font=font(30,True),fill=GREEN)
    d.text((x+365,470),calc,anchor="ma",font=font(22),fill=TEXT)
    d.text((x+365,535),result,anchor="mm",font=font(34,True),fill=NAVY)
d.rounded_rectangle((1640,240,1730,600),radius=12,fill=PALE,outline=GREEN,width=3)
d.multiline_text((1685,335),"+$11.79\n\n360 gives\nmore\ninterest",anchor="ma",align="center",spacing=7,font=font(19,True),fill=RED)
im.save(OUT/"math-m08-exact-ordinary-interest.png", quality=95)

im, d = base("Identify the discounting model before choosing the Excel formula")
for x, title, formula, calc, note, fill, outline in [(80,"Manual simple-interest PV","=B1/(1+B2*B3)","$25,000 / (1 + 7% x 1.5)\n\n= $22,624.43","Linear simple-interest model",PALE,GREEN),(900,"Excel PV() periodic model","=PV(B2,B3,0,B1)","=PV(7%, 1.5, 0, 25000)\n\n= -$22,587.30","Compound periodic model and sign convention","#EAF1F8",BLUE)]:
    d.rounded_rectangle((x,135,x+760,610),radius=18,fill=fill,outline=outline,width=4)
    d.text((x+380,185),title,anchor="ma",font=font(28,True),fill=NAVY)
    d.text((x+380,275),formula,anchor="mm",font=font(32,True),fill=outline)
    d.multiline_text((x+380,360),calc,anchor="ma",align="center",spacing=12,font=font(23,True),fill=TEXT)
    d.text((x+380,535),note,anchor="ma",font=font(20,True),fill=outline)
d.rounded_rectangle((1690,220,1760,525),radius=10,fill=YELLOW,outline=GOLD,width=3)
d.multiline_text((1725,315),"Do not\nexpect\nthe two\nanswers\nto match",anchor="ma",align="center",spacing=6,font=font(17,True),fill=RED)
im.save(OUT/"math-m08-pv-model-comparison.png", quality=95)
