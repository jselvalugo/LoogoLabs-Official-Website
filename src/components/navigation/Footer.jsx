import React from 'react';
import { BOOKING_URL } from '../../lib/booking';
import { pathForPage, routeMeta } from '../../lib/seo';

const pageMap = {
  'Mission': 'Mission',
  'Pricing': 'Pricing',
  'LoogoNews': 'LoogoNews',
  'Central Florida': 'GrowCFL',
  'Privacy Policy': 'Privacy',
  'Terms of Service': 'Terms',
};

const externalLinks = {
  'Distillr': 'https://www.distillrsoftware.com',
  'Book a Call': BOOKING_URL,
  'Facebook': 'https://www.facebook.com/loogolabs',
  'Instagram': 'https://www.instagram.com/loogolabs.ai',
  'LinkedIn': 'https://www.linkedin.com/company/loogolabs/',
};

// These mirror SITE.sameAs in lib/seo.js. Keep the two lists in step: a sameAs
// entry corroborated by a visible rel="me" link is a stronger entity signal
// than the schema claim on its own.
const PROFILE_LINKS = new Set(['Facebook', 'Instagram', 'LinkedIn']);

function Footer({ columns = [], note, wordmark = 'Loogo Labs', strap = 'Operational software for underserved industries', copyright = '© 2026 Loogo Labs', style, onNavigate, onAdmin }) {
  return (
    <footer className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)', padding: '64px 24px 32px', ...style }}>
      <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 32, borderBottom: '1px solid var(--border-hair-inverse)', paddingBottom: 36 }}>
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
                  return <a key={l} href={external} target="_blank"
                    rel={PROFILE_LINKS.has(l) ? 'noopener noreferrer me' : 'noopener noreferrer'}
                    style={{ fontSize: 14, color: 'var(--ink-200)', textDecoration: 'none', borderBottom: 'none' }}>{l}</a>;
                // Real anchors, not buttons: the footer is the site-wide internal
                // link graph, and a crawler cannot follow an onClick handler.
                if (target && routeMeta(target))
                  return <a key={l} href={pathForPage(target)}
                    onClick={e => { e.preventDefault(); onNavigate && onNavigate(target); window.scrollTo(0, 0); }}
                    style={{ fontSize: 14, color: 'var(--ink-200)', textDecoration: 'none' }}>{l}</a>;
                return <span key={l} style={{ fontSize: 14, color: 'var(--ink-400)' }}>{l}</span>;
              })}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingTop: 20,
          fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          <span>{copyright}</span>
          <span>{strap}</span>
          <span style={{ textTransform: 'none', letterSpacing: '0.04em', color: 'var(--ink-500)' }}>
            LoogoNews posts are free to republish under{' '}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer license"
              style={{ color: 'var(--ink-300)', textDecoration: 'underline' }}
            >
              CC BY 4.0
            </a>
            {' '}— credit Loogo Labs and take it.
          </span>
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
