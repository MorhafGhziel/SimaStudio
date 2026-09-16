import { faqs, packages } from '@/content/offer';
import { instagramUrl, launchOffer, launchOfferEnds, studio, tiktokUrl } from '@/content/site';
import type { Locale } from '@/lib/i18n';

function Script({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function StudioJsonLd({ locale }: { locale: Locale }) {
  const offer = launchOffer();

  return (
    <>
      <Script
        data={{
          '@context': 'https://schema.org',
          '@type': 'ProfessionalService',
          '@id': `${studio.url}/#studio`,
          name: 'SIMA',
          alternateName: studio.arName,
          url: `${studio.url}/${locale}`,
          email: studio.email,
          description:
            locale === 'ar'
              ? 'استوديو رقمي لتصميم وتطوير المواقع والمتاجر الإلكترونية والتجارب التفاعلية.'
              : 'Digital studio designing and building websites, e-commerce and interactive experiences for ambitious brands.',
          knowsAbout: ['Website design', 'Web development', 'E-commerce', 'Interactive 3D websites', 'Arabic RTL websites'],
          sameAs: [instagramUrl, tiktokUrl],
          // Advertise the price a client actually pays today, so search results match the site.
          makesOffer: packages.map((p) => ({
            '@type': 'Offer',
            name: `${p.name} website package`,
            description: p.tagline[locale],
            price: offer.active ? p.launchPrice : p.price,
            priceCurrency: 'SAR',
            ...(offer.active ? { priceValidUntil: launchOfferEnds.slice(0, 10) } : {}),
          })),
        }}
      />
      <Script
        data={{
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q[locale], acceptedAnswer: { '@type': 'Answer', text: f.a[locale] } })),
        }}
      />
    </>
  );
}
