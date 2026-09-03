import React from 'react';
import { BOOKING_URL } from '../lib/booking';
// Shared with the FAQPage schema in lib/seo.js: Google requires the answer text
// in structured data to match what the visitor actually reads on the page.
import { GROW_FAQ as faqs } from '../lib/content';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

const Eyebrow = ({ children, light }) => (
  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
    color: light ? 'var(--cyan-500)' : 'var(--ink-400)', marginBottom: 14 }}>
    {children}
  </div>
);

const Divider = ({ light }) => (
  <div style={{ borderTop: `1px solid ${light ? 'rgba(216,211,198,0.15)' : 'var(--border-hair)'}`, margin: '0' }} />
);

const BookBtn = ({ size = 'md', label = 'Book a free strategy call', dark }) => {
  const pad = size === 'lg' ? '16px 36px' : '11px 24px';
  const fs = size === 'lg' ? 15 : 13;
  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
      style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: pad,
        background: 'var(--cyan-500)', color: 'var(--ink-900)', fontWeight: 700, fontSize: fs,
        fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase',
        textDecoration: 'none', borderRadius: 'var(--radius-2)', border: 'none', cursor: 'pointer',
        boxShadow: '3px 3px 0 var(--ink-700)', transition: 'transform 90ms ease, box-shadow 90ms ease' }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translate(-1px,-1px)'; e.currentTarget.style.boxShadow = '4px 4px 0 var(--ink-700)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '3px 3px 0 var(--ink-700)'; }}>
      {label} <span style={{ fontSize: 16 }}>→</span>
    </a>
  );
};

const problems = [
  ['Leads slip through the cracks', 'A potential customer calls after hours, fills out a form, or sends a Facebook message — and never hears back. That lead is gone. Forever.'],
  ['You\'re invisible on Google', 'When someone searches "HVAC near me" or "best dentist in Orlando", your competitors show up. You don\'t. Not because you\'re worse — because your digital presence is untended.'],
  ['Your ads spend money and disappear', 'You run a Facebook ad, get a few clicks, and have no idea if any of them turned into revenue. There\'s no follow-up system — just hope.'],
  ['Repetitive tasks eat your day', 'Sending appointment reminders, following up with quotes, asking for reviews — all manual. All eating time you could spend actually running your business.'],
  ['You can\'t tell what\'s working', 'Three different agencies. A website, some social posts, maybe some ads. Zero visibility into which of those actually brought in a customer this month.'],
];

const services = [
  { num: '01', title: 'Automated Lead Follow-Up', desc: 'Every new lead — from your website, ads, social, or phone — gets an instant, personalized response. Text, email, or both. No more missed opportunities while you\'re on a job or with a customer.', items: ['Instant SMS/email response to new leads', 'Multi-step follow-up sequences that run on their own', 'Missed call text-back so every call converts', 'Lead source tracking so you know what\'s working'] },
  { num: '02', title: 'Reputation & Review Management', desc: 'Google reviews are the #1 factor in local purchasing decisions. We automate the ask, collect the reviews, and protect your reputation — all without you lifting a finger.', items: ['Automated review requests after every job', 'One-click reply templates for Google & Facebook', 'Alerts for new reviews (good or bad)', 'Dashboard showing your review trajectory'] },
  { num: '03', title: 'Local SEO & Google Profile Dominance', desc: 'Central Florida searches happen millions of times a day. We optimize every layer of your local presence so your business appears where buyers are actively looking.', items: ['Google Business Profile optimization', 'Local keyword targeting for your service area', 'Citation building across 40+ directories', 'Monthly rankings report'] },
  { num: '04', title: 'Done-For-You Email & SMS Marketing', desc: 'Your past customers are your best future customers. We build and send campaigns that re-engage your list, promote specials, and keep your brand top-of-mind — without you writing a single word.', items: ['Monthly campaigns built and sent for you', 'Seasonal promotions and flash offers', 'Segmented lists (leads vs. customers vs. VIPs)', 'Open rate and click tracking'] },
  { num: '05', title: 'CRM Pipeline & Appointment Booking', desc: 'See every lead, every conversation, and every deal in one place. Know exactly where each prospect stands and never lose track of a follow-up again.', items: ['Visual pipeline from lead to closed deal', 'Online booking calendar synced to your schedule', 'Automated appointment reminders (cut no-shows by 60%)', 'Mobile app so you\'re always in the loop'] },
  { num: '06', title: 'Reporting Dashboard That Tells the Truth', desc: 'One login. Every metric that matters — new leads, calls, reviews, revenue, ad performance. No more guessing. No more paying for things that don\'t work.', items: ['Real-time lead and revenue reporting', 'Ad performance connected to actual customers', 'Monthly strategy call to review numbers and adjust', 'Full transparency — your data, always'] },
];

