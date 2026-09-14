'use client';

import { ContactShadows, Environment, Lightformer, OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';

const URL = '/models/noble-bottle-lite.glb';
const PARTS = ['glass', 'liquid', 'neck', 'collar', 'cap', 'capTop', 'label'] as const;

function Bottle() {
  const { nodes } = useGLTF(URL) as unknown as { nodes: Record<string, THREE.Mesh> };
  const group = useRef<THREE.Group>(null);

  const materials = useMemo(() => {
    const glass = new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.04, transmission: 1, thickness: 0.8, ior: 1.5, clearcoat: 1, attenuationColor: new THREE.Color('#efe3cc'), attenuationDistance: 3, envMapIntensity: 1.5 });
    const liquid = new THREE.MeshPhysicalMaterial({ color: '#6e3510', roughness: 0.2, clearcoat: 1, emissive: new THREE.Color('#2a1206'), envMapIntensity: 1 });
    const exterior = { transparent: true, opacity: 1 };
    const metal = new THREE.MeshStandardMaterial({ color: '#d2bc98', metalness: 1, roughness: 0.25, envMapIntensity: 1.3, ...exterior });
    const cap = new THREE.MeshStandardMaterial({ color: '#b89e74', metalness: 1, roughness: 0.3, flatShading: true, envMapIntensity: 1.2, ...exterior });
    const plate = new THREE.MeshStandardMaterial({ color: '#c9ae80', metalness: 0.9, roughness: 0.35, ...exterior });
    return { glass, liquid, neck: metal, collar: metal, cap, capTop: cap, label: plate } as Record<(typeof PARTS)[number], THREE.Material>;
  }, []);

  useEffect(() => () => new Set(Object.values(materials)).forEach((m) => m.dispose()), [materials]);

  // Gentle float; rotation comes from auto-rotating controls.
  useFrame((state) => {
    if (group.current) group.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.04;
  });

  return (
    <group ref={group}>
      <group position={[0, -1.15, 0]}>
        {PARTS.map((part) => {
          const node = nodes[part];
          return node ? <mesh key={part} geometry={node.geometry} position={node.position} rotation={node.rotation} material={materials[part]} /> : null;
        })}
      </group>
    </group>
  );
}

/** Small interactive showroom used inside the Immersive package card. */
export default function BottlePreview({ running }: { running: boolean }) {
  return (
    <Canvas frameloop={running ? 'always' : 'never'} dpr={[1, 1.5]} camera={{ fov: 30, position: [0, 0.3, 6.2] }} gl={{ antialias: true, alpha: true }}>
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={3} color="#fff3e0" position={[0, 3.5, -5]} scale={[7, 1.4, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#ffd8a3" position={[-5, 1, 0.5]} rotation-y={Math.PI / 2} scale={[5, 2.4, 1]} />
        <Lightformer form="rect" intensity={1.5} color="#ffffff" position={[5, 1.4, 1]} rotation-y={-Math.PI / 2} scale={[3.5, 3.5, 1]} />
      </Environment>
      <ambientLight intensity={0.2} />
      <directionalLight position={[3, 5, 4]} intensity={1.2} />
      <Suspense fallback={null}>
        <Bottle />
        <ContactShadows position={[0, -1.18, 0]} opacity={0.6} scale={3.4} blur={2.4} far={2.4} resolution={256} frames={1} />
      </Suspense>
      <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={1.4} minPolarAngle={Math.PI * 0.35} maxPolarAngle={Math.PI * 0.55} />
    </Canvas>
  );
}

useGLTF.preload(URL);
