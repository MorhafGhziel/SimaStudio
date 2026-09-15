import { Contact } from '@/components/sections/Contact';
import { FAQ } from '@/components/sections/FAQ';
import { Hero } from '@/components/sections/Hero';
import { Packages } from '@/components/sections/Packages';
import { Process } from '@/components/sections/Process';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Services } from '@/components/sections/Services';
import { StudioJsonLd } from '@/components/seo/JsonLd';
import { isLocale } from '@/lib/i18n';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  return (
    <>
      <Hero />
      <SelectedWork />
      <Services />
      <Packages />
      <Process />
      <FAQ />
      <Contact />
      {isLocale(locale) && <StudioJsonLd locale={locale} />}
    </>
  );
}
