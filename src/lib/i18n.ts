export type Locale = 'en' | 'ar';
export type T = { en: string; ar: string };

export const locales: Locale[] = ['en', 'ar'];
export const isLocale = (value: string): value is Locale => (locales as string[]).includes(value);
export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');
export const otherLocale = (locale: Locale): Locale => (locale === 'ar' ? 'en' : 'ar');

/** Locale-prefixed path: href('en', '/work/noble') → '/en/work/noble'. */
export const href = (locale: Locale, path = '') => `/${locale}${path}`;

/** Prices keep Latin digits in both languages so they scan quickly. */
export function formatSAR(amount: number, locale: Locale) {
  const n = new Intl.NumberFormat('en-US').format(amount);
  return locale === 'ar' ? `${n} ر.س` : `${n} SAR`;
}
