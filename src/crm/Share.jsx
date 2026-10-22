import React from 'react';
import { call } from './api';
import { APPROVAL_STATUS, Comments, Media, PerformanceReport, StatusPill, canSeek, clock, day, parseClock, range, stamp } from './report';

// What a client sees from a share link — no sign-in, under the Loogo Labs
// logo. /portal/<token> is their dashboard + approvals + recaps;
// /recap/<token> is a single campaign one-pager they can forward.

const share = (action, payload) => call('crm-share', action, payload);
const base = () => (window.location.pathname.startsWith('/crm') ? '/crm' : '');

// { kind: 'portal' | 'recap', token } when the URL is a share link.
export function shareRoute() {
  const m = window.location.pathname.slice(base().length).match(/^\/(portal|recap)\/([A-Za-z0-9_-]+)\/?$/);
  return m ? { kind: m[1], token: m[2] } : null;
}

function useTitle(title) {
  React.useEffect(() => { if (title) document.title = title; }, [title]);
}

function BrandHeader({ brand, sub }) {
  return (
    <header className="share-top">
      <img src="/email-logo.png" alt="Loogo Labs — AI, Marketing & Automation" />
      <div className="share-for">
        <div className="share-name">{brand.name}</div>
        {sub && <div className="muted" style={{ fontSize: 13 }}>{sub}</div>}
      </div>
    </header>
  );
}

const Footer = () => <p className="muted share-foot">Loogo Labs · AI, Marketing &amp; Automation</p>;

function Problem({ message }) {
  return <div className="auth"><div className="card" style={{ textAlign: 'center' }}><h1 style={{ fontSize: 22 }}>Link unavailable</h1><p className="muted">{message}</p></div></div>;
}

export default function Share({ route }) {
  return route.kind === 'recap' ? <RecapPage token={route.token} /> : <Portal token={route.token} />;
}

// ── Portal ──────────────────────────────────────────────────────────────────

function Portal({ token }) {
  const [state, setState] = React.useState(null);
  const [error, setError] = React.useState('');
  const initialItem = new URLSearchParams(window.location.search).get('item');
  const [tab, setTab] = React.useState(initialItem ? 'approvals' : 'performance');
  const [itemId, setItemId] = React.useState(initialItem);

  const load = React.useCallback(() => share('portal', { token }).then(setState).catch((e) => setError(e.message)), [token]);
  React.useEffect(() => { load(); }, [load]);
  useTitle(state && `${state.brand.name} · Client portal`);

  if (error) return <Problem message={error} />;
  if (!state) return <p className="muted" style={{ padding: 32 }}>Loading…</p>;
  const pending = state.approvals.filter((a) => a.status === 'pending').length;
  const tabs = [
    { id: 'performance', label: 'Performance' },
    { id: 'approvals', label: `Approvals${pending ? ` (${pending})` : ''}` },
    ...(state.recaps.length ? [{ id: 'recaps', label: 'Campaign recaps' }] : []),
  ];

  return (
    <div className="share" style={{ '--brand': state.brand.brand_color }}>
      <BrandHeader brand={state.brand} sub="Client portal" />
      <main className="page">
        {state.brand.welcome && <p className="welcome">{state.brand.welcome}</p>}
        <nav className="seg share-tabs" aria-label="Sections">
          {tabs.map((t) => <button key={t.id} className={tab === t.id ? 'on' : ''} onClick={() => { setTab(t.id); setItemId(null); }}>{t.label}</button>)}
        </nav>
        {tab === 'performance' && <PerformanceReport metrics={state.metrics} color={state.brand.brand_color} />}
        {tab === 'approvals' && (itemId
          ? <ApprovalView token={token} id={itemId} onBack={() => { setItemId(null); load(); }} />
          : <ApprovalList items={state.approvals} onOpen={setItemId} />)}
        {tab === 'recaps' && (
          <div className="card">
            {state.recaps.map((r) => (
              <a key={r.share_token} className="related pad-x" href={`${base()}/recap/${r.share_token}`}>
                <strong>{r.title}</strong><span className="muted">{range(r.start_date, r.end_date)}</span>
              </a>
            ))}
          </div>
        )}
        <Footer />
      </main>
    </div>
  );
}

