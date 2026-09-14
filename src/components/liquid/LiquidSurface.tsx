'use client';

import { useFrame } from '@react-three/fiber';
import { useMemo, useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { liquidPointer } from './pointer';
import { framing, liquidFragment, liquidVertex, type LiquidMode } from './shader';

const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

type Props = {
  mode: LiquidMode;
  /** Element the liquid is drawn into; defaults to the canvas itself. */
  track?: RefObject<HTMLElement | null>;
  mirror?: boolean;
  reduced?: boolean;
  lite?: boolean;
  opacity?: number;
  spin?: RefObject<number>;
};

/** A full-view quad running the liquid shader. Works inside a drei <View> or its own <Canvas>. */
export function LiquidSurface({ mode, track, mirror = false, reduced = false, lite = false, opacity = 1, spin }: Props) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const introStart = useRef<number | null>(null);
  const fragmentShader = useMemo(() => liquidFragment(mode, lite), [mode, lite]);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2() },
      uScroll: { value: 0 },
      uIntro: { value: reduced ? 1 : 0 },
      uFrame: { value: new THREE.Vector3(0, 0, 1) },
      uMirror: { value: mirror ? -1 : 1 },
      uSpin: { value: 0 },
      uOpacity: { value: opacity },
    }),
    [mirror, reduced, opacity],
  );

  useFrame((state) => {
    const m = material.current;
    if (!m) return;
    const el = track?.current ?? state.gl.domElement;
    const rect = el.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const vh = window.innerHeight;
    const now = state.clock.elapsedTime;
    if (introStart.current === null && rect.bottom > 0 && rect.top < vh) introStart.current = now;

    const dpr = state.gl.getPixelRatio();
    const scroll = reduced ? 0 : (rect.top + rect.height / 2 - vh / 2) / vh;
    const [x, y, z] = framing(mode, rect.width, rect.height, scroll);
    const u = m.uniforms;
    u.uTime.value = reduced ? 14 : now + 20;
    (u.uRes.value as THREE.Vector2).set(rect.width * dpr, rect.height * dpr);
    (u.uPointer.value as THREE.Vector2).set(reduced ? 0 : liquidPointer.sx, reduced ? 0 : liquidPointer.sy);
    u.uScroll.value = scroll;
    u.uIntro.value = reduced ? 1 : introStart.current === null ? 0 : ease((now - introStart.current) / 2.6);
    (u.uFrame.value as THREE.Vector3).set(x, y, z);
    u.uSpin.value = spin?.current ?? 0;
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial ref={material} vertexShader={liquidVertex} fragmentShader={fragmentShader} uniforms={uniforms} blending={THREE.NoBlending} depthTest={false} depthWrite={false} />
    </mesh>
  );
}
