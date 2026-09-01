import React from 'react';
import Badge from '../components/feedback/Badge';
import Button from '../components/core/Button';
import Callout from '../components/feedback/Callout';
import { openBooking } from '../lib/booking';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '72px 24px 96px', ...style }}>{children}</div>
);

const posts = [
  {
    badge: 'Platform',
    date: '08.2026',
    product: 'Loogo Labs Platform',
    author: 'David Selva',
    title: 'One platform. Every tool your business needs.',
    lede: 'The Loogo Labs platform is a fully loaded, all-in-one business operating system — CRM, email & SMS marketing, social media scheduling, AI content creation, course hosting, payment collection, and workflow automation, all under one roof.',
    body: 'Most businesses are paying $400–$500 a month for 10–15 disconnected tools that were never designed to work together. Every time you need to move a lead from your CRM to your email tool to your scheduler to your invoice system, something breaks. We fixed that. One login, one dashboard, one bill — and a team that sets everything up for you.',
    rows: [
      ['CRM & Pipelines', 'Track every lead and client through a fully customizable pipeline. Know exactly where every deal stands and what needs to happen next.'],
      ['Email & SMS', 'Send broadcast campaigns or trigger automated sequences based on contact behavior. Reach people on the channel that actually gets opened.'],
      ['AI Content (60+ prompts)', 'Generate social posts, email copy, ad creative, and more using 60+ built-in AI prompts trained for business marketing. No blank page, ever.'],
      ['Social Media Scheduler', 'Plan and schedule content across Facebook, Instagram, LinkedIn, Google Business, and more — all from one content calendar.'],
      ['Courses & Communities', 'Host paid courses, free training, and membership communities inside the platform. No Teachable, no Kajabi, no third-party integrations required.'],
      ['Payments & Invoicing', 'Send invoices, collect one-time payments, and set up subscriptions — all connected directly to your contacts and pipelines.'],
      ['Workflow Automation', 'Build multi-step automations that trigger on any action — a form fill, a tag, a payment, a missed call. Set it once and let it run.'],
    ],
    availability: 'Ready to see it in action? Book a free strategy call and we will walk you through the full platform, show you exactly what it replaces, and tell you what it would cost you to stay on your current stack for another year.',
  },
];

function LaunchPost({ onNavigate }) {
  const p = posts[0];
  return (
    <Wrap>
      <div style={{ display: 'grid', gridTemplateColumns: '200px minmax(0, var(--container-narrow))', gap: 48 }}>
        <aside style={{ display: 'grid', gap: 10, alignContent: 'start', fontFamily: 'var(--font-mono)', fontSize: 11,
          letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
          <span>Platform</span>
          <span>{p.product}</span>
          <span style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 10 }}>Written by<br /><span style={{ color: 'var(--ink-900)' }}>{p.author}</span></span>
          <span style={{ borderTop: '1px solid var(--border-hair)', paddingTop: 10 }}>Status<br /><span style={{ color: 'var(--status-ok)' }}>Live now</span></span>
        </aside>
        <article>
          <Badge tone="accent">{p.badge}</Badge>
          <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-3)', lineHeight: 'var(--lh-display-3)', letterSpacing: 'var(--ls-display-3)' }}>{p.title}</h1>
          <p style={{ fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)', marginTop: 18, maxWidth: '54ch' }}>{p.lede}</p>
          <p style={{ fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-600)', marginTop: 24, maxWidth: '60ch' }}>{p.body}</p>
          <h2 style={{ fontSize: 'var(--fs-h2)', letterSpacing: 'var(--ls-h2)', marginTop: 40 }}>What's included</h2>
          <div style={{ display: 'grid', gap: 0, marginTop: 16 }}>
            {p.rows.map(([k, v]) => (
              <div key={k} style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 16, padding: '14px 0', borderTop: '1px solid var(--border-hair)' }}>
                <span className="ll-eyebrow">{k}</span>
                <span style={{ fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-600)' }}>{v}</span>
              </div>
            ))}
          </div>
          <Callout tone="info" title="See it live" style={{ marginTop: 28 }}>{p.availability}</Callout>
          <div style={{ marginTop: 32 }}>
            <Button variant="primary" iconRight={<span>→</span>} onClick={openBooking}>Book a free strategy call</Button>
          </div>
        </article>
      </div>
    </Wrap>
  );
}

export default LaunchPost;
