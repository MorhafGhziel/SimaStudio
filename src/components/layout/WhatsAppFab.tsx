'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { WhatsAppIcon } from '@/components/icons';
import { whatsappMessage, whatsappUrl } from '@/content/site';

/**
 * Quiet by default (small icon after the hero); expands with a label while
 * the visitor is looking at Packages or Contact, where intent is highest.
 */
export function WhatsAppFab() {
  const { locale, dict } = useLocale();
  const [visible, setVisible] = useState(false);
  const [emphasis, setEmphasis] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    const hot = new Set<Element>();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => (e.isIntersecting ? hot.add(e.target) : hot.delete(e.target)));
        setEmphasis(hot.size > 0);
      },
      { rootMargin: '-35% 0px -35% 0px' },
    );
    ['packages', 'contact', 'final-cta'].forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => {
      window.removeEventListener('scroll', onScroll);
      observer.disconnect();
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.a
          key="fab"
          href={whatsappUrl(whatsappMessage[locale])}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={dict.whatsappFab}
          data-cursor="open"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] end-5 z-40 flex h-12 items-center gap-2 overflow-hidden rounded-pill border border-line bg-ink-2/90 px-3.5 text-paper shadow-[0_18px_40px_-18px_rgb(0_0_0/0.8)] backdrop-blur-md transition-colors hover:border-accent/40"
        >
          <WhatsAppIcon className="size-5 shrink-0 text-accent" />
          <motion.span
            initial={false}
            animate={{ width: emphasis ? 'auto' : 0, opacity: emphasis ? 1 : 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden whitespace-nowrap text-sm"
          >
            {dict.whatsappFab}
          </motion.span>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
