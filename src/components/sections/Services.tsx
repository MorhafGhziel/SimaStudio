'use client';

import Image from 'next/image';
import { useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { LinkButton } from '@/components/ui/Button';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { services } from '@/content/offer';
import { useMedia } from '@/lib/capabilities';
import { href } from '@/lib/i18n';
import { cn } from '@/lib/utils';

/** Interactive list: on desktop a preview image follows the cursor over each row. */
export function Services() {
  const { locale, dict } = useLocale();
  const hover = useMedia('(hover: hover) and (pointer: fine)');
  const [active, setActive] = useState<string | null>(null);
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
          {services.map((service, i) => (
            <li key={service.id} onPointerEnter={() => setActive(service.id)} data-cursor={hover ? 'explore' : undefined} className="group border-b border-line">
              <div className="grid gap-4 py-8 transition-[padding] duration-700 ease-out md:grid-cols-12 md:items-baseline md:py-10 md:group-hover:ps-4">
                <span className="text-sm text-faint md:col-span-1" dir="ltr">
                  0{i + 1}
                </span>
                <h3 className={cn('display-md transition-colors duration-500 md:col-span-6', active && active !== service.id ? 'text-paper/30' : 'text-paper')}>{service.title[locale]}</h3>
                <p className="max-w-[36ch] text-mute md:col-span-5">{service.text[locale]}</p>
              </div>
              {/* Touch devices: inline preview */}
              {!hover && (
                <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-card">
                  <Image src={service.image} alt="" fill sizes="100vw" className="object-cover object-top" />
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {hover && (
        <motion.div aria-hidden="true" style={{ x: sx, y: sy }} className="pointer-events-none fixed left-0 top-0 z-30 hidden md:block">
          <AnimatePresence>
            {current && (
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
