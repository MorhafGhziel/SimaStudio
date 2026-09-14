'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { arcFragment, arcVertex } from './arcShader';

const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

function Horizon({ mirror, reduced }: { mirror: boolean; reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const uniforms = useMemo(
    () => ({
      uTime: { value: reduced ? 14 : 0 },
      uReveal: { value: reduced ? 1 : 0 },
      uMirror: { value: mirror ? 1 : 0 },
      uRes: { value: new THREE.Vector2(1, 1) },
      uPointer: { value: new THREE.Vector2() },
    }),
    [mirror, reduced],
  );

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * (mirror ? -1 : 1);
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mirror, reduced]);

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    const s = smooth.current;
    const time = reduced ? 14 : state.clock.elapsedTime;
    const k = 1 - Math.exp(-delta * 3);
    s.x += (pointer.current.x - s.x) * k;
    s.y += (pointer.current.y - s.y) * k;

    m.uniforms.uTime.value = time;
    m.uniforms.uReveal.value = reduced ? 1 : ease((time - 0.2) / 2.4);
    (m.uniforms.uRes.value as THREE.Vector2).set(state.size.width, state.size.height);
    (m.uniforms.uPointer.value as THREE.Vector2).set(s.x, s.y);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial ref={material} vertexShader={arcVertex} fragmentShader={arcFragment} uniforms={uniforms} depthTest={false} depthWrite={false} />
    </mesh>
  );
}

/** Full-bleed WebGL backdrop for the hero only. Pauses when the hero is out of view. */
export default function ArcScene({ mirror, reduced }: { mirror: boolean; reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [dpr, setDpr] = useState(1.25);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 transition-opacity duration-[1200ms] ease-out" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        dpr={[1, dpr]}
        flat
        linear
        frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
        gl={{ antialias: false, alpha: false, powerPreference: 'high-performance' }}
        onCreated={() => setReady(true)}
        style={{ pointerEvents: 'none' }}
      >
        <PerformanceMonitor onDecline={() => setDpr(0.85)} />
        <Horizon mirror={mirror} reduced={reduced} />
      </Canvas>
    </div>
  );
}
