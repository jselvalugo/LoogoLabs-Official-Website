// Builds the branded Loogo Labs status report PDF in the browser (jsPDF,
// loaded only when a report is downloaded). Letter size, points.

import { SOURCE_KINDS, stageInfo } from './entities';
import { formatMetric, monthLabel, monthOf, prevMonth } from './metrics';

const C = {
  forest: [45, 59, 31], amber: [201, 149, 42], cream: [244, 242, 238], paper: [250, 249, 246],
  ink: [26, 26, 24], muted: [110, 108, 102], line: [228, 225, 218], white: [255, 255, 255],
  green: [31, 107, 53], greenBg: [231, 243, 234], red: [180, 35, 24], redBg: [246, 233, 231], amberBg: [253, 240, 221], amberInk: [138, 90, 11],
};
const HEALTH = {
  on_track: { label: 'On track', fg: C.green, bg: C.greenBg },
  at_risk: { label: 'At risk', fg: C.amberInk, bg: C.amberBg },
  off_track: { label: 'Off track', fg: C.red, bg: C.redBg },
};
const AGENCY = { name: 'Loogo Labs LLC', site: 'www.loogolabs.com', email: 'david@loogolabs.com' };

const longDay = (ymd) => (ymd ? new Date(`${String(ymd).slice(0, 10)}T12:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');
const kindLabel = (k) => SOURCE_KINDS.find((x) => x.id === k)?.label || 'Other';

async function urlToDataUrl(url) {
  const res = await fetch(url);
  const blob = await res.blob();
  return new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(String(r.result)); r.onerror = reject; r.readAsDataURL(blob); });
}

// Any image (SVG included) → PNG data URL on a canvas, so jsPDF can embed it.
async function toPng(src, size = 256, background = null) {
  if (!src) return null;
  try {
    const dataUrl = src.startsWith('data:') ? src : await urlToDataUrl(src);
    const img = await new Promise((resolve, reject) => { const i = new Image(); i.onload = () => resolve(i); i.onerror = reject; i.src = dataUrl; });
    const canvas = document.createElement('canvas');
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (background) { ctx.fillStyle = background; ctx.fillRect(0, 0, size, size); }
    const w = img.naturalWidth || size;
    const h = img.naturalHeight || size;
    const scale = Math.min(size / w, size / h);
    ctx.drawImage(img, (size - w * scale) / 2, (size - h * scale) / 2, w * scale, h * scale);
    return canvas.toDataURL('image/png');
  } catch { return null; }
}

// Change vs the same metric last month: percent for counts, points for rates.
function change(metric, prev) {
  if (!prev || !Number.isFinite(prev.value)) return null;
  const d = metric.value - prev.value;
  if (metric.unit === '%') return { text: `${d >= 0 ? '+' : ''}${d.toFixed(1)} pts`, up: d >= 0, flat: Math.abs(d) < 0.05 };
  if (prev.value === 0) return null;
  const pct = (d / Math.abs(prev.value)) * 100;
  return { text: `${pct >= 0 ? '+' : ''}${pct.toFixed(Math.abs(pct) < 10 ? 1 : 0)}%`, up: pct >= 0, flat: Math.abs(pct) < 0.5 };
}

// What the report needs for a month: its sources with key numbers, last
// month's for comparison, and the status report written for it.
export function reportInputs(project, month) {
  const sources = (project.sources || []).filter((s) => monthOf(s) === month);
  const prev = (project.sources || []).filter((s) => monthOf(s) === prevMonth(month));
  const end = `${month}-31`;
  const until = new Date(`${month}-01T12:00:00`);
  until.setMonth(until.getMonth() + 1);
  until.setDate(15);
  const cutoff = until.toISOString().slice(0, 10);
  const report = (project.reports || []).filter((r) => r.status !== 'draft' && r.report_date >= `${month}-01` && r.report_date <= cutoff)
    .sort((a, b) => (a.report_date < b.report_date ? 1 : -1))[0] || null;
  return { sources, prev, report, end };
}

export function reportFileName(project, month) {
  const clean = (s) => String(s || '').replace(/[^A-Za-z0-9 &'-]+/g, ' ').replace(/\s+/g, ' ').trim();
  return `${clean(project.name)} Status Report ${monthLabel(month)}.pdf`;
}

export async function downloadReport(project, month, { includeBlockers = false, preparedBy } = {}) {
  const { jsPDF } = await import('jspdf');
  const { sources, prev, report } = reportInputs(project, month);
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;
  const CW = W - M * 2;
  let y = 0;

  const color = (c, kind = 'text') => (kind === 'fill' ? doc.setFillColor(...c) : kind === 'draw' ? doc.setDrawColor(...c) : doc.setTextColor(...c));
  const font = (size, style = 'normal') => { doc.setFont('helvetica', style); doc.setFontSize(size); };
  const ensure = (h) => { if (y + h > H - 64) { doc.addPage(); y = 56; } };
  const heading = (t) => {
    ensure(40);
    font(9, 'bold'); color(C.amber);
    doc.text(t.toUpperCase(), M, y, { charSpace: 1.2 });
    color(C.line, 'draw'); doc.setLineWidth(0.6); doc.line(M, y + 6, M + CW, y + 6);
    y += 22;
  };
  const para = (t, size = 10.5, c = C.ink, x = M, width = CW) => {
    font(size); color(c);
    const lines = doc.splitTextToSize(String(t || ''), width);
    lines.forEach((ln) => { ensure(size * 1.45); doc.text(ln, x, y); y += size * 1.45; });
  };

  // ── Header band ──
  const [agencyLogo, clientLogo] = await Promise.all([toPng('/admin-logo.png', 256), toPng(project.client?.logo_url, 256, '#ffffff')]);
  color(C.forest, 'fill'); doc.rect(0, 0, W, 96, 'F');
  color(C.amber, 'fill'); doc.rect(0, 96, W, 4, 'F');
  if (agencyLogo) doc.addImage(agencyLogo, 'PNG', M, 26, 44, 44);
  font(15, 'bold'); color(C.cream); doc.text(AGENCY.name.toUpperCase(), M + (agencyLogo ? 56 : 0), 46, { charSpace: 1.5 });
  font(10); color(C.amber); doc.text('Client status report', M + (agencyLogo ? 56 : 0), 62);
  const clientName = project.client?.name || project.company_id_name || '';
  if (clientLogo) {
    color(C.white, 'fill'); doc.roundedRect(W - M - 48, 24, 48, 48, 8, 8, 'F');
    doc.addImage(clientLogo, 'PNG', W - M - 44, 28, 40, 40);
  }
  if (clientName) {
    font(10); color(C.cream);
    doc.text('Prepared for', W - M - (clientLogo ? 60 : 0), 44, { align: 'right' });
    font(12, 'bold'); doc.text(clientName, W - M - (clientLogo ? 60 : 0), 60, { align: 'right' });
  }
  y = 140;

  // ── Title ──
  font(24, 'bold'); color(C.ink); doc.text(project.name, M, y); y += 24;
  const periods = sources.map((s) => [s.period_start, s.period_end]).flat().filter(Boolean).sort();
  const range = periods.length ? `${longDay(periods[0])} to ${longDay(periods[periods.length - 1])}` : monthLabel(month);
  font(11); color(C.muted);
  doc.text(`${monthLabel(month)} report  ·  Data from ${range}`, M, y); y += 16;
  doc.text(`Prepared ${longDay(new Date().toISOString())}${preparedBy ? ` by ${preparedBy}` : ''}, ${AGENCY.name}`, M, y); y += 26;

  // ── Status chips ──
  const chip = (label, fg, bg) => {
    font(9.5, 'bold');
    const w = doc.getTextWidth(label) + 20;
    color(bg, 'fill'); doc.roundedRect(chipX, y - 12, w, 18, 9, 9, 'F');
    color(fg); doc.text(label, chipX + 10, y + 0.5);
    chipX += w + 8;
  };
  let chipX = M;
  const h = HEALTH[report?.health || project.health] || HEALTH.on_track;
  chip(`Health: ${h.label}`, h.fg, h.bg);
  chip(`Stage: ${stageInfo(project.lifecycle, project.stage)?.label || project.stage}`, C.ink, C.cream);
  chip(project.lifecycle === 'evergreen' ? 'Ongoing engagement' : 'Project engagement', C.ink, C.cream);
  y += 34;

  // ── Summary ──
  if (report?.summary) {
    heading('Summary');
    const lines = (font(12), doc.splitTextToSize(report.summary, CW - 22));
    const boxH = lines.length * 17 + 18;
    ensure(boxH);
    color(C.paper, 'fill'); doc.rect(M, y - 6, CW, boxH, 'F');
    color(C.amber, 'fill'); doc.rect(M, y - 6, 3, boxH, 'F');
    font(12); color(C.ink);
    lines.forEach((ln, i) => doc.text(ln, M + 16, y + 12 + i * 17));
    y += boxH + 18;
  }

  // ── Key results, one block per source kind ──
  const byKind = {};
  sources.forEach((s) => { (byKind[s.kind] ||= []).push(s); });
  const prevMetric = (kind, label) => {
    for (const s of prev.filter((p) => p.kind === kind)) {
      const m = (s.metrics || []).find((x) => x.label.toLowerCase() === label.toLowerCase());
      if (m) return m;
    }
    return null;
  };
  const kinds = Object.keys(byKind).sort((a, b) => SOURCE_KINDS.findIndex((k) => k.id === a) - SOURCE_KINDS.findIndex((k) => k.id === b));
  if (kinds.some((k) => byKind[k].some((s) => (s.metrics || []).length))) heading(`Key results, ${monthLabel(month)}`);
  for (const kind of kinds) {
    const metrics = byKind[kind].flatMap((s) => s.metrics || []);
    if (!metrics.length) continue;
    const cols = 3;
    const gap = 10;
    const tw = (CW - gap * (cols - 1)) / cols;
    const th = 58;
    // Keep a platform's tiles together on one page.
    ensure(14 + Math.ceil(metrics.length / cols) * (th + gap));
    font(11.5, 'bold'); color(C.forest); doc.text(kindLabel(kind), M, y); y += 12;
    metrics.forEach((m, i) => {
      if (i % cols === 0) { if (i) y += th + gap; ensure(th + 4); }
      const x = M + (i % cols) * (tw + gap);
      color(C.cream, 'fill'); doc.roundedRect(x, y, tw, th, 6, 6, 'F');
      font(8, 'bold'); color(C.muted);
      let tileLabel = m.label.replace(/\s*\(.*\)\s*$/, '').toUpperCase();
      while (tileLabel.length > 4 && doc.getTextWidth(tileLabel) + tileLabel.length * 0.6 > tw - 20) tileLabel = `${tileLabel.slice(0, -2).trim()}…`;
      doc.text(tileLabel, x + 10, y + 16, { charSpace: 0.6 });
      font(18, 'bold'); color(C.ink); doc.text(formatMetric(m.value, m.unit), x + 10, y + 38);
      const ch = change(m, prevMetric(kind, m.label));
      font(8.5);
      if (ch) { color(ch.flat ? C.muted : ch.up ? C.green : C.red); doc.text(`${ch.text} vs ${monthLabel(prevMonth(month)).split(' ')[0]}`, x + 10, y + 51); }
      else { color(C.muted); doc.text('No prior month to compare', x + 10, y + 51); }
    });
    y += th + 20;

    // Optional top-rows table from the export.
    for (const s of byKind[kind].filter((x) => x.breakdown?.rows?.length)) {
      const b = s.breakdown;
      const rowH = 18;
      ensure(rowH * Math.min(b.rows.length + 2, 6));
      font(9.5, 'bold'); color(C.muted); doc.text(b.title || 'Breakdown', M, y); y += 8;
      const first = CW * 0.4;
      const rest = (CW - first) / Math.max(b.columns.length - 1, 1);
      const colX = (c) => (c === 0 ? M + 8 : M + first + rest * c - 8);
      color(C.forest, 'fill'); doc.rect(M, y, CW, rowH, 'F');
      font(8.5, 'bold'); color(C.cream);
      b.columns.forEach((c, ci) => doc.text(doc.splitTextToSize(c, ci === 0 ? first - 12 : rest - 8)[0], colX(ci), y + 12, ci === 0 ? {} : { align: 'right' }));
      y += rowH;
      b.rows.forEach((r, ri) => {
        ensure(rowH);
        if (ri % 2) { color(C.paper, 'fill'); doc.rect(M, y, CW, rowH, 'F'); }
        font(9); color(C.ink);
        r.forEach((cell, ci) => doc.text(doc.splitTextToSize(String(cell), ci === 0 ? first - 12 : rest - 8)[0], colX(ci), y + 12, ci === 0 ? {} : { align: 'right' }));
        y += rowH;
      });
      color(C.line, 'draw'); doc.line(M, y, M + CW, y);
      y += 22;
    }
  }

  // ── Work done / next ──
  const twoCol = report && (report.accomplishments || report.next_steps);
  if (twoCol) {
    heading('Work this period');
    const half = (CW - 24) / 2;
    const bullets = (t) => String(t || '').split(/\n+/).map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
    const block = (title, items, x) => {
      let yy = y;
      font(11, 'bold'); color(C.forest); doc.text(title, x, yy); yy += 16;
      font(10); color(C.ink);
      items.forEach((it) => {
        const lines = doc.splitTextToSize(it, half - 14);
        color(C.amber, 'fill'); doc.circle(x + 3, yy - 3.5, 2, 'F'); color(C.ink);
        lines.forEach((ln) => { doc.text(ln, x + 12, yy); yy += 14; });
        yy += 3;
      });
      return yy;
    };
    const a = bullets(report.accomplishments);
    const n = bullets(report.next_steps);
    ensure(40 + Math.max(a.length, n.length) * 20);
    const y1 = a.length ? block('What we did', a, M) : y;
    const y2 = n.length ? block('What comes next', n, M + half + 24) : y;
    y = Math.max(y1, y2) + 14;
  }
  if (includeBlockers && report?.blockers) {
    heading('What we need from you');
    para(report.blockers);
    y += 8;
  }
  const notes = sources.filter((s) => s.notes);
  if (notes.length) {
    heading('Notes on the data');
    notes.forEach((s) => para(`${kindLabel(s.kind)}: ${s.notes}`, 9.5, C.muted));
  }

  // ── Footer on every page ──
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    color(C.line, 'draw'); doc.setLineWidth(0.6); doc.line(M, H - 44, W - M, H - 44);
    font(8.5); color(C.muted);
    doc.text(`${AGENCY.name}  ·  ${AGENCY.site}  ·  ${AGENCY.email}`, M, H - 28);
    doc.text(`Page ${i} of ${pages}`, W - M, H - 28, { align: 'right' });
  }

  doc.save(reportFileName(project, month));
}
