import React from 'react';

// Native checkbox with role="switch" underneath the styled track, so it is
// reachable with Tab, toggles with Space and announces its on/off state.
function Switch({ label, checked = false, onChange, disabled, style, ariaLabel, id }) {
  return (
    <label style={{ position: 'relative', display: 'inline-flex', gap: 10, alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.45 : 1, ...style }}>
      <input type="checkbox" role="switch" className="ll-native-toggle" id={id} checked={checked} disabled={disabled}
        aria-label={label ? undefined : ariaLabel} onChange={(e) => onChange && onChange(e.target.checked)} />
      <span className="ll-toggle-face" aria-hidden="true"
        style={{ width: 40, height: 22, flex: 'none', borderRadius: 'var(--radius-1)', border: '2px solid var(--ink-900)',
          background: checked ? 'var(--cyan-500)' : 'var(--paper-200)', position: 'relative',
          transition: 'background var(--dur-fast) var(--ease-standard)' }}>
        <span style={{ position: 'absolute', top: 2, left: checked ? 20 : 2, width: 14, height: 14, background: checked ? 'var(--paper-000)' : 'var(--ink-900)',
          transition: 'left var(--dur-base) var(--ease-standard)' }} />
      </span>
      {label ? <span className="ll-eyebrow" style={{ color: 'var(--ink-900)' }}>{label}</span> : null}
    </label>
  );
}

export default Switch;
