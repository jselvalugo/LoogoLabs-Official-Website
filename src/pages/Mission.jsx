import React from 'react';
import Badge from '../components/feedback/Badge';
import SectionHeading from '../components/surfaces/SectionHeading';
import Stat from '../components/surfaces/Stat';
import Placeholder from '../components/website/Placeholder';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

function Mission({ onNavigate }) {
  return (
    <main>
      <Wrap style={{ padding: '72px 24px 56px', borderBottom: '1px solid var(--border-hair)' }}>
        <Badge tone="accent">Mission</Badge>
        <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '24ch' }}>
          We believe running a business should not require 15 different tools.
        </h1>
        <p style={{ maxWidth: 'var(--container-narrow)', margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>
          Most business owners are logging into 10–15 different platforms every single day just to
          run basic operations. We built a better way — and we handle every step of getting you
          set up, trained, and growing on it.
        </p>
      </Wrap>

      <Wrap style={{ padding: '64px 24px' }}>
        <div className="ll-2col" style={{ gap: 48 }}>
          <div>
            <SectionHeading eyebrow="What we believe" title="Software should make you more money, not cost more of it" rule={false} level={2} />
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)', marginTop: 20 }}>
              We got tired of watching good businesses overpay for disconnected tools that barely
              talk to each other. A CRM here. An email platform there. A course tool on top of
              that. A scheduling app. A social media scheduler. It adds up fast — and none of
              them work together.
            </p>
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)' }}>
              We brought it all under one roof and made sure the math works from day one. Most
              clients replace more than $400 a month in subscriptions the moment they switch.
            </p>
          </div>
          <div>
            <SectionHeading eyebrow="What we build toward" title="Your business, fully automated and fully owned" rule={false} level={2} />
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)', marginTop: 20 }}>
              The goal is never the software — it is the outcome. More leads followed up. More
              deals closed. More content published without burning hours. More time back in your
              week to work on the business instead of inside it.
            </p>
            <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)' }}>
              We are not done until your operations run themselves. And we stay close — with 24/7
              support included — until that is exactly what is happening.
            </p>
          </div>
        </div>
      </Wrap>

      <section className="ll-grid-bg--inverse" style={{ backgroundColor: 'var(--ink-900)', color: 'var(--paper-100)' }}>
        <Wrap style={{ padding: '64px 24px' }}>
          <div className="ll-stats-row" style={{ display: 'flex', gap: 0 }}>
            {[['Tools replaced', '10+', ''], ['Monthly savings', '$400+', ''], ['Support', '24/7', '']].map(([l, v, u], i) => (
              <div key={l} style={{ flex: 1, paddingLeft: i ? 24 : 0, borderLeft: i ? '1px solid var(--border-hair-inverse)' : 'none' }}>
                <Stat label={l} value={v} unit={u} />
              </div>
            ))}
          </div>
        </Wrap>
      </section>

      <Wrap style={{ padding: '64px 24px', borderBottom: '1px solid var(--border-hair)' }}>
        <SectionHeading eyebrow="How onboarding works" title="Five steps. Done for you every time."
          description="Every client goes through the same proven process. You never have to figure it out alone — we are with you from day one." />
        <div className="ll-grid-5" style={{ gap: 16, marginTop: 36 }}>
          {[
            ['01', 'Discovery', 'We learn your business — what tools you are currently paying for, what is costing you the most, and exactly what you need the platform to do first.'],
            ['02', 'Setup', 'We configure your account, build your pipelines, import your contacts, and connect your existing systems. Nothing is left for you to figure out alone.'],
            ['03', 'Automations', 'We build the workflows that matter most first — lead follow-up, appointment reminders, review requests, and anything else that should be running on autopilot.'],
            ['04', 'Training', 'We walk you and your team through the platform until everyone is confident. You get recordings, guides, and a direct line back to us anytime.'],
            ['05', 'Ongoing Support', '24/7 support is included — always. As your business grows, the platform grows with it, and we are here every step of the way to make sure it does.'],
          ].map(([n, t, d]) => (
            <Card key={n} padding={22} tone="inverse" style={{ display: 'grid', gap: 10, alignContent: 'start' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.12em', color: 'var(--cyan-500)' }}>{n}</div>
              <h3 style={{ margin: 0, fontSize: 'var(--fs-h3)', letterSpacing: 'var(--ls-h3)', color: 'var(--paper-100)' }}>{t}</h3>
              <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-300)' }}>{d}</p>
            </Card>
          ))}
        </div>
      </Wrap>

      <Wrap style={{ padding: '64px 24px 88px' }}>
        <SectionHeading eyebrow="The company" title="We stay close to every client" />
        <div className="ll-2col" style={{ gap: 24, marginTop: 36 }}>
          <Placeholder label="TEAM PHOTO — SUPPLY REAL ASSET" height={300} />
          <Card emphasis="strong" padding={28} style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
            <span className="ll-eyebrow">Working with us</span>
            <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)' }}>
              We keep our client list intentional. Not everyone is a fit — but if you are a local
              business, service provider, or online brand tired of the tool chaos, this
              conversation is worth 15 minutes. We will tell you exactly what the platform can do
              for your specific situation, no pitch deck required.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Button variant="primary" iconRight={<span>→</span>} onClick={() => onNavigate('Contact')}>Book a free strategy call</Button>
              <Button variant="secondary" onClick={() => onNavigate('Home')}>Back to home</Button>
            </div>
          </Card>
        </div>
      </Wrap>
    </main>
  );
}

export default Mission;
