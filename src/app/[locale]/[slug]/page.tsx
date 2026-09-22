import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { FreeReview } from '@/components/sections/FreeReview';
import { AnchorButton, LinkButton } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { dictionary } from '@/content/dictionary';
import { getLanding, landings } from '@/content/landing';
import { getProject } from '@/content/projects';
import { studio, whatsappMessage, whatsappUrl } from '@/content/site';
import { href, isLocale, locales } from '@/lib/i18n';

export const dynamicParams = false;
export const generateStaticParams = () => locales.flatMap((locale) => landings.map((l) => ({ locale, slug: l.slug })));

export async function generateMetadata({ params }: PageProps<'/[locale]/[slug]'>): Promise<Metadata> {
  const { locale, slug } = await params;
  const landing = getLanding(slug);
  if (!isLocale(locale) || !landing) return {};
  return {
    title: landing.title[locale],
    description: landing.description[locale],
    alternates: { canonical: `/${locale}/${slug}`, languages: { ar: `/ar/${slug}`, en: `/en/${slug}`, 'x-default': `/ar/${slug}` } },
    openGraph: { title: `${landing.title[locale]} — SIMA`, description: landing.description[locale], url: `/${locale}/${slug}` },
  };
}

export default async function LandingPage({ params }: PageProps<'/[locale]/[slug]'>) {
  const { locale, slug } = await params;
  const landing = getLanding(slug);
  if (!isLocale(locale) || !landing) notFound();
  const d = dictionary[locale];
  const l = d.landing;
  const related = landing.projects.map(getProject).filter((p) => p !== undefined);

  return (
    <article>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              '@context': 'https://schema.org',
              '@type': 'Service',
              name: landing.title[locale],
              description: landing.description[locale],
              serviceType: landing.title.en,
              provider: { '@id': `${studio.url}/#studio` },
              url: `${studio.url}/${locale}/${slug}`,
              // City pages target one city; the rest are offered across the country.
              areaServed: landing.city
                ? { '@type': 'City', name: landing.city[locale] }
                : { '@type': 'Country', name: locale === 'ar' ? 'السعودية' : 'Saudi Arabia' },
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: l.home, item: `${studio.url}/${locale}` },
                { '@type': 'ListItem', position: 2, name: landing.title[locale], item: `${studio.url}/${locale}/${slug}` },
              ],
            },
            {
              '@context': 'https://schema.org',
              '@type': 'FAQPage',
              mainEntity: landing.faqs.map((f) => ({ '@type': 'Question', name: f.q[locale], acceptedAnswer: { '@type': 'Answer', text: f.a[locale] } })),
            },
          ]).replace(/</g, '\\u003c'),
        }}
      />

      {/* 1 · Hero */}
      <header className="container-x pb-12 pt-[calc(var(--nav)+3rem)] sm:pt-[calc(var(--nav)+5rem)]">
        <Link href={href(locale)} className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-paper">
          <ArrowLeft className="size-4 rtl:-scale-x-100" strokeWidth={1.6} /> {l.home}
        </Link>
        <Reveal>
          {landing.city ? <p className="eyebrow mt-10">{landing.city[locale]}</p> : null}
          <h1 className="display-xl mt-4 max-w-[18ch] text-balance rtl:!leading-[1.3]">{landing.heading[locale]}</h1>
          <div className="mt-8 grid max-w-[68ch] gap-5">
            {landing.intro.map((p) => (
              <p key={p.en} className="text-xl leading-relaxed text-mute">
                {p[locale]}
              </p>
            ))}
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-10 flex flex-wrap gap-3">
          <LinkButton href={`${href(locale)}#contact`} arrow>
            {l.ctaButton}
          </LinkButton>
          <LinkButton href={`${href(locale)}#packages`} variant="outline">
            {l.packages}
          </LinkButton>
        </Reveal>
      </header>

      {/* 2 · Body */}
      <div className="container-x mt-16 sm:mt-24">
        {landing.sections.map((section) => (
          <Reveal key={section.heading.en} className="grid gap-4 border-t border-line py-12 md:grid-cols-12 md:gap-10 md:py-16">
            <h2 className="eyebrow md:col-span-3">{section.heading[locale]}</h2>
            <p className="text-xl leading-relaxed text-[#dcdbd6] md:col-span-8 sm:text-2xl">{section.body[locale]}</p>
          </Reveal>
        ))}
      </div>

      {/* 3 · Related work */}
      {related.length > 0 ? (
        <section className="container-x mt-20 sm:mt-28" aria-labelledby="related">
          <Reveal>
            <h2 id="related" className="display-md">
              {l.work}
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {related.map((project) => (
              <Reveal key={project.slug}>
                <Link href={href(locale, `/work/${project.slug}`)} data-cursor="view" className="group block">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-card border border-line">
                    <Image
                      src={`/work/${project.slug}-hero.jpg`}
                      alt={locale === 'ar' ? project.arName : project.name}
                      fill
                      sizes="(min-width: 768px) 48vw, 100vw"
                      className="object-cover object-top transition-transform duration-[1400ms] ease-out group-hover:scale-[1.04]"
                    />
                  </div>
                  <p className="mt-5 text-2xl font-medium tracking-[-0.02em] transition-colors duration-500 group-hover:text-accent">
                    {locale === 'ar' ? project.arName : project.name}
                  </p>
                  <p className="mt-2 text-mute">{project.summary[locale]}</p>
                </Link>
              </Reveal>
            ))}
          </div>
        </section>
      ) : null}

      {/* 4 · FAQ */}
      <section className="container-x mt-24 sm:mt-32" aria-labelledby="faq">
        <Reveal>
          <h2 id="faq" className="display-md">
            {l.faq}
          </h2>
        </Reveal>
        <dl className="mt-12 grid gap-px overflow-hidden rounded-card border border-line bg-line">
          {landing.faqs.map((f) => (
            <div key={f.q.en} className="bg-ink p-8 sm:p-10">
              <dt className="text-xl font-medium tracking-[-0.02em]">{f.q[locale]}</dt>
              <dd className="mt-3 max-w-[70ch] text-mute">{f.a[locale]}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 5 · The small first step, for a visitor who is not ready to start */}
      <div className="mt-20 sm:mt-28">
        <FreeReview />
      </div>

      {/* 6 · Close */}
      <section className="container-x mt-24 border-t border-line py-16 sm:mt-32 md:py-24" aria-labelledby="landing-cta">
        <Reveal className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 id="landing-cta" className="display-lg">
              {l.ctaTitle}
            </h2>
            <p className="mt-5 max-w-[48ch] text-xl text-mute">{l.ctaText}</p>
          </div>
          <div className="flex flex-wrap items-end gap-3 md:col-span-5 md:justify-end">
            <LinkButton href={`${href(locale)}#contact`} arrow>
              {l.ctaButton}
            </LinkButton>
            <AnchorButton href={whatsappUrl(whatsappMessage[locale])} target="_blank" rel="noopener noreferrer" variant="outline">
              {l.ctaWhatsapp}
            </AnchorButton>
          </div>
        </Reveal>
        <Reveal delay={0.1} className="mt-16 grid gap-px overflow-hidden rounded-card border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {landings
            .filter((other) => other.slug !== slug)
            .map((other) => (
              <Link key={other.slug} href={href(locale, `/${other.slug}`)} className="group bg-ink p-6 transition-colors hover:bg-ink-2">
                <span className="flex items-center justify-between gap-4 text-[0.95rem] text-[#d0cfca] transition-colors group-hover:text-paper">
                  {other.title[locale]}
                  <ArrowUpRight className="size-4 shrink-0 text-faint transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent rtl:-scale-x-100" strokeWidth={1.6} />
                </span>
              </Link>
            ))}
        </Reveal>
      </section>
    </article>
  );
}
