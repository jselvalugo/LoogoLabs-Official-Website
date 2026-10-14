import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { getSessionId } from '../lib/sessionTracker';
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
  },
];

const Arrow = <ArrowRight size={16} weight="bold" />;
const Tick = () => <Check className="pk-check" size={16} weight="bold" aria-hidden="true" />;
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
      setError('Please add your name, a valid email and your brand name.');
      return;
    }
    if (interests.length === 0) { setError('Pick at least one program.'); return; }
    setError('');
    setStatus('sending');
    const labels = PARTNER_PROGRAMS.filter((p) => interests.includes(p.id)).map((p) => p.title).join(' + ');
    const notes = [
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
          notes,
          session_id: getSessionId(),
        }),
      });
      if (!res.ok) throw new Error();
      if (window.fbq) window.fbq('track', 'Lead', { content_name: 'brand_partnership' });
      setStatus('done');
    } catch {
      setStatus('error');
      setError('Something went wrong. Please try again in a moment.');
    }
  }

  return (
    <main>
      <section className="pk-wrap pk-hero pk-hero--center">
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="accent">Brand partnerships</Badge></div>
        <h1 className="pk-title">Partner with Loogo Labs. <em>Strategy and AI, built for your brand.</em></h1>
        <p className="pk-lede">
          We team up with brands on marketing strategy and AI consulting, scoped to where you are and where you want to go.
          Tell us about your brand and we'll reach out to plan the partnership.
        </p>
        <div className="pk-hero__actions">
          <Button variant="inverse" size="lg" iconRight={Arrow}
            onClick={() => document.getElementById('partner-signup')?.scrollIntoView({ behavior: 'smooth' })}>
            Apply to partner
          </Button>
        </div>
        <div className="pk-tag pk-hero__meta">Custom scope · Project or retainer · Pricing on application</div>
      </section>

      <section className="pk-wrap pk-section">
        <div className="sp-tiers" style={{ maxWidth: 880 }}>
          {PARTNER_PROGRAMS.map((p, i) => {
            const dark = i === 1;
            return (
              <div key={p.id} className={`pk-card sp-tier ${dark ? 'pk-card--dark ll-forest pk-dark' : 'pk-card--paper'}`}>
                <div>
                  <span className="pk-tag">Partnership</span>
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
                  I'm interested
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
              <h2 className="pk-h2">Thanks, <em>we've got it.</em></h2>
              <p style={{ color: 'var(--ink-500)' }}>We'll review your brand and reach out within two business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} noValidate style={{ display: 'grid', gap: 16 }}>
              <div>
                <h2 className="pk-h2" style={{ margin: 0 }}>Apply to partner</h2>
                <p style={{ margin: '6px 0 0', color: 'var(--ink-500)', fontSize: 15 }}>Takes about a minute. No commitment.</p>
              </div>
              <fieldset style={{ border: 0, padding: 0, margin: 0, display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                <legend style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink-700)', marginBottom: 8 }}>I'm interested in</legend>
                {PARTNER_PROGRAMS.map((p) => (
                  <label key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 'var(--radius-2)', cursor: 'pointer',
                    border: `1px solid ${interests.includes(p.id) ? 'var(--ink-900)' : 'rgba(26,38,16,0.14)'}`, background: 'var(--paper-000)', fontSize: 14 }}>
                    <input type="checkbox" checked={interests.includes(p.id)} onChange={() => toggle(p.id)} />
                    {p.title}
                  </label>
                ))}
              </fieldset>
              <div style={{ display: 'grid', gap: 14, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
                <Field label="Full name *"><input style={fieldStyle} value={form.full_name} onChange={set('full_name')} autoComplete="name" /></Field>
                <Field label="Email *"><input style={fieldStyle} type="email" value={form.email} onChange={set('email')} autoComplete="email" /></Field>
                <Field label="Brand / company *"><input style={fieldStyle} value={form.company} onChange={set('company')} autoComplete="organization" /></Field>
                <Field label="Website"><input style={fieldStyle} value={form.website} onChange={set('website')} placeholder="https://" autoComplete="url" /></Field>
                <Field label="Phone"><input style={fieldStyle} type="tel" value={form.phone} onChange={set('phone')} autoComplete="tel" /></Field>
                <Field label="Monthly budget">
                  <select style={fieldStyle} value={form.budget} onChange={set('budget')}>
                    <option value="">Select…</option>
                    <option>Under $1,000</option>
                    <option>$1,000 – $3,000</option>
                    <option>$3,000 – $10,000</option>
                    <option>$10,000+</option>
                    <option>Not sure yet</option>
                  </select>
                </Field>
              </div>
              <Field label="What do you want to achieve?">
                <textarea style={{ ...fieldStyle, resize: 'vertical' }} rows={4} value={form.goals} onChange={set('goals')} />
              </Field>
              {error && <p role="alert" style={{ margin: 0, color: '#B91C1C', fontSize: 14 }}>{error}</p>}
              <Button type="submit" variant="inverse" size="lg" fullWidth iconRight={Arrow} disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Submit application'}
              </Button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}

export default BrandPartners;
