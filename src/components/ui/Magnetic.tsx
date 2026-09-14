'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useSpring } from 'motion/react';
import { cn } from '@/lib/utils';

/** Gently pulls its child toward the cursor (mouse only). */
export function Magnetic({ children, strength = 0.25, className }: { children: ReactNode; strength?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const x = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 });
  const y = useSpring(0, { stiffness: 260, damping: 20, mass: 0.4 });

  return (
    <motion.span
      ref={ref}
      className={cn('inline-flex', className)}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (reduce || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
