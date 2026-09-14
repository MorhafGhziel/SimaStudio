'use client';

import { View } from '@react-three/drei';
import { useRef, useState } from 'react';
import type { LiquidMode } from './shader';
import { LiquidSurface } from './LiquidSurface';

export default function LiquidViewInner({ mode, mirror, reduced, opacity }: { mode: LiquidMode; mirror: boolean; reduced: boolean; opacity?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lite] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  return (
    <View ref={ref} className="absolute inset-0">
      <LiquidSurface mode={mode} track={ref} mirror={mirror} reduced={reduced} lite={lite} opacity={opacity} />
    </View>
  );
}
