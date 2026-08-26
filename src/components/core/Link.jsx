import React from 'react';

function Link({ children, href = '#', tone = 'default', arrow = false, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    default: { color: hover ? 'var(--ink-900)' : 'var(--cyan-700)', borderBottomColor: 'var(--cyan-500)' },
    inverse: { color: hover ? 'var(--paper-000)' : 'var(--cyan-500)', borderBottomColor: 'var(--cyan-600)' },
    quiet: { color: hover ? 'var(--ink-900)' : 'var(--ink-400)', borderBottomColor: 'transparent' },
  };
  return (
    <a href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: 'none', borderBottom: '1px solid', display: 'inline-flex', alignItems: 'center', gap: 6,
        fontWeight: 500, transition: 'color var(--dur-fast) var(--ease-standard)', ...tones[tone], ...style }}
      {...rest}>{children}{arrow ? <span aria-hidden="true">→</span> : null}</a>
  );
}

export default Link;
