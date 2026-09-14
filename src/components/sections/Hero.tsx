'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { useWebGL } from '@/lib/capabilities';
import { href } from '@/lib/i18n';

const ArcScene = dynamic(() => import('@/components/three/hero/ArcScene'), { ssr: false });
const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline words rise out of a soft blur, line by line. */
function Headline({ lines, reduce }: { lines: string[]; reduce: boolean }) {
  let index = 0;
  return (
    <>
      {lines.map((line, li) => (
        <span key={line} className={li === 1 ? 'block text-[#a3a3b0]' : 'block'}>
          {line.split(' ').map((word, wi, words) => {
            const delay = 0.45 + li * 0.14 + index++ * 0.045;
            return (
              <span key={wi}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom rtl:overflow-visible">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? false : { y: '100%', opacity: 0, filter: 'blur(12px)' }}
                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1.25, ease: EASE, delay }}
                  >
                    {word}
                  </motion.span>
                </span>
                {wi < words.length - 1 && ' '}
              </span>
            );
          })}
        </span>
      ))}
    </>
  );
}

export function Hero() {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion() ?? false;
  const webgl = useWebGL();
  const section = useRef<HTMLElement>(null);
  const rtl = locale === 'ar';

  // Scroll: the content lifts away and dissolves while the horizon sinks (handled in the shader).
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const contentY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-30%']);
  const contentOpacity = useTransform(scrollYProgress, [0.05, 0.6], [1, reduce ? 1 : 0]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.2], [1, reduce ? 1 : 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0.35, 1], [1, reduce ? 1 : 0.3]);

  const fade = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, ease: EASE, delay } });

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* ── Backdrop: a glowing horizon of spectral light ─────── */}
      <motion.div aria-hidden="true" style={{ opacity: sceneOpacity }} className="absolute inset-0 -z-10">
        {webgl === true && <ArcScene mirror={rtl} reduced={reduce} />}
        {webgl === false && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/poster-desktop.jpg" alt="" className="absolute inset-0 size-full object-cover rtl:-scale-x-100 max-md:hidden" />
        )}
        {webgl === false && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/poster-mobile.jpg" alt="" className="absolute inset-0 size-full object-cover rtl:-scale-x-100 md:hidden" />
        )}
      </motion.div>
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[16%] bg-[linear-gradient(to_top,var(--color-ink),transparent)]" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute -inset-[20%] -z-10" />

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="container-x flex flex-1 flex-col pb-8 pt-[calc(var(--nav)+clamp(2.5rem,9vh,6.5rem))]">
        <motion.div style={{ y: contentY, opacity: contentOpacity }}>
          <motion.p {...fade(0.2)} className="eyebrow inline-flex items-center gap-3">
            <span aria-hidden="true" className="bg-spectrum h-px w-8" />
            {dict.hero.kicker}
          </motion.p>

          <h1 id="hero-title" className="display-xl mt-6 max-w-[17ch] !text-[clamp(2.7rem,0.6rem+5.2vw,7rem)] rtl:max-w-[16ch] rtl:!leading-[1.3]">
            <Headline lines={[dict.hero.line1, dict.hero.line2]} reduce={reduce} />
          </h1>

          <motion.p {...fade(1)} className="mt-7 max-w-[38ch] text-lg leading-relaxed text-[#a9a9b5] sm:text-xl">
            {dict.hero.text}
          </motion.p>

          <motion.div {...fade(1.15)} className="mt-9 flex flex-wrap gap-3">
            <LinkButton href={`${href(locale)}#work`} arrow>
              {dict.hero.explore}
            </LinkButton>
            <LinkButton href={`${href(locale)}#contact`} variant="outline" className="bg-ink/40 backdrop-blur-sm">
              {dict.hero.start}
            </LinkButton>
          </motion.div>
        </motion.div>

        <motion.div {...fade(1.5)} style={{ opacity: hintOpacity }} aria-hidden="true" className="mt-auto hidden items-center gap-3 pt-10 text-xs text-faint md:flex">
          <span className="relative h-10 w-px overflow-hidden bg-line">
            <motion.span className="absolute inset-x-0 top-0 h-4 bg-accent" animate={reduce ? undefined : { y: ['-100%', '260%'] }} transition={{ duration: 2.4, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }} />
          </span>
          {dict.hero.scroll}
        </motion.div>
      </div>
    </section>
  );
}
