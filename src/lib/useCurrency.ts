'use client';

import { useEffect, useState } from 'react';

import { COOKIE, defaultCurrency, isCurrency, type CurrencyCode } from '@/lib/currency';
import type { Locale } from '@/lib/i18n';

/**
 * The currency this visitor should see.
 *
 * The first render is the same on the server and in the browser — riyals on the Arabic side,
 * dollars on the English one — so the statically cached HTML carries a real price for search
 * engines and for anyone without JavaScript, and hydration matches. After mount we read the
 * `sima_cur` cookie the proxy wrote from the visitor's country and, if it says something else,
 * the prices re-render in their own money.
 */
export function useCurrency(locale: Locale): CurrencyCode {
  const [code, setCode] = useState<CurrencyCode>(() => defaultCurrency(locale));

  useEffect(() => {
    const found = document.cookie
      .split('; ')
      .find((c) => c.startsWith(`${COOKIE}=`))
      ?.slice(COOKIE.length + 1);
    if (found && isCurrency(found)) setCode(found);
  }, []);

  return code;
}
