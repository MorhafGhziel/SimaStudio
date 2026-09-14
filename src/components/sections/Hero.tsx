'use client';

import dynamic from 'next/dynamic';
import { motion, useReducedMotion } from 'motion/react';
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
        <span key={line} className={li === 1 ? 'block text-[#b3b3bf]' : 'block'}>
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
  const rtl = locale === 'ar';

  const fade = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1.2, ease: EASE, delay } });

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-ink">
      {/* ── Backdrop: a vast horizon of spectral light (hero only) ── */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        {webgl === true && <ArcScene mirror={rtl} reduced={reduce} />}
        {webgl === false && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/poster-desktop.jpg" alt="" className="absolute inset-0 size-full object-cover rtl:-scale-x-100 max-md:hidden" />
        )}
        {webgl === false && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src="/hero/poster-mobile.jpg" alt="" className="absolute inset-0 size-full object-cover rtl:-scale-x-100 md:hidden" />
        )}
      </div>
      {/* Soft dark pool behind the centred copy so the light never fights the text. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(42%_40%_at_50%_42%,rgba(5,5,7,0.8),rgba(5,5,7,0.45)_55%,transparent_82%)] max-md:bg-[radial-gradient(85%_42%_at_50%_40%,rgba(5,5,7,0.78),rgba(5,5,7,0.4)_60%,transparent_85%)] md:rtl:bg-[radial-gradient(46%_46%_at_50%_48%,rgba(5,5,7,0.85),rgba(5,5,7,0.5)_55%,transparent_82%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[8%] bg-[linear-gradient(to_top,var(--color-ink),transparent)]" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute -inset-[20%] -z-10" />

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="container-x flex flex-1 flex-col items-center pb-16 pt-[calc(var(--nav)+clamp(2rem,8vh,6rem))] text-center">
        <motion.p {...fade(0.2)} className="inline-flex items-center gap-2.5 rounded-pill border border-line bg-ink/50 px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-[#c3c3c6] backdrop-blur-sm rtl:text-xs rtl:normal-case rtl:tracking-normal">
          <span aria-hidden="true" className="bg-spectrum size-1.5 rounded-full" />
          {dict.hero.kicker}
        </motion.p>

        <h1 id="hero-title" className="display-xl mt-7 max-w-[16ch] !text-[clamp(2.6rem,0.6rem+5vw,6.75rem)] rtl:max-w-[22ch] rtl:!text-[clamp(2.3rem,0.6rem+4.2vw,5.5rem)] rtl:!leading-[1.3]">
          <Headline lines={[dict.hero.line1, dict.hero.line2]} reduce={reduce} />
        </h1>

        <motion.p {...fade(1)} className="mt-6 max-w-[40ch] text-lg leading-relaxed text-[#b0b0bc] sm:text-xl">
          {dict.hero.text}
        </motion.p>

        <motion.div {...fade(1.15)} className="mt-9 flex flex-wrap justify-center gap-3">
          <LinkButton href={`${href(locale)}#work`} arrow>
            {dict.hero.explore}
          </LinkButton>
          <LinkButton href={`${href(locale)}#contact`} variant="outline" className="bg-ink/40 backdrop-blur-sm">
            {dict.hero.start}
          </LinkButton>
        </motion.div>
      </div>
    </section>
  );
}
