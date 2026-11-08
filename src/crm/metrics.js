// Pulls the key numbers out of an uploaded export so the branded PDF report
// can show them. Works on CSV text (and Excel, which arrives as CSV per sheet):
// finds the table, totals each numeric column (or uses the export's own
// "Total" / "Grand total" row), and suggests the usual headline metrics for
// Google Analytics and Meta. The user confirms or edits before saving.

export function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i += 1; } else if (ch === '"') quoted = false; else cell += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ',' || ch === '\t') { row.push(cell); cell = ''; }
    else if (ch === '\n' || ch === '\r') {
      if (ch === '\r' && text[i + 1] === '\n') i += 1;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.map((r) => r.map((c) => c.trim()));
}

// "1,240" → 1240; "$1,200.50" → 1200.5; "12.5%" → 12.5; "0.125" stays.
export function toNumber(v) {
  if (v === null || v === undefined) return null;
  const s = String(v).trim().replace(/[,\s]/g, '').replace(/^\$/, '').replace(/%$/, '');
  if (!s || !/^-?\d*\.?\d+(e-?\d+)?$/i.test(s)) return null;
  return Number(s);
}

const AVG = /rate|%|ctr|average|avg|per |cpm|cpc|cost per|frequency|duration|position|bounce/i;
const MONEY = /amount spent|spend|cost|revenue|cpc|cpm|value|budget|\(usd\)|\$/i;
const PCT = /rate|ctr|%|percentage/i;
const TOTAL_ROW = /^(grand )?totals?$|^all$/i;

// Headline metrics in the order we'd put them in a client report.
const PRIORITY = [
  /^sessions$/i, /^(total )?users$/i, /^active users$/i, /^new users$/i, /^engaged sessions$/i, /^engagement rate$/i,
  /^key events$|^conversions$/i, /^(views|page ?views|screen ?page ?views)$/i,
  /^reach$|accounts reached/i, /^impressions$/i, /^results$/i, /^link clicks$|^clicks/i, /^ctr/i, /amount spent/i, /cost per result/i,
  /follow/i, /^likes|reactions/i, /comments/i, /shares/i, /^(post )?engagement$/i, /video views|plays/i,
];
const rank = (label) => { const i = PRIORITY.findIndex((r) => r.test(label)); return i < 0 ? 99 : i; };

