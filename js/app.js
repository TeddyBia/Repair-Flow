/* RepairFlow V8 dashboard - consolidated modules. Editing config.js is sufficient for API URL changes. */
import { CONFIG } from './config.js';
import * as AUTH from './auth.js';

const MOCK = (() => {
/**
 * REPAIRFLOW · MOCK DATA FACTORY
 * Deterministic, realistic-looking maintenance records relative to today.
 * No Excel or backend is required for the demo.
 */

const examples = [
  ['Line 01 · Motor M01', 'Động cơ băng tải phát tiếng ồn bất thường', 'Gia cố gá đỡ và kiểm tra độ rung', 'Thay bạc đạn và căn chỉnh đồng trục'],
  ['Line 02 · Sensor S02', 'Cảm biến nhận diện chai hoạt động không ổn định', 'Vệ sinh đầu đọc và điều chỉnh khoảng cách', 'Thay cảm biến mới, kiểm tra lại tín hiệu'],
  ['Khu CIP · Bơm P-103', 'Phát hiện rò rỉ nước ở phớt bơm CIP', 'Siết lại khớp nối, bổ sung gioăng tạm', 'Thay phớt bơm theo kế hoạch bảo trì'],
  ['Line 03 · Van khí nén', 'Van đóng mở chậm, có hiện tượng rò khí', 'Điều chỉnh áp suất và siết đầu nối', 'Kiểm tra và thay bộ seal van'],
  ['Tủ điện MCC-02', 'Contactor phát nhiệt bất thường khi chạy tải', 'Vệ sinh tiếp điểm, siết lại đầu dây', 'Thay contactor và đo dòng tải'],
  ['Line 04 · Conveyor B05', 'Băng tải bị lệch khi vận hành liên tục', 'Chỉnh con lăn và tăng chỉnh độ căng', 'Căn chỉnh lại hệ thống dẫn hướng'],
  ['Khu đóng gói · Servo 01', 'Trục servo báo lỗi quá tải ngắt quãng', 'Reset lỗi và giảm tốc độ vận hành', 'Kiểm tra encoder và thông số driver'],
  ['Trạm khí nén · Air-02', 'Áp suất khí cấp về dây chuyền sụt giảm', 'Cô lập điểm rò và điều chỉnh bộ điều áp', 'Xử lý triệt để mối nối và kiểm tra lưu lượng'],
  ['Line 05 · Photo Sensor', 'Đếm sản phẩm bị sai lệch sau thay khuôn', 'Căn lại vị trí mắt đọc', 'Đánh giá vị trí gắn cố định'],
  ['Kho lạnh · AHU-01', 'Nhiệt độ cấp gió dao động lớn', 'Vệ sinh lưới lọc và hiệu chỉnh thermostat', 'Kiểm tra van tiết lưu và dàn trao đổi nhiệt'],
  ['Line 06 · HMI Panel', 'Màn hình HMI phản hồi chậm tại một số nút', 'Khởi động lại và xóa cảnh báo', 'Kiểm tra màn cảm ứng và cáp truyền thông'],
  ['Hệ thống nước RO', 'Chênh áp qua cụm lọc tăng cao', 'Thực hiện xả rửa ngược tạm thời', 'Thay lõi lọc và đánh giá chất lượng nước'],
  ['Line 01 · VFD-03', 'Biến tần báo quá dòng trong giai đoạn tăng tốc', 'Tăng thời gian ramp và kiểm tra tải cơ', 'Kiểm tra motor và đối chiếu thông số VFD'],
  ['Khu tiện ích · Cooling Tower', 'Quạt giải nhiệt rung khi đạt tốc độ cao', 'Cân chỉnh tạm chân đế quạt', 'Kiểm tra ổ bi và cân bằng cánh quạt'],
  ['Line 07 · Barcode Reader', 'Đầu đọc mã vạch nhận tín hiệu chập chờn', 'Vệ sinh kính đọc và chỉnh góc quét', 'Kiểm tra và thay dây tín hiệu'],
  ['Khu xử lý nước thải', 'Bơm tuần hoàn không giữ được lưu lượng', 'Xả khí đường ống và vệ sinh lọc rác', 'Kiểm tra cánh bơm và thay thế phụ tùng'],
];

const workers = [
  'Nguyễn Văn An', 'Trần Minh Khoa', 'Lê Quốc Bảo', 'Phạm Thanh Bình',
  'Võ Hoàng Phúc', 'Đặng Văn Nam', 'Huỳnh Quốc Thịnh', 'Ngô Tuấn Kiệt',
  'Bùi Thanh Sơn', 'Đỗ Minh Huy', 'Nguyễn Nhật Long', 'Trần Hữu Tâm',
];

const HOUR = 60 * 60 * 1_000;

function makeMockTasks() {
  const now = Date.now();
  const tasks = [];

  for (let index = 0; index < 100; index += 1) {
    // High density for the current week; spread older records through the year.
    const ageHours = index < 28
      ? 2 + index * 5.4
      : 160 + (index - 28) * 91;

    const example = examples[index % examples.length];
    const isDone = ageHours > 7 && index % 5 !== 0 && index % 7 !== 2;
    const repairHours = Math.min(ageHours - 1, 3 + ((index * 17) % 86));
    const startedAt = new Date(now - ageHours * HOUR).toISOString();
    const completedAt = isDone
      ? new Date(now - (ageHours - repairHours) * HOUR).toISOString()
      : null;

    tasks.push({
      id: `RF-${String(index + 1).padStart(4, '0')}`,
      stt: index + 1,
      project: `Maintenance · Area ${index % 5 + 1}`,
      location: example[0],
      detail: example[1],
      temporaryFix: example[2],
      remainingWork: example[3],
      initialWorker: workers[(index * 3) % workers.length],
      assigneeEmail: index % 4 === 0 ? '' : `maintenance${index % 6 + 1}@example.com`,
      startedAt,
      completedAt,
      status: isDone ? 'done' : 'open',
      attachmentUrl: '',
      source: 'mock',
    });
  }

  return tasks;
}

return {makeMockTasks};
})();

const SHEET = (() => {
/**
 * REPAIRFLOW · GOOGLE SHEETS READER
 *
 * Read-only Google Visualization endpoint for a Google Sheet shared as Viewer.
 * No private keys, OAuth credentials, Apps Script, or browser CORS proxy.
 *
 * Google returns a Visualization DataTable, not an array of JSON records.
 * This adapter turns the DataTable into RepairFlow's task data model.
 *
 * IMPORTANT: Only use publicly shareable business data. Anyone with the
 * spreadsheet URL can access a sheet shared as "Anyone with the link".
 */

const REQUEST_TIMEOUT_MS = 18_000;

/** Remove accents and punctuation to compare Vietnamese column headings. */
function normalizeHeader(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

/**
 * Names found in Google Form responses and the original Excel workbook.
 * Add other aliases here if your live spreadsheet uses different headings.
 */
const COLUMN_ALIASES = Object.freeze({
  stt: ['STT', 'Số thứ tự'],
  project: ['Dự án', 'Project', 'Nhà máy', 'Khu vực sửa chữa tạm'],
  location: ['Vị trí', 'Khu vực sửa chữa tạm', 'Khu vực sửa chữa', 'Vị trí thiết bị', 'Vị trí sửa chữa', 'Thiết bị', 'Location'],
  detail: [
    'Nội dung công việc',
    'Nội dung công việc sửa chữa tạm',
    'Công việc sửa chữa tạm',
    'Mô tả sự cố',
    'Công việc',
  ],
  temporaryFix: [
    'Đã sửa chữa như thế nào',
    'Đã sửa chữa tạm như thế nào',
    'Đã sửa chữa tạm thế nào?',
    'Đã sửa chữa tạm như nào',
    'Biện pháp sửa chữa tạm',
  ],
  remainingWork: [
    'Việc còn lại cần xử lý',
    'Công việc còn lại',
    'Việc cần xử lý',
  ],
  initialWorker: [
    'Người thực hiện sửa chữa tạm',
    'Người thực hiện ban đầu',
    'Người thực hiện',
    'Người sửa chữa',
  ],
  assigneeEmail: [
    'Email người sẽ tiếp nhận',
    'Email người tiếp nhận',
    'Email người follow',
    'Email follow',
    'Email người theo dõi',
    'Email',
  ],
  startDate: ['Ngày bắt đầu sửa chữa tạm'],
  startTime: ['Giờ bắt đầu sửa chữa tạm'],
  startedAt: [
    'Thời gian bắt đầu sửa chữa tạm',
    'Thời gian bắt đầu',
    'Ngày bắt đầu',
    'Ngày sửa chữa tạm',
    'Ngày tạo',
    'Dấu thời gian',
    'Timestamp',
  ],
  completedAt: [
    'Thời gian hoàn thành',
    'Ngày hoàn thành',
    'Thời gian xác nhận hoàn thành',
    'Completed At',
  ],
  status: [
    'Trạng thái công việc',
    'Trạng thái',
    'Hoàn thành',
    'Đã hoàn thành',
    'Status',
  ],
  id: ['RF_ID'],
  version: ['RF_Version'],
  attachmentUrl: [
    'Link ảnh',
    'Hình ảnh minh chứng',
    'Link hình ảnh',
    'Link ảnh',
    'Hình ảnh',
    'Attachment',
  ],
});

function hasCellValue(value) {
  return value !== null && value !== undefined && String(value).trim() !== '';
}

function readCell(row, index) {
  const cell = row?.c?.[index];
  if (!cell) return '';

  // Prefer the underlying value. A formatted value may be a display-only
  // representation of a date or number.
  return hasCellValue(cell.v) ? cell.v : (cell.f ?? '');
}

function cleanText(value) {
  return String(value ?? '').trim();
}

/**
 * Google Visualization date values arrive as "Date(2026,10,15,9,30,0)".
 * Google uses zero-based months; the local clock in this application is VN.
 */
function parseSheetDate(input) {
  if (input === null || input === undefined || input === '') return null;

  if (input instanceof Date && !Number.isNaN(input.getTime())) {
    return input.toISOString();
  }

  if (typeof input === 'number') {
    // Google Sheets/Excel serial days since 1899-12-30.
    if (input < 20_000 || input > 100_000) return null;
    const time = Date.UTC(1899, 11, 30) + input * 86_400_000;
    return Number.isFinite(time) ? new Date(time).toISOString() : null;
  }

  const raw = cleanText(input);
  if (!raw) return null;

  const googleDate = /^Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})(?:,\s*(\d{1,2}),\s*(\d{1,2})(?:,\s*(\d{1,2}))?)?\)$/.exec(raw);
  if (googleDate) {
    const [, year, zeroMonth, day, hour = '0', minute = '0', second = '0'] = googleDate;
    const date = new Date(`${year}-${String(Number(zeroMonth) + 1).padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(2, '0')}+07:00`);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  // Common Vietnamese date display: 15/11/2026 14:05[:00].
  const vietnamDate = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})(?:\s+(\d{1,2}):(\d{2})(?::(\d{2}))?)?$/.exec(raw);
  if (vietnamDate) {
    const [, day, month, year, hour = '0', minute = '0', second = '0'] = vietnamDate;
    const date = new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}T${hour.padStart(2, '0')}:${minute}:${second.padStart(2, '0')}+07:00`);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
  }

  // Handle ISO strings, including a local date/time without a timezone.
  const isoLocal = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2})?)?$/.test(raw);
  const normalized = isoLocal
    ? `${raw.replace(' ', 'T')}${raw.length === 10 ? 'T00:00:00' : ''}+07:00`
    : raw;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

/** Combine two Form response columns (date + time) without relying on Timestamp. */
function combineStartDateTime(dateValue, timeValue) {
  const rawDate = cleanText(dateValue);
  const rawTime = cleanText(timeValue);
  if (!rawDate) return null;

  let y, mo, d;
  const g = /^Date\((\d{4}),\s*(\d{1,2}),\s*(\d{1,2})/.exec(rawDate);
  const vn = /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/.exec(rawDate);
  const iso = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(rawDate);
  if (g) [y, mo, d] = [Number(g[1]), Number(g[2]) + 1, Number(g[3])];
  else if (vn) {
    const a = Number(vn[1]);
    const b = Number(vn[2]);
    [y, mo, d] = a <= 12 && b > 12 ? [Number(vn[3]), a, b] : [Number(vn[3]), b, a];
  }
  else if (iso) [y, mo, d] = [Number(iso[1]), Number(iso[2]), Number(iso[3])];
  else return parseSheetDate(dateValue);

  let h = 0, minute = 0, second = 0;
  const tg = /^Date\(\d+,\s*\d+,\s*\d+,\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)/.exec(rawTime);
  const clock = /^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)?$/i.exec(rawTime);
  if (tg) [h, minute, second] = [Number(tg[1]), Number(tg[2]), Number(tg[3] || 0)];
  else if (clock) {
    [h, minute, second] = [Number(clock[1]), Number(clock[2]), Number(clock[3] || 0)];
    if (clock[4]) h = (h % 12) + (clock[4].toUpperCase() === 'PM' ? 12 : 0);
  } else if (rawTime && /^\d+(?:\.\d+)?$/.test(rawTime)) {
    const fraction = Number(rawTime) % 1;
    const totalSeconds = Math.round(fraction * 86400) % 86400;
    h = Math.floor(totalSeconds / 3600);
    minute = Math.floor((totalSeconds % 3600) / 60);
    second = totalSeconds % 60;
  }
  const p = n => String(n).padStart(2, '0');
  const date = new Date(`${y}-${p(mo)}-${p(d)}T${p(h)}:${p(minute)}:${p(second)}+07:00`);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function isDone(rawStatus, completedAt) {
  if (typeof rawStatus === 'boolean') return rawStatus;
  if (typeof rawStatus === 'number') return rawStatus === 1;

  const status = normalizeHeader(rawStatus);
  if (status) {
    const completed = new Set([
      'done', 'completed', 'complete', 'closed', 'finished', 'yes', 'true',
      'da hoan thanh', 'hoan thanh', 'da xong', 'xong', 'da xu ly', '1', 'x',
    ]);
    return completed.has(status);
  }

  return Boolean(completedAt);
}

function detectColumns(columns) {
  const normalizedLabels = columns.map(column => normalizeHeader(column?.label || column?.id));
  const columnMap = {};

  Object.entries(COLUMN_ALIASES).forEach(([field, aliases]) => {
    const matching = aliases.map(normalizeHeader);
    columnMap[field] = normalizedLabels.findIndex(label => matching.includes(label));
  });

  if (columnMap.location < 0 || columnMap.detail < 0) {
    const seen = columns.map(column => column?.label || column?.id || '?').join(' | ');
    throw new Error(
      'Không nhận diện được cột "Khu vực sửa chữa tạm / Vị trí" hoặc "Nội dung công việc". '
      + `Hãy kiểm tra hàng tiêu đề của Sheet. Các cột hiện có: ${seen}`,
    );
  }

  return columnMap;
}

/** Convert Google's DataTable payload to the existing RepairFlow record model. */
function parseGoogleSheetResponse(response, sheetGid = '0') {
  if (!response || response.status === 'error') {
    const details = response?.errors?.map(error => error.detailed_message || error.message).filter(Boolean);
    throw new Error(details?.join('; ') || 'Google Sheets từ chối truy cập. Kiểm tra quyền Viewer công khai và gid.');
  }

  const columns = response.table?.cols;
  const rows = response.table?.rows;

  if (!Array.isArray(columns) || !Array.isArray(rows)) {
    throw new Error('Dữ liệu trả về không phải bảng Google Sheets hợp lệ.');
  }

  const columnMap = detectColumns(columns);
  const fieldValue = (row, field) => columnMap[field] < 0 ? '' : readCell(row, columnMap[field]);

  return rows.flatMap((row, index) => {
    const location = cleanText(fieldValue(row, 'location'));
    const detail = cleanText(fieldValue(row, 'detail'));

    // Ignore blank rows without creating phantom tasks in the Dashboard.
    if (!location && !detail) return [];

    const completedAt = parseSheetDate(fieldValue(row, 'completedAt'));
    const done = isDone(fieldValue(row, 'status'), completedAt);
    const rowNumber = index + 2; // headers=1 means first data row is row 2.
    const sttValue = Number(fieldValue(row, 'stt'));

    return [{
      id: cleanText(fieldValue(row, 'id')) || `GS-${sheetGid}-${rowNumber}`,
      stt: Number.isFinite(sttValue) && sttValue > 0 ? sttValue : rowNumber - 1,
      project: cleanText(fieldValue(row, 'project')) || location,
      location,
      detail,
      temporaryFix: cleanText(fieldValue(row, 'temporaryFix')),
      remainingWork: cleanText(fieldValue(row, 'remainingWork')),
      initialWorker: cleanText(fieldValue(row, 'initialWorker')),
      assigneeEmail: cleanText(fieldValue(row, 'assigneeEmail')),
      startedAt: combineStartDateTime(fieldValue(row, 'startDate'), fieldValue(row, 'startTime'))
        || parseSheetDate(fieldValue(row, 'startedAt')),
      completedAt: done ? completedAt : null,
      status: done ? 'done' : 'open',
      attachmentUrl: cleanText(fieldValue(row, 'attachmentUrl')),
      source: 'google_sheets',
      version: Number(fieldValue(row, 'version')) || 1,
    }];
  });
}

/**
 * The Query endpoint can return a JavaScript callback. Loading via <script>
 * avoids cross-origin fetch restrictions on static hosts such as Netlify.
 * The callback is uniquely named, cleaned up, and protected by a timeout.
 */
function loadGoogleSheet(config) {
  const { GOOGLE_SHEET_ID, GOOGLE_SHEET_GID, GOOGLE_SHEET_HEADERS } = config;

  if (!/^[a-zA-Z0-9_-]{20,}$/.test(GOOGLE_SHEET_ID)) {
    return Promise.reject(new Error('GOOGLE_SHEET_ID trong js/config.js không hợp lệ.'));
  }

  const callbackName = `__repairflowSheet_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  const url = new URL(`https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq`);
  url.searchParams.set('gid', String(GOOGLE_SHEET_GID ?? '0'));
  url.searchParams.set('headers', String(GOOGLE_SHEET_HEADERS ?? 1));
  url.searchParams.set('tqx', `out:json;responseHandler:${callbackName}`);
  // Browser caching can show stale content after the user changes the Sheet.
  url.searchParams.set('_', String(Date.now()));

  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    let settled = false;
    let timeout;

    const cleanup = () => {
      clearTimeout(timeout);
      script.remove();
      delete window[callbackName];
    };
    const settle = (result, error) => {
      if (settled) return;
      settled = true;
      cleanup();
      if (error) reject(error);
      else resolve(result);
    };

    window[callbackName] = payload => {
      try {
        settle(parseGoogleSheetResponse(payload, String(GOOGLE_SHEET_GID ?? '0')));
      } catch (error) {
        settle(null, error);
      }
    };

    script.async = true;
    script.referrerPolicy = 'no-referrer';
    script.onerror = () => settle(null, new Error(
      'Không tải được Google Sheets. Kiểm tra kết nối Internet, quyền chia sẻ hoặc gid.',
    ));

    timeout = window.setTimeout(() => settle(null, new Error(
      'Hết thời gian kết nối Google Sheets (18 giây). Kiểm tra quyền truy cập công khai.',
    )), REQUEST_TIMEOUT_MS);

    script.src = url.href;
    document.head.appendChild(script);
  });
}

