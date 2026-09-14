'use client';

import { createContext, useContext, type ReactNode } from 'react';
import { dictionary, type Dictionary } from '@/content/dictionary';
import type { Locale } from '@/lib/i18n';

type Ctx = { locale: Locale; dict: Dictionary; dir: 'ltr' | 'rtl' };
const LocaleContext = createContext<Ctx | null>(null);

export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return (
    <LocaleContext.Provider value={{ locale, dict: dictionary[locale] as Dictionary, dir: locale === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used inside <LocaleProvider>');
  return ctx;
}