const packages = [
  {
    name: 'Foundation',
    price: '$797',
    per: '/mo',
    tag: 'Best for getting started',
    desc: 'Core automation to stop losing leads and start collecting reviews.',
    includes: ['Automated lead follow-up (SMS + email)', 'Missed call text-back', 'Review request automation', 'Google Business Profile optimization', 'Basic CRM pipeline', 'Monthly performance report'],
    cta: 'Start with Foundation',
  },
  {
    name: 'Growth',
    price: '$1,497',
    per: '/mo',
    tag: 'Most popular',
    highlight: true,
    desc: 'Full marketing engine — lead gen, reputation, email/SMS, and reporting.',
    includes: ['Everything in Foundation', 'Done-for-you email & SMS campaigns', 'Online booking calendar', 'Local SEO (citations + GBP management)', 'Ad performance tracking', 'Monthly strategy call with your account manager'],
    cta: 'Start with Growth',
  },
  {
    name: 'Dominate',
    price: '$2,497',
    per: '/mo',
    tag: 'For serious growth',
    desc: 'Full-service marketing with paid ad management and priority support.',
    includes: ['Everything in Growth', 'Facebook & Google Ads management (up to $5k ad spend)', 'Landing page & funnel builds', 'AI-powered chat widget on your website', 'Weekly reporting calls', 'Dedicated account manager'],
    cta: 'Start with Dominate',
  },
];

const testimonials = [
  { name: 'Marcus T.', biz: 'HVAC company, Kissimmee', quote: 'We were getting leads and losing them. Now every person who fills out a form gets a text back in under two minutes. We booked four new jobs in the first week alone.' },
  { name: 'Sandra R.', biz: 'Med spa, Lake Mary', quote: 'My Google reviews went from 23 to 61 in three months — without me asking a single patient myself. The automated follow-up handles everything.' },
  { name: 'James P.', biz: 'Roofing contractor, Orlando', quote: 'I spent years paying different people for SEO, email, social. Now it\'s all in one place and I actually understand what\'s happening with my marketing.' },
];

const stats = [
  ['72%', 'of consumers choose the business that responds first'],
  ['5×', 'more likely to convert a lead contacted within 5 minutes'],
  ['88%', 'of consumers trust online reviews as much as personal recommendations'],
  ['3.5×', 'average ROI for businesses with automated follow-up systems'],
];

