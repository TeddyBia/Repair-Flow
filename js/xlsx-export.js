/**
 * RepairFlow · Excel XLSX exporter (Office Open XML, UTF-8, ZIP "store" method).
 * No CDN / no dependency. Spreadsheet values are written as inline strings to
 * prevent both Vietnamese character corruption and spreadsheet-formula injection.
 */
const encoder = new TextEncoder();
const XML_HEADER = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>';
const ns = 'http://schemas.openxmlformats.org/spreadsheetml/2006/main';
const relns = 'http://schemas.openxmlformats.org/officeDocument/2006/relationships';

function esc(input) {
  return String(input == null ? '' : input)
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uFFFE\uFFFF]/g, '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}
function colName(index) {
  let n = index + 1, s = '';
  while (n) { n--; s = String.fromCharCode(65 + n % 26) + s; n = Math.floor(n / 26); }
  return s;
}
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i=0; i<256; ++i) {
    let c = i;
    for (let j=0; j<8; ++j) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();
function crc32(bytes) {
  let crc = 0xffffffff;
  for (const b of bytes) crc = CRC_TABLE[(crc ^ b) & 255] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}
function put16(view, at, value) { view.setUint16(at, value, true); }
function put32(view, at, value) { view.setUint32(at, value >>> 0, true); }
function zipStore(files) {
  const local = [], central = [];
  let offset = 0, centralLength = 0;
  for (const [fileName, xml] of files) {
    const name = encoder.encode(fileName), data = encoder.encode(xml), check = crc32(data);
    const l = new Uint8Array(30 + name.length + data.length), lv = new DataView(l.buffer);
    put32(lv,0,0x04034b50); put16(lv,4,20); put16(lv,6,0x0800);
    put16(lv,8,0); put16(lv,10,0); put16(lv,12,0);
    put32(lv,14,check); put32(lv,18,data.length); put32(lv,22,data.length);
    put16(lv,26,name.length); put16(lv,28,0);
    l.set(name,30); l.set(data,30+name.length); local.push(l);
    const c = new Uint8Array(46 + name.length), cv = new DataView(c.buffer);
    put32(cv,0,0x02014b50);put16(cv,4,20);put16(cv,6,20);put16(cv,8,0x0800);
    put16(cv,10,0);put16(cv,12,0);put16(cv,14,0);
    put32(cv,16,check);put32(cv,20,data.length);put32(cv,24,data.length);
    put16(cv,28,name.length);put16(cv,30,0);put16(cv,32,0);
    put16(cv,34,0);put16(cv,36,0);put32(cv,38,0);put32(cv,42,offset);
    c.set(name,46); central.push(c);
    offset += l.length; centralLength += c.length;
  }
  if (files.length > 65535 || offset + centralLength > 0xffffffff) throw new Error('Quá nhiều dữ liệu cho file Excel');
  const e = new Uint8Array(22), ev = new DataView(e.buffer);
  put32(ev,0,0x06054b50);put16(ev,4,0);put16(ev,6,0);
  put16(ev,8,files.length);put16(ev,10,files.length);
  put32(ev,12,centralLength);put32(ev,16,offset);put16(ev,20,0);
  const output = new Uint8Array(offset + centralLength + e.length);
  let pos = 0;
  for (const block of [...local,...central,e]) {output.set(block,pos);pos+=block.length;}
  return output;
}
/** V27: XLSX nhiều worksheet, màu gần giống bảng Google Sheets trong hệ thống.
 * Ghi chú: API /tasks không mang định dạng ô gốc từ Google Sheets;
 * màu xuất theo trạng thái, không phải bản sao mọi định dạng thủ công trên cloud.
 */
function stylesXml() {
  const fillColors = [
    'FFFFFF', // 2 plain
    'FFF000', // 3: Google Sheet yellow header
    'F8FAFD', // 4: zebra
    'FFF0D1', // 5: pending orange
    'FCE1E4', // 6: rejected red
    'FDE2E5', // 7: open red
    'DCFCE7', // 8: done green
    '2F63D7', // 9 title dashboard
    'B46B0B', // 10 title pending
    'C83E59', // 11 title open
    '138566', // 12 title completed
    '7452C4', // 13 title history
    '9F2443', // 14 title alarm
    '263E6B', // 15 title all
    'FFDFB8', // 16 pending > 48
    'FFD4DA', // 17 open > 48
  ];
  const fills = '<fill><patternFill patternType="none"/></fill>'
    + '<fill><patternFill patternType="gray125"/></fill>'
    + fillColors.map(color=>`<fill><patternFill patternType="solid"><fgColor rgb="FF${color}"/><bgColor indexed="64"/></patternFill></fill>`).join('');
  const fonts = [
    '<font><sz val="10"/><name val="Aptos"/><color rgb="FF23344F"/></font>',
    '<font><b/><sz val="10"/><name val="Aptos"/><color rgb="FF27334C"/></font>',
    '<font><b/><sz val="18"/><name val="Aptos Display"/><color rgb="FFFFFFFF"/></font>',
    '<font><i/><sz val="10"/><name val="Aptos"/><color rgb="FF5D6C85"/></font>',
  ];
  const xfs=[];
  const add=(font,fill,border=1,alignment='left')=>{
    xfs.push(`<xf numFmtId="0" fontId="${font}" fillId="${fill}" borderId="${border}" xfId="0" applyAlignment="1"><alignment horizontal="${alignment}" vertical="center" wrapText="1"/></xf>`);
    return xfs.length-1;
  };
  // styles: 0 body, 1 header, 2 zebra, 3 pending, 4 rejected, 5 open, 6 done,
  // 7 subtitle, 8.. title themes, 14 dark pending, 15 dark red
  add(0,2);add(1,3);add(0,4);add(0,5);add(0,6);add(0,7);add(0,8);
  add(3,4,0);
  for(let fill=9;fill<=15;fill++)add(2,fill,0);
  add(0,16);add(0,17);
  return XML_HEADER+`<styleSheet xmlns="${ns}">`
    + `<fonts count="${fonts.length}">${fonts.join('')}</fonts><fills count="${fills.length}">${fills}</fills>`
    + '<borders count="2"><border><left/><right/><top/><bottom/><diagonal/></border>'
    + '<border><left style="thin"><color rgb="FFD6E1ED"/></left><right style="thin"><color rgb="FFD6E1ED"/></right><top style="thin"><color rgb="FFD6E1ED"/></top><bottom style="thin"><color rgb="FFD6E1ED"/></bottom><diagonal/></border></borders>'
    + '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>'
    + `<cellXfs count="${xfs.length}">${xfs.join('')}</cellXfs>`
    + '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>';
}
const titleStyle = {all:14,open:10,pending:9,done:11,history:12,alarm:13,charts:8};
function rowStyle(row, index, sheet) {
  const status = (col) => String(row[col] ?? '').trim().toLowerCase();
  if(sheet.kind==='alarm'){
    const label=status(0);
    if(label.includes('chờ duyệt quá 48'))return 14;
    if(label.includes('chờ duyệt'))return 3;
    if(label.includes('trên 72')||label.includes('trên 48'))return 15;
    return 5;
  }
  if(['all','open','pending','done','charts'].includes(sheet.kind)){
    // exact columns, not general substring search through free text
    const approvalAt=sheet.headers.findIndex(h=>String(h).toLowerCase()==='rf_approvalstatus');
    const taskAt=sheet.headers.findIndex(h=>String(h).toLowerCase()==='trạng thái công việc');
    const approval=approvalAt>=0?status(approvalAt):'';
    const taskStatus=taskAt>=0?status(taskAt):'';
    if(approval==='rejected')return 4;
    if(approval==='pending_completion')return 6; // Xanh lá nhạt
    if(approval==='pending')return 3;
    if(taskStatus==='hoàn thành')return 6;
    if(taskStatus==='chưa hoàn thành')return 5;
  }
  return index%2 ? 2 : 0;
}
function sheetXml(sheet) {
  const {headers,rows}=sheet;
  const n=headers.length,end=`${colName(n-1)}${rows.length+4}`;
  const widths=headers.map((h,i)=>{
    const name=String(h).toLowerCase();
    const w=/nội dung|việc còn|đã sửa chữa/i.test(name)?44
      :/email|link|rf_id/i.test(name)?34
      :/thời gian|ngày gửi|bắt đầu/i.test(name)?26
      :/vị trí|tài khoản/i.test(name)?23
      :/trạng thái|bộ đếm|hành động/i.test(name)?23
      :i===0?13:20;
    return `<col min="${i+1}" max="${i+1}" width="${w}" customWidth="1"/>`;
  }).join('');
  function cell(value,ref,sty) {
    const numeric=typeof value==='number'&&Number.isFinite(value);
    return numeric?`<c r="${ref}" s="${sty}"><v>${value}</v></c>`
      :`<c r="${ref}" s="${sty}" t="inlineStr"><is><t xml:space="preserve">${esc(value)}</t></is></c>`;
  }
  const title=sheet.title||sheet.sheetName||'RepairFlow',subtitle=sheet.subtitle||'Báo cáo công việc · RepairFlow';
  const a1=cell(title,'A1',titleStyle[sheet.kind]??8);
  const a2=cell(subtitle,'A2',7);
  const head=headers.map((v,i)=>cell(v,`${colName(i)}4`,1)).join('');
  const body=rows.map((r,i)=>{
    const style=rowStyle(r,i,sheet);
    return `<row r="${i+5}" ht="34" customHeight="1">${headers.map((_,j)=>cell(r[j],`${colName(j)}${i+5}`,style)).join('')}</row>`;
  }).join('');
  return XML_HEADER+`<worksheet xmlns="${ns}"><dimension ref="A1:${end}"/>`
    + `<sheetViews><sheetView workbookViewId="0"><pane ySplit="4" topLeftCell="A5" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>`
    + `<sheetFormatPr defaultRowHeight="22"/><cols>${widths}</cols><sheetData>`
    + `<row r="1" ht="48" customHeight="1">${a1}</row>`
    + `<row r="2" ht="28" customHeight="1">${a2}</row>`
    + `<row r="3" ht="10" customHeight="1"/>`
    + `<row r="4" ht="36" customHeight="1">${head}</row>${body}</sheetData>`
    // ECMA-376 CT_Worksheet: autoFilter must appear BEFORE mergeCells.
    // Excel Desktop repairs the file when the two nodes are reversed.
    + `<autoFilter ref="A4:${end}"/>`
    + (n>1 ? `<mergeCells count="2"><mergeCell ref="A1:${colName(n-1)}1"/><mergeCell ref="A2:${colName(n-1)}2"/></mergeCells>` : '')
    + '</worksheet>';
}
export function buildXlsxBuffer(input) {
  const rawSheets=Array.isArray(input.sheets)&&input.sheets.length ? input.sheets : [input];
  if(rawSheets.some(sheet=>!Array.isArray(sheet.headers)||!sheet.headers.length||!Array.isArray(sheet.rows)))
    throw new Error('Dữ liệu Excel không hợp lệ');
  const unique=new Set();
  const sheets=rawSheets.map((sheet,i)=>{
    let base=String(sheet.sheetName||`Sheet ${i+1}`).replace(/[\\/*?:\[\]]/g,'').slice(0,31)||`Sheet ${i+1}`;
    let name=base,k=2;
    while(unique.has(name.toLowerCase()))name=(base.slice(0,27)+' '+k++).slice(0,31);
    unique.add(name.toLowerCase());return {...sheet,sheetName:name};
  });
  const files=[
    ['[Content_Types].xml',XML_HEADER+'<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
      + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>'
      + '<Default Extension="xml" ContentType="application/xml"/>'
      + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>'
      + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>'
      + sheets.map((_,i)=>`<Override PartName="/xl/worksheets/sheet${i+1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('')
      + '<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>'
      + '<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>'],
    ['_rels/.rels',XML_HEADER+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>'
      + '<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" Target="docProps/core.xml"/>'
      + '<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>'],
    ['xl/workbook.xml',XML_HEADER+`<workbook xmlns="${ns}" xmlns:r="${relns}"><sheets>`
      + sheets.map((s,i)=>`<sheet name="${esc(s.sheetName)}" sheetId="${i+1}" r:id="rId${i+1}"/>`).join('')+'</sheets></workbook>'],
    ['xl/_rels/workbook.xml.rels',XML_HEADER+'<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'
      + sheets.map((_,i)=>`<Relationship Id="rId${i+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i+1}.xml"/>`).join('')
      + `<Relationship Id="rId${sheets.length+1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`+'</Relationships>'],
    ['xl/styles.xml',stylesXml()],
    ...sheets.map((sheet,i)=>[`xl/worksheets/sheet${i+1}.xml`,sheetXml(sheet)]),
    ['docProps/core.xml',XML_HEADER+'<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/"><dc:creator>RepairFlow</dc:creator></cp:coreProperties>'],
    ['docProps/app.xml',XML_HEADER+'<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties"><Application>RepairFlow</Application></Properties>'],
  ];
  return zipStore(files);
}
export function downloadXlsx({fileName,...input}) {
  const bytes=buildXlsxBuffer(input);
  const url=URL.createObjectURL(new Blob([bytes],{type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}));
  const link=document.createElement('a');link.href=url;link.download=fileName||'RepairFlow.xlsx';
  document.body.appendChild(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),2500);
}
