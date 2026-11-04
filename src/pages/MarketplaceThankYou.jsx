import React from 'react';
import { CheckCircle, DownloadSimple, WarningCircle, ArrowRight } from '@phosphor-icons/react';
import { pathForPage } from '../lib/seo';

// Post-purchase page. Stripe redirects here with ?session_id=cs_...; the
// skill-order function verifies the payment with Stripe and serves the file.
const API = '/.netlify/functions/skill-order';
const SUPPORT = 'david@loogolabs.com';

function MarketplaceThankYou() {
  const [state, setState] = React.useState({ status: 'loading' });
  const [sessionId, setSessionId] = React.useState('');

  React.useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('session_id') || '';
    setSessionId(id);
    if (!id) { setState({ status: 'invalid', message: 'This page needs the link from your checkout.' }); return undefined; }
    let alive = true;
    let tries = 0;
    const load = async () => {
      try {
        const res = await fetch(`${API}?session_id=${encodeURIComponent(id)}`);
        const data = await res.json();
        // Payments can take a moment to settle; retry a few times before giving up.
        if (data.status === 'unpaid' && tries < 5) { tries += 1; setTimeout(load, 3000); return; }
        if (alive) setState(data);
      } catch {
        if (alive) setState({ status: 'error', message: `We couldn't reach the download server. Refresh the page, or email ${SUPPORT}.` });
      }
    };
    load();
    return () => { alive = false; };
  }, []);

  const download = `${API}?session_id=${encodeURIComponent(sessionId)}&download=1`;

  return (
    <main className="mk mk-ty">
      <section className="mk-wrap mk-ty__wrap">
        {state.status === 'loading' ? (
          <div className="mk-ty__card" aria-live="polite">
            <span className="mk-ty__spinner" aria-hidden="true" />
            <h1 className="mk-ty__title">Confirming your order…</h1>
            <p className="mk-ty__lede">This only takes a moment.</p>
          </div>
        ) : state.status === 'paid' ? (
          <div className="mk-ty__card">
            <CheckCircle size={44} weight="light" className="mk-ty__ok" aria-hidden="true" />
            <h1 className="mk-ty__title">Thanks! Your {state.name} is ready.</h1>
            <p className="mk-ty__lede">
              {state.emailed
                ? <>We’ve emailed this download link{state.email ? ` to ${state.email}` : ''}, along with your receipt.</>
                : <>Your receipt is on its way{state.email ? ` to ${state.email}` : ''}.</>}{' '}
              This download link keeps working for {state.expiresInDays} more {state.expiresInDays === 1 ? 'day' : 'days'}.
              Trouble with the file? Email <a href="mailto:david@loogolabs.com">david@loogolabs.com</a> and we’ll send it to you.
            </p>
            <a className="ll-btn ll-btn--primary ll-btn--lg mk-ty__dl" href={download}>
              Download the skill (.zip)<span aria-hidden="true" className="ll-btn__arrow"><DownloadSimple size={16} weight="bold" /></span>
            </a>

            <ol className="mk-ty__steps">
              <li>
                <b>Install it.</b> In Claude (web or desktop): Settings → Capabilities → turn on code execution and file
                creation → Skills → <i>Upload skill</i> → choose the .zip. In Claude Code: unzip it into <code>~/.claude/skills/</code>.
              </li>
              <li>
                <b>Fill your company profile.</b> Open <code>templates/company-profile.md</code> inside the zip, fill in what you
                know, and keep it handy (a Claude project file is ideal).
              </li>
              <li>
                <b>Start.</b> In a new chat, say: <i>"Use the SaaS Launch Playbook. Here's my company profile."</i> and attach it.
              </li>
            </ol>
            <p className="mk-ty__help">Questions or trouble installing? Email <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a>.</p>
          </div>
        ) : (
          <div className="mk-ty__card">
            <WarningCircle size={44} weight="light" className="mk-ty__warn" aria-hidden="true" />
            <h1 className="mk-ty__title">We couldn't open your download</h1>
            <p className="mk-ty__lede">{state.message || `Something went wrong. Email ${SUPPORT} and we'll sort it out.`}</p>
            <p className="mk-ty__help">
              Already paid? Email <a href={`mailto:${SUPPORT}`}>{SUPPORT}</a> with your receipt and we'll send your file.
            </p>
            <a className="ll-btn ll-btn--secondary ll-btn--md" href={pathForPage('Marketplace')}>
              Back to the marketplace<span aria-hidden="true" className="ll-btn__arrow"><ArrowRight size={14} weight="bold" /></span>
            </a>
          </div>
        )}
      </section>
    </main>
  );
}

export default MarketplaceThankYou;
