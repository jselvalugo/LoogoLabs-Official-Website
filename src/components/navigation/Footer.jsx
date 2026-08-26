import React from 'react';

const pageMap = {
  'Mission': 'Mission',
  'Contact': 'Contact',
  'Launch notes': 'Launch',
  'PropIQ': 'Products',
  'CartCaddy': 'Products',
};

const externalLinks = {
  'Distillr': 'https://www.distillrsoftware.com',
};

function Footer({ columns = [], note, wordmark = 'Loogo Labs', strap = 'Operational software for underserved industries', copyright = '© 2026 Loogo Labs', style, onNavigate, onAdmin }) {
  return (
    <footer className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)', padding: '64px 24px 32px', ...style }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 64, flexWrap: 'wrap', borderBottom: '1px solid var(--border-hair-inverse)', paddingBottom: 40 }}>
          <div style={{ minWidth: 220, flex: 1 }}>
            <span style={{ fontWeight: 700, fontSize: 24, letterSpacing: '-0.03em' }}>{wordmark}<span style={{ color: 'var(--cyan-500)' }}>.</span></span>
            {note ? <p style={{ margin: '10px 0 0', maxWidth: '32ch', fontSize: 14, lineHeight: 1.6, color: 'var(--ink-300)' }}>{note}</p> : null}
          </div>
          {columns.map(col => (
            <div key={col.title} style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>{col.title}</span>
              {col.links.map(l => {
                const external = externalLinks[l];
                const target = pageMap[l];
                if (external)
                  return <a key={l} href={external} target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 14, color: 'var(--ink-200)', textDecoration: 'none', borderBottom: 'none' }}>{l}</a>;
                if (target && onNavigate)
                  return <button key={l} onClick={() => { onNavigate(target); window.scrollTo(0, 0); }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
                      fontSize: 14, color: 'var(--ink-200)', fontFamily: 'var(--font-body)' }}>{l}</button>;
                return <span key={l} style={{ fontSize: 14, color: 'var(--ink-400)' }}>{l}</span>;
              })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap', paddingTop: 20,
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          <span>{copyright}</span>
          <span>{strap}</span>
          {onAdmin && (
            <button onClick={onAdmin} style={{ background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-600)', padding: 0 }}>
              Admin
            </button>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
