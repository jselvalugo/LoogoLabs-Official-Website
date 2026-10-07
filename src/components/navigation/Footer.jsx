import React from 'react';
import { BOOKING_URL } from '../../lib/booking';
import { SITE, pathForPage, routeMeta } from '../../lib/seo';

const pageMap = {
  'Mission': 'Mission',
  'Company': 'Company',
  'Industry LoogoBlog': 'LoogoNews',
  'Central Florida': 'GrowCFL',
  'Quizzes': 'Quizzes',
  'Packaged Services': 'Packages',
  'Privacy Policy': 'Privacy',
  'Terms of Service': 'Terms',
};

const externalLinks = {
  'Distillr': 'https://www.distillrsoftware.com',
  'Book a Call': BOOKING_URL,
  'Facebook': 'https://www.facebook.com/loogolabs',
  'Instagram': 'https://www.instagram.com/loogolabs.fl',
  'LinkedIn': 'https://www.linkedin.com/company/loogolabs/',
};

// These mirror SITE.sameAs in lib/seo.js. Keep the two lists in step: a sameAs
// entry corroborated by a visible rel="me" link is a stronger entity signal
// than the schema claim on its own.
const PROFILE_LINKS = new Set(['Facebook', 'Instagram', 'LinkedIn']);

function Footer({ columns = [], note, wordmark = 'Loogo Labs', strap = 'Operational software for underserved industries', copyright = `© ${new Date().getFullYear()} Loogo Labs`, style, onNavigate, onAdmin }) {
  const go = (e, target) => { e.preventDefault(); onNavigate && onNavigate(target); window.scrollTo(0, 0); };
  return (
    <footer className="ll-footer ll-grid-bg--inverse" style={style}>
      <div className="ll-footer__inner">
        <div className="ll-footer__top">
          <div className="ll-footer__brand">
            <a href="/" className="ll-footer__wordmark" onClick={e => go(e, 'Home')}>
              {wordmark}
            </a>
            {note ? <p className="ll-footer__note">{note}</p> : null}
            <address className="ll-footer__address">
              {SITE.address.recipient}<br />
              {SITE.address.streetAddress}<br />
              {SITE.address.addressLocality}, {SITE.address.addressRegion} {SITE.address.postalCode}<br />
              {SITE.address.countryName}
            </address>
          </div>
          {columns.map(col => (
            <nav key={col.title} className="ll-footer__col" aria-label={col.title}>
              <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>{col.title}</span>
              {col.links.map(l => {
                const external = externalLinks[l];
                const target = pageMap[l];
                if (l === 'Cookie Preferences')
                  return <button key={l} type="button" className="ll-footer__link"
                    onClick={() => window.openCookiePreferences && window.openCookiePreferences()}>{l}</button>;
                if (external)
                  return <a key={l} href={external} target="_blank" className="ll-footer__link"
                    rel={PROFILE_LINKS.has(l) ? 'noopener noreferrer me' : 'noopener noreferrer'}>
                    {l}<span aria-hidden="true" className="ll-footer__ext">↗</span>
                  </a>;
                // Real anchors, not buttons: the footer is the site-wide internal
                // link graph, and a crawler cannot follow an onClick handler.
                if (target && routeMeta(target))
                  return <a key={l} href={pathForPage(target)} className="ll-footer__link"
                    onClick={e => go(e, target)}>{l}</a>;
                return <span key={l} className="ll-footer__link ll-footer__link--muted">{l}</span>;
              })}
            </nav>
          ))}
        </div>
        <div className="ll-footer__bottom">
          <div className="ll-footer__meta">
            <span>{copyright}</span>
            <span className="ll-footer__strap">{strap}</span>
          </div>
          <span className="ll-footer__license">
            Industry LoogoBlog posts are free to republish under{' '}
            <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank"
              rel="noopener noreferrer license">CC BY 4.0</a>
            {' '}— credit Loogo Labs and take it.
          </span>
          {onAdmin && (
            <button type="button" onClick={onAdmin} className="ll-footer__admin">Admin</button>
          )}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
