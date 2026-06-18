import { Workbook } from '@oai/artifact-tool';
const wb = Workbook.create();
for (const q of ['worksheet.getRange','range.format','range.style','range.font','range.fill','range.numberFormat','worksheet.charts','chart','freezePanes']) {
  try {
    const h = wb.help(q, { include: 'index,examples,notes', maxChars: 3000 });
    console.log('\n## '+q+'\n'+h.ndjson);
  } catch (e) { console.log('ERR', q, e.message); }
}
