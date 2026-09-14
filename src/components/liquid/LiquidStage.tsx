'use client';

import { PerformanceMonitor, View } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useState } from 'react';
import { bindLiquidPointer, stepLiquidPointer } from './pointer';

/**
 * Views render with a positive frame priority, which turns off R3F's automatic
 * clear. Clear the whole canvas first each frame so moving views leave no trails.
 */
function FrameStart() {
  useFrame((state, delta) => {
    stepLiquidPointer(delta);
    state.gl.setScissorTest(false);
    state.gl.setClearColor(0x000000, 0);
    state.gl.clear(true, true, false);
  }, -1);
  return null;
}

/** One fixed, transparent canvas behind the page; every <LiquidView> draws into it. */
export default function LiquidStage() {
  const [lite] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [dpr, setDpr] = useState(lite ? 1 : 1.25);
  useEffect(() => bindLiquidPointer(), []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={dpr}
        flat
        linear
        frameloop="always"
        gl={{ alpha: true, antialias: false, premultipliedAlpha: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <FrameStart />
        <PerformanceMonitor onDecline={() => setDpr(lite ? 0.8 : 1)} />
        <View.Port />
      </Canvas>
    </div>
  );
}
