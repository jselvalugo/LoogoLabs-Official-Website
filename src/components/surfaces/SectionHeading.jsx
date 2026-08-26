import React from 'react';

function SectionHeading({ eyebrow, title, description, level = 2, align = 'left', tone = 'paper', rule = false, style }) {
  const Tag = 'h' + level;
  const inverse = tone === 'inverse';
  return (
    <div style={{ display: 'grid', gap: 12, textAlign: align, borderTop: rule ? '1px solid ' + (inverse ? 'var(--border-hair-inverse)' : 'var(--border-hair)') : 'none',
      paddingTop: rule ? 20 : 0, ...style }}>
      {eyebrow ? <span className="ll-eyebrow" style={{ color: inverse ? 'var(--ink-300)' : 'var(--ink-400)' }}>{eyebrow}</span> : null}
      <Tag style={{ margin: 0, fontWeight: 700, fontSize: 'var(--fs-h1)', lineHeight: 'var(--lh-h1)',
        letterSpacing: 'var(--ls-h1)', color: inverse ? 'var(--paper-100)' : 'var(--ink-900)', maxWidth: '22ch' }}>{title}</Tag>
      {description ? <p style={{ margin: 0, maxWidth: '58ch', fontSize: 'var(--fs-body-lg)', lineHeight: 'var(--lh-body-lg)',
        color: inverse ? 'var(--ink-300)' : 'var(--ink-400)', marginLeft: align === 'center' ? 'auto' : 0, marginRight: align === 'center' ? 'auto' : 0 }}>{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
