'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { packages } from '@/content/offer';
import { launchOffer } from '@/content/site';
import { selectBudget } from '@/lib/events';
import { formatSAR, href } from '@/lib/i18n';
import { PackageCard } from './PackageCard';

export function Packages() {
  const { locale, dict } = useLocale();
  const offer = launchOffer();
  const from = Math.min(...packages.map((p) => (offer.active ? p.launchPrice : p.price)));
  const maxDiscount = Math.max(...packages.map((p) => Math.round((1 - p.launchPrice / p.price) * 100)));

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
              {dict.packages.from} <span className="text-paper">{formatSAR(from, locale)}</span>
            </p>
          </Reveal>
        </div>

        {offer.active && (
          <Reveal delay={0.15}>
            <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 rounded-card border border-accent/40 bg-accent/[0.06] px-5 py-4">
              <span className="rounded-pill bg-spectrum px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink rtl:normal-case rtl:tracking-normal">{dict.packages.launch}</span>
              <p className="text-sm text-paper">
                {dict.packages.launchText} <span className="font-semibold text-accent">{dict.packages.save.replace('{n}', String(maxDiscount))}</span>
              </p>
              <span className="text-sm text-mute">{offer.daysLeft <= 1 ? dict.packages.lastDay : dict.packages.endsIn.replace('{days}', String(offer.daysLeft))}</span>
            </div>
          </Reveal>
        )}

        <div className="mt-16 grid gap-6 sm:mt-20 lg:grid-cols-3 lg:items-start">
          {packages.map((pkg, i) => (
            <PackageCard key={pkg.id} pkg={pkg} index={i} />
          ))}
        </div>

        {/* Custom */}
        <Reveal className="mt-8">
          <div className="flex flex-col gap-6 rounded-card border border-line p-7 sm:p-9 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-medium tracking-[-0.02em]">{dict.packages.customTitle}</h3>
              <p className="mt-2 max-w-[52ch] text-mute">{dict.packages.customText}</p>
            </div>
            <LinkButton href={`${href(locale)}#contact`} arrow onClick={() => selectBudget(3)}>
              {dict.packages.customCta}
            </LinkButton>
          </div>
        </Reveal>

      </div>
    </section>
  );
}
