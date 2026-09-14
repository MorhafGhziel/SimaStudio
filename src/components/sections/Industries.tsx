'use client';

import Image, { type StaticImageData } from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import beauty from '@/assets/images/ind-beauty.jpg';
import cafes from '@/assets/images/ind-cafes.jpg';
import ecommerce from '@/assets/images/ind-ecommerce.jpg';
import fashion from '@/assets/images/ind-fashion.jpg';
import lifestyle from '@/assets/images/ind-lifestyle.jpg';
import perfume from '@/assets/images/ind-perfume.jpg';
import restaurants from '@/assets/images/ind-restaurants.jpg';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { industries } from '@/content/offer';
import { getProject } from '@/content/projects';
import { href } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const images: Record<string, StaticImageData> = { perfume, fashion, beauty, restaurants, cafes, lifestyle, ecommerce };
const EASE = [0.22, 1, 0.36, 1] as const;

export function Industries() {
  const { locale, dict } = useLocale();
  const [preview, setPreview] = useState('perfume');
  const [selected, setSelected] = useState('perfume');
  const industry = industries.find((i) => i.id === selected)!;
  const related = industry.projects.map((slug) => getProject(slug)!).filter(Boolean);

  return (
    <section aria-labelledby="industries-title" className="section-y border-t border-line">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <RevealLines lines={[dict.industries.title]} className="display-lg max-w-[14ch]" />
          <Reveal delay={0.1}>
            <p id="industries-title" className="mt-6 text-mute">
              {dict.industries.text}
            </p>
          </Reveal>

          <ul role="tablist" aria-label={dict.industries.title} className="mt-12 flex flex-wrap gap-x-5 gap-y-1 sm:gap-x-8">
            {industries.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={selected === item.id}
                  data-cursor="explore"
                  onPointerEnter={() => setPreview(item.id)}
                  onFocus={() => setPreview(item.id)}
                  onClick={() => {
                    setSelected(item.id);
                    setPreview(item.id);
                  }}
                  className={cn(
                    'relative py-1 text-[clamp(1.9rem,1.1rem+3vw,4rem)] font-medium uppercase leading-[1.1] tracking-[-0.03em] transition-colors duration-500 rtl:normal-case rtl:tracking-normal',
                    selected === item.id ? 'text-paper' : 'text-paper/25 hover:text-paper/70',
                  )}
                >
                  {item.label[locale]}
                  {selected === item.id && <motion.span layoutId="industry-underline" className="absolute inset-x-0 bottom-1 h-[2px] bg-sand" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-12 border-t border-line pt-8" aria-live="polite">
            <p className="eyebrow">{dict.industries.related}</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.4, ease: EASE }} className="mt-5">
                {related.length ? (
                  <ul className="grid gap-4 sm:grid-cols-2">
                    {related.map((p) => (
                      <li key={p.slug}>
                        <Link href={href(locale, `/work/${p.slug}`)} data-cursor="view" className="group flex items-center gap-4 rounded-2xl border border-line p-3 transition-colors hover:border-paper/25">
                          <span className="relative aspect-[4/3] w-24 shrink-0 overflow-hidden rounded-xl">
                            <Image src={`/work/${p.slug}-hero.jpg`} alt="" fill sizes="96px" className="object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-medium">{locale === 'ar' ? p.arName : p.name}</span>
                            <span className="block text-sm text-mute">{p.kind[locale]}</span>
                          </span>
                          <ArrowUpRight className="size-4 text-mute transition-colors group-hover:text-sand rtl:-scale-x-100" strokeWidth={1.6} />
                        </Link>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <Link href={`${href(locale)}#contact`} className="group inline-flex items-center gap-2 text-paper/80 transition-colors hover:text-sand">
                    {dict.industries.none}
                    <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                  </Link>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-ink-2 lg:sticky lg:top-[calc(var(--nav)+2rem)]">
            <AnimatePresence initial={false}>
              <motion.div key={preview} initial={{ opacity: 0, scale: 1.08 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.9, ease: EASE }} className="absolute inset-0">
                <Image src={images[preview]} alt={industries.find((i) => i.id === preview)!.label[locale]} fill sizes="(min-width: 1024px) 40vw, 100vw" placeholder="blur" className="object-cover" />
              </motion.div>
            </AnimatePresence>
            <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <p className="absolute bottom-5 start-5 text-sm text-paper/90">{industries.find((i) => i.id === preview)!.label[locale]}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
