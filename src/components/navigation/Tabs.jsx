import React from 'react';

function Tabs({ items = [], value, onChange, tone = 'paper', style }) {
  const inverse = tone === 'inverse';
  return (
    <div role="tablist" style={{ display: 'flex', gap: 0, borderBottom: '1px solid ' + (inverse ? 'var(--border-hair-inverse)' : 'var(--border-hair)'), ...style }}>
      {items.map(it => {
        const on = it === value;
        return (
          <button key={it} role="tab" aria-selected={on} onClick={() => onChange && onChange(it)}
            style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: '10px 16px',
              fontFamily: 'var(--font-mono)', fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase',
              color: on ? (inverse ? 'var(--paper-000)' : 'var(--ink-900)') : (inverse ? 'var(--ink-300)' : 'var(--ink-400)'),
              borderBottom: '2px solid ' + (on ? 'var(--cyan-500)' : 'transparent'), marginBottom: -1,
              transition: 'color var(--dur-fast) var(--ease-standard)' }}>{it}</button>
        );
      })}
    </div>
  );
}

export default Tabs;
