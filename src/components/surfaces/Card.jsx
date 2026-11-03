import React from 'react';

// Flat card: hairline border, bone surface. `tone="inverse"` is solid forest.
// `emphasis` is accepted for compatibility and changes nothing.
function Card({ children, emphasis = 'default', tone = 'paper', padding = 28, style, className, ...rest }) {
  const cls = ['ll-card', tone !== 'paper' ? `ll-card--${tone}` : '', tone === 'inverse' ? 'll-on-dark' : '', className]
    .filter(Boolean).join(' ');
  return (
    <div className={cls} style={{ padding, ...style }} {...rest}>
      {children}
    </div>
  );
}

export default Card;
