import { LiquidView } from '@/components/liquid/LiquidView';

/** A small liquid moment sitting on the seam between two sections. Adds no height. */
export function LiquidDivider() {
  return (
    <div aria-hidden="true" className="relative h-0">
      <LiquidView mode="drop" className="absolute left-1/2 top-0 h-[clamp(9rem,14vw,13rem)] w-[min(34rem,86vw)] -translate-x-1/2 -translate-y-1/2" />
    </div>
  );
}
