import React from 'react';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { VOICE_CITIES, voiceCityPath } from '../lib/voiceCities';
import {
  Phone, CalendarCheck, Check, X, Minus, Plus, ArrowRight, ArrowDown,
  Moon, Funnel, ChatsCircle, ShieldCheck, Microphone,
} from '@phosphor-icons/react';
import '../styles/pages/aivoice.css';

const trackBook = () => { if (window.fbq) window.fbq('track', 'Schedule'); openBooking(); };

/* ─────────────────────── primitives ─────────────────────── */
const Wrap = ({ children, className, style }) => (
  <div className={['av-wrap', className].filter(Boolean).join(' ')} style={style}>{children}</div>
);

/* ─────────────────────── waveform bars ─────────────────────── */
const WAVE_BARS = [0.3, 0.7, 0.5, 1, 0.6, 0.85, 0.4, 0.9, 0.55, 0.75, 0.35, 0.95, 0.5, 0.8, 0.45, 1, 0.6, 0.7, 0.4, 0.9, 0.55, 0.65, 0.35, 0.85, 0.5, 0.75, 0.3, 0.95, 0.6, 0.8, 0.4, 0.7];

const Waveform = ({ height = 56, barCount = WAVE_BARS.length }) => (
  <div className="av-wave" style={{ height }} aria-hidden="true">
    {WAVE_BARS.slice(0, barCount).map((h, i) => (
      <i key={i} style={{ height: `${h * 100}%`, animationDelay: `${(i * 0.04).toFixed(2)}s` }} />
    ))}
  </div>
);

/* ─────────────────────── call transcript ─────────────────────── */
const transcript = [
  { role: 'caller', text: 'Hi, I need someone to look at my AC. It stopped working last night.' },
  { role: 'agent', text: "I'm so sorry to hear that, especially in this heat. We can absolutely help. Are you in the Orlando area?" },
  { role: 'caller', text: 'Yes, Winter Park.' },
  { role: 'agent', text: "Perfect, we service Winter Park. Are you available tomorrow between 8 and 11 A.M., or does the afternoon work better?" },
  { role: 'caller', text: 'Morning works.' },
  { role: 'agent', text: "Great, I've got you down for tomorrow, 8 to 11 A.M. You'll get a confirmation text shortly. Is there anything else I can help with?" },
];

/* ─────────────────────── data ─────────────────────── */
const heroStats = [
  ['100%', 'Answer rate'],
  ['< 1 s', 'Time to pick up'],
  ['24 / 7', 'Always on'],
  ['~1 week', 'To launch'],
];

const proofPoints = [
  'Picks up in under 1 second',
  'Never calls in sick',
  'Zero hold time',
  'Books directly into your calendar',
  'Works in English and Spanish',
  'Native CRM integration',
];

const problems = [
  ['62% of calls go unanswered', 'More than half the calls your business receives happen outside business hours. Every unanswered ring is a lead that just called your competitor.'],
  ['Voicemail gets deleted, not played', "The average person waits less than eight seconds before hanging up. They're not leaving a voicemail. They're googling someone else."],
  ['Speed to lead is everything', "Research shows the odds of contacting a lead drop by 80% after five minutes. If you're answering tomorrow, someone else answered today."],
];

const capabilities = [
  ['24/7 Live Call Answering', 'Never miss another call. Your AI agent picks up in under a second, day or night, weekends and holidays included.', Moon],
  ['Natural Lead Qualification', 'Asks the right questions in the right order (location, timeline, budget, urgency) and scores the lead before your team ever gets involved.', Funnel],
  ['Appointment Booking', 'Syncs directly with your calendar and CRM pipeline. Prospects book a time slot during the call, and every lead is tagged automatically, with no manual entry.', CalendarCheck],
  ['Objection Handling', 'Trained on your most common objections. Price shopping? Competition? Not ready? The agent has a scripted, on-brand response for each.', ChatsCircle],
];

const steps = [
  ['01', 'Intake & scripting', 'We interview you (or your top salesperson) to capture your best call flow, objections, and closing language.', '1-2 days'],
  ['02', 'Build & training', 'We build the voice agent, train it on your business, and run test calls until it meets our standard.', '2-3 days'],
  ['03', 'Integration', 'We connect your phone system, CRM pipeline, and calendar. Zero downtime: runs alongside your existing setup.', '1 day'],
  ['04', 'Go live & tune', 'The agent goes live. We monitor real calls for the first 30 days and tune based on what we hear.', 'Ongoing'],
];

