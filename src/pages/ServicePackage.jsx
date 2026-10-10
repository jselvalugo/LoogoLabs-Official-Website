import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { SERVICE_PACKAGE_BY_PAGE } from '../lib/servicePackages';
import { SERVICE_PACKAGES_ES } from '../lib/servicePackages.es';
import { useLang } from '../lib/i18n';
import { ArrowRight, Check, Plus } from '@phosphor-icons/react';
import '../styles/pages/packages.css';

const Arrow = <ArrowRight size={16} weight="bold" />;
const Tick = () => <Check className="pk-check" size={16} weight="bold" aria-hidden="true" />;

function ServicePackage({ page }) {
  const es = useLang() === 'es';
  const pkg = SERVICE_PACKAGE_BY_PAGE[page];
  const t = es ? { ...pkg, ...SERVICE_PACKAGES_ES[page] } : pkg;
  const order = (where) => {
    if (window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: `${pkg.page}-${where}` });
    openBooking();
  };

  return (
    <main>
      {/* ── HERO ── */}
      <section className="pk-wrap pk-hero pk-hero--center">
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="accent">{t.badge}</Badge></div>
        <h1 className="pk-title">{t.headline} <em>{t.accent}</em></h1>
        <p className="pk-lede">{t.summary}</p>
        <div className="pk-hero__actions">
          <Button variant="inverse" size="lg" iconRight={Arrow} onClick={() => order('hero')}>{es ? 'Comenzar' : 'Get started'}</Button>
        </div>
        <div className="pk-tag pk-hero__meta">{es ? `Precio fijo · Hecho por nosotros · ${t.turnaround}` : <>Fixed price · Done for you · {pkg.turnaround}</>}</div>
      </section>

      {/* ── PRICING ── */}
      <section className="pk-wrap pk-section">
        <div className="sp-panel ll-sage sp-panel--sage">
          <div className="pk-head pk-head--center">
            <span className="ll-eyebrow">{es ? 'Qué incluye' : "What's included"}</span>
            <h2 className="pk-h2">{es ? <>Un solo precio fijo. <em>Sin contratos mensuales.</em></> : <>One fixed price. <em>No retainer.</em></>}</h2>
          </div>
          <div className="sp-tiers" style={{ maxWidth: pkg.tiers.length === 1 ? 480 : 880 }}>
            {pkg.tiers.map((t, ti) => {
              const tt = es ? SERVICE_PACKAGES_ES[page].tiers[ti] : t;
              const dark = !!t.featured || pkg.tiers.length === 1;
              return (
                <div key={t.name} className={`pk-card sp-tier ${dark ? 'pk-card--dark ll-forest pk-dark' : 'pk-card--paper'}`}>
                  <div>
                    <span className="pk-tag">{tt.name}</span>
                    <div className="pk-price" style={{ marginTop: 10 }}>{t.price}</div>
                    <p style={{ marginTop: 8, fontSize: 14 }}>{es ? 'pago único · precio fijo' : 'one-time · fixed price'}</p>
                  </div>
                  <ul className="pk-list" style={{ flex: 1 }}>
                    {t.items.map((f, fi) => <li key={f}><Tick />{tt.items[fi]}</li>)}
                  </ul>
                  <Button variant={dark ? 'primary' : 'inverse'} size="lg" fullWidth iconRight={Arrow} onClick={() => order(t.name)}>
                    {es ? `Elegir ${tt.name}` : <>Choose {t.name}</>}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="pk-wrap pk-section">
        <div className="pk-head pk-head--center">
          <h2 className="pk-h2">{t.turnaround}, <em>{es ? 'de principio a fin.' : 'start to finish.'}</em></h2>
        </div>
        <ol className="sp-steps">
          {t.steps.map(([st, d], i) => (
            <li key={st} className="sp-step ll-glass">
              <span className="sp-step__n">{i + 1}</span>
              <h3>{st}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <div className="sp-needs pk-card--paper">
          <h3>{es ? 'Lo que necesitamos de ti' : 'What we need from you'}</h3>
          <ul className="pk-list">
            {t.needs.map((n) => <li key={n}><Tick />{n}</li>)}
          </ul>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pk-wrap pk-wrap--narrow pk-section">
        <div className="pk-head pk-head--center">
          <h2 className="pk-h2">{es ? 'Buenas preguntas' : 'Good questions'}</h2>
        </div>
        <div className="sp-faq">
          {t.faq.map(([q, a]) => (
            <details key={q} className="ll-glass">
              <summary>{q}<Plus size={18} weight="bold" aria-hidden="true" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pk-wrap" style={{ paddingTop: 24, paddingBottom: 96 }}>
        <div className="sp-cta ll-forest ll-bezel--dark">
          <div>
            <h2>{es ? 'Listos cuando tú lo estés.' : 'Ready when you are.'}</h2>
            <p>{es ? `Agenda una llamada de 15 minutos y ponemos en marcha tu ${t.cardTitle}.` : <>Book a 15-minute call and we'll get your {pkg.cardTitle} moving.</>}</p>
          </div>
          <Button variant="primary" size="lg" iconRight={Arrow} onClick={() => order('footer')}>{es ? 'Comenzar' : 'Get started'}</Button>
        </div>
      </section>
    </main>
  );
}

export default ServicePackage;
