import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Input from '../components/forms/Input';
import Select from '../components/forms/Select';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const REFERRAL_OPTIONS = [
  { value: '', label: 'Select one…' },
  { value: 'word-of-mouth', label: 'Word of mouth' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'search', label: 'Search' },
  { value: 'press', label: 'Press / article' },
  { value: 'other', label: 'Other' },
];


function Textarea({ label, hint, error, value, onChange, placeholder, rows = 4, id, style }) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  return (
    <div style={{ display: 'grid', gap: 6, ...style }}>
      {label ? <label htmlFor={inputId} className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>{label}</label> : null}
      <textarea id={inputId} value={value} onChange={onChange} placeholder={placeholder} rows={rows}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          fontFamily: 'var(--font-body)', fontSize: 15, lineHeight: 1.5, color: 'var(--ink-900)',
          background: 'var(--paper-000)', padding: '10px 12px', borderRadius: 'var(--radius-2)',
          border: '1px solid ' + (error ? 'var(--status-danger)' : focus ? 'var(--ink-900)' : 'var(--border-hair)'),
          outline: focus ? '2px solid var(--cyan-500)' : 'none', outlineOffset: 2,
          resize: 'vertical', transition: 'border-color var(--dur-fast) var(--ease-standard)',
        }} />
      {error ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--status-danger)' }}>{error}</span>
        : hint ? <span style={{ fontSize: 13, color: 'var(--ink-400)' }}>{hint}</span> : null}
    </div>
  );
}

const EMPTY = { fullName: '', company: '', email: '', industry: '', dataProblem: '', decisionItFeeds: '', referral: '' };

function Contact() {
  const [fields, setFields] = React.useState(EMPTY);
  const [errors, setErrors] = React.useState({});
  const [status, setStatus] = React.useState('idle'); // idle | submitting | success | error

  function set(key) {
    return e => setFields(f => ({ ...f, [key]: e.target.value }));
  }

  function validate() {
    const e = {};
    if (!fields.fullName.trim()) e.fullName = 'Required';
    if (!fields.company.trim()) e.company = 'Required';
    if (!fields.email.trim()) e.email = 'Required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) e.email = 'Enter a valid email';
    if (!fields.dataProblem.trim()) e.dataProblem = 'Required';
    return e;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus('submitting');
    try {
      const res = await fetch('/.netlify/functions/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fields.fullName,
          company: fields.company,
          email: fields.email,
          industry: fields.industry || null,
          data_problem: fields.dataProblem,
          decision_it_feeds: fields.decisionItFeeds || null,
          referral: fields.referral || null,
        }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  return (
    <main>
      <section className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)', padding: '80px 0 72px' }}>
        <Wrap>
          <Badge tone="inverse">Work with us</Badge>
          <h1 style={{ margin: '20px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
            letterSpacing: 'var(--ls-display-2)', maxWidth: '22ch' }}>
            Tell us about your data problem.
          </h1>
          <p style={{ maxWidth: '52ch', margin: '20px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-300)' }}>
            We read every submission. If there is a fit, we will reach out directly — no sales
            funnel, no automated sequence. Just a real conversation about whether we can help.
          </p>
        </Wrap>
      </section>

      <Wrap style={{ padding: '72px 24px 96px' }}>
        {status === 'success' ? (
          <Success />
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: 64, alignItems: 'start' }}>
            <form onSubmit={handleSubmit} noValidate style={{ display: 'grid', gap: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Input label="Full name" placeholder="Jane Smith" value={fields.fullName} onChange={set('fullName')} error={errors.fullName} />
                <Input label="Company" placeholder="Acme Corp" value={fields.company} onChange={set('company')} error={errors.company} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
                <Input label="Work email" type="email" placeholder="jane@acme.com" value={fields.email} onChange={set('email')} error={errors.email} />
                <Input label="Industry or sector" placeholder="e.g. Hospitality, Logistics…" value={fields.industry} onChange={set('industry')}
                  hint="Helps us understand your context" />
              </div>
              <Textarea label="What is the data problem you are trying to solve?"
                placeholder="Describe the records, systems, or formats you are working with and what makes them hard to use…"
                rows={5} value={fields.dataProblem} onChange={set('dataProblem')} error={errors.dataProblem} />
              <Textarea label="What decision does that data feed?"
                placeholder="e.g. Pricing, inventory planning, valuation, compliance reporting…"
                rows={3} value={fields.decisionItFeeds} onChange={set('decisionItFeeds')}
                hint="Optional, but helpful" />
              <Select label="How did you hear about us?" options={REFERRAL_OPTIONS} value={fields.referral} onChange={set('referral')} />

              {status === 'error' && (
                <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', color: 'var(--status-danger)' }}>
                  Something went wrong. Try again or email us directly.
                </p>
              )}

              <div>
                <Button variant="primary" size="lg" iconRight={<span>→</span>} disabled={status === 'submitting'}>
                  {status === 'submitting' ? 'Sending…' : 'Send it'}
                </Button>
              </div>
            </form>

            <aside style={{ display: 'grid', gap: 32, paddingTop: 4 }}>
              <div>
                <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>What happens next</span>
                <div style={{ display: 'grid', gap: 16, marginTop: 16 }}>
                  {[
                    ['We read it', 'Every submission is reviewed by the team, not a bot. If the problem fits what we build, you will hear from us within a few days.'],
                    ['One real conversation', 'No demo deck, no pitch. We ask questions, you ask questions, and we figure out together whether there is a fit.'],
                    ['We move fast if there is a match', 'We keep a short list of active engagements. If we take it on, we start quickly and stay close.'],
                  ].map(([title, body]) => (
                    <div key={title} style={{ paddingTop: 16, borderTop: '1px solid var(--border-hair)' }}>
                      <div style={{ fontWeight: 600, fontSize: 'var(--fs-body-sm)' }}>{title}</div>
                      <div style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-400)', marginTop: 4 }}>{body}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ padding: '20px', background: 'var(--paper-200)', borderRadius: 'var(--radius-2)', border: '1px solid var(--border-hair)' }}>
                <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>Not ready to fill this out?</span>
                <p style={{ margin: '10px 0 0', fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-600)' }}>
                  Read our <strong>Mission</strong> to understand how we pick what we build — it is the fastest way to know whether we are the right fit before getting in touch.
                </p>
              </div>
            </aside>
          </div>
        )}
      </Wrap>
    </main>
  );
}

function Success() {
  return (
    <div style={{ maxWidth: 560 }}>
      <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--cyan-500)', display: 'flex', alignItems: 'center',
        justifyContent: 'center', fontSize: 20, marginBottom: 24 }}>✓</div>
      <h2 style={{ margin: 0, fontSize: 'var(--fs-display-3)', fontWeight: 700, letterSpacing: 'var(--ls-display-3)' }}>
        We have it.
      </h2>
      <p style={{ margin: '16px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>
        Your submission came through. If there is a fit, someone from the team will reach out
        directly within a few days. No automated emails in the meantime.
      </p>
    </div>
  );
}

export default Contact;
