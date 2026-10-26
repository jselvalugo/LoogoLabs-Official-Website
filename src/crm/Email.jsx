import React from 'react';
import { data } from './api';
import { Drawer, Stat, count, stamp } from './report';

// Email marketing through Resend: a subscriber list kept apart from CRM
// contacts, one-off campaigns, and automations (drip sequences). Campaigns and
// automation emails are queued and sent by the email-worker function every 10
// minutes, up to the daily limit (100/day on Resend's free plan).

const tagsText = (tags) => (tags || []).join(', ');
const FORMAT_HELP = 'Plain text. Blank line = new paragraph · "# " = heading · [label](https://…) = link, or a button when on its own line · **bold** · {{first_name|there}} = their first name';

function useOverview(tick) {
  const [o, setO] = React.useState(null);
  React.useEffect(() => { data('email_overview').then(setO).catch(() => setO(null)); }, [tick]);
  return o;
}

function SetupNotice({ o }) {
  if (!o?.setup?.length) return null;
  return <p className="notice">Sending is off until these are set in Netlify → Site configuration → Environment variables: <strong>{o.setup.join(', ')}</strong>.</p>;
}

function Usage({ o }) {
  if (!o) return null;
  return (
    <div className="stats stats-4" style={{ marginBottom: 18 }}>
      <Stat k="Subscribed" n={count(o.subscribed)} />
      <Stat k="Unsubscribed" n={count(o.unsubscribed)} />
      <Stat k="Sent, last 24h" n={count(o.sent_24h)} v={`of ${count(o.daily_limit)} a day`} />
      <Stat k="Waiting to send" n={count(o.queued)} v={o.queued > Math.max(0, o.daily_limit - o.sent_24h) ? 'Goes out over the next days' : 'Within today’s limit'} />
    </div>
  );
}

function TagSelect({ o, value, onChange, all = 'Everyone', id }) {
  return (
    <select id={id} className="field" style={id ? undefined : { width: 'auto', maxWidth: '100%' }} aria-label="Tag" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">{all}</option>
      {(o?.tags || []).map((t) => <option key={t.tag} value={t.tag}>{t.tag} ({t.n})</option>)}
      {value && !(o?.tags || []).some((t) => t.tag === value) && <option value={value}>{value}</option>}
    </select>
  );
}

// ── Audience ────────────────────────────────────────────────────────────────

