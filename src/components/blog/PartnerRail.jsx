import React from 'react';
import { ArrowUpRight, EnvelopeSimple } from '@phosphor-icons/react';
import { partnerHref } from '../../lib/partners';

// Floating rail with a partner's logo, a short line about them, every one of
// their links, and a newsletter callout. Sticky on desktop (left of the
// article); a regular card under the article on phones.
export default function PartnerRail({ partner, slug, es, variant = 'rail' }) {
  if (!partner) return null;
  const p = partner;
  const t = (en, esText) => (es && esText ? esText : en);
  const style = { '--pt-primary': p.colors.primary, '--pt-secondary': p.colors.secondary, '--pt-ink': p.colors.ink };
  return (
    <aside className={`pt-rail pt-rail--${variant}`} style={style} aria-label={t(`About ${p.name}`, `Sobre ${p.name}`)}>
      <div className="pt-rail__card">
        <a className="pt-rail__logo" href={partnerHref(p.url, slug)} target="_blank" rel="noopener noreferrer">
          <img src={p.logo} alt={p.name} width="168" height="41" />
        </a>
        <p className="pt-rail__tag">{t(p.tagline, p.taglineEs)}</p>
        <a className="pt-rail__cta" href={partnerHref(p.cta.href, slug)} target="_blank" rel="noopener noreferrer">
          {t(p.cta.label, p.cta.labelEs)} <ArrowUpRight size={14} weight="bold" aria-hidden="true" />
        </a>

        {p.groups.map(g => (
          <div key={g.title} className="pt-rail__group">
            <h2 className="pt-rail__h">{t(g.title, g.titleEs)}</h2>
            <ul>
              {g.links.map(l => (
                <li key={l.href}>
                  <a href={partnerHref(l.href, slug)} target="_blank" rel="noopener noreferrer">
                    <span className="pt-rail__label">{l.label}<ArrowUpRight size={12} weight="bold" aria-hidden="true" /></span>
                    {l.note && <span className="pt-rail__note">{t(l.note, l.noteEs)}</span>}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {p.newsletter && (
          <div className="pt-rail__news">
            <img src={p.mark} alt="" width="28" height="20" aria-hidden="true" />
            <div>
              <h3>{t(p.newsletter.title, p.newsletter.titleEs)}</h3>
              <p>{t(p.newsletter.text, p.newsletter.textEs)}</p>
              <a href={partnerHref(p.newsletter.href, slug)} target="_blank" rel="noopener noreferrer">
                <EnvelopeSimple size={14} weight="bold" aria-hidden="true" /> {t(p.newsletter.label, p.newsletter.labelEs)}
              </a>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
