import React from 'react';
import { apiFetch } from '../../lib/identity';
import { STAGES } from './Leads';

// Email marketing: compose a message, pick recipients from the Leads CRM (by
// stage) and/or paste extra addresses, and send through Resend (see the
// send-email function). {{first_name}} and {{name}} are personalised per lead.

const parseExtra = (s) => s.split(/[\s,;]+/).map((e) => e.trim()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));

export default function EmailMarketing() {
  const [status, setStatus] = React.useState(null);
  const [leads, setLeads] = React.useState([]);
  const [stages, setStages] = React.useState(() => new Set(STAGES.filter((s) => s.id !== 'lost').map((s) => s.id)));
  const [excluded, setExcluded] = React.useState(() => new Set());
  const [extra, setExtra] = React.useState('');
  const [subject, setSubject] = React.useState('');
  const [body, setBody] = React.useState('Hi {{first_name}},\n\n');
  const [replyTo, setReplyTo] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [result, setResult] = React.useState(null);

  React.useEffect(() => {
    apiFetch('/.netlify/functions/send-email').then((r) => r?.json()).then(setStatus).catch(() => setStatus({ configured: false }));
    apiFetch('/.netlify/functions/get-leads').then((r) => r?.json()).then((d) => { if (Array.isArray(d)) setLeads(d.filter((l) => l.email)); });
  }, []);

  const pool = leads.filter((l) => stages.has(l.status || 'new'));
  const fromLeads = pool.filter((l) => !excluded.has(l.id));
  const extras = parseExtra(extra);
  const recipients = [
    ...fromLeads.map((l) => ({ email: l.email, name: l.full_name || '', lead_id: l.id })),
    ...extras.map((email) => ({ email, name: '' })),
  ];

  const toggle = (set, setter, id) => { const n = new Set(set); n.has(id) ? n.delete(id) : n.add(id); setter(n); };

  async function send() {
    if (!window.confirm(`Send "${subject}" to ${recipients.length} recipient${recipients.length === 1 ? '' : 's'}?`)) return;
    setSending(true); setResult(null);
    try {
      const res = await apiFetch('/.netlify/functions/send-email', { method: 'POST', body: JSON.stringify({ subject, body, recipients, reply_to: replyTo.trim() || undefined }) });
      const data = await res?.json();
      setResult(res?.ok || data?.sent ? data : { error: data?.error || 'Send failed', failed: data?.failed });
    } catch (e) { setResult({ error: e.message }); }
    setSending(false);
  }

  const canSend = status?.configured && subject.trim() && body.trim() && recipients.length && !sending;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="ll-admin-content-header" style={{ padding: '20px 32px 16px', borderBottom: '1px solid var(--border-hair)', flexShrink: 0 }}>
        <h1 style={{ margin: 0, fontSize: 'var(--fs-h1)', fontWeight: 700, letterSpacing: 'var(--ls-h1)' }}>Email Marketing</h1>
        <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--ink-400)' }}>
          {status === null ? 'Checking Resend…' : status.configured ? `Sending via Resend from ${status.from}` : 'Resend is not configured — set RESEND_API_KEY in Netlify.'}
        </p>
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '24px 32px', display: 'grid', gridTemplateColumns: 'minmax(0, 3fr) minmax(0, 2fr)', gap: 32, alignItems: 'start' }} className="ll-admin-email-grid">
        <section>
          <div style={labelStyle}>Subject</div>
          <input style={inputStyle} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="What's new at Loogo Labs" />
          <div style={{ ...labelStyle, marginTop: 16 }}>Message</div>
          <textarea style={{ ...inputStyle, minHeight: 320, resize: 'vertical', lineHeight: 1.5 }} value={body} onChange={(e) => setBody(e.target.value)} />
          <p style={{ fontSize: 12, color: 'var(--ink-400)', margin: '6px 0 0' }}>Plain text; blank lines become paragraphs. Use {'{{first_name}}'} or {'{{name}}'} to personalise.</p>
          <div style={{ ...labelStyle, marginTop: 16 }}>Reply-to (optional)</div>
          <input style={inputStyle} value={replyTo} onChange={(e) => setReplyTo(e.target.value)} placeholder="you@loogolabs.com" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
            <button onClick={send} disabled={!canSend}
              style={{ padding: '9px 18px', border: 'none', borderRadius: 'var(--radius-1)', background: canSend ? 'var(--ink-900)' : 'var(--ink-300)', color: 'var(--paper-000)', fontSize: 14, fontFamily: 'var(--font-body)', cursor: canSend ? 'pointer' : 'not-allowed' }}>
              {sending ? 'Sending…' : `Send to ${recipients.length}`}
            </button>
            {result && (result.error
              ? <span style={{ fontSize: 13, color: '#B91C1C' }}>{result.error}</span>
              : <span style={{ fontSize: 13, color: '#15803D' }}>Sent {result.sent}{result.failed?.length ? `, ${result.failed.length} failed (${result.failed[0].error})` : ''}.</span>)}
          </div>
        </section>

        <section>
          <div style={labelStyle}>Leads by stage</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {STAGES.map((s) => (
              <button key={s.id} onClick={() => toggle(stages, setStages, s.id)}
                style={{ ...chipStyle, ...(stages.has(s.id) ? { background: s.bg, color: s.color, borderColor: s.color } : {}) }}>{s.label}</button>
            ))}
          </div>
          <div style={{ marginTop: 12, maxHeight: 300, overflow: 'auto', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', background: 'var(--paper-000)' }}>
            {pool.length === 0 && <div style={{ padding: 12, fontSize: 13, color: 'var(--ink-400)' }}>No leads with email in these stages.</div>}
            {pool.map((l) => (
              <label key={l.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '7px 12px', fontSize: 13, borderBottom: '1px solid var(--border-hair)', cursor: 'pointer' }}>
                <input type="checkbox" checked={!excluded.has(l.id)} onChange={() => toggle(excluded, setExcluded, l.id)} />
                <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {l.full_name || '—'} <span style={{ color: 'var(--ink-400)' }}>{l.email}</span>
                </span>
              </label>
            ))}
          </div>
          <div style={{ ...labelStyle, marginTop: 16 }}>Additional addresses</div>
          <textarea style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }} value={extra} onChange={(e) => setExtra(e.target.value)} placeholder="one@example.com, two@example.com" />
          <p style={{ fontSize: 12, color: 'var(--ink-400)', margin: '6px 0 0' }}>{fromLeads.length} lead{fromLeads.length === 1 ? '' : 's'} + {extras.length} extra. Each person gets their own email.</p>
        </section>
      </div>
    </div>
  );
}

const chipStyle = { padding: '5px 10px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 12, fontFamily: 'var(--font-body)', background: 'var(--paper-000)', color: 'var(--ink-700)', cursor: 'pointer' };
const inputStyle = { padding: '7px 10px', border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-1)', fontSize: 13, fontFamily: 'var(--font-body)', background: 'var(--paper-000)', color: 'var(--ink-900)', boxSizing: 'border-box', width: '100%' };
const labelStyle = { fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 6 };
