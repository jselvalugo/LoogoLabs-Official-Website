// Turns an uploaded report into plain text in the browser, so the CRM stores
// something Claude can read: CSV/TSV/TXT/JSON as is, Excel sheets as CSV
// (one block per sheet), PDFs as their text, page by page. The readers load
// only when needed.

const csvCell = (v) => {
  if (v === null || v === undefined) return '';
  const s = v instanceof Date ? v.toISOString().slice(0, 10) : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

async function excelText(file) {
  const { default: readXlsx } = await import('read-excel-file/browser');
  const sheets = await readXlsx(file);
  return sheets.map(({ sheet, data }) => `### Sheet: ${sheet}\n${data.map((row) => row.map(csvCell).join(',')).join('\n')}`).join('\n\n');
}

async function pdfText(file) {
  const pdfjs = await import('pdfjs-dist');
  const { default: workerUrl } = await import('pdfjs-dist/build/pdf.worker.min.mjs?url');
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise;
  const pages = [];
  for (let i = 1; i <= doc.numPages; i += 1) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    // Rebuild lines from the text items' vertical positions.
    let lastY = null;
    let line = '';
    const lines = [];
    for (const item of content.items) {
      const y = Math.round(item.transform?.[5] ?? 0);
      if (lastY !== null && Math.abs(y - lastY) > 2) { lines.push(line.trim()); line = ''; }
      line += `${item.str}${item.hasEOL ? '\n' : ' '}`;
      lastY = y;
    }
    if (line.trim()) lines.push(line.trim());
    pages.push(`### Page ${i}\n${lines.filter(Boolean).join('\n')}`);
  }
  return pages.join('\n\n');
}

export const ACCEPT = '.csv,.tsv,.txt,.json,.xlsx,.pdf';

export async function fileToText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.xlsx')) return excelText(file);
  if (name.endsWith('.pdf')) return pdfText(file);
  if (name.endsWith('.xls')) throw new Error('Old .xls files are not supported. Re-export as .xlsx or CSV.');
  if (/\.(csv|tsv|txt|json|md)$/.test(name) || file.type.startsWith('text/')) return file.text();
  throw new Error('Upload a CSV, Excel (.xlsx), PDF or text file.');
}

// Best guess of the report's source from its file name.
export function guessKind(name) {
  const n = name.toLowerCase();
  if (/analytics|\bga4?\b|ga4|google_analytics/.test(n)) return 'google_analytics';
  if (/meta|facebook|instagram|\bfb\b|\big\b|ads_manager/.test(n)) return 'meta';
  if (/search.?console|gsc|seo/.test(n)) return 'search_console';
  if (/google.?ads|adwords/.test(n)) return 'ads';
  if (/tiktok|linkedin|youtube|twitter|\bx\b/.test(n)) return 'social';
  return 'other';
}
