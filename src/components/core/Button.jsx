import React from 'react';

const sizes = {
  sm: { padding: '9px 16px', fontSize: 14, chip: 22 },
  md: { padding: '11px 20px', fontSize: 15, chip: 26 },
  lg: { padding: '14px 26px', fontSize: 16, chip: 30 },
};

// Pill buttons with soft, tinted depth. A trailing icon sits in its own small
// circle (button-in-button) and nudges forward on hover.
function Button({
  children, variant = 'primary', size = 'md', disabled = false,
  fullWidth = false, iconRight, onClick, type = 'button', style, ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const s = sizes[size] || sizes.md;
  const { chip, ...pad } = s;
  const live = hover && !disabled;

  const base = {
    fontFamily: 'var(--font-body)',
    fontWeight: 600,
    letterSpacing: '-0.01em',
    lineHeight: 1.2,
    borderRadius: 'var(--radius-pill)',
    display: fullWidth ? 'flex' : 'inline-flex',
    width: fullWidth ? '100%' : undefined,
    alignItems: 'center', justifyContent: 'center', gap: 10,
    whiteSpace: 'nowrap',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transform: pressed && !disabled ? 'scale(0.98)' : 'none',
    transition: 'background var(--dur-base) var(--ease-standard), box-shadow var(--dur-base) var(--ease-standard), transform var(--dur-fast) var(--ease-standard), color var(--dur-fast) var(--ease-standard)',
    ...pad,
    ...(iconRight ? { paddingRight: 6 } : null),
  };

  const variants = {
    // Light pill: reads on both cream pages and dark forest panels.
    primary: {
      background: live ? '#FFFFFF' : 'linear-gradient(180deg, #FFFFFF 0%, var(--paper-000) 100%)',
      color: 'var(--ink-900)',
      border: '1px solid rgba(26, 38, 16, 0.1)',
      boxShadow: live
        ? 'inset 0 1px 0 #fff, 0 2px 4px rgba(26,38,16,0.08), 0 14px 28px -12px rgba(26,38,16,0.4)'
        : 'inset 0 1px 0 #fff, 0 1px 2px rgba(26,38,16,0.08), 0 8px 20px -10px rgba(26,38,16,0.32)',
    },
    secondary: {
      background: live ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.42)',
      color: 'var(--ink-900)',
      border: '1px solid rgba(26, 38, 16, 0.14)',
      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.7)',
      backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)',
    },
    ghost: {
      background: live ? 'rgba(26,38,16,0.06)' : 'transparent',
      color: 'var(--ink-900)',
      border: '1px solid transparent',
    },
    // Solid forest pill: the strongest call to action on light backgrounds.
    inverse: {
      background: live ? 'var(--ink-700)' : 'linear-gradient(180deg, var(--ink-600) 0%, var(--ink-900) 100%)',
      color: 'var(--paper-000)',
      border: '1px solid var(--ink-900)',
      boxShadow: live
        ? 'inset 0 1px 0 rgba(255,255,255,0.18), 0 16px 30px -12px rgba(26,38,16,0.55)'
        : 'inset 0 1px 0 rgba(255,255,255,0.14), 0 10px 24px -12px rgba(26,38,16,0.5)',
    },
  };

  const chipTone = variant === 'inverse'
    ? { background: 'rgba(245,242,235,0.14)', color: 'var(--paper-000)' }
    : { background: 'var(--ink-900)', color: 'var(--paper-000)' };

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
      {iconRight ? (
        <span aria-hidden="true" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: chip, height: chip, borderRadius: '50%', fontSize: '0.85em', flex: 'none', ...chipTone,
          transform: live ? 'translateX(2px)' : 'none', transition: 'transform var(--dur-base) var(--ease-standard)' }}>{iconRight}</span>
      ) : null}
    </button>
  );
}

export default Button;
