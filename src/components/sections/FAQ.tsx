'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Plus } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { faqs } from '@/content/offer';
import { cn } from '@/lib/utils';

export function FAQ() {
  const { locale, dict } = useLocale();
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section aria-labelledby="faq-title" className="section-y border-t border-line">
      <div className="container-x grid gap-14 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <RevealLines lines={[dict.faq.title]} className="display-md max-w-[10ch]" />
          <span id="faq-title" className="sr-only">
            {dict.faq.title}
          </span>
        </div>
        <Reveal className="lg:col-span-8">
          <ul className="border-t border-line">
            {faqs.map((item, i) => {
              const isOpen = open === i;
              return (
                <li key={item.q.en} className="border-b border-line">
                  <h3>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={`faq-${i}`}
                      onClick={() => setOpen(isOpen ? null : i)}
                      className="flex w-full items-center justify-between gap-6 py-6 text-start text-lg transition-colors hover:text-violet-soft sm:text-xl"
                    >
                      {item.q[locale]}
                      <Plus className={cn('size-5 shrink-0 transition-transform duration-500 ease-out', isOpen && 'rotate-45 text-violet-soft')} strokeWidth={1.4} />
                    </button>
                  </h3>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={`faq-${i}`}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="max-w-[60ch] pb-7 text-mute">{item.a[locale]}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
