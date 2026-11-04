import React from 'react';

// Flat buttons. Primary / inverse: solid forest. Secondary: outlined. Ghost: text.
// Visuals live in globals.css (.ll-btn*) so every page shares one look.
function Button({
  children, variant = 'primary', size = 'md', disabled = false,
  fullWidth = false, iconRight, onClick, type = 'button', style, className, ...rest
}) {
  const cls = ['ll-btn', `ll-btn--${variant}`, `ll-btn--${size}`, fullWidth ? 'll-btn--full' : '', className]
    .filter(Boolean).join(' ');
  return (
    <button type={type} disabled={disabled} onClick={disabled ? undefined : onClick}
      className={cls} style={style} {...rest}>
      {children}
      {iconRight ? <span aria-hidden="true" className="ll-btn__arrow">{iconRight}</span> : null}
    </button>
  );
}

export default Button;
