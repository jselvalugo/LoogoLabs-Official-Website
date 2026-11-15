import { jsPDF } from 'jspdf';
import MARCELLUS from './marcellus-font.js';

// The PDF copy of a quote or invoice, attached to the email when it is sent.
// Drawn with jsPDF to match the email: logo, title, Prepared for / From /
// Details, the total banner, line items, totals, notes and terms, footer.
// Headings use Marcellus (embedded); body text uses Helvetica.

const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const usd = (n) => `$${Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const longDay = (d) => (d ? new Date(`${String(d).slice(0, 10)}T12:00:00Z`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : '');
const lines = (s) => String(s ?? '').split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
const qty = (n) => (Number.isInteger(Number(n)) ? String(Number(n)) : Number(n).toLocaleString('en-US', { maximumFractionDigits: 2 }));
const clean = (s) => String(s || '').replace(/[^A-Za-z0-9 &'.-]+/g, ' ').replace(/\s+/g, ' ').trim();

// Logo bytes are fetched once per function instance.
const logoCache = new Map();
async function loadLogo(url) {
  if (!url) return null;
  if (logoCache.has(url)) return logoCache.get(url);
  let out = null;
  try {
    const res = await fetch(url);
    if (res.ok) out = Buffer.from(await res.arrayBuffer()).toString('base64');
  } catch { /* fall back to the business name */ }
  logoCache.set(url, out);
  return out;
}

export function pdfFileName(brand, inv) {
  return `${clean(brand.business.name)} ${inv.kind === 'quote' ? 'Quote' : 'Invoice'} ${clean(inv.name)}.pdf`;
}

export async function renderInvoicePdf(brand, inv) {
  const C = Object.fromEntries(Object.entries(brand.colors).map(([k, v]) => [k, hex(v)]));
  const isQuote = inv.kind === 'quote';
  const Doc = isQuote ? 'Quote' : 'Invoice';
  const t = inv.totals;
  const paid = !isQuote && inv.status === 'paid';
  const issued = longDay(inv.issue_date) || longDay(new Date().toISOString());
  const due = inv.due_date ? longDay(inv.due_date) : (isQuote ? '' : 'Due on receipt');

  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  doc.addFileToVFS('Marcellus-Regular.ttf', MARCELLUS);
  doc.addFont('Marcellus-Regular.ttf', 'Marcellus', 'normal');
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 54;
  const CW = W - M * 2;
  let y = 0;

  const color = (c, kind = 'text') => (kind === 'fill' ? doc.setFillColor(...c) : kind === 'draw' ? doc.setDrawColor(...c) : doc.setTextColor(...c));
  const sans = (size, style = 'normal') => { doc.setFont('helvetica', style); doc.setFontSize(size); };
  const serif = (size) => { doc.setFont('Marcellus', 'normal'); doc.setFontSize(size); };
  const label = (text, x, yy, c = C.amber) => { sans(7.5, 'bold'); color(c); doc.text(text.toUpperCase(), x, yy, { charSpace: 1.2 }); };
  const footer = () => {
    color(C.line, 'draw'); doc.setLineWidth(0.6); doc.line(M, H - 40, W - M, H - 40);
    sans(7.5); color(C.muted);
    const site = brand.business.website ? `  ·  ${brand.business.website.replace(/^https?:\/\//, '')}` : '';
    doc.text(`${brand.business.name.toUpperCase()}${site.toUpperCase()}`, M, H - 28, { charSpace: 0.8 });
    doc.text(`${Doc} ${inv.name}  ·  Page ${doc.getNumberOfPages()}`, W - M, H - 28, { align: 'right' });
  };
  const ensure = (h) => { if (y + h > H - 54) { footer(); doc.addPage(); color(C.ink, 'fill'); doc.rect(0, 0, W, 5, 'F'); y = 54; } };

  // ── Top bar, logo, title ──
  color(C.ink, 'fill'); doc.rect(0, 0, W, 5, 'F');
  const logo = await loadLogo(brand.logo);
  y = 46;
  if (logo) {
    const lw = 210;
    const props = doc.getImageProperties(`data:image/png;base64,${logo}`);
    doc.addImage(logo, 'PNG', M, y - 6, lw, lw * (props.height / props.width));
  } else {
    serif(22); color(C.ink); doc.text(brand.business.name, M, y + 22);
  }
  serif(30); color(C.ink); doc.text(Doc, W - M, y + 18, { align: 'right' });
  sans(8.5, 'bold'); color(C.amber);
  const tag = `${inv.name}${paid ? ' · PAID' : inv.status === 'accepted' ? ' · ACCEPTED' : inv.status === 'void' ? ' · VOID' : ''}`.toUpperCase();
  doc.text(tag, W - M - tag.length, y + 34, { align: 'right', charSpace: 1 });
  y += 58;
  color(C.amber, 'fill'); doc.rect(M, y, CW, 1.6, 'F');
  y += 24;

  // ── Prepared for / From / Details ──
  const colW = CW / 3;
  const col = (x, title, name, rest) => {
    label(title, x, y);
    serif(13); color(C.ink);
    const nameLines = doc.splitTextToSize(name || '—', colW - 14);
    let yy = y + 18;
    nameLines.forEach((l) => { doc.text(l, x, yy); yy += 15; });
    sans(9); color(C.muted);
    rest.filter(Boolean).forEach((r) => doc.splitTextToSize(r, colW - 14).forEach((l) => { doc.text(l, x, yy); yy += 12.5; }));
    return yy;
  };
  const billRest = [inv.bill_to_title, inv.bill_to_name && inv.bill_to_company ? inv.bill_to_company : '', ...lines(inv.bill_to_address), inv.bill_to_email, inv.bill_to_phone];
  const fromRest = [...(brand.business.address || []), brand.business.email, brand.business.phone];
  const y1 = col(M, isQuote ? 'Prepared for' : 'Bill to', inv.bill_to_name || inv.bill_to_company, billRest);
  const y2 = col(M + colW, 'From', brand.business.name, fromRest);
  label('Details', M + colW * 2, y);
  const facts = [[`${Doc} no.`, inv.name], [isQuote ? 'Date' : 'Issued', issued]];
  if (isQuote ? due : true) facts.push([isQuote ? 'Valid until' : 'Due', due]);
  if (inv.project_id_name) facts.push(['Project', inv.project_id_name]);
  let y3 = y + 18;
  facts.forEach(([k, v]) => {
    sans(9); color(C.muted); doc.text(k, M + colW * 2, y3);
    sans(9, 'bold'); color(C.ink); doc.text(String(v), W - M, y3, { align: 'right' });
    y3 += 14;
  });
  y = Math.max(y1, y2, y3) + 10;

  // ── Total banner ──
  const bannerH = 50;
  color(C.ink, 'fill'); doc.roundedRect(M, y, CW, bannerH, 5, 5, 'F');
  label(isQuote ? (inv.status === 'accepted' ? 'Accepted' : 'Quote total') : paid ? 'Paid in full' : 'Amount due', M + 18, y + 20, C.sage);
  sans(9.5); color(C.cream);
  const sub = isQuote ? (due ? `Valid until ${due}` : `Prepared ${issued}`) : paid ? 'Thank you' : (due === 'Due on receipt' ? due : `Due ${due}`);
  doc.text(sub, M + 18, y + 35);
  serif(24); color(C.cream); doc.text(usd(isQuote || paid ? t.total : t.amount_due), W - M - 18, y + 33, { align: 'right' });
  y += bannerH + 22;

  // ── Line items ──
  const amtX = W - M;
  const descW = CW - 130;
  const header = () => {
    sans(7.5, 'bold'); color(C.ink);
    doc.text('DESCRIPTION', M, y, { charSpace: 1.2 });
    doc.text('AMOUNT', amtX - 'AMOUNT'.length * 1.2, y, { align: 'right', charSpace: 1.2 });
    color(C.ink, 'draw'); doc.setLineWidth(0.8); doc.line(M, y + 7, W - M, y + 7);
    y += 24;
  };
  header();
  for (const it of inv.items || []) {
    serif(12);
    const nameLines = doc.splitTextToSize(it.description, descW);
    const det = lines(it.details).map((d) => (sans(9), doc.splitTextToSize(d, descW - 12)));
    const h = nameLines.length * 15 + 14 + det.reduce((s, d) => s + d.length * 12.5, 0) + 16;
    if (y + h > H - 64) { ensure(h + 30); header(); }
    const top = y;
    serif(12); color(C.ink); nameLines.forEach((l) => { doc.text(l, M, y); y += 15; });
    sans(8.5); color(C.muted); doc.text(`${qty(it.quantity)} × ${usd(it.unit_price)}${it.unit_label ? ` / ${it.unit_label}` : ''}`, M, y); y += 14;
    det.forEach((d) => {
      sans(9); color(C.amber); doc.text('•', M, y);
      color(C.muted); d.forEach((l) => { doc.text(l, M + 11, y); y += 12.5; });
    });
    sans(10, 'bold'); color(C.ink); doc.text(usd(it.amount), amtX, top, { align: 'right' });
    if (it.note) {
      sans(6.5, 'bold');
      const note = it.note.toUpperCase();
      const nw = doc.getTextWidth(note) + note.length * 0.9 + 14;
      color(C.cream, 'fill'); color(C.line, 'draw'); doc.setLineWidth(0.6);
      doc.roundedRect(amtX - nw, top + 7, nw, 13, 6.5, 6.5, 'FD');
      color(C.amber); doc.text(note, amtX - nw / 2, top + 16, { align: 'center', charSpace: 0.9 });
    }
    y += 2;
    color(C.line, 'draw'); doc.setLineWidth(0.6); doc.line(M, y, W - M, y);
    y += 15;
  }
  if (!(inv.items || []).length) { sans(10); color(C.muted); doc.text('No line items yet.', M, y); y += 24; }

  // ── Totals ──
  ensure(90);
  const tx = W - M - 230;
  const sum = (k, v) => { sans(9.5); color(C.muted); doc.text(k, tx, y); color(C.ink); doc.text(v, W - M, y, { align: 'right' }); y += 17; };
  sum('Subtotal', usd(t.subtotal));
  if (t.discount) sum('Discount', `-${usd(t.discount)}`);
  if (t.tax) sum(`Tax (${t.tax_rate}%)`, usd(t.tax));
  if (!isQuote) sum('Total', usd(t.total));
  if (paid) sum('Paid', `-${usd(t.total)}`);
  color(C.ink, 'draw'); doc.setLineWidth(0.8); doc.line(tx, y - 6, W - M, y - 6);
  y += 12;
  sans(10, 'bold'); color(C.ink); doc.text(isQuote ? 'Total' : 'Amount due', tx, y);
  serif(20); doc.text(usd(isQuote ? t.total : t.amount_due), W - M, y + 2, { align: 'right' });
  y += 8;

  // ── Notes and terms ──
  const blocks = [['Notes', lines(inv.notes)], ['Terms & scope', lines(inv.terms)]].filter(([, ls]) => ls.length);
  if (blocks.length) {
    sans(9);
    const wrapped = blocks.map(([title, ls]) => [title, ls.map((l) => doc.splitTextToSize(l, CW - 36))]);
    const blockH = (w) => 26 + w.reduce((s, x) => s + x.length * 12.5 + 3, 0);
    const bh = wrapped.reduce((s, [, w]) => s + blockH(w), 0) + 8 + (wrapped.length - 1) * 6;
    ensure(bh);
    color(C.cream, 'fill'); doc.roundedRect(M, y, CW, bh, 5, 5, 'F');
    let yy = y + 20;
    wrapped.forEach(([title, w], i) => {
      if (i) { color(C.line, 'draw'); doc.setLineWidth(0.6); doc.line(M + 18, yy - 10, W - M - 18, yy - 10); yy += 6; }
      label(title, M + 18, yy);
      yy += 15;
      sans(9); color(C.ink);
      w.forEach((x) => { x.forEach((l) => { doc.text(l, M + 18, yy); yy += 12.5; }); yy += 3; });
      yy += 8;
    });
    y += bh + 12;
  }

  // ── Contact ──
  ensure(18);
  sans(9); color(C.ink);
  const contact = brand.business.email
    ? `Questions about this ${Doc.toLowerCase()}? Reach ${brand.business.contact || 'us'} at ${brand.business.email}${brand.business.phone ? ` or ${brand.business.phone}` : ''}.${isQuote ? ' To accept, reply to the email this quote came with.' : ''}`
    : `Questions about this ${Doc.toLowerCase()}? Reply to the email it came with.`;
  doc.splitTextToSize(contact, CW).forEach((l) => { doc.text(l, M, y); y += 12; });
  footer();

  return Buffer.from(doc.output('arraybuffer'));
}
