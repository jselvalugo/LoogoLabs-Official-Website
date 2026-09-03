import React from 'react';

// Real 404 content. Netlify rewrites every unmatched path to the SPA shell, so
// without this every typo'd URL rendered the homepage and returned 200 — a soft
// 404, which search engines treat as a duplicate of the homepage.
export default function NotFound({ onNavigate }) {
  return (
    <main style={{ minHeight: '70vh', background: 'var(--paper-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '96px 24px' }}>
      <div style={{ textAlign: 'center', maxWidth: 520 }}>
        <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 16 }}>
          404
        </div>
        <h1 style={{ margin: '0 0 16px', fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>
          That page isn’t here.
        </h1>
        <p style={{ margin: '0 0 32px', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)' }}>
          The link may be out of date, or the page may have moved. Everything we publish is still
          one click away.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/" onClick={(e) => { e.preventDefault(); onNavigate('Home'); }} style={btn}>Go to the homepage</a>
          <a href="/loogonews" onClick={(e) => { e.preventDefault(); onNavigate('LoogoNews'); }} style={{ ...btn, background: 'transparent', color: 'var(--ink-700)', border: '1px solid var(--border-hair)' }}>
            Read LoogoNews
          </a>
        </div>
      </div>
    </main>
  );
}

const btn = {
  display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 22px',
  background: 'var(--ink-900)', color: 'var(--paper-100)', textDecoration: 'none',
  fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
  textTransform: 'uppercase', fontWeight: 700, border: '1px solid var(--ink-900)',
};
