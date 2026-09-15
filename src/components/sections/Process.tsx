'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLocale } from '@/components/providers/LocaleProvider';
import { RevealLines } from '@/components/ui/Reveal';
import { processSteps } from '@/content/offer';
import { useMedia, useWebGL } from '@/lib/capabilities';
import { cn } from '@/lib/utils';

const ProcessScene = dynamic(() => import('@/components/three/process/ProcessScene'), { ssr: false });

/**
 * Pinned process story: scrolling through the section steps through
 * Discover → Design → Build → Launch while the particle scene morphs to match.
 */
export function Process() {
  const { locale, dict } = useLocale();
  const reduce = useMedia('(prefers-reduced-motion: reduce)');
  const webgl = useWebGL();
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const steps = useRef<HTMLDivElement[]>([]);
  const fills = useRef<HTMLSpanElement[]>([]);
  const progress = useRef(0);
  const [active, setActive] = useState(0);

  // Pin the stage for three extra screens and map scroll to 0–3.
  useEffect(() => {
    if (reduce || !section.current || !stage.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: section.current,
        start: 'top top',
        end: () => `+=${window.innerHeight * 3}`,
        pin: stage.current,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        snap: { snapTo: 1 / 3, directional: false, duration: { min: 0.25, max: 0.6 }, delay: 0.1, ease: 'power2.inOut' },
        onUpdate: (self) => {
          const p = self.progress * 3;
          progress.current = p;
          fills.current.forEach((el, i) => gsap.set(el, { scaleX: Math.min(Math.max(p - i + 1, 0), 1) }));
          setActive(Math.min(3, Math.round(p)));
        },
      });
    }, section);
    const refresh = window.setTimeout(() => ScrollTrigger.refresh(), 800);
    return () => {
      window.clearTimeout(refresh);
      ctx.revert();
    };
  }, [reduce]);

  // Swap the visible step: the old one lifts away, the new one rises out of a blur.
  useEffect(() => {
    if (reduce) return;
    steps.current.forEach((el, i) => {
      const on = i === active;
      gsap.to(el, {
        autoAlpha: on ? 1 : 0,
        y: on ? 0 : i < active ? -28 : 28,
        filter: on ? 'blur(0px)' : 'blur(8px)',
        duration: 0.8,
        ease: 'power3.out',
        overwrite: true,
      });
    });
  }, [active, reduce]);

  return (
    <section ref={section} id="process" aria-labelledby="process-title" className="relative border-t border-line bg-ink">
      <div ref={stage} className={cn('relative overflow-hidden', reduce ? 'section-y' : 'h-[100svh]')}>
        {webgl === true && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-[var(--nav)] h-[46%] md:inset-y-0 md:start-auto md:end-0 md:top-0 md:h-auto md:w-[60%]">
            <div className="absolute inset-0 bg-[radial-gradient(50%_50%_at_50%_50%,rgba(91,139,255,0.12),transparent_70%)]" />
            <ProcessScene progress={progress} reduced={reduce} />
          </div>
        )}

        <div className={cn('container-x relative z-10', !reduce && 'flex h-full flex-col justify-end pb-14 pt-[calc(var(--nav)+2rem)] md:justify-center md:pb-0')}>
          <div className={cn(!reduce && 'md:max-w-[34rem]')}>
            <p className="eyebrow">{dict.nav.process}</p>
            <RevealLines lines={[dict.process.title]} className="display-lg mt-5 max-w-[12ch]" />
            <span id="process-title" className="sr-only">
              {dict.process.title}
            </span>

            {reduce ? (
              <ol className="mt-14 grid gap-10 md:grid-cols-4">
                {processSteps.map((step, i) => (
                  <li key={step.title.en}>
                    <span dir="ltr" className="block text-[3.5rem] font-medium leading-none tracking-[-0.05em] text-[#29292b]">
                      0{i + 1}
                    </span>
                    <h3 className="mt-4 text-2xl font-medium">{step.title[locale]}</h3>
                    <p className="mt-3 max-w-[28ch] text-mute">{step.text[locale]}</p>
                  </li>
                ))}
              </ol>
            ) : (
              <>
                <div className="relative mt-10 h-[11.5rem] md:mt-14 md:h-[13.5rem]">
                  {processSteps.map((step, i) => (
                    <div
                      key={step.title.en}
                      ref={(el) => {
                        if (el) steps.current[i] = el;
                      }}
                      aria-hidden={i !== active}
                      className="absolute inset-0"
                      style={{ opacity: i === 0 ? 1 : 0, visibility: i === 0 ? 'visible' : 'hidden' }}
                    >
                      <span dir="ltr" className="block text-[3.5rem] font-medium leading-none tracking-[-0.05em] text-[#34343a] md:text-[4.75rem] rtl:text-right">
                        0{i + 1}
                      </span>
                      <h3 className="mt-3 text-2xl font-medium tracking-[-0.02em] md:text-4xl rtl:tracking-normal">{step.title[locale]}</h3>
                      <p className="mt-3 max-w-[34ch] text-mute md:text-lg">{step.text[locale]}</p>
                    </div>
                  ))}
                </div>

                <ol className="mt-8 grid grid-cols-4 gap-3" aria-label={dict.process.title}>
                  {processSteps.map((step, i) => (
                    <li key={step.title.en} className={cn('text-xs transition-colors duration-500 sm:text-sm', i === active ? 'text-paper' : 'text-faint')}>
                      <span className="relative block h-px overflow-hidden bg-line">
                        <span
                          ref={(el) => {
                            if (el) fills.current[i] = el;
                          }}
                          className="bg-spectrum absolute inset-0 origin-left rtl:origin-right rtl:[background-image:linear-gradient(270deg,#3ec6ff_0%,#5b8bff_50%,#8b9dff_100%)]"
                          style={{ transform: i === 0 ? 'scaleX(1)' : 'scaleX(0)' }}
                        />
                      </span>
                      <span className="mt-3 block">{step.title[locale]}</span>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
