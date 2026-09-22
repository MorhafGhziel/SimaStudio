'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { Check, Clock } from 'lucide-react';
import { carePlan, packages } from '@/content/offer';
import { launchOffer, launchOfferEnds } from '@/content/site';
import { selectBudget } from '@/lib/events';
import { formatMoney } from '@/lib/currency';
import { href } from '@/lib/i18n';
import { useCurrency } from '@/lib/useCurrency';
import { PackageCard } from './PackageCard';

export function Packages() {
  const { locale, dict } = useLocale();
  const cur = useCurrency(locale);
  const offer = launchOffer();
  const from = Math.min(...packages.map((p) => (offer.active ? p.launchPrice : p.price)));
  // The offer's last day, written out. No countdown: a date is a fact, a ticking clock is pressure.
  const until = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', timeZone: 'Asia/Riyadh' }).format(new Date(launchOfferEnds));

  return (
    <section id="packages" aria-labelledby="packages-title" className="section-y border-t border-line">
      <div className="container-x">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <RevealLines lines={[dict.packages.title]} className="display-lg max-w-[14ch]" />
            <Reveal delay={0.1}>
              <p id="packages-title" className="mt-6 text-lg text-mute">
                {dict.packages.text}
              </p>
            </Reveal>
          </div>
          <Reveal delay={0.2}>
            <p className="text-sm text-mute">
              {dict.packages.from} <span className="text-paper">{formatMoney(from, cur, locale)}</span>
            </p>
          </Reveal>
        </div>

        {offer.active && (
          <Reveal delay={0.15}>
            <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-1 border-s-2 border-accent ps-4 text-sm text-mute">
              <span className="font-medium text-paper">{dict.packages.launch}</span>
              {dict.packages.launchText.replace('{date}', until)}
            </p>
          </Reveal>
        )}

        {/* Phones and tablets: one swipe row with the next card peeking. Desktop: three columns. */}
        <div className="no-scrollbar mt-12 flex snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain pt-4 max-lg:-mx-[var(--gutter)] max-lg:scroll-px-[var(--gutter)] max-lg:px-[var(--gutter)] sm:mt-20 lg:grid lg:grid-cols-3 lg:items-start lg:gap-6 lg:overflow-visible lg:pt-0">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        {/* How payment works: three plain facts */}
        <Reveal className="mt-10">
          <ul className="grid gap-x-8 gap-y-3 border-y border-line py-6 text-[0.95rem] text-[#d0cfca] md:grid-cols-3">
            {dict.packages.terms.map((term) => (
              <li key={term} className="flex gap-3">
                <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.8} />
                {term}
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Guarantee · care plan · custom */}
        <div className="no-scrollbar mt-8 flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto overscroll-x-contain max-lg:-mx-[var(--gutter)] max-lg:scroll-px-[var(--gutter)] max-lg:px-[var(--gutter)] lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
          <Reveal className="max-lg:w-[84%] max-lg:shrink-0 max-lg:snap-start sm:max-lg:w-[47%]">
            <div className="flex h-full flex-col rounded-card border border-accent/40 bg-accent/[0.05] p-7 sm:p-8">
              <Clock className="size-6 text-accent" strokeWidth={1.5} />
              <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em]">{dict.packages.guaranteeTitle}</h3>
              <p className="mt-3 text-mute">{dict.packages.guaranteeText}</p>
            </div>
          </Reveal>
          <Reveal delay={0.08} className="max-lg:w-[84%] max-lg:shrink-0 max-lg:snap-start sm:max-lg:w-[47%]">
            <div className="flex h-full flex-col rounded-card border border-line p-7 sm:p-8">
              <p className="whitespace-nowrap text-[2rem] font-medium leading-none tracking-[-0.03em]">
                {formatMoney(carePlan.price, cur, locale)} <span className="text-base font-normal tracking-normal text-mute">{dict.packages.perMonth}</span>
              </p>
              <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em]">{dict.packages.careTitle}</h3>
              <p className="mt-3 text-mute">{dict.packages.careText}</p>
            </div>
          </Reveal>
          <Reveal delay={0.16} className="max-lg:w-[84%] max-lg:shrink-0 max-lg:snap-start sm:max-lg:w-[47%]">
            <div className="flex h-full flex-col rounded-card border border-line p-7 sm:p-8">
              <h3 className="text-2xl font-medium tracking-[-0.02em]">{dict.packages.customTitle}</h3>
              <p className="mt-3 text-mute">{dict.packages.customText}</p>
              <div className="mt-auto pt-7">
                <LinkButton href={`${href(locale)}#contact`} arrow onClick={() => selectBudget(null, 'Custom')}>
                  {dict.packages.customCta}
                </LinkButton>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
