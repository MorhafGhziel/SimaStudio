/** Package CTAs pre-select the budget in the contact form. */
export const PACKAGE_EVENT = 'sima:package';

export function selectBudget(index: number) {
  window.dispatchEvent(new CustomEvent<number>(PACKAGE_EVENT, { detail: index }));
}
