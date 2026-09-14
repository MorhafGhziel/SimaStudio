'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { useMedia } from '@/lib/capabilities';

type Mode = 'none' | 'hover' | 'text' | 'view' | 'open' | 'explore' | 'drag';

/** Small dot + trailing ring; shows a label over tagged elements. Desktop mouse only. */
export function Cursor() {
  const { dict } = useLocale();
  const fine = useMedia('(hover: hover) and (pointer: fine)');
  const reduce = useReducedMotion();
  const enabled = fine && !reduce;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 500, damping: 42, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 500, damping: 42, mass: 0.4 });
  const [mode, setMode] = useState<Mode>('none');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      x.set(e.clientX);
      y.set(e.clientY);
      setVisible(true);
      const el = e.target instanceof Element ? e.target : null;
      const tagged = el?.closest<HTMLElement>('[data-cursor]');
      if (el?.closest('input, textarea, select')) setMode('text');
      else if (tagged) setMode(tagged.dataset.cursor as Mode);
      else if (el?.closest('a, button, [role="button"], label')) setMode('hover');
      else setMode('none');
    };
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move, { passive: true });
    root.addEventListener('pointerleave', leave);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      root.removeEventListener('pointerleave', leave);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;
  const label = mode === 'view' || mode === 'open' || mode === 'explore' || mode === 'drag' ? dict.cursor[mode] : '';
  const size = label ? 76 : mode === 'hover' ? 44 : 22;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100]">
      <motion.div className="absolute left-0 top-0" style={{ x, y }}>
        <motion.span
          className="absolute -left-[3px] -top-[3px] block size-1.5 rounded-full bg-paper"
          animate={{ opacity: visible && !label && mode !== 'text' ? 1 : 0 }}
          transition={{ duration: 0.15 }}
        />
      </motion.div>
      <motion.div className="absolute left-0 top-0" style={{ x: rx, y: ry }}>
        <motion.span
          className="absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border"
          animate={{
            width: size,
            height: size,
            opacity: visible && mode !== 'text' ? 1 : 0,
            backgroundColor: label ? 'rgba(210,188,152,1)' : 'rgba(241,238,232,0)',
            borderColor: label ? 'rgba(210,188,152,0)' : 'rgba(241,238,232,0.35)',
          }}
          transition={{ type: 'spring', stiffness: 360, damping: 30 }}
        >
          <AnimatePresence>
            {label && (
              <motion.span
                key={label}
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-ink rtl:text-xs rtl:normal-case rtl:tracking-normal"
              >
                {label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.span>
      </motion.div>
    </div>
  );
}