export function Audience({ version }) {
  const [tick, setTick] = React.useState(0);
  const o = useOverview(tick + version);
  const [rows, setRows] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const [tag, setTag] = React.useState('');
  const [status, setStatus] = React.useState('');
  const [open, setOpen] = React.useState(null); // subscriber | 'new' | 'import'
  React.useEffect(() => {
    const t = setTimeout(() => data('email_subscribers', { search, tag, status }).then(setRows).catch(() => setRows([])), 200);
    return () => clearTimeout(t);
  }, [search, tag, status, tick, version]);
  const reload = () => setTick((t) => t + 1);

  return (
    <>
      <div className="head">
        <h1>Email audience</h1>
        <button className="btn" onClick={() => setOpen('import')}>Import</button>
        <button className="btn btn-primary" onClick={() => setOpen('new')}>Add subscriber</button>
      </div>
      <p className="muted count">Your marketing list. It is separate from CRM contacts: adding someone here never touches your business records, and only people on this list get campaigns.</p>
      <SetupNotice o={o} />
      <Usage o={o} />
      <div className="head">
        <input className="field" style={{ flex: 1, minWidth: 180 }} placeholder="Search email or name" aria-label="Search" value={search} onChange={(e) => setSearch(e.target.value)} />
        <TagSelect o={o} value={tag} onChange={setTag} all="All tags" />
        <select className="field" style={{ width: 'auto' }} aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Any status</option><option value="subscribed">Subscribed</option><option value="unsubscribed">Unsubscribed</option>
        </select>
      </div>
      <div className="card" style={{ overflowX: 'auto' }}>
        {!rows ? <p className="muted" style={{ padding: 16 }}>Loading…</p> : rows.length === 0 ? <p className="muted" style={{ padding: 16 }}>No subscribers yet.</p> : (
          <table>
            <thead><tr><th>Email</th><th className="hide-sm">Name</th><th>Tags</th><th>Status</th><th className="hide-sm">Added</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setOpen(r)}>
                  <td><strong>{r.email}</strong></td><td className="hide-sm">{r.name}</td><td>{tagsText(r.tags)}</td>
                  <td><span className={`pill ${r.status === 'subscribed' ? 'won' : 'lost'}`}>{r.status}</span></td>
                  <td className="hide-sm">{stamp(r.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {open === 'import' && <ImportDrawer onClose={() => setOpen(null)} onDone={reload} />}
      {open && open !== 'import' && (
        <SubscriberDrawer key={open === 'new' ? 'new' : open.id} sub={open === 'new' ? null : open}
          onClose={() => setOpen(null)} onSaved={() => { reload(); setOpen(null); }} />
      )}
    </>
  );
}

function SubscriberDrawer({ sub, onClose, onSaved }) {
  const [form, setForm] = React.useState(() => (sub ? { ...sub, tags: tagsText(sub.tags) } : { email: '', name: '', tags: '', status: 'subscribed' }));
  const [error, setError] = React.useState('');
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));

  async function save(e) {
    e.preventDefault();
    setError('');
    try { await data('save_subscriber', { values: form }); onSaved(); } catch (err) { setError(err.message); }
  }
  async function remove() {
    if (!window.confirm(`Delete ${sub.email} from the list? To stop emailing them but keep the opt-out on record, mark them unsubscribed instead.`)) return;
    await data('delete_subscriber', { id: sub.id });
    onSaved();
  }

  return (
    <Drawer title={sub ? sub.email : 'Add subscriber'} kicker="Email audience" onClose={onClose}>
      <form onSubmit={save}>
        {!sub && (
          <>
            <label className="label" htmlFor="s-email">Email *</label>
            <input id="s-email" type="email" className="field" required value={form.email} onChange={set('email')} />
          </>
        )}
        <label className="label" htmlFor="s-name">Name</label>
        <input id="s-name" className="field" value={form.name || ''} onChange={set('name')} />
        <label className="label" htmlFor="s-tags">Tags (comma separated)</label>
        <input id="s-tags" className="field" placeholder="newsletter, dentists" value={form.tags} onChange={set('tags')} />
        {sub && (
          <>
            <label className="label" htmlFor="s-status">Status</label>
            <select id="s-status" className="field" value={form.status} onChange={set('status')}>
              <option value="subscribed">Subscribed</option><option value="unsubscribed">Unsubscribed</option>
            </select>
          </>
        )}
        {!sub && <p className="muted" style={{ fontSize: 13 }}>Only add people who agreed to get email from you.</p>}
        {error && <div className="error">{error}</div>}
        <div className="actions">
          <button className="btn btn-primary">{sub ? 'Save' : 'Add'}</button>
          {sub && <button type="button" className="btn btn-danger" onClick={remove}>Delete</button>}
        </div>
      </form>
    </Drawer>
  );
}

function ImportDrawer({ onClose, onDone }) {
  const [text, setText] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(''); setResult(null);
    try { setResult(await data('import_subscribers', { values: { text, tags } })); onDone(); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function file(e) {
    const f = e.target.files?.[0];
    if (f) setText(await f.text());
  }

  return (
    <Drawer title="Import subscribers" kicker="Email audience" onClose={onClose}>
      <form onSubmit={submit}>
        <p className="muted">One person per line: <code>email</code> or <code>email, name</code>. A CSV file works too (first two columns). People who unsubscribed stay unsubscribed.</p>
        <input type="file" accept=".csv,.txt" onChange={file} aria-label="CSV file" />
        <label className="label" htmlFor="i-text">Rows</label>
        <textarea id="i-text" className="field" rows={10} placeholder={'ana@example.com, Ana Ruiz\nben@example.com'} value={text} onChange={(e) => setText(e.target.value)} required />
        <label className="label" htmlFor="i-tags">Tag everyone with (optional)</label>
        <input id="i-tags" className="field" placeholder="newsletter" value={tags} onChange={(e) => setTags(e.target.value)} />
        {error && <div className="error">{error}</div>}
        {result && (
          <p className="notice">Added or updated {result.added}.{result.skipped_count ? ` Skipped ${result.skipped_count} invalid: ${result.skipped.join(', ')}` : ''}</p>
        )}
        <div className="actions"><button className="btn btn-primary" disabled={busy}>{busy ? 'Importing…' : 'Import'}</button></div>
      </form>
    </Drawer>
  );
}

// ── Campaigns ───────────────────────────────────────────────────────────────

const CAMPAIGN_STATUS = { draft: 'Draft', sending: 'Sending', sent: 'Sent' };

export function Campaigns({ version }) {
  const [tick, setTick] = React.useState(0);
  const o = useOverview(tick + version);
  const [rows, setRows] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => { data('email_campaigns').then(setRows).catch(() => setRows([])); }, [tick, version]);

  return (
    <>
      <div className="head">
        <h1>Email campaigns</h1>
        <button className="btn btn-primary" onClick={() => setOpen('new')}>New campaign</button>
      </div>
      <p className="muted count">One-off emails to your whole list or one tag, sent through Resend.</p>
      <SetupNotice o={o} />
      <div className="card" style={{ overflowX: 'auto' }}>
        {!rows ? <p className="muted" style={{ padding: 16 }}>Loading…</p> : rows.length === 0 ? <p className="muted" style={{ padding: 16 }}>No campaigns yet.</p> : (
          <table>
            <thead><tr><th>Campaign</th><th className="hide-sm">Audience</th><th>Status</th><th className="num">Sent</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setOpen(r)}>
                  <td><strong>{r.name}</strong><div className="muted" style={{ fontSize: 13 }}>{r.subject}</div></td>
                  <td className="hide-sm">{r.audience_tag || 'Everyone'}</td>
                  <td><span className={`pill ${r.status === 'sent' ? 'won' : ''}`}>{CAMPAIGN_STATUS[r.status] || r.status}</span></td>
                  <td className="num">{r.status === 'draft' ? '—' : `${count(r.sent)} / ${count(r.recipients)}`}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {open && (
        <CampaignDrawer key={open === 'new' ? 'new' : open.id} campaign={open === 'new' ? null : open} o={o}
          onClose={() => setOpen(null)} onSaved={(row) => { setTick((t) => t + 1); setOpen(row); }}
          onDeleted={() => { setTick((t) => t + 1); setOpen(null); }} />
      )}
    </>
  );
}

function CampaignDrawer({ campaign, o, onClose, onSaved, onDeleted }) {
  const [form, setForm] = React.useState(() => campaign || { name: '', subject: '', preheader: '', body: '', audience_tag: '' });
  const [error, setError] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const [reach, setReach] = React.useState(null);
  const editable = !campaign || campaign.status === 'draft';
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.value }));
  React.useEffect(() => {
    if (editable) data('campaign_audience', { audience_tag: form.audience_tag || null }).then((r) => setReach(r.recipients)).catch(() => {});
  }, [form.audience_tag, editable]);

  async function run(fn) {
    setBusy(true); setError(''); setMsg('');
    try { await fn(); } catch (err) { setError(err.message); }
    setBusy(false);
  }
  const save = (e) => { e.preventDefault(); run(async () => onSaved(await data('save_campaign', { values: form }))); };
  const test = () => run(async () => {
    const row = await data('save_campaign', { values: form });
    await data('test_email', { id: row.id });
    setForm(row);
    setMsg('Test sent to your email.');
  });
  const send = () => run(async () => {
    if (!window.confirm(`Send "${form.subject}" to ${reach} subscriber${reach === 1 ? '' : 's'}? This cannot be undone.`)) return;
    const row = await data('save_campaign', { values: form });
    onSaved(await data('send_campaign', { id: row.id }));
  });
  async function remove() {
    if (!window.confirm(`Delete "${campaign.name}"?`)) return;
    await data('delete_campaign', { id: campaign.id });
    onDeleted();
  }
  const room = o ? Math.max(0, o.daily_limit - o.sent_24h - o.queued) : null;

  return (
    <Drawer title={campaign ? campaign.name : 'New campaign'} kicker="Email campaign" onClose={onClose}>
      {campaign && !editable && (
        <p className="notice">
          {campaign.status === 'sent' ? 'Sent' : 'Sending'} to {count(campaign.recipients)}{campaign.sent_at ? ` · started ${stamp(campaign.sent_at)}` : ''}.
          {' '}{count(campaign.sent)} delivered to Resend{campaign.failed ? `, ${count(campaign.failed)} failed` : ''}{campaign.waiting ? `, ${count(campaign.waiting)} waiting for the daily limit` : ''}.
        </p>
      )}
      <form onSubmit={save}>
        <fieldset disabled={!editable} style={{ border: 0, padding: 0, margin: 0 }}>
          <label className="label" htmlFor="c-name">Internal name *</label>
          <input id="c-name" className="field" required value={form.name} onChange={set('name')} />
          <label className="label" htmlFor="c-aud">Send to</label>
          <TagSelect id="c-aud" o={o} value={form.audience_tag} onChange={(v) => setForm((p) => ({ ...p, audience_tag: v }))} all="Everyone subscribed" />
          <label className="label" htmlFor="c-subj">Subject *</label>
          <input id="c-subj" className="field" value={form.subject} onChange={set('subject')} />
          <label className="label" htmlFor="c-pre">Preview text</label>
          <input id="c-pre" className="field" placeholder="The grey line inboxes show after the subject" value={form.preheader || ''} onChange={set('preheader')} />
          <label className="label" htmlFor="c-body">Message *</label>
          <textarea id="c-body" className="field" rows={14} value={form.body} onChange={set('body')} />
          <p className="muted" style={{ fontSize: 13 }}>{FORMAT_HELP}. The unsubscribe link and your address are added automatically.</p>
        </fieldset>
        {editable && reach !== null && (
          <p className="muted" style={{ fontSize: 13 }}>
            Reaches {count(reach)} subscriber{reach === 1 ? '' : 's'}.
            {room !== null && reach > room && ` About ${count(room)} can go out today; the rest follow over the next days at ${count(o.daily_limit)} a day.`}
          </p>
        )}
        {error && <div className="error">{error}</div>}
        {msg && <p className="notice">{msg}</p>}
        <div className="actions">
          {editable && <button className="btn" disabled={busy}>Save draft</button>}
          {editable && <button type="button" className="btn" disabled={busy || !form.subject || !form.body} onClick={test}>Send me a test</button>}
          {editable && <button type="button" className="btn btn-primary" disabled={busy || !reach || !form.subject || !form.body} onClick={send}>Send campaign</button>}
          {campaign && campaign.status !== 'sending' && <button type="button" className="btn btn-danger" onClick={remove}>Delete</button>}
        </div>
      </form>
    </Drawer>
  );
}

