import React from 'react';
import Badge from '../components/feedback/Badge';
import Card from '../components/surfaces/Card';
import Button from '../components/core/Button';
import { pathForPage } from '../lib/seo';

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
];

function Quizzes({ onNavigate }) {
  return (
    <main>
      <Wrap style={{ padding: '72px 24px 56px', borderBottom: '1px solid var(--border-hair)' }}>
        <Badge tone="accent">Free tools</Badge>
        <h1 style={{ margin: '18px 0 0', fontWeight: 700, fontSize: 'var(--fs-display-2)', lineHeight: 'var(--lh-display-2)',
          letterSpacing: 'var(--ls-display-2)', maxWidth: '22ch' }}>
          Quick fit checks. No call required.
        </h1>
        <p style={{ maxWidth: 'var(--container-narrow)', margin: '24px 0 0', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)', color: 'var(--ink-400)' }}>
          A handful of questions, straight answers. Take any quiz below to see whether one of our
          systems fits your business — you'll get your result on the spot.
        </p>
      </Wrap>

      <Wrap style={{ padding: '56px 24px 88px' }}>
        <div style={{ display: 'grid', gap: 20 }}>
          {QUIZZES.map((q) => (
            <a key={q.page} href={pathForPage(q.page)}
              onClick={(e) => { e.preventDefault(); onNavigate(q.page); }}
              style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
              <Card emphasis="strong" padding={28} style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'grid', gap: 8, maxWidth: '52ch' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-400)' }}>
                    {q.time} · Free
                  </span>
                  <h2 style={{ margin: 0, fontSize: 'var(--fs-h2)', lineHeight: 'var(--lh-h2)', color: 'var(--ink-900)' }}>{q.title}</h2>
                  <p style={{ margin: 0, fontSize: 'var(--fs-body)', lineHeight: 'var(--lh-body)', color: 'var(--ink-500)' }}>{q.description}</p>
                </div>
                <Button variant="primary" size="lg" iconRight={<span>→</span>}>Take the quiz</Button>
              </Card>
            </a>
          ))}
        </div>
      </Wrap>
    </main>
  );
}

export default Quizzes;
