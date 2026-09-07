// Run a copy from a temporary directory linked to the bundled runtime node_modules.
// Usage: node bus123-intro-m01-l03-starter.mjs OUTPUT_DIRECTORY
// Student-only source. Correction cards and instructor answers live privately.
import fs from 'node:fs/promises';
import path from 'node:path';
import { Workbook, SpreadsheetFile } from '@oai/artifact-tool';

const out = process.argv[2];
if (!out) throw new Error('Supply an output directory.');
await fs.mkdir(out, { recursive: true });
const companies = [
  {tab:'Tidal Goods', name:'Tidal Goods', about:'Retail business selling lifestyle products.', headers:['Product code','Product','Units on shelf'], rows:[['TG101','Canvas tote',18],['TG102','Travel mug',6],['TG103','Beach towel',12]], question:'Which product has the fewest units? Recommend a stock check.'},
  {tab:'Meridian Advisory', name:'Meridian Advisory Group', about:'Financial services firm preparing for client meetings.', headers:['Meeting code','Meeting topic','Documents missing'], rows:[['MAG101','Savings plan',2],['MAG102','Business loan',5],['MAG103','Investment review',3]], question:'Which meeting is missing the most documents? Recommend follow-up.'},
  {tab:'Anchor & Oak', name:'Anchor & Oak Events', about:'Event planning business preparing seating arrangements.', headers:['Event code','Event','Expected guests'], rows:[['AO101','Alumni breakfast',45],['AO102','Team celebration',70],['AO103','Community reception',60]], question:'Which event needs the most seats? Include the guest count.'},
  {tab:'Harborside Medical', name:'Harborside Medical Center', about:'Healthcare organization checking ordinary office supplies.', headers:['Department code','Department','Paper boxes available'], rows:[['HMC101','Reception',9],['HMC102','Billing',4],['HMC103','Scheduling',7]], question:'Which department has the fewest paper boxes? Recommend a supply check.'}
];
const wb = Workbook.create();
const ink='#0E1116', sage='#4A7C5E', yellow='#FFD966', paper='#FAF8F3';
function put(s,cell,text){s.getRange(cell).values=[[text]];}
function input(s,r){s.getRange(r).format.fill=yellow;s.getRange(r).format.borders={preset:'all',style:'thin',color:'#B8843D'};}
function band(s,r){s.getRange(r).format={fill:sage,font:{name:'DM Sans',size:11,bold:true,color:'#FFFFFF'},wrapText:true};}
function line(s,r,text){s.mergeCells(r);put(s,r.split(':')[0],text);}
function base(name,last){const s=wb.worksheets.add(name);s.getRange(`A1:G${last}`).format={font:{name:'DM Sans',size:11,color:ink},rowHeight:27,verticalAlignment:'center'}; for(const [col,w] of [['A',22],['B',27],['C',25],['D',3],['E',22],['F',27],['G',25]])s.getRange(`${col}1:${col}${last}`).format.columnWidth=w;return s;}
const team=base('START HERE',38);
line(team,'A1:G1','Team Handoff | BUS123');team.getRange('A1').format.font={name:'Bodoni Moda',size:18,bold:true};
line(team,'A2:G2','INTRO M01-L03 • 35-minute team activity + 3-minute individual exit check');
line(team,'A3:G3','Goal: enter and edit cells, save a workbook, share access, and verify a teammate’s update.');
line(team,'A5:G5','1  SAVE AND SHARE • 7 minutes');band(team,'A5:G5');
line(team,'A6:G6','Choose one file owner. Save one team copy in the owner’s college OneDrive: BUS123 / INTRO / M01.');
line(team,'A7:G7','Activity filename: Group##_BUS123_INTRO_M01_L03.xlsx (replace ## with your assigned group number).');
line(team,'A8:G8','Use Share to give teammates editing access using their college accounts. Everyone opens the same shared link.');
line(team,'A9:G9','Each person types their own name below. If you cannot edit, ask the owner to check your access.');
team.getRange('A11:C11').values=[['Company worksheet','Student name','Reopened and checked']];band(team,'A11:C11');
for(let i=0;i<4;i++)put(team,`A${12+i}`,companies[i].tab);
input(team,'B12:C15');
line(team,'E11:G11','Your shared file');band(team,'E11:G11');
put(team,'E12','Group number');input(team,'F12');put(team,'E13','File owner');input(team,'F13');
line(team,'E14:G14','Yellow cells are for your entries.');line(team,'E15:G15','Leave the original data cards unchanged.');
line(team,'A17:G17','2  ENTER AND DECIDE • 10 minutes');band(team,'A17:G17');
line(team,'A18:G18','Open your company tab. Type the original data card into A4:C6, one cell at a time. Use Tab and Enter to move.');
line(team,'A19:G19','Select B4. Locate its address in the Name Box and its text in the Formula Bar. Add your name in B8.');
line(team,'A20:G20','Read the decision question. Type your first answer in B11. No formulas or student formatting are needed.');
line(team,'A22:G22','3  UPDATE AND HAND OFF • 10 minutes');band(team,'A22:G22');
line(team,'A23:G23','Wait for your instructor’s correction card. Replace the original value in the existing entry cell; do not add a row.');
line(team,'A24:G24','Ask the next company’s student to check your update: Tidal → Meridian → Anchor & Oak → Harborside → Tidal.');
line(team,'A25:G25','The checker reads the correction card and completes B17:B19 on your sheet. Then you write a revised answer in B14.');
line(team,'A27:G27','4  SAVE AND REOPEN • 5 minutes');band(team,'A27:G27');
line(team,'A28:G28','Wait until changes finish saving. Everyone closes and reopens the shared workbook from its link or OneDrive.');
line(team,'A29:G29','Confirm your update and your teammate’s check are present. Type your initials in your START HERE column C cell.');
line(team,'A30:G30','Show the workbook to your instructor. Share its link through the class’s designated submission method if requested.');
line(team,'A32:G32','5  INDIVIDUAL EXIT CHECK • 3 minutes');band(team,'A32:G32');
line(team,'A33:G33','Create a separate blank workbook. Enter your name in A1 and your company name in A2.');
line(team,'A34:G34','Save in your own college OneDrive: BUS123 / INTRO / M01. Use LastName_FirstName_BUS123_Module01.xlsx.');
line(team,'A35:G35','If that name already exists, add _ExitCheck. Close and reopen it; show your instructor the file name and folder.');
line(team,'A37:G37','All business records are fictional classroom data. Workbook = saved file; worksheet = one tab; cell = a grid location.');
line(team,'A38:G38','OneDrive sharing reference: support.microsoft.com/en-us/excel/co-author-a-workbook');
team.getRange('A38:G38').format.font={size:10,color:'#4A5567'};
for(const c of companies){
  const s=base(c.tab,24);
  line(s,'A1:G1',c.name+' | Team Handoff');s.getRange('A1').format.font={name:'Bodoni Moda',size:18,bold:true};
  line(s,'A2:C2','YOUR WORKING ENTRIES');line(s,'E2:G2','ORIGINAL DATA CARD • type into A4:C6');
  s.getRange('A3:C3').values=[c.headers];s.getRange('E3:G3').values=[c.headers];band(s,'A3:C3');band(s,'E3:G3');
  input(s,'A4:C6');s.getRange('E4:G6').values=c.rows;s.getRange('E4:G6').format.fill=paper;
  s.getRange('C4:C6').setNumberFormat('0');s.getRange('G4:G6').setNumberFormat('0');
  put(s,'A8','Entered by');input(s,'B8');
  line(s,'E8:G8',c.about);s.getRange('E8:G8').format.wrapText=true;s.getRange('A8:G8').format.rowHeight=38;
  line(s,'A10:G10','FIRST DECISION • '+c.question);band(s,'A10:G10');s.getRange('A10:G10').format.rowHeight=32;
  put(s,'A11','First answer');input(s,'B11');s.getRange('B11').format.wrapText=true;s.getRange('A11:G11').format.rowHeight=65;
  line(s,'E11:G11','Write a short sentence in B11 before the correction arrives.');s.getRange('E11:G11').format.wrapText=true;
  line(s,'A13:G13','AFTER THE UPDATE • answer the same question using the corrected entries');band(s,'A13:G13');
  put(s,'A14','Revised answer');input(s,'B14');s.getRange('B14').format.wrapText=true;s.getRange('A14:G14').format.rowHeight=65;
  line(s,'E14:G14','Wait for the correction card. Change the working entry, keep B11, and put your new answer in B14.');s.getRange('E14:G14').format.wrapText=true;
  line(s,'A16:C16','TEAMMATE CHECK • another person completes this');band(s,'A16:C16');
  for(const [r,t] of [[17,'Checked by (initials)'],[18,'Cell address checked'],[19,'Updated value seen']]){put(s,`A${r}`,t);input(s,`B${r}`);}
  line(s,'E17:G17','Read the correction card and select the changed cell.');line(s,'E18:G18','Use the Name Box to identify its address.');line(s,'E19:G19','Compare the value with the card before adding your initials.');
  line(s,'A21:G21','Finish: reopen the shared workbook, confirm this update and check, then initial your START HERE row.');
  line(s,'A23:G23','The original data card is a reference. Your working entries show the latest information.');
  line(s,'A24:G24','Fictional classroom data • No formulas needed • Use the yellow cells for your work');
}
wb.recalculate();
console.log((await wb.inspect({kind:'region',sheetId:'Tidal Goods',range:'A3:C6',maxChars:700})).ndjson);
const file=await SpreadsheetFile.exportXlsx(wb);await file.save(path.join(out,'bus123-intro-m01-l03-starter.xlsx'));
for(const s of wb.worksheets.items){const blob=await wb.render({sheetName:s.name,range:s.name==='START HERE'?'A1:G38':'A1:G24',scale:1.5,format:'png'});await fs.writeFile(path.join(out,s.name.replaceAll(/[^a-z0-9]/gi,'-')+'.png'),new Uint8Array(await blob.arrayBuffer()));}
console.log('Exported starter and five sheet previews.');
