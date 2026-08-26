import React from 'react';

function Input({ label, hint, error, value, onChange, placeholder, type = 'text', mono = false, disabled, id, style, ...rest }) {
  const [focus, setFocus] = React.useState(false);
  const inputId = id || React.useId();
  return (
    <div style={{ display: 'grid', gap: 6, ...style }}>
      {label ? <label htmlFor={inputId} className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>{label}</label> : null}
      <input id={inputId} type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          fontFamily: mono ? 'var(--font-mono)' : 'var(--font-body)',
          fontSize: 15, lineHeight: 1.4, color: 'var(--ink-900)',
          background: disabled ? 'var(--paper-200)' : 'var(--paper-000)',
          padding: '10px 12px', borderRadius: 'var(--radius-2)',
          border: '1px solid ' + (error ? 'var(--status-danger)' : focus ? 'var(--ink-900)' : 'var(--border-hair)'),
          outline: focus ? '2px solid var(--cyan-500)' : 'none', outlineOffset: 2,
          transition: 'border-color var(--dur-fast) var(--ease-standard)',
        }} {...rest} />
      {error ? <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--status-danger)' }}>{error}</span>
        : hint ? <span style={{ fontSize: 13, color: 'var(--ink-400)' }}>{hint}</span> : null}
    </div>
  );
}

export default Input;
