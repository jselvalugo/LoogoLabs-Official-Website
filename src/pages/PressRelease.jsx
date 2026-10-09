import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import { openBooking } from '../lib/booking';
import { ArrowRight, Check, Plus } from '@phosphor-icons/react';
import '../styles/pages/packages.css';

const order = (pkg) => {
  if (window.fbq) window.fbq('track', 'InitiateCheckout', { content_name: pkg });
  openBooking();
};

// The value story: what a published release actually does for a business.
// Platforms are named as plain text, never logos, and nothing here promises a placement.
const VALUE = [
  {
    names: ['Google', 'Google News', 'Bing'],
    title: 'Show up when customers search your name',
    body: 'Published news pages stay on record, so anyone who looks you up finds a credible story, not just your own site.',
  },
  {
    names: ['ChatGPT', 'Claude', 'Gemini', 'Perplexity'],
    title: 'Be on the pages AI assistants read',
    body: 'Answer engines lean on published news as source material. A release gives them something about you to cite.',
  },
  {
    names: ['ABC', 'CBS', 'FOX', 'NBC affiliates'],
    title: 'Earn an "as seen on" you can share',
    body: 'Your placement report links to live news pages you can put on your site, socials, and sales decks.',
  },
];

const BENEFITS = [
  ['Instant credibility', 'A real news page about your business builds trust before a customer ever calls.'],
  ['Stronger search presence', 'News pages rank for your brand name and push your best story to the top of the results.'],
  ['Cited by AI answers', 'Published news gives ChatGPT, Gemini, and other assistants something accurate to say about you.'],
  ['Backlinks to your site', 'Links from news pages point people and search engines straight to your website.'],
  ['Content for every channel', 'Share the live links on your site, Google profile, socials, emails, and sales decks.'],
  ['Lasting record', 'Your story stays published, working for you long after launch day.'],
];

const INCLUDED = ['Distribution to 350+ news & media sites', 'Google News indexing', 'Editorial review & formatting', 'Placement report with every live link'];

const USES = ['Grand openings', 'New locations', 'Product & service launches', 'Awards & milestones', 'New hires & partnerships', 'Events & community work'];

const STEPS = [
  ['You tell us what\'s new', 'A quick call, a draft, or rough notes, no finished copy required.'],
  ['We shape the story', 'We agree the angle with you, or find one in what you send us.'],
  ['We polish the release', 'Edited to the format and standard news sites expect.'],
  ['You sign it off', 'Nothing goes to the network until you approve it.'],
];

// Fictional example business — used only to illustrate what a release and report look like.
const EXAMPLE = {
  company: 'Lakeside Comfort HVAC',
  headline: 'Lakeside Comfort HVAC Opens Second Central Florida Location',
  dateline: 'CELEBRATION, Fla.',
  site: 'lakesidecomfort.com',
};

// Outlet types in the distribution network. Shown as text wordmarks, not logos.
const PLACEMENTS = [
  { outlet: 'Google News', style: { fontWeight: 600 }, path: 'news.google.com', note: 'Indexed' },
  { outlet: 'FOX affiliate', style: { fontWeight: 800, letterSpacing: '0.04em' }, path: 'local station business news' },
  { outlet: 'NBC affiliate', style: { fontWeight: 800, letterSpacing: '0.04em' }, path: 'local station press releases' },
  { outlet: 'CBS affiliate', style: { fontWeight: 800, letterSpacing: '0.04em' }, path: 'local station news partners' },
  { outlet: 'ABC affiliate', style: { fontWeight: 800, letterSpacing: '0.04em' }, path: 'local station business wire' },
  { outlet: 'AP News', style: { fontWeight: 800 }, path: 'apnews.com/press-release', note: 'Add-on' },
  { outlet: 'Barchart', style: { fontWeight: 700 }, path: 'barchart.com/story/news', note: 'Add-on' },
];

const FAQ = [
  ['How fast does it go live?', 'Once you approve your release, we schedule it for distribution and send your placement report when it is live. Timing varies by release.'],
  ['Which sites will I appear on?', 'Your release is distributed across a network of 350+ news and media sites, including broadcast affiliate pages. Specific outlets are not guaranteed and depend on each outlet\'s editorial policies.'],
  ['Is this the same as getting featured by a journalist?', 'No. This is paid distribution of your announcement, not an earned story. It builds search presence and credibility; any journalist pickup is a bonus.'],
  ['What can\'t I publish?', 'Releases must be genuine news and meet content guidelines: no adult, gambling, or misleading claims. We will flag anything before it goes out.'],
];

