import React from 'react';

function Placeholder({ label = 'IMAGE', height = 320, tone = 'paper', style }) {
  const inverse = tone === 'inverse';
  return (
    <div className={inverse ? 'll-grid-bg--inverse' : 'll-grid-bg'}
      style={{ height, backgroundColor: inverse ? 'var(--ink-800)' : 'var(--paper-200)',
        border: '1px solid ' + (inverse ? 'var(--border-hair-inverse)' : 'var(--border-hair)'),
        display: 'flex', alignItems: 'flex-end', padding: 14, ...style }}>
      <span className="ll-eyebrow" style={{ color: inverse ? 'var(--ink-400)' : 'var(--ink-300)' }}>{label}</span>
    </div>
  );
}

export default Placeholder;
