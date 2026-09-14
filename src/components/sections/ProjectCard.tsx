'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { useLocale } from '@/components/providers/LocaleProvider';
import type { Project } from '@/content/projects';
import { href } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/** Large editorial project feature. `flip` mirrors image/text on desktop. */
export function ProjectCard({ project, flip = false }: { project: Project; flip?: boolean }) {
  const { locale, dict } = useLocale();
  const reduce = useReducedMotion();
  const url = href(locale, `/work/${project.slug}`);

  return (
    <motion.article
      initial={reduce ? false : { opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 1.1, ease: EASE }}
      className="group grid gap-6 lg:grid-cols-12 lg:gap-10"
    >
      <Link
        href={url}
        data-cursor="view"
        aria-label={`${dict.work.view}: ${project.name}`}
        className={cn('relative block overflow-hidden rounded-card bg-ink-2 lg:col-span-8', flip && 'lg:order-2')}
      >
        <div className="relative aspect-[16/10]">
          <Image
            src={`/work/${project.slug}-hero.jpg`}
            alt={`${project.name} — ${project.kind[locale]}`}
            fill
            sizes="(min-width: 1024px) 64vw, 100vw"
            className="object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]"
          />
        </div>
        <div aria-hidden="true" className="absolute inset-0 rounded-card ring-1 ring-inset ring-line" />
        {/* Mobile screen tucked into the corner */}
        <div className="absolute bottom-4 end-4 hidden w-[17%] overflow-hidden rounded-xl border border-line shadow-[0_24px_48px_-20px_rgb(0_0_0/0.9)] transition-transform duration-[1200ms] ease-out group-hover:-translate-y-2 sm:block">
          <div className="relative aspect-[390/844]">
            <Image src={`/work/${project.slug}-mobile.jpg`} alt="" fill sizes="12vw" className="object-cover object-top" />
          </div>
        </div>
      </Link>

      <div className={cn('flex flex-col lg:col-span-4 lg:py-2', flip && 'lg:order-1')}>
        <div className="flex items-center justify-between text-sm text-mute">
          <span className="relative block overflow-hidden text-paper" dir="ltr">
            <span className="block transition-transform duration-700 ease-out group-hover:-translate-y-full">{project.number}</span>
            <span aria-hidden="true" className="absolute inset-0 translate-y-full text-violet-soft transition-transform duration-700 ease-out group-hover:translate-y-0">
              {project.number}
            </span>
          </span>
          <span>
            {project.industry[locale]} · {project.year}
          </span>
        </div>
        <h3 className="display-md mt-6 transition-transform duration-700 ease-out group-hover:translate-x-1 rtl:group-hover:-translate-x-1">
          <Link href={url} className="outline-none">
            {locale === 'ar' ? project.arName : project.name}
          </Link>
        </h3>
        <p className="mt-2 text-sm text-faint">{dict.work.concept}</p>
        <p className="mt-5 max-w-[40ch] text-mute">{project.summary[locale]}</p>
        <ul className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <li key={tag.en} className="rounded-pill border border-line px-3 py-1 text-xs text-paper/75">
              {tag[locale]}
            </li>
          ))}
        </ul>
        <dl className="mt-8 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm">
          <div>
            <dt className="text-faint">{dict.work.services}</dt>
            <dd className="mt-2 space-y-1 text-paper/80">
              {project.services.map((s) => (
                <span key={s.en} className="block">
                  {s[locale]}
                </span>
              ))}
            </dd>
          </div>
          <div>
            <dt className="text-faint">{dict.work.tech}</dt>
            <dd className="mt-2 space-y-1 text-paper/80" dir="ltr">
              {project.tech.slice(0, 3).map((t) => (
                <span key={t} className={cn('block', locale === 'ar' && 'text-right')}>
                  {t}
                </span>
              ))}
            </dd>
          </div>
        </dl>
        <Link href={url} className="mt-auto inline-flex items-center gap-2 self-start pt-8 text-sm text-paper transition-colors hover:text-violet-soft">
          {dict.work.view}
          <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:-scale-x-100" strokeWidth={1.6} />
        </Link>
      </div>
    </motion.article>
  );
}
