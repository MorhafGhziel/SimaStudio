'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { SimaMark } from '@/components/icons';
import { LinkButton } from '@/components/ui/Button';
import { useWebGL } from '@/lib/capabilities';
import { href } from '@/lib/i18n';

const HeroMark = dynamic(() => import('./HeroMark'), { ssr: false });
const EASE = [0.22, 1, 0.36, 1] as const;

export function Hero() {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const webgl = useWebGL();
  const section = useRef<HTMLElement>(null);

  // Cursor parallax: the mark drifts toward the pointer, the headline slightly away.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 60, damping: 18 });
  const sy = useSpring(py, { stiffness: 60, damping: 18 });
  const markX = useTransform(sx, (v) => v * 28);
  const markY = useTransform(sy, (v) => v * 20);
  const markRotate = useTransform(sx, (v) => v * 6);
  const textX = useTransform(sx, (v) => v * -8);

  // Scroll: mark sinks and scales down, content lifts away.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const markScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.82]);
  const markScrollY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '18%']);
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-12%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reduce ? 1 : 0]);

  useEffect(() => {
    if (reduce) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px.set((e.clientX / window.innerWidth) * 2 - 1);
      py.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [px, py, reduce]);

  const rise = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.1, ease: EASE, delay } });

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      {/* Soft light behind the mark */}
      <div aria-hidden="true" className="absolute inset-0 -z-20 bg-[radial-gradient(45%_50%_at_72%_42%,rgba(210,188,152,0.10),transparent_70%)] rtl:bg-[radial-gradient(45%_50%_at_28%_42%,rgba(210,188,152,0.10),transparent_70%)]" />
      <div aria-hidden="true" className="absolute inset-0 -z-10 opacity-[0.07] [background-image:linear-gradient(to_right,rgb(241_238_232/0.5)_1px,transparent_1px)] [background-size:calc(100%/12)_100%] [mask-image:linear-gradient(to_bottom,black,transparent_75%)]" />

      {/* Liquid-metal mark */}
      <motion.div
        aria-hidden="true"
        style={{ x: markX, y: markScrollY, scale: markScale }}
        className="pointer-events-none absolute end-[-16%] top-[3%] -z-10 aspect-square w-[82vw] sm:end-[-6%] sm:top-[6%] sm:w-[70vw] lg:end-[-2%] lg:top-[12%] lg:w-[44vw] lg:max-w-[52rem]"
      >
        <motion.div style={{ y: markY, rotate: markRotate }} className="relative size-full">
          <motion.div initial={reduce ? false : { opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.8, ease: EASE, delay: 0.2 }} className="size-full">
            {webgl ? (
              <HeroMark />
            ) : (
              <div className="grid size-full place-items-center">
                <SimaMark className="w-[62%] text-paper/10" />
              </div>
            )}
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div style={{ y: contentY, opacity: contentOpacity }} className="container-x flex flex-1 flex-col justify-end pb-14 pt-[calc(var(--nav)+3rem)] sm:pb-20 lg:justify-center lg:pb-10">
        <motion.p {...rise(0.3)} className="eyebrow">
          {dict.hero.kicker}
        </motion.p>
        <motion.h1 id="hero-title" style={{ x: textX }} className="display-xl mt-7 max-w-[18ch] !text-[clamp(2.6rem,0.9rem+4.6vw,6rem)] lg:mt-9 rtl:max-w-[16ch] rtl:!leading-[1.35]">
          {[dict.hero.line1, dict.hero.line2].map((line, i) => (
            <span key={line} className="block overflow-hidden pb-[0.06em] rtl:overflow-visible">
              <motion.span
                className={i === 1 ? 'block text-paper/55' : 'block'}
                initial={reduce ? false : { y: '105%' }}
                animate={{ y: '0%' }}
                transition={{ duration: 1.3, ease: EASE, delay: 0.4 + i * 0.12 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </motion.h1>
        <div className="mt-10 flex flex-col gap-8 lg:mt-12 lg:flex-row lg:items-end lg:justify-between">
          <motion.p {...rise(0.8)} className="max-w-[36ch] text-lg text-mute sm:text-xl">
            {dict.hero.text}
          </motion.p>
          <motion.div {...rise(0.95)} className="flex flex-wrap gap-3">
            <LinkButton href={`${href(locale)}#work`} arrow>
              {dict.hero.explore}
            </LinkButton>
            <LinkButton href={`${href(locale)}#contact`} variant="outline">
              {dict.hero.start}
            </LinkButton>
          </motion.div>
        </div>
      </motion.div>

      <motion.div {...rise(1.3)} aria-hidden="true" className="container-x hidden items-center gap-3 pb-8 text-xs text-faint lg:flex">
        <span className="relative h-8 w-px overflow-hidden bg-line">
          <motion.span className="absolute inset-x-0 top-0 h-3 bg-sand" animate={reduce ? undefined : { y: ['-100%', '280%'] }} transition={{ duration: 2.2, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }} />
        </span>
        {dict.hero.scroll}
      </motion.div>
    </section>
  );
}
