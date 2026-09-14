import { About } from '@/components/sections/About';
import { BeforeAfter } from '@/components/sections/BeforeAfter';
import { Contact } from '@/components/sections/Contact';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Hero } from '@/components/sections/Hero';
import { Industries } from '@/components/sections/Industries';
import { LiquidDivider } from '@/components/sections/LiquidDivider';
import { Packages } from '@/components/sections/Packages';
import { Process } from '@/components/sections/Process';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Services } from '@/components/sections/Services';
import { Value } from '@/components/sections/Value';
import { WhyUs } from '@/components/sections/WhyUs';
import { StudioJsonLd } from '@/components/seo/JsonLd';
import { isLocale } from '@/lib/i18n';

export default async function HomePage({ params }: PageProps<'/[locale]'>) {
  const { locale } = await params;
  return (
    <>
      <Hero />
      <SelectedWork />
      <Value />
      <Services />
      <Industries />
      <LiquidDivider />
      <Packages />
      <BeforeAfter />
      <LiquidDivider />
      <Process />
      <WhyUs />
      <About />
      <FAQ />
      <FinalCTA />
      <Contact />
      {isLocale(locale) && <StudioJsonLd locale={locale} />}
    </>
  );
}