function ApprovalList({ items, onOpen }) {
  if (!items.length) return <p className="muted">Nothing to review right now.</p>;
  return (
    <div className="card">
      {items.map((a) => (
        <button key={a.id} className="related pad-x" onClick={() => onOpen(a.id)}>
          <span className="note-head"><strong>{a.title}</strong><StatusPill status={a.status} /></span>
          <span className="muted">Version {a.version}{a.due_date ? ` · please review by ${day(a.due_date)}` : ''}</span>
        </button>
      ))}
    </div>
  );
}

const NAME_KEY = 'll_portal_name';
const savedName = () => { try { return localStorage.getItem(NAME_KEY) || ''; } catch { return ''; } };

function ApprovalView({ token, id, onBack }) {
  const [item, setItem] = React.useState(null);
  const [error, setError] = React.useState('');
  const [name, setName] = React.useState(savedName);
  const [body, setBody] = React.useState('');
  const [at, setAt] = React.useState('');
  const [deciding, setDeciding] = React.useState(null); // 'approved' | 'changes_requested'
  const [note, setNote] = React.useState('');
  const [busy, setBusy] = React.useState(false);
  const video = React.useRef(null);

  React.useEffect(() => { share('approval', { token, id }).then(setItem).catch((e) => setError(e.message)); }, [token, id]);
  const remember = () => { try { localStorage.setItem(NAME_KEY, name); } catch { /* private mode */ } };

  if (error && !item) return <p className="error">{error}</p>;
  if (!item) return <p className="muted">Loading…</p>;
  const seekable = canSeek(item.media_url);
  const seek = (s) => { if (video.current) { video.current.currentTime = s; video.current.play?.(); } };

  async function comment(e) {
    e.preventDefault();
    setError('');
    const ts = parseClock(at);
    if (Number.isNaN(ts)) { setError('Time must look like 1:23'); return; }
    setBusy(true);
    try {
      const c = await share('comment', { token, id, values: { author: name, body, timestamp_sec: ts } });
      remember();
      setItem((p) => ({ ...p, comments: [...p.comments, c] }));
      setBody(''); setAt('');
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  async function decide(e) {
    e.preventDefault();
    setError(''); setBusy(true);
    try {
      const row = await share('decide', { token, id, values: { author: name, decision: deciding, note } });
      remember();
      const fresh = await share('approval', { token, id });
      setItem({ ...fresh, ...row });
      setDeciding(null); setNote('');
    } catch (err) { setError(err.message); }
    setBusy(false);
  }

  return (
    <>
      <button className="btn btn-small" onClick={onBack}>← All items</button>
      <div className="head" style={{ marginTop: 16 }}>
        <h1>{item.title}</h1>
        <StatusPill status={item.status} />
      </div>
      <p className="muted count">
        Version {item.version}{item.due_date ? ` · please review by ${day(item.due_date)}` : ''}
        {item.decided_by && ` · ${(APPROVAL_STATUS[item.status] || item.status).toLowerCase()} by ${item.decided_by} on ${stamp(item.decided_at)}`}
      </p>

      <Media ref={video} url={item.media_url} />
      {item.body && <div className="card pad pre draft">{item.body}</div>}

      {item.status !== 'approved' && item.status !== 'rejected' && (
        <div className="card pad decide">
          {deciding ? (
            <form onSubmit={decide}>
              <strong>{deciding === 'approved' ? 'Approve this version' : 'Request changes'}</strong>
              <label className="label" htmlFor="d-name">Your name *</label>
              <input id="d-name" className="field" required value={name} onChange={(e) => setName(e.target.value)} />
              <label className="label" htmlFor="d-note">{deciding === 'approved' ? 'Anything to add? (optional)' : 'What should change? *'}</label>
              <textarea id="d-note" className="field" rows={3} required={deciding !== 'approved'} value={note} onChange={(e) => setNote(e.target.value)} />
              <div className="actions">
                <button className="btn btn-primary brand-btn" disabled={busy}>{deciding === 'approved' ? 'Approve' : 'Send change request'}</button>
                <button type="button" className="btn" onClick={() => setDeciding(null)}>Cancel</button>
              </div>
            </form>
          ) : (
            <div className="actions" style={{ marginTop: 0, alignItems: 'center' }}>
              <span style={{ flex: 1 }}>Ready to sign off?</span>
              <button className="btn" onClick={() => setDeciding('changes_requested')}>Request changes</button>
              <button className="btn btn-primary brand-btn" onClick={() => setDeciding('approved')}>Approve</button>
            </div>
          )}
        </div>
      )}

      <div className="section">Comments</div>
      <Comments comments={item.comments} version={item.version} onSeek={seekable ? seek : undefined} />
      <form onSubmit={comment} className="composer card pad" style={{ marginTop: 12 }}>
        <input className="field" placeholder="Your name" aria-label="Your name" required value={name} onChange={(e) => setName(e.target.value)} />
        <textarea className="field" rows={3} placeholder={seekable ? 'Pause the video where you want a change, then comment…' : 'Leave a comment…'} aria-label="Comment" required value={body}
          onFocus={() => { if (seekable && !at && video.current?.currentTime) setAt(clock(video.current.currentTime)); }}
          onChange={(e) => setBody(e.target.value)} />
        <div className="actions" style={{ marginTop: 8, alignItems: 'center' }}>
          {(seekable || item.kind === 'video') && (
            <>
              <input className="field" style={{ width: 90 }} placeholder="0:00" aria-label="Timestamp" value={at} onChange={(e) => setAt(e.target.value)} />
              {seekable && <button type="button" className="btn btn-small" onClick={() => setAt(clock(video.current?.currentTime || 0))}>Use current time</button>}
            </>
          )}
          <button className="btn btn-primary brand-btn" disabled={busy}>Comment</button>
        </div>
        {error && <div className="error">{error}</div>}
      </form>
    </>
  );
}

// ── Recap one-pager ─────────────────────────────────────────────────────────

function RecapPage({ token }) {
  const [r, setR] = React.useState(null);
  const [error, setError] = React.useState('');
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => { share('recap', { token }).then(setR).catch((e) => setError(e.message)); }, [token]);
  useTitle(r && `${r.title} · ${r.brand.name}`);

  if (error) return <Problem message={error} />;
  if (!r) return <p className="muted" style={{ padding: 32 }}>Loading…</p>;

  function copy() {
    navigator.clipboard?.writeText(window.location.href).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); });
  }

  return (
    <div className="share recap" style={{ '--brand': r.brand.brand_color }}>
      <BrandHeader brand={r.brand} sub="Campaign recap" />
      <main className="page">
        <div className="actions no-print" style={{ justifyContent: 'flex-end', marginTop: 0 }}>
          <button className="btn btn-small" onClick={copy}>{copied ? 'Link copied' : 'Copy link to forward'}</button>
          <button className="btn btn-small" onClick={() => window.print()}>Print / save PDF</button>
        </div>
        <div className="kicker">{range(r.start_date, r.end_date)}</div>
        <h1 className="recap-title">{r.title}</h1>
        {r.summary && <p className="recap-summary pre">{r.summary}</p>}

        {r.metrics.length > 0 && (
          <div className="stats recap-stats">
            {r.metrics.map((m, i) => (
              <div key={i} className="card stat"><div className="k">{m.label}</div><div className="n">{m.value}</div>{m.note && <div className="v">{m.note}</div>}</div>
            ))}
          </div>
        )}

        {r.highlights.length > 0 && (
          <>
            <div className="section">Highlights</div>
            <div className="highlights">
              {r.highlights.map((h, i) => (
                <div key={i} className="card pad">
                  {h.image_url && <img src={h.image_url} alt="" />}
                  {h.title && <strong>{h.title}</strong>}
                  {h.body && <p className="pre">{h.body}</p>}
                </div>
              ))}
            </div>
          </>
        )}

        {r.next_steps && (
          <>
            <div className="section">What's next</div>
            <p className="pre">{r.next_steps}</p>
          </>
        )}
        <Footer />
      </main>
    </div>
  );
}
