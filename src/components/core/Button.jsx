import React from 'react';

const sizes = {
  sm: { padding: '7px 12px', fontSize: 13 },
  md: { padding: '10px 16px', fontSize: 14 },
  lg: { padding: '14px 22px', fontSize: 16 },
};

function Button({
  children, variant = 'primary', size = 'md', disabled = false,
  fullWidth = false, iconRight, onClick, type = 'button', style, ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const s = sizes[size] || sizes.md;

  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    letterSpacing: '-0.005em',
    lineHeight: 1.2,
    borderRadius: 'var(--radius-2)',
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: 8,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.4 : 1,
    transition: 'background var(--dur-fast) var(--ease-standard), box-shadow var(--dur-fast) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)',
    ...s,
  };

  const variants = {
    primary: {
      background: hover && !disabled ? 'var(--cyan-100)' : 'var(--cyan-500)',
      color: 'var(--ink-900)',
      border: '2px solid var(--ink-900)',
      boxShadow: pressed ? 'none' : 'var(--shadow-hard-sm)',
      transform: pressed ? 'translate(2px, 2px)' : 'none',
    },
    secondary: {
      background: hover && !disabled ? 'var(--paper-200)' : 'var(--paper-000)',
      color: 'var(--ink-900)',
      border: '2px solid var(--ink-900)',
      boxShadow: pressed ? 'none' : 'var(--shadow-hard-sm)',
      transform: pressed ? 'translate(2px, 2px)' : 'none',
    },
    ghost: {
      background: hover && !disabled ? 'var(--paper-200)' : 'transparent',
      color: 'var(--ink-900)',
      border: '1px solid var(--border-hair)',
    },
    inverse: {
      background: hover && !disabled ? 'var(--ink-700)' : 'var(--ink-900)',
      color: 'var(--paper-100)',
      border: '2px solid var(--ink-900)',
      boxShadow: pressed ? 'none' : '2px 2px 0 var(--cyan-500)',
      transform: pressed ? 'translate(2px, 2px)' : 'none',
    },
  };

  return (
    <button
      type={type} disabled={disabled} onClick={disabled ? undefined : onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPressed(false); }}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      style={{ ...base, ...variants[variant], ...style }}
      {...rest}
    >
      {children}
      {iconRight ? <span style={{ display: 'inline-flex' }}>{iconRight}</span> : null}
    </button>
  );
}

export default Button;
