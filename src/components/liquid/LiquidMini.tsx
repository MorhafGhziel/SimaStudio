'use client';

import { Canvas } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { bindLiquidPointer } from './pointer';
import { LiquidSurface } from './LiquidSurface';

/** Self-contained liquid preview for the Immersive package card — drag to turn it. */
export default function LiquidMini({ running, reduced }: { running: boolean; reduced: boolean }) {
  const spin = useRef(0);
  const drag = useRef<{ x: number; start: number } | null>(null);
  useEffect(() => bindLiquidPointer(), []);

  return (
    <div
      className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, start: spin.current };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (drag.current) spin.current = drag.current.start + (e.clientX - drag.current.x) * 0.012;
      }}
      onPointerUp={() => (drag.current = null)}
      onPointerCancel={() => (drag.current = null)}
    >
      <Canvas dpr={[1, 1.5]} flat linear frameloop={reduced ? 'demand' : running ? 'always' : 'never'} gl={{ alpha: true, antialias: false, premultipliedAlpha: true }}>
        <LiquidSurface mode="card" reduced={reduced} spin={spin} />
      </Canvas>
    </div>
  );
}
