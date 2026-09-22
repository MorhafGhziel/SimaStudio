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

