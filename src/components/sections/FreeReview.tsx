'use client';

import { useState } from 'react';
import { track } from '@/components/analytics/Tracker';
import { WhatsAppIcon } from '@/components/icons';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal } from '@/components/ui/Reveal';
import { whatsappUrl } from '@/content/site';

/**
 * The small first step, for a visitor who is not ready to start a project: send the link of
 * your current site and get three specific notes back. No backend: the link travels in a
 * prefilled WhatsApp message, so the conversation starts where Saudi business already happens.
 */
export function FreeReview() {
  const { dict } = useLocale();
  const r = dict.review;
  const [site, setSite] = useState('');
  const link = site.trim();
  const message = link ? r.waWithLink.replace('{site}', link) : r.waNoLink;

  return (
    <section id="review" aria-labelledby="review-title" className="border-t border-line">
      <div className="container-x py-16 sm:py-20">
        <Reveal>
          <div className="grid gap-8 rounded-card border border-accent/40 bg-accent/[0.05] p-7 sm:p-10 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-6">
              <p className="eyebrow !text-accent">{r.kicker}</p>
              <h2 id="review-title" className="display-md mt-4 max-w-[18ch]">
                {r.title}
              </h2>
              <p className="mt-4 max-w-[46ch] text-mute">{r.text}</p>
            </div>
            <div className="lg:col-span-6">
              <label htmlFor="review-site" className="text-sm text-mute">
                {r.label}
              </label>
              <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                <input
                  id="review-site"
                  type="url"
                  inputMode="url"
                  dir="ltr"
                  autoComplete="url"
                  placeholder="yourcompany.com"
                  value={site}
                  onChange={(e) => setSite(e.target.value)}
                  className="h-12 w-full shrink-0 rounded-pill border border-line bg-ink/60 px-5 text-paper outline-none transition-colors placeholder:text-faint focus:border-accent/70 sm:h-13 sm:w-auto sm:min-w-0 sm:flex-1 sm:shrink"
                />
                <a
                  href={whatsappUrl(message)}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="open"
                  aria-label={r.cta}
                  onClick={() => track('free_review', { with_link: link ? 1 : 0 })}
                  className="inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-pill bg-accent px-6 font-medium text-ink transition-colors hover:bg-paper sm:h-13"
                >
                  <WhatsAppIcon className="size-4" /> {r.cta}
                </a>
              </div>
              <p className="mt-3 text-sm text-faint">{r.note}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