return {normalizeHeader,COLUMN_ALIASES,parseSheetDate,combineStartDateTime,parseGoogleSheetResponse,loadGoogleSheet};
})();

const DATE = (() => {
/**
 * REPAIRFLOW · DATE & FILTER HELPERS
 * Dates and reporting periods are based on Vietnam local time.
 */



const datePartsFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: CONFIG.TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const displayFormatter = new Intl.DateTimeFormat('vi-VN', {
  timeZone: CONFIG.TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

function dayKey(value) {
  if (!value) return '';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';

  const parts = datePartsFormatter.formatToParts(date);
  const get = type => parts.find(item => item.type === type)?.value;

  return `${get('year')}-${get('month')}-${get('day')}`;
}

function addDays(key, amount) {
  const [year, month, day] = key.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + amount));
  return date.toISOString().slice(0, 10);
}

function addMonth(key, amount = 1) {
  const [year, month] = key.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1 + amount, 1));
  return date.toISOString().slice(0, 7) + '-01';
}

function currentPeriod(period, today = dayKey(new Date())) {
  const [year, month, date] = today.split('-').map(Number);
  const firstMonth = `${year}-${String(month).padStart(2, '0')}-01`;
  const weekDay = new Date(Date.UTC(year, month - 1, date)).getUTCDay();

  switch (period) {
    case 'week': {
      const start = addDays(today, -((weekDay + 6) % 7));
      const end = addDays(start, 7);
      return { start, end, step: 'day', label: `${formatShort(start)} – ${formatShort(addDays(end, -1))}` };
    }
    case 'month':
      return { start: firstMonth, end: addMonth(firstMonth), step: 'day', label: `Tháng ${month}/${year}` };
    case 'quarter': {
      const quarter = Math.ceil(month / 3);
      const start = `${year}-${String((quarter - 1) * 3 + 1).padStart(2, '0')}-01`;
      return { start, end: addMonth(start, 3), step: 'month', label: `Quý ${quarter}/${year}` };
    }
    case 'year':
      return { start: `${year}-01-01`, end: `${year + 1}-01-01`, step: 'month', label: `Năm ${year}` };
    default:
      throw new Error(`Khoảng thời gian không hợp lệ: ${period}`);
  }
}

function formatShort(dateKeyValue) {
  const [year, month, day] = dateKeyValue.split('-');
  return `${day}/${month}/${year}`;
}

function isInPeriod(value, period) {
  const key = dayKey(value);
  return Boolean(key && key >= period.start && key < period.end);
}

function formatDateWithSeconds(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('vi-VN', {
    timeZone: CONFIG.TIME_ZONE, day:'2-digit', month:'2-digit', year:'numeric',
    hour:'2-digit', minute:'2-digit', second:'2-digit', hour12:false,
  }).format(date);
}

function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : displayFormatter.format(date);
}

function hoursElapsed(task) {
  const start = new Date(task.startedAt).getTime();
  const finish = task.status === 'done' && task.completedAt
    ? new Date(task.completedAt).getTime()
    : Date.now();

  if (!Number.isFinite(start) || !Number.isFinite(finish)) return NaN;
  return Math.max(0, (finish - start) / 3_600_000);
}

function formatDuration(hours) {
  if (!Number.isFinite(hours)) return '—';
  const minutes = Math.floor(hours * 60);

  if (minutes < 60) return `${minutes} phút`;
  if (hours < 24) return `${Math.floor(hours)} giờ ${minutes % 60} phút`;
  return `${Math.floor(hours / 24)} ngày ${Math.floor(hours % 24)} giờ`;
}

function toDateTimeInput(value = new Date()) {
  const date = new Date(value);
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: CONFIG.TIME_ZONE,
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);

  const get = type => parts.find(item => item.type === type)?.value;
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}

function parseVietnamLocalInput(value) {
  if (!value) return new Date().toISOString();
  // Vietnam is UTC+07:00 all year, with no DST.
  const date = new Date(`${value}:00+07:00`);
  if (Number.isNaN(date.getTime())) throw new Error('Thời gian nhập không hợp lệ.');
  return date.toISOString();
}

function makeTrendBuckets(tasks, period) {
  const buckets = [];
  let day = period.start;

  while (day < period.end && buckets.length < 370) {
    const key = period.step === 'month' ? day.slice(0, 7) : day;
    const label = period.step === 'month'
      ? `T${Number(day.slice(5, 7))}`
      : `${Number(day.slice(8, 10))}/${Number(day.slice(5, 7))}`;

    buckets.push({ key, label, created: 0, completed: 0 });
    day = period.step === 'month' ? addMonth(day) : addDays(day, 1);
  }

  const indexByKey = new Map(buckets.map((item, index) => [item.key, index]));

  for (const task of tasks) {
    const created = dayKey(task.startedAt);
    const done = dayKey(task.completedAt);
    const createdKey = period.step === 'month' ? created.slice(0, 7) : created;
    const doneKey = period.step === 'month' ? done.slice(0, 7) : done;

    if (created >= period.start && created < period.end && indexByKey.has(createdKey)) {
      buckets[indexByKey.get(createdKey)].created += 1;
    }

    if (task.status === 'done' && done >= period.start && done < period.end && indexByKey.has(doneKey)) {
      buckets[indexByKey.get(doneKey)].completed += 1;
    }
  }

  return buckets;
}

function searchable(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase();
}

return {dayKey,addDays,currentPeriod,formatShort,isInPeriod,formatDate,formatDateWithSeconds,hoursElapsed,formatDuration,toDateTimeInput,parseVietnamLocalInput,makeTrendBuckets,searchable};
})();

const CHARTMOD = (() => {
/**
 * REPAIRFLOW · SVG TREND CHART
 * Dependency-free, scalable, accessible point markers + custom tooltip.
 */

const SVG_WIDTH = 860;
const SVG_HEIGHT = 310;
const CHART = { left: 37, right: 20, top: 20, bottom: 48 };

function safeText(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function curve(points) {
  // Dữ liệu đếm là số nguyên không âm, không nội suy đường cong
  // Nối thẳng điểm để tránh Bezier vượt xuống dưới trục 0
  if (!points.length) return '';
  return points.map((point, index) =>
    `${index ? 'L' : 'M'} ${point.x} ${point.y}`
  ).join(' ');
}

function niceCeiling(maximum) {
  const step = Math.max(1, Math.ceil(maximum / 4));
  return step * 4;
}

function renderTrendChart(element, buckets) {
  const plotWidth = SVG_WIDTH - CHART.left - CHART.right;
  const plotHeight = SVG_HEIGHT - CHART.top - CHART.bottom;
  const maximum = niceCeiling(Math.max(1, ...buckets.flatMap(item => [item.created, item.completed])));
  const pointsFor = field => buckets.map((item, index) => ({
    x: CHART.left + plotWidth * (buckets.length <= 1 ? 0.5 : index / (buckets.length - 1)),
    y: CHART.top + plotHeight * (1 - item[field] / maximum),
    bucket: item,
  }));

  const created = pointsFor('created');
  const completed = pointsFor('completed');
  const bottom = CHART.top + plotHeight;
  const visibleLabelEvery = Math.max(1, Math.ceil(buckets.length / 9));

  const grid = Array.from({ length: 5 }, (_, index) => {
    const number = maximum * (4 - index) / 4;
    const y = CHART.top + plotHeight * index / 4;

    return `<line class="chart-gridline" x1="${CHART.left}" y1="${y}" x2="${SVG_WIDTH - CHART.right}" y2="${y}" />
      <text class="chart-axis-label" text-anchor="end" x="${CHART.left - 13}" y="${y + 3}">${number}</text>`;
  }).join('');

  const xLabels = created.map((point, index) => {
    const shouldShow = index % visibleLabelEvery === 0 || index === created.length - 1;
    if (!shouldShow) return '';

    return `<text class="chart-axis-label" x="${point.x}" y="${SVG_HEIGHT - 14}" text-anchor="middle">${safeText(point.bucket.label)}</text>`;
  }).join('');

  function series(points, type, color, gradientName) {
    if (!points.length) return '';

    const line = curve(points);
    const dots = points.map((point, index) => `
      <g class="chart-point" tabindex="0" role="img"
         data-chart-point="${index}" data-chart-series="${type}"
         aria-label="${safeText(`${point.bucket.label}: ${point.bucket[type]} công việc`)}">
        <circle cx="${point.x}" cy="${point.y}" r="4.4" fill="white" stroke="${color}" stroke-width="2.4" />
        <circle class="chart-hit" cx="${point.x}" cy="${point.y}" r="12" />
      </g>`).join('');

    return `<path class="chart-line" d="${line}" stroke="${color}" />${dots}`;
  }

  element.innerHTML = `
    <svg viewBox="0 0 ${SVG_WIDTH} ${SVG_HEIGHT}" xmlns="http://www.w3.org/2000/svg" aria-hidden="false">
      <defs>
        <linearGradient id="gradient-red" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ee717d" stop-opacity="0.20" /><stop offset="100%" stop-color="#ee717d" stop-opacity="0.005" /></linearGradient>
        <linearGradient id="gradient-green" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#1ab591" stop-opacity="0.12" /><stop offset="100%" stop-color="#1ab591" stop-opacity="0.005" /></linearGradient>
      </defs>
      ${grid}
      ${xLabels}
      ${series(created, 'created', '#ed6b72', 'gradient-red')}
      ${series(completed, 'completed', '#16ab88', 'gradient-green')}
    </svg>`;

  // Hover information is attached to the data point rather than guessed
  // from mouse x-coordinate; it works equally well on desktop and touch.
  element.onpointermove = event => {
    const point = event.target.closest('[data-chart-point]');
    if (!point) {
      hideChartTooltip();
      return;
    }

    const index = Number(point.dataset.chartPoint);
    showChartTooltip(buckets[index], event.clientX, event.clientY);
  };

  element.onpointerleave = hideChartTooltip;
  element.onfocusin = event => {
    const point = event.target.closest('[data-chart-point]');
    if (!point) return;
    const box = point.getBoundingClientRect();
    showChartTooltip(buckets[Number(point.dataset.chartPoint)], box.left, box.top);
  };
  element.onfocusout = hideChartTooltip;
}

function showChartTooltip(bucket, clientX, clientY) {
  const tooltip = document.querySelector('#chart-tooltip');
  if (!tooltip || !bucket) return;

  tooltip.innerHTML = `<strong>${safeText(bucket.label)}</strong>
    <span>🔴 Phát sinh: ${bucket.created}</span><br>
    <span>🟢 Hoàn thành: ${bucket.completed}</span>`;
  tooltip.hidden = false;
  const bounds = tooltip.getBoundingClientRect();
  const left = Math.max(8, Math.min(clientX + 12, window.innerWidth - bounds.width - 8));
  // Giữ tooltip sát con trỏ (8px), không bị lệch lên quá cao.
  const below = clientY + 8;
  const top = below + bounds.height + 8 <= window.innerHeight
    ? below : Math.max(8, clientY - bounds.height - 6);
  tooltip.style.left = `${left}px`;
  tooltip.style.top = `${Math.max(8, top)}px`;
}

function hideChartTooltip() {
  const tooltip = document.querySelector('#chart-tooltip');
  if (tooltip) tooltip.hidden = true;
}

return {renderTrendChart,hideChartTooltip};
})();

const SERVICE = (() => {
/**
 * REPAIRFLOW · DATA ACCESS LAYER
 *
 * UI code only calls the functions exported here. To use a hosted JSON file,
 * change DATA_SOURCE in config.js from 'mock' to 'json'. To make changes
 * permanent for all visitors, configure a server API and use mode 'api'.
 */


const {makeMockTasks} = MOCK;
const {loadGoogleSheet} = SHEET;

const mode = CONFIG.DATA_SOURCE;
let memoryFallback = null;
let latestApiTasks = [];

function clone(value) {
  return structuredClone(value);
}

function normalizeTask(task) {
  if (!task || typeof task !== 'object') {
    throw new Error('Bản ghi công việc không hợp lệ.');
  }

  return {
    id: String(task.id ?? task.stt ?? crypto.randomUUID()),
    stt: Number(task.stt) || 0,
    project: String(task.project ?? ''),
    location: String(task.location ?? ''),
    detail: String(task.detail ?? ''),
    temporaryFix: String(task.temporaryFix ?? ''),
    remainingWork: String(task.remainingWork ?? ''),
    initialWorker: String(task.initialWorker ?? ''),
    assigneeEmail: String(task.assigneeEmail ?? ''),
    startedAt: task.startedAt || null,
    createdAt: task.createdAt || task.startedAt || null,
    completedAt: task.completedAt || null,
    status: task.status === 'done' ? 'done' : 'open',
    approval: task.approval || 'approved',
    proposedChanges: task.proposedChanges || null,
    completionEvidenceUrls: Array.isArray(task.completionEvidenceUrls)?task.completionEvidenceUrls.slice(0,5):[],
    completionRequestedAt: task.completionRequestedAt || null,
    completionRequestedBy: task.completionRequestedBy || '',
    requestedBy: task.requestedBy || '',
    attachmentUrl: String(task.attachmentUrl ?? ''),
    attachmentUrls: Array.isArray(task.attachmentUrls)
      ? task.attachmentUrls.filter(url => typeof url === 'string').slice(0, 8)
      : (task.attachmentUrl ? [String(task.attachmentUrl)] : []),
    source: String(task.source ?? mode),
    version: Number(task.version) || 1,
  };
}

function readMock() {
  if (memoryFallback) {
    return clone(memoryFallback);
  }

  try {
    const saved = localStorage.getItem(CONFIG.MOCK_STORAGE_KEY);

    if (saved) {
      const records = JSON.parse(saved);
      if (Array.isArray(records)) return records.map(normalizeTask);
    }
  } catch (error) {
    console.warn('Cannot read demo localStorage; using in-memory records.', error);
  }

  const initial = makeMockTasks();
  persistMock(initial);
  return clone(initial);
}

function persistMock(tasks) {
  memoryFallback = clone(tasks);

  try {
    localStorage.setItem(CONFIG.MOCK_STORAGE_KEY, JSON.stringify(tasks));
    memoryFallback = null;
  } catch (error) {
    console.warn('LocalStorage disabled; edits will last until page refresh.', error);
  }
}

async function fetchJson(url, options = {}) {
  const response = await fetch(url, {
    cache: 'no-store',
    ...options,
  });

  if (!response.ok) {
    const failure = await response.json().catch(() => null);
    throw new Error(failure?.error || `Không tải được dữ liệu. HTTP ${response.status}`);
  }

  return response.json();
}

function unwrapTasks(response) {
  const records = Array.isArray(response) ? response : response?.tasks;

  if (!Array.isArray(records)) {
    throw new Error('JSON phải là một mảng hoặc đối tượng có trường tasks là mảng.');
  }

  return records.map(normalizeTask);
}

function requireWritable() {
  if (!canWriteTasks()) {
    throw new Error('Nguồn JSON công khai chỉ có quyền đọc. Cần API để ghi dữ liệu.');
  }
}

async function apiCall(path, method, body) {
  const base = CONFIG.API_BASE_URL.replace(/\/$/, '');

  try {
    return await fetchJson(`${base}${path}`, {
      method,
      headers: { 'Content-Type': 'application/json', ...(getDemoSession()?.token ? {'Authorization': `Bearer ${getDemoSession().token}`} : {}) },
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
    });
  } catch (error) {
    // A Worker 404 is a routing/deployment mismatch, NOT a Google Sheet status issue.
    if (/Endpoint không tồn tại/i.test(String(error.message || ''))) {
      throw new Error(`API ${method} ${path} không tồn tại trên Worker đang chạy. Mở ${base}/health và kiểm tra version v22, sau đó Deploy worker.js vào Production.`);
    }
    throw error;
  }
}

async function loadEvidencePreview(id, index = 0) {
  if (mode !== 'api') throw new Error('Chức năng xem ảnh trực tiếp cần API.');
  if (!Number.isInteger(index) || index < 0 || index > 7) throw new Error('Chỉ số ảnh không hợp lệ.');
  return apiCall(`/tasks/${encodeURIComponent(id)}/evidence/${index}`, 'GET');
}

function canWriteTasks() {
  return mode === 'mock' || mode === 'api';
}

function getDataSourceMode() {
  return mode;
}

async function listTasks() {
  if (mode === 'mock') return readMock();
  if (mode === 'google_sheets') return (await loadGoogleSheet(CONFIG)).map(normalizeTask);
  if (mode === 'json') return unwrapTasks(await fetchJson(CONFIG.JSON_URL));
  if (mode === 'api') {
    latestApiTasks = unwrapTasks(await apiCall('/tasks', 'GET'));
    return clone(latestApiTasks);
  }

  throw new Error(`DATA_SOURCE không được hỗ trợ: ${mode}`);
}

async function uploadEvidence(file) {
  if (mode !== 'api') throw new Error('Tải ảnh cần API Cloudflare Worker.');
  return apiCall('/evidence/upload', 'POST', file);
}

async function addTask(payload) {
  requireWritable();

  if (mode === 'api') return normalizeTask(await apiCall('/tasks', 'POST', payload));

  const tasks = readMock();
  const nextStt = Math.max(0, ...tasks.map(task => Number(task.stt) || 0)) + 1;
  const task = normalizeTask({
    ...payload,
    id: `RF-${Date.now().toString(36).toUpperCase()}`,
    stt: nextStt,
    status: 'open',
    completedAt: null,
    source: 'mock',
  });

  tasks.unshift(task);
  persistMock(tasks);
  return clone(task);
}

async function updateTask(id, payload) {
  requireWritable();

  if (mode === 'api') {
    const current = latestApiTasks.find(task => task.id === id);
    if (!current) throw new Error('Không tìm thấy phiên bản mới nhất của công việc.');
    return normalizeTask(await apiCall(`/tasks/${encodeURIComponent(id)}`, 'PUT', {
      expectedVersion: current.version,
      payload,
    }));
  }

  const tasks = readMock();
  const index = tasks.findIndex(task => task.id === id);
  if (index === -1) throw new Error('Không tìm thấy công việc cần sửa.');

  tasks[index] = normalizeTask({
    ...tasks[index],
    ...payload,
    id: tasks[index].id,
    stt: tasks[index].stt,
  });

  persistMock(tasks);
  return clone(tasks[index]);
}

async function setTaskCompletion(id, done, evidenceUrls=[]) {
  requireWritable();

  if (mode === 'api') {
    const current = latestApiTasks.find(task => task.id === id);
    if (!current) throw new Error('Không tìm thấy phiên bản mới nhất của công việc.');
    return normalizeTask(await apiCall(`/tasks/${encodeURIComponent(id)}/completion`, 'PATCH', {
      done, evidenceUrls,
      expectedVersion: current.version,
    }));
  }

  const tasks = readMock();
  const task = tasks.find(item => item.id === id);
  if (!task) throw new Error('Không tìm thấy công việc.');

  task.status = done ? 'done' : 'open';
  task.completedAt = done ? new Date().toISOString() : null;
  persistMock(tasks);
  return clone(task);
}

async function reviewTask(id, approve) {
  if (mode !== 'api' || getDemoSession()?.role !== 'admin') throw new Error('Chỉ Admin được duyệt.');
  if (!String(id || '').trim()) {
    throw new Error('Phản hồi Google Form chưa có RF_ID. Nhấn Làm mới; backend V23 sẽ tự cấp mã.');
  }
  const current = latestApiTasks.find(t=>t.id===id);
  return apiCall(`/tasks/${encodeURIComponent(id)}/review`, 'PATCH', {approve,expectedVersion:current?.version});
}

async function loadCompletionEvidencePreview(id,index=0){
  if(mode!=='api')throw new Error('Xem minh chứng hoàn thành cần API.');
  return apiCall(`/tasks/${encodeURIComponent(id)}/completion-evidence/${index}`,'GET');
}

async function loadAuditLogs() {
  if (mode !== 'api') return [];
  if (getDemoSession()?.role !== 'admin') throw new Error('Chỉ Admin được xem lịch sử thao tác.');
  const result=await apiCall('/audit','GET');
  return Array.isArray(result.events) ? result.events : [];
}

async function resetDemoData() {
  if (mode !== 'mock') throw new Error('Chỉ khôi phục được ở chế độ mock.');
  const tasks = makeMockTasks();
  persistMock(tasks);
  return clone(tasks);
}

return {loadEvidencePreview,loadCompletionEvidencePreview,uploadEvidence,canWriteTasks,getDataSourceMode,listTasks,addTask,updateTask,setTaskCompletion,resetDemoData,reviewTask,loadAuditLogs};
})();

/**
 * ========================================================================
 * REPAIRFLOW · FRONTEND APPLICATION
 * Three-page dashboard with independent data provider (data-service.js).
 * Demo-only frontend login and no backend requirement in mock mode.
 * ========================================================================
 */


const {getDemoSession, signOutDemo} = AUTH;
const {addTask, canWriteTasks, getDataSourceMode, listTasks, loadEvidencePreview, resetDemoData, setTaskCompletion, updateTask,} = SERVICE;
const {currentPeriod, formatDate, formatDateWithSeconds, formatDuration, hoursElapsed, isInPeriod, makeTrendBuckets, parseVietnamLocalInput, searchable, toDateTimeInput,} = DATE;
const {hideChartTooltip, renderTrendChart} = CHARTMOD;
import {downloadXlsx} from './xlsx-export.js';
import {readXlsxRows} from './xlsx-import.js';

/* ------------------------------------------------------------------------
   State & DOM helpers
   ------------------------------------------------------------------------ */

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];
const ICON = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"></use></svg>`;

