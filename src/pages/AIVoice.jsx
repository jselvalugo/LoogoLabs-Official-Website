import React from 'react';

const BOOKING_URL = 'https://api.leadconnectorhq.com/widget/bookings/outbound-reach-aoFaC';

const trackBook = () => { if (window.fbq) window.fbq('track', 'Schedule'); };

/* ─────────────────────── primitives ─────────────────────── */
const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const Eye = ({ children, light, green }) => (
  <div style={{
    fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: green ? '#2FD07E' : light ? 'var(--ink-300)' : 'var(--ink-400)',
    marginBottom: 14,
  }}>{children}</div>
);

const BookBtn = ({ label = 'Book a free demo call', size = 'md', invert }) => {
  const pad = size === 'lg' ? '18px 40px' : '12px 26px';
  const fs = size === 'lg' ? 14 : 13;
  const bg = invert ? 'var(--paper-100)' : '#2FD07E';
  const color = invert ? 'var(--ink-900)' : 'var(--ink-900)';
  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackBook}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 9, padding: pad,
        background: bg, color, fontWeight: 700, fontSize: fs,
        fontFamily: 'var(--font-mono)', letterSpacing: '0.07em', textTransform: 'uppercase',
        textDecoration: 'none', borderRadius: 'var(--radius-2)',
        boxShadow: `3px 3px 0 ${invert ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)'}`,
        transition: 'transform 90ms ease, box-shadow 90ms ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = `4px 4px 0 ${invert ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)'}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `3px 3px 0 ${invert ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.25)'}`; }}>
      {label} <span style={{ fontSize: 16 }}>→</span>
    </a>
  );
};

/* ─────────────────────── waveform bars ─────────────────────── */
const WAVE_BARS = [0.3, 0.7, 0.5, 1, 0.6, 0.85, 0.4, 0.9, 0.55, 0.75, 0.35, 0.95, 0.5, 0.8, 0.45, 1, 0.6, 0.7, 0.4, 0.9, 0.55, 0.65, 0.35, 0.85, 0.5, 0.75, 0.3, 0.95, 0.6, 0.8, 0.4, 0.7];

