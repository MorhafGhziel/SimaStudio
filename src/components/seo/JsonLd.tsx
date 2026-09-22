import { faqs, packages } from '@/content/offer';
import { instagramUrl, launchOffer, launchOfferEnds, linkedinUrl, studio, tiktokUrl, xUrl } from '@/content/site';
import { toUSD } from '@/lib/currency';
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
          telephone: `+${studio.whatsapp}`,
          // Service-area business: we serve clients remotely, so there is no public street
          // address — only the country and the cities we work in.
          address: { '@type': 'PostalAddress', addressLocality: locale === 'ar' ? 'الرياض' : 'Riyadh', addressCountry: 'SA' },
          areaServed: [
            { '@type': 'City', name: locale === 'ar' ? 'جدة' : 'Jeddah' },
            { '@type': 'City', name: locale === 'ar' ? 'الرياض' : 'Riyadh' },
            { '@type': 'Country', name: locale === 'ar' ? 'السعودية' : 'Saudi Arabia' },
            // we work remotely, so the studio is not limited to where it is based
            { '@type': 'Place', name: locale === 'ar' ? 'عن بُعد — عالميًا' : 'Worldwide (remote)' },
          ],
          availableLanguage: [
            { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
            { '@type': 'Language', name: 'English', alternateName: 'en' },
          ],
          // the site quotes riyals in Arabic and dollars in English, so the schema follows the page
          priceRange: locale === 'ar' ? 'SAR 2,500–8,000' : 'USD 670–2,130',
          currenciesAccepted: locale === 'ar' ? 'SAR' : 'USD',
          description:
            locale === 'ar'
              ? 'استوديو رقمي يصمم ويبني مواقع وتجارب منتجات ثلاثية الأبعاد، بالعربية والإنجليزية، لأي شركة في أي مكان.'
              : 'Digital studio designing and building websites and 3D product experiences in Arabic and English, for companies anywhere.',
          knowsAbout: ['Arabic RTL websites', 'Bilingual websites', 'English websites', 'Company websites', 'B2B websites', '3D product configurators', 'Interactive 3D websites', 'Website design', 'Web development'],
          sameAs: [instagramUrl, tiktokUrl, linkedinUrl, xUrl],
          // Advertise the price a client actually pays today, so search results match the site.
          makesOffer: packages.map((p) => ({
            '@type': 'Offer',
            name: `${p.name} website package`,
            description: p.tagline[locale],
            price: locale === 'ar' ? (offer.active ? p.launchPrice : p.price) : toUSD(offer.active ? p.launchPrice : p.price),
            priceCurrency: locale === 'ar' ? 'SAR' : 'USD',
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
