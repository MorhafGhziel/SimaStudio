'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { WhatsAppIcon } from '@/components/icons';
import { LiquidView } from '@/components/liquid/LiquidView';
import { AnchorButton, LinkButton } from '@/components/ui/Button';
import { Reveal, RevealLines } from '@/components/ui/Reveal';
import { whatsappMessage, whatsappUrl } from '@/content/site';
import { href } from '@/lib/i18n';

export function FinalCTA() {
  const { locale, dict } = useLocale();

  return (
    <section id="final-cta" aria-labelledby="final-title" className="relative isolate overflow-hidden border-t border-line py-[clamp(8rem,6rem+12vw,16rem)]">
      {/* Liquid halo around the call to action, with a quiet pool of dark behind the words */}
      <LiquidView mode="cta" className="absolute inset-0" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(44%_40%_at_50%_50%,rgba(8,8,10,0.78),transparent_85%)]" />
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
            <AnchorButton href={whatsappUrl(whatsappMessage[locale])} target="_blank" rel="noopener noreferrer" variant="outline" className="bg-ink/40 backdrop-blur-sm">
              <span className="flex items-center gap-2">
                <WhatsAppIcon className="size-4 text-violet-soft" />
                {dict.cta.whatsapp}
              </span>
            </AnchorButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
