/** Shared M06 layout. Stage the student/key pair outside the public repository.
 * BUS123_ARTIFACT_RUNTIME points to bundled node_modules. Worked calculations
 * match the public slide reveals; private grading/teaching metadata is separate.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const req=createRequire(path.join(process.env.BUS123_ARTIFACT_RUNTIME||process.cwd(),'package.json'));
const {FileBlob,SpreadsheetFile}=await import(req.resolve('@oai/artifact-tool'));
const stage=path.resolve(process.argv[2]||'/private/tmp/bus123-m06-implementation');
if(stage.startsWith(root+path.sep))throw Error('Stage private outputs outside public repository');
await fs.mkdir(stage,{recursive:true});
const input=path.join(root,'MATH/M06/bus123-math-m06-l01-starter.xlsx');
const model=JSON.parse(await fs.readFile(path.join(root,'MATH/M06/source/bus123-math-m06-l01-models.json'),'utf8'));
const write=(s,c,v)=>s.getRange(c).values=[[v]];
const formula=(s,c,v)=>s.getRange(c).formulas=[[v]];
for(const kind of ['student','key']){
 const w=await SpreadsheetFile.importXlsx(await FileBlob.load(input));
 const m=w.worksheets.getItem('Management Model');
 for(const c of Object.keys(model.managementFormulas)){
  m.getRange(c).clear({applyTo:'contents'});
  if(kind==='key')formula(m,c,model.managementFormulas[c]);
 }
 for(let r=37;r<=41;r++){
  m.getRange(`C${r}`).clear({applyTo:'contents'});
  if(kind==='key')write(m,`C${r}`,r===40?'Direct labor hours':'Square footage');
 }
 write(m,'A2','Yellow: enter formulas or driver choices. PASS verifies model checks; justify driver fairness separately.');
 write(m,'A30','Paddleboard revenue');
 write(m,'A46','Total business revenue');
 write(m,'D46','Broader business revenue, separate from paddleboard sales above');
 write(m,'D48','Rate rises when the revenue denominator falls; spending is unchanged');
 for(let r=6;r<=8;r++){
  const prior=r===6?'':`-SUM(E6:E${r-1})`;
  formula(m,`I${r}`,`=IF(COUNT(D${r}:H${r})<5,"BUILD MODEL",IF(AND(D${r}=B${r}*C${r},E${r}=MIN(B${r},MAX(0,'Raw Data'!B12${prior})),E${r}+G${r}=B${r},F${r}=E${r}*C${r},H${r}=G${r}*C${r}),"PASS","REVIEW"))`);
 }
 formula(m,'I9','=IF(COUNT(D6:H9)<20,"BUILD MODEL",IF(AND(COUNTIF(I6:I8,"PASS")=3,D9=SUM(D6:D8),E9=SUM(E6:E8),F9=SUM(F6:F8),G9=SUM(G6:G8),H9=SUM(H6:H8),E9=\'Raw Data\'!B12),"PASS","REVIEW"))');
 formula(m,'I14','=IF(COUNT(D6:H9)<20,"BUILD MODEL",IF(AND(I9="PASS",ABS(H14)<0.01),"PASS","REVIEW"))');
 formula(m,'I15','=IF(COUNT(D6:H9)<20,"BUILD MODEL",IF(AND(I9="PASS",ABS(H15)<0.01),"PASS","REVIEW"))');
 formula(m,'I16','=IF(COUNT(B15:B20)<6,"BUILD MODEL",IF(AND(B15=D9,ABS(B16-B15/B14)<0.000001,B18=B17*B16,B19=B14-B17,B20=B19*B16,ABS(H16)<0.01),"PASS","REVIEW"))');
 formula(m,'I25','=IF(COUNT(B27:C29)<6,"BUILD MODEL",IF(AND(B27=SUM(B25:B26),C27=SUM(C25:C26)),"PASS","REVIEW"))');
 formula(m,'I26','=IF(COUNT(B27:C29)<6,"BUILD MODEL",IF(AND(B28=H9,C28=B20,ABS(G26-G25)<0.01,ABS(H26-H25)<0.01),"PASS","REVIEW"))');
 formula(m,'I27','=IF(COUNT(B27:C32)<12,"BUILD MODEL",IF(AND(I25="PASS",I26="PASS",B31=B30-B29,C31=C30-C29,ABS(B32-B31/B30)<0.000001,ABS(C32-C31/C30)<0.000001),"PASS","REVIEW"))');
 for(let r=37;r<=41;r++)formula(m,`I${r}`,`=IF(OR(C${r}="",COUNT(D${r}:H${r})<5),"BUILD MODEL",IF(AND(D${r}>=0,E${r}>=0,F${r}>0,F${r}=SUM(D${r}:E${r}),ABS(G${r}-B${r}*D${r}/F${r})<0.01,ABS(H${r}-B${r}*E${r}/F${r})<0.01,ABS(SUM(G${r}:H${r})-B${r})<0.01),"PASS","REVIEW"))`);
 m.getRange('A50:I51').unmerge();m.mergeCells('A50:I51');
 write(m,'A50','PASS checks arithmetic and completeness. Explain why each driver fits its cost pool in Decision Brief. Alternative available drivers are acceptable with evidence; an allocation total alone does not prove fairness.');
 m.getRange('A50:I51').format={wrapText:true,rowHeight:30,font:{size:11,color:'#355773'},fill:'#EAF3EC'};
 const start=w.worksheets.getItem('START HERE');
 write(start,'B19','Source value or scenario given');
 write(start,'C6','Read and preserve source data. Paddleboard sales and total business revenue have different scopes.');
 write(start,'C7','First use Live You Try It: A with the instructor, B independently. Then complete Management Model.');
 start.getRange('C7:D7').format.rowHeight=52;
 write(start,'A23','Guided A/B practice');write(start,'B23','Live You Try It');write(start,'C23','A: rows 6–36. B: rows 44–74. Attempt yellow cells, then compare with slide reveals.');
 start.getRange('A23:D23').format={wrapText:true,rowHeight:48,font:{size:11,color:'#1A1F2C'}};
 const live=w.worksheets.items.find(s=>s.name==='Live You Try It')||w.worksheets.add('Live You Try It');
 live.getRange('A1:F76').unmerge();live.getRange('A1:F76').clear({applyTo:'contents'});
 live.getRange('A1:F76').format={font:{name:'Aptos',size:11,color:'#1A1F2C'},fill:'#FFFFFF',rowHeight:27,wrapText:true,verticalAlignment:'center',borders:{preset:'all',style:'thin',color:'#E5E1D6'}};
 for(const [col,width]of Object.entries({A:230,B:100,C:110,D:150,E:155,F:240}))live.getRange(`${col}:${col}`).format.columnWidthPx=width;
 live.mergeCells('A1:F1');write(live,'A1','M06 · Live You Try It · A follow along / B independent');
 live.getRange('A1:F1').format={fill:'#355773',font:{name:'Aptos',size:15,bold:true,color:'#FFFFFF'},rowHeight:36};
 live.mergeCells('A2:F3');write(live,'A2','Blue cells contain source facts or scenario givens. Build formulas in yellow cells; compare with the slide reveal after attempting. Keep full precision. Practice feedback checks results; the Management Model adds FIFO and reconciliation controls.');live.getRange('A2:F3').format.rowHeight=25;
 for(const v of model.practiceVersions){
  const o=v.offset,R=n=>n+o,C=(col,n)=>`${col}${R(n)}`;
  live.mergeCells(`A${R(4)}:F${R(4)}`);write(live,C('A',4),`Version ${v.version}: ${v.sold} paddleboards sold; revenue downside ${v.decline*100}%`);live.getRange(`A${R(4)}:F${R(4)}`).format={fill:'#4A7C5E',font:{size:13,bold:true,color:'#FFFFFF'},rowHeight:32};
  live.getRange(`A${R(5)}:F${R(5)}`).values=[['Layer / metric','Quantity','Unit cost','Layer cost / hint','Your formula / result','Feedback / explanation']];live.getRange(`A${R(5)}:F${R(5)}`).format.fill='#EAF3EC';
  const forms={};
  for(let r=6;r<=8;r++){
   formula(live,C('A',r),`='Raw Data'!A${r}`);formula(live,C('B',r),`='Raw Data'!B${r}`);formula(live,C('C',r),`='Raw Data'!C${r}`);formula(live,C('D',r),`=${C('B',r)}*${C('C',r)}`);live.getRange(`B${R(r)}:D${R(r)}`).format.fill='#DDEBF7';
  }
  const facts={11:['Units sold',v.sold],12:['Selling price',420],27:['Rent pool',9000],28:['Surf square feet',2400],29:['Online square feet',1600],31:['Total business revenue',110000],32:['Total overhead',22000],33:['Revenue decline',v.decline]};
  for(const [r,[label,value]]of Object.entries(facts)){write(live,C('A',+r),label);write(live,C('B',+r),value);live.getRange(C('B',+r)).format.fill='#DDEBF7';}
  const tasks={14:['FIFO COGS',`=${C('B',6)}*${C('C',6)}+MIN(${C('B',7)},MAX(0,${C('B',11)}-${C('B',6)}))*${C('C',7)}+MAX(0,${C('B',11)}-SUM(${C('B',6)}:${C('B',7)}))*${C('C',8)}`],15:['WAC unit cost',`=SUM(${C('D',6)}:${C('D',8)})/SUM(${C('B',6)}:${C('B',8)})`],16:['WAC COGS',`=${C('B',11)}*${C('E',15)}`],17:['FIFO ending inventory',`=SUM(${C('D',6)}:${C('D',8)})-${C('E',14)}`],20:['Goods available',`=SUM(${C('D',6)}:${C('D',8)})`],21:['FIFO COGS',`=${C('E',20)}-${C('E',17)}`],22:['Paddleboard revenue',`=${C('B',11)}*${C('B',12)}`],23:['FIFO gross profit',`=${C('E',22)}-${C('E',21)}`],24:['FIFO gross margin',`=${C('E',23)}/${C('E',22)}`],30:['Surf allocated rent',`=${C('B',27)}*${C('B',28)}/SUM(${C('B',28)}:${C('B',29)})`],34:['Base overhead rate',`=${C('B',32)}/${C('B',31)}`],35:['Downside business revenue',`=${C('B',31)}*(1-${C('B',33)})`],36:['Downside overhead rate',`=${C('B',32)}/${C('E',35)}`]};
  for(const [r,[label,f]]of Object.entries(tasks)){
   write(live,C('A',+r),label);write(live,C('D',+r),'Use cells above');live.getRange(C('E',+r)).format.fill='#FFF2B2';forms[C('E',+r)]=f;if(kind==='key')formula(live,C('E',+r),f);
   const refs=[...new Set(f.match(/[A-Z]+[0-9]+/g))];const refTest=refs.map(c=>`ISNUMBER(SEARCH("${c}",SUBSTITUTE(UPPER(_xlfn.FORMULATEXT(${C('E',+r)})),"$","")))`).join(',');
   formula(live,C('F',+r),`=IF(${C('E',+r)}="","TRY FIRST",IF(NOT(_xlfn.ISFORMULA(${C('E',+r)})),"Use a formula",IF(NOT(IFERROR(OR(${refTest}),FALSE)),"Reference the input cells",IF(ABS(${C('E',+r)}-(${f.slice(1)}))<0.000001,"PASS - explain the result","REVIEW"))))`);
   live.getRange(C('E',+r)).setNumberFormat([24,34,36].includes(+r)?'0.0%':'"$"#,##0.00');
  }
  for(const [r,source]of Object.entries({12:'B13',27:'B25',28:'B18',29:'C18',32:'B30'}))formula(live,C('B',+r),`='Raw Data'!${source}`);
  if(v.version==='A')formula(live,C('B',11),"='Raw Data'!B12");
  formula(live,C('B',31),"=SUM('Raw Data'!B19:C19)");
  live.getRange(`C${R(6)}:D${R(8)}`).setNumberFormat('"$"#,##0.00');
  for(const r of [12,27,31,32])live.getRange(C('B',r)).setNumberFormat('"$"#,##0.00');
  live.getRange(C('B',33)).setNumberFormat('0%');
 }
 const ref=w.worksheets.getItem('Formula Reference');write(ref,'A24','PASS does not prove driver fairness');write(ref,'B24','Explain the driver and trace the source cells. Reconcile totals and confirm FIFO uses oldest costs first.');ref.mergeCells('B24:D24');ref.getRange('A24:D24').format={wrapText:true,rowHeight:48,font:{size:11}};
 w.recalculate();
 const name=kind==='student'?'bus123-math-m06-l01-starter.xlsx':'bus123-math-m06-l01-activity-key.xlsx';
 await(await SpreadsheetFile.exportXlsx(w)).save(path.join(stage,name));
 for(const [sheetName,range]of [['Live You Try It','A4:F24'],['Management Model','A4:I20']]){
  const blob=await w.render({sheetName,range,scale:1.2});await fs.writeFile(path.join(stage,`${kind}-${sheetName.replaceAll(' ','-')}.png`),new Uint8Array(await blob.arrayBuffer()));
 }
}
console.log('Shared M06 student/key layouts exported for native Excel verification.');
