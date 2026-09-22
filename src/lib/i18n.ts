export type Locale = 'en' | 'ar';
export type T = { en: string; ar: string };

/** Arabic is the default language: `/` redirects to `/ar`. */
export const defaultLocale: Locale = 'ar';
export const locales: Locale[] = ['ar', 'en'];
export const isLocale = (value: string): value is Locale => (locales as string[]).includes(value);
export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');
export const otherLocale = (locale: Locale): Locale => (locale === 'ar' ? 'en' : 'ar');

/** Locale-prefixed path: href('en', '/work/noble') → '/en/work/noble'. */
export const href = (locale: Locale, path = '') => `/${locale}${path}`;

/**
 * The riyal is pegged to the dollar at 3.75, so the English prices convert exactly and need no rate feed.
 * Every price in the content files is written in SAR; the English side is converted on the way out.
 */
export const SAR_PER_USD = 3.75;

/** SAR → USD, rounded to the nearest ten so starting prices read as prices, not conversions. */
export const toUSD = (sar: number) => Math.round(sar / SAR_PER_USD / 10) * 10;

/** Prices keep Latin digits in both languages so they scan quickly: riyals in Arabic, dollars in English. */
export function formatPrice(sar: number, locale: Locale) {
  const n = (v: number) => new Intl.NumberFormat('en-US').format(v);
  return locale === 'ar' ? `${n(sar)} ر.س` : `$${n(toUSD(sar))}`;
}
