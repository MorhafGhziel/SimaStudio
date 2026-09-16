import '../globals.css';
import type { Metadata, Viewport } from 'next';
import { notFound } from 'next/navigation';
import { Tracker } from '@/components/analytics/Tracker';
import { Cursor } from '@/components/layout/Cursor';
import { Footer } from '@/components/layout/Footer';
import { Navbar } from '@/components/layout/Navbar';
import { SmoothHash } from '@/components/layout/SmoothHash';
import { WhatsAppFab } from '@/components/layout/WhatsAppFab';
import { LocaleProvider } from '@/components/providers/LocaleProvider';
import { dictionary } from '@/content/dictionary';
import { studio } from '@/content/site';
import { fontVariables } from '@/lib/fonts';
import { dirOf, isLocale, locales } from '@/lib/i18n';

export const dynamicParams = false;
export const generateStaticParams = () => locales.map((locale) => ({ locale }));

export const viewport: Viewport = { themeColor: '#050507', colorScheme: 'dark', width: 'device-width', initialScale: 1, viewportFit: 'cover' };

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const d = dictionary[locale];
  return {
    metadataBase: new URL(studio.url),
    title: { default: d.meta.title, template: `%s — SIMA` },
    description: d.meta.description,
    keywords: ['Website design studio', 'Web development', 'Brand website design', 'E-commerce website design', 'Interactive 3D websites', 'Arabic website design', 'تصميم مواقع', 'تطوير مواقع', 'تصميم متاجر إلكترونية'],
    alternates: { canonical: `/${locale}`, languages: { ar: '/ar', en: '/en', 'x-default': '/ar' } },
    openGraph: {
      type: 'website',
      siteName: 'SIMA',
      title: d.meta.title,
      description: d.meta.description,
      url: `/${locale}`,
      locale: locale === 'ar' ? 'ar_SA' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_SA',
    },
    twitter: { card: 'summary_large_image', title: d.meta.title, description: d.meta.description },
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  return (
    <html lang={locale} dir={dirOf(locale)} className={fontVariables}>
      <body>
        <LocaleProvider locale={locale}>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[200] focus:rounded-pill focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
            {dictionary[locale].skip}
          </a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer locale={locale} />
          <WhatsAppFab />
          <Cursor />
          <SmoothHash />
          <Tracker />
        </LocaleProvider>
      </body>
    </html>
  );
}
