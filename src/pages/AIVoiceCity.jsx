import React from 'react';
import { VOICE_BASE, VOICE_CITY_BY_SLUG, voiceCityPath } from '../lib/voiceCities';
import { Wrap, Eyebrow, H2, BookBtn, TopBanner, Faq } from './cfl/shared';

// What the agent does is the same in every city; the city-specific copy lives in
// lib/voiceCities.js. Kept short here so the local copy carries each page.
const CAPABILITIES = [
  ['Answers in under a second', 'Day, night, weekends, and holidays. No hold music, no voicemail.'],
  ['Books into your calendar', 'Callers pick a time during the call, and the booking lands in your CRM pipeline.'],
  ['Qualifies every caller', 'Location, timeline, and urgency, asked in the right order before your team gets involved.'],
  ['Hands off when it should', 'Anything outside its training goes to a person with the details already captured.'],
];

const STEPS = [
  ['Intake & scripting', 'We capture your best call flow, common questions, and service area.', '1–2 days'],
  ['Build & test calls', 'We build the agent and run test calls until it meets our standard.', '2–3 days'],
  ['Connect your line', 'Your existing number, calendar, and CRM — callers dial the same number.', '1 day'],
  ['Go live & tune', 'We review real calls for the first 30 days and adjust what we hear.', 'Ongoing'],
];

const voiceFaq = (c) => [
  [`Do you set up AI voice agents for businesses in ${c.name}?`, `Yes. ${c.name} is part of our ${c.county} service area. We build, train, and manage the agent for you, including the questions ${c.name} callers ask most and the neighborhoods you serve.`],
  ['Can the agent speak Spanish?', 'Yes. The agent can answer and book in English or Spanish. We test both languages with real call scenarios before it goes live.'],
  ['Will callers know they are talking to AI?', 'We recommend the agent identifies itself as a virtual assistant at the start of the call. It still sounds natural, and callers appreciate the honesty.'],
  ['Do I keep my phone number?', 'Yes. Calls route through your existing number, so your signage, ads, and Google Business Profile do not change.'],
  ['What happens with emergencies or complex calls?', 'The agent is trained to recognize urgent situations and hand them to your team right away, with the caller\'s details captured.'],
];

function TranscriptCard({ c }) {
  return (
    <div className="cfl-glass" lang={c.sampleLang || undefined}
      style={{ padding: 20, borderRadius: 18, maxWidth: 420, width: '100%', justifySelf: 'end',
        background: 'rgba(245,242,235,0.06)', border: '1px solid rgba(245,242,235,0.14)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontFamily: 'var(--font-mono)',
        fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-300)' }}>
        <span className="ll-live-dot" aria-hidden="true" />
        Sample call · {c.name}{c.sampleLang === 'es' ? ' · Español' : ''}
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {c.sample.map(([role, text], i) => (
          <div key={i} style={{ justifySelf: role === 'agent' ? 'end' : 'start', maxWidth: '88%',
            padding: '10px 14px', borderRadius: 14, fontSize: 14, lineHeight: 1.5,
            background: role === 'agent' ? 'var(--paper-000)' : 'rgba(245,242,235,0.12)',
            color: role === 'agent' ? 'var(--ink-900)' : 'var(--paper-000)' }}>
            <span style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
              textTransform: 'uppercase', opacity: 0.6, marginBottom: 3 }}>
              {role === 'agent' ? 'AI agent' : 'Caller'}
            </span>
            {text}
          </div>
        ))}
      </div>
    </div>
  );
}

