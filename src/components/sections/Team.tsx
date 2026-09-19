import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { dictionary } from '@/content/dictionary';
import { team } from '@/content/site';
import type { Locale } from '@/lib/i18n';

/**
 * Who is behind the studio. A buyer asked to pay half upfront wants a name and a face first.
 * Renders nothing until `team` in content/site has real people in it.
 */
export function Team({ locale }: { locale: Locale }) {
  if (team.length === 0) return null;
  const d = dictionary[locale].team;

  return (
    <section id="about" aria-labelledby="about-title" className="section-y border-t border-line">
      <div className="container-x grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow">{d.kicker}</p>
          <h2 id="about-title" className="display-lg mt-5 max-w-[12ch]">
            {d.title}
          </h2>
          <p className="mt-6 max-w-[40ch] text-lg text-mute">{d.text}</p>
        </Reveal>
        <ul className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
          {team.map((person) => (
            <li key={person.name.en}>
              <Reveal className="flex h-full flex-col rounded-card border border-line bg-ink-2 p-5">
                <div className="relative aspect-[4/5] overflow-hidden rounded-[0.9rem] bg-ink-3">
                  <Image src={person.photo} alt={person.name[locale]} fill sizes="(min-width: 1024px) 26vw, (min-width: 640px) 44vw, 100vw" className="object-cover" />
                </div>
                <h3 className="mt-5 text-2xl font-medium tracking-[-0.02em]">{person.name[locale]}</h3>
                <p className="mt-1 text-sm text-accent">
                  {person.role[locale]} · {person.city[locale]}
                </p>
                <p className="mt-4 text-mute">{person.bio[locale]}</p>
                {person.linkedin && (
                  <a href={person.linkedin} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm text-paper transition-colors hover:text-accent">
                    LinkedIn <ArrowUpRight className="size-4" strokeWidth={1.6} />
                  </a>
                )}
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
