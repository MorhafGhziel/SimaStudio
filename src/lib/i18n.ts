export type Locale = 'en' | 'ar';
export type T = { en: string; ar: string };

/** English is the default language: `/` redirects to `/en`. */
export const defaultLocale: Locale = 'en';
export const locales: Locale[] = ['en', 'ar'];
export const isLocale = (value: string): value is Locale => (locales as string[]).includes(value);
export const dirOf = (locale: Locale) => (locale === 'ar' ? 'rtl' : 'ltr');
export const otherLocale = (locale: Locale): Locale => (locale === 'ar' ? 'en' : 'ar');

/** Locale-prefixed path: href('en', '/work/noble') → '/en/work/noble'. */
export const href = (locale: Locale, path = '') => `/${locale}${path}`;

