'use client';

import { Check, Minus } from 'lucide-react';
import { LiquidView } from '@/components/liquid/LiquidView';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { comparison, packages } from '@/content/offer';
import { studio } from '@/content/site';
import { selectBudget } from '@/lib/events';
import { formatSAR, href } from '@/lib/i18n';
import { PackageCard } from './PackageCard';

export function Packages() {
  const { locale, dict } = useLocale();

  return (
    <section id="packages" aria-labelledby="packages-title" className="section-y overflow-x-clip border-t border-line">
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

        {/* Liquid mass behind translucent glass cards */}
        <div className="relative mt-16 sm:mt-20">
          <LiquidView mode="pricing" className="absolute -inset-x-[6%] -inset-y-[14%] max-lg:bottom-auto max-lg:h-[min(110vh,64rem)]" opacity={0.95} />
          <div className="grid gap-6 lg:grid-cols-3 lg:items-start">
            {packages.map((pkg, i) => (
              <PackageCard key={pkg.id} pkg={pkg} index={i} />
            ))}
          </div>
        </div>

        {/* Custom */}
        <Reveal className="mt-8">
          <div className="flex flex-col gap-6 rounded-card border border-line bg-ink-2/40 p-7 backdrop-blur-xl sm:p-9 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-2xl font-medium tracking-[-0.02em]">{dict.packages.customTitle}</h3>
              <p className="mt-2 max-w-[52ch] text-mute">{dict.packages.customText}</p>
            </div>
            <LinkButton href={`${href(locale)}#contact`} arrow onClick={() => selectBudget(3)}>
              {dict.packages.customCta}
            </LinkButton>
          </div>
        </Reveal>

        {/* Comparison */}
        <div className="mt-28 sm:mt-36">
          <RevealLines lines={[dict.packages.compareTitle]} className="display-md max-w-[20ch]" />
          <Reveal delay={0.1} className="mt-10">
            <div className="no-scrollbar -mx-[var(--gutter)] overflow-x-auto px-[var(--gutter)]">
              <table className="w-full min-w-[40rem] border-collapse text-start text-[0.95rem]">
                <caption className="sr-only">{dict.packages.compareTitle}</caption>
                <thead>
                  <tr className="border-b border-line">
                    <th scope="col" className="w-[40%] py-4 text-start font-normal text-faint">
                      {dict.packages.feature}
                    </th>
                    {packages.map((p) => (
                      <th key={p.id} scope="col" className="py-4 text-start font-medium" dir="ltr">
                        <span className={p.popular ? 'text-violet-soft' : ''}>{p.name}</span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((row) => (
                    <tr key={row.label.en} className="border-b border-line">
                      <th scope="row" className="py-4 pe-4 text-start font-normal text-paper/80">
                        {row.label[locale]}
                      </th>
                      {row.values.map((v, i) => (
                        <td key={i} className="py-4">
                          {v === true ? (
                            <Check aria-label={dict.packages.yes} className="size-4 text-violet-soft" strokeWidth={2} />
                          ) : v === false ? (
                            <Minus aria-label={dict.packages.no} className="size-4 text-faint" strokeWidth={1.6} />
                          ) : (
                            <span className="text-paper/80">{v[locale]}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  <tr>
                    <th scope="row" className="py-5 text-start font-normal text-faint" />
                    {packages.map((p) => (
                      <td key={p.id} className="py-5 font-medium">
                        {formatSAR(p.price, locale)}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
