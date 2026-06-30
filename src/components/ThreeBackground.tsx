import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo, useEffect, useState } from 'react';

// Separated scene component to use the useFrame hook safely inside the Canvas context
interface SceneProps {
  activeCategory: string;
  isLightboxOpen: boolean;
}

function ParticleScene({ activeCategory, isLightboxOpen }: SceneProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [speedMultiplier, setSpeedMultiplier] = useState(1);

  // Trigger speed warp effect when category changes
  useEffect(() => {
    setSpeedMultiplier(4);
    const timer = setTimeout(() => {
      setSpeedMultiplier(1);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  // Track mouse coordinates
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Generate 800 particles randomly distributed in a spherical shell
  const particles = useMemo(() => {
    const count = 800;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 6 + Math.random() * 12;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      arr[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = radius * Math.cos(phi);
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();
    const currentSpeed = isLightboxOpen ? 0.2 : speedMultiplier;

    // Rotate points
    if (pointsRef.current) {
      pointsRef.current.rotation.x += delta * 0.05 * currentSpeed;
      pointsRef.current.rotation.y += delta * 0.08 * currentSpeed;

      // Mouse parallax
      pointsRef.current.position.x = THREE.MathUtils.lerp(pointsRef.current.position.x, mouse.current.x * 1.5, 0.05);
      pointsRef.current.position.y = THREE.MathUtils.lerp(pointsRef.current.position.y, mouse.current.y * 1.5, 0.05);
    }

    // Rotate and bob the center geometry
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.15;
      meshRef.current.rotation.y = time * 0.2;
      meshRef.current.rotation.z = time * 0.05;

      // Floating bobbing effect
      meshRef.current.position.y = Math.sin(time * 0.5) * 0.3;
      
      // Parallax
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, mouse.current.x * 0.8, 0.05);
      meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -2 + mouse.current.y * 0.8, 0.05);
    }
  });

  return (
    <group>
      {/* Background Particles */}
      <Points ref={pointsRef} positions={particles} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color={isLightboxOpen ? '#6b7280' : '#8b5cf6'}
          size={0.06}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={isLightboxOpen ? 0.15 : 0.35}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* Modernist wireframe core shape in center */}
      <mesh ref={meshRef} position={[0, 0, -2]}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial
          color="#3b0764"
          wireframe
          transparent
          opacity={isLightboxOpen ? 0.03 : 0.08}
        />
      </mesh>
      
      {/* Outer ambient glow ring */}
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]} position={[0, 0, -3]}>
        <torusGeometry args={[4.5, 0.01, 8, 64]} />
        <meshBasicMaterial
          color="#a78bfa"
          transparent
          opacity={isLightboxOpen ? 0.02 : 0.12}
        />
      </mesh>
    </group>
  );
}

interface ThreeBackgroundProps {
  activeCategory: string;
  isLightboxOpen: boolean;
}

export default function ThreeBackground({ activeCategory, isLightboxOpen }: ThreeBackgroundProps) {
  return (
    <div className="fixed inset-0 -z-10 bg-[#020205] transition-colors duration-1000">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <ParticleScene activeCategory={activeCategory} isLightboxOpen={isLightboxOpen} />
      </Canvas>
    </div>
  );
}
