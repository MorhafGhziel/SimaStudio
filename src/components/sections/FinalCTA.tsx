'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { WhatsAppIcon } from '@/components/icons';
import { AnchorButton, LinkButton } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { whatsappMessage, whatsappUrl } from '@/content/site';
import { href } from '@/lib/i18n';

export function FinalCTA() {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], reduce ? [1, 1, 1] : [0.6, 1.1, 0.9]);

  return (
    <section ref={ref} id="final-cta" aria-labelledby="final-title" className="relative isolate overflow-hidden border-t border-line py-[clamp(8rem,6rem+12vw,16rem)]">
      <motion.div
        aria-hidden="true"
        style={{ scale: glowScale }}
        className="absolute left-1/2 top-1/2 -z-10 aspect-square w-[90vw] max-w-[70rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(214,219,227,0.16),transparent)]"
      />
      <div className="container-x text-center">
        <RevealLines lines={[dict.cta.line1, dict.cta.line2]} className="display-lg mx-auto max-w-[22ch]" />
        <span id="final-title" className="sr-only">
          {dict.cta.line1} {dict.cta.line2}
        </span>
        <Reveal delay={0.2}>
          <p className="mx-auto mt-8 max-w-[40ch] text-lg text-mute sm:text-xl">{dict.cta.text}</p>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <LinkButton href={`${href(locale)}#contact`} arrow>
              {dict.cta.start}
            </LinkButton>
            <AnchorButton href={whatsappUrl(whatsappMessage[locale])} target="_blank" rel="noopener noreferrer" variant="outline">
              <span className="flex items-center gap-2">
                <WhatsAppIcon className="size-4 text-silver" />
                {dict.cta.whatsapp}
              </span>
            </AnchorButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
