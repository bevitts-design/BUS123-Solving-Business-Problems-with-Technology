"""Remove the two unused Live You Try It columns; OOXML fallback for column deletion.
Artifact Tool does not expose structural column deletion. All other authoring stays
in build-math07-workbooks.mjs. Idempotent for an already compacted workbook.
"""
import re, sys, zipfile
import xml.etree.ElementTree as ET
from pathlib import Path
NS='http://schemas.openxmlformats.org/spreadsheetml/2006/main'
ET.register_namespace('',NS)
n={'m':NS}
MAP={'H':'F','I':'G','J':'H','K':'I'}
def refs(text):
    return re.sub(r'(?<![A-Za-z])([HIJK])(\$?\d+)',lambda m:MAP[m[1]]+m[2],text)
def address(text):
    return refs(text)
def compact(source,target):
    with zipfile.ZipFile(source) as z:
        data={f:z.read(f) for f in z.namelist()}
    strings=ET.fromstring(data['xl/sharedStrings.xml'])
    texts=[''.join(s.itertext()) for s in strings]
    book=ET.fromstring(data['xl/workbook.xml'])
    rels=ET.fromstring(data['xl/_rels/workbook.xml.rels'])
    rid=next(s for s in book.find('m:sheets',n) if s.get('name')=='Live You Try It').get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
    t=next(r for r in rels if r.get('Id')==rid).get('Target')
    name=t.lstrip('/') if t.startswith('/') else 'xl/'+t
    sheet=ET.fromstring(data[name])
    head=sheet.find('.//m:c[@r="F5"]/m:v',n)
    if head is None or texts[int(head.text)]!='Input 3':
        Path(target).write_bytes(Path(source).read_bytes());return
    # Only live-sheet cells and explicit live-sheet references change. Other
    # sheets keep their own columns and unqualified formula references.
    for filename in [f for f in data if f.startswith('xl/worksheets/') and f.endswith('.xml')]:
        root=sheet if filename==name else ET.fromstring(data[filename])
        for row in root.findall('.//m:sheetData/m:row',n):
            for cell in list(row):
                if filename==name:
                    col=re.match('[A-Z]+',cell.get('r'))[0]
                    if col in ('F','G'):row.remove(cell);continue
                    cell.set('r',address(cell.get('r')))
                form=cell.find('m:f',n)
                if form is not None and form.text:
                    if filename==name:form.text=refs(form.text)
                    else:form.text=re.sub(r"('Live You Try It'!)(\$?[HIJK]\$?\d+)",lambda m:m[1]+refs(m[2]),form.text)
                if cell.get('t')=='s':
                    v=cell.find('m:v',n);old=texts[int(v.text)]
                    new=refs(old)
                    if filename==name:new=re.sub(r'\bH:', 'F:',new);new=new.replace('formulas in H.','formulas in F.')
                    elif filename.endswith('sheet1.xml'):new=new.replace('formulas in H','formulas in F')
                    else:new=old
                    if new!=old:
                        si=ET.SubElement(strings,'{'+NS+'}si');ET.SubElement(si,'{'+NS+'}t').text=new
                        v.text=str(len(texts));texts.append(new)
            if filename==name and 'spans' in row.attrib:row.set('spans','1:9')
        if filename==name:
            for e in root.iter():
                for attr in ('ref','sqref','topLeftCell'):
                    if attr in e.attrib:e.set(attr,address(e.get(attr)))
            cols=root.find('m:cols',n)
            if cols is not None:
                expanded=[]
                for c in cols:
                    for i in range(int(c.get('min')),int(c.get('max'))+1):
                        if i in (6,7):continue
                        a=dict(c.attrib);j=i-2 if i>7 else i;a.update(min=str(j),max=str(j));expanded.append(ET.Element(c.tag,a))
                cols[:]=expanded
        data[filename]=ET.tostring(root,encoding='utf-8',xml_declaration=True)
    strings.set('uniqueCount',str(len(texts)))
    data['xl/sharedStrings.xml']=ET.tostring(strings,encoding='utf-8',xml_declaration=True)
    with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
        for f,b in data.items():z.writestr(f,b)
if __name__=='__main__':compact(*sys.argv[1:3])