const pageInfo = {
  charts: {
    title: 'Dashboard',
    description: '',
    breadcrumb: 'Dashboard',
  },
  open: {
    title: 'Công việc sửa chữa tạm',
    description: 'Kiểm soát công việc tồn đọng và chủ động xử lý những vấn đề cần ưu tiên.',
    breadcrumb: 'Sửa chữa tạm',
  },
  pending: {title:'Công việc chờ duyệt',description:'Yêu cầu đang đợi xác nhận',breadcrumb:'Chờ duyệt'},
  alarm: {title:'Alarm công việc', description:'Công việc quá thời hạn chưa duyệt hoặc chưa hoàn thành',breadcrumb:'Alarm'},
  history: {title:'Lịch sử thao tác',description:'Chi tiết các thao tác và tài khoản thực hiện',breadcrumb:'Lịch sử'},
  done: {
    title: 'Công việc đã hoàn thành',
    description: 'Tổng hợp lịch sử hoàn tất và đánh giá hiệu quả xử lý của đội bảo trì.',
    breadcrumb: 'Đã hoàn thành',
  },
};

const state = {
  tasks: [],
  page: 'charts',
  period: ['google_sheets', 'api'].includes(CONFIG.DATA_SOURCE) ? 'month' : 'week',
  openFilter: 'all',
  pendingFilter: 'all',
  audit: [], auditLoaded: false, auditSearch: '',
  search: { open: '', done: '', pending: '' },
  sort: {
    open: { key: 'startedAt', direction: 'desc' },
    done: { key: 'startedAt', direction: 'desc' },
    pending: { key: 'startedAt', direction: 'desc' },
  },
  editingId: null,
  detailId: null,
  pendingConfirmation: null,
  working: false,
  selected: {open: new Set(), pending: new Set(), done: new Set()},
};

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[character]);
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function getTask(id) {
  return state.tasks.find(task => task.id === id);
}

function percentage(numerator, denominator) {
  return denominator > 0 ? Math.round(numerator / denominator * 100) : 0;
}

function isMobile() {
  return window.matchMedia('(max-width: 820px)').matches;
}

function safeHttpUrl(url) {
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol) ? parsed.href : '';
  } catch {
    return '';
  }
}

/* ------------------------------------------------------------------------
   Application bootstrap
   ------------------------------------------------------------------------ */

async function init() {
  const session = getDemoSession();
  if (!session) { window.location.replace('./login.html'); return; }
  $('#logout-button').addEventListener('click', () => {
    signOutDemo();
    window.location.replace('./login.html');
  });
  $('#header-date').textContent = new Intl.DateTimeFormat('vi-VN', {
    timeZone: CONFIG.TIME_ZONE,
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  setSidebarCollapsed(true);
  configureSourceLabels();
  bindEvents();
  rfBindCompletionControls();
  state.page = pageInfo[location.hash.slice(1)] ? location.hash.slice(1) : 'charts';

  applyDashboardSession(session);
  try {
    await refreshTasks(false);
    if(state.page==='history') await refreshAudit();
  } catch (error) {
    showToast(error.message, 'error');
  }

  updateNavigation();
  renderAll();
  applyDashboardSession(session);

  if (CONFIG.AUTO_REFRESH_MS > 0) {
    window.setInterval(() => {
      if (!$$('dialog[open]').length && !state.working) {
        refreshTasks(false, true).catch(error => console.warn('Auto refresh failed:', error));
      }
    }, CONFIG.AUTO_REFRESH_MS);
  }
}

/* ------------------------------------------------------------------------
   Demo login — UI demonstration, not production-grade authentication.
   Session is stored in sessionStorage; passwords live in public demo source.
   ------------------------------------------------------------------------ */

// Dashboard auth is a demo session check. Real security MUST be added in Worker.
function applyDashboardSession(session) {
  if (!session) { window.location.replace('./login.html'); return; }
  document.getElementById('app-shell').hidden = false;
  const role = session.role === 'admin' ? 'Admin' : 'User';
  $('#nav-pending').hidden = false;
  $('#nav-history').hidden = session.role !== 'admin';
  const addButton = $('#add-button');
  // Cả Admin và User đều có quyền tạo công việc mới; việc mới cần Admin duyệt.
  $('#current-user-name').textContent = session.name;
  $('#current-user-role').textContent = role;
  $('#current-user-role').dataset.role = session.role;
  $('#sidebar-user-name').textContent = session.name;
  $('#sidebar-user-role').textContent = `Quyền hiện tại: ${role}`;
  updateNavigation();
  renderAll();
}

function configureSourceLabels() {
  const mode = getDataSourceMode();
  const banner = $('.data-note');
  const badge = $('.demo-badge');
  const resetButton = $('#reset-demo');

  if (mode === 'mock') return;

  resetButton.hidden = true;

  if (mode === 'google_sheets') {
    badge.textContent = 'Đang kết nối';
    badge.setAttribute('data-sync', 'loading');
    banner.setAttribute('data-sync', 'loading');
    banner.querySelector('span').textContent = 'Đang kết nối Google Sheets công khai...';

    const link = document.createElement('a');
    link.href = `https://docs.google.com/spreadsheets/d/${CONFIG.GOOGLE_SHEET_ID}/edit`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.className = 'source-link';
    link.textContent = 'Mở Google Sheet ↗';
    banner.appendChild(link);
  } else {
    if (mode === 'api') {
      badge.textContent = 'Đang kết nối';
      badge.dataset.sync = 'loading';
      banner.dataset.sync = 'loading';
    } else {
      badge.textContent = mode === 'json' ? 'Nguồn JSON' : 'REST API';
    }
    banner.querySelector('span').textContent = mode === 'json'
      ? 'Website đang đọc dữ liệu từ URL JSON công khai. Cần API riêng để ghi dữ liệu.'
      : 'Website đang kết nối dữ liệu từ REST API.';
  }

  if (!canWriteTasks()) $('#add-button').hidden = true;
}

/** Keep a durable, visible connection state even when a refresh fails. */
function updateSourceStatus(status, detail = '') {
  if (!['google_sheets', 'api'].includes(getDataSourceMode())) return;

  const banner = $('.data-note');
  const badge = $('.demo-badge');
  const message = banner.querySelector('span');

  banner.dataset.sync = status;
  badge.dataset.sync = status;
  badge.textContent = status === 'ready' ? 'Đã kết nối' :
    status === 'error' ? 'Mất kết nối' : 'Đang kết nối';

  if (status === 'ready') {
    message.textContent = ''; 
  } else if (status === 'error') {
    message.textContent = `Không thể kết nối Google Sheets/API: ${detail}. ${state.tasks.length ? 'Đang giữ dữ liệu tải thành công trước đó.' : 'Chưa có dữ liệu thực để hiển thị.'}`;
  } else {
    message.textContent = 'Đang tải dữ liệu mới từ Google Sheets...';
  }
}

async function refreshTasks(withToast = false, silent = false) {
  if (!silent) updateSourceStatus('loading');

  try {
    const results = await listTasks();
    state.tasks = results;
    renderAll();
    updateSourceStatus('ready');

    if (withToast) showToast(`Đã cập nhật ${results.length} công việc.`);
    return results;
  } catch (error) {
    updateSourceStatus('error', error.message);
    if (!silent) showToast(`Không thể tải dữ liệu: ${error.message}`, 'error');
    throw error;
  }
}

/* ------------------------------------------------------------------------
   Event wiring & navigation
   ------------------------------------------------------------------------ */

function bindEvents() {
  $('#menu-toggle').addEventListener('click', () => setSidebarCollapsed(
    !$('#app-shell').classList.contains('sidebar-collapsed'),
  ));

  $('#sidebar-overlay').addEventListener('click', () => setSidebarCollapsed(true));

  document.addEventListener('click', event => {
    const pageButton = event.target.closest('[data-page]');
    if (pageButton) {
      event.preventDefault();
      if (pageButton.dataset.openFilter) selectOpenFilter(pageButton.dataset.openFilter);
      navigate(pageButton.dataset.page);
      return;
    }

    const periodButton = event.target.closest('[data-period]');
    if (periodButton) {
      state.period = periodButton.dataset.period;
      renderAll();
      return;
    }

    const pendingFilter = event.target.closest('[data-pending-filter]');
    if (pendingFilter) {
      state.pendingFilter = pendingFilter.dataset.pendingFilter;
      renderTables();
      return;
    }

    const openFilter = event.target.closest('[data-open-filter]');
    if (openFilter) {
      selectOpenFilter(openFilter.dataset.openFilter);
      return;
    }

    const importButton = event.target.closest('#import-button');
    if(importButton){rfOpenImport();return;}

    const exportButton = event.target.closest('[data-export]');
    if (exportButton) {
      exportXlsx(exportButton.dataset.export).catch(error => showToast(error.message, 'error'));
      return;
    }

    const sortButton = event.target.closest('[data-sort]');
    if (sortButton) {
      toggleSort(sortButton.dataset.sort, sortButton.dataset.sortKey);
      return;
    }

    const clearBulk = event.target.closest('[data-bulk-clear]');
    if (clearBulk) {
      state.selected[clearBulk.dataset.bulkClear]?.clear();
      renderTables();
      return;
    }

    const bulkAction = event.target.closest('[data-bulk-action]');
    if (bulkAction) {
      if (bulkAction.dataset.bulkAction === 'complete') {
        const ids = [...state.selected.open].filter(id => canSelectForBulk(getTask(id), 'open'));
        if (!ids.length) return showToast('Hãy tick ít nhất một công việc để hoàn thành.', 'error');
        rfOpenCompletionDialog(ids);
        return;
      }
      askForBulkConfirmation(bulkAction.dataset.bulkAction);
      return;
    }

    const actionButton = event.target.closest('[data-action]');
    if (actionButton) {
      event.stopPropagation();
      handleRowAction(actionButton.dataset.action, actionButton.dataset.id);
      return;
    }

    const row = event.target.closest('tr[data-task-id]');
    if (row && !event.target.closest('a, button, input')) {
      showTaskDetails(row.dataset.taskId);
      return;
    }

    const alarmButton=event.target.closest('[data-alarm-task-id]');
    if(alarmButton){showTaskDetails(alarmButton.dataset.alarmTaskId);return;}
    const auditButton=event.target.closest('[data-audit-task-id]');
    if(auditButton){showTaskDetails(auditButton.dataset.auditTaskId);return;}

    const recentButton = event.target.closest('[data-recent-id]');
    if (recentButton) showTaskDetails(recentButton.dataset.recentId);

    const closeButton = event.target.closest('[data-close-modal]');
    if (closeButton) closeModal(closeButton.dataset.closeModal);
  });

  // Chọn nhiều dòng: chỉ Admin có quyền thay đổi trạng thái.
  document.addEventListener('change', event => {
    const checkbox = event.target.closest('[data-select-task], [data-select-all]');
    if (!checkbox || state.working) return;
    const type = checkbox.dataset.selectGroup;
    if (!state.selected[type]) return;
    if (checkbox.hasAttribute('data-select-all')) {
      const permitted = visibleTasks(type).filter(task => canSelectForBulk(task, type));
      permitted.forEach(task => checkbox.checked ? state.selected[type].add(task.id) : state.selected[type].delete(task.id));
    } else {
      const task = getTask(checkbox.dataset.selectTask);
      if (!canSelectForBulk(task, type)) { checkbox.checked = false; return; }
      if (checkbox.checked) state.selected[type].add(checkbox.dataset.selectTask);
      else state.selected[type].delete(checkbox.dataset.selectTask);
    }
    renderBulkState(type);
  });

  $('#refresh-button').addEventListener('click', () => refreshTasks(true));
  $('#add-button').addEventListener('click', () => openTaskEditor());
  $('#form-button').addEventListener('click', () => window.open(CONFIG.FORM_URL, '_blank', 'noopener,noreferrer'));
  rfBindImport();
  rfBindUploadControls();
  $('#reset-demo').addEventListener('click', () => askForConfirmation('reset'));
  $('#open-search').addEventListener('input', event => {
    state.search.open = event.target.value;
    renderTables();
  });
  $('#pending-search').addEventListener('input', event => {state.search.pending=event.target.value;renderTables();});
  $('#history-search').addEventListener('input',event => {state.auditSearch=event.target.value;renderAudit();});
  $('#history-refresh').addEventListener('click',()=>refreshAudit(true));
  $('#done-search').addEventListener('input', event => {
    state.search.done = event.target.value;
    renderTables();
  });
  $('#task-form').addEventListener('submit', submitTaskForm);
  $('#detail-edit-button').addEventListener('click', () => {
    const id = state.detailId;
    closeModal('detail-dialog');
    if(getDemoSession()?.role==='admin')openTaskEditor(id);
    else rfOpenCompletionDialog(id);
  });
  $('#confirm-accept').addEventListener('click', acceptConfirmation);

  $$('dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog && !state.working) dialog.close();
    });
    dialog.addEventListener('cancel', event => {
      if (state.working) event.preventDefault();
    });
  });

  window.addEventListener('hashchange', () => {
    const next = location.hash.slice(1);
    if (pageInfo[next] && next !== state.page) {
      state.page = next;
      updateNavigation();
      renderAll();
      if(next==='history')refreshAudit().catch(()=>{});
    }
  });

  window.addEventListener('resize', () => {
    $('#sidebar-overlay').hidden = $('#app-shell').classList.contains('sidebar-collapsed');
  });

  window.addEventListener('keydown', event => {
    const alarmRow=event.target.closest?.('tr.rf-alert-row[data-task-id]');
    if(alarmRow && (event.key==='Enter'||event.key===' ') && !event.target.closest('button')){event.preventDefault();showTaskDetails(alarmRow.dataset.taskId);return;}
    if (event.key === '/' && !$('#app-shell').hidden && !isTyping() && !$$('dialog[open]').length) {
      event.preventDefault();
      navigate('open');
      $('#open-search').focus();
    }
    if (event.key === 'Escape') setSidebarCollapsed(true);
  });
}

