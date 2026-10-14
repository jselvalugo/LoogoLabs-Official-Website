import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { getSessionId } from '../lib/sessionTracker';
import { useLang } from '../lib/i18n';
import { ArrowRight, Check } from '@phosphor-icons/react';
import '../styles/pages/packages.css';

// Brand partnerships: Marketing Strategy and AI Consulting, scoped per brand.
// Sign-ups land in the admin Leads table with source 'brand_partnership'.
export const PARTNER_PROGRAMS = [
  {
    id: 'marketing_strategy',
    title: 'Marketing Strategy',
    tagline: 'A clear plan for where your growth comes from next.',
    items: [
      'Audit of your channels, funnel and messaging',
      'Positioning & offer refinement',
      'Channel plan with budget and targets',
      '90-day roadmap your team can run',
      'Monthly strategy sessions',
    ],
    es: {
      title: 'Estrategia de Marketing',
      tagline: 'Un plan claro de dónde vendrá tu próximo crecimiento.',
      items: [
        'Auditoría de tus canales, embudo y mensajes',
        'Posicionamiento y ajuste de tu oferta',
        'Plan de canales con presupuesto y metas',
        'Hoja de ruta de 90 días que tu equipo puede ejecutar',
        'Sesiones mensuales de estrategia',
      ],
    },
  },
  {
    id: 'ai_consulting',
    title: 'AI Consulting',
    tagline: 'Put AI to work where it actually saves time and money.',
    items: [
      'Operations & workflow assessment',
      'AI opportunity map ranked by ROI',
      'Tool selection & implementation plan',
      'Custom AI agents and automations',
      'Team training & rollout support',
    ],
    es: {
      title: 'Consultoría de IA',
      tagline: 'Pon la IA a trabajar donde de verdad ahorra tiempo y dinero.',
      items: [
        'Evaluación de operaciones y flujos de trabajo',
        'Mapa de oportunidades de IA ordenado por retorno',
        'Selección de herramientas y plan de implementación',
        'Agentes de IA y automatizaciones a la medida',
        'Capacitación del equipo y apoyo en la implementación',
      ],
    },
  },
];

const Arrow = <ArrowRight size={16} weight="bold" />;
const Tick = () => <Check className="pk-check" size={16} weight="bold" aria-hidden="true" />;
const COPY = {
  en: {
    badge: 'Brand partnerships',
    h1: <>Partner with Loogo Labs. <em>Strategy and AI, built for your brand.</em></>,
    lede: "We team up with brands on marketing strategy and AI consulting, scoped to where you are and where you want to go. Tell us about your brand and we'll reach out to plan the partnership.",
    apply: 'Apply to partner',
    meta: 'Custom scope · Project or retainer · Pricing on application',
    tag: 'Partnership',
    interested: "I'm interested",
    thanksH: <>Thanks, <em>we've got it.</em></>,
    thanksP: "We'll review your brand and reach out within two business days.",
    formSub: 'Takes about a minute. No commitment.',
    legend: "I'm interested in",
    name: 'Full name *', email: 'Email *', company: 'Brand / company *', website: 'Website', phone: 'Phone',
    budget: 'Monthly budget', select: 'Select…',
    budgets: ['Under $1,000', '$1,000 – $3,000', '$3,000 – $10,000', '$10,000+', 'Not sure yet'],
    goals: 'What do you want to achieve?',
    errRequired: 'Please add your name, a valid email and your brand name.',
    errProgram: 'Pick at least one program.',
    errSend: 'Something went wrong. Please try again in a moment.',
    sending: 'Sending…', submit: 'Submit application',
  },
  es: {
    badge: 'Alianzas con marcas',
    h1: <>Asóciate con Loogo Labs. <em>Estrategia e IA, hechas para tu marca.</em></>,
    lede: 'Nos aliamos con marcas en estrategia de marketing y consultoría de IA, a la medida de dónde estás y hacia dónde quieres ir. Cuéntanos sobre tu marca y te contactaremos para planear la alianza.',
    apply: 'Postularme',
    meta: 'Alcance a la medida · Proyecto o mensualidad · Precio según la solicitud',
    tag: 'Alianza',
    interested: 'Me interesa',
    thanksH: <>Gracias, <em>ya lo recibimos.</em></>,
    thanksP: 'Revisaremos tu marca y te contactaremos en un plazo de dos días hábiles.',
    formSub: 'Toma alrededor de un minuto. Sin compromiso.',
    legend: 'Me interesa',
    name: 'Nombre completo *', email: 'Correo electrónico *', company: 'Marca / empresa *', website: 'Sitio web', phone: 'Teléfono',
    budget: 'Presupuesto mensual', select: 'Selecciona…',
    budgets: ['Menos de $1,000', '$1,000 – $3,000', '$3,000 – $10,000', '$10,000+', 'Aún no lo sé'],
    goals: '¿Qué quieres lograr?',
    errRequired: 'Agrega tu nombre, un correo válido y el nombre de tu marca.',
    errProgram: 'Elige al menos un programa.',
    errSend: 'Algo salió mal. Inténtalo de nuevo en un momento.',
    sending: 'Enviando…', submit: 'Enviar solicitud',
  },
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const fieldStyle = {
  width: '100%', boxSizing: 'border-box', fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--ink-900)',
  background: 'var(--paper-000)', padding: '11px 14px', minHeight: 44, borderRadius: 'var(--radius-2)', border: '1px solid rgba(26,38,16,0.12)',
};