const industries = [
  'HVAC & Mechanical', 'Roofing & Exteriors', 'Dental & Med Spa', 'Real Estate & Mortgage',
  'Pest Control', 'Plumbing & Electric', 'Personal Injury Law', 'Auto Services',
];

// Each cell: [kind, text]. kind = yes | no | meh (drives icon + color).
const comparison = [
  ['Available after hours', ['yes', 'Always'], ['no', 'Voicemail or missed']],
  ['Answers in under 1 second', ['yes', 'Every call'], ['meh', 'Depends on hold queue']],
  ['Books directly into calendar', ['yes', 'Real time'], ['meh', 'Manual follow-up']],
  ['Handles 10 calls simultaneously', ['yes', 'No limit'], ['no', 'One call per person']],
  ['Cost per call', ['yes', 'Near zero'], ['no', '$15-$40 per handled call']],
];

const differentiators = [
  ['Built and run by us, not configured by you', "Most AI voice tools hand you a dashboard and wish you luck. We interview your team, write the script, train the agent, and monitor real calls for the first 30 days."],
  ['Every call feeds the CRM you already run on', 'No separate app, no manual export. Bookings, tags, and call outcomes land directly in your existing pipeline, next to your follow-up, reviews, and reporting.'],
  ["A person still has the leash", "When a call goes outside its training, the agent hands off to your team instead of guessing. You're never one strange call away from a bad review."],
];

const faqs = [
  ['Does it sound like a robot?', 'No. Modern voice AI is indistinguishable from human agents in most calls. We train it on your specific vocabulary, cadence, and tone so it sounds like someone who works for you, not a generic IVR system.'],
  ['What happens when a call gets too complex?', 'The agent knows its limits. If a caller asks something outside its training, it warmly offers to have a team member call them back, captures their info, and logs the ticket in your CRM.'],
  ['Will it work with our existing phone number?', 'Yes. We route calls through your existing number. No need to change your marketing, your signage, or your contacts. Callers dial the same number they always have.'],
  ['How long does setup take?', "Most clients go live within a week of our first call. We handle the entire build. You show up for a 90-minute intake session and an approval call before launch."],
];

const CellIcon = ({ kind }) => {
  const Icon = kind === 'yes' ? Check : kind === 'no' ? X : Minus;
  return <span className={`av-mark av-mark--${kind}`} aria-hidden="true"><Icon size={12} weight="bold" /></span>;
};

