import React from 'react';
import { motion, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue } from 'motion/react';

export const EASE = [0.32, 0.72, 0, 1];

// On the server there is no window; render children as plain blocks so the
// pre-rendered HTML is complete and crawlable. Motion attaches on hydration.
const isServer = typeof window === 'undefined';

// First client render must match the server HTML (plain elements), so motion
// variants only switch on after mount. Avoids hydration mismatches.
export function useMounted() {
  const [m, setM] = React.useState(false);
  React.useEffect(() => { setM(true); }, []);
  return m;
}

/* Pace: a page can wrap itself in <MotionPace pace={0.7}> to run its reveals a
   little quicker (durations, delays and travel are scaled; the effects stay the
   same). Default 1 leaves every other page exactly as it was. */
const PaceContext = React.createContext({ pace: 1, amount: null });
export function MotionPace({ pace = 1, amount = null, children }) {
  const value = React.useMemo(() => ({ pace, amount }), [pace, amount]);
  return <PaceContext.Provider value={value}>{children}</PaceContext.Provider>;
}
export const usePace = () => React.useContext(PaceContext);

/* Reveal a block once as it scrolls into view. */
export function Reveal({ children, delay = 0, y = 28, className, style, as = 'div', amount = 0.25, ...rest }) {
  const reduce = useReducedMotion(); const mounted = useMounted();
  const { pace, amount: paceAmount } = usePace();
  delay *= pace; y *= pace; if (paceAmount != null) amount = paceAmount;
  const Tag = motion[as] || motion.div;
  if (!mounted || reduce) { const Plain = as; return <Plain className={className} style={style} {...rest}>{children}</Plain>; }
  return (
    <Tag className={className} style={style}
      initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount }}
      transition={{ duration: 0.7 * pace, ease: EASE, delay }} {...rest}>
      {children}
    </Tag>
  );
}

/* Stagger a list of children. Wrap each child in <Item>. */
export function Stagger({ children, className, style, gap = 0.08, delay = 0, amount = 0.2, as = 'div', ...rest }) {
  const reduce = useReducedMotion(); const mounted = useMounted();
  const { pace, amount: paceAmount } = usePace();
  gap *= pace; delay *= pace; if (paceAmount != null) amount = paceAmount;
  const Tag = motion[as] || motion.div;
  if (!mounted || reduce) { const Plain = as; return <Plain className={className} style={style} {...rest}>{children}</Plain>; }
  return (
    <Tag className={className} style={style} {...rest} initial="hidden" whileInView="show" viewport={{ once: true, amount }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap, delayChildren: delay } } }}>
      {children}
    </Tag>
  );
}
export function Item({ children, className, style, y = 24, as = 'div' }) {
  const reduce = useReducedMotion(); const mounted = useMounted();
  const { pace } = usePace(); y *= pace;
  const Tag = motion[as] || motion.div;
  if (!mounted || reduce) { const Plain = as; return <Plain className={className} style={style}>{children}</Plain>; }
  return (
    <Tag className={className} style={style} variants={{ hidden: { opacity: 0, y }, show: { opacity: 1, y: 0, transition: { duration: 0.6 * pace, ease: EASE } } }}>
      {children}
    </Tag>
  );
}

/* Headline whose words rise in one after another. */
export function Words({ text, className, as = 'span', delay = 0, step = 0.05 }) {
  const reduce = useReducedMotion(); const mounted = useMounted();
  const { pace } = usePace(); delay *= pace; step *= pace;
  const words = String(text).split(' ');
  const Tag = as;
  if (!mounted || reduce) return <Tag className={className}>{text}</Tag>;
  return (
    <Tag className={className}>
      <span className="ll-sr-only">{text}</span>
      {words.map((w, i) => (
        <React.Fragment key={i}>
          <span style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'bottom', paddingBottom: '0.08em', marginBottom: '-0.08em' }} aria-hidden="true">
            <motion.span style={{ display: 'inline-block' }} initial={{ y: '110%' }} animate={{ y: 0 }}
              transition={{ duration: 0.8 * pace, ease: EASE, delay: delay + i * step }}>{w}</motion.span>
          </span>
          {i < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/* Vertical parallax tied to the element's own scroll position. */
export function Parallax({ children, range = 60, className, style }) {
  const reduce = useReducedMotion(); const mounted = useMounted();
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);
  if (!mounted || reduce) return <div ref={ref} className={className} style={style}>{children}</div>;
  return <motion.div ref={ref} className={className} style={{ ...style, y }}>{children}</motion.div>;
}

/* A wrapper that leans toward the cursor; used for buttons and the monogram. */
export function Magnetic({ children, strength = 0.25, className, style }) {
  const reduce = useReducedMotion(); const mounted = useMounted();
  const ref = React.useRef(null);
  const x = useMotionValue(0); const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 300, damping: 20, mass: 0.4 });
  if (!mounted || reduce) return <div className={className} style={{ display: 'inline-block', ...style }}>{children}</div>;
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };
  return (
    <motion.div ref={ref} className={className} style={{ display: 'inline-block', ...style, x: sx, y: sy }}
      onMouseMove={move} onMouseLeave={leave}>{children}</motion.div>
  );
}

/* Count up to a number once visible. Keeps prefix/suffix text. */
export function Counter({ value, duration = 1.2, className }) {
  const reduce = useReducedMotion();
  const ref = React.useRef(null);
  const [shown, setShown] = React.useState(isServer || reduce ? value : null);
  React.useEffect(() => {
    if (isServer || reduce) return undefined;
    const m = String(value).match(/^([^0-9]*)([0-9][0-9,.]*)(.*)$/);
    if (!m) { setShown(value); return undefined; }
    const [, pre, num, post] = m;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = (num.split('.')[1] || '').length;
    let raf; let start;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const tick = (t) => {
        if (!start) start = t;
        const p = Math.min(1, (t - start) / (duration * 1000));
        const eased = 1 - Math.pow(1 - p, 3);
        const n = target * eased;
        setShown(pre + n.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + post);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    if (ref.current) io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration, reduce]);
  return <span ref={ref} className={className}>{shown ?? value}</span>;
}

export { motion, useReducedMotion, useScroll, useTransform, useSpring, useMotionValue };