function GrowCFL() {
  const [openFaq, setOpenFaq] = React.useState(null);

  return (
    <main style={{ fontFamily: 'var(--font-body)' }}>

      {/* ── BOOKING BANNER ── */}
      <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          height: 36, background: 'var(--ink-900)', borderBottom: '1px solid rgba(216,211,198,0.25)',
          textDecoration: 'none', fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink-300)',
          transition: 'background 160ms ease', position: 'sticky', top: 0, zIndex: 30 }}
        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(216,211,198,0.08)'; }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--ink-900)'; }}>
        <span style={{ color: 'var(--cyan-500)', fontSize: 7 }}>●</span>
        Book a free strategy call
        <span style={{ color: 'var(--cyan-500)', fontSize: 11 }}>→</span>
      </a>

      {/* ── HERO ── */}
      <section className="ll-grid-bg--inverse"
        style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)', padding: 'clamp(56px,8vw,96px) 0 clamp(48px,6vw,80px)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: 600, height: 600, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(216,211,198,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <Wrap>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 12px',
            background: 'rgba(216,211,198,0.10)', border: '1px solid rgba(216,211,198,0.3)', borderRadius: 'var(--radius-2)', marginBottom: 28 }}>
            <span style={{ color: 'var(--cyan-500)', fontSize: 8 }}>●</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-500)' }}>
              Central Florida Marketing Systems
            </span>
          </div>
          <h1 style={{ margin: 0, fontWeight: 800, fontSize: 'clamp(36px, 5vw, 64px)', lineHeight: 1.08, letterSpacing: '-0.03em', maxWidth: '20ch' }}>
            Stop losing customers<br />to businesses that{' '}
            <span style={{ color: 'var(--cyan-500)' }}>respond faster</span>.
          </h1>
          <p style={{ maxWidth: '58ch', margin: '28px 0 0', fontSize: 18, lineHeight: 1.65, color: 'var(--ink-300)' }}>
            Most Central Florida small businesses have a marketing problem that looks like a lead problem.
            Leads come in — through your website, ads, social, or phone — and disappear before anyone follows up.
            We fix that with a complete, automated marketing system built specifically for local service businesses.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 40, flexWrap: 'wrap' }}>
            <BookBtn size="lg" label="Get my free strategy session" />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-400)' }}>
              No pitch. No pressure. 30 minutes.
            </span>
          </div>

          <div className="ll-stats-row" style={{ display: 'flex', gap: 0, marginTop: 64,
            borderTop: '1px solid rgba(216,211,198,0.10)' }}>
            {stats.map(([val, label], i) => (
              <div key={val} style={{ flex: 1, padding: '24px 0 0', paddingLeft: i ? 24 : 0,
                borderLeft: i ? '1px solid rgba(216,211,198,0.10)' : 'none' }}>
                <div style={{ fontSize: 38, fontWeight: 800, letterSpacing: '-0.04em', color: 'var(--cyan-500)' }}>{val}</div>
                <div style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--ink-400)', marginTop: 6, maxWidth: '22ch' }}>{label}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <Wrap>
          <Eyebrow>The real problem</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', maxWidth: '26ch' }}>
            Your marketing isn't broken. Your <span style={{ borderBottom: '3px solid var(--cyan-500)' }}>systems</span> are.
          </h2>
          <p style={{ margin: '20px 0 0', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-500)', maxWidth: '60ch' }}>
            Central Florida has over 180,000 small businesses. The ones winning aren't necessarily better at their craft —
            they're better at capturing, following up with, and retaining customers. Here's what's happening right now in yours:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 1,
            marginTop: 48, background: 'var(--border-hair)', border: '1px solid var(--border-hair)' }}>
            {problems.map(([title, desc]) => (
              <div key={title} style={{ background: 'var(--paper-100)', padding: '32px 28px', display: 'grid', gap: 12 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,50,50,0.08)',
                  border: '1px solid rgba(255,50,50,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, color: '#e53935' }}>✕</div>
                <div style={{ fontWeight: 700, fontSize: 16, lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink-500)' }}>{desc}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── SOLUTION INTRO ── */}
      <section style={{ background: 'var(--ink-900)', padding: 'clamp(56px,8vw,96px) 0', color: 'var(--paper-100)' }}>
        <Wrap>
          <Eyebrow light>The solution</Eyebrow>
          <div className="ll-2col" style={{ gap: 48, alignItems: 'center' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.15 }}>
                One complete system.<br />Everything connected.<br /><span style={{ color: 'var(--cyan-500)' }}>Always running.</span>
              </h2>
              <p style={{ margin: '24px 0 0', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-300)' }}>
                We build, install, and manage a full marketing and automation system for your business —
                so leads get followed up with instantly, customers get reminded automatically,
                reviews come in consistently, and you can see exactly what's working.
              </p>
              <p style={{ margin: '16px 0 0', fontSize: 16, lineHeight: 1.7, color: 'var(--ink-300)' }}>
                You don't need another agency. You need a system.
              </p>
              <div style={{ marginTop: 36 }}>
                <BookBtn label="See how it works for my business" />
              </div>
            </div>
            <div style={{ display: 'grid', gap: 12 }}>
              {[
                ['Before', [
                  'Lead fills out form → nobody calls → lead goes to competitor',
                  'Customer finishes job → no review request → review count stays at 14',
                  'Ad runs → clicks happen → no idea if any turned into revenue',
                  'You try to follow up → it\'s been 3 days → too late',
                ]],
                ['After', [
                  'Lead fills out form → instant text in 90 seconds → appointment booked',
                  'Job complete → automated review request → Google rating climbs to 4.8',
                  'Ad click → lead → follow-up → booked → revenue tracked end-to-end',
                  'Follow-up runs automatically → on day 1, 3, 7, and 14 → zero manual effort',
                ]],
              ].map(([label, items]) => (
                <div key={label} style={{ background: label === 'After' ? 'rgba(216,211,198,0.08)' : 'rgba(216,211,198,0.04)',
                  border: `1px solid ${label === 'After' ? 'rgba(216,211,198,0.2)' : 'rgba(216,211,198,0.10)'}`,
                  borderRadius: 'var(--radius-2)', padding: '20px 24px' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: label === 'After' ? 'var(--cyan-500)' : 'var(--ink-400)', marginBottom: 12 }}>
                    {label === 'Before' ? '✕  Before' : '✓  After'}
                  </div>
                  <div style={{ display: 'grid', gap: 8 }}>
                    {items.map(it => (
                      <div key={it} style={{ fontSize: 13, lineHeight: 1.55, color: label === 'After' ? 'var(--paper-100)' : 'var(--ink-400)' }}>
                        {it}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── SERVICES ── */}
      <section style={{ background: 'var(--paper-200)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <Wrap>
          <Eyebrow>What's included</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', maxWidth: '28ch' }}>
            Six systems. One platform. Built for Central Florida businesses.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24, marginTop: 56 }}>
            {services.map(({ num, title, desc, items }) => (
              <div key={num} style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)',
                borderRadius: 'var(--radius-2)', padding: '32px 28px', display: 'grid', gap: 16, alignContent: 'start',
                boxShadow: '3px 3px 0 var(--border-hair)' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--cyan-500)' }}>{num}</div>
                <h3 style={{ margin: 0, fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.2 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-500)' }}>{desc}</p>
                <Divider />
                <div style={{ display: 'grid', gap: 8 }}>
                  {items.map(item => (
                    <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, lineHeight: 1.5, color: 'var(--ink-600)' }}>
                      <span style={{ color: 'var(--cyan-500)', fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ background: 'var(--ink-900)', color: 'var(--paper-100)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <Wrap>
          <Eyebrow light>How it works</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 56 }}>
            Up and running in under two weeks.
          </h2>
          <div className="ll-step-row ll-grid-4" style={{ gap: 0 }}>
            {[
              ['01', 'Free Strategy Call', 'We learn your business, your market, and what\'s not working. No pitch — just an honest conversation about what a system would look like for you.', '30 minutes'],
              ['02', 'Custom Build', 'We build your entire system — lead capture, follow-up sequences, review automation, CRM, reporting — configured to your business and service area.', '5–7 business days'],
              ['03', 'Launch & Test', 'We go live, run test leads through the system, and verify everything works end-to-end before you start paying for it.', 'Day 7–10'],
              ['04', 'Ongoing Management', 'We monitor, optimize, and manage your system every month. You get a monthly report and a call to review what\'s working and what to adjust.', 'Ongoing'],
            ].map(([num, title, desc, timing], i) => (
              <div key={num} style={{ padding: '0 28px 0', paddingLeft: i ? 28 : 0,
                borderLeft: i ? '1px solid rgba(216,211,198,0.10)' : 'none', display: 'grid', gap: 12, alignContent: 'start' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 800, color: 'var(--cyan-500)', letterSpacing: '-0.04em' }}>{num}</div>
                <div style={{ fontWeight: 700, fontSize: 18, lineHeight: 1.25 }}>{title}</div>
                <div style={{ fontSize: 14, lineHeight: 1.65, color: 'var(--ink-400)' }}>{desc}</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--cyan-500)', marginTop: 4 }}>{timing}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <Wrap>
          <Eyebrow>What clients say</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(24px, 3vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 48 }}>
            Real results. Real Central Florida businesses.
          </h2>
          <div className="ll-grid-3" style={{ gap: 20 }}>
            {testimonials.map(({ name, biz, quote }) => (
              <div key={name} style={{ background: 'var(--paper-000)', border: '1px solid var(--border-hair)',
                borderTop: '3px solid var(--cyan-500)', borderRadius: 'var(--radius-2)',
                padding: '32px 28px', display: 'grid', gap: 20, alignContent: 'start' }}>
                <div style={{ fontSize: 32, lineHeight: 1, color: 'var(--cyan-500)', fontFamily: 'Georgia, serif' }}>"</div>
                <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: 'var(--ink-700)', fontStyle: 'italic' }}>{quote}</p>
                <div style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 16 }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-400)', marginTop: 2 }}>{biz}</div>
                </div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── CTA MID ── */}
      <section style={{ background: 'var(--cyan-500)', padding: '72px 0' }}>
        <Wrap style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
            color: 'var(--ink-500)', marginBottom: 16 }}>Limited availability · Central Florida only</div>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px, 3.5vw, 42px)', fontWeight: 800, letterSpacing: '-0.03em', color: 'var(--ink-900)' }}>
            We only onboard 5 new clients per month.
          </h2>
          <p style={{ margin: '16px auto 0', maxWidth: '52ch', fontSize: 16, lineHeight: 1.65, color: 'var(--ink-600)' }}>
            We cap our intake intentionally. Every new client gets a dedicated onboarding call,
            custom build, and first-month check-in. We can't do that well at scale — and we won't pretend otherwise.
          </p>
          <div style={{ marginTop: 36 }}>
            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '16px 36px',
                background: 'var(--ink-900)', color: 'var(--paper-100)', fontWeight: 700, fontSize: 15,
                fontFamily: 'var(--font-mono)', letterSpacing: '0.06em', textTransform: 'uppercase',
                textDecoration: 'none', borderRadius: 'var(--radius-2)', boxShadow: '3px 3px 0 var(--ink-700)' }}>
              Check availability →
            </a>
          </div>
        </Wrap>
      </section>

      {/* ── PRICING ── */}
      <section style={{ background: 'var(--paper-200)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <Wrap>
          <Eyebrow>Pricing</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(28px, 3.5vw, 44px)', fontWeight: 700, letterSpacing: '-0.025em', maxWidth: '28ch', marginBottom: 8 }}>
            Simple, transparent pricing.
          </h2>
          <p style={{ margin: '12px 0 48px', fontSize: 16, color: 'var(--ink-500)' }}>
            Month-to-month. No setup fees. No long-term contracts.
          </p>

          {/* September promo card */}
          <div style={{ maxWidth: 560, margin: '0 auto', background: 'var(--ink-900)', border: '2px solid var(--cyan-500)',
            borderRadius: 'var(--radius-2)', padding: '48px 40px', position: 'relative',
            boxShadow: '6px 6px 0 var(--cyan-500)' }}>

            {/* Promo badge */}
            <div style={{ position: 'absolute', top: -16, left: '50%', transform: 'translateX(-50%)',
              background: 'var(--cyan-500)', color: 'var(--ink-900)', fontFamily: 'var(--font-mono)', fontSize: 10,
              letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 700, padding: '5px 16px',
              borderRadius: 'var(--radius-pill)', whiteSpace: 'nowrap' }}>
              🎉 September Special — Limited Time
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase',
              color: 'var(--cyan-500)', marginBottom: 10 }}>All-in-one plan</div>
            <div style={{ fontWeight: 800, fontSize: 26, color: 'var(--paper-100)', marginBottom: 16 }}>
              Everything. One price.
            </div>

            {/* Price display */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 8, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                <span style={{ fontSize: 64, fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--cyan-500)', lineHeight: 1 }}>$197</span>
                <span style={{ fontSize: 16, color: 'var(--ink-400)' }}>/mo</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-400)',
                    textDecoration: 'line-through' }}>$497/mo</span>
                  <span style={{ background: 'rgba(216,211,198,0.15)', border: '1px solid rgba(216,211,198,0.3)',
                    borderRadius: 'var(--radius-2)', padding: '2px 8px', fontFamily: 'var(--font-mono)',
                    fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--cyan-500)',
                    fontWeight: 700 }}>60% off</span>
                </div>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, letterSpacing: '0.1em',
                  textTransform: 'uppercase', color: 'var(--ink-400)' }}>September only · Locks in your rate</span>
              </div>
            </div>

            <p style={{ margin: '0 0 28px', fontSize: 15, lineHeight: 1.65, color: 'var(--ink-300)' }}>
              Get the complete marketing system — lead follow-up, reputation management, local SEO, email &amp; SMS campaigns, booking automation, and your revenue dashboard — all included, at our lowest price ever.
            </p>

            <Divider light />

            <div style={{ display: 'grid', gap: 10, margin: '24px 0 32px' }}>
              {[
                'Instant lead follow-up via SMS + email (24/7)',
                'Missed call text-back automation',
                'Review request system after every job',
                'Google Business Profile optimization + local SEO',
                'Done-for-you email & SMS campaigns',
                'Online booking calendar + appointment reminders',
                'Full CRM pipeline — see every lead in one place',
                'Monthly strategy call + performance report',
              ].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14,
                  lineHeight: 1.5, color: 'var(--paper-100)' }}>
                  <span style={{ color: 'var(--cyan-500)', fontSize: 14, marginTop: 1, flexShrink: 0 }}>✓</span>
                  {item}
                </div>
              ))}
            </div>

            <a href={BOOKING_URL} target="_blank" rel="noopener noreferrer"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                padding: '16px 24px', borderRadius: 'var(--radius-2)', fontFamily: 'var(--font-mono)',
                fontSize: 13, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700,
                textDecoration: 'none', background: 'var(--cyan-500)', color: '#000',
                boxShadow: '3px 3px 0 var(--ink-700)' }}>
              Claim my September rate →
            </a>

            <p style={{ margin: '16px 0 0', fontSize: 12, color: 'var(--ink-500)', textAlign: 'center' }}>
              Price locks in for as long as you stay. Offer ends September 30.
            </p>
          </div>

        </Wrap>
      </section>

      {/* ── WHO IT'S FOR ── */}
      <section style={{ background: 'var(--paper-100)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <Wrap>
          <div className="ll-2col" style={{ gap: 48, alignItems: 'start' }}>
            <div>
              <Eyebrow>Who this is for</Eyebrow>
              <h2 style={{ margin: 0, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', lineHeight: 1.2 }}>
                Built for Central Florida service businesses that are ready to grow.
              </h2>
              <p style={{ margin: '20px 0 32px', fontSize: 15, lineHeight: 1.7, color: 'var(--ink-500)' }}>
                We work best with owner-operated businesses between $300K and $5M in annual revenue
                who know they're losing leads and opportunities — but don't have the time or team to fix it themselves.
              </p>
              <div style={{ display: 'grid', gap: 12 }}>
                {['Home services (HVAC, plumbing, roofing, landscaping, pest control)',
                  'Healthcare & wellness (dentists, chiropractors, med spas, physical therapy)',
                  'Legal, financial, and professional services',
                  'Restaurants, gyms, and local retail',
                  'Real estate agents and property managers',
                  'Auto detailing, salons, and other appointment-based businesses',
                ].map(biz => (
                  <div key={biz} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-600)', alignItems: 'center' }}>
                    <span style={{ color: 'var(--cyan-500)', flexShrink: 0 }}>→</span> {biz}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <Eyebrow>Not a fit if</Eyebrow>
              <div style={{ display: 'grid', gap: 12, marginBottom: 48 }}>
                {['You\'re not willing to respond to booked calls that come through',
                  'You\'re looking for a quick fix with zero follow-through',
                  'Your business isn\'t located in or serving Central Florida',
                  'You have zero existing customer base to work with',
                ].map(item => (
                  <div key={item} style={{ display: 'flex', gap: 12, fontSize: 14, lineHeight: 1.5, color: 'var(--ink-500)', alignItems: 'flex-start' }}>
                    <span style={{ color: '#e53935', flexShrink: 0, marginTop: 2 }}>✕</span> {item}
                  </div>
                ))}
              </div>
              <div style={{ background: 'var(--paper-200)', border: '1px solid var(--border-hair)',
                borderLeft: '3px solid var(--cyan-500)', borderRadius: 'var(--radius-2)', padding: '24px 20px' }}>
                <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>We'll be honest on the call.</div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.65, color: 'var(--ink-500)' }}>
                  If we don't think this system will materially help your business, we'll tell you —
                  and point you toward what will. We don't take clients who won't benefit.
                </p>
              </div>
            </div>
          </div>
        </Wrap>
      </section>

      {/* ── FAQ ── */}
      <section style={{ background: 'var(--paper-200)', padding: 'clamp(56px,8vw,96px) 0' }}>
        <Wrap>
          <Eyebrow>FAQ</Eyebrow>
          <h2 style={{ margin: 0, fontSize: 'clamp(26px, 3vw, 38px)', fontWeight: 700, letterSpacing: '-0.025em', marginBottom: 40 }}>
            Common questions.
          </h2>
          <div style={{ display: 'grid', gap: 0, border: '1px solid var(--border-hair)', borderRadius: 'var(--radius-2)', overflow: 'hidden' }}>
            {faqs.map(([q, a], i) => (
              <div key={q}>
                {i > 0 && <Divider />}
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: '100%', padding: '22px 24px', background: openFaq === i ? 'var(--paper-100)' : 'var(--paper-000)',
                    border: 'none', cursor: 'pointer', textAlign: 'left', display: 'flex', justifyContent: 'space-between',
                    alignItems: 'center', gap: 16, transition: 'background 90ms ease' }}>
                  <span style={{ fontWeight: 600, fontSize: 15, color: 'var(--ink-900)', lineHeight: 1.4 }}>{q}</span>
                  <span style={{ color: 'var(--cyan-500)', fontSize: 20, flexShrink: 0, transform: openFaq === i ? 'rotate(45deg)' : 'none',
                    transition: 'transform 160ms ease' }}>+</span>
                </button>
                {openFaq === i && (
                  <div style={{ padding: '0 24px 24px', background: 'var(--paper-100)', fontSize: 14, lineHeight: 1.75, color: 'var(--ink-500)' }}>
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="ll-grid-bg--inverse" style={{ background: 'var(--ink-900)', padding: '104px 0 112px', color: 'var(--paper-100)', textAlign: 'center' }}>
        <Wrap>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '5px 14px',
            background: 'rgba(216,211,198,0.10)', border: '1px solid rgba(216,211,198,0.25)', borderRadius: 'var(--radius-2)', marginBottom: 28 }}>
            <span style={{ color: 'var(--cyan-500)', fontSize: 8 }}>●</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--cyan-500)' }}>
              Free. No obligation. 30 minutes.
            </span>
          </div>
          <h2 style={{ margin: '0 auto', fontSize: 'clamp(32px, 5vw, 58px)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.08, maxWidth: '22ch' }}>
            Let's find out exactly what your business is leaving on the table.
          </h2>
          <p style={{ margin: '28px auto 0', maxWidth: '54ch', fontSize: 17, lineHeight: 1.7, color: 'var(--ink-300)' }}>
            In 30 minutes, we'll map out where your leads are leaking, which competitors are outpacing you,
            and what a full system would look like for your specific business — no pressure, no pitch.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, marginTop: 48 }}>
            <BookBtn size="lg" label="Book my free strategy session" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginTop: 4 }}>
              {['No credit card', 'No contracts', 'No BS'].map((item, i) => (
                <React.Fragment key={item}>
                  {i > 0 && <span style={{ color: 'var(--ink-700)', fontSize: 12 }}>·</span>}
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>{item}</span>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="ll-grid-3" style={{ gap: 20, maxWidth: 680, margin: '64px auto 0',
            borderTop: '1px solid rgba(216,211,198,0.10)', paddingTop: 56 }}>
            {[
              ['5-day', 'Build & launch', 'Your system is live in under two weeks from first call'],
              ['Month-to-month', 'No contracts', 'Stay because it works — not because you\'re locked in'],
              ['Central Florida', 'Local focus', 'We know this market. We work exclusively here.'],
            ].map(([val, label, desc]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--cyan-500)', letterSpacing: '-0.03em' }}>{val}</div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--paper-100)', marginTop: 4 }}>{label}</div>
                <div style={{ fontSize: 12, color: 'var(--ink-400)', lineHeight: 1.5, marginTop: 6 }}>{desc}</div>
              </div>
            ))}
          </div>
        </Wrap>
      </section>

    </main>
  );
}

export default GrowCFL;
