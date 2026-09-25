/**
 * Prices are written once in SAR (see content/offer) and shown in the visitor's own currency.
 *
 * No cookie is involved: the privacy page promises none for visitors. /api/geo reads Vercel's
 * `x-vercel-ip-country` and useCurrency() asks it once after the page has loaded, so the pages
 * stay statically cached, search engines still see a real price in the HTML, and nothing is
 * stored on the visitor's device.
 *
 * Rates are a fixed table, not a live feed: a starting price that moves every day looks unstable,
 * and there is nothing here that can fail at request time. The Gulf currencies are pegged to the
 * dollar, so those are exact and never need touching. GBP, EUR and KWD float — they are marked
 * `approx` and shown with a ≈. Refresh them when they have drifted enough to matter.
 */

export type CurrencyCode = 'SAR' | 'AED' | 'QAR' | 'KWD' | 'BHD' | 'OMR' | 'USD' | 'GBP' | 'EUR';

type Currency = {
  /** units of this currency per 1 USD */
  perUSD: number;
  /** what the number is rounded to, so a starting price reads as a price */
  step: number;
  symbol: { en: string; ar: string };
  /** symbol before the number (en side) or after it */
  suffix?: boolean;
  /** not pegged to the dollar — shown with a ≈ */
  approx?: boolean;
};

/** Pegged rates are official and fixed. Floating rates last checked 22 Sep 2026. */
export const CURRENCIES: Record<CurrencyCode, Currency> = {
  SAR: { perUSD: 3.75, step: 50, symbol: { en: 'SAR', ar: 'ر.س' }, suffix: true },
  AED: { perUSD: 3.6725, step: 50, symbol: { en: 'AED', ar: 'د.إ' }, suffix: true },
  QAR: { perUSD: 3.64, step: 50, symbol: { en: 'QAR', ar: 'ر.ق' }, suffix: true },
  BHD: { perUSD: 0.376, step: 5, symbol: { en: 'BHD', ar: 'د.ب' }, suffix: true },
  OMR: { perUSD: 0.3845, step: 5, symbol: { en: 'OMR', ar: 'ر.ع' }, suffix: true },
  KWD: { perUSD: 0.307, step: 5, symbol: { en: 'KWD', ar: 'د.ك' }, suffix: true, approx: true },
  USD: { perUSD: 1, step: 10, symbol: { en: '$', ar: '$' } },
  GBP: { perUSD: 0.79, step: 10, symbol: { en: '£', ar: '£' }, approx: true },
  EUR: { perUSD: 0.92, step: 10, symbol: { en: '€', ar: '€' }, approx: true },
};

export const isCurrency = (v: string): v is CurrencyCode => v in CURRENCIES;

const EURO_COUNTRIES = 'AT BE HR CY EE FI FR DE GR IE IT LV LT LU MT NL PT SK SI ES'.split(' ');

/** ISO country code → the currency that visitor should see. Anywhere else pays in dollars. */
export function currencyForCountry(country: string | undefined | null): CurrencyCode | null {
  if (!country) return null;
  const c = country.toUpperCase();
  const direct: Record<string, CurrencyCode> = {
    SA: 'SAR', AE: 'AED', QA: 'QAR', KW: 'KWD', BH: 'BHD', OM: 'OMR', GB: 'GBP',
  };
  if (direct[c]) return direct[c];
  if (EURO_COUNTRIES.includes(c)) return 'EUR';
  return 'USD';
}

/** What a visitor sees before we know where they are: riyals on the Arabic side, dollars on the English one. */
export const defaultCurrency = (locale: 'en' | 'ar'): CurrencyCode => (locale === 'ar' ? 'SAR' : 'USD');

/** Is this currency floating, so the converted price is only close? */
export const isApprox = (code: CurrencyCode) => Boolean(CURRENCIES[code].approx);

/**
 * Convert a SAR amount and render it, rounded to the currency's step so it reads as a price.
 * Floating currencies get a ≈; pass `bare` when composing a range, so the ≈ is written once
 * in front of the whole thing instead of on every number.
 */
export function formatMoney(sar: number, code: CurrencyCode, locale: 'en' | 'ar', bare = false) {
  const cur = CURRENCIES[code];
  const n = formatAmount(sar, code);
  const sym = cur.symbol[locale];
  // A no-break space keeps the symbol on the number's line in narrow buttons.
  const body = cur.suffix ? `${n}\u00a0${sym}` : `${sym}${n}`;
  return cur.approx && !bare ? `≈ ${body}` : body;
}

/** The converted, rounded number alone, without a symbol. */
function formatAmount(sar: number, code: CurrencyCode) {
  const cur = CURRENCIES[code];
  const value = Math.round(((sar / CURRENCIES.SAR.perUSD) * cur.perUSD) / cur.step) * cur.step;
  return new Intl.NumberFormat('en-US').format(value);
}

/**
 * A range of two SAR amounts in one currency, written into `between` ("{a} – {b}"). A symbol that
 * follows the number is written once at the end ("3,000 – 6,000 SAR"); one in front goes on both
 * ("$800 – $1,600"). A floating currency gets a single ≈ in front of the whole range.
 */
export function formatMoneyRange(lo: number, hi: number, code: CurrencyCode, locale: 'en' | 'ar', between: string) {
  const cur = CURRENCIES[code];
  const a = cur.suffix ? formatAmount(lo, code) : formatMoney(lo, code, locale, true);
  const body = between.replace('{a}', a).replace('{b}', formatMoney(hi, code, locale, true));
  return cur.approx ? `≈ ${body}` : body;
}

/** SAR → USD, rounded to the nearest ten. Used where a price is baked into a sentence. */
export const toUSD = (sar: number) => Math.round(sar / CURRENCIES.SAR.perUSD / 10) * 10;

