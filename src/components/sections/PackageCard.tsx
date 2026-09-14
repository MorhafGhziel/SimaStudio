'use client';

import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRef } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { Check } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import type { Package } from '@/content/offer';
import { useMedia, useWebGL } from '@/lib/capabilities';
import { selectBudget } from '@/lib/events';
import { formatSAR, href } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const BottlePreview = dynamic(() => import('@/components/three/BottlePreview'), { ssr: false });

/** Hierarchy: experience → value → features → price → CTA. */
export function PackageCard({ pkg, index }: { pkg: Package; index: number }) {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const webgl = useWebGL();
  const desktop = useMedia('(min-width: 768px)');
  const box = useRef<HTMLDivElement>(null);
  const near = useInView(box, { margin: '300px 0px' });
  const visible = useInView(box);
  const immersive = pkg.id === 'immersive';
  const show3d = immersive && webgl && desktop && !reduce;

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      className={cn(
        'relative flex flex-col rounded-card border p-7 sm:p-9',
        pkg.popular ? 'border-sand/45 bg-ink-3 shadow-[0_40px_90px_-50px_rgb(210_188_152/0.35)] lg:-translate-y-4' : 'border-line bg-ink-2',
      )}
    >
      {pkg.popular && <span className="absolute -top-3 start-7 rounded-pill bg-sand px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-ink rtl:normal-case rtl:tracking-normal">{dict.packages.popular}</span>}

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
        <div ref={box} data-cursor={show3d ? 'drag' : undefined} className="relative mt-7 aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-[radial-gradient(90%_80%_at_50%_35%,#2a2520_0%,#0f0f0d_75%)]">
          {show3d && near ? (
            <BottlePreview running={visible} />
          ) : (
            <Image src="/work/noble-immersive-detail.jpg" alt="" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
          )}
          {show3d && <span className="pointer-events-none absolute bottom-3 start-3 rounded-pill bg-ink/60 px-3 py-1 text-[0.7rem] text-paper/80 backdrop-blur">{dict.packages.preview}</span>}
        </div>
      )}

      <ul className="mt-8 space-y-3 border-t border-line pt-7 text-[0.95rem]">
        {pkg.features.map((f, i) => (
          <li key={f.en} className={cn('flex gap-3', i === 0 && index > 0 ? 'text-sand' : 'text-paper/85')}>
            <Check className="mt-1 size-4 shrink-0 text-sand" strokeWidth={1.8} />
            {f[locale]}
          </li>
        ))}
      </ul>

      <div className="mt-auto pt-10">
        <div className="flex items-end justify-between gap-4 border-t border-line pt-6">
          <p className="text-[2rem] font-medium leading-none tracking-[-0.03em]">{formatSAR(pkg.price, locale)}</p>
          <p className="text-end text-xs text-faint">
            {dict.packages.timeline}
            <br />
            <span className="text-mute">{pkg.timeline[locale]}</span>
          </p>
        </div>
        <LinkButton href={`${href(locale)}#contact`} variant={pkg.popular ? 'solid' : 'outline'} magnetic={false} className="mt-6 w-full" onClick={() => selectBudget(index)}>
          {pkg.cta[locale]}
        </LinkButton>
      </div>
    </motion.article>
  );
}