/* ─────────────────────── main component ─────────────────────── */
export default function AIVoice() {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <main className="av">

      {/* ── HERO ── */}
      <section className="av-hero">
        <Wrap>
          <div className="av-hero__grid">
            <div>
              <span className="av-pill ll-glass"><span className="av-pill__tag">AI Voice</span>Works in English and Spanish</span>
              <h1 className="av-hero__title">
                Your Business Answers Every Call. <em>Even the 2 A.M. Ones.</em>
              </h1>
              <p className="av-hero__lede">
                A custom AI voice agent that qualifies leads, books appointments, and handles objections
                in your brand's voice, around the clock, without a single missed call.
              </p>
              <div className="av-hero__actions">
                <Button variant="inverse" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>Book a free demo call</Button>
                <Button variant="secondary" size="lg" iconRight={<ArrowDown size={16} weight="bold" />} onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}>
                  See how it works
                </Button>
              </div>
            </div>

            <div className="av-hero__art" aria-hidden="true">
              <div className="av-call ll-forest">
                <div className="av-call__top">
                  <span className="av-call__icon"><Phone size={20} weight="fill" /></span>
                  <div>
                    <small>Incoming call</small>
                    <strong>+1 (407) 555-0182</strong>
                  </div>
                  <span className="av-call__live"><span className="ll-live-dot" />Live</span>
                </div>
                <div className="av-call__wave">
                  <Waveform height={44} />
                  <span>0:47</span>
                </div>
                <div className="av-call__lines">
                  <p className="av-bubble av-bubble--caller">{transcript[0].text}</p>
                  <p className="av-bubble av-bubble--agent">{transcript[1].text}</p>
                </div>
              </div>
              <div className="av-float av-float--a ll-glass">
                <span className="av-float__icon"><CalendarCheck size={20} weight="bold" /></span>
                <div><strong>Appointment booked</strong><span>Synced to your CRM</span></div>
              </div>
              <div className="av-float av-float--b ll-glass">
                <span className="av-float__icon"><Microphone size={20} weight="bold" /></span>
                <div><strong>Picks up in under 1 second</strong><span>Zero hold time</span></div>
              </div>
            </div>
          </div>

          <div className="av-stats ll-glass">
            {heroStats.map(([val, label]) => (
              <div key={label}>
                <span className="av-stats__v">{val}</span>
                <span className="av-stats__l">{label}</span>
              </div>
            ))}
          </div>

          <ul className="av-proof" aria-label="Highlights">
            {proofPoints.map((txt) => (
              <li key={txt}><Check size={14} weight="bold" aria-hidden="true" />{txt}</li>
            ))}
          </ul>
        </Wrap>
      </section>

      {/* ── PROBLEM ── */}
      <Wrap className="av-section ll-reveal">
        <span className="ll-eyebrow">The problem</span>
        <h2 className="av-h2">Every unanswered call is a competitor's <em>new customer.</em></h2>
        <p className="av-lede">
          The average small business misses over 60% of inbound calls. Most of those callers never try again.
          They find someone who answers, and they book with them instead.
        </p>
        <div className="av-problems">
          {problems.map(([title, desc], i) => (
            <div key={title} className={`av-problem ${i === 0 ? 'll-forest' : i === 1 ? 'av-paper' : 'll-sage'}`}>
              <span className="av-problem__x" aria-hidden="true"><X size={16} weight="bold" /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </Wrap>

      {/* ── LIVE DEMO ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-demo ll-forest">
          <div>
            <h2 className="av-h2 av-h2--light">It sounds like your best employee <em>on their best day.</em></h2>
            <p className="av-demo__p">
              The AI doesn't read from a script. It holds a real conversation, adapts to what the caller says,
              and guides them toward the outcome your business needs: a booked appointment.
            </p>
            <ul className="av-demo__list">
              {['Speaks naturally, with no robotic pauses or clipped sentences',
                'Handles interruptions and tangents gracefully',
                'Stays on-brand for every single call',
                'Confirms booking details before ending the call',
              ].map((pt) => (
                <li key={pt}><Check size={14} weight="bold" aria-hidden="true" />{pt}</li>
              ))}
            </ul>
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>Hear it on a live call</Button>
          </div>

          {/* phone transcript mockup */}
          <div className="av-phone ll-glass--dark">
            <div className="av-phone__top">
              <div>
                <small>Incoming call</small>
                <strong>+1 (407) 555-0182</strong>
              </div>
              <span className="av-call__live"><span className="ll-live-dot" aria-hidden="true" />Live</span>
            </div>
            <div className="av-phone__wave">
              <small>AI Agent</small>
              <Waveform height={22} />
              <small>1:12</small>
            </div>
            <div className="av-phone__body">
              {transcript.map((line, i) => (
                <div key={i} className={`av-bubble av-bubble--${line.role}`}>
                  {line.role === 'agent' && <small>AI Agent</small>}
                  <p>{line.text}</p>
                </div>
              ))}
              <div className="av-phone__done">
                <span><Check size={12} weight="bold" aria-hidden="true" />Appointment booked. Synced to your CRM</span>
              </div>
            </div>
          </div>
        </div>
      </Wrap>

      {/* ── CAPABILITIES ── */}
      <Wrap className="av-section ll-reveal">
        <h2 className="av-h2">Everything your front desk does, <em>plus everything they can't.</em></h2>
        <div className="av-bento">
          {capabilities.map(([title, desc, Icon], i) => (
            <div key={title} className={`av-tile ${['ll-forest av-tile--dark', 'll-glass', 'll-sage', 'av-paper'][i]}`}>
              <span className="av-tile__icon" aria-hidden="true"><Icon size={22} weight="bold" /></span>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </Wrap>

      {/* ── DIFFERENTIATOR ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-diff">
          <div className="av-diff__head">
            <span className="ll-eyebrow">Why Loogo Labs</span>
            <h2 className="av-h2">Not a bot bolted onto <em>your phone line.</em></h2>
            <p className="av-lede">
              Plenty of tools will sell you a self-serve voice bot and leave the rest to you. That's not what this is.
            </p>
          </div>
          <div className="av-diff__list">
            {differentiators.map(([title, desc], i) => (
              <div key={title} className={`av-diff__item ${i === 0 ? 'll-sage' : 'av-paper'}`}>
                {i === 0 && <span className="av-tile__icon" aria-hidden="true"><ShieldCheck size={22} weight="bold" /></span>}
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Wrap>

      {/* ── HOW IT WORKS ── */}
      <Wrap className="av-section ll-reveal">
        <section id="how-it-works" className="av-steps ll-forest">
          <h2 className="av-h2 av-h2--light">From first call to live agent <em>in about a week.</em></h2>
          <div className="av-steps__grid">
            {steps.map(([num, title, desc, time]) => (
              <div key={num} className="av-step">
                <span className="av-step__time">{time}</span>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </section>
      </Wrap>

      {/* ── INDUSTRIES ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-ind ll-glass">
          <div>
            <h2 className="av-h2">Any business where a missed call means <em>a missed sale.</em></h2>
            <p className="av-lede">
              If your revenue is tied to inbound calls (emergency services, high-ticket appointments,
              complex quotes), an AI voice agent pays for itself in the first week.
            </p>
            <div style={{ marginTop: 28 }}>
              <Button variant="inverse" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>See if it fits your business</Button>
            </div>
          </div>
          <ul className="av-ind__chips">
            {industries.map((ind) => <li key={ind}>{ind}</li>)}
          </ul>
        </div>
      </Wrap>

      {/* ── COMPARISON TABLE ── */}
      <Wrap className="av-section ll-reveal">
        <span className="ll-eyebrow">AI vs. traditional</span>
        <h2 className="av-h2">How it stacks up against <em>your current setup.</em></h2>

        {/* desktop/tablet: full table */}
        <div className="av-compare av-compare-table">
          <table>
            <thead>
              <tr>
                <th scope="col">Capability</th>
                <th scope="col" className="av-compare__ai">AI Voice Agent</th>
                <th scope="col">Traditional Setup</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map(([feat, ai, trad]) => (
                <tr key={feat}>
                  <td>{feat}</td>
                  <td className="av-compare__ai"><span className="av-cell"><CellIcon kind={ai[0]} />{ai[1]}</span></td>
                  <td><span className={`av-cell av-cell--${trad[0]}`}><CellIcon kind={trad[0]} />{trad[1]}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* mobile: stacked cards; a 3-column table can't fit a phone width without truncating */}
        <div className="av-compare-cards">
          {comparison.map(([feat, ai, trad]) => (
            <div key={feat} className="av-ccard">
              <strong>{feat}</strong>
              <div><small>AI Voice Agent</small><span className="av-cell"><CellIcon kind={ai[0]} />{ai[1]}</span></div>
              <div><small>Traditional Setup</small><span className={`av-cell av-cell--${trad[0]}`}><CellIcon kind={trad[0]} />{trad[1]}</span></div>
            </div>
          ))}
        </div>
      </Wrap>

      {/* ── FAQ ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-faq">
          <h2 className="av-h2">Everything you've been <em>wondering.</em></h2>
          <div className="av-faq__list">
            {faqs.map(([q, a], i) => {
              const open = openFaq === i;
              return (
                <div key={q} className={`av-faq__item${open ? ' is-open' : ''}`}>
                  <button onClick={() => setOpenFaq(open ? null : i)} aria-expanded={open}>
                    <span>{q}</span>
                    <span className="av-faq__plus" aria-hidden="true"><Plus size={16} weight="bold" /></span>
                  </button>
                  {open && <p>{a}</p>}
                </div>
              );
            })}
          </div>
        </div>
      </Wrap>

      {/* ── CENTRAL FLORIDA CITIES ── */}
      <Wrap className="av-section ll-reveal">
        <div className="av-cities av-paper">
          <h2 className="av-h2">AI voice agents for businesses <em>in your city.</em></h2>
          <div className="cfl-nearby av-cities__links">
            {VOICE_CITIES.map((c) => (
              <a key={c.slug} href={voiceCityPath(c.slug)} className="cfl-nearby__link">{c.name} <span aria-hidden="true">→</span></a>
            ))}
          </div>
        </div>
      </Wrap>

      {/* ── FINAL CTA ── */}
      <Wrap className="av-section av-section--last ll-reveal">
        <div className="av-cta ll-forest">
          <span className="av-cta__badge ll-glass--dark"><span className="ll-live-dot" aria-hidden="true" />Accepting new clients</span>
          <h2>Stop losing calls <em>to voicemail.</em></h2>
          <p>
            Book a free 30-minute strategy call. We'll audit your current call flow, show you what a
            voice agent would look like for your specific business, and give you a clear picture of ROI
            before you commit to anything.
          </p>
          <div style={{ marginTop: 28 }}>
            <Button variant="primary" size="lg" iconRight={<ArrowRight size={16} weight="bold" />} onClick={trackBook}>Book my free strategy call</Button>
          </div>
          <ul className="av-cta__trust">
            {[
              'No setup fee for the first call',
              'Live within 1 week',
              'Dedicated 30-day tuning period',
              'Cancel anytime',
            ].map((txt) => (
              <li key={txt}><Check size={14} weight="bold" aria-hidden="true" />{txt}</li>
            ))}
          </ul>
        </div>
      </Wrap>

    </main>
  );
}
