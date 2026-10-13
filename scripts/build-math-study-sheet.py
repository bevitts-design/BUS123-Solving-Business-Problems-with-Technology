#!/usr/bin/env python3
"""Rebuild the student M03-M07 formula handout from its editable Markdown source."""
import re
from pathlib import Path
from xml.sax.saxutils import escape
from reportlab.lib import colors
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'MATH/M07/source/bus123-math-m07-l01-study-sheet.md'
OUT=ROOT/'MATH/M07/bus123-math-m07-l01-study-sheet.pdf'
INK='#0E1116'; SAGE='#4A7C5E'; STEEL='#355773'; PALE='#EAF3EC'
def style(name,**kwargs):return ParagraphStyle(name,fontName='Helvetica',fontSize=10,leading=13,textColor=colors.HexColor(INK),**kwargs)
body=style('body'); small=style('small',spaceAfter=5); title=ParagraphStyle('title',fontName='Times-Bold',fontSize=23,leading=27,textColor=colors.HexColor(INK))
heading=ParagraphStyle('head',fontName='Helvetica-Bold',fontSize=10,leading=13,textColor=colors.HexColor(SAGE))
formula=ParagraphStyle('formula',fontName='Courier-Bold',fontSize=9.5,leading=12,textColor=colors.HexColor(STEEL))
def p(t,s=body):return Paragraph(escape(t).replace('\n','<br/>'),s)
def read_source(path):
 text=path.read_text()
 data={'title':text.splitlines()[0].removeprefix('# '),'pages':[]}
 for section in re.split(r'^## ',text,flags=re.M)[1:]:
  header,content=section.split('\n',1)
  module,title=header.split(' | ',1)
  chunks=re.split(r'^### ',content,flags=re.M)
  paragraphs=chunks[0].strip().split('\n\n')
  page={'module':module,'title':title,'context':paragraphs[0],'intro':'\n\n'.join(paragraphs[1:]),'rows':[],'tips':[]}
  for chunk in chunks[1:]:
   topic,body=chunk.split('\n',1)
   if topic=='Check before you finish':
    page['tips']=[line[2:] for line in body.splitlines() if line.startswith('- ')]
   else:
    match=re.fullmatch(r'\s*```excel\n(.*?)\n```\s*(.*?)\s*',body,flags=re.S)
    if not match:raise ValueError('Invalid formula block: '+topic)
    page['rows'].append({'topic':topic,'formula':match[1],'example':match[2]})
  data['pages'].append(page)
 return data

data=read_source(SOURCE);story=[]
for idx,page in enumerate(data['pages']):
 if idx:story.append(PageBreak())
 story.extend([p('BUS123  /  TEST STUDY SHEET  /  '+page['module'],heading),Spacer(1,7),p(page['title'],title),Spacer(1,7)])
 intro=page['intro']
 if intro:story.append(p(intro,small))
 story.append(Spacer(1,4))
 for row in page['rows']:
  table=Table([[p(row['topic'],heading),[p(row['formula'],formula),Spacer(1,4),p(row['example'])]]],colWidths=[155,385])
  table.setStyle(TableStyle([('BACKGROUND',(1,0),(1,0),colors.HexColor(PALE)),('LINEBEFORE',(1,0),(1,0),3,colors.HexColor(SAGE)),('LEFTPADDING',(0,0),(-1,-1),9),('RIGHTPADDING',(0,0),(-1,-1),9),('TOPPADDING',(0,0),(-1,-1),3),('BOTTOMPADDING',(0,0),(-1,-1),3)]))
  story.extend([KeepTogether([table,Spacer(1,5)])])
 story.extend([Spacer(1,3),p('CHECK BEFORE YOU FINISH',heading),Spacer(1,3)])
 for tip in page['tips']:story.append(p('- '+tip,small))
SimpleDocTemplate(str(OUT),pagesize=(612,792),leftMargin=36,rightMargin=36,topMargin=30,bottomMargin=45,title=data['title'],author='BUS123 | Professor Evitts').build(story)
print(OUT)
