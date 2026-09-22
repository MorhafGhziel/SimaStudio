'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Check, ChevronDown } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import type { Package } from '@/content/offer';
import { useMedia, useWebGL } from '@/lib/capabilities';
import { selectBudget } from '@/lib/events';
import { launchOffer } from '@/content/site';
import { formatMoney } from '@/lib/currency';
import { href } from '@/lib/i18n';
import { useCurrency } from '@/lib/useCurrency';
import { cn } from '@/lib/utils';

const BottlePreview = dynamic(() => import('@/components/three/BottlePreview'), { ssr: false });

/** Hierarchy: experience → value → features → price → CTA. */
export function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const { locale, dict } = useLocale();
  const cur = useCurrency(locale);
  const reduce = useReducedMotion();
  const webgl = useWebGL();
  const desktop = useMedia('(min-width: 768px)');
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { margin: '300px 0px' });
  const visible = useInView(box);
  const offer = launchOffer();
  const immersive = pkg.id === 'immersive';
  const show3d = immersive && webgl && desktop && !reduce;
  // Phones show the first few features; the rest open on tap.
  const SHORT = 4;
  const [open, setOpen] = useState(false);

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className={cn(
        'relative flex flex-col rounded-card border p-7 max-lg:w-[84%] max-lg:shrink-0 max-lg:snap-start sm:p-9 sm:max-lg:w-[47%]',
        pkg.popular ? 'border-accent/45 bg-ink-3 shadow-[0_40px_90px_-50px_rgb(232_163_58/0.4)] lg:-translate-y-4' : 'border-line bg-ink-2',
      )}
    >
      {pkg.popular && <span className="absolute -top-3 start-7 rounded-pill bg-spectrum px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink rtl:normal-case rtl:tracking-normal">{dict.packages.popular}</span>}

      <div className="flex items-baseline justify-between">
        <h3 className="text-[1.9rem] font-medium tracking-[-0.02em]" dir="ltr">
          {pkg.name}
        </h3>
        <span className="text-sm text-faint" dir="ltr">
          {pkg.number}
        </span>
      </div>
      <p className="mt-3 text-lg text-paper">{pkg.tagline[locale]}</p>
      <p className="mt-2 text-sm text-mute">{pkg.audience[locale]}</p>

      {immersive && (
        <div ref={box} data-cursor={show3d ? 'drag' : undefined} className="relative mt-7 aspect-[16/9] overflow-hidden rounded-2xl lg:aspect-[4/3] border border-line bg-[radial-gradient(90%_80%_at_50%_35%,#2a2114_0%,#0e0e0f_75%)]">
          {show3d && near ? (
            <BottlePreview running={visible} />
          ) : (
            <Image src="/work/noble-immersive-detail.jpg" alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
          )}
          {show3d && <span className="pointer-events-none absolute bottom-3 start-3 rounded-pill bg-ink/60 px-3 py-1 text-[0.7rem] text-[#c4c4c0] backdrop-blur">{dict.packages.preview}</span>}
        </div>
      )}

      <ul className="mt-8 space-y-3 border-t border-line pt-7 text-[0.95rem]">
        {pkg.features.map((f, i) => (
          <li key={f.en} className={cn('flex gap-3', i === 0 && index > 0 ? 'text-accent' : 'text-[#d0cfca]', i >= SHORT && !open && 'max-lg:hidden')}>
            <Check className="mt-1 size-4 shrink-0 text-accent" strokeWidth={1.8} />
            {f[locale]}
          </li>
        ))}
      </ul>
      {pkg.features.length > SHORT && (
        <button type="button" aria-expanded={open} onClick={() => setOpen((v) => !v)} className="mt-4 inline-flex items-center gap-1.5 self-start text-sm text-mute transition-colors hover:text-paper lg:hidden">
          {open ? dict.packages.fewer : dict.packages.allFeatures.replace('{n}', String(pkg.features.length))}
          <ChevronDown className={cn('size-4 transition-transform duration-300', open && 'rotate-180')} strokeWidth={1.6} />
        </button>
      )}

      <div className="mt-auto pt-8 lg:pt-10">
        <div className="flex items-end justify-between gap-4 border-t border-line pt-6">
          <div>
            {pkg.fromPrice && <span className="block text-sm text-mute">{dict.packages.from}</span>}
            <p className="mt-1 whitespace-nowrap text-[2rem] font-medium leading-none tracking-[-0.03em]">{formatMoney(offer.active ? pkg.launchPrice : pkg.price, cur, locale)}</p>
            {offer.active ? (
              <span className="mt-2 block text-xs text-faint">{dict.packages.after.replace('{price}', formatMoney(pkg.price, cur, locale))}</span>
            ) : (
              pkg.fromPrice && <span className="mt-2 block text-xs text-faint">{dict.packages.perProject}</span>
            )}
          </div>
          <p className="text-end text-xs text-faint">
            {dict.packages.timeline}
            <br />
            <span className="text-mute">{pkg.timeline[locale]}</span>
          </p>
        </div>
        <LinkButton href={`${href(locale)}#contact`} variant={pkg.popular ? 'solid' : 'outline'} magnetic={false} className="mt-6 w-full" onClick={() => selectBudget(offer.active ? pkg.launchPrice : pkg.price, pkg.name)}>
          {pkg.cta[locale]}
        </LinkButton>
      </div>
    </motion.article>
  );
}
