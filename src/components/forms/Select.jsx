import React from 'react';

function Select({ label, options = [], value, onChange, hint, disabled, id, style }) {
  const [focus, setFocus] = React.useState(false);
  const selectId = id || React.useId();
  return (
    <div style={{ display: 'grid', gap: 6, ...style }}>
      {label ? <label htmlFor={selectId} className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>{label}</label> : null}
      <select id={selectId} value={value} onChange={onChange} disabled={disabled}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{ fontFamily: 'var(--font-body)', fontSize: 15, color: 'var(--ink-900)', appearance: 'none',
          background: 'var(--paper-000)', padding: '10px 34px 10px 12px', borderRadius: 'var(--radius-2)',
          border: '1px solid ' + (focus ? 'var(--ink-900)' : 'var(--border-hair)'),
          outline: focus ? '2px solid var(--cyan-500)' : 'none', outlineOffset: 2,
          backgroundImage: 'linear-gradient(45deg, transparent 50%, var(--ink-900) 50%), linear-gradient(135deg, var(--ink-900) 50%, transparent 50%)',
          backgroundPosition: 'calc(100% - 18px) 18px, calc(100% - 13px) 18px',
          backgroundSize: '5px 5px, 5px 5px', backgroundRepeat: 'no-repeat' }}>
        {options.map(o => typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
      {hint ? <span style={{ fontSize: 13, color: 'var(--ink-400)' }}>{hint}</span> : null}
    </div>
  );
}

export default Select;
