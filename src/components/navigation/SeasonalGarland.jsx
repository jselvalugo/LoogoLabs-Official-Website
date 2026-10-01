import React from 'react';

// October-only garland of autumn leaves, acorns and mini pumpkins hanging from
// the bottom of the nav bar. Decorative: hidden from assistive tech, ignores
// clicks, and sits in the hero's top padding so it never covers content.
// Rendered after hydration so the pre-rendered HTML doesn't depend on the
// month the site was built in.

const LEAF = 'M0 0 C7 3 11 11 9 18 C7 24 3 27 0 30 C-3 27 -7 24 -9 18 C-11 11 -7 3 0 0Z';

// left %, string length px, ornament, colour, sway delay s
const STRANDS = [
  [3, 26, 'leaf', '#C2622D', 0], [9, 44, 'acorn', '#8A5A2B', 0.6], [15, 18, 'leaf', '#D9962B', 1.1],
  [21, 36, 'pumpkin', '#D0742E', 0.3], [27, 22, 'leaf', '#8E3B22', 0.9], [33, 48, 'leaf', '#D9962B', 0.2],
  [39, 28, 'acorn', '#8A5A2B', 1.3], [45, 16, 'leaf', '#C2622D', 0.5], [51, 40, 'pumpkin', '#D0742E', 1],
  [57, 24, 'leaf', '#8E3B22', 0.1], [63, 46, 'leaf', '#C2622D', 0.8], [69, 20, 'acorn', '#8A5A2B', 1.4],
  [75, 34, 'leaf', '#D9962B', 0.4], [81, 50, 'pumpkin', '#D0742E', 1.2], [87, 26, 'leaf', '#8E3B22', 0.7],
  [93, 38, 'leaf', '#C2622D', 0],
];

function Ornament({ kind, color }) {
  if (kind === 'acorn') {
    return (
      <g>
        <ellipse cx="0" cy="14" rx="6" ry="8" fill={color} />
        <path d="M-8 7 Q0 0 8 7 Q0 10 -8 7Z" fill="#4A3218" />
        <line x1="0" y1="0" x2="0" y2="3" stroke="#4A3218" strokeWidth="1.5" />
      </g>
    );
  }
  if (kind === 'pumpkin') {
    return (
      <g>
        <ellipse cx="-5" cy="12" rx="6" ry="8" fill={color} />
        <ellipse cx="5" cy="12" rx="6" ry="8" fill={color} />
        <ellipse cx="0" cy="12" rx="5" ry="8.5" fill="#E08A3C" />
        <path d="M0 4 Q1 1 3 0" stroke="#415A27" strokeWidth="2" fill="none" strokeLinecap="round" />
      </g>
    );
  }
  return (
    <g>
      <path d={LEAF} fill={color} />
      <path d="M0 2 L0 26" stroke="rgba(26,38,16,0.35)" strokeWidth="1" />
    </g>
  );
}

function SeasonalGarland() {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => { setShow(new Date().getMonth() === 9); }, []);
  if (!show) return null;

  return (
    <div className="ll-garland" aria-hidden="true">
      {STRANDS.map(([left, rawLen, kind, color, delay], i) => {
        // Keep every strand inside the hero's top padding.
        const len = Math.round(rawLen / 2) + 4;
        return (
        <span key={i} className="ll-garland-strand"
          style={{ left: `${left}%`, animationDelay: `${delay}s` }}>
          <svg width="24" height={len + 34} viewBox={`-12 0 24 ${len + 34}`}>
            <line x1="0" y1="0" x2="0" y2={len} stroke="#5E7C3A" strokeWidth="1" strokeDasharray="2 2" />
            <g transform={`translate(0 ${len})`}><Ornament kind={kind} color={color} /></g>
          </svg>
        </span>
        );
      })}
    </div>
  );
}

export default SeasonalGarland;