function AIVoiceCity({ slug }) {
  const c = VOICE_CITY_BY_SLUG.get(slug);
  if (!c) return null;
  const nearby = c.nearby.map((s) => VOICE_CITY_BY_SLUG.get(s)).filter(Boolean);

  return (
    <main style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      <TopBanner />

      {/* ── HERO ── */}
      <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', color: 'var(--paper-000)',
        padding: 'clamp(32px,4vw,56px) 0', position: 'relative', overflow: 'hidden' }}>
        <Wrap>
          <nav aria-label="Breadcrumb" style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 16 }}>
            <a href={VOICE_BASE} style={{ color: 'var(--ink-300)', textDecoration: 'none' }}>AI Voice Agents</a>
            <span style={{ color: 'rgba(245,242,235,0.4)', margin: '0 8px' }}>/</span>
            <span style={{ color: 'rgba(245,242,235,0.75)' }}>{c.name}, FL</span>
          </nav>
          <div className="cfl-hero-grid">
            <div>
              <Eyebrow light>AI voice agent · {c.name}, FL</Eyebrow>
              <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(30px, 3.6vw, 46px)', lineHeight: 1.06, letterSpacing: '-0.035em' }}>
                {c.headline}
              </h1>
              <p style={{ maxWidth: '54ch', margin: '16px 0 0', fontSize: 16, lineHeight: 1.6, color: 'rgba(245,242,235,0.75)' }}>{c.intro}</p>
              <div style={{ marginTop: 24 }}><BookBtn label={`Hear a ${c.name} demo call`} /></div>
            </div>
            <TranscriptCard c={c} />
          </div>
        </Wrap>
      </section>

      {/* ── CITY CALL MOMENTS ── */}
      <section style={{ background: 'var(--paper-000)', padding: 'clamp(64px,8vw,104px) 0' }}>
        <Wrap>
          <Eyebrow>Calls {c.name} businesses miss</Eyebrow>
          <H2>Where {c.name} calls slip through today.</H2>
          <div className="ll-grid-3" style={{ gap: 16, marginTop: 44 }}>
            {c.moments.map(([t, d], i) => (
              <div key={t} style={{ padding: '28px 24px', borderRadius: 16, background: 'var(--paper-100)', border: '1px solid var(--border-hair)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-400)', marginBottom: 12 }}>0{i + 1}</div>
                <h3 style={{ margin: '0 0 10px', fontWeight: 700, fontSize: 18, letterSpacing: '-0.01em' }}>{t}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.7, color: 'var(--ink-500)' }}>{d}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── WHAT IT HANDLES ── */}
      <section style={{ background: 'var(--paper-200)', padding: 'clamp(64px,8vw,104px) 0' }}>
        <Wrap>
          <div className="ll-2col" style={{ gap: 48, alignItems: 'start' }}>
            <div>
              <Eyebrow>What the agent handles</Eyebrow>
              <H2>Every call answered, qualified, and booked.</H2>
              <div style={{ display: 'grid', gap: 18, marginTop: 28 }}>
                {CAPABILITIES.map(([t, d]) => (
                  <div key={t} style={{ display: 'flex', gap: 12 }}>
                    <span aria-hidden="true" style={{ color: 'var(--ink-400)', fontWeight: 700 }}>✓</span>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>{t}</div>
                      <div style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--ink-500)' }}>{d}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ background: 'var(--paper-000)', borderRadius: 16, border: '1px solid var(--border-hair)', padding: '24px 24px' }}>
                <div style={{ fontWeight: 700, marginBottom: 14 }}>Calls we train it for in {c.name}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {c.calls.map((it) => <span key={it} className="cfl-chip">{it}</span>)}
                </div>
              </div>
              <div style={{ background: 'var(--ink-900)', color: 'var(--paper-000)', borderRadius: 16, padding: '24px 24px' }}>
                <div style={{ fontWeight: 700, marginBottom: 14 }}>Areas it confirms coverage for</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 9 }}>
                  {c.areas.map((a) => (
                    <li key={a} style={{ display: 'flex', gap: 10, fontSize: 14, color: 'rgba(245,242,235,0.85)' }}>
                      <span aria-hidden="true" style={{ color: 'var(--ink-300)' }}>→</span>{a}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── PROCESS ── */}
      <section style={{ background: 'var(--paper-000)', padding: 'clamp(44px,5vw,64px) 0', borderTop: '1px solid var(--border-hair)' }}>
        <Wrap><div className="cfl-narrow">
          <Eyebrow>How it works</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(24px, 2.8vw, 34px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
            Live in about a week. Managed after that.
          </h2>
          <ol className="cfl-steps">
            {STEPS.map(([title, desc, when], i) => (
              <li key={title} className="cfl-step">
                <div className="cfl-step__mark">
                  <span className="cfl-step__dot">{i + 1}</span>
                  <span className="cfl-step__when">{when}</span>
                </div>
                <div className="cfl-step__title">{title}</div>
                <p className="cfl-step__desc">{desc}</p>
              </li>
            ))}
          </ol>
          <div className="cfl-nearby" style={{ marginTop: 40 }}>
            <span className="cfl-nearby__label">AI voice agents near {c.name}</span>
            {nearby.map((n) => (
              <a key={n.slug} href={voiceCityPath(n.slug)} className="cfl-nearby__link">{n.name} <span aria-hidden="true">→</span></a>
            ))}
          </div>
        </div></Wrap>
      </section>

      <Faq items={voiceFaq(c)} />

      {/* ── FINAL CTA ── */}
      <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', color: 'var(--paper-000)', padding: 'clamp(80px,10vw,128px) 0', textAlign: 'center' }}>
        <Wrap>
          <Eyebrow light>Free · 30 minutes · No obligation</Eyebrow>
          <h2 style={{ margin: '0 auto', fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 800, letterSpacing: '-0.035em', lineHeight: 1.06, maxWidth: '20ch' }}>
            Stop sending {c.name} callers to voicemail.
          </h2>
          <p style={{ margin: '24px auto 0', maxWidth: '54ch', fontSize: 17, lineHeight: 1.7, color: 'rgba(245,242,235,0.72)' }}>
            On the call we review how your phone is answered today, play a sample call built for a {c.name} business like yours, and map out exactly what we would set up.
          </p>
          <div style={{ marginTop: 40 }}><BookBtn size="lg" label="Book my free strategy call" /></div>
        </Wrap>
      </section>
    </main>
  );
}

export default AIVoiceCity;
