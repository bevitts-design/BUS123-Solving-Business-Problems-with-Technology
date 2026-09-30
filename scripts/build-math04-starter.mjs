/** Rebuild only the model-building live practice in the M04 starter. */
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
// Point BUS123_ARTIFACT_RUNTIME at a workspace with the bundled runtime modules.
const runtimeRequire=createRequire(path.join(process.env.BUS123_ARTIFACT_RUNTIME||process.cwd(),'package.json'));
const {FileBlob, SpreadsheetFile}=await import(runtimeRequire.resolve('@oai/artifact-tool'));

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
export const starterPath=path.join(root,'MATH/M04/bus123-math-m04-l01-starter.xlsx');
export const modelData=JSON.parse(await fs.readFile(path.join(root,'MATH/M04/source/bus123-math-m04-l01-models.json'),'utf8'));

export async function buildStarter(inputPath=starterPath) {
  const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(inputPath));
  const start=wb.worksheets.getItem('START HERE');
  start.getRange('A3').values=[['Build and label your own live models, then compare with the slide reveals.']];
  start.getRange('B5').values=[['Open Live You Try It during the slide pauses. Read each new scenario and choose your own model layout.']];
  start.getRange('A6').values=[['Build your model']];
  start.getRange('B6').values=[['Write labels, enter inputs, and calculate with cell references. Format money, percentages, and whole guests.']];
  start.getRange('B7').values=[['After live practice, use Class Challenge for scenarios that combine pricing and break-even.']];
  start.getRange('B8').values=[['Compare logic and answers with the slide reveal. Different cell locations are valid.']];
  start.getRange('B5:F8').format.wrapText=true;
  start.getRange('A5:F8').format.rowHeight=48;
  const live=wb.worksheets.getItem('Live You Try It');
  live.getRange('A1:F46').unmerge();
  live.getRange('A1:F46').conditionalFormats.clear();
  live.getRange('A1:F46').clear({applyTo:'all'});
  live.getRange('A1:F46').format={font:{name:'Aptos',size:11,color:'#1A1F2C'},rowHeight:24,columnWidth:19,verticalAlignment:'center',numberFormat:'General'};
  live.showGridLines=true;
  live.getRange('A1:A46').format.columnWidth=12;
  live.getRange('B1:B46').format.columnWidth=32;
  live.getRange('C1:C46').format.columnWidth=20;
  live.getRange('D1:F46').format.columnWidth=17;
  live.freezePanes.unfreeze();
  const band=(row,text,fill='#0E1116')=>{
    live.mergeCells(`A${row}:F${row}`);
    live.getRange(`A${row}`).values=[[text]];
    live.getRange(`A${row}:F${row}`).format={fill,font:{name:'Aptos',size:14,bold:true,color:'#FFFFFF'},rowHeight:30};
  };
  band(1,'Live You Try It');
  for(const [row,text] of [[2,'Choose your own cells. Label inputs, enter values, and build formulas using cell references.'],[3,'Explain your result, then compare with the slide reveal. Use the blank space below each scenario.']]){
    live.mergeCells(`A${row}:F${row}`);live.getRange(`A${row}`).values=[[text]];
    live.getRange(`A${row}:F${row}`).format={wrapText:true,rowHeight:32};
  }
  for(const activity of modelData.activities){
    band(activity.headingRow,activity.concept+' — '+activity.title,'#4A7C5E');
    const facts=`A${activity.factsRow}:F${activity.factsRow+1}`;
    live.mergeCells(facts);live.getRange(`A${activity.factsRow}`).values=[[activity.scenario]];
    live.getRange(facts).format={wrapText:true,fill:'#FAF8F3',rowHeight:32,verticalAlignment:'center'};
  }
  // Preserve the existing optional reference card and challenge.
  // Display patterns are text, never formulas or named-range calculations.
  const ref=wb.worksheets.getItem('FormulaReferenceCard');
  for(let row=4;row<=11;row++){
    const text=ref.getRange(`B${row}`).values[0][0];
    if(typeof text==='string' && text.startsWith('='))ref.getRange(`B${row}`).values=[["'"+text]];
  }
  wb.recalculate();
  return wb;
}

if(process.argv[1]===fileURLToPath(import.meta.url)){
  const wb=await buildStarter();
  await (await SpreadsheetFile.exportXlsx(wb)).save(process.argv[2]||starterPath);
  console.log('Saved M04 model-building starter.');
}
