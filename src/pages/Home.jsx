import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import SectionHeading from '../components/surfaces/SectionHeading';
import Card from '../components/surfaces/Card';
import { EnvelopeSimple, ArrowsClockwise } from '@phosphor-icons/react';
import { openBooking } from '../lib/booking';
import { SITE, BLOG_BASE, pathForPage } from '../lib/seo';

const Wrap = ({ children, style, className }) => (
  <div className={['hm-wrap', className].filter(Boolean).join(' ')} style={style}>{children}</div>
);

// Hero headline phrase that backspaces and retypes itself through our services. The first word is
// rendered in full on the server, so crawlers and no-JS visitors read a normal
// headline; screen readers get the stable phrase from the h1's aria-label.
const ROTATING_WORDS = ['Email Marketing', 'Text Messaging', 'AI Call Answering', 'Review Automation', 'Local SEO'];

function TypedWord({ words }) {
  const [index, setIndex] = React.useState(0);
  const [text, setText] = React.useState(words[0]);
  const [phase, setPhase] = React.useState('hold'); // hold | delete | type

  React.useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const word = words[index];
    let t;
    if (phase === 'hold') t = setTimeout(() => setPhase('delete'), 2400);
    else if (phase === 'delete') {
      if (text.length) t = setTimeout(() => setText(text.slice(0, -1)), 55);
      else t = setTimeout(() => { setIndex((index + 1) % words.length); setPhase('type'); }, 280);
    } else if (text.length < word.length) t = setTimeout(() => setText(word.slice(0, text.length + 1)), 95);
    else setPhase('hold');
    return () => clearTimeout(t);
  }, [text, phase, index, words]);

  return <span className="hm-typed" aria-hidden="true">{text}<span className="hm-typed__caret" /></span>;
}

// Each tile names the tools it retires, straight from the section copy.
const features = [
  { title: 'CRM & Contacts', tone: 'inverse', retires: ['Spreadsheets', 'Scattered inboxes'],
    body: 'Manage every lead, client, and conversation in one place. Every contact and every pipeline stage, fully organized, with no more juggling disconnected tools.' },
  { title: 'Email & SMS Marketing', tone: 'paper', retires: ['Separate email tool', 'Manual follow-ups'],
    body: 'Send campaigns, automate follow-ups, and reach your audience where they are. Build sequences that run while you sleep and never miss a lead again.' },
  { title: 'Social Media & AI Content', tone: 'sage', retires: ['Social scheduler', 'Blank-page posts'],
    body: 'Schedule posts across every platform and generate content with 60+ AI-powered prompts. Stay consistent and visible without spending hours online every week.' },
  { title: 'Courses, Payments & Automation', tone: 'inverse', retires: ['Course platform', 'Payment links', 'A dozen apps'],
    body: 'Sell courses, build membership communities, collect payments, and automate your entire workflow, all without duct-taping a dozen apps together.' },
];

const voiceBotFeatures = [
  'Answers every call',
  'Books straight to your calendar',
  'Qualifies & routes leads',
  'Texts back missed calls',
];

function VoiceBotSection() {
  return (
    <Wrap className="hm-section ll-reveal">
      <Card tone="inverse" emphasis="strong" className="hm-voice">
        <div>
          <Badge tone="inverse">AI Voice Bot. Try it live</Badge>
          <h2>It answers the phone <em>so you don't have to.</em></h2>
          <p>Picks up every call, books the appointment, and texts back anyone it misses. Around the clock, without hiring another employee.</p>
          <div className="hm-voice__cta">
            <Button variant="primary" size="lg" iconRight={<span>→</span>} onClick={openBooking}>Test the AI Voice Bot</Button>
            <small>Book a slot and we'll set up a live call so you can hear it.</small>
          </div>
        </div>
        <ul>
          {voiceBotFeatures.map(t => <li key={t}>{t}</li>)}
        </ul>
      </Card>
    </Wrap>
  );
}

const REFERENCES = ['Feche Consulting', 'DaLife, LLC', 'House of Cars', 'Reef Ntwrks', 'Lugo’s Craft Distillery'];

