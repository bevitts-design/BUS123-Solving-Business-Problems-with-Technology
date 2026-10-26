// Keep the separately linked activity workbook's Live You Try It tab aligned
// with the Canva deck and follow-along. Preserve its challenge and reference card.
import fs from 'node:fs/promises';
import path from 'node:path';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {FileBlob,SpreadsheetFile}=await import(process.env.BUS123_ARTIFACT_MODULE||require.resolve('@oai/artifact-tool'));
const key=process.argv.includes('--instructor');
const input=key?process.env.BUS123_ACTIVITY_KEY_SOURCE:new URL('../bus123-math-m08-l01-starter.xlsx',import.meta.url).pathname;
const output=key?process.env.BUS123_ACTIVITY_KEY_OUTPUT:input;
if(!input||!output)throw new Error('Private key input and output paths required.');
const wb=await SpreadsheetFile.importXlsx(await FileBlob.load(input));
const live=wb.worksheets.getItem('Live You Try It');
const text=(sheet,cell,value)=>sheet.getRange(cell).values=[[value]];
text(live,'A1','Live You Try It · Checkpoints B → A → C');
text(live,'A2','Use current Canva page positions: B 16–17; A 19–20; C 25–26. Build the yellow cells, then explain below.');
live.getRange('B6:B10').values=[[19],[19],[19],[19],[19]];
live.getRange('B12:B14').values=[[16],[16],[16]];
live.getRange('B16:B18').values=[[25],[25],[25]];
live.getRange('D5:F5').values=[['Days / amount','Year basis / rate','Years / linked value']];
live.getRange('D5:F5').format.wrapText=true;
live.getRange('A5:I5').format.rowHeight=68;
text(live,'A20','Progress');
text(live,'A11','Checkpoint B · $18,500 loan · 6.2% annual simple interest · 8 months');
text(live,'A15','Checkpoint C · $30,000 future receipt · 6.5% annual compounding · 2 years');
text(live,'C16','Signed present outflow');text(live,'C17','Positive present-value magnitude');
live.getRange('F16').values=[[2]];live.getRange('F18').values=[[2]];
for(const [dest,src] of [['F9','G8'],['E14','G13'],['D17','G16'],['D18','G16']])live.getRange(dest).formulas=[[`=IF(${src}="","",${src})`]];
for(const addr of ['F14','E17','F17']){live.getRange(addr).values=[[null]];live.getRange(addr).format.fill='#FFFFFF';}
live.getRange('F9').format.fill='#DDEBF7';
text(live,'I14','Original principal plus the linked interest amount.');
text(live,'I16','Use PV with the positive future receipt.');
text(live,'I17','Reverse the sign of the linked raw PV.');
text(live,'I18','Use the signed PV linked in D18.');
live.getRange('H14').formulas=[['=IF(G14="","Enter a formula using cell references",IF(ABS(G14-(D14+E14))<0.05,"Correct value - principal plus interest","Try again - include the original principal"))']];
live.getRange('H16').formulas=[['=IF(G16="","Enter a formula using cell references",IF(ABS(G16-PV(E16,F16,0,D16))<0.05,"Correct signed compound PV","Try again - check the rate, years, and sign"))']];
live.getRange('H17').formulas=[['=IF(G17="","Enter a formula using cell references",IF(ABS(G17-(-D17))<0.05,"Correct positive PV magnitude","Try again - reverse the raw PV sign"))']];
live.getRange('H18').formulas=[['=IF(G18="","Enter a formula using cell references",IF(ABS(G18-FV(E18,F18,0,D18))<0.05,"Correct round trip","Try again - use the signed PV result"))']];
for(const [row,label] of [[25,'A | Why does ordinary interest exceed exact interest?'],[30,'B | Distinguish principal, interest, and total repayment.'],[35,'C | Explain the negative PV and the FV verification.']]){
 live.getRange(`B${row}:G${row}`).merge();text(live,`B${row}`,label);
 live.getRange(`B${row}:G${row}`).format={fill:'#4A7C5E',font:{bold:true,color:'#FFFFFF'},wrapText:true,rowHeight:34};
 live.getRange(`B${row+1}:G${row+3}`).merge();live.getRange(`B${row+1}:G${row+3}`).format={fill:'#FFF2CC',wrapText:true,verticalAlignment:'top',rowHeight:28};
}
const start=wb.worksheets.getItem('START HERE');
text(start,'B17','Checkpoint B (Canva 16–17): G12:G14. A (19–20): G6:G10. C (25–26): G16:G18. Record explanations at B31, B26, and B36.');
if(key){
 const solutions=JSON.parse(await fs.readFile(process.env.BUS123_SOLUTION_SOURCE,'utf8'))['Live You Try It'];
 for(const addr of ['G6','G7','G8','G9','G10','G12','G13','G14','G16','G17','G18','B26','B31','B36']){
  const value=solutions[addr];if(value.startsWith('='))live.getRange(addr).formulas=[[value]];else text(live,addr,value);
 }
}
wb.recalculate();
const preview=await wb.render({sheetName:'Live You Try It',range:'A1:I38',scale:1.2});
const previewPath=key?path.join(path.dirname(output),'Activity-Live-You-Try-It.png'):new URL('../../../outputs/m08-follow-along/Activity-Live-You-Try-It.png',import.meta.url).pathname;
await fs.writeFile(previewPath,new Uint8Array(await preview.arrayBuffer()));
await (await SpreadsheetFile.exportXlsx(wb)).save(output);
console.log('Updated Live You Try It and START HERE; challenge and reference card preserved.');
