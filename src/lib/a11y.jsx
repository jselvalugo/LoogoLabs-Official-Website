import React from 'react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Modal focus management (WCAG 2.1.2, 2.4.3): while `active`, moves focus into
 * the container, keeps Tab / Shift+Tab inside it, and on close returns focus to
 * whatever opened it. Escape handling stays with each component.
 */
export function useFocusTrap(ref, active, alsoRef) {
  React.useEffect(() => {
    if (!active || typeof document === 'undefined') return undefined;
    const opener = document.activeElement;
    // alsoRef: a control outside the panel that belongs to the loop (e.g. the
    // nav burger that doubles as the menu's close button).
    const items = () => [...(alsoRef?.current ? [alsoRef.current] : []), ...Array.from(ref.current?.querySelectorAll(FOCUSABLE) || [])]
      .filter((el) => el.offsetParent !== null || el === document.activeElement);
    const inside = (el) => ref.current?.contains(el) || alsoRef?.current === el;
    const raf = requestAnimationFrame(() => {
      const el = ref.current;
      if (!el || el.contains(document.activeElement)) return;
      const first = Array.from(el.querySelectorAll(FOCUSABLE)).find((x) => x.offsetParent !== null);
      if (first) first.focus({ preventScroll: true });
      else { el.setAttribute('tabindex', '-1'); el.focus({ preventScroll: true }); }
    });
    const onKey = (e) => {
      if (e.key !== 'Tab' || !ref.current) return;
      const list = items();
      if (!list.length) { e.preventDefault(); return; }
      const first = list[0];
      const last = list[list.length - 1];
      if (e.shiftKey && (document.activeElement === first || !inside(document.activeElement))) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && (document.activeElement === last || !inside(document.activeElement))) { e.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) opener.focus({ preventScroll: true });
    };
  }, [active, ref, alsoRef]);
}

/**
 * "Skip to main content" link (WCAG 2.4.1). Rendered first on every page; it
 * targets the page's own <main>, whichever component renders it.
 */
export function SkipLink({ es }) {
  // Give the page's main region a stable target as soon as it is on screen
  // (the route can change, so re-check after every navigation).
  React.useEffect(() => {
    const tag = () => {
      const main = document.querySelector('main, [role="main"]');
      if (main && !main.id) main.id = 'main';
      if (main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    };
    tag();
    const mo = new MutationObserver(tag);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, []);
  const onClick = (e) => {
    const main = document.querySelector('main, [role="main"]');
    if (!main) return;
    e.preventDefault();
    if (!main.id) main.id = 'main';
    main.setAttribute('tabindex', '-1');
    main.focus({ preventScroll: true });
    main.scrollIntoView();
  };
  return (
    <a className="ll-skip" href="#main" onClick={onClick}>
      {es ? 'Saltar al contenido principal' : 'Skip to main content'}
    </a>
  );
}
