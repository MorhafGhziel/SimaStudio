'use client';

import { LiquidMetal } from '@paper-design/shaders-react';
import { useReducedMotion } from 'motion/react';

/** The SIMA mark in liquid metal (Paper Shaders, Apache-2.0). Loaded client-side only. */
export default function HeroMark() {
  const reduce = useReducedMotion();
  return (
    <LiquidMetal
      image="/brand/sima-mark.svg"
      colorBack="#00000000"
      colorTint="#d2bc98"
      repetition={2.2}
      softness={0.12}
      shiftRed={0.25}
      shiftBlue={0.25}
      distortion={0.08}
      contour={0.45}
      angle={70}
      speed={reduce ? 0 : 0.7}
      frame={reduce ? 12000 : 0}
      scale={0.72}
      maxPixelCount={1600 * 1600}
      style={{ width: '100%', height: '100%' }}
    />
  );
}
