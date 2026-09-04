import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { BOOKING_URL, openBooking } from '../lib/booking';

const trackBook = () => { if (window.fbq) window.fbq('track', 'Schedule'); openBooking(); };

/* ─────────────────────── primitives ─────────────────────── */
const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const Eyebrow = ({ children, light }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: light ? 'var(--cyan-500)' : 'var(--ink-400)', marginBottom: 14 }}>
    {children}
  </div>
);

/* ─────────────────────── waveform bars ─────────────────────── */
const WAVE_BARS = [0.3, 0.7, 0.5, 1, 0.6, 0.85, 0.4, 0.9, 0.55, 0.75, 0.35, 0.95, 0.5, 0.8, 0.45, 1, 0.6, 0.7, 0.4, 0.9, 0.55, 0.65, 0.35, 0.85, 0.5, 0.75, 0.3, 0.95, 0.6, 0.8, 0.4, 0.7];

const Waveform = ({ color = 'var(--cyan-500)', height = 56, animate = true }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 3, height }}>
    {WAVE_BARS.map((h, i) => (
      <div key={i} style={{
        width: 3, height: `${h * 100}%`, background: color, borderRadius: 2, opacity: 0.85,
        animation: animate ? `waveBar 1.2s ease-in-out ${(i * 0.04).toFixed(2)}s infinite alternate` : 'none',
      }} />
    ))}
  </div>
);

/* ─────────────────────── call transcript ─────────────────────── */
const transcript = [
  { role: 'caller', text: 'Hi, I need someone to look at my AC — it stopped working last night.' },
  { role: 'agent', text: "I'm so sorry to hear that, especially in this heat. We can absolutely help. Are you in the Orlando area?" },
  { role: 'caller', text: 'Yes, Winter Park.' },
  { role: 'agent', text: "Perfect, we service Winter Park. Are you available tomorrow between 8 and 11 A.M., or does the afternoon work better?" },
  { role: 'caller', text: 'Morning works.' },
  { role: 'agent', text: "Great — I've got you down for tomorrow, 8 to 11 A.M. You'll get a confirmation text shortly. Is there anything else I can help with?" },
];

/* ─────────────────────── data ─────────────────────── */
const problems = [
  ['62% of calls go unanswered', 'More than half the calls your business receives happen outside business hours. Every unanswered ring is a lead that just called your competitor.'],
  ['Voicemail gets deleted, not played', "The average person waits less than eight seconds before hanging up. They're not leaving a voicemail. They're googling someone else."],
  ['Speed to lead is everything', "Research shows the odds of contacting a lead drop by 80% after five minutes. If you're answering tomorrow, someone else answered today."],
];

const capabilities = [
  ['24/7 Live Call Answering', 'Never miss another call. Your AI agent picks up in under a second, day or night, weekends and holidays included.'],
  ['Natural Lead Qualification', 'Asks the right questions in the right order — location, timeline, budget, urgency — and scores the lead before your team ever gets involved.'],
  ['Appointment Booking', 'Syncs directly with your calendar and CRM pipeline. Prospects book a time slot during the call, and every lead is tagged automatically — no manual entry.'],
  ['Objection Handling', 'Trained on your most common objections. Price shopping? Competition? Not ready? The agent has a scripted, on-brand response for each.'],
];

const steps = [
  ['01', 'Intake & scripting', 'We interview you (or your top salesperson) to capture your best call flow, objections, and closing language.', '1–2 days'],
  ['02', 'Build & training', 'We build the voice agent, train it on your business, and run test calls until it meets our standard.', '2–3 days'],
  ['03', 'Integration', 'We connect your phone system, CRM pipeline, and calendar. Zero downtime — runs alongside your existing setup.', '1 day'],
  ['04', 'Go live & tune', 'The agent goes live. We monitor real calls for the first 30 days and tune based on what we hear.', 'Ongoing'],
];

const industries = [
  'HVAC & Mechanical', 'Roofing & Exteriors', 'Dental & Med Spa', 'Real Estate & Mortgage',
  'Pest Control', 'Plumbing & Electric', 'Personal Injury Law', 'Auto Services',
];

