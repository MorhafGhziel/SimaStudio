'use client';

import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal, RevealLines } from '@/components/ui/Reveal';

export function About() {
  const { dict } = useLocale();
  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-t border-line">
      <div className="container-x">
        <RevealLines lines={[dict.about.line1, dict.about.line2]} className="display-lg" />
        <span id="about-title" className="sr-only">
          {dict.about.line1} {dict.about.line2}
        </span>
        <div className="mt-14 grid gap-10 md:grid-cols-12">
          <Reveal className="space-y-5 text-lg text-mute md:col-span-6 md:col-start-6 sm:text-xl">
            <p className="text-paper">{dict.about.p1}</p>
            <p>{dict.about.p2}</p>
            <p className="text-base text-faint">{dict.about.based}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
