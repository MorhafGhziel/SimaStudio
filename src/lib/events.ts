import { formatMoney, formatMoneyRange, type CurrencyCode } from '@/lib/currency';
import type { Dictionary } from '@/content/dictionary';

/** Package CTAs pre-select the budget range in the contact form and tell it which package was clicked. */
export const PACKAGE_EVENT = 'sima:package';
export type PackagePick = { budget: number; pkg: string };

/**
 * Upper bound in SAR of each budget range. The entry after the last range is "not sure yet".
 */
const BUDGET_LIMITS = [3000, 6000, 10000, 15000, Infinity];

/** The budget buttons, in the same currency the packages are shown in, ending with "not sure yet". */
export function budgetLabels(t: Dictionary['contact']['budgets'], code: CurrencyCode, locale: 'en' | 'ar') {
  const ranges = BUDGET_LIMITS.map((hi, i) => {
    if (i === 0) return t.upTo.replace('{x}', formatMoney(hi, code, locale));
    const lo = BUDGET_LIMITS[i - 1];
    if (hi === Infinity) return t.over.replace('{x}', formatMoney(lo, code, locale));
    return formatMoneyRange(lo, hi, code, locale, t.between);
  });
  return [...ranges, t.unsure];
}

/** Select the range that contains `price` (SAR), or "not sure yet" for a custom project (`null`). */
export function selectBudget(price: number | null, pkg = '') {
  const budget = price === null ? BUDGET_LIMITS.length : BUDGET_LIMITS.findIndex((limit) => price <= limit);
  window.dispatchEvent(new CustomEvent<PackagePick>(PACKAGE_EVENT, { detail: { budget, pkg } }));
}
