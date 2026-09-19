/** Package CTAs pre-select the budget range in the contact form and tell it which package was clicked. */
export const PACKAGE_EVENT = 'sima:package';
export type PackagePick = { budget: number; pkg: string };

/**
 * Upper bound in SAR of each budget range, in the same order as `contact.budgets` in the
 * dictionary. The entry after the last range is "not sure yet".
 */
const BUDGET_LIMITS = [3000, 6000, 10000, 15000, Infinity];

/** Select the range that contains `price` (SAR), or "not sure yet" for a custom project (`null`). */
export function selectBudget(price: number | null, pkg = '') {
  const budget = price === null ? BUDGET_LIMITS.length : BUDGET_LIMITS.findIndex((limit) => price <= limit);
  window.dispatchEvent(new CustomEvent<PackagePick>(PACKAGE_EVENT, { detail: { budget, pkg } }));
}