function ymdFrom(s) {
  const t = String(s || '').trim();
  let m = t.match(/^(\d{4})(\d{2})(\d{2})$/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = t.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
  return '';
}

// Date range of the export: GA4 writes "# Start date: 20261001" comment lines;
// Meta exports have "Reporting starts" / "Reporting ends" columns.
export function detectPeriod(text) {
  const start = text.match(/#\s*Start date:\s*(\S+)/i);
  const end = text.match(/#\s*End date:\s*(\S+)/i);
  if (start || end) return { period_start: ymdFrom(start?.[1]), period_end: ymdFrom(end?.[1]) };
  const rows = parseCsv(text.split('\n').slice(0, 5).join('\n'));
  const head = rows[0] || [];
  const si = head.findIndex((h) => /reporting starts/i.test(h));
  const ei = head.findIndex((h) => /reporting ends/i.test(h));
  if (si >= 0 || ei >= 0) return { period_start: ymdFrom(rows[1]?.[si]), period_end: ymdFrom(rows[1]?.[ei]) };
  return { period_start: '', period_end: '' };
}

// The first table in the text: a header row followed by rows with numbers.
function findTable(text) {
  const lines = text.split(/\r?\n/);
  const blocks = [];
  let cur = [];
  for (const line of lines) {
    if (/^\s*#/.test(line) || !line.trim()) { if (cur.length) blocks.push(cur); cur = []; } else cur.push(line);
  }
  if (cur.length) blocks.push(cur);
  for (const block of blocks) {
    const rows = parseCsv(block.join('\n')).filter((r) => r.some((c) => c));
    if (rows.length < 2) continue;
    const header = rows[0];
    const body = rows.slice(1).filter((r) => r.length >= Math.min(header.length, 2));
    if (header.length >= 2 && body.some((r) => r.some((c) => toNumber(c) !== null))) return { header, body };
  }
  return null;
}

export function extractMetrics(text) {
  const table = findTable(text);
  if (!table) return { metrics: [], breakdown: null };
  const { header, body } = table;
  // The dimension column: first non-date column whose values are mostly text
  // (channel, campaign, page…). Totals rows are matched in that column.
  const DATEISH = /reporting (starts|ends)|date|^day$|^month$|^week$/i;
  const dim = header.findIndex((h, i) => !DATEISH.test(h) && body.filter((r) => toNumber(r[i]) === null && r[i]).length >= body.length * 0.6);
  const dimIsText = dim >= 0;
  const isTotal = (r) => dimIsText && TOTAL_ROW.test(r[dim] || '');
  const totalRow = body.find(isTotal) || null;
  const dataRows = body.filter((r) => !isTotal(r));

  const metrics = [];
  header.forEach((h, col) => {
    if (!h || col === dim || DATEISH.test(h) || /id$/i.test(h)) return;
    const raw = dataRows.map((r) => r[col]);
    const nums = raw.map(toNumber).filter((n) => n !== null);
    if (nums.length < Math.max(1, raw.filter((x) => x !== '' && x !== undefined).length * 0.6)) return;
    const looksPct = PCT.test(h) || raw.some((x) => /%$/.test(String(x || '')));
    const looksMoney = MONEY.test(h) || raw.some((x) => /^\$/.test(String(x || '')));
    let value;
    if (totalRow && toNumber(totalRow[col]) !== null) value = toNumber(totalRow[col]);
    else if (AVG.test(h) || looksPct) value = nums.reduce((a, b) => a + b, 0) / nums.length;
    else value = nums.reduce((a, b) => a + b, 0);
    // GA writes rates as fractions (0.4919); show them as percentages.
    if (looksPct && value <= 1 && nums.every((n) => n <= 1)) value *= 100;
    const label = h.replace(/\s*\((usd|\$)\)\s*$/i, '').trim();
    const frac = looksPct && nums.every((n) => n <= 1);
    metrics.push({ label, value: Math.round(value * 100) / 100, unit: looksPct ? '%' : looksMoney ? '$' : '', include: false, rank: rank(label), col, frac });
  });
  [...metrics].sort((a, b) => a.rank - b.rank).slice(0, 6).forEach((m) => { if (m.rank < 99 || metrics.length <= 6) m.include = true; });
  if (!metrics.some((m) => m.include)) metrics.slice(0, 4).forEach((m) => { m.include = true; });

  // Top rows by the first included metric, for a small table in the PDF.
  let breakdown = null;
  if (dimIsText && dataRows.length >= 2) {
    const chosen = metrics.filter((m) => m.include).slice(0, 3);
    if (chosen.length) {
      const cell = (m, v) => { const n = toNumber(v); return n === null ? String(v ?? '') : formatMetric(m.frac ? n * 100 : n, m.unit); };
      const sorted = [...dataRows].sort((a, b) => (toNumber(b[chosen[0].col]) || 0) - (toNumber(a[chosen[0].col]) || 0)).slice(0, 8);
      const dimName = header[dim].replace(/\s*\(.*\)\s*$/, '').trim();
      breakdown = { title: `By ${dimName.toLowerCase()}`, columns: [dimName, ...chosen.map((m) => m.label)], rows: sorted.map((r) => [r[dim], ...chosen.map((m) => cell(m, r[m.col]))]) };
    }
  }
  return { metrics: metrics.map(({ rank: _r, col: _c, frac: _f, ...m }) => m), breakdown };
}

export function formatMetric(value, unit) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '—';
  if (unit === '%') return `${n.toFixed(n >= 10 ? 1 : 2)}%`;
  if (unit === '$') return `$${n.toLocaleString('en-US', { minimumFractionDigits: n < 1000 ? 2 : 0, maximumFractionDigits: n < 1000 ? 2 : 0 })}`;
  return Math.abs(n) >= 100 || Number.isInteger(n) ? Math.round(n).toLocaleString('en-US') : n.toLocaleString('en-US', { maximumFractionDigits: 2 });
}

// Month a source belongs to: the month its data ends in.
export const monthOf = (src) => String(src.period_end || src.period_start || src.created_at || '').slice(0, 7);
export const monthLabel = (ym) => (ym ? new Date(`${ym}-15T12:00:00`).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '');
export function prevMonth(ym) {
  const [y, m] = ym.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 2, 1));
  return d.toISOString().slice(0, 7);
}
