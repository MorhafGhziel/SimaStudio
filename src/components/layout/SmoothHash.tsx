'use client';

import { useEffect } from 'react';

/**
 * Smooth in-page navigation. The router sets `scroll-behavior: auto` inline on <html>
 * during navigation, which overrides any stylesheet rule, so same-page anchor clicks are
 * handled here instead: glide to the section, and respect reduced-motion preferences.
 */
export function SmoothHash() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const anchor = (event.target as HTMLElement | null)?.closest?.('a');
      const raw = anchor?.getAttribute('href');
      if (!anchor || !raw || anchor.target === '_blank') return;

      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash || url.hash === '#') return;

      const target = document.querySelector(url.hash);
      if (!target) return;

      event.preventDefault();
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      history.pushState(null, '', url.hash);
    };

    // Capture phase: the router handles anchor clicks first otherwise, and jumps.
    document.addEventListener('click', onClick, { capture: true });
    return () => document.removeEventListener('click', onClick, { capture: true });
  }, []);

  return null;
}
