import React from 'react';
import Badge from '../components/feedback/Badge';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';
import { pathForPage } from '../lib/seo';
import { NICHE_QUIZZES } from '../lib/nicheQuizzes';

const Wrap = ({ children, style }) => (
  <div style={{ maxWidth: 'var(--container-max)', margin: '0 auto', padding: '0 24px', ...style }}>{children}</div>
);

// Add a new entry here whenever another quiz/funnel goes live — this page
// automatically lists whatever is in this array.
const QUIZZES = [
  {
    page: 'AIReceptionist',
    title: 'AI Receptionist Fit Check',
    time: '60 seconds',
    description: 'Answer a few questions about your call volume and find out whether an AI receptionist would pay for itself in your business — no call required to find out.',
  },
  {
    page: 'ReputationAutopilot',
    title: 'Reputation Autopilot Fit Check',
    time: '60 seconds',
    description: 'Answer a few questions about your review process and find out how many 5-star reviews you\'re likely missing every month — no call required to find out.',
  },
  ...NICHE_QUIZZES.map((q) => ({ page: q.page, title: q.label, time: '60 seconds', description: q.description })),
];

function Quizzes({ onNavigate }) {
  return (
    <main>
      <Wrap style={{ padding: '48px 24px 32px', borderBottom: '1px solid var(--border-hair)' }}>
        <Badge tone="accent">Free tools</Badge>
        <h1 style={{ margin: '14px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-3)', lineHeight: 'var(--lh-display-3)',
          letterSpacing: 'var(--ls-display-3)', maxWidth: '22ch' }}>
          Quick fit checks. No call required.
        </h1>
        <p style={{ maxWidth: 'var(--container-narrow)', margin: '14px 0 0', fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-400)' }}>
          A handful of questions, straight answers. Take any quiz below to see whether one of our
          systems fits your business — you'll get your result on the spot.
        </p>
      </Wrap>

      <Wrap style={{ padding: '32px 24px 64px' }}>
        <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}>
          {QUIZZES.map((q) => (
            <a key={q.page} href={pathForPage(q.page)}
              onClick={(e) => { e.preventDefault(); onNavigate(q.page); }}
              style={{ textDecoration: 'none', color: 'inherit', display: 'flex' }}>
              <Card emphasis="strong" padding={20} style={{ display: 'flex', flexDirection: 'column', gap: 14, justifyContent: 'space-between', width: '100%' }}>
                <div style={{ display: 'grid', gap: 6 }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
                    {q.time} · Free
                  </span>
                  <h2 style={{ margin: 0, fontSize: 'var(--fs-h3)', lineHeight: 'var(--lh-h3)', color: 'var(--ink-900)' }}>{q.title}</h2>
                  <p style={{ margin: 0, fontSize: 'var(--fs-body-sm)', lineHeight: 'var(--lh-body-sm)', color: 'var(--ink-500)' }}>{q.description}</p>
                </div>
                <Button variant="primary" size="sm" style={{ alignSelf: 'flex-start' }} iconRight={<span>→</span>}>Take the quiz</Button>
              </Card>
            </a>
          ))}
        </div>
      </Wrap>
    </main>
  );
}

export default Quizzes;
