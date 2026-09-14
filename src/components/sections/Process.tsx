'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { RevealLines } from '@/components/ui/Reveal';
import { processSteps } from '@/content/offer';

export function Process() {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 80%', 'end 60%'] });
  const fill = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);

  return (
    <section id="process" aria-labelledby="process-title" className="section-y border-t border-line">
      <div className="container-x">
        <RevealLines lines={[dict.process.title]} className="display-lg max-w-[14ch]" as="h2" />
        <span id="process-title" className="sr-only">
          {dict.process.title}
        </span>

        <div ref={ref} className="relative mt-16 sm:mt-24">
          {/* Timeline rail: vertical on mobile, horizontal on desktop */}
          <div aria-hidden="true" className="absolute bottom-0 start-[0.3rem] top-0 w-px bg-line md:inset-x-0 md:bottom-auto md:top-[0.3rem] md:h-px md:w-auto">
            <motion.div style={{ scaleY: fill }} className="absolute inset-0 origin-top bg-[linear-gradient(180deg,#3ec6ff,#6a6cff,#b05cff,#ff4fa8,#ff8a4c)] md:hidden" />
            <motion.div style={{ scaleX: fill }} className="bg-spectrum absolute inset-0 hidden origin-left md:block rtl:origin-right rtl:-scale-x-100" />
          </div>

          <ol className="grid gap-14 md:grid-cols-4 md:gap-8">
            {processSteps.map((step, i) => (
              <motion.li
                key={step.title.en}
                initial={reduce ? false : { opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '0px 0px -15% 0px' }}
                transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: i * 0.08 }}
                className="relative ps-10 md:ps-0 md:pt-12"
              >
                <span aria-hidden="true" className="absolute start-0 top-1.5 size-[0.65rem] rounded-full border border-accent bg-ink md:top-0" />
                <span className="text-[3.5rem] font-medium leading-none tracking-[-0.05em] text-paper/15" dir="ltr">
                  0{i + 1}
                </span>
                <h3 className="mt-4 text-2xl font-medium tracking-[-0.02em]">{step.title[locale]}</h3>
                <p className="mt-3 max-w-[28ch] text-mute">{step.text[locale]}</p>
              </motion.li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
