'use client';

import { Environment, Lightformer, PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * Footer background: a sheet of glossy black liquid satin seen at a grazing angle.
 * The sheet is real geometry displaced on the GPU; its highlights are reflections of
 * long strip lights tinted with the hero's spectrum, so every crest catches a crisp
 * line of coloured light as the surface rolls.
 */

const INK = '#0e0e0f';

// Shared by the displacement and the analytic normal so light follows the folds exactly.
const WAVE = /* glsl */ `
uniform float uTime;
float silkWave(vec2 p) {
  float t = uTime;
  float h = sin(p.x * 0.55 + t * 0.35 + sin(p.y * 0.42 + t * 0.2) * 1.2) * 0.24;
  h += sin(p.x * 1.05 - p.y * 0.7 + t * 0.42) * 0.09;
  h += sin(p.x * 0.22 + p.y * 0.95 - t * 0.24) * 0.17;
  h += sin(p.x * 2.1 + p.y * 1.6 + t * 0.6) * 0.02;
  return h;
}
`;

function Satin({ reduced, lite }: { reduced: boolean; lite: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ x: 0, y: 0 });
  const time = useRef({ value: 8 });

  const material = useMemo(() => {
    const m = new THREE.MeshPhysicalMaterial({
      color: INK,
      metalness: 0.65,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.1,
    });
    m.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = time.current;
      shader.vertexShader = shader.vertexShader
        .replace('#include <common>', `#include <common>\n${WAVE}`)
        .replace(
          '#include <beginnormal_vertex>',
          `float e = 0.02;
          float dx = (silkWave(position.xy + vec2(e, 0.0)) - silkWave(position.xy - vec2(e, 0.0))) / (2.0 * e);
          float dy = (silkWave(position.xy + vec2(0.0, e)) - silkWave(position.xy - vec2(0.0, e))) / (2.0 * e);
          vec3 objectNormal = normalize(vec3(-dx, -dy, 1.0));
          #ifdef USE_TANGENT
            vec3 objectTangent = vec3(tangent.xyz);
          #endif`,
        )
        .replace('#include <begin_vertex>', 'vec3 transformed = vec3(position.xy, silkWave(position.xy));');
    };
    return m;
  }, []);

  useEffect(() => () => material.dispose(), [material]);

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [reduced]);

  useFrame((_, delta) => {
    if (!reduced) time.current.value += Math.min(delta, 0.05) * 0.55;
    const s = smooth.current;
    const k = Math.min(1, delta * 1.2);
    s.x += (pointer.current.x - s.x) * k;
    s.y += (pointer.current.y - s.y) * k;
    if (mesh.current) {
      mesh.current.rotation.z = s.x * 0.06;
      mesh.current.position.y = -0.55 + s.y * 0.05;
    }
  });

  return (
    <mesh ref={mesh} rotation-x={-Math.PI / 2} position={[0, -0.55, 0]} material={material} frustumCulled={false}>
      <planeGeometry args={[26, 12, lite ? 200 : 420, lite ? 90 : 190]} />
    </mesh>
  );
}

/** Long studio strips: white key plus the hero spectrum, reflected as fine lines on the crests. */
function Studio() {
  return (
    <Environment resolution={512} frames={1}>
      <color attach="background" args={['#000000']} />
      <Lightformer form="rect" intensity={2.2} color="#ffffff" position={[0, 5, -6]} rotation-x={Math.PI / 2.4} scale={[34, 0.18, 1]} />
      <Lightformer form="rect" intensity={2.4} color="#f6d79b" position={[-7, 2.2, -9]} rotation-x={Math.PI / 2.8} scale={[16, 0.22, 1]} />
      <Lightformer form="rect" intensity={2.4} color="#e8a33a" position={[7, 2.6, -8]} rotation-x={Math.PI / 2.8} scale={[16, 0.22, 1]} />
      <Lightformer form="rect" intensity={1.6} color="#c9831f" position={[0, 1.3, -11]} rotation-x={Math.PI / 3} scale={[22, 0.18, 1]} />
      <Lightformer form="rect" intensity={0.9} color="#c4c7cb" position={[-3, 3.5, 7]} rotation-x={-Math.PI / 2.6} scale={[20, 0.3, 1]} />
    </Environment>
  );
}

export default function FooterSilkScene() {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [lite] = useState(() => window.matchMedia('(max-width: 767px)').matches);
  const [reduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  // Resolution ceiling: 1.5x is visually identical on this dark, soft-lit surface but ~45% fewer pixels than 2x.
  // If the device can't hold its frame rate, PerformanceMonitor drops it to 1x.
  const [maxDpr, setMaxDpr] = useState(lite ? 1.25 : 1.5);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '150px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} aria-hidden="true" className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        dpr={[1, maxDpr]}
        frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
        camera={{ fov: 28, position: [0, 0.4, 8], near: 0.1, far: 40 }}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        onCreated={({ camera }) => {
          camera.lookAt(0, -0.2, 0);
          setReady(true);
        }}
        style={{ pointerEvents: 'none' }}
      >
        <PerformanceMonitor onDecline={() => setMaxDpr(1)} />
        <color attach="background" args={[INK]} />
        <fog attach="fog" args={[INK, 7.5, 17]} />
        <Studio />
        <Satin reduced={reduced} lite={lite} />
      </Canvas>
      {/* Calm band behind the links; the satin rises from the lower half. */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(5_5_7/0.85)_30%,rgb(5_5_7/0)_62%,rgb(5_5_7/0)_78%,rgb(5_5_7/0.92)_100%)] max-md:bg-[linear-gradient(to_bottom,var(--color-ink)_0%,rgb(5_5_7/0.92)_76%,rgb(5_5_7/0)_86%,rgb(5_5_7/0.92)_100%)]" />
    </div>
  );
}
