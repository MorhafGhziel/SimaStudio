'use client';

import dynamic from 'next/dynamic';
import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { useWebGL } from '@/lib/capabilities';
import { href } from '@/lib/i18n';

const HeroScene = dynamic(() => import('@/components/three/hero/HeroScene'), { ssr: false });
const EASE = [0.22, 1, 0.36, 1] as const;

/** Headline words rise out of a soft blur, line by line. */
function Headline({ lines, reduce }: { lines: string[]; reduce: boolean }) {
  let index = 0;
  return (
    <>
      {lines.map((line, li) => (
        <span key={line} className={li === 1 ? 'block text-[#98948d]' : 'block'}>
          {line.split(' ').map((word, wi, words) => {
            const delay = 0.55 + li * 0.14 + index++ * 0.045;
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

  // Scroll: type drifts up at two speeds and dissolves; the scene handles its own camera move.
  const { scrollYProgress } = useScroll({ target: section, offset: ['start start', 'end start'] });
  const metaOpacity = useTransform(scrollYProgress, [0, 0.35], [1, reduce ? 1 : 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-35%']);
  const actionsY = useTransform(scrollYProgress, [0, 1], ['0%', reduce ? '0%' : '-60%']);
  const contentOpacity = useTransform(scrollYProgress, [0.1, 0.65], [1, reduce ? 1 : 0]);
  const sceneOpacity = useTransform(scrollYProgress, [0.3, 1], [1, reduce ? 1 : 0.25]);

  const fade = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, ease: EASE, delay } });

  return (
    <section ref={section} aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[linear-gradient(180deg,#07122e_0%,#060d24_40%,#050914_75%,#0a0a09_100%)]">
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <motion.div aria-hidden="true" style={{ opacity: sceneOpacity }} className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_70%_30%,rgba(64,112,255,0.18),transparent_70%)] rtl:bg-[radial-gradient(60%_55%_at_30%_30%,rgba(64,112,255,0.18),transparent_70%)]" />
        {webgl === true && <HeroScene mirror={rtl} reduced={reduce} />}
        {webgl === false && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/poster-desktop.jpg" alt="" className="absolute inset-0 size-full object-cover rtl:-scale-x-100 max-md:hidden" />
        )}
        {webgl === false && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/poster-mobile.jpg" alt="" className="absolute inset-0 size-full object-cover rtl:-scale-x-100 md:hidden" />
        )}
      </motion.div>
      {/* Readability: darken where the type sits, vignette the edges, film grain on top. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_top,var(--color-ink)_0%,rgba(10,10,9,0.5)_16%,transparent_42%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(130%_95%_at_50%_45%,transparent_60%,rgba(4,8,22,0.6)_100%)]" />
      {/* Soft shadow pooled behind the headline so the light can pass behind the type without fighting it. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(48%_38%_at_24%_74%,rgba(4,8,22,0.62),transparent_75%)] max-md:bg-[radial-gradient(90%_40%_at_30%_68%,rgba(4,8,22,0.6),transparent_75%)] rtl:bg-[radial-gradient(48%_38%_at_76%_74%,rgba(4,8,22,0.62),transparent_75%)] rtl:max-md:bg-[radial-gradient(90%_40%_at_70%_68%,rgba(4,8,22,0.6),transparent_75%)]" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute -inset-[20%] -z-10" />

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="container-x flex flex-1 flex-col pb-10 pt-[calc(var(--nav)+1.75rem)] sm:pb-14 lg:pb-12">
        <motion.div style={{ opacity: metaOpacity }} className="flex items-start justify-between gap-10">
          <motion.p {...fade(0.2)} className="eyebrow">
            {dict.hero.kicker}
          </motion.p>
          <motion.p {...fade(0.35)} className="hidden max-w-[32ch] text-end text-[0.95rem] leading-relaxed text-[#a4a09a] md:block">
            {dict.hero.text}
          </motion.p>
        </motion.div>

        <motion.div style={{ opacity: contentOpacity }} className="mt-auto pt-[38vh] sm:pt-[30vh] lg:pt-24">
          <motion.h1 id="hero-title" style={{ y: titleY }} className="display-xl max-w-[19ch] !text-[clamp(2.7rem,0.6rem+5.3vw,7.25rem)] rtl:max-w-[17ch] rtl:!leading-[1.35]">
            <Headline lines={[dict.hero.line1, dict.hero.line2]} reduce={reduce} />
          </motion.h1>

          <motion.div style={{ y: actionsY }} className="mt-8 flex flex-col gap-7 sm:mt-10 md:flex-row md:items-end md:justify-between">
            <motion.p {...fade(1.05)} className="max-w-[36ch] text-lg leading-relaxed text-[#a4a09a] md:hidden">
              {dict.hero.text}
            </motion.p>
            <motion.div {...fade(1.15)} className="flex flex-wrap gap-3">
              <LinkButton href={`${href(locale)}#work`} arrow>
                {dict.hero.explore}
              </LinkButton>
              <LinkButton href={`${href(locale)}#contact`} variant="outline" className="bg-ink/30 backdrop-blur-sm">
                {dict.hero.start}
              </LinkButton>
            </motion.div>
            <motion.div {...fade(1.5)} aria-hidden="true" className="hidden items-center gap-3 text-xs text-faint md:flex">
              {dict.hero.scroll}
              <span className="relative h-10 w-px overflow-hidden bg-line">
                <motion.span className="absolute inset-x-0 top-0 h-4 bg-sand" animate={reduce ? undefined : { y: ['-100%', '260%'] }} transition={{ duration: 2.4, repeat: Infinity, ease: [0.65, 0, 0.35, 1] }} />
              </span>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
