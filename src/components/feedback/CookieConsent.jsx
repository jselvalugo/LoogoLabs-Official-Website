import React from 'react';
import Switch from '../forms/Switch';
import { getConsent, setConsent } from '../../lib/cookieConsent';

const CATEGORIES = [
  {
    key: 'necessary',
    title: 'Necessary',
    locked: true,
    desc: 'Required for the site to run — page routing, security, and remembering this choice. Always on.',
  },
  {
    key: 'analytics',
    title: 'Analytics',
    desc: 'Aggregate, city-level traffic data — which pages get read and how long visits last. No personal profile is built from it.',
  },
  {
    key: 'marketing',
    title: 'Marketing',
    desc: 'Lets us measure ad performance and show relevant Loogo Labs content on other sites via the Meta Pixel.',
  },
];

const darkBtnBase = {
  padding: '11px 20px', borderRadius: 'var(--radius-2)', fontWeight: 700, fontSize: 12.5,
  fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase',
  cursor: 'pointer', whiteSpace: 'nowrap', border: 'none',
};
const darkPrimaryBtn = { ...darkBtnBase, background: 'var(--cyan-500)', color: 'var(--ink-900)', border: '2px solid var(--ink-900)', boxShadow: '3px 3px 0 var(--ink-700)' };
const darkGhostBtn = { ...darkBtnBase, background: 'transparent', color: 'var(--paper-100)', border: '1px solid var(--border-hair-inverse)', fontWeight: 600 };

const lightBtnBase = {
  padding: '12px 18px', borderRadius: 'var(--radius-2)', fontWeight: 700, fontSize: 12.5,
  fontFamily: 'var(--font-mono)', letterSpacing: '0.05em', textTransform: 'uppercase',
  cursor: 'pointer', flex: '1 1 auto', textAlign: 'center', border: 'none',
};
const lightPrimaryBtn = { ...lightBtnBase, background: 'var(--cyan-500)', color: 'var(--ink-900)', border: '2px solid var(--ink-900)', boxShadow: 'var(--shadow-hard-sm)' };
const lightGhostBtn = { ...lightBtnBase, background: 'var(--paper-000)', color: 'var(--ink-900)', border: '1px solid var(--border-hair)', fontWeight: 600 };

function loadMetaPixelIfGranted(consent) {
  if (consent.marketing && typeof window !== 'undefined' && typeof window.__loadMetaPixel === 'function') {
    window.__loadMetaPixel();
  }
}

function CookieConsent() {
  const [stage, setStage] = React.useState('hidden'); // hidden | banner | customize
  const [prefs, setPrefs] = React.useState({ analytics: false, marketing: false });

  React.useEffect(() => {
    const existing = getConsent();
    if (!existing) {
      setStage('banner');
    } else {
      setPrefs({ analytics: !!existing.analytics, marketing: !!existing.marketing });
    }
    // The footer's "Cookie Preferences" link calls this to reopen the panel
    // without needing its own copy of this component's state.
    window.openCookiePreferences = () => {
      const current = getConsent();
      if (current) setPrefs({ analytics: !!current.analytics, marketing: !!current.marketing });
      setStage('customize');
    };
    return () => { delete window.openCookiePreferences; };
  }, []);

  function apply(next) {
    const consent = setConsent(next);
    loadMetaPixelIfGranted(consent);
    setPrefs({ analytics: consent.analytics, marketing: consent.marketing });
    setStage('hidden');
  }

  function closeCustomize() {
    // Only let a dismiss skip the choice if one was already made before —
    // a first-time visitor closing the panel lands back on the banner, not
    // silently in "no decision recorded" limbo.
    setStage(getConsent() ? 'hidden' : 'banner');
  }

  if (stage === 'hidden') return null;

  return (
    <>
      {stage === 'banner' && (
        <div role="region" aria-label="Cookie notice" style={{
          position: 'fixed', left: 0, right: 0, bottom: 0, zIndex: 90,
          background: 'var(--ink-900)', color: 'var(--paper-100)',
          borderTop: '2px solid var(--cyan-500)', boxShadow: '0 -10px 28px rgba(0,0,0,0.28)',
        }}>
          <div style={{
            maxWidth: 'var(--container-max)', margin: '0 auto', padding: '22px 24px',
            display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap',
          }}>
            <div style={{ flex: '1 1 320px', minWidth: 240 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 6 }}>We value your privacy</div>
              <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.6, color: 'var(--ink-300)', maxWidth: '68ch' }}>
                We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze
                our traffic. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', flexShrink: 0 }}>
              <button style={darkGhostBtn} onClick={() => setStage('customize')}>Customize</button>
              <button style={darkGhostBtn} onClick={() => apply({ analytics: false, marketing: false })}>Decline</button>
              <button style={darkPrimaryBtn} onClick={() => apply({ analytics: true, marketing: true })}>Accept All</button>
            </div>
          </div>
        </div>
      )}

      {stage === 'customize' && (
        <>
          <div onClick={closeCustomize} style={{ position: 'fixed', inset: 0, zIndex: 95, background: 'rgba(10,14,9,0.55)' }} />
          <div role="dialog" aria-modal="true" aria-label="Cookie preferences" style={{
            position: 'fixed', zIndex: 96, left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
            width: 'min(520px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 48px)', overflowY: 'auto',
            background: 'var(--paper-000)', color: 'var(--ink-900)', border: '2px solid var(--ink-900)',
            borderRadius: 'var(--radius-3)', boxShadow: 'var(--shadow-hard)', padding: '28px 26px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
              <div>
                <span className="ll-eyebrow" style={{ color: 'var(--ink-500)' }}>Cookie Preferences</span>
                <h3 style={{ margin: '8px 0 0', fontSize: 20, fontWeight: 700, letterSpacing: '-0.01em' }}>Choose what we can use.</h3>
              </div>
              <button aria-label="Close" onClick={closeCustomize}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 22, lineHeight: 1, color: 'var(--ink-400)', padding: 4 }}>
                ×
              </button>
            </div>
            <p style={{ margin: '14px 0 0', fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink-500)' }}>
              Necessary cookies are always on because the site can&rsquo;t function without them. Everything else is your call.
            </p>
            <div style={{ display: 'grid', gap: 12, marginTop: 22 }}>
              {CATEGORIES.map(cat => (
                <div key={cat.key} style={{ border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', padding: '14px 16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontWeight: 700, fontSize: 14 }}>{cat.title}</span>
                    {cat.locked
                      ? <span className="ll-eyebrow" style={{ color: 'var(--ink-400)' }}>Always on</span>
                      : <Switch checked={prefs[cat.key]} onChange={(v) => setPrefs(p => ({ ...p, [cat.key]: v }))} />}
                  </div>
                  <p style={{ margin: '8px 0 0', fontSize: 12.5, lineHeight: 1.6, color: 'var(--ink-500)' }}>{cat.desc}</p>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
              <button style={lightGhostBtn} onClick={() => apply({ analytics: false, marketing: false })}>Decline All</button>
              <button style={lightGhostBtn} onClick={() => apply(prefs)}>Save Preferences</button>
              <button style={lightPrimaryBtn} onClick={() => apply({ analytics: true, marketing: true })}>Accept All</button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CookieConsent;
