import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { AnchorButton, LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { dictionary } from '@/content/dictionary';
import { getProject, projects } from '@/content/projects';
import { studio } from '@/content/site';
import { href, isLocale, locales } from '@/lib/i18n';

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => projects.map((p) => ({ locale, slug: p.slug })));

export async function generateMetadata({ params }: PageProps<'/[locale]/work/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) return {};
  const title = locale === 'ar' ? `${project.arName} — ${project.kind.ar}` : `${project.name} — ${project.kind.en}`;
  return {
    title,
    description: project.summary[locale],
    alternates: { canonical: `/${locale}/work/${slug}`, languages: { ar: `/ar/work/${slug}`, en: `/en/work/${slug}`, 'x-default': `/ar/work/${slug}` } },
    openGraph: { title: `${title} — SIMA`, description: project.summary[locale], images: [{ url: `/work/${slug}-hero.jpg`, width: 1600, height: 1000 }] },
  };
}

function Block({ label, text }: { label: string; text: string }) {
  return (
    <Reveal className="grid gap-4 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
      <h2 className="eyebrow md:col-span-3">{label}</h2>
      <p className="text-xl leading-relaxed text-paper/90 md:col-span-8 sm:text-2xl">{text}</p>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: PageProps<'/[locale]/work/[slug]'>) {
  const { locale, slug } = await params;
  const project = getProject(slug);
  if (!isLocale(locale) || !project) notFound();
  const d = dictionary[locale];
  const cs = d.caseStudy;
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  const name = locale === 'ar' ? project.arName : project.name;

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CreativeWork',
            name: project.name,
            alternateName: project.arName,
            description: project.summary[locale],
            creator: { '@type': 'Organization', name: 'SIMA', url: studio.url },
            dateCreated: project.year,
            image: `${studio.url}/work/${slug}-hero.jpg`,
            url: `${studio.url}/${locale}/work/${slug}`,
          }).replace(/</g, '\\u003c'),
        }}
      />

      {/* 1 · Hero */}
      <header className="container-x pb-12 pt-[calc(var(--nav)+3rem)] sm:pt-[calc(var(--nav)+5rem)]">
        <Link href={`${href(locale)}#work`} className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-paper">
          <ArrowLeft className="size-4 rtl:-scale-x-100" strokeWidth={1.6} /> {cs.back}
        </Link>
        <Reveal>
          <p className="mt-10 text-sm text-faint" dir="ltr">
            {project.number} / {String(projects.length).padStart(2, '0')}
          </p>
          <h1 className="display-xl mt-4 max-w-[14ch]">{name}</h1>
          <p className="mt-6 max-w-[44ch] text-xl text-mute">{project.summary[locale]}</p>
        </Reveal>
        <Reveal delay={0.1}>
          <dl className="mt-12 grid grid-cols-2 gap-6 border-t border-line pt-6 text-sm sm:grid-cols-4">
            <div>
              <dt className="text-faint">{cs.industry}</dt>
              <dd className="mt-1">{project.industry[locale]}</dd>
            </div>
            <div>
              <dt className="text-faint">{cs.type}</dt>
              <dd className="mt-1">{project.kind[locale]}</dd>
            </div>
            <div>
              <dt className="text-faint">{cs.year}</dt>
              <dd className="mt-1">{project.year}</dd>
            </div>
            <div>
              <dt className="text-faint">{d.work.services}</dt>
              <dd className="mt-1">{project.services.map((s) => s[locale]).join(', ')}</dd>
            </div>
          </dl>
          <p className="mt-6 max-w-[70ch] text-xs text-faint">{cs.disclaimer}</p>
        </Reveal>
      </header>

      <Reveal className="container-x">
        <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line">
          <Image src={`/work/${slug}-hero.jpg`} alt={`${project.name} — ${cs.desktop}`} fill priority sizes="(min-width: 1536px) 96rem, 100vw" className="object-cover object-top" />
        </div>
      </Reveal>

      {/* 2–5 · Story */}
      <div className="container-x mt-20 sm:mt-28">
        <Block label={cs.overview} text={project.overview[locale]} />
        <Block label={cs.challenge} text={project.challenge[locale]} />
        <Block label={cs.concept} text={project.concept[locale]} />
        <Block label={cs.design} text={project.design[locale]} />
      </div>

      <div className="container-x mt-8 grid gap-6 md:grid-cols-2">
        {(['detail', 'extra'] as const).map((shot) => (
          <Reveal key={shot}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line">
              <Image src={`/work/${slug}-${shot}.jpg`} alt={`${project.name} — ${cs.design}`} fill sizes="(min-width: 768px) 48vw, 100vw" className="object-cover object-top" />
            </div>
          </Reveal>
        ))}
      </div>

      {/* 6 · Key interactions */}
      <section className="container-x mt-28 sm:mt-36" aria-labelledby="interactions">
        <Reveal>
          <h2 id="interactions" className="display-md">
            {cs.interactions}
          </h2>
        </Reveal>
        <ol className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line md:grid-cols-3">
          {project.interactions.map((it, i) => (
            <li key={it.title.en} className="bg-ink p-8 sm:p-10">
              <span className="text-sm text-faint" dir="ltr">
                0{i + 1}
              </span>
              <h3 className="mt-6 text-2xl font-medium tracking-[-0.02em]">{it.title[locale]}</h3>
              <p className="mt-3 text-mute">{it.text[locale]}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* 7 · Responsive views */}
      <section className="container-x mt-28 sm:mt-36" aria-labelledby="responsive">
        <Reveal>
          <h2 id="responsive" className="display-md">
            {cs.responsive}
          </h2>
        </Reveal>
        <div className="mt-12 grid items-end gap-6 md:grid-cols-12">
          <Reveal className="md:col-span-8">
            <p className="mb-3 text-sm text-faint">{cs.desktop}</p>
            <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line">
              <Image src={`/work/${slug}-hero.jpg`} alt="" fill sizes="(min-width: 768px) 64vw, 100vw" className="object-cover object-top" />
            </div>
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-4">
            <p className="mb-3 text-sm text-faint">{cs.mobile}</p>
            <div className="relative mx-auto aspect-[390/844] max-w-[18rem] overflow-hidden rounded-[2rem] border-4 border-ink-3 shadow-[0_40px_80px_-40px_rgb(0_0_0/0.9)]">
              <Image src={`/work/${slug}-mobile.jpg`} alt={`${project.name} — ${cs.mobile}`} fill sizes="288px" className="object-cover object-top" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8–9 · Technologies & live website */}
      <section className="container-x mt-28 grid gap-10 border-t border-line pt-12 sm:mt-36 md:grid-cols-12">
        <div className="md:col-span-6">
          <h2 className="eyebrow">{cs.tech}</h2>
          <ul className="mt-6 flex flex-wrap gap-2" dir="ltr">
            {project.tech.map((t) => (
              <li key={t} className="rounded-pill border border-line px-4 py-2 text-sm text-paper/85">
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-5 md:col-start-8">
          {project.live ? (
            <>
              <p className="eyebrow">{cs.liveNote}</p>
              <div className="mt-6">
                <AnchorButton href={project.live} target="_blank" rel="noopener noreferrer" arrow>
                  {cs.live}
                </AnchorButton>
              </div>
            </>
          ) : (
            <p className="text-mute">{cs.noLive}</p>
          )}
          <div className="mt-6">
            <LinkButton href={`${href(locale)}#contact`} variant="outline">
              {d.work.all}
            </LinkButton>
          </div>
        </div>
      </section>

      {/* 10 · Next project */}
      <Link href={href(locale, `/work/${next.slug}`)} data-cursor="view" className="group mt-28 block border-t border-line sm:mt-36">
        <div className="container-x grid items-center gap-8 py-16 md:grid-cols-12 md:py-24">
          <div className="md:col-span-6">
            <p className="eyebrow">{cs.next}</p>
            <p className="display-lg mt-4 transition-colors duration-500 group-hover:text-accent">{locale === 'ar' ? next.arName : next.name}</p>
            <p className="mt-3 text-mute">{next.kind[locale]}</p>
            <ArrowUpRight className="mt-8 size-8 text-mute transition-transform duration-700 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-accent rtl:-scale-x-100" strokeWidth={1.2} />
          </div>
          <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line md:col-span-6">
            <Image src={`/work/${next.slug}-hero.jpg`} alt="" fill sizes="(min-width: 768px) 48vw, 100vw" className="object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]" />
          </div>
        </div>
      </Link>
    </article>
  );
}
