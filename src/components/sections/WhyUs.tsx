'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { reasons } from '@/content/offer';
import { cn } from '@/lib/utils';

export function WhyUs() {
  const { locale, dict } = useLocale();
  return (
    <section aria-labelledby="why-title" className="section-y border-t border-line">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[calc(var(--nav)+2rem)]">
            <RevealLines lines={[dict.why.title]} className="display-md max-w-[12ch]" />
            <span id="why-title" className="sr-only">
              {dict.why.title}
            </span>
          </div>
        </div>
        <ul className="glass grid gap-px overflow-hidden rounded-card !bg-white/[0.06] sm:grid-cols-2 lg:col-span-8">
          {reasons.map((r, i) => (
            <li key={r.title.en} className={cn('bg-ink-2/95 transition-colors duration-500 hover:bg-ink-3/90', i === reasons.length - 1 && 'sm:col-span-2')}>
              <Reveal delay={i * 0.05} className="h-full p-8 sm:p-10">
                <h3 className="text-[1.45rem] font-medium leading-snug tracking-[-0.02em]">{r.title[locale]}</h3>
                <p className="mt-3 max-w-[38ch] text-mute">{r.text[locale]}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