function Field({ label, children }) {
  return (
    <label style={{ display: 'grid', gap: 5 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)' }}>{label}</span>
      {children}
    </label>
  );
}

function BrandPartners() {
  const lang = useLang();
  const c = COPY[lang] || COPY.en;
  const programs = lang === 'es' ? PARTNER_PROGRAMS.map((p) => ({ ...p, ...p.es })) : PARTNER_PROGRAMS;
  const [form, setForm] = React.useState({ full_name: '', email: '', company: '', website: '', phone: '', budget: '', goals: '' });
  const [interests, setInterests] = React.useState(() => {
    const pre = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('program') : null;
    return PARTNER_PROGRAMS.some((p) => p.id === pre) ? [pre] : [];
  });
  const [status, setStatus] = React.useState('idle'); // idle | sending | done | error
  const [error, setError] = React.useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const toggle = (id) => setInterests((xs) => (xs.includes(id) ? xs.filter((x) => x !== id) : [...xs, id]));

  async function submit(e) {
    e.preventDefault();
    if (!form.full_name.trim() || !EMAIL_RE.test(form.email.trim()) || !form.company.trim()) {
      setError(c.errRequired);
      return;
    }
    if (interests.length === 0) { setError(c.errProgram); return; }
    setError('');
    setStatus('sending');
    const labels = PARTNER_PROGRAMS.filter((p) => interests.includes(p.id)).map((p) => p.title).join(' + ');
    const notes = [
      lang === 'es' && 'Language: Spanish',
      `Brand: ${form.company.trim()}`,
      form.website.trim() && `Website: ${form.website.trim()}`,
      form.phone.trim() && `Phone: ${form.phone.trim()}`,
      `Interested in: ${labels}`,
      form.budget && `Budget: ${form.budget}`,
      form.goals.trim() && `Goals:\n${form.goals.trim()}`,
    ].filter(Boolean).join('\n');
    try {
      const res = await fetch('/.netlify/functions/create-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'brand_partnership',
          full_name: form.full_name.trim(),
          email: form.email.trim(),
          business_type: form.company.trim(),
          pain_point: labels,
          company: form.company.trim(),
          phone: form.phone.trim(),
          notes,
          session_id: getSessionId(),
        }),
      });
      if (!res.ok) throw new Error();
      if (window.fbq) window.fbq('track', 'Lead', { content_name: 'brand_partnership' });
      setStatus('done');
    } catch {
      setStatus('error');
      setError(c.errSend);
    }
  }

  return (
    <main>
      <section className="pk-wrap pk-hero pk-hero--center">
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="accent">{c.badge}</Badge></div>
        <h1 className="pk-title">{c.h1}</h1>
        <p className="pk-lede">{c.lede}</p>
        <div className="pk-hero__actions">
          <Button variant="inverse" size="lg" iconRight={Arrow}
            onClick={() => document.getElementById('partner-signup')?.scrollIntoView({ behavior: 'smooth' })}>
            {c.apply}
          </Button>
        </div>
        <div className="pk-tag pk-hero__meta">{c.meta}</div>
      </section>

      <section className="pk-wrap pk-section">
        <div className="sp-tiers" style={{ maxWidth: 880 }}>
          {programs.map((p, i) => {
            const dark = i === 1;
            return (
              <div key={p.id} className={`pk-card sp-tier ${dark ? 'pk-card--dark ll-forest pk-dark' : 'pk-card--paper'}`}>
                <div>
                  <span className="pk-tag">{c.tag}</span>
                  <h2 style={{ marginTop: 10 }}>{p.title}</h2>
                  <p style={{ marginTop: 8, fontSize: 14 }}>{p.tagline}</p>
                </div>
                <ul className="pk-list" style={{ flex: 1 }}>
                  {p.items.map((f) => <li key={f}><Tick />{f}</li>)}
                </ul>
                <Button variant={dark ? 'primary' : 'inverse'} size="lg" fullWidth iconRight={Arrow}
                  onClick={() => {
                    setInterests((xs) => (xs.includes(p.id) ? xs : [...xs, p.id]));
                    document.getElementById('partner-signup')?.scrollIntoView({ behavior: 'smooth' });
                  }}>
                  {c.interested}
                </Button>
              </div>
            );
          })}
        </div>
      </section>

      <section id="partner-signup" className="pk-wrap pk-wrap--narrow pk-section" style={{ paddingBottom: 96, scrollMarginTop: 96 }}>
        <div className="sp-needs pk-card--paper" style={{ padding: 28 }}>
          {status === 'done' ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <h2 className="pk-h2">{c.thanksH}</h2>
              <p style={{ color: 'var(--ink-500)' }}>{c.thanksP}</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
              <div>
                <h2 className="pk-h2" style={{ margin: 0 }}>{c.apply}</h2>
                <p style={{ margin: '6px 0 0', color: 'var(--ink-500)', fontSize: 15 }}>{c.formSub}</p>
              </div>
              <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <legend style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 8 }}>{c.legend}</legend>
                {programs.map((p) => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-2)', cursor: 'pointer',
                    border: `1px solid ${interests.includes(p.id) ? 'var(--ink-900)' : 'rgba(26,38,16,0.14)'}`, background: 'var(--paper-000)', fontSize: 14 }}>
                    <input type="checkbox" checked={interests.includes(p.id)} onChange={() => toggle(p.id)} />
                    {p.title}
                  </label>
                ))}
              </fieldset>
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <Field label={c.name}><input style={fieldStyle} value={form.full_name} onChange={set('full_name')} autoComplete="name" /></Field>
                <Field label={c.email}><input style={fieldStyle} type="email" value={form.email} onChange={set('email')} autoComplete="email" /></Field>
                <Field label={c.company}><input style={fieldStyle} value={form.company} onChange={set('company')} autoComplete="organization" /></Field>
                <Field label={c.website}><input style={fieldStyle} value={form.website} onChange={set('website')} placeholder="https://" autoComplete="url" /></Field>
                <Field label={c.phone}><input style={fieldStyle} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></Field>
                <Field label={c.budget}>
                  <select style={fieldStyle} value={form.budget} onChange={set('budget')}>
                    <option value="">{c.select}</option>
                    {c.budgets.map((b) => <option key={b}>{b}</option>)}
                  </select>
                </Field>
              </div>
              <Field label={c.goals}>
                <textarea style={{ ...fieldStyle, resize: 'vertical' }} rows={4} value={form.goals} onChange={set('goals')} />
              </Field>
              {error && <p role="alert" style={{ margin: 0, color: '#B91C1C', fontSize: 14 }}>{error}</p>}
              <Button type="submit" variant="inverse" size="lg" fullWidth iconRight={Arrow} disabled={status === 'sending'}>
                {status === 'sending' ? c.sending : c.submit}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default BrandPartners;
