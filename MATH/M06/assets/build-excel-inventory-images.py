#!/usr/bin/env python3
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

OUT=Path(__file__).resolve().parent; W,H=1800,760
GREEN,NAVY,TEXT="#217346","#102033","#17212B"
WHITE,PALE,LINE,YELLOW,BLUE,ORANGE,RED="#FFFFFF","#EAF4EE","#B7C0C9","#FFF1B8","#2E75B6","#D48324","#B84A3A"
def font(s,b=False):
 p="/System/Library/Fonts/Supplemental/Arial Bold.ttf" if b else "/System/Library/Fonts/Supplemental/Arial.ttf"; return ImageFont.truetype(p,s) if Path(p).exists() else ImageFont.load_default()
def base(t):
 im=Image.new("RGB",(W,H),WHITE); d=ImageDraw.Draw(im); d.rectangle((0,0,W,68),fill=GREEN); d.text((32,16),t,font=font(30,True),fill=WHITE); return im,d
def card(d,b,t,ls,c=GREEN,f=PALE):
 d.rounded_rectangle(b,radius=16,fill=f,outline=c,width=4); x1,y1,x2,y2=b; d.text(((x1+x2)//2,y1+42),t,anchor="ma",font=font(25,True),fill=NAVY); d.multiline_text(((x1+x2)//2,y1+120),"\n".join(ls),anchor="ma",align="center",spacing=12,font=font(21),fill=TEXT)

im,d=base("The inventory method decides which cost layers flow to COGS")
for i,(n,q,v) in enumerate([("PO-101 · Feb","10 units × $210","$2,100"),("PO-102 · Mar","10 units × $230","$2,300"),("PO-103 · Apr","10 units × $250","$2,500")]):
 x=70+i*430; card(d,(x,130,x+380,370),n,[q,v],ORANGE,YELLOW)
card(d,(1380,130,1740,370),"WAC",["Blend all layers","$6,900 ÷ 30","= $230 per unit"],BLUE)
card(d,(70,435,570,680),"FIFO · 20 sold",["Oldest layers to COGS","$2,100 + $2,300","COGS = $4,400"],GREEN)
card(d,(650,435,1150,680),"LIFO · 20 sold",["Newest layers to COGS","$2,500 + $2,300","COGS = $4,800"],ORANGE,YELLOW)
card(d,(1230,435,1730,680),"WAC · 20 sold",["20 × $230","COGS = $4,600","Ending inv. = $2,300"],BLUE)
im.save(OUT/"math-m06-inventory-layers.png",quality=95)

im,d=base("Build inventory methods from labeled Excel inputs")
d.rectangle((70,105,1190,165),fill="#F3F5F7",outline=LINE,width=2); d.text((90,123),"fx",font=font(23,True),fill=GREEN); d.text((150,123),"=SUM(D6:D8)/SUM(B6:B8)",font=font(21),fill=TEXT)
heads=["Purchase Layer","Quantity","Unit Cost","Layer Cost"]; ws=[340,230,230,320]; x0,y0=70,190; x=x0
for h,w in zip(heads,ws): d.rectangle((x,y0,x+w,y0+60),fill=NAVY,outline=WHITE,width=2); d.text((x+14,y0+18),h,font=font(19,True),fill=WHITE); x+=w
for r,row in enumerate([["PO-101","10","$210","=B6*C6"],["PO-102","10","$230","=B7*C7"],["PO-103","10","$250","=B8*C8"]]):
 x=x0; y=y0+60+r*64
 for c,(v,w) in enumerate(zip(row,ws)): d.rectangle((x,y,x+w,y+64),fill=PALE if c==3 else YELLOW,outline=GREEN if c==3 else LINE,width=3 if c==3 else 2); d.text((x+14,y+19),v,font=font(19,c==3),fill=TEXT); x+=w
card(d,(1250,125,1730,385),"WAC Unit Cost",["=SUM(LayerCost)","÷ SUM(Quantity)","= $230"],BLUE)
card(d,(70,470,820,685),"FIFO COGS",["=10*210+10*230","$4,400 · oldest layers first"],GREEN)
card(d,(900,470,1650,685),"WAC COGS",["=UnitsSold*WACUnitCost","$4,600 · 20 × $230"],BLUE)
im.save(OUT/"math-m06-excel-inventory-model.png",quality=95)

im,d=base("Ending inventory is the bridge from goods available to COGS")
for i,(n,v,op) in enumerate([("Beginning Inventory","$12,400","+"),("Purchases","$38,600","="),("Goods Available","$51,000","−"),("Ending Inventory","$9,800","="),("COGS","$41,200","")]):
 x=45+i*350; c=GREEN if n=="COGS" else ORANGE if n=="Ending Inventory" else BLUE; card(d,(x,180,x+285,500),n,[v],c,YELLOW if n=="Ending Inventory" else PALE)
 if op:d.text((x+317,330),op,anchor="mm",font=font(50,True),fill=NAVY)
d.rounded_rectangle((430,575,1370,680),radius=12,fill=PALE,outline=GREEN,width=3); d.text((900,625),"Check: COGS cannot exceed goods available for sale",anchor="mm",font=font(23,True),fill=TEXT)
im.save(OUT/"math-m06-cogs-bridge.png",quality=95)

im,d=base("One overstated count creates opposite errors across two periods")
card(d,(100,135,800,635),"CURRENT PERIOD",["Ending inventory +$5,000","↓","COGS understated $5,000","↓","Net income overstated $5,000"],RED,YELLOW)
card(d,(1000,135,1700,635),"FOLLOWING PERIOD",["Beginning inventory +$5,000","↓","COGS overstated $5,000","↓","Net income understated $5,000"],BLUE,PALE); d.text((900,375),"→",anchor="mm",font=font(70,True),fill=NAVY)
im.save(OUT/"math-m06-inventory-error-flow.png",quality=95)

im,d=base("Margin and markup use the same profit but different bases")
card(d,(90,130,830,625),"GROSS MARGIN",["Profit ÷ Revenue","($80 − $48) ÷ $80","= 40.0%","Base: selling price"],GREEN)
card(d,(970,130,1710,625),"MARKUP",["Profit ÷ Cost","($80 − $48) ÷ $48","= 66.7%","Base: cost"],ORANGE,YELLOW)
d.rounded_rectangle((690,650,1110,730),radius=10,fill=NAVY); d.text((900,690),"Same $32 profit numerator",anchor="mm",font=font(21,True),fill=WHITE)
im.save(OUT/"math-m06-margin-markup-bases.png",quality=95)

im,d=base("Allocate overhead using a driver that explains the cost")
card(d,(70,125,540,580),"INPUTS",["Monthly rent: $9,000","Surf Shop: 2,400 sq ft","Warehouse: 1,600 sq ft","Total: 4,000 sq ft"],BLUE,YELLOW)
card(d,(665,125,1135,580),"SURF SHOP",["=2400/4000","60%","=$9,000*60%","$5,400"],GREEN)
card(d,(1260,125,1730,580),"WAREHOUSE",["=1600/4000","40%","=$9,000*40%","$3,600"],ORANGE)
d.rounded_rectangle((310,625,1490,710),radius=12,fill=YELLOW,outline=ORANGE,width=3); d.text((900,667),"Checks: percentages = 100% · allocated rent = $9,000",anchor="mm",font=font(22,True),fill=TEXT)
im.save(OUT/"math-m06-overhead-allocation.png",quality=95)