function ReferencesTicker() {
  const items = [...REFERENCES, ...REFERENCES];
  return (
    <div className="ll-ticker-bar" role="region" aria-label="Selected clients">
      <div className="ll-ticker-label"><span className="ll-ticker-live" aria-hidden="true" />In good company</div>
      <div className="ll-ticker-belt">
        <div className="ll-ticker-track">
          {items.map((name, i) => (
            <React.Fragment key={i}>
              <span className="ll-ticker-ref">{name}</span>
              <span className="ll-ticker-sep" aria-hidden="true" />
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

// A direct line to the founder, as a low-commitment counterpoint to the booking
// CTA that every other surface pushes. The mailto is a real link, so it also
// backs the email on the Organization entity.
function FounderNote() {
  return (
    <Wrap className="ll-reveal" style={{ paddingBottom: 48 }}>
      <div className="hm-note ll-glass">
        <p>Rather write than talk? Email me directly. It lands in my inbox, not a ticket queue, and I answer it myself.</p>
        <a href={`mailto:${SITE.email}`}>{SITE.email}<span aria-hidden="true">→</span></a>
      </div>
    </Wrap>
  );
}

// The founder, front and center: a deliberate break from the product-only
// sections around it.
function FounderSpotlight() {
  const [imgOk, setImgOk] = React.useState(true);
  return (
    <Wrap className="hm-section ll-reveal">
      <div className="hm-founder">
        <div className="hm-founder__photo">
          {imgOk ? (
            <img src="/founder-david-selva.jpg" alt="David Selva, founder of Loogo Labs" loading="lazy" onError={() => setImgOk(false)} />
          ) : (
            <div className="hm-founder__fallback">DS</div>
          )}
          <div className="hm-founder__name ll-glass">
            <strong>David Selva</strong>
            <span>Founder. 8+ years in performance marketing</span>
          </div>
        </div>
        <div>
          <span className="ll-eyebrow">About the founder</span>
          <h2 style={{ marginTop: 16 }}>By day I run legal contracts. <em>By night, I run your marketing.</em></h2>
          <p>
            I'm David Selva. My day job is Contract Lifecycle Management (CLM) inside the legal tech
            industry, building the systems that keep enterprise contracts moving without a single
            approval falling through the cracks.
          </p>
          <p>
            Loogo Labs is that same obsession pointed somewhere else: a performance-marketing
            build for local businesses tired of losing leads to slow follow-up and duct-taped tools.
            Every workflow running under the hood here, I designed and I run myself.
          </p>
        </div>
      </div>
    </Wrap>
  );
}

// Not ready to book a call? Point them at the free quizzes instead — and give
// the quiz hub a real internal link from the homepage while we're at it.
function QuizTeaser({ onNavigate }) {
  return (
    <Wrap className="ll-reveal" style={{ paddingBottom: 24 }}>
      <a href={pathForPage('Quizzes')} onClick={(e) => { e.preventDefault(); onNavigate('Quizzes'); }}
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
        <Card tone="sage" className="hm-cta">
          <div>
            <h2>Not ready to book a call? Take a 60-second fit check.</h2>
            <p>Quick, free quizzes that tell you straight away whether one of our systems fits your business.</p>
          </div>
          <Button variant="inverse" size="lg" iconRight={<span>→</span>} tabIndex={-1}>See the quizzes</Button>
        </Card>
      </a>
    </Wrap>
  );
}

// One quiet line under the hero pointing at the featured Industry LoogoBlog post. Renders
// nothing until the post list loads, or if no post is featured, so the hero
// never shifts for visitors when there is nothing to show.
function FeaturedPostLine({ onNavigate }) {
  const [post, setPost] = React.useState(null);
  React.useEffect(() => {
    fetch('/.netlify/functions/get-posts')
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setPost(data.find(p => p.featured) || null); })
      .catch(() => {});
  }, []);
  if (!post) return null;
  return (
    <Wrap>
      <a href={`${BLOG_BASE}/${post.slug}`} className="hm-featured ll-glass"
        onClick={e => { e.preventDefault(); onNavigate('BlogPost', post.slug); }}>
        <span className="hm-featured__tag">Featured on Industry LoogoBlog</span>
        <span className="hm-featured__title">{post.title}</span>
        <span className="hm-featured__go" aria-hidden="true">→</span>
      </a>
    </Wrap>
  );
}

function Home({ onNavigate }) {
  return (
    <main>
      <section className="hm-hero">
        <Wrap>
          <div className="hm-hero__grid">
            <div>
              <span className="hm-pill ll-glass"><span className="hm-pill__tag">Orlando</span>Done-for-you email for Central Florida</span>
              <h1 className="hm-hero__title" aria-label="Email Marketing That Brings Customers Back. We Run It for You.">
                <TypedWord words={ROTATING_WORDS} /><span aria-hidden="true"> That Brings Customers Back.</span> <em aria-hidden="true">We Run It for You.</em>
              </h1>
              <p className="hm-hero__lede">
                The cheapest way to turn customers you already have into repeat sales. We write the
                campaigns, build the follow-ups and send them for you.
              </p>
              <div className="hm-hero__actions">
                <Button variant="inverse" size="lg" iconRight={<span>→</span>} onClick={openBooking}>Get my email plan</Button>
                <Button variant="secondary" size="lg" onClick={() => onNavigate('Mission')}>See what's included</Button>
              </div>
            </div>
            <div className="hm-hero__art">
              <img src="/hero-blocks.webp" width="1200" height="921" alt="" aria-hidden="true" decoding="async" fetchpriority="high" />
              <div className="hm-float hm-float--a ll-glass" aria-hidden="true">
                <span className="hm-float__icon"><EnvelopeSimple size={20} weight="bold" /></span>
                <div><strong>Win-back campaign</strong><span>Scheduled for Tuesday, 9:00</span></div>
              </div>
              <div className="hm-float hm-float--b ll-glass" aria-hidden="true">
                <span className="hm-float__icon"><ArrowsClockwise size={20} weight="bold" /></span>
                <div><strong>Follow-up sequence</strong><span>Sends after every visit</span></div>
              </div>
            </div>
          </div>

          <div className="hm-stats ll-glass">
            {[['10+', 'Tools replaced'], ['$400+', 'Saved every month'], ['24/7', 'Support']].map(([v, l]) => (
              <div key={l}><span className="hm-stats__v">{v}</span><span className="hm-stats__l">{l}</span></div>
            ))}
          </div>
        </Wrap>
      </section>

      <FeaturedPostLine onNavigate={onNavigate} />

      <Wrap className="hm-section">
        <SectionHeading title="Everything your business needs to grow, under one roof"
          description="One platform that replaces your CRM, email tool, scheduling app, course platform and social scheduler. One login. One monthly bill." />
        <div className="hm-bento">
          {features.map(f => (
            <Card key={f.title} tone={f.tone} className={`hm-tile ll-reveal${f.tone === 'inverse' ? ' hm-tile--dark' : ''}`}>
              <div className="hm-tile__tools" aria-label="Replaces">
                {f.retires.map(t => <span key={t}>{t}</span>)}
              </div>
              <h3>{f.title}</h3>
              <p style={{ color: f.tone === 'inverse' ? 'var(--ink-200)' : 'var(--ink-500)' }}>{f.body}</p>
            </Card>
          ))}
        </div>
      </Wrap>

      <VoiceBotSection />

      <FounderSpotlight />

      <Wrap className="hm-section">
        <div className="hm-why">
          <div className="hm-why__head">
            <SectionHeading title="Consultants who can actually build it"
              description="Most agencies hand you a strategy deck. Most dev shops wait for a spec. We sit in the middle: performance marketers who write the backend code, wire the tracking, and ship the AI that makes your spend work harder." />
          </div>
          <div className="hm-why__list">
            {[['Performance marketing, engineered', 'We run paid media like an engineering problem: clean server-side tracking, real attribution, tight testing loops. Every dollar gets measured against revenue, not clicks or impressions.'],
              ['AI consulting that ships', 'No slide-deck AI strategy. We find where AI actually moves your numbers (lead qualification, voice agents, content ops, reporting) then build and deploy it into your workflow.'],
              ['Software & backend expertise', 'APIs, data pipelines, CRM integrations, custom automations. When your marketing hits a technical wall, we don\'t file a ticket with someone else. We write the code ourselves.'],
              ['A partner, not a vendor', 'You work directly with the people doing the work. We learn your business, sit in on your numbers, and stay accountable to outcomes: strategy, execution, and the tech underneath it all.']].map(([k, v]) => (
              <Card key={k} className="hm-why__item ll-reveal">
                <h3>{k}</h3>
                <p>{v}</p>
              </Card>
            ))}
          </div>
        </div>
      </Wrap>

      <QuizTeaser onNavigate={onNavigate} />

      <FounderNote />

      <ReferencesTicker />
    </main>
  );
}

export default Home;