// ── Automations ─────────────────────────────────────────────────────────────

export function Automations({ version }) {
  const [tick, setTick] = React.useState(0);
  const o = useOverview(tick + version);
  const [rows, setRows] = React.useState(null);
  const [open, setOpen] = React.useState(null);
  React.useEffect(() => { data('email_sequences').then(setRows).catch(() => setRows([])); }, [tick, version]);

  return (
    <>
      <div className="head">
        <h1>Email automations</h1>
        <button className="btn btn-primary" onClick={() => setOpen('new')}>New automation</button>
      </div>
      <p className="muted count">A series of emails that starts when someone joins the list, or gets a tag, and goes out on a schedule — a welcome series, a nurture drip, a follow-up after a download.</p>
      <SetupNotice o={o} />
      <div className="card" style={{ overflowX: 'auto' }}>
        {!rows ? <p className="muted" style={{ padding: 16 }}>Loading…</p> : rows.length === 0 ? <p className="muted" style={{ padding: 16 }}>No automations yet.</p> : (
          <table>
            <thead><tr><th>Automation</th><th className="hide-sm">Starts when</th><th>Status</th><th className="num">In progress</th><th className="num hide-sm">Emails sent</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} onClick={() => setOpen(r)}>
                  <td><strong>{r.name}</strong><div className="muted" style={{ fontSize: 13 }}>{r.steps.length} email{r.steps.length === 1 ? '' : 's'}</div></td>
                  <td className="hide-sm">{r.trigger_tag ? `Tagged “${r.trigger_tag}”` : 'Anyone subscribes'}</td>
                  <td><span className={`pill ${r.active ? 'won' : ''}`}>{r.active ? 'On' : 'Off'}</span></td>
                  <td className="num">{count(r.in_progress)}</td>
                  <td className="num hide-sm">{count(r.sent)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {open && (
        <SequenceDrawer key={open === 'new' ? 'new' : open.id} seq={open === 'new' ? null : open} o={o}
          onClose={() => setOpen(null)} onSaved={(row) => { setTick((t) => t + 1); setOpen(row); }}
          onDeleted={() => { setTick((t) => t + 1); setOpen(null); }} />
      )}
    </>
  );
}

const blankStep = (first) => ({ delay_days: first ? 0 : 3, subject: '', preheader: '', body: '' });

function SequenceDrawer({ seq, o, onClose, onSaved, onDeleted }) {
  const [form, setForm] = React.useState(() => (seq
    ? { ...seq, enroll_existing: false }
    : { name: '', trigger_tag: '', active: false, steps: [blankStep(true)], enroll_existing: false }));
  const [error, setError] = React.useState('');
  const [msg, setMsg] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const set = (k) => (e) => setForm((p) => ({ ...p, [k]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));
  const setStep = (i, k) => (e) => setForm((p) => ({ ...p, steps: p.steps.map((s, j) => (j === i ? { ...s, [k]: e.target.value } : s)) }));
  const move = (i, d) => setForm((p) => {
    const steps = [...p.steps];
    [steps[i], steps[i + d]] = [steps[i + d], steps[i]];
    return { ...p, steps };
  });

  async function save(e) {
    e.preventDefault();
    setBusy(true); setError(''); setMsg('');
    try {
      const values = { ...form, steps: form.steps.map((s) => ({ ...s, delay_days: Number(s.delay_days) })) };
      onSaved(await data('save_sequence', { values }));
    } catch (err) { setError(err.message); }
    setBusy(false);
  }
  async function test(i) {
    setError(''); setMsg('');
    try { await data('test_email', { id: seq.id, step: i }); setMsg(`Test of email ${i + 1} sent to your email.`); } catch (err) { setError(err.message); }
  }
  async function remove() {
    if (!window.confirm(`Delete "${seq.name}"? People in it stop getting its emails.`)) return;
    await data('delete_sequence', { id: seq.id });
    onDeleted();
  }
  let day = 0;

  return (
    <Drawer title={seq ? seq.name : 'New automation'} kicker="Email automation" onClose={onClose}>
      {seq && <p className="muted">{count(seq.in_progress)} in progress · {count(seq.finished)} finished · {count(seq.sent)} emails sent</p>}
      <form onSubmit={save}>
        <label className="label" htmlFor="q-name">Name *</label>
        <input id="q-name" className="field" required placeholder="Welcome series" value={form.name} onChange={set('name')} />
        <label className="label" htmlFor="q-tag">Starts when</label>
        <input id="q-tag" className="field" list="q-tags" placeholder="Leave empty: anyone who subscribes. Or a tag, e.g. guide-download" value={form.trigger_tag || ''} onChange={set('trigger_tag')} />
        <datalist id="q-tags">{(o?.tags || []).map((t) => <option key={t.tag} value={t.tag} />)}</datalist>

        <div className="section">Emails</div>
        {form.steps.map((s, i) => {
          day += Number(s.delay_days) || 0;
          return (
            <div key={i} className="card pad" style={{ marginBottom: 10 }}>
              <div className="list-row">
                <strong style={{ flex: 1 }}>Email {i + 1} · day {day}</strong>
                {i > 0 && <button type="button" className="link" onClick={() => move(i, -1)}>Up</button>}
                {i < form.steps.length - 1 && <button type="button" className="link" onClick={() => move(i, 1)}>Down</button>}
                {seq && <button type="button" className="link" onClick={() => test(i)}>Test</button>}
                <button type="button" className="link danger" onClick={() => setForm((p) => ({ ...p, steps: p.steps.filter((_, j) => j !== i) }))}>Remove</button>
              </div>
              <label className="label" htmlFor={`q-d${i}`}>{i === 0 ? 'Days after they start' : 'Days after the previous email'}</label>
              <input id={`q-d${i}`} type="number" min={0} max={365} className="field" style={{ maxWidth: 120 }} value={s.delay_days} onChange={setStep(i, 'delay_days')} />
              <label className="label" htmlFor={`q-s${i}`}>Subject</label>
              <input id={`q-s${i}`} className="field" value={s.subject} onChange={setStep(i, 'subject')} />
              <label className="label" htmlFor={`q-p${i}`}>Preview text</label>
              <input id={`q-p${i}`} className="field" value={s.preheader || ''} onChange={setStep(i, 'preheader')} />
              <label className="label" htmlFor={`q-b${i}`}>Message</label>
              <textarea id={`q-b${i}`} className="field" rows={7} value={s.body} onChange={setStep(i, 'body')} />
            </div>
          );
        })}
        <button type="button" className="btn btn-small" onClick={() => setForm((p) => ({ ...p, steps: [...p.steps, blankStep(!p.steps.length)] }))}>Add email</button>
        <p className="muted" style={{ fontSize: 13 }}>{FORMAT_HELP}.</p>

        <label className="check" style={{ marginTop: 14 }}><input type="checkbox" checked={!!form.active} onChange={set('active')} /> On — new matching subscribers start it</label>
        {form.active && (
          <label className="check" style={{ marginTop: 8 }}><input type="checkbox" checked={!!form.enroll_existing} onChange={set('enroll_existing')} /> Also start it for everyone already on the list who matches</label>
        )}
        {error && <div className="error">{error}</div>}
        {msg && <p className="notice">{msg}</p>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>{seq ? 'Save automation' : 'Create automation'}</button>
          {seq && <button type="button" className="btn btn-danger" onClick={remove}>Delete</button>}
        </div>
      </form>
    </Drawer>
  );
}
