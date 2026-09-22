import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { dictionary } from '@/content/dictionary';
import { privacy } from '@/content/privacy';
import { studio } from '@/content/site';
import { href, isLocale, locales } from '@/lib/i18n';

export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export async function generateMetadata({ params }: PageProps<'/[locale]/privacy'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: privacy.title[locale],
    description: privacy.description[locale],
    alternates: { canonical: `/${locale}/privacy`, languages: { ar: '/ar/privacy', en: '/en/privacy', 'x-default': '/en/privacy' } },
  };
}

export default async function PrivacyPage({ params }: PageProps<'/[locale]/privacy'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const d = dictionary[locale];
  const updated = new Intl.DateTimeFormat(locale === 'ar' ? 'ar-SA-u-ca-gregory-nu-latn' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(privacy.updated));

  return (
    <article>
      <header className="container-x pb-10 pt-[calc(var(--nav)+3rem)] sm:pt-[calc(var(--nav)+5rem)]">
        <Link href={href(locale)} className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-paper">
          <ArrowLeft className="size-4 rtl:-scale-x-100" strokeWidth={1.6} /> {d.landing.home}
        </Link>
        <Reveal>
          <h1 className="display-xl mt-10 rtl:!leading-[1.3]">{privacy.title[locale]}</h1>
          <p className="mt-8 max-w-[60ch] text-xl leading-relaxed text-[#dcdbd6] sm:text-2xl">{privacy.intro[locale]}</p>
        </Reveal>
      </header>

      <div className="container-x">
        {privacy.sections.map((section) => (
          <Reveal key={section.heading.en} className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-12">
            <h2 className="eyebrow md:col-span-3">{section.heading[locale]}</h2>
            <p className="max-w-[68ch] text-lg leading-relaxed text-[#d0cfca] md:col-span-8">{section.body[locale]}</p>
          </Reveal>
        ))}
        <Reveal className="grid gap-4 border-t border-line py-10 md:grid-cols-12 md:gap-10 md:py-12">
          <h2 className="eyebrow md:col-span-3">{privacy.contact[locale]}</h2>
          <p className="text-lg md:col-span-8">
            <a href={`mailto:${studio.email}`} className="text-accent hover:underline" dir="ltr">
              {studio.email}
            </a>
            <span className="mt-3 block text-sm text-faint">
              {privacy.updatedLabel[locale]}: {updated}
            </span>
          </p>
        </Reveal>
      </div>
    </article>
  );
}
