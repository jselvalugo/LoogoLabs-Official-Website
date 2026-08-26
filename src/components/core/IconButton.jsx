import React from 'react';

function IconButton({ children, label, size = 'md', variant = 'ghost', onClick, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const box = size === 'sm' ? 28 : size === 'lg' ? 44 : 36;
  const variants = {
    ghost: { background: hover ? 'var(--paper-200)' : 'transparent', border: '1px solid transparent', color: 'var(--ink-900)' },
    outline: { background: hover ? 'var(--paper-200)' : 'var(--paper-000)', border: '1px solid var(--border-hair)', color: 'var(--ink-900)' },
    inverse: { background: hover ? 'var(--ink-700)' : 'transparent', border: '1px solid var(--border-hair-inverse)', color: 'var(--paper-100)' },
  };
  return (
    <button aria-label={label} title={label} onClick={onClick}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ width: box, height: box, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        borderRadius: 'var(--radius-2)', cursor: 'pointer', padding: 0,
        transition: 'background var(--dur-fast) var(--ease-standard)', ...variants[variant], ...style }}
      {...rest}>{children}</button>
  );
}

export default IconButton;
