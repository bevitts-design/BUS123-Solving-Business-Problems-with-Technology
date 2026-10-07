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
const student=await SpreadsheetFile.importXlsx(await FileBlob.load(studentPath));
const key=await SpreadsheetFile.importXlsx(await FileBlob.load(keyPath));
const writeText=(sheet,cell,text)=>sheet.getRange(cell).values=[[text]];
const live=student.worksheets.getItem('Live You Try It');
writeText(live,'A3','Enter inputs and formulas in H. Feedback checks baseline values and required references. Attempt first, then compare with the slide reveal. Restore inputs after Predict → Change → Explain.');
live.getRange('A3:K3').format.rowHeight=42;
writeText(live,'C12','E: excise rate 4.5%; H: excise tax using the original base in D11.');
writeText(live,'C13','H: total cost using original base D11 and tax results H11 and H12.');
writeText(live,'J12','Reference the same original base cell used for sales tax: D11.');
writeText(live,'J13','Add the original base and both separate tax results.');
writeText(live,'J16','Reference assessed value H14 and rounded rate H15.');
// Add A/B blocks below the existing live tasks without shifting their addresses.
for(const w of [student,key]){
  const sheet=w.worksheets.getItem('Live You Try It');
  for(const v of model.reverseVersions){
    const first=v.receiptsRow,last=v.taxRow;
    sheet.getRange(`A${v.headingRow}:K${last}`).unmerge();
    sheet.getRange(`A${v.headingRow}:K${last}`).clear({applyTo:'contents'});
    sheet.getRange(`A${first}:K${last}`).copyFrom(sheet.getRange('A6:K9'),'all');
    sheet.getRange(`A${first}:K${last}`).clear({applyTo:'contents'});
    sheet.getRange(`A${first}:K${last}`).format={
      fill:'#FFFFFF',font:{name:'Aptos',size:11,color:'#1A1F2C'},
      rowHeight:42,wrapText:true,verticalAlignment:'center',
      borders:{preset:'all',style:'thin',color:'#E5E1D6'}
    };
    sheet.getRange(`D${first}:H${last}`).format.fill='#F2EEE5';
    sheet.getRange(`I${first}:I${last}`).format.fill='#EAF3EC';
    for(const row of [v.headingRow,v.factsRow])sheet.mergeCells(`A${row}:K${row}`);
    writeText(sheet,`A${v.headingRow}`,`Slide 6 - Reverse sales tax - Version ${v.version} (${v.version==='A'?'follow along':'try independently'})`);
    sheet.getRange(`A${v.headingRow}:K${v.headingRow}`).format={fill:'#4A7C5E',font:{name:'Aptos',size:13,bold:true,color:'#FFFFFF'},rowHeight:30};
    writeText(sheet,`A${v.factsRow}`,`Tidal register receipts of $${v.receipts.toLocaleString('en-US')} include ${(v.rate*100).toFixed(v.version==='A'?1:0)}% sales tax. Enter the givens, calculate pre-tax sales and tax held, and explain why they add back to receipts.`);
    sheet.getRange(`A${v.factsRow}:K${v.factsRow}`).format={fill:'#FAF8F3',wrapText:true,rowHeight:36,font:{name:'Aptos',size:11,color:'#1A1F2C'}};
    sheet.getRange(`A${v.headerRow}:K${v.headerRow}`).copyFrom(sheet.getRange('A5:K5'),'all');
    sheet.getRange(`A${v.headerRow}:K${v.headerRow}`).format={fill:'#355773',font:{name:'Aptos',size:11,bold:true,color:'#FFFFFF'},rowHeight:28,wrapText:true,verticalAlignment:'center'};
    const tasks=[
      [v.receiptsRow,'Receipts',`Enter tax-inclusive receipts ${v.receipts.toLocaleString('en-US')} in ${v.receiptsCell}.`],
      [v.rateRow,'Tax rate',`Enter sales-tax rate ${(v.rate*100).toFixed(v.version==='A'?1:0)}% in ${v.rateCell}.`],
      [v.salesRow,'Pre-tax sales',`Calculate sales before tax in ${v.salesCell} using the two inputs above.`],
      [v.taxRow,'Tax held',`Calculate tax held in ${v.taxCell} using receipts and your pre-tax sales result.`]
    ];
    for(const [row,topic,task] of tasks){
      writeText(sheet,`A${row}`,`${v.version}${row-first+1}`);
      writeText(sheet,`B${row}`,topic);writeText(sheet,`C${row}`,task);writeText(sheet,`K${row}`,'slide 6');
    }
    for(const cell of [v.receiptsCell,v.rateCell,v.salesCell,v.taxCell]){
      sheet.getRange(cell).format.fill='#FFD966';
      sheet.getRange(cell).setNumberFormat(cell===v.rateCell?'0.0%':'"$"#,##0.00');
    }
    writeText(sheet,`J${v.salesRow}`,'Explain why the divisor includes 1 plus the tax rate.');
    writeText(sheet,`J${v.taxRow}`,'Sales plus tax held must equal receipts.');
    for(const [row,answer,expected,refs] of [
      [v.salesRow,v.salesCell,v.sales,[v.receiptsCell,v.rateCell]],
      [v.taxRow,v.taxCell,v.tax,[v.receiptsCell,v.salesCell]]
    ]){
      const checks=refs.map(c=>`ISNUMBER(SEARCH("${c}",SUBSTITUTE(UPPER(_xlfn.FORMULATEXT(${answer})),"$","")))`).join(',');
      sheet.getRange(`I${row}`).formulas=[[`=IF(COUNT(${refs.join(',')},${answer})<3,"Enter inputs and a formula first",IF(NOT(_xlfn.ISFORMULA(${answer})),"Use a formula, not a typed answer",IF(NOT(IFERROR(AND(${checks}),FALSE)),"Use the required input/result references",IF(ABS(${answer}-${expected})<=0.01,"Correct - explain your revenue/tax split","Check the inputs and reverse-tax calculation"))))`]];
    }
  }
}
for(const cell of ['D12','D13']){
  live.getRange(cell).clear({applyTo:'contents'});
  live.getRange(cell).format.fill='#F2EEE5';
}
const allInputs=Object.assign({},...model.livePractice.map(x=>x.inputs));
for(const item of model.livePractice){
  const r=item.row,answer=`H${r}`;
  for(const cell of Object.keys(item.inputs))live.getRange(cell).clear({applyTo:'contents'});
  live.getRange(answer).clear({applyTo:'contents'});
  const required=[...new Set([...item.references,answer])];
  // OOXML requires the future-function prefix for these Excel 2013 functions.
  const normalized=`SUBSTITUTE(UPPER(_xlfn.FORMULATEXT(${answer})),"$","")`;
  const refs=item.references.map(cell=>`ISNUMBER(SEARCH("${cell}",${normalized}))`).join(',');
  const tolerance=r===15?'0.0000001':'0.01';
  const inputs=Object.entries(item.inputs).map(([cell,value])=>`ABS(${cell}-${value})<=${cell==='E15'?'0.01':value<1?'0.0000001':'0.01'}`).join(',');
  live.getRange(`I${r}`).formulas=[[`=IF(COUNT(${required.join(',')})<${required.length},"Enter inputs and a formula first",IF(NOT(_xlfn.ISFORMULA(${answer})),"Use a formula, not a typed answer",IF(NOT(IFERROR(AND(${refs}),FALSE)),"Use the required input/result references",IF(AND(${inputs?inputs+',':''}ABS(${answer}-${item.value})<=${tolerance}),"Correct - explain and test your model","Check the baseline inputs and calculation"))))`]];
  writeText(live,`K${r}`,r<=10?'slide 8':r<=13?'slide 13':'slide 17');
}
live.getRange('H15').setNumberFormat('0.0000');
const start=student.worksheets.getItem('START HERE');
writeText(start,'C8','Slide 6: follow Version A in rows 22-25, then try Version B in rows 31-34. Later slides use tasks 1-11 above. Compare with the slide reveals.');
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
  const cols=name==='Class Challenge'?12:name==='FormulaReferenceCard'?4:name==='START HERE'?6:11;
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
  keyLive.getRange(cell).format.fill='#F2EEE5';
}
for(const item of model.livePractice){
  for(const [cell,value] of Object.entries(item.inputs))keyLive.getRange(cell).values=[[value]];
  keyLive.getRange(`H${item.row}`).formulas=[[item.formula]];
}
keyLive.getRange('H15').setNumberFormat('0.0000');
keyLive.getRange('A3:K3').format.rowHeight=42;
key.worksheets.getItem('Class Challenge').getRange('A3:L3').format.rowHeight=42;
// Verify calculations and input sensitivity in the private model, then restore baseline.
const assertClose=(cell,expected)=>{
  const value=keyLive.getRange(cell).values[0][0];
  if(typeof value!=='number'||Math.abs(value-expected)>0.00001)throw Error(`${cell}: expected ${expected}, got ${value}`);
};
key.recalculate();
for(const v of model.reverseVersions){assertClose(v.salesCell,v.sales);assertClose(v.taxCell,v.tax);}
for(const item of model.livePractice)assertClose(`H${item.row}`,item.value);
for(const item of model.predictions){
  keyLive.getRange(item.input).values=[[item.value]];
  key.recalculate();
  for(const [cell,value] of Object.entries(item.outputs))assertClose(cell,value);
  keyLive.getRange(item.input).values=[[allInputs[item.input]]];
}
key.recalculate();
// Demonstrate that a constant-only formula cannot satisfy the reference check.
keyLive.getRange('H6').formulas=[['=640']];
key.recalculate();
const feedback=keyLive.getRange('I6').values[0][0];
// Artifact Tool cannot evaluate ISFORMULA/FORMULATEXT. Native Excel verifies
// these feedback functions after export; the numeric model is tested here.
if(feedback!=='Use the required input/result references'&&feedback!=='#VALUE!')throw Error(`Constant formula check failed: ${feedback}`);
keyLive.getRange('H6').formulas=[[model.livePractice[0].formula]];
student.recalculate();key.recalculate();
for(const item of model.livePractice){
  assertClose(`H${item.row}`,item.value);
  const status=keyLive.getRange(`I${item.row}`).values[0][0];
  if(status!=='Correct - explain and test your model'&&status!=='#VALUE!')throw Error(`Feedback H${item.row}: ${status}`);
}
for(const [label,w] of [['student',student],['key',key]]){
  const scan=await w.inspect({kind:'match',searchTerm:'#REF!|#DIV/0!|#VALUE!|#NAME\\?|#NUM!|#N/A|#NULL!',options:{useRegex:true,maxResults:50},maxChars:1600});
  await fs.writeFile(path.join(stage,`${label}-errors.json`),scan.ndjson);
  const blob=await w.render({sheetName:'Live You Try It',range:'C11:K16',scale:1.5});
  await fs.writeFile(path.join(stage,`${label}-live.png`),new Uint8Array(await blob.arrayBuffer()));
  const reversePreview=await w.render({sheetName:'Live You Try It',range:'A19:K34',scale:1});
  await fs.writeFile(path.join(stage,`${label}-reverse.png`),new Uint8Array(await reversePreview.arrayBuffer()));
  const outputPath=path.join(stage,label==='student'?'bus123-math-m07-l01-starter.xlsx':'bus123-math-m07-l01-activity-key.xlsx');
  await (await SpreadsheetFile.exportXlsx(w)).save(outputPath);
  execFileSync(process.env.BUS123_PYTHON||'python3',[
    path.join(root,'scripts/preserve-workbook-sheet-states.py'),
    label==='student'?studentPath:keyPath,outputPath
  ]);
}
console.log('Exported pair; 11 baseline calculations and 3 input changes passed. Reference feedback requires native Excel verification (ISFORMULA/FORMULATEXT unavailable in Artifact Tool).');
