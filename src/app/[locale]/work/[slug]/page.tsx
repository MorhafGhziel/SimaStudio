import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Check } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons';
import { AnchorButton, LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { dictionary } from '@/content/dictionary';
import { getProject, projects } from '@/content/projects';
import { studio, whatsappUrl } from '@/content/site';
import { getApprovedTestimonials } from '@/lib/server/testimonials';
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
      <p className="text-xl leading-relaxed text-[#dcdbd6] md:col-span-8 sm:text-2xl">{text}</p>
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
  // The client's own approved review, matched by the brand they typed in the review form.
  const keys = project.reviewBrand?.map((k) => k.toLowerCase()) ?? [];
  const review = keys.length ? (await getApprovedTestimonials(50)).find((r) => keys.some((k) => `${r.brand ?? ''} ${r.name}`.toLowerCase().includes(k))) : undefined;

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
          {project.live && (
            <a href={project.live} target="_blank" rel="noopener noreferrer" data-cursor="open" className="group mt-7 inline-flex items-center gap-2 border-b border-accent/50 pb-1 text-paper transition-colors hover:text-accent">
              <span dir="ltr">{project.live.replace(/^https?:\/\/(www\.)?/, '').replace(/\/.*$/, '')}</span>
              <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" strokeWidth={1.6} />
            </a>
          )}
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
          <p className="mt-6 max-w-[70ch] text-xs text-faint">{project.client ? cs.clientNote : cs.disclaimer}</p>
        </Reveal>
      </header>

      <Reveal className="container-x">
        <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line">
          <Image src={project.video ? `${project.video}-poster.jpg` : `/work/${slug}-hero.jpg`} alt={`${project.name} — ${cs.desktop}`} fill priority sizes="(min-width: 1536px) 96rem, 100vw" className="object-cover object-top" />
          {project.video && (
            <video autoPlay muted loop playsInline preload="metadata" aria-hidden="true" className="absolute inset-0 size-full object-cover object-top motion-reduce:hidden">
              <source src={`${project.video}.mp4`} type="video/mp4" />
            </video>
          )}
        </div>
      </Reveal>

      {/* 2–5 · Story */}
      <div className="container-x mt-20 sm:mt-28">
        <Block label={cs.overview} text={project.overview[locale]} />
        <Block label={cs.challenge} text={project.challenge[locale]} />
        <Block label={cs.concept} text={project.concept[locale]} />
        <Block label={cs.design} text={project.design[locale]} />
      </div>

      {/* The site we replaced, shown only with the client's permission */}
      {project.before && (
        <section className="container-x" aria-labelledby="before-after">
          <div className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
            <h2 id="before-after" className="eyebrow md:col-span-3">
              {cs.beforeAfter}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 md:col-span-9">
              {[
                { src: project.before, label: d.beforeAfter.before, tone: 'text-faint' },
                { src: `/work/${slug}-hero.jpg`, label: d.beforeAfter.after, tone: 'text-accent' },
              ].map((shot) => (
                <Reveal key={shot.src}>
                  <figure>
                    <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line">
                      <Image src={shot.src} alt={`${project.name} — ${shot.label}`} fill sizes="(min-width: 768px) 36vw, 100vw" className="object-cover object-top" />
                    </div>
                    <figcaption className={`mt-3 text-sm ${shot.tone}`}>{shot.label}</figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* What the client received */}
      {project.deliverables && (
        <section className="container-x" aria-labelledby="delivered">
          <Reveal className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
            <h2 id="delivered" className="eyebrow md:col-span-3">
              {cs.delivered}
            </h2>
            <ul className="grid gap-x-10 gap-y-5 text-lg text-[#dcdbd6] md:col-span-9 md:grid-cols-2">
              {project.deliverables.map((item) => (
                <li key={item.en} className="flex gap-3">
                  <Check className="mt-1.5 size-5 shrink-0 text-accent" strokeWidth={1.6} />
                  {item[locale]}
                </li>
              ))}
            </ul>
          </Reveal>
        </section>
      )}

      {/* Measured results: only real numbers from the client */}
      {project.results && project.results.length > 0 && (
        <section className="container-x" aria-labelledby="results">
          <Reveal className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
            <h2 id="results" className="eyebrow md:col-span-3">
              {cs.results}
            </h2>
            <dl className="grid gap-8 sm:grid-cols-3 md:col-span-9">
              {project.results.map((r) => (
                <div key={r.label.en}>
                  <dd className="display-md text-accent" dir="ltr">
                    {r.value}
                  </dd>
                  <dt className="mt-2 text-mute">{r.label[locale]}</dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </section>
      )}

      {/* The client's own words */}
      {review && (
        <section className="container-x" aria-labelledby="client-words">
          <Reveal className="grid gap-6 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
            <h2 id="client-words" className="eyebrow md:col-span-3">
              {cs.clientWords}
            </h2>
            <figure className="md:col-span-8">
              <p className="text-sm tracking-[0.2em] text-accent" aria-label={`${review.rating} / 5`} dir="ltr">
                {'★'.repeat(review.rating)}
              </p>
              <blockquote className="mt-5 text-2xl leading-relaxed text-paper sm:text-[1.75rem]" dir="auto">
                “{review.message}”
              </blockquote>
              <figcaption className="mt-6 text-mute">
                <span className="text-paper">{review.name}</span>
                {review.brand && <span> · {review.brand}</span>}
              </figcaption>
            </figure>
          </Reveal>
        </section>
      )}

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
              <li key={t} className="rounded-pill border border-line px-4 py-2 text-sm text-[#d0cfca]">
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
        </div>
      </section>

      {/* Want the same? */}
      <section className="container-x mt-20 sm:mt-28" aria-labelledby="want">
        <Reveal>
          <div className="flex flex-col gap-7 rounded-card border border-accent/40 bg-accent/[0.05] p-8 sm:p-12 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 id="want" className="display-md max-w-[18ch]">
                {cs.want}
              </h2>
              <p className="mt-4 max-w-[46ch] text-mute">{cs.wantText}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={whatsappUrl(cs.waText.replace('{project}', name))} target="_blank" rel="noopener noreferrer" data-cursor="open" className="inline-flex h-12 items-center gap-2 rounded-pill bg-accent px-6 font-medium text-ink transition-colors hover:bg-paper sm:h-13 sm:px-7">
                <WhatsAppIcon className="size-4" /> {cs.askWhatsapp}
              </a>
              <LinkButton href={`${href(locale)}#contact`} variant="outline">
                {d.work.all}
              </LinkButton>
            </div>
          </div>
        </Reveal>
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
