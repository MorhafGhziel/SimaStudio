'use client';

import { PerformanceMonitor } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef, useState, type RefObject } from 'react';
import * as THREE from 'three';
import { beamFragment, beamVertex, dustFragment, dustVertex, ribbonFragment, ribbonVertex } from './shaders';

const SAND = new THREE.Color('#d9c29c');
const WARM = new THREE.Color('#e8d3ad');
const ease = (x: number) => 1 - Math.pow(1 - Math.min(Math.max(x, 0), 1), 3);

/** Values shared by every object in the scene, written once per frame by <Scene>. */
type FrameState = { time: number; reveal: number; scroll: number; px: number; py: number; beam: number; dust: number };

/** Small seeded PRNG so the dust layout is stable and render stays pure. */
function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Ribbon({ frame, segments, phase, width, twist, opacity, z }: { frame: RefObject<FrameState>; segments: [number, number]; phase: number; width: number; twist: number; opacity: number; z: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPhase: { value: phase },
      uWidth: { value: width },
      uTwist: { value: twist },
      uScroll: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uReveal: { value: 0 },
      uOpacity: { value: opacity },
      uTint: { value: SAND },
    }),
    [phase, width, twist, opacity],
  );

  useFrame(() => {
    const m = material.current;
    const f = frame.current;
    if (!m || !f) return;
    m.uniforms.uTime.value = f.time;
    m.uniforms.uReveal.value = f.reveal;
    m.uniforms.uScroll.value = f.scroll;
    (m.uniforms.uPointer.value as THREE.Vector2).set(f.px, f.py);
  });

  return (
    <mesh position-z={z} frustumCulled={false}>
      <planeGeometry args={[1, 1, segments[0], segments[1]]} />
      <shaderMaterial ref={material} vertexShader={ribbonVertex} fragmentShader={ribbonFragment} uniforms={uniforms} transparent depthWrite={false} side={THREE.DoubleSide} />
    </mesh>
  );
}

function Beam({ frame }: { frame: RefObject<FrameState> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uIntensity: { value: 0 }, uColor: { value: WARM } }), []);
  useFrame(() => {
    const m = material.current;
    const f = frame.current;
    if (!m || !f) return;
    m.uniforms.uTime.value = f.time;
    m.uniforms.uIntensity.value = f.beam;
  });
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[6.5, 15]} />
      <shaderMaterial ref={material} vertexShader={beamVertex} fragmentShader={beamFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </mesh>
  );
}

function Dust({ frame, count }: { frame: RefObject<FrameState>; count: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const { positions, seeds } = useMemo(() => {
    const rand = mulberry32(7);
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (rand() - 0.5) * 2.6;
      positions[i * 3 + 1] = (rand() - 0.5) * 10;
      positions[i * 3 + 2] = (rand() - 0.5) * 2.4 + 0.6;
      seeds[i] = rand();
    }
    return { positions, seeds };
  }, [count]);
  const uniforms = useMemo(() => ({ uTime: { value: 0 }, uSize: { value: 34 }, uPixelRatio: { value: 1 }, uColor: { value: WARM }, uOpacity: { value: 0 } }), []);

  useFrame((state) => {
    const m = material.current;
    const f = frame.current;
    if (!m || !f) return;
    m.uniforms.uTime.value = f.time;
    m.uniforms.uOpacity.value = f.dust;
    m.uniforms.uPixelRatio.value = state.gl.getPixelRatio();
  });

  return (
    <points frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-aSeed" args={[seeds, 1]} />
      </bufferGeometry>
      <shaderMaterial ref={material} vertexShader={dustVertex} fragmentShader={dustFragment} uniforms={uniforms} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

function Scene({ mirror, reduced, lite }: { mirror: boolean; reduced: boolean; lite: boolean }) {
  const portrait = useThree((s) => s.size.width < s.size.height);
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  // With reduced motion only a single frame is drawn, and children read these values
  // before <Scene> updates them — so start from the finished state.
  const frame = useRef<FrameState>(reduced ? { time: 9, reveal: 1, scroll: 0, px: 0, py: 0, beam: 0.42, dust: 1 } : { time: 0, reveal: 0, scroll: 0, px: 0, py: 0, beam: 0, dust: 0 });

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      pointer.current.x = ((e.clientX / window.innerWidth) * 2 - 1) * (mirror ? -1 : 1);
      pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mirror, reduced]);

  useFrame((state, delta) => {
    const f = frame.current;
    const time = reduced ? 9 : state.clock.elapsedTime;
    const k = 1 - Math.exp(-delta * 2.2);
    f.px += (pointer.current.x - f.px) * k;
    f.py += (pointer.current.y - f.py) * k;
    const scroll = Math.min(Math.max(window.scrollY / window.innerHeight, 0), 1);
    f.scroll += (scroll - f.scroll) * (reduced ? 1 : Math.min(1, delta * 6));
    f.time = time;
    f.reveal = reduced ? 1 : ease((time - 0.15) / 2.8);
    f.beam = (reduced ? 1 : ease((time - 0.6) / 3)) * 0.42 * (1 - f.scroll * 0.7);
    f.dust = (reduced ? 1 : ease((time - 1.2) / 3)) * (1 - f.scroll * 0.5);

    const side = mirror ? -1 : 1;
    state.camera.position.set(f.px * 0.35 * side, f.py * 0.2 - f.scroll * 0.5, (portrait ? 12 : 9) - f.scroll * 1.6);
    state.camera.lookAt(0, -f.scroll * 0.4, 0);
    if (group.current) group.current.rotation.z = f.scroll * 0.1 * side;
  });

  const seg: [number, number] = lite ? [220, 12] : [380, 22];

  return (
    <group ref={group} position-y={portrait ? 1.4 : 0} scale={[(mirror ? -1 : 1) * (portrait ? 0.5 : 1), 1, 1]}>
      {/* Light shaft from the upper corner, with dust drifting inside it */}
      <group position={[3.1, 1.6, -3.2]} rotation-z={0.42}>
        <Beam frame={frame} />
        <Dust frame={frame} count={lite ? 140 : 360} />
      </group>
      {/* A dim, distant ribbon for depth, then the hero ribbon */}
      <Ribbon frame={frame} segments={seg} phase={2.4} width={1.2} twist={3.2} opacity={0.4} z={-2.8} />
      <Ribbon frame={frame} segments={seg} phase={0} width={2.5} twist={4.2} opacity={1} z={0.6} />
    </group>
  );
}

/** Full-bleed WebGL backdrop for the hero. Pauses when scrolled out of view. */
export default function HeroScene({ mirror, reduced }: { mirror: boolean; reduced: boolean }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(true);
  const [ready, setReady] = useState(false);
  const [dpr, setDpr] = useState(1.5);
  const [lite] = useState(() => window.matchMedia('(max-width: 767px)').matches);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setActive(entry.isIntersecting), { rootMargin: '100px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrap} className="absolute inset-0 transition-opacity duration-[1600ms] ease-out" style={{ opacity: ready ? 1 : 0 }}>
      <Canvas
        dpr={[1, lite ? 1.25 : dpr]}
        flat
        linear
        frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
        camera={{ fov: 35, position: [0, 0, 9], near: 0.1, far: 50 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={() => setReady(true)}
        style={{ pointerEvents: 'none' }}
      >
        <PerformanceMonitor onDecline={() => setDpr(1)} />
        <Scene mirror={mirror} reduced={reduced} lite={lite} />
      </Canvas>
    </div>
  );
}
