/** One shared, smoothed mouse position for every liquid view (-1..1, y up). */
export const liquidPointer = { x: 0, y: 0, sx: 0, sy: 0 };

let bound = false;

export function bindLiquidPointer() {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      liquidPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      liquidPointer.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true },
  );
}

export function stepLiquidPointer(delta: number) {
  const k = 1 - Math.exp(-delta * 2);
  liquidPointer.sx += (liquidPointer.x - liquidPointer.sx) * k;
  liquidPointer.sy += (liquidPointer.y - liquidPointer.sy) * k;
}