const faqs = [
  ['Does it sound like a robot?', 'No. Modern voice AI is indistinguishable from human agents in most calls. We train it on your specific vocabulary, cadence, and tone so it sounds like someone who works for you — not a generic IVR system.'],
  ['What happens when a call gets too complex?', 'The agent knows its limits. If a caller asks something outside its training, it warmly offers to have a team member call them back, captures their info, and logs the ticket in your CRM.'],
  ['Will it work with our existing phone number?', 'Yes. We route calls through your existing number. No need to change your marketing, your signage, or your contacts. Callers dial the same number they always have.'],
  ['How long does setup take?', "Most clients go live within a week of our first call. We handle the entire build — you show up for a 90-minute intake session and an approval call before launch."],
];

/* ─────────────────────── main component ─────────────────────── */
export default function AIVoice() {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <main style={{ fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>

      {/* keyframes injected once */}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.35); opacity: 0.5; }
          to   { transform: scaleY(1);    opacity: 1;   }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.55; }
          100% { transform: scale(1.9); opacity: 0;    }
        }
      `}</style>

      {/* ── BOOKING BANNER ── */}
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={() => { if (window.fbq) window.fbq('track', 'Schedule'); }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          height: 36, background: 'var(--ink-900)', borderBottom: '1px solid var(--border-hair-inverse)',
          textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-300)',
          transition: 'background 160ms ease', position: 'sticky', top: 0, zIndex: 30,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--ink-800)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink-900)'; }}>
        <span className="ll-live-dot" aria-hidden="true" />
        Live in about a week — book a free AI voice agent demo
        <span style={{ color: 'var(--cyan-500)', fontSize: 11 }}>→</span>
      </a>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', background: 'var(--ink-900)', padding: 'clamp(72px,10vw,120px) 0 clamp(56px,7vw,88px)', overflow: 'hidden' }}>
        <div className="ll-hero-grid-bg" aria-hidden="true" />
        <Wrap style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span className="ll-live-dot" aria-hidden="true" />
            <Badge tone="inverse">Loogo Labs · AI Voice Agents</Badge>
          </div>

          <h1 style={{
            margin: '20px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-1)', lineHeight: 'var(--lh-display-1)',
            letterSpacing: 'var(--ls-display-1)', color: 'var(--paper-100)', maxWidth: '17ch',
          }}>
            Your Business Answers Every Call. <span style={{ color: 'var(--cyan-500)' }}>Even the 2 A.M. Ones.</span>
          </h1>

          <p style={{ margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)',
            color: 'var(--ink-300)', maxWidth: '54ch' }}>
            A custom AI voice agent that qualifies leads, books appointments, and handles objections
            — in your brand's voice, around the clock, without a single missed call.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginTop: 32 }}>
            <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={trackBook}>Book a free demo call</Button>
            <Button variant="secondary" size="lg" onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
              See how it works ↓
            </Button>
          </div>

          {/* waveform display */}
          <div style={{ marginTop: 48, padding: '22px 26px',
            background: 'var(--ink-800)', border: '1px solid var(--border-hair-inverse)',
            borderRadius: 'var(--radius-3)', display: 'flex', alignItems: 'center', gap: 20, maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="ll-live-dot" aria-hidden="true" />
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--cyan-500)' }}>Live · Answering</span>
            </div>
            <div style={{ flex: 1 }}>
              <Waveform height={36} animate />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)',
              letterSpacing: '0.05em' }}>0:47</span>
          </div>

          {/* stats */}
          <div className="ll-hero-stats" style={{ display: 'flex', gap: 0, marginTop: 56,
            borderTop: '1px solid var(--border-hair-inverse)' }}>
            {[
              ['100%', 'Answer rate'],
              ['< 1 s', 'Time to pick up'],
              ['24 / 7', 'Always on'],
              ['~1 week', 'To launch'],
            ].map(([val, label], i) => (
              <div key={label} style={{ flex: 1, padding: '20px 0 0', paddingLeft: i ? 24 : 0,
                borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px,3vw,34px)', fontWeight: 700,
                  letterSpacing: '-0.03em', color: 'var(--cyan-500)', lineHeight: 1 }}>{val}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── SOCIAL PROOF STRIP ── */}
      <div style={{ background: 'var(--paper-200)', borderTop: '1px solid var(--border-hair)', borderBottom: '1px solid var(--border-hair)', padding: '16px 0' }}>
        <Wrap>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px 32px', justifyContent: 'center' }}>
            {[
              'Picks up in under 1 second',
              'Never calls in sick',
              'Zero hold time',
              'Books directly into your calendar',
              'Works in English and Spanish',
              'Native CRM integration',
            ].map((txt) => (
              <span key={txt} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--ink-600)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--ink-400)', fontSize: 7 }}>●</span> {txt}
              </span>
            ))}
          </div>
        </Wrap>
      </div>

      {/* ── PROBLEM ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <Eyebrow>The problem</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(28px,4vw,48px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink-900)', maxWidth: '22ch' }}>
            Every unanswered call is a competitor's <span style={{ borderBottom: '3px solid var(--cyan-500)' }}>new customer.</span>
          </h2>
          <p style={{ margin: '20px 0 0', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-500)', maxWidth: '56ch' }}>
            The average small business misses over 60% of inbound calls. Most of those callers never try again.
            They find someone who answers — and they book with them instead.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1,
            marginTop: 48, background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
            {problems.map(([title, desc]) => (
              <div key={title} style={{ background: 'var(--paper-100)', padding: '32px 28px', display: 'grid', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,74,61,0.1)',
                  border: '1px solid rgba(255,74,61,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontWeight: 700, fontSize: 14, color: 'var(--status-danger)' }}>✕</div>
                <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-500)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── LIVE DEMO ── */}
      <section style={{ background: 'var(--ink-900)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 64, alignItems: 'center' }}>

            {/* left: copy */}
            <div>
              <Eyebrow light>Live call simulation</Eyebrow>
              <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700,
                letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--paper-100)', maxWidth: '20ch' }}>
                It sounds like your best employee — on their best day.
              </h2>
              <p style={{ margin: '0 0 32px', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-300)' }}>
                The AI doesn't read from a script. It holds a real conversation, adapts to what the caller says,
                and guides them toward the outcome your business needs — a booked appointment.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
                {['Speaks naturally — no robotic pauses or clipped sentences',
                  'Handles interruptions and tangents gracefully',
                  'Stays on-brand for every single call',
                  'Confirms booking details before ending the call',
                ].map((pt) => (
                  <div key={pt} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--cyan-500)', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-200)', lineHeight: 1.6 }}>{pt}</span>
                  </div>
                ))}
              </div>
              <Button variant="inverse" onClick={trackBook}>Hear it on a live call</Button>
            </div>

            {/* right: phone transcript mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 360,
                background: 'var(--ink-800)', borderRadius: 20,
                border: '1px solid var(--border-hair-inverse)',
                boxShadow: 'var(--shadow-soft-2)',
                overflow: 'hidden',
              }}>
                {/* phone top bar */}
                <div style={{ background: 'var(--ink-700)', padding: '14px 20px 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: '1px solid var(--border-hair-inverse)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'var(--ink-400)', marginBottom: 3 }}>Incoming call</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--paper-100)' }}>+1 (407) 555-0182</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span className="ll-live-dot" aria-hidden="true" />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--cyan-500)',
                      letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
                  </div>
                </div>

                {/* waveform in phone */}
                <div style={{ padding: '12px 20px', background: 'var(--ink-800)', display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: '1px solid var(--border-hair-inverse)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)',
                    letterSpacing: '0.08em', flexShrink: 0 }}>AI Agent</span>
                  <div style={{ flex: 1 }}>
                    <Waveform height={22} animate />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--ink-400)',
                    letterSpacing: '0.08em' }}>1:12</span>
                </div>

                {/* transcript */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12,
                  maxHeight: 320, overflowY: 'auto', background: 'var(--ink-900)' }}>
                  {transcript.map((line, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: line.role === 'agent' ? 'flex-start' : 'flex-end' }}>
                      <div style={{
                        maxWidth: '82%', padding: '9px 13px', borderRadius: line.role === 'agent'
                          ? '4px 14px 14px 4px' : '14px 4px 4px 14px',
                        background: line.role === 'agent' ? 'rgba(216,211,198,0.10)' : 'var(--ink-700)',
                        border: `1px solid ${line.role === 'agent' ? 'var(--border-hair-inverse)' : 'transparent'}`,
                      }}>
                        {line.role === 'agent' && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: 'var(--cyan-500)', marginBottom: 4 }}>AI Agent</div>
                        )}
                        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55, color: 'var(--paper-100)' }}>
                          {line.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* booked confirmation */}
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(216,211,198,0.12)', border: '1px solid var(--border-hair-inverse)',
                      borderRadius: 'var(--radius-pill)', padding: '5px 12px' }}>
                      <span style={{ color: 'var(--cyan-500)', fontSize: 11 }}>✓</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: 'var(--cyan-500)' }}>Appointment booked · Synced to your CRM</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </Wrap>
      </section>

      {/* ── CAPABILITIES ── */}
      <section style={{ background: 'var(--paper-200)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <Eyebrow>What it does</Eyebrow>
          <h2 style={{ margin: '0 0 56px', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)', maxWidth: '26ch' }}>
            Everything your front desk does — plus everything they can't.
          </h2>
          <div className="ll-grid-4" style={{ gap: 16 }}>
            {capabilities.map(([title, desc], i) => (
              <div key={title} style={{
                background: 'var(--paper-000)', border: '1px solid var(--border-hair)',
                borderRadius: 'var(--radius-2)', padding: '28px 24px',
                boxShadow: '3px 3px 0 var(--border-hair)',
              }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em',
                  color: 'var(--cyan-700)', marginBottom: 14 }}>0{i + 1}</div>
                <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700,
                  letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-500)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: 'var(--ink-900)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <Eyebrow light>The process</Eyebrow>
          <h2 style={{ margin: '0 0 56px', fontSize: 'clamp(26px,3.5vw,42px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--paper-100)', maxWidth: '24ch' }}>
            From first call to live agent in about a week.
          </h2>
          <div className="ll-step-row ll-grid-4" style={{ gap: 0 }}>
            {steps.map(([num, title, desc, time], i) => (
              <div key={num} style={{ padding: '0 28px 0', paddingLeft: i ? 28 : 0,
                borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none', display: 'grid', gap: 12, alignContent: 'start' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 700,
                  color: 'var(--cyan-500)', letterSpacing: '-0.03em' }}>{num}</div>
                <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.25, color: 'var(--paper-100)' }}>{title}</div>
                <p style={{ margin: 0, fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink-400)' }}>{desc}</p>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--cyan-500)' }}>{time}</span>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── INDUSTRIES ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 64 }}>
            <div>
              <Eyebrow>Who it's built for</Eyebrow>
              <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700,
                letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)' }}>
                Any business where a missed call means a missed sale.
              </h2>
              <p style={{ margin: '0 0 32px', fontSize: 15, lineHeight: 1.7, color: 'var(--ink-500)' }}>
                If your revenue is tied to inbound calls — emergency services, high-ticket appointments,
                complex quotes — an AI voice agent pays for itself in the first week.
              </p>
              <Button variant="secondary" onClick={trackBook}>See if it fits your business</Button>
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
                background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
                {industries.map((ind) => (
                  <div key={ind} style={{ background: 'var(--paper-100)', padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ color: 'var(--cyan-700)', fontSize: 12, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--ink-900)',
                      letterSpacing: '-0.01em' }}>{ind}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section style={{ background: 'var(--paper-200)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <Eyebrow>AI vs. traditional</Eyebrow>
          <h2 style={{ margin: '0 0 48px', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)', maxWidth: '26ch' }}>
            How it stacks up against your current setup.
          </h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14,
              background: 'var(--paper-000)', border: '1px solid var(--ink-900)',
              boxShadow: '4px 4px 0 var(--ink-900)' }}>
              <thead>
                <tr style={{ background: 'var(--ink-900)', color: 'var(--paper-100)' }}>
                  <th style={{ textAlign: 'left', padding: '14px 20px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
                    borderRight: '1px solid var(--border-hair-inverse)', width: '34%' }}>Capability</th>
                  <th style={{ textAlign: 'center', padding: '14px 20px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-500)',
                    borderRight: '1px solid var(--border-hair-inverse)' }}>AI Voice Agent</th>
                  <th style={{ textAlign: 'center', padding: '14px 20px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-300)' }}>Traditional Setup</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Available after hours', '✓  Always', '✕  Voicemail or missed'],
                  ['Answers in under 1 second', '✓  Every call', '—  Depends on hold queue'],
                  ['Books directly into calendar', '✓  Real time', '—  Manual follow-up'],
                  ['Handles 10 calls simultaneously', '✓  No limit', '✕  One call per person'],
                  ['Cost per call', '✓  Near zero', '✕  $15–$40 per handled call'],
                ].map(([feat, ai, trad], i) => (
                  <tr key={feat} style={{ borderTop: '1px solid var(--border-hair)',
                    background: i % 2 === 1 ? 'var(--paper-100)' : 'var(--paper-000)' }}>
                    <td style={{ padding: '14px 20px', color: 'var(--ink-700)', fontWeight: 600,
                      borderRight: '1px solid var(--border-hair)' }}>{feat}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: ai.startsWith('✓') ? 'var(--cyan-700)' : 'var(--ink-500)',
                      fontWeight: 600, borderRight: '1px solid var(--border-hair)' }}>{ai}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center',
                      color: trad.startsWith('✕') ? 'var(--status-danger)' : 'var(--ink-500)' }}>{trad}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Wrap>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: 'var(--surface-sunken)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <Eyebrow>Common questions</Eyebrow>
          <h2 style={{ margin: '0 0 48px', fontSize: 'clamp(24px,3vw,38px)', fontWeight: 700,
            letterSpacing: '-0.03em', lineHeight: 1.15, color: 'var(--ink-900)', maxWidth: '24ch' }}>
            Everything you've been wondering.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--border-hair)',
            border: '1px solid var(--border-hair)' }}>
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} style={{ background: open ? 'var(--paper-000)' : 'var(--paper-100)',
                  transition: 'background 140ms ease' }}>
                  <button onClick={() => setOpenFaq(open ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '22px 24px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', gap: 16 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)',
                      letterSpacing: '-0.01em' }}>{q}</span>
                    <span style={{ fontSize: 18, color: open ? 'var(--cyan-700)' : 'var(--ink-400)', flexShrink: 0,
                      transition: 'transform 200ms ease, color 200ms ease',
                      transform: open ? 'rotate(45deg)' : 'none' }}>+</span>
                  </button>
                  {open && (
                    <div style={{ padding: '0 24px 24px' }}>
                      <p style={{ margin: 0, fontSize: 14.5, lineHeight: 1.7, color: 'var(--ink-600)' }}>{a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Wrap>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', padding: 'clamp(80px,10vw,112px) 0', color: 'var(--paper-100)', textAlign: 'center' }}>
        <Wrap>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
            background: 'var(--ink-800)', border: '1px solid var(--border-hair-inverse)', borderRadius: 'var(--radius-2)', marginBottom: 28 }}>
            <span className="ll-live-dot" aria-hidden="true" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-500)' }}>
              Accepting new clients
            </span>
          </div>

          <h2 style={{ margin: '0 auto', fontSize: 'clamp(30px,5vw,54px)', fontWeight: 700,
            letterSpacing: '-0.035em', lineHeight: 1.1, maxWidth: '18ch' }}>
            Stop losing calls to voicemail.
          </h2>
          <p style={{ margin: '20px auto 0', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.65,
            color: 'var(--ink-300)', maxWidth: '46ch' }}>
            Book a free 30-minute strategy call. We'll audit your current call flow, show you what a
            voice agent would look like for your specific business, and give you a clear picture of ROI
            before you commit to anything.
          </p>
          <div style={{ marginTop: 40 }}>
            <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={trackBook}>Book my free strategy call</Button>
          </div>

          {/* trust row */}
          <div style={{ marginTop: 48, paddingTop: 40,
            borderTop: '1px solid var(--border-hair-inverse)',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 40px' }}>
            {[
              'No setup fee for the first call',
              'Live within 1 week',
              'Dedicated 30-day tuning period',
              'Cancel anytime',
            ].map((txt) => (
              <span key={txt} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--ink-400)',
                display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: 'var(--cyan-500)' }}>✓</span> {txt}
              </span>
            ))}
          </div>
        </Wrap>
      </section>

    </main>
  );
}
