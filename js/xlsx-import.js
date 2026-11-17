/** RepairFlow V29 — reader for ordinary .xlsx workbooks (Excel/Google Sheets exports).
 * Works in the browser without a CDN or a third-party dependency.
 * No macros are run and formula strings are never evaluated. ZIP methods 0 and 8.
 */
const td = new TextDecoder('utf-8');
const LIMIT_BYTES = 8 * 1024 * 1024;
const LIMIT_XML = 32 * 1024 * 1024;

function xml(bytes, filename) {
  const parsed = new DOMParser().parseFromString(td.decode(bytes), 'application/xml');
  if (parsed.getElementsByTagName('parsererror').length) throw new Error('Excel có XML không hợp lệ: ' + filename);
  return parsed;
}
function tags(element, name) { return [...element.getElementsByTagNameNS('*',name)]; }
function columnIndex(reference) {
  const letters = String(reference || '').match(/^[A-Za-z]+/)?.[0]?.toUpperCase() || '';
  return [...letters].reduce((n, ch)=>n*26+ch.charCodeAt(0)-64,0)-1;
}
async function unzipParts(arrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer);
  const view = new DataView(arrayBuffer);
  let end = -1;
  for (let p=bytes.length-22; p>=Math.max(0,bytes.length-65557); p--) {
    if (view.getUint32(p,true) === 0x06054b50) {end=p;break;}
  }
  if(end<0) throw new Error('Tệp không có cấu trúc XLSX/ZIP hợp lệ');
  const n=view.getUint16(end+10,true), start=view.getUint32(end+16,true);
  if(n>2000)throw new Error('File Excel chứa quá nhiều thành phần');
  const records=new Map();
  let offset=start;
  for(let i=0;i<n;i++){
    if(view.getUint32(offset,true)!==0x02014b50)throw new Error('Danh mục ZIP bị lỗi');
    const flags=view.getUint16(offset+8,true), method=view.getUint16(offset+10,true);
    const size=view.getUint32(offset+20,true), expanded=view.getUint32(offset+24,true);
    const len=view.getUint16(offset+28,true), extra=view.getUint16(offset+30,true), comment=view.getUint16(offset+32,true);
    const at=view.getUint32(offset+42,true), name=td.decode(bytes.subarray(offset+46,offset+46+len));
    if(flags&1)throw new Error('Không hỗ trợ file Excel được mã hóa mật khẩu');
    if(name.startsWith('xl/') && /\.xml$|\.rels$/i.test(name))records.set(name,{method,size,expanded,at});
    offset+=46+len+extra+comment;
  }
  async function get(name){
    const info=records.get(name);
    if(!info)return null;
    if(info.expanded>LIMIT_XML)throw new Error('Thành phần Excel quá lớn');
    const at=info.at;
    if(view.getUint32(at,true)!==0x04034b50)throw new Error('Dữ liệu ZIP bị lỗi');
    const dataStart=at+30+view.getUint16(at+26,true)+view.getUint16(at+28,true);
    const data=bytes.slice(dataStart,dataStart+info.size);
    if(info.method===0)return data;
    if(info.method!==8)throw new Error('Định dạng nén Excel không được hỗ trợ');
    if(!('DecompressionStream' in window))throw new Error('Trình duyệt không hỗ trợ giải nén Excel; hãy dùng Chrome hoặc Edge mới');
    const stream=new Blob([data]).stream().pipeThrough(new DecompressionStream('deflate-raw'));
    const output=new Uint8Array(await new Response(stream).arrayBuffer());
    if(output.length>LIMIT_XML)throw new Error('File Excel sau giải nén quá lớn');
    return output;
  }
  return get;
}
function findFirstWorksheet(workbook, relationships) {
  const sheet=tags(workbook,'sheet')[0];
  if(!sheet)throw new Error('Excel không có worksheet');
  const id=sheet.getAttribute('r:id')||sheet.getAttributeNS('http://schemas.openxmlformats.org/officeDocument/2006/relationships','id');
  const rel=tags(relationships,'Relationship').find(x=>x.getAttribute('Id')===id);
  if(!rel)throw new Error('Không tìm được worksheet đầu tiên trong Excel');
  const target=rel.getAttribute('Target')||'';
  if(target.startsWith('/'))return target.slice(1);
  const parts=['xl',...target.split('/')];
  const cleaned=[];
  for(const part of parts){if(part==='..')cleaned.pop();else if(part&&part!=='.')cleaned.push(part);}
  return cleaned.join('/');
}
/** Returns actual worksheet rows with original Excel row numbers. */
export async function readXlsxRows(file){
  if(!file||!(/\.xlsx$/i.test(file.name)))throw new Error('Vui lòng chọn file Excel .xlsx');
  if(file.size>LIMIT_BYTES)throw new Error('File Excel lớn hơn 8 MB');
  const get=await unzipParts(await file.arrayBuffer());
  const w=await get('xl/workbook.xml'), rels=await get('xl/_rels/workbook.xml.rels');
  if(!w||!rels)throw new Error('Thiếu thông tin workbook trong Excel');
  const path=findFirstWorksheet(xml(w,'workbook.xml'),xml(rels,'workbook.xml.rels'));
  const content=await get(path);
  if(!content)throw new Error('Không tìm được worksheet dữ liệu');
  const sheet=xml(content,path);
  const stringsDoc=await get('xl/sharedStrings.xml');
  const strings=stringsDoc?tags(xml(stringsDoc,'sharedStrings.xml'),'si').map(si=>tags(si,'t').map(t=>t.textContent||'').join('')):[];
  const output=[];
  for(const row of tags(sheet,'row')){
    const number=Number(row.getAttribute('r'))||output.length+1;
    const values=[];
    for(const cell of [...row.children].filter(x=>x.localName==='c')){
      const pos=columnIndex(cell.getAttribute('r'));
      if(pos<0||pos>300)continue;
      const type=cell.getAttribute('t');
      const raw=tags(cell,'v')[0]?.textContent || '';
      let value='';
      if(type==='s')value=strings[Number(raw)]||'';
      else if(type==='inlineStr')value=tags(cell,'t').map(t=>t.textContent||'').join('');
      else if(type==='b')value=raw==='1'?'TRUE':'FALSE';
      else if(type==='n'||(!type&&raw!==''))value=raw;
      else value=raw;
      values[pos]=String(value).trim();
    }
    if(values.some(x=>x))output.push({number,values});
    if(output.length>1000)throw new Error('Chỉ hỗ trợ tối đa 1.000 dòng Excel để kiểm tra');
  }
  return output;
}
