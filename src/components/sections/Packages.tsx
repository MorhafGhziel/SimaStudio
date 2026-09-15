'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { packages } from '@/content/offer';
import { studio } from '@/content/site';
import { selectBudget } from '@/lib/events';
import { formatSAR, href } from '@/lib/i18n';
import { PackageCard } from './PackageCard';

export function Packages() {
  const { locale, dict } = useLocale();

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
              {dict.packages.from} <span className="text-paper">{formatSAR(studio.startingPrice, locale)}</span>
            </p>
          </Reveal>
        </div>

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
