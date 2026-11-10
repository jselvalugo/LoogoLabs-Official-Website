import React from 'react';

// Native checkbox underneath the styled box, so it works with keyboard and
// screen readers; the visible box is decoration only.
function Checkbox({ label, checked = false, onChange, description, disabled, style }) {
  return (
    <label style={{ position: 'relative', display: 'flex', gap: 10, alignItems: 'flex-start', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input type="checkbox" className="ll-native-toggle" checked={checked} disabled={disabled}
        onChange={(e) => onChange && onChange(e.target.checked)} />
      <span className="ll-toggle-face" aria-hidden="true"
        style={{ width: 18, height: 18, flex: 'none', marginTop: 2, borderRadius: 'var(--radius-1)',
          border: '2px solid var(--ink-900)', background: checked ? 'var(--cyan-500)' : 'var(--paper-000)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'background var(--dur-fast) var(--ease-standard)' }}>
        {checked ? <svg width="12" height="12" viewBox="0 0 12 12"><path d="M1 6.5L4.2 9.5L11 2.5" stroke="var(--paper-000)" strokeWidth="2.2" fill="none" strokeLinecap="square"/></svg> : null}
      </span>
      <span>
        <span style={{ fontSize: 15, color: 'var(--ink-900)' }}>{label}</span>
        {description ? <span style={{ display: 'block', fontSize: 13, color: 'var(--ink-400)' }}>{description}</span> : null}
      </span>
    </label>
  );
}

export default Checkbox;