function isTyping() {
  return ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName);
}

function navigate(page) {
  if (!pageInfo[page]) return;
  state.page = page;
  if(page==='history' && getDemoSession()?.role!=='admin') {showToast('Chỉ Admin xem được lịch sử thao tác','error');return;}
  if (location.hash !== `#${page}`) location.hash = page;
  if(page==='history') refreshAudit().catch(error=>showToast(error.message,'error'));
  updateNavigation();
  renderAll();
  hideChartTooltip();

  setSidebarCollapsed(true);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/** Move the SAME four-button toolbar to the active table, retaining all bound events. */
function dockActionToolbar() {
  // Một nhóm bốn nút duy nhất, chuyển đến tiêu đề bảng của trang đang mở.
  const toolbar = $('.head-actions');
  const target = state.page === 'charts'
    ? $('.page-head')
    : ['alarm','history'].includes(state.page)
      ? $(`#page-${state.page} .rf-panel-head`)
      : $(`#page-${state.page} .table-head`);
  if (toolbar && target && toolbar.parentElement !== target) target.appendChild(toolbar);
  const exportButton = $('#export-button');
  if (exportButton) exportButton.dataset.export = state.page;
}

function updateNavigation() {
  document.body.dataset.currentPage = state.page;
  const info = pageInfo[state.page];
  $('#page-title').textContent = info.title;
  $('#page-description').textContent = info.description;
  $('#breadcrumb-label').textContent = info.breadcrumb;

  $$('.nav-link').forEach(button => {
    const selected = button.dataset.page === state.page;
    button.classList.toggle('active', selected);
    if (selected) button.setAttribute('aria-current', 'page');
    else button.removeAttribute('aria-current');
  });

  $$('.page-view').forEach(section => {
    section.hidden = section.id !== `page-${state.page}`;
  });
  dockActionToolbar();
}

function setSidebarCollapsed(collapsed) {
  $('#app-shell').classList.toggle('sidebar-collapsed', collapsed);
  $('#menu-toggle').setAttribute('aria-expanded', String(!collapsed));
  $('#sidebar-overlay').hidden = collapsed;
}

function selectOpenFilter(filter) {
  state.openFilter = filter;
  renderTables();
}

/* ------------------------------------------------------------------------
   Data selectors & rendering
   ------------------------------------------------------------------------ */

function selectedData() {
  const period = currentPeriod(state.period);
  const created = state.tasks.filter(task => task.approval === 'approved' && isInPeriod(task.startedAt, period));
  const finished = state.tasks.filter(task =>
    task.approval === 'approved' && task.status === 'done' && isInPeriod(task.completedAt, period),
  );
  const open = created.filter(task => task.status !== 'done');
  const cohortDone = created.filter(task => task.status === 'done');

  return { period, created, finished, open, cohortDone };
}

function renderAll() {
  updateNavigation();
  const data = selectedData();

  $('#period-label').textContent = data.period.label;
  $('#nav-open-count').textContent = String(state.tasks.filter(task => task.status !== 'done' && task.approval === 'approved').length);
  $('#nav-pending-count').textContent = String(state.tasks.filter(task => ['pending','pending_completion'].includes(task.approval)).length);
  const pendingCount=state.tasks.filter(task => ['pending','pending_completion'].includes(task.approval)).length;
  $('#pending-trigger-count').textContent=String(pendingCount);
  $('#pending-trigger').classList.toggle('has-alerts',pendingCount>0);
  $('#pending-trigger').setAttribute('aria-label', `Xem ${pendingCount} công việc đang chờ duyệt`);
  $('#nav-done-count').textContent = String(state.tasks.filter(task => task.approval === 'approved' && task.status === 'done').length);
  const alarmItems=getAlarmItems();
  $('#nav-alarm-count').textContent=String(alarmItems.length);
  $('#alarm-trigger-count').textContent=String(alarmItems.length);
  $('#alarm-trigger').classList.toggle('has-alerts',alarmItems.length>0);

  $$('.segment').forEach(button => {
    const active = button.dataset.period === state.period;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  renderDashboard(data);
  renderPageMetrics(data);
  renderTables(data);
  renderAlarm();
  renderAudit();
}

// Thời điểm chờ duyệt tính từ lúc gửi Form, không phải ngày sửa chữa do người dùng điền.
function elapsedPendingHours(task){
  const from=new Date(task.createdAt || task.startedAt).getTime();
  return Number.isFinite(from) ? Math.max(0,(Date.now()-from)/3600000):0;
}
function getAlarmItems(){
  return state.tasks.flatMap(task=>{
    if(['pending','pending_completion'].includes(task.approval)){
      const hours=elapsedPendingHours(task); // Timestamp gửi Google Form / tạo trên web
      if(hours<=24) return [];
      const tier=hours>48?'pending48':'pending24';
      return [{task,hours,tier,level:hours>48?'Chờ duyệt quá 48h':'Chờ duyệt 24–48h',eventDate:task.createdAt||task.startedAt}];
    }
    if(task.approval!=='approved' || task.status==='done')return [];
    const hours=hoursElapsed(task); // Ngày giờ bắt đầu sửa chữa do người dùng nhập
    if(!Number.isFinite(hours)||hours<=24)return [];
    const tier=hours>48?'open48':'open24';
    const level=hours>72?'Chưa hoàn thành trên 72h':hours>48?'Chưa hoàn thành trên 48h':'Chưa hoàn thành 24–48h';
    return [{task,hours,tier,level,eventDate:task.startedAt}];
  }).sort((a,b)=>b.hours-a.hours);
}
function renderAlarm(){
  const items=getAlarmItems();
  for(const kind of ['pending24','pending48','open24','open48']) {
    const metric=document.getElementById('alarm-kpi-'+kind);
    if(metric)metric.textContent=String(items.filter(i=>i.tier===kind).length);
  }
  $('#alarm-list-count').textContent=String(items.length);
  $('#alarm-empty').hidden=items.length>0;
  $('#alarm-table-body').innerHTML=items.map(item=>`<tr class="rf-alert-row tier-${item.tier}" data-task-id="${escapeAttribute(item.task.id)}" tabindex="0" role="button" aria-label="Xem chi tiết ${escapeAttribute(item.task.location)}">
    <td><span class="rf-alert-tag tier-${item.tier}">${ICON('bell')} ${escapeHtml(item.level)}</span></td>
    <td><span class="location-cell"><strong>${escapeHtml(item.task.location)}</strong></span></td>
    <td>${escapeHtml(item.task.detail)}</td>
    <td>${['pending','pending_completion'].includes(item.task.approval)?(item.task.approval==='pending_completion'?'Chờ duyệt hoàn thành':'Pending'):'Chưa hoàn thành'}</td>
    <td><strong>${formatDuration(item.hours)}</strong></td><td>${formatDateWithSeconds(item.eventDate)}</td>
    <td><button type="button" class="table-action" data-alarm-task-id="${escapeAttribute(item.task.id)}" title="Xem công việc">${ICON('eye')}</button></td>
  </tr>`).join('');
}
async function refreshAudit(showSuccess=false){
  if(getDemoSession()?.role!=='admin')return;
  const logs=await SERVICE.loadAuditLogs();
  state.audit=logs;state.auditLoaded=true;renderAudit();
  if(showSuccess)showToast(`Đã tải ${logs.length} thao tác`);
}
function renderAudit(){
  const body=$('#history-table-body');
  if(!body)return;
  const query=searchable(state.auditSearch || '');
  const items=state.audit.filter(x=>!query||searchable([x.actor,x.location,x.detail,x.id,x.action,x.before,x.after].join(' ')).includes(query)).sort((a,b)=>new Date(b.at).getTime()-new Date(a.at).getTime());
  $('#history-count').textContent=String(items.length);
  $('#history-empty').hidden=items.length>0;
  const labels={APPROVED:'Đã duyệt',REJECTED:'Từ chối',COMPLETED:'Hoàn thành',REOPENED:'Hoàn tác',UPDATED:'Chỉnh sửa',CREATED:'Tạo công việc',SHEET_APPROVED:'Duyệt tại Sheet',SHEET_REJECTED:'Từ chối tại Sheet',SHEET_COMPLETED:'Hoàn thành tại Sheet',SHEET_REOPENED:'Hoàn tác tại Sheet',COMPLETION_REQUESTED:'Yêu cầu hoàn thành',COMPLETION_APPROVED:'Duyệt hoàn thành',COMPLETION_REJECTED:'Từ chối hoàn thành',SHEET_COMPLETION_APPROVED:'Sheet duyệt hoàn thành',SHEET_COMPLETION_REJECTED:'Sheet từ chối hoàn thành'};
  body.innerHTML=items.map(a=>`<tr>
    <td class="date-cell">${formatDate(a.at)}</td>
    <td><span class="rf-audit-action">${escapeHtml(labels[a.action]||a.action||'Thao tác')}</span></td>
    <td><strong>${escapeHtml(a.actor||'Không xác định')}</strong></td>
    <td><span class="location-cell"><strong>${escapeHtml(a.location||'—')}</strong></span></td>
    <td><div class="wrap-cell">${escapeHtml(a.detail||'—')}</div></td>
    <td>${escapeHtml(a.before||'—')} ${ICON('arrow')} ${escapeHtml(a.after||'—')}</td>
    <td>${getTask(a.id)?`<button class="table-action" data-audit-task-id="${escapeAttribute(a.id)}" title="Chi tiết công việc">${ICON('eye')}</button>`:`<span title="Bản ghi không còn trong danh sách hiện tại">${escapeHtml(a.id||'—').slice(0,18)}</span>`}</td>
  </tr>`).join('');
}

function renderDashboard(data) {
  const completionRate = percentage(data.cohortDone.length, data.created.length);
  const overdue = data.open.filter(task => hoursElapsed(task) > 24).length;

  $('#kpi-created').textContent = String(data.created.length);
  $('#kpi-open').textContent = String(data.open.length);
  $('#kpi-done').textContent = String(data.finished.length);
  $('#kpi-rate').textContent = `${completionRate}%`;

  renderTrendChart($('#trend-chart'), makeTrendBuckets(state.tasks.filter(task => !['pending','pending_completion','rejected'].includes(task.approval)), data.period));

  const donut = $('#donut');
  const rate = percentage(data.cohortDone.length, data.created.length);
  donut.style.background = data.created.length
    ? `conic-gradient(var(--green) 0% ${rate}%, var(--red) ${rate}% 100%)`
    : 'conic-gradient(#e7edf7 0% 100%)';
  $('#donut-number').textContent = `${rate}%`;
  $('#donut-done').textContent = String(data.cohortDone.length);
  $('#donut-open').textContent = String(data.open.length);

  const recent = [...state.tasks].filter(task => task.approval === 'approved')
    // Thứ tự hàng Google Sheets phản ánh thứ tự thêm từ Form/Dashboard
    .sort((left, right) => (Number(right.rowNumber) || 0) - (Number(left.rowNumber) || 0)
      || new Date(right.startedAt) - new Date(left.startedAt))
    .slice(0, 10);

  $('#recent-list').innerHTML = recent.map(task => {
    const done = task.status === 'done';

    return `<button class="recent-item" type="button" data-recent-id="${escapeAttribute(task.id)}">
      <span class="recent-indicator ${done ? 'done' : ''}">${ICON(done ? 'check-circle' : 'wrench')}</span>
      <span class="recent-item-main"><strong>${escapeHtml(task.location)}</strong><span>${escapeHtml(task.detail)}</span></span>
      <span class="recent-status ${done ? 'done' : ''}">${done ? 'Hoàn thành' : 'Đang xử lý'}</span>
    </button>`;
  }).join('');

  $('#health-old').textContent = String(overdue);
  $('#health-percent').textContent = `${percentage(overdue, data.open.length)}% cần ưu tiên`;
  $('#health-progress').style.width = `${percentage(overdue, data.open.length)}%`;
}

function renderPageMetrics(data) {
  const overdue = data.open.filter(task => hoursElapsed(task) > 24);
  const durations = data.finished.map(hoursElapsed).filter(Number.isFinite);
  const average = durations.length
    ? durations.reduce((sum, hours) => sum + hours, 0) / durations.length
    : NaN;

  $('#open-total').textContent = String(data.open.length);
  $('#open-overdue').textContent = String(overdue.length);
  $('#open-finished').textContent = String(data.finished.length);

  $('#done-total').textContent = String(data.finished.length);
  $('#done-average').textContent = Number.isFinite(average) ? formatDuration(average) : '—';
  $('#done-fast').textContent = String(durations.filter(hours => hours < 24).length);
}

function applySearch(tasks, searchString) {
  const query = searchable(searchString.trim());
  if (!query) return tasks;

  return tasks.filter(task => searchable([
    task.stt,
    task.id,
    task.location,
    task.detail,
    task.temporaryFix,
    task.remainingWork,
    task.initialWorker,
    task.assigneeEmail,
  ].join(' ')).includes(query));
}

function applySort(tasks, key, direction) {
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...tasks].sort((left, right) => {
    const leftValue = key === 'duration'
      ? (['pending','pending_completion','rejected'].includes(left.approval) ? elapsedPendingHours(left) : hoursElapsed(left))
      : new Date(['pending','pending_completion','rejected'].includes(left.approval) ? left.createdAt||left.startedAt : left.startedAt).getTime();
    const rightValue = key === 'duration'
      ? (['pending','pending_completion','rejected'].includes(right.approval) ? elapsedPendingHours(right) : hoursElapsed(right))
      : new Date(['pending','pending_completion','rejected'].includes(right.approval) ? right.createdAt||right.startedAt : right.startedAt).getTime();
    const delta = (Number.isFinite(leftValue) ? leftValue : 0) - (Number.isFinite(rightValue) ? rightValue : 0);
    return delta * multiplier || (Number(right.stt)||0)-(Number(left.stt)||0);
  });
}

function visibleTasks(type, data = selectedData()) {
  let tasks = type === 'open' ? data.open : type === 'pending' ? state.tasks.filter(task => ['pending','pending_completion','rejected'].includes(task.approval)) : data.finished;
  if(type==='pending' && state.pendingFilter!=='all'){
    const limit=Number(state.pendingFilter);
    tasks=tasks.filter(task=>['pending','pending_completion'].includes(task.approval) && elapsedPendingHours(task)>limit);
  }

  if (type === 'open') {
    if (state.openFilter === 'overdue') tasks = tasks.filter(task => hoursElapsed(task) > 24);
    if (state.openFilter === 'critical') tasks = tasks.filter(task => hoursElapsed(task) > 48);
  }

  tasks = applySearch(tasks, state.search[type]);
  return applySort(tasks, state.sort[type].key, state.sort[type].direction);
}

function renderTables(data = selectedData()) {
  const openTasks = visibleTasks('open', data);
  const doneTasks = visibleTasks('done', data);
  const pendingTasks = visibleTasks('pending', data);

  $('#open-table-body').innerHTML = openTasks.map(task => taskRow(task, 'open')).join('');
  $('#done-table-body').innerHTML = doneTasks.map(task => taskRow(task, 'done')).join('');
  $('#pending-table-body').innerHTML = pendingTasks.map(task => taskRow(task, 'pending')).join('');
  renderBulkState('open');
  renderBulkState('pending');
  renderBulkState('done');
  $('#pending-empty').hidden = pendingTasks.length !== 0;
  $('#pending-count').textContent = String(pendingTasks.filter(task=>['pending','pending_completion'].includes(task.approval)).length);
  $('#pending-footer').textContent = `Hiển thị ${pendingTasks.filter(task=>['pending','pending_completion'].includes(task.approval)).length} Pending và ${pendingTasks.filter(task=>task.approval==='rejected').length} Rejected`;
  const allReviewTasks = state.tasks.filter(task => ['pending','pending_completion','rejected'].includes(task.approval));
  $('#pending-metric-pending').textContent = String(allReviewTasks.filter(task => ['pending','pending_completion'].includes(task.approval)).length);
  $('#pending-metric-rejected').textContent = String(allReviewTasks.filter(task => task.approval === 'rejected').length);
  $('#pending-metric-all').textContent = String(allReviewTasks.length);

  $('#open-empty').hidden = openTasks.length !== 0;
  $('#done-empty').hidden = doneTasks.length !== 0;
  $('#open-count').textContent = String(openTasks.length);
  $('#done-count').textContent = String(doneTasks.length);
  $('#open-footer').textContent = `Hiển thị ${openTasks.length} / ${data.open.length} công việc`;
  $('#done-footer').textContent = `Hiển thị ${doneTasks.length} / ${data.finished.length} công việc`;

  $$('[data-open-filter]').forEach(button => {
    if (!button.classList.contains('filter-chip')) return;
    const active = button.dataset.openFilter === state.openFilter;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  $$('[data-pending-filter]').forEach(button=>{
    const selected=button.dataset.pendingFilter===state.pendingFilter;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-pressed',String(selected));
  });
  $$('[data-sort]').forEach(button => {
    const sort = state.sort[button.dataset.sort];
    const active = button.dataset.sortKey === sort.key;
    button.classList.toggle('sorted', active);
    button.querySelector('.sort-caret').textContent = !active
      ? '↕'
      : sort.direction === 'asc' ? '↑' : '↓';
  });
}

/** Quyền lựa chọn: chỉ task Pending hoặc task đã duyệt mới được xử lý hàng loạt. */
function canSelectForBulk(task, type) {
  if (!task?.id || !String(task.id).trim()) return false;
  const admin = getDemoSession()?.role === 'admin';
  // User được chọn công việc đang xử lý để gửi yêu cầu hoàn thành kèm ảnh.
  if (type === 'open') return task.approval === 'approved' && task.status !== 'done';
  if (!admin) return false;
  if (type === 'pending') return ['pending','pending_completion'].includes(task.approval);
  if (type === 'done') return task.approval === 'approved' && task.status === 'done';
  return false;
}

function renderBulkState(type) {
  const box = document.getElementById(`rf-bulk-${type}`);
  if (!box) return;
  const admin = getDemoSession()?.role === 'admin';
  const selected = state.selected[type];
  if (type === 'done') { // Trang Đã hoàn thành: nút X Hoàn tác thay checkbox.
    selected.clear();
    box.hidden = true;
    return;
  }
  // Bỏ ID không còn thuộc trạng thái xử lý hợp lệ, ví dụ đã duyệt/xóa.
  [...selected].forEach(id => { if (!canSelectForBulk(getTask(id), type)) selected.delete(id); });
  const count = selected.size;
  box.hidden = (type !== 'open' && !admin) || count === 0;
  const label = box.querySelector('[data-bulk-count]');
  if (label) label.textContent = `${count} công việc đã chọn`;
  box.querySelectorAll('[data-bulk-action]').forEach(btn => {
    btn.disabled = state.working || count === 0;
    if (btn.dataset.bulkAction === 'complete') {
      btn.hidden = false; // V32: từng việc có bộ ảnh riêng.
      btn.textContent = admin ? '✓ Xác nhận hoàn thành đã chọn' : '✓ Gửi yêu cầu hoàn thành đã chọn';
    }
  });
  const eligible = visibleTasks(type).filter(task => canSelectForBulk(task, type));
  const selectAll = document.querySelector(`[data-select-all][data-select-group="${type}"]`);
  if (selectAll) {
    selectAll.disabled = eligible.length === 0;
    selectAll.checked = eligible.length > 0 && eligible.every(task => selected.has(task.id));
    selectAll.indeterminate = !selectAll.checked && eligible.some(task => selected.has(task.id));
  }
  document.querySelectorAll(`[data-select-task][data-select-group="${type}"]`).forEach(cb => {
    const isSelected = selected.has(cb.dataset.selectTask);
    cb.checked = isSelected;
    cb.disabled = state.working;
    if (type === 'open') cb.closest('tr[data-task-id]')?.classList.toggle('rf-open-row-selected', isSelected);
  });
}

function askForBulkConfirmation(operation) {
  if (state.working || getDemoSession()?.role !== 'admin') return;
  const type = operation === 'approve' || operation === 'reject' ? 'pending'
    : operation === 'complete' ? 'open' : operation === 'reopen' ? 'done' : '';
  if (!type) return;
  const ids = [...state.selected[type]].filter(id => canSelectForBulk(getTask(id), type));
  if (!ids.length) { showToast('Hãy chọn ít nhất một công việc hợp lệ.', 'error'); return; }
  const labels = {approve:'phê duyệt', reject:'từ chối', complete:'hoàn thành', reopen:'hoàn tác'};
  const label = labels[operation];
  state.pendingConfirmation = {kind:'bulk', operation, type, ids};
  const dialog = $('#confirm-dialog');
  dialog.classList.toggle('rf-reject', operation === 'reject');
  dialog.classList.toggle('rf-approve', operation === 'approve');
  dialog.classList.toggle('undo', operation === 'reopen');
  $('#confirm-icon').querySelector('use').setAttribute('href', '#i-'+(operation === 'reject'?'x':'check-circle'));
  $('#confirm-title').textContent = `Xác nhận ${label} ${ids.length} công việc?`;
  $('#confirm-text').textContent = `Các thao tác sẽ được ghi lần lượt vào Google Sheets và lịch sử. Nếu một công việc lỗi, những công việc khác vẫn tiếp tục.`;
  const accept = $('#confirm-accept');
  accept.disabled = false;
  accept.removeAttribute('aria-busy');
  accept.textContent = `${label[0].toUpperCase()+label.slice(1)} ${ids.length} công việc`;
  showModal('confirm-dialog');
}

async function processBulkOperations({operation, type, ids}) {
  const failures = [];
  let completed = 0;
  // Thực hiện tuần tự để tránh Apps Script ScriptLock và xung đột xóa dòng Pending.
  for (let index = 0; index < ids.length; index++) {
    const id = ids[index];
    $('#confirm-text').textContent = `Đang xử lý ${index + 1}/${ids.length} công việc… (${completed} thành công)`;
    try {
      const task = getTask(id);
      if (!canSelectForBulk(task,type)) throw new Error('Trạng thái công việc đã thay đổi');
      if (operation === 'approve' || operation === 'reject') {
        await SERVICE.reviewTask(id, operation === 'approve');
      } else if(operation === 'reopen') {
        await setTaskCompletion(id, false);
      } else {
        throw new Error('Cần tải ảnh minh chứng riêng cho từng công việc trước khi hoàn thành.');
      }
      completed++;
      state.selected[type].delete(id);
    } catch (error) {
      failures.push(`${id}: ${error.message || error}`);
    }
  }
  return {completed, failures};
}

function taskRow(task, type) {
  const done = task.status === 'done';
  const pending = type === 'pending';
  const elapsed = pending ? elapsedPendingHours(task) : hoursElapsed(task);
  const elapsedClass = !done && elapsed > 48 ? 'critical' : !done && elapsed > 24 ? 'overdue' : '';
  const admin = getDemoSession()?.role === 'admin';
  const readOnly = !canWriteTasks();
  const email = escapeHtml(task.assigneeEmail);
  const emailLink = task.assigneeEmail
    ? `<a class="email-link" href="mailto:${escapeAttribute(task.assigneeEmail)}">${email}</a>`
    : '<span class="muted">—</span>';

  const actionButtons = `
    <div class="table-actions">
      <button class="table-action" type="button" data-action="details" data-id="${escapeAttribute(task.id)}" title="Xem chi tiết" aria-label="Xem chi tiết ${escapeAttribute(task.id)}">${ICON('eye')}</button>
      ${!pending && admin ? `<button class="table-action" type="button" data-action="edit" data-id="${escapeAttribute(task.id)}" title="Chỉnh sửa" aria-label="Chỉnh sửa ${escapeAttribute(task.id)}">${ICON('edit')}</button>` : ''}
      ${pending && admin && ['pending','pending_completion'].includes(task.approval) ? `<button class="table-action approve" type="button" data-action="approve" data-id="${escapeAttribute(task.id)}" title="Duyệt">${ICON('check')}</button><button class="table-action reject" type="button" data-action="reject" data-id="${escapeAttribute(task.id)}" title="Từ chối">${ICON('x')}</button>` : ''}

    </div>`;

  const selectCheck = type !== 'done' && canSelectForBulk(task, type)
    ? `<input type="checkbox" class="rf-completion-select" data-select-task="${escapeAttribute(task.id)}" data-select-group="${type}" aria-label="${type==='open'?'Chọn xác nhận hoàn thành':'Chọn xét duyệt'} ${escapeAttribute(task.location)}" ${state.selected[type].has(task.id)?'checked':''}>`
    : (pending ? '<span class="rf-empty-select">—</span>' : '');
  const completionCell = pending
    ? `<span class="rf-approval-tag ${task.approval === 'rejected' ? 'rejected' : task.approval==='pending_completion'?'rf-pending-completion':''}">${task.approval === 'rejected' ? ICON('x')+' Rejected' : task.approval==='pending_completion' ? ICON('clock')+' Chờ duyệt hoàn thành' : ICON('clock')+' Pending'}</span>`
    : done
      ? (admin
          ? `<div class="rf-reopen-cell"><button type="button" class="rf-reopen-icon" data-action="toggle" data-id="${escapeAttribute(task.id)}" title="Hoàn tác công việc ${escapeAttribute(task.location)}" aria-label="Hoàn tác hoàn thành ${escapeAttribute(task.location)}">${ICON('x')}</button><span class="rf-reopen-label">Hoàn tác</span></div>`
          : `<span class="rf-completion-done-label">Đã hoàn thành</span>`)
      : `<label class="rf-one-completion-cell">${selectCheck}</label>`;
  return `<tr class="rf-task-row rf-row-${pending ? (task.approval === 'rejected' ? 'rejected' : task.approval === 'pending_completion' ? 'pending-completion' : 'pending') : (done ? 'done' : 'open')}" data-task-id="${escapeAttribute(task.id)}">
    <td class="index-cell">${task.stt}</td>
    ${pending ? `<td class="rf-select-cell">${selectCheck}</td>` : ''}
    <td class="rf-completion-cell">${completionCell}</td>
    <td><span class="location-cell"><strong>${escapeHtml(task.location)}</strong></span></td>
    <td><div class="wrap-cell">${escapeHtml(task.detail) || '—'}</div></td>
    <td><div class="wrap-cell">${escapeHtml(task.temporaryFix) || '—'}</div></td>
    <td><div class="wrap-cell remaining-cell">${escapeHtml(task.remainingWork) || '—'}</div></td>
    <td>${escapeHtml(task.initialWorker) || '<span class="muted">—</span>'}</td>
    <td class="date-cell">${pending ? formatDateWithSeconds(task.createdAt||task.startedAt) : formatDate(task.startedAt)}</td>
    <td><span class="duration-cell rf-duration-${pending ? 'pending' : type === 'done' ? 'done' : 'open'} ${elapsedClass}">${ICON('clock')}${formatDuration(elapsed)}</span></td>
    <td>${emailLink}</td>
    ${type === 'done' ? `<td class="date-cell rf-completed-date">${formatDate(task.completedAt)}</td>` : ''}
    <td>${actionButtons}</td>
  </tr>`;
}

function reviewPending(action,id) {
  if (getDemoSession()?.role !== 'admin') {
    showToast('Chỉ Admin được duyệt hoặc từ chối công việc.', 'error');
    return;
  }
  const task = getTask(id);
  if (!task) { showToast('Không tìm thấy công việc cần xét duyệt.', 'error'); return; }
  if (!String(id || '').trim()) {
    showToast('Công việc chưa có RF_ID. Cần đồng bộ Google Form trước khi duyệt.', 'error');
    return;
  }
  askForConfirmation('review', id, action === 'approve');
}

function toggleSort(type, key) {
  const sort = state.sort[type];

  if (sort.key === key) sort.direction = sort.direction === 'asc' ? 'desc' : 'asc';
  else {
    sort.key = key;
    sort.direction = 'desc';
  }

  renderTables();
}

/* V17: Preview ảnh ngay khi chọn, xóa từng ảnh, sửa công việc vẫn kéo thả được. */
let rfSelectedImages = [];
let rfExistingImages = []; // {url, index} từ ảnh hiện có trên Drive
const rfObjectUrls = new Map();
let rfPreviewGeneration = 0;
const RF_MAX_IMAGES = 5;
const RF_MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const RF_MAX_UPLOAD_BYTES = 1900000;
const RF_ALLOWED_MIMES = ['image/jpeg','image/png','image/webp','image/gif'];

function rfResetImageSelections() {
  for (const url of rfObjectUrls.values()) URL.revokeObjectURL(url);
  rfObjectUrls.clear();
  rfSelectedImages = [];
  rfExistingImages = [];
  rfPreviewGeneration++;
}

function rfToggleOtherLocation() {
  const other = $('#rf-location').value === 'Other';
  $('#rf-location-other-wrap').hidden = !other;
  const input = $('#rf-location-other');
  input.required = other;
  if (!other) input.value = '';
}

function rfRenderSelectedImages() {
  const list=$('#rf-upload-list');
  const existing=rfExistingImages.map((item,i)=>`<div class="rf-image-chip">
    <div class="rf-image-thumb" data-existing-preview="${item.index}"><span>Đang tải ảnh…</span></div>
    <span class="rf-image-filename">Ảnh đã lưu ${item.index+1}</span>
    <button type="button" data-remove-existing="${i}" title="Bỏ ảnh này khỏi công việc" aria-label="Bỏ ảnh đã lưu ${i+1}">${ICON('x')}</button>
  </div>`).join('');
  const added=rfSelectedImages.map((file,i)=>{
    if(!rfObjectUrls.has(file))rfObjectUrls.set(file,URL.createObjectURL(file));
    return `<div class="rf-image-chip">
      <img class="rf-image-thumb" src="${escapeAttribute(rfObjectUrls.get(file))}" alt="Xem trước ${escapeAttribute(file.name)}">
      <span class="rf-image-filename">${escapeHtml(file.name)} <small>${(file.size/1048576).toFixed(1)} MB</small></span>
      <button type="button" data-remove-evidence="${i}" title="Xóa ảnh đã chọn" aria-label="Xóa ${escapeAttribute(file.name)}">${ICON('x')}</button>
    </div>`;
  }).join('');
  list.innerHTML = existing+added || '<p class="rf-image-empty">Chưa có ảnh nào được chọn</p>';
  const taskId=state.editingId;
  const generation=rfPreviewGeneration;
  if(taskId)rfExistingImages.forEach(item=>{
    SERVICE.loadEvidencePreview(taskId,item.index).then(data=>{
      if(rfPreviewGeneration!==generation || state.editingId!==taskId)return;
      const target=[...list.querySelectorAll('[data-existing-preview]')]
        .find(node=>Number(node.dataset.existingPreview)===item.index);
      if(!target)return;
      if(data?.dataUrl){
        const img=document.createElement('img');
        img.src=data.dataUrl;img.alt='Ảnh đã lưu';img.className='rf-image-thumb';
        target.replaceWith(img);
      }else target.textContent='Không xem trước được';
    }).catch(()=>{});
  });
}

function rfAddSelectedImages(files) {
  for (const file of files) {
    if (!RF_ALLOWED_MIMES.includes(file.type)) { showToast(`Không hỗ trợ ${file.name}. Chỉ JPG, PNG, WebP, GIF.`, 'error'); continue; }
    if (file.size > RF_MAX_SOURCE_BYTES) {showToast(`Ảnh ${file.name} vượt 20 MB.`, 'error'); continue;}
    if (rfExistingImages.length+rfSelectedImages.length >= RF_MAX_IMAGES) {showToast('Tối đa 5 ảnh cho mỗi công việc.', 'error'); break;}
    if (!rfSelectedImages.some(f=>f.name===file.name && f.size===file.size)) rfSelectedImages.push(file);
  }
  rfRenderSelectedImages();
}
function rfBindUploadControls() {
  $('#rf-location').addEventListener('change',rfToggleOtherLocation);
  const dropzone = $('#rf-dropzone'), input = $('#rf-upload-input');
  input.addEventListener('change', () => {rfAddSelectedImages(input.files);input.value='';});
  dropzone.addEventListener('keydown',e => {if (e.key==='Enter' || e.key===' ') {e.preventDefault();input.click();}});
  ['dragenter','dragover'].forEach(type=>dropzone.addEventListener(type,e=>{e.preventDefault();dropzone.classList.add('dragging');}));
  ['dragleave','drop'].forEach(type=>dropzone.addEventListener(type,e=>{e.preventDefault();dropzone.classList.remove('dragging');}));
  dropzone.addEventListener('drop',e=>rfAddSelectedImages(e.dataTransfer?.files||[]));
  $('#rf-upload-list').addEventListener('click',e=>{
    const existing=e.target.closest('[data-remove-existing]');
    if(existing){rfExistingImages.splice(Number(existing.dataset.removeExisting),1);rfPreviewGeneration++;rfRenderSelectedImages();return;}
    const picked=e.target.closest('[data-remove-evidence]');
    if(picked){
      const [file]=rfSelectedImages.splice(Number(picked.dataset.removeEvidence),1);
      if(file && rfObjectUrls.has(file)){URL.revokeObjectURL(rfObjectUrls.get(file));rfObjectUrls.delete(file);}
      rfPreviewGeneration++;rfRenderSelectedImages();
    }
  });
}


function rfReadDataUrl(blob) {
  return new Promise((resolve,reject)=>{
    const reader=new FileReader();
    reader.onload=()=>resolve(String(reader.result));
    reader.onerror=()=>reject(new Error('Không đọc được tệp ảnh.'));
    reader.readAsDataURL(blob);
  });
}
async function rfPrepareUpload(file) {
  if (file.size <= RF_MAX_UPLOAD_BYTES) return {name:file.name,dataUrl:await rfReadDataUrl(file)};
  if (file.type==='image/gif') throw new Error(`GIF ${file.name} quá 1,9 MB; hãy giảm kích thước trước khi tải.`);
  const bitmap=await createImageBitmap(file);
  try {
    const ratio=Math.min(1,1600/Math.max(bitmap.width,bitmap.height));
    const canvas=document.createElement('canvas');
    canvas.width=Math.max(1,Math.round(bitmap.width*ratio));
    canvas.height=Math.max(1,Math.round(bitmap.height*ratio));
    const context=canvas.getContext('2d');
    if(!context)throw new Error('Trình duyệt không hỗ trợ thu nhỏ ảnh.');
    context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(bitmap,0,0,canvas.width,canvas.height);
    for(const quality of [.85,.7,.55,.4]) {
      const blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/jpeg',quality));
      if(blob && blob.size<=RF_MAX_UPLOAD_BYTES) {
        return {name:file.name.replace(/\.[^.]+$/, '')+'.jpg',dataUrl:await rfReadDataUrl(blob)};
      }
    }
    throw new Error(`Không thể thu nhỏ ảnh ${file.name} xuống dưới 1,9 MB.`);
  } finally {bitmap.close();}
}

/* ------------------------------------------------------------------------
   Task editor: add / update
   ------------------------------------------------------------------------ */

function openTaskEditor(id = null) {
  if (!canWriteTasks() || (id && getDemoSession()?.role !== 'admin')) {
    showToast('Chỉ Admin được sửa trực tiếp công việc đã tạo.', 'error');
    return;
  }

  const form = $('#task-form');
  form.reset();
  state.editingId = id;
  $('#task-dialog-title').textContent = id ? 'Chỉnh sửa công việc' : (getDemoSession()?.role==='admin'?'Thêm công việc mới · Duyệt ngay':'Thêm công việc mới · Chờ duyệt');
  $('#rf-editor-subtitle').textContent = id ? 'Cập nhật thông tin công việc đã duyệt.' : getDemoSession()?.role==='admin' ? 'Admin tạo công việc · tự duyệt và lưu vào Monitor Sheet.' : 'Công việc mới được lưu vào Pending Sheet để Admin duyệt.';

  const task = id ? getTask(id) : null;
  if (id && !task) {
    showToast('Không tìm thấy công việc cần sửa.', 'error');
    return;
  }

  rfResetImageSelections();
  rfExistingImages=task ? (task.attachmentUrls||[]).map((url,index)=>({url,index})) : [];
  rfRenderSelectedImages();
  const locationControl = form.elements.namedItem('location');
  if (task && Array.from(locationControl.options).some(opt => opt.value === task.location)) {
    locationControl.value = task.location;
  } else if (task) {
    locationControl.value = 'Other';
    form.elements.namedItem('locationOther').value = task.location;
  } else locationControl.value = '';
  rfToggleOtherLocation();
  ['detail','temporaryFix','remainingWork','initialWorker','assigneeEmail'].forEach(name => {
    form.elements.namedItem(name).value = task?.[name] || '';
  });
  form.elements.namedItem('attachmentUrl').value = ''; // optional additional link; existing images shown separately
  form.elements.namedItem('startedAt').value = toDateTimeInput(task?.startedAt || new Date());
  $('#rf-upload-wrap').hidden = false;
  const limited = Boolean(id && getDemoSession()?.role !== 'admin');
  ['location','locationOther','detail','startedAt','attachmentUrl'].forEach(name => {form.elements.namedItem(name).disabled = limited;});
  $('#save-task-button').textContent = limited ? 'Gửi cập nhật' : 'Lưu công việc';

  showModal('task-dialog');
  window.setTimeout(() => form.elements.namedItem('location').focus(), 60);
}

async function submitTaskForm(event) {
  event.preventDefault();
  if (state.working) return;

  const formData = new FormData(event.currentTarget);
  const payload = {
    location: String(formData.get('location') === 'Other' ? formData.get('locationOther') : formData.get('location') || '').trim(),
    detail: String(formData.get('detail') || '').trim(),
    temporaryFix: String(formData.get('temporaryFix') || '').trim(),
    remainingWork: String(formData.get('remainingWork') || '').trim(),
    initialWorker: String(formData.get('initialWorker') || '').trim(),
    assigneeEmail: String(formData.get('assigneeEmail') || '').trim(),
    attachmentUrl: String(formData.get('attachmentUrl') || '').trim(),
    startedAt: parseVietnamLocalInput(String(formData.get('startedAt') || '')),
  };

  const progressOnly = Boolean(state.editingId && getDemoSession()?.role !== 'admin');
  if ((!progressOnly && (!payload.location || !payload.detail || !payload.initialWorker)) || !payload.temporaryFix || !payload.remainingWork) {
    showToast('Vui lòng nhập đầy đủ các trường bắt buộc.', 'error');
    return;
  }

  state.working = true;
  $('#save-task-button').disabled = true;

  try {
    {
      const links = rfExistingImages.map(item=>item.url);
      if (payload.attachmentUrl) links.push(payload.attachmentUrl);
      if (links.length + rfSelectedImages.length > RF_MAX_IMAGES) throw new Error('Chỉ được tối đa 5 ảnh mỗi công việc.');
      // Đo thời gian thực, không có sleep/delay cố định.
      const uploadStart=performance.now();
      const newImages=[...rfSelectedImages];
      const uploadedUrls=new Array(newImages.length);
      let finished=0;
      async function sendImage(i){
        const t0=performance.now();
        const prepared=await rfPrepareUpload(newImages[i]);
        const uploaded=await SERVICE.uploadEvidence(prepared);
        if(!uploaded?.url)throw new Error(`Không tải được ảnh ${i+1}: ${newImages[i].name}`);
        uploadedUrls[i]=uploaded.url;
        finished++;
        $('#save-task-button').textContent=`Đã tải ${finished}/${newImages.length} ảnh…`;
        console.info('[RepairFlow] Ảnh',i+1,'thời gian',Math.round(performance.now()-t0),'ms');
      }
      // Lượt đầu chạy riêng để tạo thư mục Drive an toàn; các lượt sau
      // tối đa 2 ảnh song song, không tạo hàng loạt Apps Script executions.
      if(newImages.length){
        $('#save-task-button').textContent=`Đang tải 1/${newImages.length} ảnh…`;
        await sendImage(0);
        for(let i=1;i<newImages.length;i+=2){
          await Promise.all(newImages.slice(i,i+2).map((_,k)=>sendImage(i+k)));
        }
      }
      links.push(...uploadedUrls.filter(Boolean));
      if(newImages.length)console.info('[RepairFlow] Tổng tải ảnh',Math.round(performance.now()-uploadStart),'ms');
      payload.attachmentUrl = [...new Set(links.filter(Boolean))].join('\n');
    }
    $('#save-task-button').textContent='Đang lưu công việc…';
    const wasEditing = Boolean(state.editingId);
    const saveStart=performance.now();
    if (wasEditing) await updateTask(state.editingId, payload);
    else await addTask(payload);
    console.info('[RepairFlow] Ghi task/API',Math.round(performance.now()-saveStart),'ms');

    closeModal('task-dialog');
    rfResetImageSelections();
    const adminCreates = getDemoSession()?.role==='admin' && !wasEditing;
    showToast(wasEditing ? 'Đã cập nhật công việc.' : adminCreates ? 'Đã tạo và duyệt công việc. Công việc nằm trong Monitor.' : 'Đã gửi công việc, đang chờ Admin duyệt.');
    navigate(wasEditing || adminCreates ? 'open' : 'pending');
    try {
      const refreshStart=performance.now();
      await refreshTasks(false, true);
      console.info('[RepairFlow] Tải lại danh sách',Math.round(performance.now()-refreshStart),'ms');
    } catch (refreshError) {
      console.warn('Đã lưu nhưng chưa tải được danh sách mới:', refreshError);
      showToast(`Đã lưu dữ liệu, nhưng chưa tải lại được danh sách: ${refreshError.message}`, 'error');
    }
  } catch (error) {
    showToast(error.message, 'error');
  } finally {
    state.working = false;
    $('#save-task-button').disabled = false;
    $('#save-task-button').textContent = 'Lưu công việc';
  }
}

/* V32 — Mỗi task một bộ 1–5 ảnh; hỗ trợ một hoặc nhiều công việc.
 * Không gọi API hàng loạt thiếu minh chứng: mỗi task gửi API completion riêng.
 */
let rfCompletionFiles = [];
let rfCompletionTaskId = null;
let rfCompletionBatchIds = [];
let rfCompletionStepIndex = 0;
const rfCompletionFileSets = new Map();
const rfCompletionUploaded = new Map();
const rfCompletionObjectUrls = new Map();

function rfResetCompletionProof(){
  for(const url of rfCompletionObjectUrls.values()) URL.revokeObjectURL(url);
  rfCompletionObjectUrls.clear();
  rfCompletionFiles=[];
  rfCompletionTaskId=null;
  rfCompletionBatchIds=[];
  rfCompletionStepIndex=0;
  rfCompletionFileSets.clear();
  rfCompletionUploaded.clear();
}

function rfStoreCompletionStep(){
  if(rfCompletionTaskId)rfCompletionFileSets.set(rfCompletionTaskId, [...rfCompletionFiles]);
}

function rfRenderCompletionFiles(){
  const list=document.getElementById('rf-completion-images');
  if(!list)return;
  list.innerHTML=rfCompletionFiles.length
    ? rfCompletionFiles.map((file,index)=>{
        if(!rfCompletionObjectUrls.has(file))rfCompletionObjectUrls.set(file,URL.createObjectURL(file));
        return `<div class="rf-image-chip"><img class="rf-image-thumb" src="${escapeAttribute(rfCompletionObjectUrls.get(file))}" alt="Ảnh ${index+1}"><span class="rf-image-filename">${escapeHtml(file.name)} (${(file.size/1048576).toFixed(1)} MB)</span><button type="button" data-rf-remove-completion="${index}" aria-label="Xóa ảnh">${ICON('x')}</button></div>`;
      }).join('')
    : '<div class="rf-proof-empty">Chưa chọn ảnh minh chứng. Hãy kéo thả hoặc chọn ít nhất 1 ảnh để tiếp tục.</div>';
  document.getElementById('rf-completion-count').textContent=`${rfCompletionFiles.length}/5 ảnh`;
  const valid=rfCompletionFiles.length>=1&&rfCompletionFiles.length<=5;
  const atLast=rfCompletionStepIndex===rfCompletionBatchIds.length-1;
  const prev=document.getElementById('rf-completion-prev');
  const next=document.getElementById('rf-completion-next');
  const submit=document.getElementById('rf-completion-submit');
  prev.hidden=rfCompletionBatchIds.length<2||rfCompletionStepIndex===0;
  next.hidden=atLast;
  submit.hidden=!atLast;
  prev.disabled=state.working;
  next.disabled=!valid||state.working;
  submit.disabled=!valid||state.working;
  const admin=getDemoSession()?.role==='admin';
  submit.textContent=rfCompletionBatchIds.length>1
    ? (admin?`Xác nhận ${rfCompletionBatchIds.length} công việc`:`Gửi ${rfCompletionBatchIds.length} yêu cầu hoàn thành`)
    : (admin?'Xác nhận hoàn thành':'Gửi yêu cầu hoàn thành');
}

function rfAddCompletionFiles(files){
  if(state.working)return;
  for(const file of files){
    if(!RF_ALLOWED_MIMES.includes(file.type)||file.size>RF_MAX_SOURCE_BYTES){
      showToast('Ảnh phải là JPG, PNG, WebP hoặc GIF và không quá 20 MB.','error');continue;
    }
    if(rfCompletionFiles.length>=5){showToast('Tối đa 5 ảnh minh chứng cho một công việc.','error');break;}
    if(!rfCompletionFiles.some(f=>f.name===file.name&&f.size===file.size))rfCompletionFiles.push(file);
  }
  rfCompletionUploaded.delete(rfCompletionTaskId); // Thay đổi bộ ảnh => không tái sử dụng link upload cũ.
  rfStoreCompletionStep();
  rfRenderCompletionFiles();
}

function rfLoadCompletionStep(index){
  rfStoreCompletionStep();
  rfCompletionStepIndex=index;
  const id=rfCompletionBatchIds[index];
  const task=getTask(id);
  rfCompletionTaskId=id;
  rfCompletionFiles=[...(rfCompletionFileSets.get(id)||[])];
  const admin=getDemoSession()?.role==='admin';
  const total=rfCompletionBatchIds.length;
  document.getElementById('rf-completion-title').textContent=total===1
    ? (admin?'Xác nhận hoàn thành công việc':'Gửi yêu cầu hoàn thành')
    : (admin?'Xác nhận nhiều công việc':'Gửi nhiều yêu cầu hoàn thành');
  document.getElementById('rf-completion-hint').textContent=admin
    ? 'Admin: ảnh minh chứng được lưu cho từng công việc, sau đó hoàn thành ngay.'
    : 'User: ảnh của từng công việc sẽ được gửi để Admin duyệt hoàn thành.';
  const marker=document.getElementById('rf-completion-step');
  marker.hidden=total<=1;
  marker.textContent=`Công việc ${index+1}/${total} · Mỗi công việc cần ảnh riêng`;
  document.getElementById('rf-completion-task').textContent=task
    ? `${task.location} · ${task.detail}` : `Công việc ${index+1}`;
  document.getElementById('rf-completion-progress').textContent='';
  rfRenderCompletionFiles();
}

function rfOpenCompletionDialog(ids){
  const batch=[...new Set(Array.isArray(ids)?ids:[ids])].filter(id=>canSelectForBulk(getTask(id),'open'));
  if(!batch.length)return showToast('Không tìm thấy công việc đang xử lý hợp lệ.','error');
  rfResetCompletionProof();
  rfCompletionBatchIds=batch;
  rfCompletionStepIndex=0;
  rfCompletionTaskId=null;
  rfLoadCompletionStep(0);
  showModal('rf-completion-dialog');
}

function rfNextCompletionStep(){
  if(state.working)return;
  if(rfCompletionFiles.length<1)return showToast('Cần ít nhất một ảnh cho công việc này.','error');
  rfStoreCompletionStep();
  if(rfCompletionStepIndex<rfCompletionBatchIds.length-1)rfLoadCompletionStep(rfCompletionStepIndex+1);
}

function rfPreviousCompletionStep(){
  if(state.working)return;
  if(rfCompletionStepIndex>0)rfLoadCompletionStep(rfCompletionStepIndex-1);
}

/** Tải từng ảnh lên Drive (không gửi blob vào Google Sheets).
 *  Tệp đầu tiên tải riêng để tránh tạo trùng folder Drive khi chưa khởi tạo.
 *  Các ảnh còn lại tối đa 2 request song song, giữ đúng thứ tự link minh chứng.
 *  Những ảnh đã tải thành công được nhớ trong popup để không phải tải lại khi retry.
 */
async function rfUploadCompletionEvidence(taskId, files, progress, taskIndex, totalTasks){
  const cached=rfCompletionUploaded.get(taskId)||[];
  const urls=Array.from({length:files.length},(_,i)=>cached[i]||null);
  let uploaded=urls.filter(Boolean).length;
  const uploadOne=async i=>{
    progress.textContent=`Công việc ${taskIndex+1}/${totalTasks}: đang xử lý ảnh ${i+1}/${files.length} (${uploaded}/${files.length} đã tải)…`;
    const started=performance.now();
    const payload=await rfPrepareUpload(files[i]);
    const response=await SERVICE.uploadEvidence(payload);
    if(!response?.url)throw new Error(`Không tải được ảnh ${i+1}`);
    urls[i]=response.url;
    rfCompletionUploaded.set(taskId,urls.slice());
    uploaded++;
    progress.textContent=`Công việc ${taskIndex+1}/${totalTasks}: đã tải ${uploaded}/${files.length} ảnh`;
    console.info('[RepairFlow] Tải ảnh minh chứng', {index:i+1,ms:Math.round(performance.now()-started)});
  };
  if(!urls[0])await uploadOne(0);
  for(let i=1;i<files.length;i+=2){
    const jobs=[];
    for(let j=i;j<Math.min(files.length,i+2);j++)if(!urls[j])jobs.push(uploadOne(j));
    // allSettled đợi cả hai ảnh: nếu một ảnh lỗi, ảnh kia vẫn được ghi nhớ để retry.
    const results=await Promise.allSettled(jobs);
    const failed=results.find(result=>result.status==='rejected');
    if(failed)throw failed.reason;
  }
  if(urls.some(url=>!url))throw new Error('Còn ảnh minh chứng chưa tải thành công');
  return urls;
}

async function rfSubmitCompletion(e){
  e.preventDefault();
  if(state.working||!rfCompletionBatchIds.length)return;
  rfStoreCompletionStep();
  const missing=rfCompletionBatchIds.findIndex(id=>(rfCompletionFileSets.get(id)||[]).length<1);
  if(missing>=0){
    rfLoadCompletionStep(missing);
    showToast('Mỗi công việc cần từ 1 đến 5 ảnh minh chứng trước khi gửi.','error');
    return;
  }
  const progress=document.getElementById('rf-completion-progress');
  const batch=[...rfCompletionBatchIds];
  const errors=[];
  const doneIds=[];
  const admin=getDemoSession()?.role==='admin';
  state.working=true;
  progress.textContent=`Bắt đầu tải ảnh minh chứng cho ${batch.length} công việc…`;
  rfRenderCompletionFiles();
  try{
    for(let index=0;index<batch.length;index++){
      const id=batch[index],task=getTask(id),files=rfCompletionFileSets.get(id)||[];
      if(!task||task.approval!=='approved'||task.status==='done'){
        errors.push({id,error:'Trạng thái công việc đã thay đổi'});continue;
      }
      try{
        const taskStart=performance.now();
        const urls=await rfUploadCompletionEvidence(id,files,progress,index,batch.length);
        const uploadMs=Math.round(performance.now()-taskStart);
        progress.textContent=`Công việc ${index+1}/${batch.length}: đã tải ảnh, đang cập nhật trạng thái…`;
        const confirmStart=performance.now();
        await SERVICE.setTaskCompletion(id,true,urls);
        console.info('[RepairFlow] Hoàn thành', {
          task:task.location, imageCount:files.length, uploadMs,
          confirmMs:Math.round(performance.now()-confirmStart),
          totalMs:Math.round(performance.now()-taskStart)
        });
        doneIds.push(id);
        state.selected.open.delete(id);
      }catch(error){errors.push({id,error:error.message||String(error)});}
    }
  }finally{state.working=false;}
  if(doneIds.length){
    void refreshTasks(false,true).catch(error=>console.warn('Chưa thể làm mới bảng:',error));
  }
  if(!errors.length){
    closeModal('rf-completion-dialog');
    rfResetCompletionProof();
    showToast(admin
      ? `Đã xác nhận hoàn thành ${doneIds.length} công việc cùng ảnh minh chứng.`
      : `Đã gửi ${doneIds.length} yêu cầu hoàn thành kèm ảnh để Admin duyệt.`);
    navigate(admin?'done':'pending');
  }else{
    // Giữ lại công việc lỗi để người dùng thử lại, KHÔNG gửi lại công việc đã thành công.
    rfCompletionBatchIds=errors.map(x=>x.id);
    rfCompletionStepIndex=0;rfCompletionTaskId=null;
    rfLoadCompletionStep(0);
    const details=errors.map(x=>`${getTask(x.id)?.location||x.id}: ${x.error}`).join('; ');
    progress.textContent=`${doneIds.length} thành công, ${errors.length} chưa được ghi.`;
    showToast(`${doneIds.length}/${batch.length} công việc thành công. ${details}`,'error');
  }
  renderTables();
}

function rfBindCompletionControls(){
  const dialog=document.getElementById('rf-completion-dialog');
  const drop=document.getElementById('rf-completion-drop'),input=document.getElementById('rf-completion-file');
  input.addEventListener('change',()=>{rfAddCompletionFiles(input.files);input.value='';});
  for(const eventName of ['dragenter','dragover'])drop.addEventListener(eventName,e=>{e.preventDefault();drop.classList.add('dragging');});
  for(const eventName of ['dragleave','drop'])drop.addEventListener(eventName,e=>{e.preventDefault();drop.classList.remove('dragging');});
  drop.addEventListener('drop',e=>rfAddCompletionFiles(e.dataTransfer.files||[]));
  drop.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();input.click();}});
  document.getElementById('rf-completion-next').addEventListener('click',rfNextCompletionStep);
  document.getElementById('rf-completion-prev').addEventListener('click',rfPreviousCompletionStep);
  document.getElementById('rf-completion-images').addEventListener('click',e=>{
    const button=e.target.closest('[data-rf-remove-completion]');if(!button||state.working)return;
    const index=Number(button.dataset.rfRemoveCompletion),file=rfCompletionFiles[index];
    if(file){const url=rfCompletionObjectUrls.get(file);if(url)URL.revokeObjectURL(url);rfCompletionObjectUrls.delete(file);}
    rfCompletionFiles.splice(index,1);rfCompletionUploaded.delete(rfCompletionTaskId);
    rfStoreCompletionStep();rfRenderCompletionFiles();
  });
  dialog.addEventListener('submit',rfSubmitCompletion);
  dialog.addEventListener('close',()=>{if(!state.working)rfResetCompletionProof();});
}

/* ------------------------------------------------------------------------
   Task details and completion confirmation
   ------------------------------------------------------------------------ */

function handleRowAction(action, id) {
  if (action === 'edit') openTaskEditor(id);
  else if (action === 'details') showTaskDetails(id);
  else if (action === 'toggle') {
    const task=getTask(id);
    if(!task || task.approval!=='approved')return showToast('Công việc chưa ở trạng thái đang sửa chữa.','error');
    if(task.status==='done'){if(getDemoSession()?.role==='admin')askForConfirmation('completion',id);}
    else rfOpenCompletionDialog(id);
  }
  else if (action === 'approve' || action === 'reject') {if (getDemoSession()?.role === 'admin') reviewPending(action,id);}
}

function showTaskDetails(id) {
  const task = getTask(id);
  if (!task) return;

  state.detailId = id;
  const done = task.status === 'done' && task.approval === 'approved';
  const links = (task.attachmentUrls?.length ? task.attachmentUrls : [task.attachmentUrl])
    .map(safeHttpUrl).filter(Boolean);
  $('#detail-dialog-title').textContent = task.location;
  $('#detail-subtitle').textContent = task.approval === 'rejected' ? 'Công việc bị từ chối' : ['pending','pending_completion'].includes(task.approval) ? (task.approval==='pending_completion'?'Yêu cầu hoàn thành chờ Admin duyệt':'Công việc chờ duyệt') : done ? 'Công việc đã hoàn thành' : 'Công việc đang xử lý';

  const field = (title, value, full = false) => `
    <div class="detail-field ${full ? 'full' : ''}">
      <span>${escapeHtml(title)}</span>
      <strong>${value || '—'}</strong>
    </div>`;

  $('#detail-body').innerHTML = `
    <div class="detail-status"><span class="status-pill ${task.approval === 'rejected' ? 'rejected' : ['pending','pending_completion'].includes(task.approval) ? 'pending' : done ? 'done' : ''}">${ICON(task.approval === 'rejected' ? 'x' : done ? 'check-circle' : 'clock')}${task.approval === 'pending' ? 'Pending' : task.approval === 'pending_completion' ? 'Chờ duyệt hoàn thành' : task.approval === 'rejected' ? 'Rejected' : done ? 'Đã hoàn thành' : 'Đang xử lý'}</span></div>
    ${task.approval==='pending' && task.proposedChanges ? `<p class="rf-approval-tag">Nội dung đề xuất: ${escapeHtml(JSON.stringify(task.proposedChanges))}</p>` : ''}
    <div class="detail-fields">
      ${field('Nội dung công việc', escapeHtml(task.detail), true)}
      ${field('Đã sửa chữa tạm thế nào?', escapeHtml(task.temporaryFix), true)}
      ${field('Việc còn lại cần xử lý', escapeHtml(task.remainingWork), true)}
      ${field('Người thực hiện', escapeHtml(task.initialWorker))}
      ${field('Email người follow', escapeHtml(task.assigneeEmail))}
      ${field('Bắt đầu sửa chữa', formatDate(task.startedAt))}
      ${field('Thời gian xử lý', formatDuration(hoursElapsed(task)))}
      ${done ? field('Hoàn thành lúc', formatDate(task.completedAt)) : ''}
      ${links.length ? field('Minh chứng', `<div class="rf-evidence-grid">${links.map((link, index) => `<div class="rf-evidence-item" data-evidence-index="${index}"><div class="rf-evidence-status">Đang tải ảnh ${index+1}…</div><a href="${escapeAttribute(link)}" target="_blank" rel="noopener noreferrer">Mở tệp gốc ↗</a></div>`).join('')}</div>`, true) : ''}
      ${task.completionEvidenceUrls?.length ? field(task.approval==='pending_completion'?'Ảnh đề nghị hoàn thành (đang chờ duyệt)':'Ảnh minh chứng hoàn thành', `<div class="rf-evidence-grid">${task.completionEvidenceUrls.map((link,index)=>`<div class="rf-evidence-item rf-completion-evidence-item" data-completion-index="${index}"><div class="rf-evidence-status">Đang tải ảnh ${index+1}…</div><a href="${escapeAttribute(safeHttpUrl(link))}" target="_blank" rel="noopener noreferrer">Mở ảnh ↗</a></div>`).join('')}</div>`, true) : ''}
    </div>`;

  $('#detail-edit-button').hidden = task.approval!=='approved' || (getDemoSession()?.role!=='admin'&&done);
  $('#detail-edit-button').textContent = getDemoSession()?.role==='admin'?'Chỉnh sửa':'Yêu cầu hoàn thành';
  showModal('detail-dialog');
  if (links.length && CONFIG.DATA_SOURCE === 'api') {
    renderEvidencePreviews(task.id, links);
  }
  if(task.completionEvidenceUrls?.length&&CONFIG.DATA_SOURCE==='api')renderCompletionEvidencePreviews(task.id,task.completionEvidenceUrls);
}

async function renderCompletionEvidencePreviews(taskId,urls){
  for(let i=0;i<urls.length;i++){
    const box=[...document.querySelectorAll('.rf-completion-evidence-item')]
      .find(el=>Number(el.dataset.completionIndex)===i);
    if(!box||state.detailId!==taskId)return;
    try{
      const result=await SERVICE.loadCompletionEvidencePreview(taskId,i);
      if(!box.isConnected||state.detailId!==taskId)return;
      if(/^data:image\/(?:png|jpeg|gif|webp);base64,/.test(result?.dataUrl||'')){
        const img=document.createElement('img');img.src=result.dataUrl;
        img.className='rf-evidence-image';img.alt='Ảnh minh chứng hoàn thành';
        box.querySelector('.rf-evidence-status')?.replaceWith(img);
      }else box.querySelector('.rf-evidence-status').textContent=result?.message||'Không thể xem trước';
    }catch(e){if(box.isConnected)box.querySelector('.rf-evidence-status').textContent='Không thể tải ảnh';}
  }
}

const evidencePreviewCache = new Map();

async function renderEvidencePreviews(taskId, links) {
  for (let index = 0; index < links.length; index++) {
    if (state.detailId !== taskId) return;
    const card = [...document.querySelectorAll('.rf-evidence-item')]
      .find(el => Number(el.dataset.evidenceIndex) === index);
    if (!card) return;
    const status = card.querySelector('.rf-evidence-status');
    try {
      // Cache within the current page session to avoid re-downloading Drive previews
      // whenever the same work order popup is reopened.
      const cacheKey = `${taskId}:${index}:${links[index]}`;
      if (!evidencePreviewCache.has(cacheKey)) {
        const promise = loadEvidencePreview(taskId, index);
        evidencePreviewCache.set(cacheKey, promise);
        promise.catch(() => evidencePreviewCache.delete(cacheKey));
      }
      const result = await evidencePreviewCache.get(cacheKey);
      if (state.detailId !== taskId || !card.isConnected) return;
      if (typeof result.dataUrl === 'string' &&
          /^data:image\/(?:png|jpeg|gif|webp);base64,[A-Za-z0-9+/=]+$/.test(result.dataUrl)) {
        const img = document.createElement('img');
        img.className = 'rf-evidence-image';
        img.alt = `Ảnh minh chứng ${index+1}`;
        img.loading = 'lazy';
        img.src = result.dataUrl;
        status.replaceWith(img);
      } else {
        status.textContent = result.message || 'Không thể xem trực tiếp ảnh này.';
      }
    } catch(err) {
      if (status.isConnected) status.textContent = 'Không tải được ảnh minh chứng.';
      console.warn('Evidence preview error', err);
    }
  }
}


function askForConfirmation(kind, id = null, approve = true) {
  const task = id ? getTask(id) : null;
  if ((kind === 'completion' || kind === 'review') && getDemoSession()?.role !== 'admin') {
    showToast('Chỉ Admin được thực hiện thao tác này.', 'error');
    return;
  }
  if ((kind === 'completion' || kind === 'review') && !task) {
    showToast('Không tìm thấy công việc.', 'error');
    return;
  }
  if (kind === 'completion' && task?.approval !== 'approved') {
    showToast('Công việc chưa được Admin duyệt.', 'error');
    return;
  }
  if (kind === 'review' && !['pending','pending_completion'].includes(task?.approval)) {
    showToast('Chỉ có thể duyệt hoặc từ chối công việc đang Pending.', 'error');
    return;
  }
  state.pendingConfirmation = {kind, id, approve};
  const undo = kind === 'completion' && task.status === 'done';
  const rejecting = kind === 'review' && !approve;
  const dialog = $('#confirm-dialog');
  dialog.classList.toggle('undo', undo || kind === 'reset');
  dialog.classList.toggle('rf-reject', rejecting);
  dialog.classList.toggle('rf-approve', kind === 'review' && approve);
  const icon = kind === 'reset' ? 'refresh' : (rejecting ? 'x' : undo ? 'undo' : 'check-circle');
  $('#confirm-icon').querySelector('use').setAttribute('href', '#i-' + icon);
  $('#confirm-title').textContent = kind === 'reset' ? 'Khôi phục dữ liệu mẫu?'
    : kind === 'review' ? (task.approval==='pending_completion' ? (approve?'Duyệt hoàn thành kèm ảnh?':'Từ chối yêu cầu hoàn thành?') : (approve ? 'Phê duyệt công việc?' : 'Từ chối công việc?'))
    : undo ? 'Hoàn tác hoàn thành?' : 'Xác nhận hoàn thành?';
  $('#confirm-text').textContent = kind === 'reset'
    ? 'Bạn muốn khôi phục toàn bộ dữ liệu mẫu trên trình duyệt này?'
    : kind === 'review'
      ? (task.approval==='pending_completion' ? `Bạn muốn ${approve?'xác nhận':'từ chối'} yêu cầu hoàn thành công việc “${task.location}”?` : `Bạn chắc chắn muốn ${approve ? 'phê duyệt' : 'từ chối'} công việc “${task.location}”?`)
      : undo
        ? `Đưa công việc “${task.location}” trở lại danh sách đang xử lý?`
        : `Xác nhận công việc “${task.location}” đã hoàn thành?`;
  const accept = $('#confirm-accept');
  accept.disabled = false;
  accept.removeAttribute('aria-busy');
  accept.textContent = kind === 'reset' ? 'Khôi phục'
    : kind === 'review' ? (approve ? 'Duyệt công việc' : 'Từ chối công việc')
    : undo ? 'Hoàn tác' : 'Xác nhận';
  showModal('confirm-dialog');
}

async function acceptConfirmation() {
  if (state.working || !state.pendingConfirmation) return;
  const {kind, id, approve, operation, type, ids} = state.pendingConfirmation;
  const task = id ? getTask(id) : null;
  const accept = $('#confirm-accept');
  state.working = true;
  accept.disabled = true;
  accept.setAttribute('aria-busy', 'true');
  accept.textContent = 'Đang xử lý…'; // Hiển thị tức thì, không có setTimeout chờ.
  $('#confirm-text').textContent = 'Đang gửi yêu cầu tới Google Sheets qua Cloudflare. Vui lòng không gửi lại.';
  try {
    let message;
    if (kind === 'bulk') {
      const result = await processBulkOperations({operation,type,ids});
      message = `Đã xử lý ${result.completed}/${ids.length} công việc.`;
      if (result.failures.length) message += `\n${result.failures.length} lỗi: ${result.failures.slice(0,4).join('\n')}`;
    } else if (kind === 'reset') {
      await resetDemoData();
      message = 'Đã khôi phục dữ liệu mẫu.';
    } else if (kind === 'review') {
      if (!task) throw new Error('Không tìm thấy công việc cần duyệt.');
      // Chỉ một request ghi. Thành công sẽ thông báo trước khi tải lại danh sách.
      await SERVICE.reviewTask(id, approve);
      message = task.approval==='pending_completion'
        ? (approve?'Đã duyệt hoàn thành kèm ảnh. Công việc ở Monitor Sheet, trạng thái Hoàn thành.':'Đã từ chối hoàn thành. Công việc trở lại Monitor để tiếp tục sửa chữa.')
        : (approve?'Đã phê duyệt công việc. Dữ liệu được chuyển sang Monitor.':'Đã từ chối công việc. Công việc vẫn ở Pending Sheet.');
    } else {
      if (!task) throw new Error('Không tìm thấy công việc.');
      await setTaskCompletion(id, task.status !== 'done');
      message = task.status === 'done'
        ? 'Đã hoàn tác hoàn thành công việc.'
        : 'Đã xác nhận hoàn thành công việc.';
    }
    closeModal('confirm-dialog');
    showToast(message, kind === 'bulk' && message.includes(' lỗi:') ? 'error' : 'success'); // Popup kết quả từng công việc.
    // Không giữ popup chờ lượt GET /tasks sau khi đã ghi thành công.
    // Kết quả trên Sheet được tải lại và cập nhật bảng ngay khi API trả về.
    void refreshTasks(false, true).catch(refreshError => {
      console.warn('Ghi dữ liệu thành công nhưng tải lại chậm/thất bại:', refreshError);
      showToast(`Đã ghi thay đổi, nhưng chưa cập nhật danh sách: ${refreshError.message}`, 'error');
    });
  } catch (error) {
    closeModal('confirm-dialog');
    showToast(error.message, 'error');
  } finally {
    state.pendingConfirmation = null;
    state.working = false;
    accept.disabled = false;
    accept.removeAttribute('aria-busy');
    accept.textContent = 'Xác nhận';
  }
}

/* ------------------------------------------------------------------------
   Xuất XLSX thực (XML Unicode trong ZIP), không có lỗi font CSV.
   Không dùng CDN, không yêu cầu kết nối Internet bổ sung.
   ------------------------------------------------------------------------ */
/** Export có bố cục bảng Google Form/Sheet, đầy đủ tiêu đề và màu theo trạng thái.
 *  Export: phạm vi trang/bộ lọc hiện tại. Export All: tất cả Pending + Monitor + Alarm + History.
 */
function rfExportColumns(){
  return ['Timestamp','Khu vực sửa chữa tạm','Nội dung công việc','Đã sửa chữa tạm như thế nào?',
    'Việc còn lại cần xử lý','Người thực hiện ban đầu','Ngày bắt đầu sửa chữa tạm',
    'Giờ bắt đầu sửa chữa tạm','Email người sẽ tiếp nhận','Link ảnh','RF_ID',
    'Trạng thái công việc','Bộ đếm','RF_Version','RF_Source','RF_ApprovalStatus','RF_RequestedBy',
    'Ảnh minh chứng hoàn thành','Thời điểm yêu cầu hoàn thành','Tài khoản yêu cầu hoàn thành'];
}
function rfDateParts(when){
  if(!when || !Number.isFinite(new Date(when).getTime()))return ['',''];
  const parts=new Intl.DateTimeFormat('en-GB',{
    timeZone:CONFIG.TIME_ZONE,day:'2-digit',month:'2-digit',year:'numeric',
    hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23',
  }).formatToParts(new Date(when));
  const v=k=>parts.find(p=>p.type===k)?.value||'00';
  return [`${v('day')}/${v('month')}/${v('year')}`,`${v('hour')}:${v('minute')}:${v('second')}`];
}
function rfTaskExportRow(task){
  const [date,time]=rfDateParts(task.startedAt);
  return [formatDateWithSeconds(task.createdAt||task.startedAt),task.location,task.detail,
    task.temporaryFix,task.remainingWork,task.initialWorker,date,time,
    task.assigneeEmail,task.attachmentUrls?.join('\n')||task.attachmentUrl,
    task.id,task.status==='done'?'Hoàn thành':'Chưa hoàn thành',
    formatDuration(['pending','pending_completion'].includes(task.approval)?elapsedPendingHours(task):hoursElapsed(task)),
    task.version,task.source,task.approval,task.requestedBy,
    (task.completionEvidenceUrls||[]).join('\n'),formatDateWithSeconds(task.completionRequestedAt),task.completionRequestedBy];
}
function rfSheetForTasks(tasks,kind,title){
  return {kind,sheetName:({all:'Tổng hợp',charts:'Dashboard',pending:'Pending Sheet',open:'Sửa chữa tạm',done:'Đã hoàn thành'})[kind]||'Monitor Sheet',
    title,subtitle:`RepairFlow · ${tasks.length} công việc · Xuất lúc ${formatDateWithSeconds(new Date())}`,
    headers:rfExportColumns(),rows:tasks.map(rfTaskExportRow)};
}
function rfAlarmExportSheet(){
  return {kind:'alarm',sheetName:'Alarm',title:'CẢNH BÁO CÔNG VIỆC QUÁ HẠN',
    subtitle:'Cam: chờ duyệt · Đỏ: chưa hoàn thành · Mốc thời gian tính theo giờ thực tế',
    headers:['Mức độ','RF_ID','Khu vực sửa chữa tạm','Nội dung công việc','Trạng thái',
      'Thời gian tính từ mốc','Thời điểm gửi / Bắt đầu'],
    rows:getAlarmItems().map(({task,level,hours,eventDate})=>[level,task.id,task.location,task.detail,
      ['pending','pending_completion'].includes(task.approval)?(task.approval==='pending_completion'?'Chờ duyệt hoàn thành':'Pending'):'Chưa hoàn thành',formatDuration(hours),formatDateWithSeconds(eventDate)])};
}
function rfAuditExportSheet(logs){
  const ordered=[...logs].sort((a,b)=>new Date(b.at)-new Date(a.at));
  return {kind:'history',sheetName:'Lịch sử thao tác',title:'LỊCH SỬ THAO TÁC REPAIRFLOW',
    subtitle:'Mới nhất ở trên · Tài khoản được xác thực từ Cloudflare Worker',
    headers:['Thời gian','Hành động','Tài khoản thao tác','RF_ID','Vị trí','Nội dung công việc','Trước','Sau','Nguồn','Ghi chú'],
    rows:ordered.map(a=>[formatDateWithSeconds(a.at),a.action,a.actor,a.id,a.location,a.detail,a.before,a.after,a.source||'',a.note||''])};
}
async function exportXlsx(type) {
  const all=type==='everything';
  let sheets=[];
  if(all){
    sheets=[
      rfSheetForTasks(state.tasks.filter(t=>['pending','pending_completion','rejected'].includes(t.approval)),'pending','PENDING SHEET · CÔNG VIỆC CHỜ DUYỆT'),
      rfSheetForTasks(state.tasks.filter(t=>t.approval==='approved'),'all','MONITOR SHEET · CÔNG VIỆC ĐÃ DUYỆT'),
      rfAlarmExportSheet(),
    ];
    if(getDemoSession()?.role==='admin'){
      let audit=state.audit;
      if(!state.auditLoaded){audit=await SERVICE.loadAuditLogs();state.audit=audit;state.auditLoaded=true;}
      sheets.push(rfAuditExportSheet(audit));
    }
  }else if(type==='history'){
    const q=searchable(state.auditSearch||'');
    sheets=[rfAuditExportSheet(state.audit.filter(a=>!q||searchable([a.actor,a.location,a.detail,a.id,a.action,a.before,a.after].join(' ')).includes(q)))];
  }else if(type==='alarm')sheets=[rfAlarmExportSheet()];
  else if(type==='charts'){
    const selected=selectedData();
    sheets=[rfSheetForTasks(selected.created,'charts','DASHBOARD · CÔNG VIỆC PHÁT SINH TRONG KỲ')];
  }else{
    const names={open:'CÔNG VIỆC SỬA CHỮA TẠM',pending:'CÔNG VIỆC CHỜ DUYỆT',done:'CÔNG VIỆC ĐÃ HOÀN THÀNH'};
    sheets=[rfSheetForTasks(visibleTasks(type),type,names[type]||'REPAIRFLOW')];
  }
  const total=sheets.reduce((n,s)=>n+s.rows.length,0);
  if(!total){showToast('Không có công việc để xuất Excel.','error');return;}
  downloadXlsx({sheets,fileName:`RepairFlow-${all?'Export-All':type}-${new Date().toISOString().slice(0,10)}.xlsx`});
  showToast(`Đã xuất ${total} dòng trên ${sheets.length} Sheet · Excel XLSX giữ nguyên tiếng Việt có dấu.`);
}

/* ------------------------------------------------------------------------
   Dialogs & toast notifications
   ------------------------------------------------------------------------ */

function showModal(id) {
  const dialog = document.getElementById(id);
  if (dialog && !dialog.open) dialog.showModal();
}

function closeModal(id) {
  const dialog = document.getElementById(id);
  if (dialog?.open) dialog.close();
}

function showToast(message, type = 'success', customTitle = '') {
  // Các luồng cũ tiếp tục gọi showToast như trước; riêng Import có tiêu đề rõ ràng.
  const dialog = $('#rf-message-dialog');
  const error = type === 'error';
  dialog.dataset.type = error ? 'error' : 'success';
  $('#rf-message-title').textContent = customTitle || (error ? 'Có lỗi xảy ra' : 'Thao tác thành công');
  $('#rf-message-text').textContent = String(message || '');
  $('#rf-message-icon').setAttribute('href', error ? '#i-alert' : '#i-check-circle');
  if (!dialog.open) dialog.showModal();
}


/* ------------------------------------------------------------------------
   V29 — BULK XLSX IMPORT
   Uses existing POST /tasks API; authorization stays on Cloudflare Worker.
   Rows are saved in sequence, so any failure can be retried without
   re-sending successful rows from this preview.
   ------------------------------------------------------------------------ */
const RF_IMPORT_HEADERS = [
  'Khu vực sửa chữa tạm','Nội dung công việc','Đã sửa chữa tạm như thế nào?',
  'Việc còn lại cần xử lý','Người thực hiện ban đầu','Ngày bắt đầu sửa chữa tạm',
  'Giờ bắt đầu sửa chữa tạm','Email người sẽ tiếp nhận','Link ảnh'
];
const rfImportState = {rows:[],busy:false,progress:''};
const rfImportAliases = [
  ['khu vuc sua chua tam','vi tri','location'],
  ['noi dung cong viec','detail'],
  ['da sua chua tam nhu the nao','da sua chua tam the nao','temporaryfix'],
  ['viec con lai can xu ly','remainingwork'],
  ['nguoi thuc hien ban dau','nguoi thuc hien','initialworker'],
  ['ngay bat dau sua chua tam','startdate'],
  ['gio bat dau sua chua tam','starttime'],
  ['email nguoi se tiep nhan','email nguoi follow','assigneeemail'],
  ['link anh','link hinh anh','attachmenturl'],
];
function rfNormalizeColumn(v){return String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().replace(/[^a-z0-9]/g,'');}
function rfImportColumns(row){
  const normalized=row.values.map(rfNormalizeColumn);
  const idx=rfImportAliases.map(aliases=>normalized.findIndex(c=>aliases.map(rfNormalizeColumn).includes(c)));
  return idx.slice(0,5).every(x=>x>=0)?idx:null;
}
function rfExcelDate(v){
  let s=String(v||'').trim();if(!s)return '';
  if(/^\d+(?:\.\d+)?$/.test(s)){
    const n=Number(s);if(n>=20000&&n<100000){const d=new Date(Date.UTC(1899,11,30)+Math.trunc(n)*86400000);return d.toISOString().slice(0,10);}
  }
  let m=s.match(/^(\d{4})[/-](\d{1,2})[/-](\d{1,2})/);
  if(m)return `${m[1]}-${m[2].padStart(2,'0')}-${m[3].padStart(2,'0')}`;
  m=s.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if(m){let a=Number(m[1]),b=Number(m[2]);
    const day=a>12?a:b>12?b:a,month=a>12?b:b>12?a:b;
    return `${m[3]}-${String(month).padStart(2,'0')}-${String(day).padStart(2,'0')}`;}
  throw new Error('Ngày phải theo YYYY-MM-DD hoặc DD/MM/YYYY');
}
function rfExcelClock(v){
  const s=String(v||'').trim();if(!s)return '';
  if(/^\d+(?:\.\d+)?$/.test(s)){
    const n=Number(s), sec=Math.round((n-Math.floor(n))*86400)%86400;
    return `${String(Math.floor(sec/3600)).padStart(2,'0')}:${String(Math.floor(sec%3600/60)).padStart(2,'0')}`;
  }
  const match=s.match(/^(\d{1,2}):(\d{2})(?::\d{2})?\s*(AM|PM)?$/i);
  if(!match)throw new Error('Giờ phải theo HH:mm (ví dụ 14:30)');
  let hour=Number(match[1]);const minute=Number(match[2]);
  if(match[3])hour=hour%12+(match[3].toUpperCase()==='PM'?12:0);
  if(hour>23||minute>59)throw new Error('Giờ không hợp lệ');
  return `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;
}
function rfImportPayload(values,indexes){
  const get=i=>indexes[i]>=0?String(values[indexes[i]]||'').trim():'';
  const location=get(0),detail=get(1),temporaryFix=get(2),remainingWork=get(3),initialWorker=get(4);
  if(!location||!detail||!temporaryFix||!remainingWork||!initialWorker)throw new Error('Thiếu khu vực, nội dung, cách sửa tạm, việc còn lại hoặc người thực hiện');
  if(location.length>150||initialWorker.length>150||detail.length>2000||temporaryFix.length>2000||remainingWork.length>2000)throw new Error('Một trường nội dung vượt giới hạn');
  const assigneeEmail=get(7),attachmentUrl=get(8);
  if(assigneeEmail&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(assigneeEmail))throw new Error('Email không hợp lệ');
  const urls=attachmentUrl.split(/[\s,;]+/).filter(Boolean);
  if(urls.length>5||urls.some(url=>!/^https:\/\/[^\s]+$/i.test(url)))throw new Error('Tối đa 5 link ảnh HTTPS hợp lệ');
  const current=toDateTimeInput(new Date());
  const day=rfExcelDate(get(5))||current.slice(0,10);
  const clock=rfExcelClock(get(6))||current.slice(11,16);
  const iso=parseVietnamLocalInput(`${day}T${clock}`);
  if(!Number.isFinite(new Date(iso).getTime())||new Date(iso).getTime()>Date.now()+60000)throw new Error('Thời gian bắt đầu trong tương lai hoặc không hợp lệ');
  return {project:location,location,detail,temporaryFix,remainingWork,initialWorker,startedAt:iso,assigneeEmail,attachmentUrl};
}
function rfImportKey(payload){return [payload.location,payload.detail,payload.temporaryFix,payload.remainingWork,payload.initialWorker,payload.startedAt].map(x=>String(x||'').trim().toLowerCase()).join('|');}
function rfOpenImport(){
  if(!canWriteTasks())return showToast('Nguồn dữ liệu hiện tại không cho phép tạo công việc','error');
  showModal('rf-import-dialog');
}
function rfImportNote(msg,error=false){const el=$('#rf-import-note');el.textContent=msg;el.classList.toggle('is-error',error);}
function rfImportTemplate(){
  // File mẫu được tạo và kiểm tra bằng thư viện tạo Excel chuẩn; không dùng
  // lại bộ xuất báo cáo cho file nhập để tránh lỗi cấu trúc XLSX.
  const link=document.createElement('a');
  link.href=new URL('./assets/RepairFlow-Import-Template.xlsx',window.location.href).href;
  link.download='RepairFlow-Import-Template.xlsx';
  document.body.appendChild(link);link.click();link.remove();
}

async function rfImportFile(file){
  if(rfImportState.busy)return;
  rfImportState.progress='';rfImportState.rows=[];$('#rf-import-preview').hidden=true;$('#rf-import-save').disabled=true;
  rfImportNote(`Đang đọc ${file?.name||'file'}…`);
  try{
    const sheetRows=await readXlsxRows(file);
    let header=-1,indexes;
    for(let i=0;i<Math.min(20,sheetRows.length);i++){
      const map=rfImportColumns(sheetRows[i]);if(map){header=i;indexes=map;break;}
    }
    if(header<0)throw new Error('Không tìm thấy hàng tiêu đề giống Google Form. Hãy dùng file mẫu RepairFlow.');
    const records=sheetRows.slice(header+1).filter(row=>row.values.some(v=>String(v||'').trim()));
    if(!records.length)throw new Error('File chỉ có tiêu đề, chưa có công việc để nhập');
    if(records.length>200)throw new Error('Mỗi lần chỉ nhập tối đa 200 công việc');
    const seen=new Set();
    rfImportState.rows=records.map(record=>{
      try{
        const payload=rfImportPayload(record.values,indexes);const key=rfImportKey(payload);
        if(seen.has(key))throw new Error('Dòng trùng nội dung trong cùng file');
        seen.add(key);
        return {line:record.number,payload,valid:true,selected:true,status:'ready',message:'Hợp lệ'};
      }catch(error){
        const get=i=>indexes[i]>=0?String(record.values[indexes[i]]||'').trim():'';
        return {line:record.number,valid:false,selected:false,status:'invalid',message:error.message,
          payload:{location:get(0),detail:get(1),temporaryFix:get(2),remainingWork:get(3),initialWorker:get(4),
            startedAt:'',assigneeEmail:get(7),attachmentUrl:get(8)}};
      }
    });
    rfRenderImport();rfImportNote(`Đã kiểm tra ${records.length} dòng. Chỉ những dòng hợp lệ, được chọn mới được lưu.`);
  }catch(error){rfImportNote(error.message,true);}
}
function rfRenderImport(){
  const rows=rfImportState.rows,valid=rows.filter(x=>x.valid).length,invalid=rows.length-valid,
    selected=rows.filter(x=>x.valid&&x.selected&&x.status!=='saved').length;
  $('#rf-import-preview').hidden=rows.length===0;
  $('#rf-import-summary').textContent=`${rows.length} dòng · ${valid} hợp lệ · ${invalid} lỗi · ${selected} được chọn`;
  const saved=rows.filter(x=>x.status==='saved').length;
  $('#rf-import-progress').textContent=rfImportState.busy?(rfImportState.progress||'Đang nhập…') :saved?`${saved} đã nhập · ${selected} chưa nhập`:`${selected} công việc sẵn sàng nhập`;
  $('#rf-import-save').disabled=rfImportState.busy||selected===0;
  $('#rf-import-select-all').disabled=rfImportState.busy;
  $('#rf-import-table-body').innerHTML=rows.map((entry,i)=>{
    const p=entry.payload||{};
    const status=entry.status==='saved'?'Đã lưu':entry.status==='failed'?'Lỗi lưu':entry.valid?'Hợp lệ':'Không hợp lệ';
    return `<tr class="rf-import-${entry.status}">
      <td><input type="checkbox" data-rf-import-select="${i}" ${entry.selected?'checked':''} ${!entry.valid||entry.status==='saved'||rfImportState.busy?'disabled':''} aria-label="Chọn dòng Excel ${entry.line}"></td>
      <td>${entry.line}</td><td><span class="rf-import-state">${status}</span><small>${escapeHtml(entry.message)}</small></td>
      <td>${escapeHtml(p.location||'—')}</td><td>${escapeHtml(p.detail||'—')}</td><td>${escapeHtml(p.temporaryFix||'—')}</td>
      <td>${escapeHtml(p.remainingWork||'—')}</td><td>${escapeHtml(p.initialWorker||'—')}</td>
      <td>${p.startedAt?escapeHtml(formatDateWithSeconds(p.startedAt)):'—'}</td>
      <td>${escapeHtml(p.assigneeEmail||'—')}</td><td>${escapeHtml(p.attachmentUrl||'—')}</td></tr>`;
  }).join('');
}
async function rfCommitImport(){
  if(rfImportState.busy)return;
  const todo=rfImportState.rows.filter(x=>x.valid&&x.selected&&x.status!=='saved');
  if(!todo.length)return;
  rfImportState.busy=true;
  rfImportState.progress='Chuẩn bị nhập…';
  let done=0,failed=0;
  $('#rf-import-save').disabled=true;
  rfImportNote(`Đang nhập ${todo.length} công việc. Không đóng popup trong lúc lưu…`);
  try {
    for(const [i,row] of todo.entries()){
      rfImportState.progress=`Đang lưu ${i+1}/${todo.length}…`;
      $('#rf-import-progress').textContent=rfImportState.progress;
      try {
        await SERVICE.addTask(row.payload);
        row.status='saved';row.selected=false;row.message='Đã tạo công việc';done++;
      } catch(error) {
        row.status='failed';row.message=error.message;failed++;
      }
      rfRenderImport();
    }
  } finally {
    rfImportState.busy=false;
    rfRenderImport();
  }

  // Chỉ đóng khi tất cả công việc đã chọn được ghi thành công.
  // Nếu có lỗi: giữ popup và bảng xem trước để người dùng thử lại đúng các dòng lỗi.
  if(failed){
    rfImportState.progress=`Đã nhập ${done}/${todo.length}; ${failed} lỗi`;
    rfImportNote(`Đã lưu ${done} công việc, còn ${failed} dòng lỗi. Kiểm tra từng dòng rồi nhấn Xác nhận nhập để thử lại; các dòng đã lưu không được gửi lại.`,true);
    rfRenderImport();
    if(done)refreshTasks(false,true).catch(error=>console.warn('[RepairFlow] Không thể tải lại danh sách:',error));
    return;
  }

  // Đóng popup IMPORT trước khi mở popup THÀNH CÔNG.
  closeModal('rf-import-dialog');
  rfImportState.rows=[];
  rfImportState.progress='';
  $('#rf-import-file').value='';
  rfImportNote('Chưa chọn file Excel. Bạn có thể tải mẫu và điền nhiều dòng trước khi import.');
  rfRenderImport();

  const admin=getDemoSession()?.role==='admin';
  showToast(
    `Đã nhập thành công ${done} công việc từ Excel vào Google Sheets. ` +
      (admin?'Công việc được duyệt và đưa vào trang Công việc sửa chữa tạm.':'Công việc đã được chuyển vào Chờ duyệt.'),
    'success',
    admin?'Đã cập nhật công việc sửa chữa tạm':'Đã gửi công việc chờ duyệt'
  );
  // Tải lại sau khi hiện kết quả để người dùng không đợi thêm một vòng API.
  refreshTasks(false,true).catch(error=>console.warn('[RepairFlow] Đã lưu dữ liệu, không thể tải lại danh sách:',error));
}
function rfBindImport(){
  $('#rf-import-download').addEventListener('click',rfImportTemplate);
  $('#rf-import-file').addEventListener('change',ev=>{
    const file=ev.target.files?.[0];if(file)rfImportFile(file);
    ev.target.value='';
  });
  const target=$('#rf-import-drop');
  ['dragenter','dragover'].forEach(name=>target.addEventListener(name,ev=>{ev.preventDefault();target.classList.add('dragging');}));
  ['dragleave','drop'].forEach(name=>target.addEventListener(name,ev=>{ev.preventDefault();target.classList.remove('dragging');}));
  target.addEventListener('drop',ev=>{if(ev.dataTransfer?.files?.[0])rfImportFile(ev.dataTransfer.files[0]);});
  target.addEventListener('keydown',ev=>{if(ev.key==='Enter'||ev.key===' '){ev.preventDefault();$('#rf-import-file').click();}});
  $('#rf-import-select-all').addEventListener('click',()=>{
    const rows=rfImportState.rows.filter(r=>r.valid&&r.status!=='saved');
    const all=rows.every(r=>r.selected);rows.forEach(r=>r.selected=!all);
    rfRenderImport();
  });
  $('#rf-import-table-body').addEventListener('change',ev=>{
    const cb=ev.target.closest('[data-rf-import-select]');if(!cb||rfImportState.busy)return;
    const item=rfImportState.rows[Number(cb.dataset.rfImportSelect)];
    if(item&&item.valid&&item.status!=='saved'){item.selected=cb.checked;rfRenderImport();}
  });
  $('#rf-import-save').addEventListener('click',rfCommitImport);
  const dialog=$('#rf-import-dialog');
  dialog.addEventListener('cancel',ev=>{if(rfImportState.busy)ev.preventDefault();});
  dialog.querySelectorAll('[data-close-modal]').forEach(btn=>btn.addEventListener('click',ev=>{
    if(rfImportState.busy){ev.preventDefault();ev.stopImmediatePropagation();rfImportNote('Đang lưu. Vui lòng đợi thao tác đang thực hiện xong.',true);}
  },true));
}

init();
