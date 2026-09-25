'use client';

import { fillPrices } from '@/lib/currency';
import type { Locale } from '@/lib/i18n';
import { useCurrency } from '@/lib/useCurrency';

/** A sentence with price() tokens, shown in the visitor's currency (language default on the server). */
export function Priced({ text, locale }: { text: string; locale: Locale }) {
  return <>{fillPrices(text, useCurrency(locale), locale)}</>;
}
