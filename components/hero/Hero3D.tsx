"use client";
import { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Environment } from "@react-three/drei";
import * as THREE from "three";

interface PhoneModelProps {
  position: [number, number, number];
  rotation: [number, number, number];
  color: string;
}

function PhoneModel({ position, rotation, color }: PhoneModelProps) {
  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <mesh position={position} rotation={rotation} castShadow>
        <boxGeometry args={[1.2, 2.4, 0.12]} />
        <meshStandardMaterial color={color} roughness={0.1} metalness={0.8} />
      </mesh>
      <mesh position={[position[0], position[1], position[2] + 0.07]}>
        <boxGeometry args={[1.0, 2.0, 0.01]} />
        <meshStandardMaterial
          color="#1a1a2e"
          roughness={0.05}
          metalness={0.1}
          emissive="#4a90d9"
          emissiveIntensity={0.1}
        />
      </mesh>
    </Float>
  );
}

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
  }
  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02;
    }
  });
  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#4a90d9" transparent opacity={0.6} />
    </points>
  );
}

export default function Hero3D() {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return (
    <Canvas
      frameloop="demand"
      dpr={[1, 1.5]}
      performance={{ min: 0.5 }}
      camera={{ position: [0, 0, 6], fov: 50 }}
      style={{ width: "100%", height: "100%" }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} color="#F05138" intensity={0.5} />
      <pointLight position={[5, 5, 5]} color="#4a90d9" intensity={0.5} />
      <ParticleField />
      <PhoneModel position={[-1.8, 0, 0]} rotation={[0.1, 0.3, -0.05]} color="#1a1a1a" />
      <PhoneModel position={[1.8, 0, 0]} rotation={[0.1, -0.3, 0.05]} color="#2d2d2d" />
      <OrbitControls
        enableZoom={false}
        autoRotate={!reducedMotion}
        autoRotateSpeed={0.3}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 3}
      />
      <Environment preset="city" />
    </Canvas>
  );
}