const Waveform = ({ color = '#2FD07E', height = 56, animate = true }) => (
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
  ['01', 'Intake & scripting', 'We interview you (or your top salesperson) to capture your best call flow, objections, and closing language.', '~1 week'],
  ['02', 'Build & training', 'We build the voice agent, train it on your business, and run test calls until it meets our standard.', '~1 week'],
  ['03', 'Integration', 'We connect your phone system, CRM pipeline, and calendar. Zero downtime — runs alongside your existing setup.', '~3 days'],
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
  ['How long does setup take?', 'Most clients go live in 10–14 business days from our first call. We handle the entire build. You show up for a 90-minute intake session and an approval call before launch.'],
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
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.9); opacity: 0;   }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        .aiv-fade { animation: fadeUp 0.6s ease both; }
      `}</style>

      {/* ── BOOKING BANNER ── */}
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer" onClick={trackBook}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          height: 36, background: 'var(--ink-900)', borderBottom: '1px solid rgba(47,208,126,0.2)',
          textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-300)',
          transition: 'background 160ms ease', position: 'sticky', top: 0, zIndex: 30,
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(47,208,126,0.06)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink-900)'; }}>
        <span style={{ color: '#2FD07E', fontSize: 7, animation: 'blink 2s ease infinite' }}>●</span>
        Now live — book a free AI voice agent demo
        <span style={{ color: '#2FD07E', fontSize: 11 }}>→</span>
      </a>

      {/* ── HERO ── */}
      <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', padding: 'clamp(72px,10vw,120px) 0 clamp(56px,7vw,88px)' }}>
        <Wrap>
          {/* live badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 32,
            background: 'rgba(47,208,126,0.1)', border: '1px solid rgba(47,208,126,0.3)',
            borderRadius: 'var(--radius-pill)', padding: '6px 14px' }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2FD07E', display: 'block' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2FD07E',
                animation: 'pulseRing 1.6s ease-out infinite' }} />
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: '#2FD07E' }}>
              AI Voice Agents · Loogo Labs
            </span>
          </div>

          {/* headline */}
          <h1 style={{
            margin: '0 0 24px', fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6.5vw, 80px)', fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 1.0,
            color: 'var(--paper-000)', maxWidth: '16ch',
          }}>
            Your Business Answers Every Call.{' '}
            <span style={{ color: '#2FD07E' }}>Even the 2 A.M. Ones.</span>
          </h1>

          <p style={{ margin: '0 0 40px', fontSize: 'clamp(16px,1.8vw,20px)', lineHeight: 1.6,
            color: 'var(--ink-200)', maxWidth: '54ch' }}>
            A custom AI voice agent that qualifies leads, books appointments, and handles objections
            — in your brand's voice, around the clock, without a single missed call.
          </p>

          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginBottom: 64 }}>
            <BookBtn size="lg" label="Book a free demo call" />
            <a href="#how-it-works"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '18px 32px',
                border: '1px solid rgba(234,230,220,0.25)', color: 'var(--paper-100)',
                fontFamily: 'var(--font-mono)', fontSize: 13, letterSpacing: '0.07em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: 'var(--radius-2)',
                transition: 'border-color 160ms ease, color 160ms ease' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(47,208,126,0.5)'; e.currentTarget.style.color = '#2FD07E'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(234,230,220,0.25)'; e.currentTarget.style.color = 'var(--paper-100)'; }}>
              See how it works ↓
            </a>
          </div>

          {/* waveform display */}
          <div style={{ marginBottom: 56, padding: '24px 28px',
            background: 'rgba(47,208,126,0.06)', border: '1px solid rgba(47,208,126,0.2)',
            borderRadius: 'var(--radius-3)', display: 'flex', alignItems: 'center', gap: 20, maxWidth: 520 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ position: 'relative', display: 'inline-flex' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#2FD07E', display: 'block' }} />
                <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2FD07E',
                  animation: 'pulseRing 1.6s ease-out infinite' }} />
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: '#2FD07E' }}>Live · Answering</span>
            </div>
            <div style={{ flex: 1 }}>
              <Waveform color="#2FD07E" height={40} animate />
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--ink-400)',
              letterSpacing: '0.05em' }}>0:47</span>
          </div>

          {/* stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 0,
            borderTop: '1px solid rgba(234,230,220,0.12)' }}>
            {[
              ['100%', 'Answer rate'],
              ['< 1 s', 'Time to pick up'],
              ['24 / 7', 'Always on'],
              ['$0', 'Per call (after setup)'],
            ].map(([num, label], i) => (
              <div key={i} style={{ padding: '28px 0 0', borderLeft: i > 0 ? '1px solid rgba(234,230,220,0.12)' : 'none',
                paddingLeft: i > 0 ? 28 : 0 }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(28px,3.5vw,42px)', fontWeight: 800,
                  letterSpacing: '-0.03em', color: '#2FD07E', lineHeight: 1 }}>{num}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--ink-400)', marginTop: 6 }}>{label}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── SOCIAL PROOF STRIP ── */}
      <div style={{ background: '#2FD07E', padding: '18px 0', overflowX: 'auto' }}>
        <Wrap>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px 40px', justifyContent: 'center' }}>
            {[
              'Picks up in under 1 second',
              'Never calls in sick',
              'Zero hold time',
              'Books directly into your calendar',
              'Works in English and Spanish',
              'Native CRM integration',
            ].map((txt, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
                textTransform: 'uppercase', color: 'var(--ink-900)', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 7 }}>●</span> {txt}
              </span>
            ))}
          </div>
        </Wrap>
      </div>

      {/* ── PROBLEM ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <Eye>The problem</Eye>
          <h2 style={{ margin: '0 0 16px', fontSize: 'clamp(28px,4vw,52px)', fontWeight: 800,
            letterSpacing: '-0.035em', lineHeight: 1.08, color: 'var(--ink-900)', maxWidth: '22ch' }}>
            Every unanswered call is a competitor's{' '}
            <span style={{ textDecoration: 'underline', textDecorationColor: '#2FD07E', textUnderlineOffset: 5, textDecorationThickness: 3 }}>
              new customer.
            </span>
          </h2>
          <p style={{ margin: '0 0 56px', fontSize: 17, lineHeight: 1.65, color: 'var(--ink-500)', maxWidth: '56ch' }}>
            The average small business misses over 60% of inbound calls. Most of those callers never try again.
            They find someone who answers — and they book with them instead.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1,
            background: 'var(--ink-900)', border: '1px solid var(--ink-900)' }}>
            {problems.map(([title, desc], i) => (
              <div key={i} style={{ background: 'var(--paper-100)', padding: '32px 28px' }}>
                <div style={{ width: 28, height: 28, borderRadius: 'var(--radius-2)', background: 'rgba(255,74,61,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginBottom: 18, fontWeight: 700, fontSize: 14, color: '#FF4A3D' }}>✕</div>
                <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 700,
                  letterSpacing: '-0.01em', color: 'var(--ink-900)' }}>{title}</h3>
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
              <Eye light>Live call simulation</Eye>
              <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(26px,3.5vw,46px)', fontWeight: 800,
                letterSpacing: '-0.035em', lineHeight: 1.1, color: 'var(--paper-000)', maxWidth: '20ch' }}>
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
                ].map((pt, i) => (
                  <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                    <span style={{ color: '#2FD07E', fontWeight: 700, marginTop: 1, flexShrink: 0 }}>✓</span>
                    <span style={{ fontSize: 14, color: 'var(--ink-200)', lineHeight: 1.6 }}>{pt}</span>
                  </div>
                ))}
              </div>
              <BookBtn label="Hear it on a live call" />
            </div>

            {/* right: phone transcript mockup */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 360,
                background: '#0D0D0D', borderRadius: 28,
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: '0 32px 64px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)',
                overflow: 'hidden',
              }}>
                {/* phone top bar */}
                <div style={{ background: '#161616', padding: '14px 20px 12px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
                      textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 3 }}>Incoming call</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: 'white' }}>+1 (407) 555-0182</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ position: 'relative', display: 'inline-flex' }}>
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2FD07E', display: 'block' }} />
                      <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2FD07E',
                        animation: 'pulseRing 1.6s ease-out infinite' }} />
                    </span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: '#2FD07E',
                      letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live</span>
                  </div>
                </div>

                {/* waveform in phone */}
                <div style={{ padding: '12px 20px', background: '#111', display: 'flex', alignItems: 'center', gap: 12,
                  borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.08em', flexShrink: 0 }}>AI Agent</span>
                  <div style={{ flex: 1 }}>
                    <Waveform color="#2FD07E" height={24} animate />
                  </div>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'rgba(255,255,255,0.3)',
                    letterSpacing: '0.08em' }}>1:12</span>
                </div>

                {/* transcript */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: 12,
                  maxHeight: 320, overflowY: 'auto', background: '#0D0D0D' }}>
                  {transcript.map((line, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: line.role === 'agent' ? 'flex-start' : 'flex-end' }}>
                      <div style={{
                        maxWidth: '82%', padding: '9px 13px', borderRadius: line.role === 'agent'
                          ? '4px 14px 14px 4px' : '14px 4px 4px 14px',
                        background: line.role === 'agent' ? 'rgba(47,208,126,0.12)' : 'rgba(255,255,255,0.07)',
                        border: `1px solid ${line.role === 'agent' ? 'rgba(47,208,126,0.2)' : 'rgba(255,255,255,0.06)'}`,
                      }}>
                        {line.role === 'agent' && (
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 8.5, letterSpacing: '0.1em',
                            textTransform: 'uppercase', color: '#2FD07E', marginBottom: 4 }}>AI Agent</div>
                        )}
                        <p style={{ margin: 0, fontSize: 12.5, lineHeight: 1.55,
                          color: line.role === 'agent' ? 'rgba(255,255,255,0.88)' : 'rgba(255,255,255,0.65)' }}>
                          {line.text}
                        </p>
                      </div>
                    </div>
                  ))}
                  {/* booked confirmation */}
                  <div style={{ textAlign: 'center', padding: '10px 0' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6,
                      background: 'rgba(47,208,126,0.15)', border: '1px solid rgba(47,208,126,0.3)',
                      borderRadius: 'var(--radius-pill)', padding: '5px 12px' }}>
                      <span style={{ color: '#2FD07E', fontSize: 11 }}>✓</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: 9, letterSpacing: '0.1em',
                        textTransform: 'uppercase', color: '#2FD07E' }}>Appointment booked · Synced to your CRM</span>
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
          <Eye>What it does</Eye>
          <h2 style={{ margin: '0 0 56px', fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink-900)', maxWidth: '28ch' }}>
            Everything your front desk does — plus everything they can't.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: 16 }}>
            {capabilities.map(([title, desc], i) => (
              <div key={i} style={{
                background: 'var(--paper-000)', border: '1px solid var(--border-hair)',
                borderRadius: 'var(--radius-3)', padding: '32px 28px',
                boxShadow: '3px 3px 0 var(--ink-900)',
                transition: 'transform 120ms ease, box-shadow 120ms ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink-900)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink-900)'; }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em',
                  textTransform: 'uppercase', color: '#2FD07E', marginBottom: 14 }}>0{i + 1}</div>
                <h3 style={{ margin: '0 0 10px', fontSize: 17, fontWeight: 700,
                  letterSpacing: '-0.015em', color: 'var(--ink-900)' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-500)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" style={{ background: 'var(--ink-900)', padding: 'clamp(72px,9vw,112px) 0' }}>
        <Wrap>
          <Eye light>The process</Eye>
          <h2 style={{ margin: '0 0 64px', fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--paper-000)', maxWidth: '24ch' }}>
            From intake call to live agent in about two weeks.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 0 }}>
            {steps.map(([num, title, desc, time], i) => (
              <div key={i} style={{ padding: '0 0 0 28px',
                borderLeft: i > 0 ? '1px solid rgba(234,230,220,0.12)' : '1px solid rgba(47,208,126,0.4)',
                marginLeft: i > 0 ? 0 : 0, paddingLeft: 28 }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(36px,4vw,52px)', fontWeight: 700,
                  color: i === 0 ? '#2FD07E' : 'rgba(234,230,220,0.15)', letterSpacing: '-0.02em',
                  lineHeight: 1, marginBottom: 16 }}>{num}</div>
                <h3 style={{ margin: '0 0 10px', fontSize: 15, fontWeight: 700,
                  color: 'var(--paper-100)', letterSpacing: '-0.01em' }}>{title}</h3>
                <p style={{ margin: '0 0 20px', fontSize: 13.5, lineHeight: 1.65, color: 'var(--ink-300)',
                  paddingRight: 20 }}>{desc}</p>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: '#2FD07E' }}>{time}</span>
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
              <Eye>Who it's built for</Eye>
              <h2 style={{ margin: '0 0 20px', fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800,
                letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink-900)' }}>
                Any business where a missed call means a missed sale.
              </h2>
              <p style={{ margin: '0 0 40px', fontSize: 15, lineHeight: 1.7, color: 'var(--ink-500)' }}>
                If your revenue is tied to inbound calls — emergency services, high-ticket appointments,
                complex quotes — an AI voice agent pays for itself in the first week.
              </p>
              <BookBtn label="See if it fits your business" />
            </div>
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1,
                background: 'var(--ink-900)', border: '1px solid var(--ink-900)' }}>
                {industries.map((ind, i) => (
                  <div key={i} style={{ background: 'var(--paper-100)', padding: '18px 20px',
                    display: 'flex', alignItems: 'center', gap: 10,
                    transition: 'background 120ms ease', cursor: 'default' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--paper-000)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--paper-100)'; }}>
                    <span style={{ color: '#2FD07E', fontSize: 12, flexShrink: 0 }}>→</span>
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
          <Eye>AI vs. traditional</Eye>
          <h2 style={{ margin: '0 0 48px', fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink-900)', maxWidth: '26ch' }}>
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
                    borderRight: '1px solid rgba(255,255,255,0.08)', width: '34%' }}>Capability</th>
                  <th style={{ textAlign: 'center', padding: '14px 20px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#2FD07E',
                    borderRight: '1px solid rgba(255,255,255,0.08)' }}>AI Voice Agent</th>
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
                  <tr key={i} style={{ borderTop: '1px solid var(--border-hair)',
                    background: i % 2 === 1 ? 'var(--paper-100)' : 'var(--paper-000)' }}>
                    <td style={{ padding: '14px 20px', color: 'var(--ink-700)', fontWeight: 600,
                      borderRight: '1px solid var(--border-hair)' }}>{feat}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center', color: ai.startsWith('✓') ? '#2FD07E' : 'var(--ink-500)',
                      fontWeight: 600, borderRight: '1px solid var(--border-hair)' }}>{ai}</td>
                    <td style={{ padding: '14px 20px', textAlign: 'center',
                      color: trad.startsWith('✕') ? '#FF4A3D' : 'var(--ink-500)' }}>{trad}</td>
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
          <Eye>Common questions</Eye>
          <h2 style={{ margin: '0 0 48px', fontSize: 'clamp(24px,3vw,40px)', fontWeight: 800,
            letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ink-900)', maxWidth: '24ch' }}>
            Everything you've been wondering.
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1, background: 'var(--ink-900)',
            border: '1px solid var(--ink-900)' }}>
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={i} style={{ background: open ? 'var(--paper-000)' : 'var(--paper-100)',
                  transition: 'background 140ms ease' }}>
                  <button onClick={() => setOpenFaq(open ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      padding: '22px 24px', background: 'none', border: 'none', cursor: 'pointer',
                      textAlign: 'left', gap: 16 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--ink-900)',
                      letterSpacing: '-0.01em' }}>{q}</span>
                    <span style={{ fontSize: 18, color: open ? '#2FD07E' : 'var(--ink-400)', flexShrink: 0,
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
      <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', padding: 'clamp(80px,10vw,120px) 0' }}>
        <Wrap style={{ textAlign: 'center' }}>
          {/* live pulse */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 28,
            background: 'rgba(47,208,126,0.1)', border: '1px solid rgba(47,208,126,0.25)',
            borderRadius: 'var(--radius-pill)', padding: '6px 16px' }}>
            <span style={{ position: 'relative', display: 'inline-flex' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#2FD07E', display: 'block' }} />
              <span style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#2FD07E',
                animation: 'pulseRing 1.6s ease-out infinite' }} />
            </span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#2FD07E' }}>Accepting new clients</span>
          </div>

          <h2 style={{ margin: '0 auto 16px', fontSize: 'clamp(30px,5vw,64px)', fontWeight: 800,
            letterSpacing: '-0.04em', lineHeight: 1.05, color: 'var(--paper-000)', maxWidth: '18ch' }}>
            Stop losing calls to voicemail.
          </h2>
          <p style={{ margin: '0 auto 48px', fontSize: 'clamp(15px,1.8vw,18px)', lineHeight: 1.65,
            color: 'var(--ink-300)', maxWidth: '46ch' }}>
            Book a free 30-minute strategy call. We'll audit your current call flow, show you what a
            voice agent would look like for your specific business, and give you a clear picture of ROI
            before you commit to anything.
          </p>
          <BookBtn size="lg" label="Book my free strategy call" />

          {/* trust row */}
          <div style={{ marginTop: 48, paddingTop: 40,
            borderTop: '1px solid rgba(234,230,220,0.1)',
            display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '12px 40px' }}>
            {[
              'No setup fee for the first call',
              'Live within 2 weeks',
              'Dedicated 30-day tuning period',
              'Cancel anytime',
            ].map((txt, i) => (
              <span key={i} style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
                textTransform: 'uppercase', color: 'var(--ink-400)',
                display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#2FD07E' }}>✓</span> {txt}
              </span>
            ))}
          </div>
        </Wrap>
      </section>

    </main>
  );
}
