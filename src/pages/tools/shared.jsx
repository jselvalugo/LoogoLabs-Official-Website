import React from 'react';
import qrcode from 'qrcode-generator';
import { ArrowRight, Check, Copy, DownloadSimple } from '@phosphor-icons/react';
import { openBooking } from '../../lib/booking';
import { pathForPage } from '../../lib/seo';
import { useHref, useLang } from '../../lib/i18n';
import { TOOLS, TOOLS_BASE, toolPath } from '../../lib/tools';
import '../../styles/pages/tools.css';

// Shared pieces for the free tools. Everything here runs in the browser; the
// only network call is the optional tips sign-up (email-subscribe function).

/** Copy text to the clipboard, with a two-second "Copied" state. */
export function CopyButton({ text, label, ghost = false, disabled = false }) {
  const es = useLang() === 'es';
  const [done, setDone] = React.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Older browsers or blocked clipboard: fall back to a hidden textarea.
      const ta = document.createElement('textarea');
      ta.value = text; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); } catch { /* nothing else to try */ }
      ta.remove();
    }
    setDone(true);
    setTimeout(() => setDone(false), 2000);
  };
  return (
    <button type="button" className={`tl-btn${ghost ? ' tl-btn--ghost' : ''}`} onClick={copy} disabled={disabled || !text}>
      {done ? <Check size={16} weight="bold" aria-hidden="true" /> : <Copy size={16} aria-hidden="true" />}
      {done ? (es ? 'Copiado' : 'Copied') : (label || (es ? 'Copiar' : 'Copy'))}
    </button>
  );
}

/** Square module grid for a QR code, or null for empty text. Error level M. */
export function qrMatrix(text) {
  if (!text) return null;
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  const n = qr.getModuleCount();
  const rows = [];
  for (let r = 0; r < n; r += 1) {
    const row = [];
    for (let c = 0; c < n; c += 1) row.push(qr.isDark(r, c));
    rows.push(row);
  }
  return rows;
}

const MARGIN = 4; // quiet zone, in modules, as the QR spec asks for

export function qrSvgString(matrix) {
  const n = matrix.length;
  const size = n + MARGIN * 2;
  let d = '';
  matrix.forEach((row, r) => row.forEach((on, c) => { if (on) d += `M${c + MARGIN} ${r + MARGIN}h1v1h-1z`; }));
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}

function download(blob, filename) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

function downloadPng(matrix, filename, scale = 16) {
  const n = matrix.length;
  const size = (n + MARGIN * 2) * scale;
  const canvas = document.createElement('canvas');
  canvas.width = size; canvas.height = size;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size);
  ctx.fillStyle = '#000';
  matrix.forEach((row, r) => row.forEach((on, c) => { if (on) ctx.fillRect((c + MARGIN) * scale, (r + MARGIN) * scale, scale, scale); }));
  canvas.toBlob((blob) => blob && download(blob, filename), 'image/png');
}

/** QR preview plus PNG and SVG downloads. `name` is the file name stem. */
export function QrBlock({ text, name }) {
  const es = useLang() === 'es';
  const matrix = React.useMemo(() => { try { return qrMatrix(text); } catch { return null; } }, [text]);
  if (!matrix) return null;
  const svg = qrSvgString(matrix);
  return (
    <div className="tl-qr">
      <span role="img" aria-label={es ? 'Código QR' : 'QR code'} dangerouslySetInnerHTML={{ __html: svg }} />
      <div className="tl-btns" style={{ marginTop: 0, flexDirection: 'column', alignItems: 'stretch' }}>
        <button type="button" className="tl-btn" onClick={() => downloadPng(matrix, `${name}.png`)}>
          <DownloadSimple size={16} aria-hidden="true" />{es ? 'Descargar PNG' : 'Download PNG'}
        </button>
        <button type="button" className="tl-btn tl-btn--ghost" onClick={() => download(new Blob([svg], { type: 'image/svg+xml' }), `${name}.svg`)}>
          <DownloadSimple size={16} aria-hidden="true" />{es ? 'Descargar SVG (imprenta)' : 'Download SVG (for print)'}
        </button>
      </div>
    </div>
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Optional monthly-tips sign-up. Adds the newsletter tag and the tool's tag. */
export function TipsSignup({ tool }) {
  const es = useLang() === 'es';
  const [email, setEmail] = React.useState('');
  const [hp, setHp] = React.useState('');
  const [state, setState] = React.useState('idle');
  const [error, setError] = React.useState('');
  const submit = async (e) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email.trim())) { setError(es ? 'Escribe un email válido.' : 'Enter a valid email.'); return; }
    setError(''); setState('busy');
    try {
      // The function takes one tag per call and merges tags on the same email.
      for (const tag of ['newsletter', tool.tag]) {
        const res = await fetch('/.netlify/functions/email-subscribe', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), tag, website: hp }),
        });
        if (!res.ok) throw new Error('failed');
      }
      if (window.fbq) window.fbq('trackCustom', 'NewsletterSignup', { funnel: tool.tag });
      setState('done');
    } catch {
      setError(es ? 'No se pudo enviar. Inténtalo de nuevo.' : 'That didn’t go through. Try again.');
      setState('idle');
    }
  };
  return (
    <section className="tl-section">
      <div className="tl-tips">
        <div>
          <h2>{es ? 'Recibe una idea de marketing al mes' : 'Get one marketing idea a month'}</h2>
          <p>{es
            ? 'La carta de Loogo Labs: lo que está funcionando, una herramienta de IA que ahorra horas y una cosa para mejorar esta semana. Opcional; la herramienta funciona igual sin registrarte.'
            : 'The Loogo Labs Letter: what is working, an AI tool that saves hours, and one thing to fix this week. Optional; the tool works the same without it.'}</p>
        </div>
        {state === 'done' ? (
          <p className="tl-alert tl-alert--ok" role="status">{es ? 'Listo. Busca la próxima carta en tu bandeja de entrada.' : 'You’re in. Look for the next Letter in your inbox.'}</p>
        ) : (
          <form onSubmit={submit} noValidate>
            <label className="tl-hp" aria-hidden="true">Website<input tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} /></label>
            <input className="tl-input" type="email" autoComplete="email" placeholder={es ? 'Tu email de negocio' : 'Your business email'}
              aria-label={es ? 'Email' : 'Email'} value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="tl-btn" type="submit" disabled={state === 'busy'}>{state === 'busy' ? '…' : (es ? 'Suscribirme' : 'Subscribe')}</button>
            {error && <p className="tl-hint" role="alert" style={{ width: '100%' }}>{error}</p>}
          </form>
        )}
      </div>
    </section>
  );
}