const Arrow = <ArrowRight size={16} weight="bold" />;
const Tick = () => <Check className="pk-check" size={16} weight="bold" aria-hidden="true" />;

function PressRelease() {
  return (
    <main>
      {/* ── HERO ── */}
      <section className="pk-wrap pk-hero pk-hero--center">
        <div style={{ display: 'flex', justifyContent: 'center' }}><Badge tone="accent">Press release distribution</Badge></div>
        <h1 className="pk-title">Get your business in the news. <em>Starting at $149.</em></h1>
        <p className="pk-lede">
          We write, publish, and report on your press release across 350+ news sites, so customers, search engines,
          and AI assistants find a credible story when they look you up.
        </p>
        <div className="pk-hero__actions">
          <Button variant="inverse" size="lg" iconRight={Arrow} onClick={() => order('hero')}>Book a release</Button>
        </div>
        <div className="pk-tag pk-hero__meta">Fixed price · Done for you · Full placement report</div>
      </section>

      {/* ── WHY IT WORKS ── */}
      <section className="pk-wrap pk-section">
        <div className="sp-panel ll-forest ll-bezel--dark">
          <div className="pk-head pk-head--center">
            <h2 className="pk-h2" style={{ color: 'var(--paper-000)' }}>Why businesses publish a release <em style={{ color: 'var(--ink-200)' }}>before their big month</em></h2>
          </div>
          <div className="pr-value">
            {VALUE.map((v) => (
              <div key={v.title} className="pr-value__card ll-glass--dark">
                <div className="pr-chips">
                  {v.names.map((n) => <span key={n}>{n}</span>)}
                </div>
                <h3>{v.title}</h3>
                <p>{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WE DRAFT, YOU SIGN OFF ── */}
      <section className="pk-wrap pk-section">
        <div className="pr-split pr-split--head">
          <div>
            <span className="ll-eyebrow">No PR team needed: that's our job</span>
            <h2 className="pk-h2" style={{ marginTop: 12 }}>We shape your release. <em>You sign it off.</em></h2>
          </div>
          <p className="pr-body" style={{ margin: 0, fontSize: 17, lineHeight: 1.6, color: 'var(--ink-500)' }}>
            Tell us what's new in your business and we turn it into a release that reads like news.
            It comes back to you for approval before any site sees it.
          </p>
        </div>
        <ol className="sp-steps" style={{ marginTop: 36 }}>
          {STEPS.map(([t, d], i) => (
            <li key={t} className="sp-step ll-glass">
              <span className="sp-step__n">{i + 1}</span>
              <h3>{t}</h3>
              <p>{d}</p>
            </li>
          ))}
        </ol>
        <div className="pr-start ll-sage ll-bezel">
          <div>
            <strong>Start whenever suits you.</strong>
            <span className="pr-start__sub"><Tick />Nothing is published until you say yes.</span>
          </div>
          <Button variant="inverse" size="lg" iconRight={Arrow} onClick={() => order('draft')}>Get my release started</Button>
        </div>
      </section>

      {/* ── YOUR RELEASE ── */}
      <section className="pk-wrap pk-section">
        <div className="pr-split">
          <div>
            <span className="ll-eyebrow">Your release</span>
            <h2 className="pk-h2" style={{ marginTop: 12 }}>A ready-to-publish release, <em>written like news</em></h2>
            <p className="pr-body">
              Your links sit inside the story, where readers and search engines follow them. Your company
              boilerplate and contact details close it out, just like a real newsroom release.
            </p>
            <ul className="pk-list">
              {['Headline and angle built for search', 'Links to your site worked into the copy', 'Your sign-off before anything is sent'].map((f) =>
                <li key={f}><Tick />{f}</li>)}
            </ul>
          </div>
          <div className="pr-mock">
            <div className="pr-mock__bar">
              {[0, 1, 2].map((i) => <i key={i} />)}
              <span className="pr-mock__url">news-site.com/press-release/lakeside-comfort-second-location</span>
            </div>
            <div className="pr-mock__body">
              <span className="pr-mock__chip">Press release</span>
              <h3>{EXAMPLE.headline}</h3>
              <div className="pr-mock__by">By {EXAMPLE.company} · Celebration, Florida</div>
              <p>
                <strong style={{ color: 'var(--ink-900)' }}>{EXAMPLE.dateline}</strong>: {EXAMPLE.company} has opened a second location,
                bringing same-day repair and installation to more homeowners across Osceola County.
              </p>
              <p>
                Details and booking are available at <span className="pr-mock__link">{EXAMPLE.site}/new-location</span>.
              </p>
              <p className="pr-mock__fine">Example release for illustration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── YOUR PLACEMENTS ── */}
      <section className="pk-wrap pk-section">
        <div className="pr-split">
          <div>
            <span className="ll-eyebrow">Your placements</span>
            <h2 className="pk-h2" style={{ marginTop: 12 }}>Live across <em>350+ news sites</em></h2>
            <p className="pr-body">
              One announcement, published across the network: every placement a dated news page carrying
              your name and your links, and a crawlable page search engines and AI assistants can read.
            </p>
            <ul className="pk-list">
              {['Broadcast affiliate and business news sites', 'Indexed by Google News', 'A report with every live link'].map((f) =>
                <li key={f}><Tick />{f}</li>)}
            </ul>
          </div>
          <div className="pr-mock">
            <div className="pr-report__head">
              <strong>Placement report</strong>
              <span>{EXAMPLE.company} · Second location</span>
            </div>
            <div className="pr-report__rows">
              {PLACEMENTS.map((pl) => (
                <div key={pl.outlet} className="pr-row">
                  <span className="pr-row__outlet" style={pl.style}>{pl.outlet}</span>
                  <span style={{ minWidth: 0 }}>
                    <span className="pr-row__h">{EXAMPLE.headline}</span>
                    <span className="pr-row__p">{pl.path}</span>
                  </span>
                  {pl.note ? <span className="pr-row__note">{pl.note}</span> : <span />}
                </div>
              ))}
            </div>
            <div className="pr-report__foot">
              + hundreds more sites across the network · Example report for illustration. Outlets vary by release; add-ons cost extra.
            </div>
          </div>
        </div>
      </section>

      {/* ── BENEFITS ── */}
      <section className="pk-wrap pk-section">
        <div className="pk-head pk-head--center">
          <h2 className="pk-h2">One release. <em>Benefits that keep paying off.</em></h2>
        </div>
        <div className="pr-benefits">
          {BENEFITS.map(([t, d]) => (
            <div key={t} className="pr-benefit ll-glass">
              <h3><Tick />{t}</h3>
              <p>{d}</p>
            </div>
          ))}
        </div>

        {/* ── PRICE ── */}
        <div className="pr-price ll-forest ll-bezel--dark pk-dark">
          <div>
            <span className="pk-tag">Starting at</span>
            <div className="pk-price" style={{ marginTop: 8 }}>$149</div>
            <div className="pr-price__sub">per release · fixed price</div>
          </div>
          <ul className="pk-list">
            {INCLUDED.map((f) => <li key={f}><Tick />{f}</li>)}
          </ul>
          <Button variant="primary" size="lg" iconRight={Arrow} onClick={() => order('price')}>Book a release</Button>
        </div>
      </section>

      {/* ── USES ── */}
      <section className="pk-wrap pk-section">
        <div className="sp-panel ll-sage sp-panel--sage" style={{ paddingTop: 40, paddingBottom: 40 }}>
          <h2 className="pk-h2" style={{ fontSize: 'clamp(24px, 2.6vw, 34px)' }}>Great for</h2>
          <div className="pr-uses">
            {USES.map((u) => <span key={u}>{u}</span>)}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="pk-wrap pk-wrap--narrow pk-section">
        <div className="pk-head pk-head--center">
          <h2 className="pk-h2">Good questions</h2>
        </div>
        <div className="sp-faq">
          {FAQ.map(([q, a]) => (
            <details key={q} className="ll-glass">
              <summary>{q}<Plus size={18} weight="bold" aria-hidden="true" /></summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="pk-wrap" style={{ paddingTop: 24, paddingBottom: 96 }}>
        <div className="sp-cta ll-forest ll-bezel--dark">
          <div>
            <h2>Have news to share?</h2>
            <p>Book a 15-minute call and we'll get your release moving.</p>
          </div>
          <Button variant="primary" size="lg" iconRight={Arrow} onClick={() => order('footer')}>Book a release</Button>
        </div>
      </section>
    </main>
  );
}

export default PressRelease;
