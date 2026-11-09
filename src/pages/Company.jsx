import React from 'react';
import Button from '../components/core/Button';
import { ArrowRight, ArrowUpRight } from '@phosphor-icons/react';
import { openBooking } from '../lib/booking';
import { CUSTOMERS } from '../lib/customers';
import { useLang } from '../lib/i18n';

// Who We Serve: one thin band per customer, each wearing that customer's colours.
// The founder story moved to the About page (/about), linked from the footer.

function CustomerBand({ c, es }) {
  const blurb = (es && c.blurbEs) || c.blurb;
  return (
    <li className="ll-cust" style={{ '--cust-accent': c.accent, '--cust-chip': c.chipBg }}>
      <div className={`ll-cust__chip${c.fit === 'cover' ? ' ll-cust__chip--cover' : ''}`}>
        {c.logo
          ? <img src={c.logo} alt={`${c.name} logo`} loading="lazy" decoding="async" />
          : <span className="ll-cust__script">{c.wordmark || c.name}</span>}
      </div>
      <div className="ll-cust__body">
        <div className="ll-cust__head">
          <h2 className="ll-cust__name">{c.name}</h2>
          <span className="ll-cust__kind">{es ? c.kindEs : c.kind}</span>
        </div>
        <p className="ll-cust__blurb">{blurb}</p>
      </div>
      {c.url ? (
        <a className="ll-cust__link" href={c.url} target="_blank" rel="noopener noreferrer">
          {es ? 'Visitar sitio' : 'Visit site'} <ArrowUpRight size={14} weight="bold" />
        </a>
      ) : <span className="ll-cust__link" aria-hidden="true" />}
    </li>
  );
}

function Company({ onNavigate }) {
  const es = useLang() === 'es';
  return (
    <main>
      <section className="ll-staple-wrap ll-cust-hero">
        <span className="ll-eyebrow">{es ? 'A quién servimos' : 'Who we serve'}</span>
        {es
          ? <h1 className="ll-staple-h2">Las marcas para las que <em>construimos.</em></h1>
          : <h1 className="ll-staple-h2">The brands we <em>build for.</em></h1>}
        <p className="ll-staple-sub">
          {es
            ? 'Marcas SaaS, creadores y negocios locales que confiaron en Loogo Labs LLC para planear su marketing y construir el sistema que lo hace funcionar.'
            : 'SaaS brands, creators and local businesses that trusted Loogo Labs LLC to plan their marketing and build the system that makes it work.'}
        </p>
      </section>

      <section className="ll-staple-wrap">
        <ul className="ll-cust-list">
          {CUSTOMERS.map((c) => <CustomerBand key={c.name} c={c} es={es} />)}
        </ul>
      </section>

      <section className="ll-staple-wrap ll-cust-close">
        <div>
          <h2 className="ll-staple-h2">{es ? '¿Tu marca es la siguiente?' : 'Is your brand next?'}</h2>
          <p className="ll-staple-sub">
            {es
              ? 'Cuéntanos qué está frenando tu marketing. Te decimos qué construiríamos primero.'
              : 'Tell us what is holding your marketing back. We will tell you what we would build first.'}
          </p>
        </div>
        <div className="ll-staple-actions" style={{ marginTop: 0 }}>
          <Button variant="primary" iconRight={<ArrowRight size={16} weight="bold" />} onClick={openBooking}>
            {es ? 'Agenda una llamada de estrategia gratis' : 'Book a free strategy call'}
          </Button>
          <button type="button" className="ll-staple-textlink" onClick={() => onNavigate('About')}>
            {es ? 'Conoce al fundador' : 'Meet the founder'} <ArrowRight size={16} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default Company;