export function FaqList({ items, heading }) {
  return (
    <section className="tl-section">
      <h2 className="tl-h2">{heading}</h2>
      <div className="tl-faq">
        {items.map(([q, a]) => (
          <details key={q}><summary>{q}</summary><p>{a}</p></details>
        ))}
      </div>
    </section>
  );
}

/** Links to the other tools. */
export function MoreTools({ current }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  const others = TOOLS.filter((t) => t.page !== current);
  return (
    <section className="tl-section">
      <h2 className="tl-h2">{es ? 'Más herramientas gratis' : 'More free tools'}</h2>
      <div className="tl-cards">
        {others.map((t) => (
          <a key={t.page} className="tl-card" href={toHref(toolPath(t))}>
            <div>
              <p className="tl-card__title">{es ? t.es.short : t.short}</p>
              <p className="tl-card__desc">{es ? t.es.blurb : t.blurb}</p>
            </div>
            <span className="tl-card__go">{es ? 'Abrir' : 'Open tool'} <ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
          </a>
        ))}
        <a className="tl-card tl-card--forest" href={toHref(TOOLS_BASE)}>
          <div>
            <p className="tl-card__title">{es ? 'Todas las herramientas' : 'All free tools'}</p>
            <p className="tl-card__desc">{es ? 'Herramientas sencillas para dueños de negocio. Sin registro.' : 'Simple tools for business owners. No sign-up.'}</p>
          </div>
          <span className="tl-card__go">{es ? 'Ver todas' : 'See them all'} <ArrowRight size={14} weight="bold" aria-hidden="true" /></span>
        </a>
      </div>
    </section>
  );
}

/** Dark CTA band pointing at the service the tool relates to. */
export function ServiceBand({ title, text, servicePage, serviceLabel }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  return (
    <section className="tl-section">
      <div className="tl-band">
        <div>
          <h2>{title}</h2>
          <p>{text}</p>
        </div>
        <div className="tl-btns" style={{ justifyContent: 'flex-start' }}>
          {servicePage && <a className="tl-btn" href={toHref(pathForPage(servicePage))}>{serviceLabel} <ArrowRight size={16} weight="bold" aria-hidden="true" /></a>}
          <button type="button" className="tl-btn tl-btn--ghost" onClick={openBooking}>{es ? 'Agenda una llamada gratis' : 'Book a free call'}</button>
        </div>
      </div>
    </section>
  );
}

/** Page frame: breadcrumb, kicker, H1, lede, then the tool and its sections. */
export function ToolFrame({ tool, title, lede, children }) {
  const es = useLang() === 'es';
  const toHref = useHref();
  return (
    <main className="tl-page">
      <div className="tl-wrap">
        <header className="tl-hero">
          <nav className="tl-crumb" aria-label={es ? 'Ruta de navegación' : 'Breadcrumb'}>
            <a href={toHref(TOOLS_BASE)}>{es ? 'Herramientas gratis' : 'Free tools'}</a>
            <span aria-hidden="true">/</span>
            <span>{es ? tool.es.short : tool.short}</span>
          </nav>
          <p className="tl-kicker">{es ? 'Herramienta gratis · Sin registro' : 'Free tool · No sign-up'}</p>
          <h1 className="tl-title">{title}</h1>
          <p className="tl-lede">{lede}</p>
        </header>
        {children}
      </div>
    </main>
  );
}

/** Lowercase, trim, spaces to hyphens. Used by the UTM builder. */
export const slugValue = (v) => v.trim().toLowerCase().replace(/\s+/g, '-');

export const useMoney = () => {
  const es = useLang() === 'es';
  return React.useMemo(() => new Intl.NumberFormat(es ? 'es-US' : 'en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }), [es]);
};
