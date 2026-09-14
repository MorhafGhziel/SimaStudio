'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'motion/react';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Fades content up once when it scrolls into view. */
export function Reveal({ children, className, delay = 0, y = 24 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

const line: Variants = {
  hidden: { y: '105%' },
  show: (delay: number) => ({ y: '0%', transition: { duration: 1.1, ease: EASE, delay } }),
};

const tags = { h1: motion.h1, h2: motion.h2, h3: motion.h3, p: motion.p };

/**
 * Headline that rises line by line. The heading itself is observed — the masked
 * lines sit inside overflow-hidden wrappers, which would never report as visible.
 */
export function RevealLines({ lines, className, lineClassName, delay = 0, as = 'h2' }: { lines: string[]; className?: string; lineClassName?: string; delay?: number; as?: keyof typeof tags }) {
  const reduce = useReducedMotion();
  const Tag = tags[as];
  return (
    <Tag className={className} initial={reduce ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '0px 0px -8% 0px' }}>
      {lines.map((text, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em] rtl:overflow-visible">
          <motion.span className={`block ${lineClassName ?? ''}`} variants={line} custom={delay + i * 0.1}>
            {text}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}
