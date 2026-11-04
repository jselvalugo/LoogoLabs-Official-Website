import React from 'react';

function SectionHeading({ eyebrow, title, description, level = 2, align = 'left', tone = 'paper', rule = false, style, className }) {
  const Tag = 'h' + level;
  const cls = ['ll-sh', align === 'center' ? 'll-sh--center' : '', tone === 'inverse' ? 'll-sh--inverse' : '', rule ? 'll-sh--rule' : '', className]
    .filter(Boolean).join(' ');
  return (
    <div className={cls} style={style}>
      {eyebrow ? <span className="ll-sh__eyebrow">{eyebrow}</span> : null}
      <Tag className="ll-sh__title">{title}</Tag>
      {description ? <p className="ll-sh__desc">{description}</p> : null}
    </div>
  );
}

export default SectionHeading;
