'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { useInView, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { packages } from '@/content/offer';
import { getProject } from '@/content/projects';
import { formatSAR, href } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/**
 * What a visitor cannot get from the studio next door, said on the home page instead of
 * buried in a case study: a product built in 3D from the real thing that turns into a quote
 * request, and an honest view of where the studio sits between template shops and agencies.
 */
export function Difference() {
  const { locale, dict } = useLocale();
  const d = dict.difference;
  const reduce = useReducedMotion();
  const stage = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const inView = useInView(stage, { amount: 0.35 });
  const nasaq = getProject('nasaq');

  // The clip only runs while it is on screen.
  useEffect(() => {
    const v = video.current;
    if (!v || reduce) return;
    if (inView) v.play().catch(() => {});
    else v.pause();
  }, [inView, reduce]);

  const prices = packages.map((p) => p.price);
  const ours = d.oursPrice.replace('{min}', formatSAR(Math.min(...prices), locale)).replace('{max}', formatSAR(Math.max(...prices), locale));
  const rows = d.rows.map((row, i) => (i === 1 ? { ...row, ours } : row));

  return (
    <section id="difference" aria-labelledby="difference-title" className="section-y border-t border-line">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="lg:col-span-5">
            <Reveal>
              <p className="eyebrow !text-accent">{d.kicker}</p>
            </Reveal>
            <RevealLines lines={[d.title]} className="display-lg mt-5 max-w-[14ch]" />
            <span id="difference-title" className="sr-only">
              {d.title}
            </span>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[44ch] text-lg text-mute">{d.text}</p>
              <ol className="mt-8 space-y-4">
                {d.steps.map((step, i) => (
                  <li key={step} className="flex items-baseline gap-4 border-t border-line pt-4">
                    <span className="text-sm text-accent" dir="ltr">
                      0{i + 1}
                    </span>
                    <span className="text-[1.05rem] text-paper">{step}</span>
                  </li>
                ))}
              </ol>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                <Link href={href(locale, '/work/nasaq')} className="inline-flex items-center gap-1.5 text-paper transition-colors hover:text-accent">
                  {d.seeProject} <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                </Link>
                {nasaq?.live && (
                  <a href={nasaq.live} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-mute transition-colors hover:text-paper">
                    {d.tryIt} <span dir="ltr">nasaqksa.com</span>
                  </a>
                )}
              </div>
              <p className="mt-6 max-w-[44ch] text-sm text-faint">{d.note}</p>
            </Reveal>
          </div>

          <Reveal delay={0.1} className="lg:col-span-7">
            <div ref={stage} className="relative aspect-[16/10] overflow-hidden rounded-card border border-line bg-ink-2">
              <Image src="/work/nasaq-loop-poster.jpg" alt={d.alt} fill sizes="(min-width: 1024px) 56vw, 100vw" className="object-cover object-top" />
              {!reduce && (
                <video ref={video} muted loop playsInline preload="none" aria-hidden="true" className="absolute inset-0 size-full object-cover object-top">
                  <source src="/work/nasaq-loop.mp4" type="video/mp4" />
                </video>
              )}
            </div>
          </Reveal>
        </div>

        {/* Where the studio sits */}
        <Reveal className="mt-12 sm:mt-16">
          <h3 className="text-2xl font-medium tracking-[-0.02em]">{d.tableTitle}</h3>
          <div className="mt-6 overflow-hidden rounded-card border border-line">
            <div className="grid grid-cols-3 border-b border-line bg-ink-2 text-sm">
              {[d.cols.templates, d.cols.ours, d.cols.agencies].map((col, i) => (
                <p key={col} className={cn('px-4 py-3 sm:px-6', i === 1 ? 'bg-accent/[0.08] font-medium text-accent' : 'text-mute')}>
                  {col}
                </p>
              ))}
            </div>
            {rows.map((row) => (
              <div key={row.label} className="border-b border-line last:border-b-0">
                <p className="px-4 pt-4 text-xs text-faint sm:px-6">{row.label}</p>
                <div className="grid grid-cols-3 text-[0.95rem]">
                  <p className="px-4 pb-4 pt-1 text-mute sm:px-6">{row.templates}</p>
                  <p className="bg-accent/[0.05] px-4 pb-4 pt-1 text-paper sm:px-6">{row.ours}</p>
                  <p className="px-4 pb-4 pt-1 text-mute sm:px-6">{row.agencies}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-faint">{d.tableNote}</p>
        </Reveal>
      </div>
    </section>
  );
}
