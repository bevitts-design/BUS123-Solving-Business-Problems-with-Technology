/** Patch the shared M07 layout, preserving the private audit solutions and tabs.
 * BUS123_ARTIFACT_RUNTIME points to a workspace linked to bundled node_modules.
 * Usage: node scripts/build-math07-workbooks.mjs [staging-directory]
 * Private outputs are always staged outside this public repository.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {execFileSync} from 'node:child_process';
const runtimeRequire=createRequire(path.join(process.env.BUS123_ARTIFACT_RUNTIME||process.cwd(),'package.json'));
const {FileBlob,SpreadsheetFile}=await import(runtimeRequire.resolve('@oai/artifact-tool'));
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const stage=path.resolve(process.argv[2]||'/private/tmp/bus123-m07-workbooks');
if(stage===root||stage.startsWith(root+path.sep))throw Error('Stage paired outputs outside the public repository.');
await fs.mkdir(stage,{recursive:true});
const studentPath=path.join(root,'MATH/M07/bus123-math-m07-l01-starter.xlsx');
const keyPath=path.resolve(root,'../BUS123-instructor/MATH/M07/bus123-math-m07-l01-activity-key.xlsx');
const model=JSON.parse(await fs.readFile(path.join(root,'MATH/M07/source/bus123-math-m07-l01-models.json'),'utf8'));
// Normalize legacy inputs once; repeated builds preserve the compact layout.
const compactInputs=[];
for(const [label,input] of [['student',studentPath],['key',keyPath]]){
  const output=path.join(stage,`${label}-compact-input.xlsx`);
  execFileSync(process.env.BUS123_PYTHON||'python3',[path.join(root,'scripts/compact-math07-input-columns.py'),input,output]);
  const normalized=path.join(stage,`${label}-normalized-input.xlsx`);
  execFileSync(process.env.BUS123_PYTHON||'python3',[path.join(root,'scripts/reorder-math07-practice.py'),output,normalized,'inverse']);
  compactInputs.push(normalized);
}
const student=await SpreadsheetFile.importXlsx(await FileBlob.load(compactInputs[0]));
const key=await SpreadsheetFile.importXlsx(await FileBlob.load(compactInputs[1]));
const writeText=(sheet,cell,text)=>sheet.getRange(cell).values=[[text]];
const live=student.worksheets.getItem('Live You Try It');
writeText(live,'A3','Enter inputs and formulas in F. Feedback checks baseline values and required references. Attempt first, then compare with the slide reveal. Restore inputs after Predict → Change → Explain.');
live.getRange('A3:I3').format.rowHeight=42;
writeText(live,'C7','E: tax rate 6.25%; F: sales tax using subtotal F6.');
writeText(live,'C8','D: shipping 22; F: total price using F6, F7 and D8.');
writeText(live,'C10','F: tax held using receipts D9 and pre-tax sales F9.');
writeText(live,'C12','D: $25 per $1,000; F: annual vehicle excise using excise value F11.');
writeText(live,'C13','F: monthly amount to set aside using annual excise F12.');
writeText(live,'H12','Divide excise value F11 by 1,000, then multiply by the dollar rate D12.');
writeText(live,'H13','Divide the annual excise bill by 12. This is a budgeting amount, not a monthly tax bill.');
writeText(live,'H16','Divide annual property tax F15 by 12 for monthly savings.');
writeText(live,'C16','F: monthly savings using annual property tax F15.');
// Add A/B blocks below the existing live tasks without shifting their addresses.
for(const w of [student,key]){
  const sheet=w.worksheets.getItem('Live You Try It');
  for(const v of model.reverseVersions){
    const first=v.receiptsRow,last=v.taxRow;
    sheet.getRange(`A${v.headingRow}:I${last}`).unmerge();
    sheet.getRange(`A${v.headingRow}:I${last}`).clear({applyTo:'contents'});
    sheet.getRange(`A${first}:I${last}`).copyFrom(sheet.getRange('A6:I9'),'all');
    sheet.getRange(`A${first}:I${last}`).clear({applyTo:'contents'});
    sheet.getRange(`A${first}:I${last}`).format={
      fill:'#FFFFFF',font:{name:'Aptos',size:11,color:'#1A1F2C'},
      rowHeight:42,wrapText:true,verticalAlignment:'center',
      borders:{preset:'all',style:'thin',color:'#E5E1D6'}
    };
    sheet.getRange(`D${first}:F${last}`).format.fill='#F2EEE5';
    sheet.getRange(`G${first}:G${last}`).format.fill='#EAF3EC';
    for(const row of [v.headingRow,v.factsRow])sheet.mergeCells(`A${row}:I${row}`);
    writeText(sheet,`A${v.headingRow}`,`Slide 7 - Reverse sales tax - Version ${v.version} (${v.version==='A'?'follow along':'try independently'})`);
    sheet.getRange(`A${v.headingRow}:I${v.headingRow}`).format={fill:'#4A7C5E',font:{name:'Aptos',size:13,bold:true,color:'#FFFFFF'},rowHeight:30};
    writeText(sheet,`A${v.factsRow}`,`Tidal register receipts of $${v.receipts.toLocaleString('en-US')} include ${(v.rate*100).toFixed(2)}% sales tax. Enter the givens, calculate pre-tax sales and tax held, and explain why they add back to receipts.`);
    sheet.getRange(`A${v.factsRow}:I${v.factsRow}`).format={fill:'#FAF8F3',wrapText:true,rowHeight:36,font:{name:'Aptos',size:11,color:'#1A1F2C'}};
    sheet.getRange(`A${v.headerRow}:I${v.headerRow}`).copyFrom(sheet.getRange('A5:I5'),'all');
    sheet.getRange(`A${v.headerRow}:I${v.headerRow}`).format={fill:'#355773',font:{name:'Aptos',size:11,bold:true,color:'#FFFFFF'},rowHeight:28,wrapText:true,verticalAlignment:'center'};
    const tasks=[
      [v.receiptsRow,'Receipts',`Enter tax-inclusive receipts ${v.receipts.toLocaleString('en-US')} in ${v.receiptsCell}.`],
      [v.rateRow,'Tax rate',`Enter sales-tax rate ${(v.rate*100).toFixed(2)}% in ${v.rateCell}.`],
      [v.salesRow,'Pre-tax sales',`Calculate sales before tax in ${v.salesCell} using the two inputs above.`],
      [v.taxRow,'Tax held',`Calculate tax held in ${v.taxCell} using receipts and your pre-tax sales result.`]
    ];
    for(const [row,topic,task] of tasks){
      writeText(sheet,`A${row}`,`${v.version}${row-first+1}`);
      writeText(sheet,`B${row}`,topic);writeText(sheet,`C${row}`,task);writeText(sheet,`I${row}`,'slide 7');
    }
    for(const cell of [v.receiptsCell,v.rateCell,v.salesCell,v.taxCell]){
      sheet.getRange(cell).format.fill='#FFD966';
      sheet.getRange(cell).setNumberFormat(cell===v.rateCell?'0.00%':'"$"#,##0.00');
    }
    writeText(sheet,`H${v.salesRow}`,'Explain why the divisor includes 1 plus the tax rate.');
    writeText(sheet,`H${v.taxRow}`,'Sales plus tax held must equal receipts.');
    for(const [row,answer,expected,refs] of [
      [v.salesRow,v.salesCell,v.sales,[v.receiptsCell,v.rateCell]],
      [v.taxRow,v.taxCell,v.tax,[v.receiptsCell,v.salesCell]]
    ]){
      const checks=refs.map(c=>`ISNUMBER(SEARCH("${c}",SUBSTITUTE(UPPER(_xlfn.FORMULATEXT(${answer})),"$","")))`).join(',');
      sheet.getRange(`G${row}`).formulas=[[`=IF(COUNT(${refs.join(',')},${answer})<3,"Enter inputs and a formula first",IF(NOT(_xlfn.ISFORMULA(${answer})),"Use a formula, not a typed answer",IF(NOT(IFERROR(AND(${checks}),FALSE)),"Use the required input/result references",IF(ABS(${answer}-${expected})<=0.01,"Correct - explain your revenue/tax split","Check the inputs and reverse-tax calculation"))))`]];
    }
  }
}
for(const cell of ['D12','D13']){
  live.getRange(cell).clear({applyTo:'contents'});
  live.getRange(cell).format.fill='#F2EEE5';
}
for(const w of [student,key]){
  const sh=w.worksheets.getItem('Live You Try It');
  writeText(sh,'C9','D: receipts 64,200; E: tax rate 6.25%; F: pre-tax sales.');
  writeText(sh,'C11','D: original list price 30,000; E: third-year value percentage 40%; F: excise value.');
  writeText(sh,'H11','Use the manufacturer’s original list price, not purchase price.');
  for(const row of [11,12,13])writeText(sh,`B${row}`,'Vehicle excise');
  sh.getRange('E12').clear({applyTo:'contents'});sh.getRange('E12').format.fill='#F2EEE5';
  sh.getRange('D12').format.fill='#FFD966';sh.getRange('D12').setNumberFormat('"$"0.00');
  for(const cell of ['E7','E9','E11'])sh.getRange(cell).setNumberFormat('0.00%');
  const ch=w.worksheets.getItem('Class Challenge');
  for(const row of [7,8,9]){ch.getRange(`F${row}`).values=[[0.0625]];ch.getRange(`F${row}`).setNumberFormat('0.00%');}
  writeText(ch,'A4','Sales examples use Massachusetts 6.25%. Vehicle excise uses full-calendar-year registration and the supplied year percentage. Property tax uses the supplied town rules. Keep source cells unchanged; repair formulas in yellow cells.');
  writeText(ch,'D6','Amount / original list price / assessed value');
  writeText(ch,'E6','Discount / vehicle-year percentage');
  writeText(ch,'F6','Sales rate / dollars per $1,000');
  for(const [row,list,year] of [[10,32000,.6],[11,36000,.4]]){
    writeText(ch,`B${row}`,'Vehicle excise');
    ch.getRange(`D${row}`).values=[[list]];ch.getRange(`E${row}`).values=[[year]];ch.getRange(`E${row}`).setNumberFormat('0%');
    ch.getRange(`F${row}`).values=[[25]];ch.getRange(`F${row}`).setNumberFormat('"$"0.00');ch.getRange(`G${row}`).clear({applyTo:'contents'});
  }
  writeText(ch,'C10','Meridian car: original list price $32,000; second year 60%; $25 per $1,000; full year');
  writeText(ch,'C11','Meridian car: original list price $36,000; third year 40%; $25 per $1,000; full year');
  writeText(sh,'C14','D: assessed value $540,000; F: thousands of assessed value (divide by 1,000).');
  writeText(sh,'C15','D: Beverly FY2026 commercial rate $20.98 per $1,000; F: annual property tax using F14.');
  writeText(sh,'H14','Massachusetts uses the assessor’s full and fair cash value. Divide by 1,000 to match rate units.');
  writeText(sh,'H15','Multiply thousands of assessed value F14 by dollars per $1,000 D15.');
  for(const cell of ['E14','E15']){sh.getRange(cell).clear({applyTo:'contents'});sh.getRange(cell).format.fill='#F2EEE5';}
  sh.getRange('D15').setNumberFormat('"$"0.00');sh.getRange('F14').setNumberFormat('0.00');
  writeText(ch,'A4','Sales tax and vehicle excise use Massachusetts rules. Property tax uses Beverly FY2026 commercial/residential rates. Example property values are illustrative. Source cells stay unchanged.');
  writeText(ch,'C12','Beverly FY2026 commercial office: $820,000 assessed value; commercial $20.98 and residential $10.81 per $1,000');
  ch.getRange('D12').values=[[820000]];ch.getRange('E12').clear({applyTo:'contents'});ch.getRange('F12').values=[[20.98]];ch.getRange('G12').values=[[10.81]];
  ch.getRange('F12:G12').setNumberFormat('"$"0.00');
  ch.getRange('H16').values=[[22757.35]];
  const card=w.worksheets.getItem('FormulaReferenceCard');
  writeText(card,'A9','Vehicle excise value');writeText(card,'B9',"'=ListPrice*YearPercent");writeText(card,'C9','Uses original manufacturer list price and the vehicle-year percentage.');writeText(card,'D9','Do not use purchase price or current resale value.');
  writeText(card,'A10','Annual vehicle excise');writeText(card,'B10',"'=ExciseValue/1000*25");writeText(card,'C10','Charges $25 for each $1,000 of excise value.');writeText(card,'D10','Owner pays city/town; these examples assume full-year registration.');
  writeText(card,'A11','Thousands of assessed value');writeText(card,'B11',"'=AssessedValue/1000");writeText(card,'C11','Converts the assessor’s value to the units used by the local rate.');writeText(card,'D11','Do not apply the former 32% or 40% assessment fraction.');
  writeText(card,'A12','Annual property tax');writeText(card,'B12',"'=ThousandsOfValue*LocalRate");writeText(card,'C12','Uses the published dollar rate per $1,000.');writeText(card,'D12','Match municipality, property class, and fiscal year.');
  writeText(card,'A13','Direct property-tax formula');writeText(card,'B13',"'=AssessedValue/1000*LocalRate");writeText(card,'C13','Equivalent one-step calculation.');writeText(card,'D13','The rate is dollars per $1,000, not a percentage.');
  writeText(card,'A14','Monthly property-tax savings');writeText(card,'D14','Monthly budgeting amount; actual city billing can differ.');

}
const allInputs=Object.assign({},...model.livePractice.map(x=>x.inputs));
for(const item of model.livePractice){
  const r=item.row,answer=`F${r}`;
  for(const cell of Object.keys(item.inputs))live.getRange(cell).clear({applyTo:'contents'});
  live.getRange(answer).clear({applyTo:'contents'});
  const required=[...new Set([...item.references,answer])];
  // OOXML requires the future-function prefix for these Excel 2013 functions.
  const normalized=`SUBSTITUTE(UPPER(_xlfn.FORMULATEXT(${answer})),"$","")`;
  const refs=item.references.map(cell=>`ISNUMBER(SEARCH("${cell}",${normalized}))`).join(',');
  const tolerance=r===15?'0.0000001':'0.01';
  const inputs=Object.entries(item.inputs).map(([cell,value])=>`ABS(${cell}-${value})<=${cell==='E15'?'0.01':value<1?'0.0000001':'0.01'}`).join(',');
  live.getRange(`G${r}`).formulas=[[`=IF(COUNT(${required.join(',')})<${required.length},"Enter inputs and a formula first",IF(NOT(_xlfn.ISFORMULA(${answer})),"Use a formula, not a typed answer",IF(NOT(IFERROR(AND(${refs}),FALSE)),"Use the required input/result references",IF(AND(${inputs?inputs+',':''}ABS(${answer}-${item.value})<=${tolerance}),"Correct - explain and test your model","Check the baseline inputs and calculation"))))`]];
  writeText(live,`I${r}`,r<=10?'slide 9':r<=13?'slide 14':'slide 18');
}
live.getRange('F15').setNumberFormat('"$"#,##0.00');
const start=student.worksheets.getItem('START HERE');
writeText(start,'C8','Start with slide 7: Version A in rows 8-11, then Version B in rows 17-20. Continue downward: sales tax on slide 9 (rows 24-28), vehicle excise on slide 14 (rows 29-31), and property tax on slide 18 (rows 32-34).');
writeText(start,'C9','In pairs, audit R01-R03 and one of R04-R06. Complete all six and reconcile for homework.');
writeText(start,'C14','Yellow input cells and answer cells are blank for student work.');
writeText(start,'C15','Feedback checks baseline values and required references; explain your logic and test changing inputs.');
const challenge=student.worksheets.getItem('Class Challenge');
writeText(challenge,'A3','In pairs: audit R01-R03, then one of R04-R06. Finish all six for homework before reconciling to the control total. Enter 0 for OK or 1 for ERROR, repair formulas, and compute adjustments.');
challenge.getRange('A3:L3').format.rowHeight=42;
// Public worksheet layout and labels are the shared source of truth.
// Preserve completed private answers only where student cells are deliberately blank.
for(const name of ['START HERE','Live You Try It','Class Challenge','FormulaReferenceCard']){
  const s=student.worksheets.getItem(name),k=key.worksheets.getItem(name);
  const rows=name==='Class Challenge'?24:name==='FormulaReferenceCard'?14:name==='Live You Try It'?34:16;
  const cols=name==='Class Challenge'?12:name==='FormulaReferenceCard'?4:name==='START HERE'?6:9;
  const vals=s.getRangeByIndexes(0,0,rows,cols).values;
  const forms=s.getRangeByIndexes(0,0,rows,cols).formulas;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const target=k.getRangeByIndexes(r,c,1,1),f=forms[r]?.[c],v=vals[r]?.[c];
    if(f)target.formulas=[[f]];
    else if(v!==null&&v!==undefined&&v!=='')target.values=[[typeof v==='string'&&v.startsWith('=')?"'"+v:v]];
  }
}
const keyLive=key.worksheets.getItem('Live You Try It');
for(const v of model.reverseVersions){
  keyLive.getRange(v.receiptsCell).values=[[v.receipts]];
  keyLive.getRange(v.rateCell).values=[[v.rate]];
  keyLive.getRange(v.salesCell).formulas=[[v.salesFormula]];
  keyLive.getRange(v.taxCell).formulas=[[v.taxFormula]];
}
for(const cell of ['D12','D13']){
  keyLive.getRange(cell).clear({applyTo:'contents'});
  keyLive.getRange(cell).format.fill=cell==='D12'?'#FFD966':'#F2EEE5';
}
for(const item of model.livePractice){
  for(const [cell,value] of Object.entries(item.inputs))keyLive.getRange(cell).values=[[value]];
  keyLive.getRange(`F${item.row}`).formulas=[[item.formula]];
}
keyLive.getRange('F15').setNumberFormat('"$"#,##0.00');
keyLive.getRange('A3:I3').format.rowHeight=42;
key.worksheets.getItem('Class Challenge').getRange('A3:L3').format.rowHeight=42;
// Verify calculations and input sensitivity in the private model, then restore baseline.
const assertClose=(cell,expected)=>{
  const value=keyLive.getRange(cell).values[0][0];
  if(typeof value!=='number'||Math.abs(value-expected)>0.00001)throw Error(`${cell}: expected ${expected}, got ${value}`);
};
key.recalculate();
for(const v of model.reverseVersions){assertClose(v.salesCell,v.sales);assertClose(v.taxCell,v.tax);}
for(const item of model.livePractice)assertClose(`F${item.row}`,item.value);
for(const item of model.predictions){
  keyLive.getRange(item.input).values=[[item.value]];
  key.recalculate();
  for(const [cell,value] of Object.entries(item.outputs))assertClose(cell,value);
  keyLive.getRange(item.input).values=[[allInputs[item.input]]];
}
key.recalculate();
const audit=key.worksheets.getItem('Class Challenge');
// Rebuild audit formulas cell by cell so imported cached totals are refreshed.
const filed={7:'=ROUND((D7-E7)*F7,2)',8:'=ROUND(D8*F8,2)',9:'=ROUND(D9-D9/(1+F9),2)',10:'=ROUND(D10*E10*F10/1000,2)',11:'=ROUND(D11*F11/1000,2)',12:'=ROUND(D12/1000*G12,2)'};
const {corrected}=JSON.parse(await fs.readFile(path.join(path.dirname(keyPath),'source/bus123-math-m07-l01-audit-model.json'),'utf8'));
for(const w of [student,key]){
 const ch=w.worksheets.getItem('Class Challenge');
 const formulas={'D16':'=SUM(I7:I12)'};
 for(let r=7;r<=12;r++){formulas[`I${r}`]=filed[r];writeText(ch,`H${r}`,"'"+filed[r]);}
 if(w===key){
  for(let r=7;r<=12;r++){formulas[`K${r}`]=corrected[r];formulas[`L${r}`]=`=ROUND(K${r}-I${r},2)`;}
  Object.assign(formulas,{K16:'=SUM(K7:K12)',K17:'=SUM(L7:L12)',K18:'=D16+K17',K19:'=ROUND(K18-H16,2)'});
 }
 for(const [cell,formula] of Object.entries(formulas)){const range=ch.getRange(cell);range.clear({applyTo:'contents'});range.formulas=[[formula]];}
 w.recalculate();
}
if(Math.abs(audit.getRange('K16').values[0][0]-22757.35)>0.001||Math.abs(audit.getRange('K19').values[0][0])>0.001)throw Error(`Audit mismatch: ${JSON.stringify(audit.getRange('K16:K19').values)} adjustments ${JSON.stringify(audit.getRange('L7:L12').values)}`);
const grading=key.worksheets.getItem('INSTRUCTOR_GradingMap');
for(let row=16;row<=21;row++)grading.getRange(`L${row}`).values=[[audit.getRange(`K${row-9}`).values[0][0]]];
for(const row of [13,14,15])writeText(grading,`K${row}`,"'"+corrected[row-3]);
grading.getRange('L28').values=[[audit.getRange('K16').values[0][0]]];
const instructor=key.worksheets.getItem('INSTRUCTOR_AnswerKey');
const physicalRow=new Map(model.worksheetRowOrder.map((old,index)=>[old,index+1]));
const remap=formula=>formula.replace(/([A-I])(\d+)/g,(_,col,row)=>col+physicalRow.get(Number(row)));
for(const [i,item] of model.livePractice.entries()){
  const r=i+5;
  writeText(instructor,`B${r}`,live.getRange(`B${item.row}`).values[0][0]);
  writeText(instructor,`C${r}`,live.getRange(`C${item.row}`).values[0][0]);
  writeText(instructor,`D${r}`,Object.entries(item.inputs).map(([cell,value])=>`${remap(cell)}=${value}`).join('; ')||'Use prior results');
  writeText(instructor,`E${r}`,"'"+remap(item.formula));
  writeText(instructor,`H${r}`,live.getRange(`H${item.row}`).values[0][0]);
  instructor.getRange(`F${r}`).values=[[item.value]];
  writeText(instructor,`G${r}`,item.row<=10?'slide 9':item.row<=13?'slide 14':'slide 18');
}
writeText(instructor,'H22','Correct: apply the second-year percentage, then $25 per $1,000.');
writeText(instructor,'H23','Error: full list price was used without the third-year 40% valuation.');
writeText(instructor,'H24','Error: Beverly residential rate was applied to a commercial office; use $20.98 per $1,000.');
writeText(key.worksheets.getItem('Class Challenge'),'D21','R06 is most consequential: using the residential rate understates commercial property tax by $8,339.40.');
for(let i=0;i<6;i++){
 const r=19+i,a=7+i;
 writeText(instructor,`C${r}`,"'"+corrected[a]);writeText(instructor,`F${r}`,"'"+filed[a]);
 instructor.getRange(`D${r}`).values=[[audit.getRange(`K${a}`).values[0][0]]];
 instructor.getRange(`E${r}`).values=[[audit.getRange(`L${a}`).values[0][0]]];
 instructor.getRange(`G${r}`).values=[[audit.getRange(`I${a}`).values[0][0]]];
}
for(const [target,source] of [['B26','K16'],['D26','D16'],['F26','K17'],['H26','K19']])instructor.getRange(target).values=[[audit.getRange(source).values[0][0]]];
// Demonstrate that a constant-only formula cannot satisfy the reference check.
keyLive.getRange('F6').formulas=[['=640']];
key.recalculate();
const feedback=keyLive.getRange('G6').values[0][0];
// Artifact Tool cannot evaluate ISFORMULA/FORMULATEXT. Native Excel verifies
// these feedback functions after export; the numeric model is tested here.
if(feedback!=='Use the required input/result references'&&feedback!=='#VALUE!')throw Error(`Constant formula check failed: ${feedback}`);
keyLive.getRange('F6').formulas=[[model.livePractice[0].formula]];
for(const w of [student,key]){
  const sheet=w.worksheets.getItem('Live You Try It');
  sheet.mergeCells('A18:I18');
  writeText(sheet,'A18','Continue: sales tax (slide 9), vehicle excise (slide 14), then property tax (slide 18)');
  sheet.getRange('A18:I18').format={fill:'#4A7C5E',font:{name:'Aptos',size:13,bold:true,color:'#FFFFFF'},rowHeight:30};
}
student.recalculate();key.recalculate();
for(const item of model.livePractice){
  assertClose(`F${item.row}`,item.value);
  const status=keyLive.getRange(`G${item.row}`).values[0][0];
  if(status!=='Correct - explain and test your model'&&status!=='#VALUE!')throw Error(`Feedback F${item.row}: ${status}`);
}
for(const [label,w] of [['student',student],['key',key]]){
  const scan=await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#N/A|#NULL!',options:{useRegex:true,maxResults:50},maxChars:1600});
  await fs.writeFile(path.join(stage,`${label}-errors.json`),scan.ndjson);
  const blob=await w.render({sheetName:'Live You Try It',range:'C11:I16',scale:1.5});
  await fs.writeFile(path.join(stage,`${label}-live.png`),new Uint8Array(await blob.arrayBuffer()));
  const reversePreview=await w.render({sheetName:'Live You Try It',range:'A19:I34',scale:1});
  await fs.writeFile(path.join(stage,`${label}-reverse.png`),new Uint8Array(await reversePreview.arrayBuffer()));
  const outputPath=path.join(stage,label==='student'?'bus123-math-m07-l01-starter.xlsx':'bus123-math-m07-l01-activity-key.xlsx');
  await (await SpreadsheetFile.exportXlsx(w)).save(outputPath);
  execFileSync(process.env.BUS123_PYTHON||'python3',[
    path.join(root,'scripts/preserve-workbook-sheet-states.py'),
    compactInputs[label==='student'?0:1],outputPath
  ]);
  const reordered=path.join(stage,`${label}-ordered.xlsx`);
  execFileSync(process.env.BUS123_PYTHON||'python3',[path.join(root,'scripts/reorder-math07-practice.py'),outputPath,reordered,'forward']);
  await fs.rename(reordered,outputPath);
}
console.log('Exported pair; 11 baseline calculations and 3 input changes passed. Reference feedback requires native Excel verification (ISFORMULA/FORMULATEXT unavailable in Artifact Tool).');
