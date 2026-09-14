'use client';

import Image from 'next/image';
import { useCallback, useRef, useState } from 'react';
import { useLocale } from '@/components/providers/LocaleProvider';
import { Reveal, RevealLines } from '@/components/ui/Reveal';

/** Drag (or use the arrow keys) to compare an outdated site with the redesign. Always left = before. */
export function BeforeAfter() {
  const { dict } = useLocale();
  const frame = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromPointer = useCallback((clientX: number) => {
    const r = frame.current?.getBoundingClientRect();
    if (!r) return;
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  }, []);

  return (
    <section aria-labelledby="ba-title" className="section-y border-t border-line">
      <div className="container-x">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <RevealLines lines={[dict.beforeAfter.line1, dict.beforeAfter.line2]} className="display-lg" />
          <Reveal delay={0.15}>
            <p id="ba-title" className="text-sm text-faint">
              {dict.beforeAfter.note}
            </p>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-14 sm:mt-20">
          <div
            ref={frame}
            dir="ltr"
            data-cursor="drag"
            className="relative aspect-[16/10] touch-pan-y select-none overflow-hidden rounded-card border border-line bg-ink-2"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setFromPointer(e.clientX);
            }}
            onPointerMove={(e) => dragging.current && setFromPointer(e.clientX)}
            onPointerUp={() => (dragging.current = false)}
            onPointerCancel={() => (dragging.current = false)}
          >
            <Image src="/work/after.jpg" alt={dict.beforeAfter.after} fill sizes="(min-width: 1024px) 90vw, 100vw" className="object-cover object-top" draggable={false} />
            <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
              <Image src="/work/before.jpg" alt={dict.beforeAfter.before} fill sizes="(min-width: 1024px) 90vw, 100vw" className="object-cover object-top" draggable={false} />
            </div>

            <span className="pointer-events-none absolute start-4 top-4 rounded-pill bg-ink/70 px-3 py-1 text-xs text-paper backdrop-blur">{dict.beforeAfter.before}</span>
            <span className="pointer-events-none absolute end-4 top-4 rounded-pill bg-paper px-3 py-1 text-xs text-ink">{dict.beforeAfter.after}</span>

            <div className="pointer-events-none absolute inset-y-0 w-px bg-paper" style={{ left: `${pos}%` }}>
              <span className="absolute left-1/2 top-1/2 grid size-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-paper text-ink shadow-[0_10px_30px_rgb(0_0_0/0.5)]">
                <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                  <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
                </svg>
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={Math.round(pos)}
              onChange={(e) => setPos(Number(e.target.value))}
              aria-label={dict.beforeAfter.drag}
              className="absolute inset-x-0 bottom-0 h-10 w-full cursor-pointer opacity-0 focus-visible:opacity-100"
            />
          </div>
          <p className="mt-4 text-center text-xs text-faint">{dict.beforeAfter.drag}</p>
        </Reveal>
      </div>
    </section>
  );
}
