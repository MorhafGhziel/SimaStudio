'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal } from '@/components/ui/Reveal';

function Word({ word, progress, range }: { word: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block pe-[0.25em]">
      {word}
    </motion.span>
  );
}

/** Statement that lights up word by word while the section is pinned. */
export function Value() {
  const { dict } = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const words = `${dict.value.line1} ${dict.value.line2}`.split(' ');
  const splitAt = dict.value.line1.split(' ').length;

  return (
    <section ref={ref} aria-labelledby="value-title" className="relative border-y border-line bg-ink-2 motion-safe:h-[220vh]">
      <div className="flex min-h-[100svh] flex-col justify-center py-24 motion-safe:sticky motion-safe:top-0">
        <div className="container-x">
          <h2 id="value-title" className="display-lg max-w-[18ch]">
            {reduce ? (
              <>
                <span className="block">{dict.value.line1}</span>
                <span className="block text-violet-soft">{dict.value.line2}</span>
              </>
            ) : (
              <>
                <span className="block">
                  {words.slice(0, splitAt).map((w, i) => (
                    <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length * 0.6, (i + 1) / words.length * 0.6]} />
                  ))}
                </span>
                <span className="block text-violet-soft">
                  {words.slice(splitAt).map((w, j) => {
                    const i = j + splitAt;
                    return <Word key={i} word={w} progress={scrollYProgress} range={[i / words.length * 0.6, (i + 1) / words.length * 0.6]} />;
                  })}
                </span>
              </>
            )}
          </h2>
          <div className="mt-14 grid gap-8 md:grid-cols-12 md:gap-10">
            <Reveal className="md:col-span-5 md:col-start-6">
              <p className="text-lg text-mute sm:text-xl">{dict.value.p1}</p>
            </Reveal>
            <Reveal delay={0.1} className="md:col-span-4">
              <p className="text-lg text-paper sm:text-xl">{dict.value.p2}</p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
