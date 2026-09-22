'use client';

import { useEffect, useState } from 'react';

import { defaultCurrency, isCurrency, type CurrencyCode } from '@/lib/currency';
import type { Locale } from '@/lib/i18n';

/**
 * The currency this visitor should see.
 *
 * The first render is the same on the server and in the browser — riyals on the Arabic side,
 * dollars on the English one — so the statically cached HTML carries a real price for search
 * engines and for anyone without JavaScript, and hydration matches.
 *
 * After mount the browser asks /api/geo where the connection comes from and the prices re-render
 * in that country's money. Nothing is written to the device: the privacy page promises no cookies
 * for visitors, so the answer is only held in memory and cached by the browser for an hour.
 */
export function useCurrency(locale: Locale): CurrencyCode {
  const [code, setCode] = useState<CurrencyCode>(() => defaultCurrency(locale));

  useEffect(() => {
    let live = true;
    fetch('/api/geo')
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const found = data?.currency;
        if (live && typeof found === 'string' && isCurrency(found)) setCode(found);
      })
      .catch(() => {}); // prices simply stay at the language default
    return () => {
      live = false;
    };
  }, []);

  return code;
}
