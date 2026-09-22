'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { ArrowUpRight, Check, Plus } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { WhatsAppIcon } from '@/components/icons';
import { packages, services, type Service } from '@/content/offer';
import { launchOffer, whatsappUrl } from '@/content/site';
import { useMedia } from '@/lib/capabilities';
import { formatPrice, href } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Interactive list: each row shows its starting price and opens to what you get. On desktop a preview image follows the cursor. */
export function Services() {
  const { locale, dict } = useLocale();
  const hover = useMedia('(hover: hover) and (pointer: fine)');
  const [active, setActive] = useState<string | null>(null);
  const [open, setOpen] = useState<string | null>(null);
  const offer = launchOffer();

  // Prices and timelines follow the package data, so they never drift from the Packages section.
  const pkg = (id?: Service['pricedBy']) => packages.find((p) => p.id === id);
  const priceOf = (service: Service) => {
    const p = pkg(service.pricedBy);
    return p ? (offer.active ? p.launchPrice : p.price) : service.from;
  };
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 180, damping: 22 });
  const sy = useSpring(y, { stiffness: 180, damping: 22 });
  const current = services.find((s) => s.id === active);

  return (
    <section id="services" aria-labelledby="services-title" className="section-y">
      <div className="container-x">
        <SectionHeading id="services-title" lines={[dict.services.title]} aside={<LinkButton href={`${href(locale)}#contact`} variant="outline" arrow>{dict.services.cta}</LinkButton>} />

        <ul
          className="mt-16 border-t border-line sm:mt-20"
          onPointerMove={(e) => {
            x.set(e.clientX);
            y.set(e.clientY);
          }}
          onPointerLeave={() => setActive(null)}
        >
          {services.map((service, i) => {
            const isOpen = open === service.id;
            const price = priceOf(service);
            const timeline = pkg(service.timelineBy)?.timeline[locale] ?? dict.services.quoted;
            return (
              <li key={service.id} onPointerEnter={() => setActive(service.id)} data-cursor={hover && !isOpen ? 'explore' : undefined} className="group border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={`service-${service.id}`}
                  onClick={() => setOpen(isOpen ? null : service.id)}
                  className="grid w-full gap-x-6 gap-y-3 py-7 text-start transition-[padding] duration-700 ease-out md:grid-cols-12 md:items-baseline md:py-9 md:group-hover:ps-4"
                >
                  <span className="text-sm text-faint max-md:hidden md:col-span-1" dir="ltr">
                    0{i + 1}
                  </span>
                  <span className={cn('display-md block transition-colors duration-500 md:col-span-5', active && active !== service.id ? 'text-[#4c4c4f]' : 'text-paper')}>{service.title[locale]}</span>
                  <span className="block max-w-[38ch] text-mute md:col-span-4">{service.text[locale]}</span>
                  <span className="flex items-center justify-between gap-3 md:col-span-2 md:justify-end">
                    {price !== undefined && (
                      <span className="whitespace-nowrap text-sm text-mute">
                        {dict.services.from} <span className="text-base text-paper">{formatPrice(price, locale)}</span>
                      </span>
                    )}
                    <span aria-hidden="true" className={cn('grid size-8 shrink-0 place-items-center rounded-full border border-line text-mute transition-all duration-500 group-hover:border-accent/60 group-hover:text-accent', isOpen && 'rotate-45 border-accent/60 text-accent')}>
                      <Plus className="size-4" strokeWidth={1.6} />
                    </span>
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div id={`service-${service.id}`} initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
                      <div className="grid gap-8 pb-9 md:grid-cols-12 md:gap-x-6 md:pb-11">
                        <ul className="space-y-3 text-[0.98rem] text-[#d0cfca] md:col-span-6 md:col-start-2">
                          {service.points.map((point) => (
                            <li key={point.en} className="flex gap-3">
                              <Check className="mt-1.5 size-4 shrink-0 text-accent" strokeWidth={1.8} />
                              {point[locale]}
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-col gap-5 md:col-span-4 md:col-start-9">
                          <p className="text-sm text-faint">
                            {dict.services.timeline}
                            <span className="mt-1 block text-base text-paper">{timeline}</span>
                          </p>
                          <div className="flex flex-col items-start gap-3">
                            <a href={whatsappUrl(dict.services.askText.replace('{service}', service.title[locale]))} target="_blank" rel="noopener noreferrer" data-cursor="open" className="inline-flex items-center gap-2 rounded-pill bg-accent px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-paper">
                              <WhatsAppIcon className="size-4" /> {dict.services.ask}
                            </a>
                            {service.project && (
                              <Link href={href(locale, `/work/${service.project}`)} className="inline-flex items-center gap-1.5 text-sm text-paper transition-colors hover:text-accent">
                                {dict.services.related}
                                <ArrowUpRight className="size-4 rtl:-scale-x-100" strokeWidth={1.6} />
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Touch tablets: inline preview (hidden on phones to keep the list short) */}
                {!hover && (
                  <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-card max-md:hidden">
                    <Image src={service.image} alt="" fill sizes="100vw" className="object-cover object-top" />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {hover && (
        <motion.div aria-hidden="true" style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block">
          <AnimatePresence>
            {current && current.id !== open && (
              <motion.div
                key={current.id}
                initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="absolute -translate-x-1/2 -translate-y-[115%] overflow-hidden rounded-2xl border border-line shadow-[0_30px_60px_-20px_rgb(0_0_0/0.9)]"
              >
                <div className="relative h-[15rem] w-[24rem]">
                  <Image src={current.image} alt="" fill sizes="384px" className="object-cover object-top" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
