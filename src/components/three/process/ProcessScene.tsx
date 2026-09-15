'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';

/**
 * Process scene: one particle system morphs through four shapes as the visitor
 * scrolls — Discover (a loose cloud), Design (a layout grid), Build (the SIMA
 * folded symbol in 3D) and Launch (the symbol lifted inside an orbit ring).
 * All four target shapes live in attributes; the GPU interpolates between them.
 */

const vertex = /* glsl */ `
attribute vec3 aP0;
attribute vec3 aP1;
attribute vec3 aP2;
attribute vec3 aP3;
attribute float aSeed;
uniform float uProgress;
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
varying float vAlpha;
varying float vSeed;

vec3 stagePos(float s) {
  if (s < 0.5) return aP0;
  if (s < 1.5) return aP1;
  if (s < 2.5) return aP2;
  return aP3;
}

void main() {
  float p = clamp(uProgress, 0.0, 3.0);
  float i = min(floor(p), 2.0);
  float f = p - i;
  // Each particle leaves a little later than the one before: the shape "pours" into the next.
  float t = smoothstep(0.0, 1.0, clamp((f - aSeed * 0.35) / 0.65, 0.0, 1.0));
  vec3 pos = mix(stagePos(i), stagePos(i + 1.0), t);

  float mid = sin(t * 3.14159);
  pos += vec3(
    sin(uTime * 0.7 + aSeed * 40.0),
    cos(uTime * 0.6 + aSeed * 30.0),
    sin(uTime * 0.5 + aSeed * 20.0)
  ) * (0.025 + 0.4 * mid);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = uSize * (0.55 + aSeed * 0.9) * uPixelRatio / -mv.z;
  vAlpha = 0.55 + 0.45 * sin(uTime * 1.3 + aSeed * 60.0);
  vSeed = aSeed;
}
`;

const fragment = /* glsl */ `
uniform vec3 uColorA;
uniform vec3 uColorB;
varying float vAlpha;
varying float vSeed;

void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uColorA, uColorB, vSeed);
  col = mix(col, vec3(1.0), smoothstep(0.18, 0.0, d) * 0.6);
  gl_FragColor = vec4(col, a * a * vAlpha);
}
`;

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Inside test for the SIMA symbol in its 0–1000 design space. */
function insideSymbol(x: number, y: number) {
  const du = Math.hypot(x - 500, y - 340);
  const dl = Math.hypot(x - 500, y - 660);
  const upper = (x <= 500 && du >= 60 && du <= 160) || (x >= 500 && x <= 660 && y >= 180 && y <= 280);
  const lower = (x >= 500 && dl >= 60 && dl <= 160) || (x >= 340 && x <= 500 && y >= 720 && y <= 820);
  return upper || lower;
}

function buildTargets(count: number) {
  const rand = mulberry32(11);
  const p0 = new Float32Array(count * 3);
  const p1 = new Float32Array(count * 3);
  const p2 = new Float32Array(count * 3);
  const p3 = new Float32Array(count * 3);
  const seed = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const s = rand();
    seed[i] = s;
    const k = i * 3;

    // Build — the symbol, extruded.
    let x = 0;
    let y = 0;
    do {
      x = 340 + rand() * 320;
      y = 180 + rand() * 640;
    } while (!insideSymbol(x, y));
    const sx = (x - 500) / 160;
    const sy = -(y - 500) / 160;
    const sz = (rand() - 0.5) * 0.5;
    p2.set([sx, sy, sz], k);

    // Discover — a loose cloud with a denser shell.
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const r = 2.3 + rand() * 1.3;
    const ring = Math.sqrt(1 - u * u);
    p0.set([ring * Math.cos(th) * r, u * r * 0.75, ring * Math.sin(th) * r], k);

    // Design — a tilted layout grid.
    const W = 5.6;
    const H = 3.6;
    let gx: number;
    let gy: number;
    if (rand() < 0.5) {
      gx = -W / 2 + Math.round(rand() * 8) * (W / 8);
      gy = (rand() - 0.5) * H;
    } else {
      gy = -H / 2 + Math.round(rand() * 5) * (H / 5);
      gx = (rand() - 0.5) * W;
    }
    const tilt = -0.45;
    p1.set([gx, gy * Math.cos(tilt), gy * Math.sin(tilt)], k);

    // Launch — the symbol lifted, inside an orbit ring.
    if (s < 0.55) {
      p3.set([sx * 0.72, sy * 0.72 + 0.2, sz * 0.72], k);
    } else {
      const a = rand() * Math.PI * 2;
      const R = 2.6 + (rand() - 0.5) * 0.14;
      const rx = Math.cos(a) * R;
      const rz = Math.sin(a) * R;
      const ang = 1.15;
      p3.set([rx, -rz * Math.sin(ang) + 0.2, rz * Math.cos(ang)], k);
    }
  }
  return { p0, p1, p2, p3, seed };
}

function Particles({ progress, reduced, lite }: { progress: RefObject<number>; reduced: boolean; lite: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const smooth = useRef({ p: reduced ? 2 : 0, x: 0, y: 0 });
  const data = useMemo(() => buildTargets(lite ? 2400 : 5200), [lite]);
  const uniforms = useMemo(
    () => ({
      uProgress: { value: reduced ? 2 : 0 },
      uTime: { value: 0 },
      uSize: { value: lite ? 58 : 46 },
      uPixelRatio: { value: 1 },
      uColorA: { value: new THREE.Color('#3ec6ff') },
      uColorB: { value: new THREE.Color('#8b9dff') },
    }),
    [lite, reduced],
  );

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

  useFrame((state, delta) => {
    const m = material.current;
    if (!m) return;
    const s = smooth.current;
    const target = reduced ? 2 : (progress.current ?? 0);
    const k = Math.min(1, delta * 4);
    s.p += (target - s.p) * k;
    s.x += (pointer.current.x - s.x) * Math.min(1, delta * 2);
    s.y += (pointer.current.y - s.y) * Math.min(1, delta * 2);
    const time = reduced ? 4 : state.clock.elapsedTime;
    m.uniforms.uProgress.value = s.p;
    m.uniforms.uTime.value = time;
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
    if (group.current) {
      group.current.rotation.y = Math.sin(time * 0.25) * 0.35 + s.x * 0.3;
      group.current.rotation.x = s.y * 0.18;
    }
  });

  return (
    <group ref={group}>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[data.p2, 3]} />
          <bufferAttribute attach="attributes-aP0" args={[data.p0, 3]} />
          <bufferAttribute attach="attributes-aP1" args={[data.p1, 3]} />
          <bufferAttribute attach="attributes-aP2" args={[data.p2, 3]} />
          <bufferAttribute attach="attributes-aP3" args={[data.p3, 3]} />
          <bufferAttribute attach="attributes-aSeed" args={[data.seed, 1]} />
        </bufferGeometry>
        <shaderMaterial ref={material} vertexShader={vertex} fragmentShader={fragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </points>
    </group>
  );
}

export default function ProcessScene({ progress, reduced }: { progress: RefObject<number>; reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [ready, setReady] = useState(false);
  const [lite] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 transition-opacity duration-1000" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        dpr={[1, lite ? 1.25 : 1.5]}
        frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
        camera={{ fov: 35, position: [0, 0, lite ? 12 : 10] }}
        gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => setReady(true)}
        style={{ pointerEvents: 'none' }}
      >
        <Particles progress={progress} reduced={reduced} lite={lite} />
      </Canvas>
    </div>
  );
}
