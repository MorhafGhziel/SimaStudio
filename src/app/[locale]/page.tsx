import { Contact } from '@/components/sections/Contact';
import { Difference } from '@/components/sections/Difference';
import { FAQ } from '@/components/sections/FAQ';
import { FreeReview } from '@/components/sections/FreeReview';
import { Hero } from '@/components/sections/Hero';
import { Packages } from '@/components/sections/Packages';
import { Process } from '@/components/sections/Process';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Services } from '@/components/sections/Services';
import { Team } from '@/components/sections/Team';
import { Testimonials } from '@/components/sections/Testimonials';
import { StudioJsonLd } from '@/components/seo/JsonLd';
import { isLocale } from '@/lib/i18n';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  return (
    <>
      <Hero />
      <SelectedWork />
      {isLocale(locale) && <Testimonials locale={locale} />}
      <Difference />
      <FreeReview />
      <Services />
      <Packages />
      <Process />
      {isLocale(locale) && <Team locale={locale} />}
      <FAQ />
      <Contact />
      {isLocale(locale) && <StudioJsonLd locale={locale} />}
    </>
  );
}
