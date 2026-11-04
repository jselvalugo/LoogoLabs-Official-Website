import React from 'react';
import { interpolate } from 'flubber';
import { animate } from 'motion';
import { useReducedMotion } from 'motion/react';
import TILES from '../../lib/monogram-paths.json';

// The four tiles of the monogram, traced to paths in a 0–1000 box.
// Order: top-left, top-right, bottom-left, bottom-right.
export const MONOGRAM = TILES;

// Soft blob in the same box as a tile: a wobbly superellipse used as the
// "before" state of a morph.
export function blobPath(cx, cy, r, seed = 1, n = 24) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    const w = 1 + 0.12 * Math.sin(seed * 3.1 + a * 3) + 0.08 * Math.cos(seed * 1.7 + a * 5);
    pts.push([cx + Math.cos(a) * r * w, cy + Math.sin(a) * r * w]);
  }
  return 'M' + pts.map(p => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' L') + ' Z';
}

const TILE_CENTERS = [[240, 240], [760, 240], [240, 760], [760, 760]];

/*
  MorphTile renders one tile of the monogram that morphs between a blob and
  its real shape. `t` (0..1) is the amount of "built": 0 is the blob, 1 is the
  real tile. Holes fade in near 1. `fill` is the shape color, `bg` the hole
  color (the surface it sits on).
*/
export function MorphTile({ index, t = 1, fill = 'currentColor', bg = 'transparent', seed = 1, style, className }) {
  const tile = MONOGRAM[index];
  const [cx, cy] = TILE_CENTERS[index];
  const interp = React.useMemo(() => interpolate(blobPath(cx, cy, 200, seed + index), tile.outer, { maxSegmentLength: 6 }), [tile, cx, cy, seed, index]);
  const d = interp(Math.max(0, Math.min(1, t)));
  const holeOpacity = Math.max(0, (t - 0.8) / 0.2);
  return (
    <g className={className} style={style}>
      <path d={d} fill={fill} />
      {tile.holes.map((h, i) => <path key={i} d={h} fill={bg} opacity={holeOpacity} />)}
    </g>
  );
}

/*
  Monogram that assembles: four blobs scattered around the canvas travel and
  morph into the mark, then breathe. Tilts toward the cursor. Renders the
  finished mark statically on the server and under reduced motion.
*/
export function LivingMonogram({ fill = 'var(--paper-000)', bg = 'var(--ink-900)', delay = 0.3, className, style }) {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = React.useState(false);
  const [t, setT] = React.useState(1);
  const [phase, setPhase] = React.useState(0); // 0..1 idle breathing phase
  const gRef = React.useRef(null);
  const wrapRef = React.useRef(null);

  React.useEffect(() => { setMounted(true); }, []);

  // Assemble, then breathe.
  React.useEffect(() => {
    if (!mounted || reduce) return undefined;
    setT(0);
    const ctrl = animate(0, 1, { duration: 1.8, delay, ease: [0.32, 0.72, 0, 1], onUpdate: v => setT(v) });
    let raf; let start;
    const breathe = (now) => {
      if (!start) start = now;
      setPhase(((now - start) / 6000) % 1);
      raf = requestAnimationFrame(breathe);
    };
    const timer = setTimeout(() => { raf = requestAnimationFrame(breathe); }, (delay + 1.8) * 1000);
    return () => { ctrl.stop(); clearTimeout(timer); cancelAnimationFrame(raf); };
  }, [mounted, reduce, delay]);

  // Cursor tilt on the whole mark.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el || !mounted || reduce || window.matchMedia('(hover: none)').matches) return undefined;
    const g = gRef.current;
    const move = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      g.style.transform = `perspective(900px) rotateX(${(-y * 12).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg)`;
    };
    const leave = () => { g.style.transform = ''; };
    el.addEventListener('mousemove', move); el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, [mounted, reduce]);

  // Each tile starts from a scattered spot and travels home; while idle each
  // tile breathes a little out of phase.
  const scatter = [[-320, -140], [340, -200], [-260, 300], [300, 260]];
  const ease = (v) => 1 - Math.pow(1 - v, 3);
  return (
    <div ref={wrapRef} className={className} style={{ position: 'relative', aspectRatio: '1', ...style }}>
      <svg viewBox="0 0 1000 1000" width="100%" height="100%" style={{ overflow: 'visible', display: 'block' }} aria-hidden="true">
        <g ref={gRef} style={{ transformOrigin: '500px 500px', transition: 'transform 320ms cubic-bezier(0.32,0.72,0,1)' }}>
          {[0, 1, 2, 3].map(i => {
            const e = ease(t);
            const idle = t >= 1 ? 0.5 + 0.5 * Math.sin((phase + i * 0.25) * Math.PI * 2) : 0;
            const tt = t >= 1 ? 1 - idle * 0.06 : t;
            const dx = (1 - e) * scatter[i][0];
            const dy = (1 - e) * scatter[i][1];
            const rot = (1 - e) * (i % 2 ? 40 : -40);
            return (
              <MorphTile key={i} index={i} t={tt} fill={fill} bg={bg} seed={i + 1}
                style={{ transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, transformOrigin: `${TILE_CENTERS[i][0]}px ${TILE_CENTERS[i][1]}px`, transformBox: 'view-box' }} />
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/*
  One tile that morphs to a given index, dashed outline when "planned",
  solid when "built". Used in the services scene: service i ↔ tile i.
*/
export function ServiceGlyph({ index = 0, built = 1, fill = 'var(--amber-500)', stroke = 'var(--ink-900)', size = 220 }) {
  const reduce = useReducedMotion();
  const [d, setD] = React.useState(MONOGRAM[index].outer);
  const prev = React.useRef(index);
  React.useEffect(() => {
    if (reduce) { setD(MONOGRAM[index].outer); prev.current = index; return undefined; }
    const from = MONOGRAM[prev.current].outer; const to = MONOGRAM[index].outer;
    prev.current = index;
    if (from === to) return undefined;
    const interp = interpolate(from, to, { maxSegmentLength: 6 });
    const ctrl = animate(0, 1, { duration: 0.9, ease: [0.32, 0.72, 0, 1], onUpdate: v => setD(interp(v)) });
    return () => ctrl.stop();
  }, [index, reduce]);
  const [cx, cy] = TILE_CENTERS[index];
  const b = Math.max(0, Math.min(1, built));
  return (
    <svg viewBox={`${cx - 300} ${cy - 300} 600 600`} width={size} height={size} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <path d={d} fill={fill} fillOpacity={b} stroke={stroke} strokeWidth={6} strokeDasharray={b < 1 ? '18 14' : '0'} strokeOpacity={1 - b * 0.7} vectorEffect="non-scaling-stroke"
        style={{ transition: 'fill-opacity 400ms ease, stroke-opacity 400ms ease' }} />
    </svg>
  );
}

/* A large, slowly morphing silhouette for section backgrounds. */
export function AmbientShape({ index = 0, fill = 'rgba(243,240,231,0.06)', style, className }) {
  const reduce = useReducedMotion();
  const [t, setT] = React.useState(1);
  React.useEffect(() => {
    if (reduce) return undefined;
    let raf; let start;
    const loop = (now) => { if (!start) start = now; setT(0.55 + 0.45 * (0.5 + 0.5 * Math.sin((now - start) / 7000 * Math.PI * 2))); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);
  const [cx, cy] = TILE_CENTERS[index];
  return (
    <svg viewBox={`${cx - 280} ${cy - 280} 560 560`} className={className} style={style} aria-hidden="true">
      <MorphTile index={index} t={t} fill={fill} bg="transparent" seed={index + 7} />
    </svg>
  );
}
