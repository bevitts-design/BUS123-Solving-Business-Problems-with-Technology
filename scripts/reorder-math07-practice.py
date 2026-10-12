"""Order M07 practice rows by teaching sequence; structural OOXML fallback.
Used before/after Artifact Tool authoring because structural row moves are unavailable.
"""
import re,sys,zipfile,json
from pathlib import Path
import xml.etree.ElementTree as E
N='http://schemas.openxmlformats.org/spreadsheetml/2006/main';n={'m':N};E.register_namespace('',N)
ORDER=json.loads((Path(__file__).resolve().parents[1]/"MATH/M07/source/bus123-math-m07-l01-models.json").read_text())["worksheetRowOrder"]
FORWARD={old:new for new,old in enumerate(ORDER,1)}
def rewrite(text,mapping):
 return re.sub(r'(?<![A-Za-z0-9])([$]?[A-I][$]?)(\d+)(?!\d)',lambda m:m[1]+str(mapping.get(int(m[2]),int(m[2]))),text)
def run(src,out,direction):
 with zipfile.ZipFile(src) as z:data={f:z.read(f) for f in z.namelist()}
 strings=E.fromstring(data['xl/sharedStrings.xml']);texts=[''.join(s.itertext()) for s in strings]
 root=E.fromstring(data['xl/worksheets/sheet2.xml'])
 c=root.find('.//m:c[@r="A5"]/m:v',n);hc=root.find('.//m:c[@r="A5"]',n)
 header='' if c is None else texts[int(c.text)] if hc.get('t')=='s' else c.text
 ordered='Version A' in header
 if ordered==(direction=='forward'):Path(out).write_bytes(Path(src).read_bytes());return
 mp=FORWARD if direction=='forward' else {v:k for k,v in FORWARD.items()}
 for f in [f for f in data if f.startswith('xl/worksheets/') and f.endswith('.xml')]:
  r=root if f=='xl/worksheets/sheet2.xml' else E.fromstring(data[f]);live=f=='xl/worksheets/sheet2.xml'
  for row in r.findall('m:sheetData/m:row',n):
   if live:row.set('r',str(mp.get(int(row.get('r')),int(row.get('r')))))
   for cell in row:
    if live:cell.set('r',rewrite(cell.get('r'),mp))
    form=cell.find('m:f',n)
    if form is not None and form.text:
     if live:form.text=rewrite(form.text,mp)
     else:form.text=re.sub(r"('Live You Try It'!)([$]?[A-I][$]?\d+)",lambda m:m[1]+rewrite(m[2],mp),form.text)
    if cell.get('t') in ('str','inlineStr') and live:
     for textnode in cell.findall('m:v',n)+cell.findall('.//m:t',n):
      if textnode.text:textnode.text=rewrite(textnode.text,mp)
    if cell.get('t')=='s' and live:
     v=cell.find('m:v',n);old=texts[int(v.text)];new=rewrite(old,mp)
     if new!=old:
      si=E.SubElement(strings,'{'+N+'}si');E.SubElement(si,'{'+N+'}t').text=new;v.text=str(len(texts));texts.append(new)
  if live:
   sd=r.find('m:sheetData',n);sd[:]=sorted(sd,key=lambda x:int(x.get('r')))
   for e in r.iter():
    for a in ('ref','sqref','topLeftCell'):
     if a in e.attrib and e.tag not in ('{'+N+'}dimension',):e.set(a,rewrite(e.get(a),mp))
  data[f]=E.tostring(r,encoding='utf-8',xml_declaration=True)
 strings.set('uniqueCount',str(len(texts)));data['xl/sharedStrings.xml']=E.tostring(strings,encoding='utf-8',xml_declaration=True)
 with zipfile.ZipFile(out,'w',zipfile.ZIP_DEFLATED) as z:
  for f,b in data.items():z.writestr(f,b)
if __name__=='__main__':run(*sys.argv[1:4])
