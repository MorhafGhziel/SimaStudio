'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
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
        <span key={line} className={li === 1 ? 'block text-balance text-[#b7b6b1]' : 'block text-balance'}>
          {line.split(' ').map((word, wi, words) => {
            const delay = 0.1 + li * 0.1 + index++ * 0.03;
            return (
              <span key={wi}>
                <span className="inline-block overflow-hidden pb-[0.08em] align-bottom rtl:overflow-visible">
                  <motion.span
                    className="inline-block"
                    initial={reduce ? false : { y: '100%', opacity: 0, filter: 'blur(12px)' }}
                    animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 0.9, ease: EASE, delay }}
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

  const fade = (delay: number) => ({ initial: reduce ? false : { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.8, ease: EASE, delay } });

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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(42%_40%_at_50%_42%,rgba(14,14,15,0.8),rgba(14,14,15,0.45)_55%,transparent_82%)] max-md:bg-[radial-gradient(85%_42%_at_50%_40%,rgba(14,14,15,0.78),rgba(14,14,15,0.4)_60%,transparent_85%)] md:rtl:bg-[radial-gradient(46%_46%_at_50%_48%,rgba(14,14,15,0.85),rgba(14,14,15,0.5)_55%,transparent_82%)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[8%] bg-[linear-gradient(to_top,var(--color-ink),transparent)]" />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute -inset-[20%] -z-10" />

      {/* ── Content ──────────────────────────────────────────── */}
      <div className="container-x flex flex-1 flex-col items-center pt-[calc(var(--nav)+clamp(2rem,8vh,6rem))] text-center">
        <motion.p {...fade(0.05)} className="inline-flex items-center gap-2.5 rounded-pill border border-line bg-ink/50 px-4 py-1.5 text-[0.72rem] uppercase tracking-[0.14em] text-[#c4c4c0] backdrop-blur-sm rtl:text-xs rtl:normal-case rtl:tracking-normal">
          <span aria-hidden="true" className="bg-spectrum size-1.5 rounded-full" />
          {dict.hero.kicker}
        </motion.p>

        <h1 id="hero-title" className="display-xl mt-7 max-w-[36ch] !text-[clamp(2.5rem,0.9rem+4.6vw,6.25rem)] rtl:max-w-[24ch] rtl:!text-[clamp(1.9rem,0.8rem+3.4vw,4.6rem)] rtl:!leading-[1.3]">
          <Headline lines={[dict.hero.line1, dict.hero.line2]} reduce={reduce} />
        </h1>

        <motion.p {...fade(0.4)} className="mt-5 max-w-[52ch] text-base leading-relaxed text-[#b2b1ac] sm:mt-6 sm:text-xl">
          {dict.hero.text}
        </motion.p>

        <motion.div {...fade(0.5)} className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-9">
          <LinkButton href={`${href(locale)}#work`} arrow>
            {dict.hero.explore}
          </LinkButton>
          <LinkButton href={`${href(locale)}#review`} variant="outline" className="bg-ink/40 backdrop-blur-sm">
            {dict.hero.soft}
          </LinkButton>
        </motion.div>

        {/* Proof in the first screen: the latest client site, mid-fitting, one tap from the case study. */}
        <motion.div {...fade(0.6)} className="mt-auto w-full max-w-[46rem] pt-10 sm:pt-12">
          <Link
            href={href(locale, '/work/merit')}
            data-cursor="view"
            aria-label={`${dict.hero.proofLabel}: ${dict.hero.proofName}`}
            className="group relative block max-h-[40svh] overflow-hidden rounded-t-[1.1rem] border border-b-0 border-line bg-ink-2 text-start shadow-[0_-30px_80px_-30px_rgb(0_0_0/0.9)] transition-colors hover:border-paper/30"
          >
            <span className="flex items-center justify-between gap-3 border-b border-line bg-ink/70 px-4 py-2.5 backdrop-blur-md">
              <span className="flex min-w-0 items-center gap-2 text-xs sm:text-sm">
                <span aria-hidden="true" className="bg-spectrum size-1.5 shrink-0 rounded-full" />
                <span className="whitespace-nowrap text-accent">{dict.hero.proofLabel}</span>
                <span className="truncate text-paper">{dict.hero.proofName}</span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5 text-xs text-mute transition-colors group-hover:text-paper" dir="ltr">
                <span className="max-sm:hidden">meritbrand.store</span>
                <ArrowUpRight aria-hidden="true" className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.6} />
              </span>
            </span>
            <span className="relative block aspect-[16/10]">
              {/* MERIT's Fitting Room, captured the moment the model has put on the leather jacket. */}
              <Image src={`/work/merit-proof-${locale}.jpg`} alt="" fill priority sizes="(min-width: 768px) 736px, 100vw" className="object-cover object-top" />
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
