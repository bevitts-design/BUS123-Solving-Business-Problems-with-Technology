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
 write(start,'A2','Learn FIFO first → compare weighted average → use the management model → decide');
 write(start,'B7','Live You Try It');
 write(start,'C7','Stage 1: A with the instructor (rows 4–17), then B independently (rows 20–33). Decide units sold first; calculate costs second.');
 write(start,'D7','You can explain which purchases supplied the sold units and which units remain.');
 write(start,'B8','Live You Try It');
 write(start,'C8','Stage 2: compare weighted average in rows 36–46 after finishing both FIFO tables. Use Formula Reference when needed.');
 write(start,'D8','You can explain why the same sale has different assigned costs.');
 write(start,'B9','Management Model');
 write(start,'C9','Stage 3: FIFO and weighted-average A results flow here automatically. Complete the profit schedule and, when assigned, the later overhead work and Decision Brief.');
 write(start,'D9','Use completed inventory results; do not rebuild the FIFO calculation.');
 write(start,'C10','Check units and dollars. Finish the Decision Brief and downside scenario when assigned. Save before submitting.');
 start.getRange('C7:D9').format.rowHeight=68;
 write(start,'A23','FIFO first');write(start,'B23','Live You Try It');write(start,'C23','A: D6:G9. B: D22:G25. Enter sold quantities in column D; use formulas for costs and remaining units.');
 start.getRange('A23:D23').format={wrapText:true,rowHeight:48,font:{size:11,color:'#1A1F2C'}};
 write(start,'B19','Source value or scenario given');
 write(start,'D19','Enter sold quantities, formulas, or choices as directed');
 const live=w.worksheets.getItem('Live You Try It');
 live.getRange('A1:K76').unmerge();live.getRange('A1:K76').clear({applyTo:'all'});
 live.getRange('A1:H52').format={font:{name:'Aptos',size:11,color:'#1A1F2C'},fill:'#FFFFFF',rowHeight:29,wrapText:true,verticalAlignment:'center',borders:{preset:'all',style:'thin',color:'#E5E1D6'}};
 for(const [col,width]of Object.entries({A:205,B:90,C:105,D:105,E:140,F:105,G:145,H:290}))live.getRange(`${col}:${col}`).format.columnWidthPx=width;
 const band=(row,text)=>{live.mergeCells(`A${row}:H${row}`);write(live,`A${row}`,text);live.getRange(`A${row}:H${row}`).format={fill:'#355773',font:{size:14,bold:true,color:'#FFFFFF'},rowHeight:35};};
 const note=(row,text)=>{live.mergeCells(`A${row}:H${row}`);write(live,`A${row}`,text);live.getRange(`A${row}:H${row}`).format.rowHeight=36;};
 const response=(cell,f)=>{live.getRange(cell).format.fill='#FFF2B2';if(kind==='key')formula(live,cell,f);};
 band(1,'M06 · FIFO first: decide units, then calculate costs');
 note(2,'Blue = given facts. Yellow = your work. In column D enter how many units are sold from each purchase, oldest first. In E, F and G use formulas.');
 for(const v of model.practiceVersions){
  const o=v.offset,R=n=>n+o,C=(col,n)=>`${col}${R(n)}`;
  band(R(4),`Stage 1 · ${v.version}: ${v.version==='A'?'guided':'independent'} FIFO · ${v.sold} boards sold`);
  live.getRange(`A${R(5)}:H${R(5)}`).values=[['Oldest → newest','Available units','Cost per unit','Units sold','Cost of units sold','Units left','Ending value','Think / check']];
  live.getRange(`A${R(5)}:H${R(5)}`).format={fill:'#EAF3EC',rowHeight:42,font:{bold:true,size:11}};
  const sold=v.version==='A'?[8,11,0]:[8,12,1];
  for(let r=6;r<=8;r++){
   for(const col of ['A','B','C'])formula(live,C(col,r),`='Raw Data'!${col}${r}`);
   live.getRange(`B${R(r)}:C${R(r)}`).format.fill='#DDEBF7';
   live.getRange(C('D',r)).format.fill='#FFF2B2';if(kind==='key')write(live,C('D',r),sold[r-6]);
   response(C('E',r),`=${C('D',r)}*${C('C',r)}`);
   response(C('F',r),`=${C('B',r)}-${C('D',r)}`);
   response(C('G',r),`=${C('F',r)}*${C('C',r)}`);
   write(live,C('H',r),v.version==='A'?['Start with the oldest purchase.','How many sales remain after the first row?','Are any sales still unfilled?'][r-6]:'Use older units before newer units.');
  }
  write(live,C('A',9),'Totals');formula(live,C('B',9),`=SUM(${C('B',6)}:${C('B',8)})`);
  for(const col of ['D','E','F','G'])response(C(col,9),`=SUM(${C(col,6)}:${C(col,8)})`);
  live.getRange(`A${R(9)}:H${R(9)}`).format.font.bold=true;
  write(live,C('A',11),'Units sold (given)');write(live,C('B',11),v.sold);live.getRange(C('B',11)).format.fill='#DDEBF7';
  if(v.version==='A')formula(live,C('B',11),"='Raw Data'!B12");
  write(live,C('A',12),'Units available');formula(live,C('B',12),`=${C('B',9)}`);
  write(live,C('A',14),'FIFO COGS');formula(live,C('E',14),`=IF(COUNT(${C('D',6)}:${C('G',9)})<16,"",${C('E',9)})`);
  write(live,C('A',15),'Ending inventory');formula(live,C('E',15),`=IF(COUNT(${C('D',6)}:${C('G',9)})<16,"",${C('G',9)})`);
  const expected=`AND(${C('D',6)}=MIN(${C('B',6)},${C('B',11)}),${C('D',7)}=MIN(${C('B',7)},MAX(0,${C('B',11)}-${C('D',6)})),${C('D',8)}=MAX(0,${C('B',11)}-SUM(${C('D',6)}:${C('D',7)})))`;
  const layerChecks=[6,7,8].map(r=>`${C('E',r)}=${C('D',r)}*${C('C',r)},${C('F',r)}=${C('B',r)}-${C('D',r)},${C('G',r)}=${C('F',r)}*${C('C',r)}`).join(',');
  const totalChecks=['D','E','F','G'].map(col=>`${C(col,9)}=SUM(${C(col,6)}:${C(col,8)})`).join(',');
  formula(live,C('H',9),`=IF(COUNT(${C('D',6)}:${C('G',9)})<16,"TRY FIRST",IF(NOT(${expected}),"REVIEW: oldest units first",IF(AND(${layerChecks},${totalChecks},${C('D',9)}=${C('B',11)},${C('D',9)}+${C('F',9)}=${C('B',9)},${C('E',9)}+${C('G',9)}=SUMPRODUCT(${C('B',6)}:${C('B',8)},${C('C',6)}:${C('C',8)})),"PASS: explain the units","REVIEW: units or costs")))`);
  live.getRange(C('H',9)).conditionalFormats.addCustom(`LEFT(${C('H',9)},4)="PASS"`,{fill:'#EAF3EC',font:{color:'#355773'}});
  live.getRange(C('H',9)).conditionalFormats.addCustom(`LEFT(${C('H',9)},6)="REVIEW"`,{fill:'#FCE4D6',font:{color:'#9C0006'}});
  note(R(17),v.version==='A'?'Before B: explain why FIFO starts with the oldest purchase. How many sales still need a cost after each row?':'Compare A and B: two more boards sold. Which purchases supply them? What happens to COGS and inventory left?');
  live.getRange(`C${R(6)}:C${R(8)}`).setNumberFormat('"$"#,##0');
  for(const col of ['E','G'])live.getRange(`${col}${R(6)}:${col}${R(15)}`).setNumberFormat('"$"#,##0.00');
  for(const col of ['B','D','F'])live.getRange(`${col}${R(6)}:${col}${R(12)}`).setNumberFormat('0');
 }
 band(36,'Stage 2 · Weighted average: compare after both FIFO attempts');
 note(37,'Blend the cost of all 30 available boards. Calculate one average cost per board, then apply it to boards sold and boards left. Keep full precision.');
 live.getRange('A39:H39').values=[['Metric','Given / total','','','A: 19 sold','B: 21 sold','','Think / check']];live.getRange('A39:H39').format.fill='#EAF3EC';
 write(live,'A40','Average cost per board');formula(live,'B40',"=SUM('Raw Data'!D6:D8)");write(live,'H40','Total available cost ÷ total available units');
 write(live,'A41','Cost of boards sold');formula(live,'B41',"=SUM('Raw Data'!B6:B8)");write(live,'H41','Units sold × average cost per board');
 write(live,'A42','Ending inventory');write(live,'H42','Units left × average cost per board');
 write(live,'C40','Total cost');write(live,'C41','Total units');live.getRange('B40:B41').format.fill='#DDEBF7';live.getRange('B40').setNumberFormat('"$"#,##0.00');
 for(const [col,offset]of [['E',0],['F',16]]){
  response(`${col}40`,'=$B$40/$B$41');response(`${col}41`,`=B${11+offset}*${col}40`);response(`${col}42`,`=F${9+offset}*${col}40`);
  live.getRange(`${col}40:${col}42`).setNumberFormat('"$"#,##0.00');
 }
 note(45,'Compare each sale under FIFO and weighted average. Units and total available cost stay the same; the assigned cost per sold unit changes.');
 note(46,'Stage 3: open Management Model. A results link automatically; complete the profit schedule next. Start overhead and Decision Brief only when assigned.');
 live.freezePanes.freezeRows(5);
 // The model uses completed practice rather than asking students to repeat it.
 for(let r=6;r<=8;r++){
  formula(m,`D${r}`,`=B${r}*C${r}`);
  for(const [dest,source]of [['E','D'],['F','E'],['G','F'],['H','G']]){
   formula(m,`${dest}${r}`,`=IF(COUNT('Live You Try It'!D6:G9)<16,"",'Live You Try It'!${source}${r})`);
  }
 }
 for(const col of ['D','E','F','G','H'])formula(m,`${col}9`,col==='D'?'=SUM(D6:D8)':`=IF(COUNT('Live You Try It'!D6:G9)<16,"",SUM(${col}6:${col}8))`);
 for(const [cell,f]of Object.entries({B15:'=D9',B16:`=IF(COUNT('Live You Try It'!E40:E42)<3,"",'Live You Try It'!E40)`,B18:`=IF(COUNT('Live You Try It'!E40:E42)<3,"",'Live You Try It'!E41)`,B19:'=B14-B17',B20:`=IF(COUNT('Live You Try It'!E40:E42)<3,"",'Live You Try It'!E42)`}))formula(m,cell,f);
 m.getRange('D6:H9').format.fill='#F2EEE5';for(const cell of ['B15','B16','B18','B19','B20'])m.getRange(cell).format.fill='#F2EEE5';
 write(start,'A24','LINKS');write(start,'B24','Pale cream: supplied model links; no entry needed');start.getRange('A24:B24').format={wrapText:true,rowHeight:42};
 write(m,'A2','Stage 3 · A inventory results link from Live You Try It. Complete yellow profit cells next; overhead and Decision Brief come later when assigned.');
 write(m,'A4','1 · FIFO results linked from guided A');write(m,'A12','2 · Weighted-average results linked from A');write(m,'A35','4 · Later stage: overhead allocation');
 const ref=w.worksheets.getItem('Formula Reference');write(ref,'B7',"'=TotalAvailableCost/TotalAvailableUnits");write(ref,'C7','Divide the cost of all available boards by the number of available boards.');write(ref,'A24','PASS does not prove driver fairness');write(ref,'B24','Explain the driver and trace the source cells. Reconcile totals and confirm FIFO uses oldest costs first.');ref.mergeCells('B24:D24');ref.getRange('A24:D24').format={wrapText:true,rowHeight:48,font:{size:11}};
 w.recalculate();
 console.log(kind,(await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A|#NUM!|#NULL!',options:{useRegex:true,maxResults:20},maxChars:2000})).ndjson);
 const name=kind==='student'?'bus123-math-m06-l01-starter.xlsx':'bus123-math-m06-l01-activity-key.xlsx';
 await(await SpreadsheetFile.exportXlsx(w)).save(path.join(stage,name));
 for(const [sheetName,range]of [['Live You Try It','A4:H17'],['Live You Try It','A20:H33'],['Live You Try It','A36:H46'],['Management Model','A4:I20']]){
  const blob=await w.render({sheetName,range,scale:1.2});await fs.writeFile(path.join(stage,`${kind}-${sheetName.replaceAll(' ','-')}-${range.replace(':','-')}.png`),new Uint8Array(await blob.arrayBuffer()));
 }
}
console.log('Shared M06 student/key layouts exported for native Excel verification.');
