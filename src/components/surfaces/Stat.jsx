import React from 'react';

function Stat({ label, value, unit, note, accent = false, align = 'left', style }) {
  return (
    <div style={{ display: 'grid', gap: 6, textAlign: align, ...style }}>
      <span className="ll-eyebrow">{label}</span>
      <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'var(--fs-display-3)',
        lineHeight: 'var(--lh-display-3)', letterSpacing: 'var(--ls-display-3)',
        color: accent ? 'var(--cyan-500)' : 'inherit' }}>
        {value}{unit ? <span style={{ fontSize: '0.45em', fontFamily: 'var(--font-mono)', letterSpacing: '0.04em', marginLeft: 4 }}>{unit}</span> : null}
      </span>
      {note ? <span style={{ fontSize: 13, color: 'var(--ink-400)' }}>{note}</span> : null}
    </div>
  );
}

export default Stat;
