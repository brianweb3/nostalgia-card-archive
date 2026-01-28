import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import * as THREE from "three";

function Pokeball() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <group ref={groupRef} scale={2.5}>
        {/* Top half - Red */}
        <mesh position={[0, 0.02, 0]}>
          <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#dc2626"
            metalness={0.3}
            roughness={0.4}
          />
        </mesh>

        {/* Bottom half - White */}
        <mesh position={[0, -0.02, 0]}>
          <sphereGeometry args={[1, 64, 32, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2]} />
          <meshStandardMaterial
            color="#ffffff"
            metalness={0.2}
            roughness={0.3}
          />
        </mesh>

        {/* Middle black band */}
        <mesh>
          <torusGeometry args={[1, 0.08, 16, 100]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Center button outer ring */}
        <mesh position={[0, 0, 1.01]}>
          <ringGeometry args={[0.15, 0.25, 32]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Center button */}
        <mesh position={[0, 0, 1.02]}>
          <circleGeometry args={[0.15, 32]} />
          <meshStandardMaterial color="#ffffff" metalness={0.6} roughness={0.2} />
        </mesh>

        {/* Glow sphere */}
        <mesh>
          <sphereGeometry args={[1.05, 32, 32]} />
          <meshBasicMaterial
            color="#dc2626"
            transparent
            opacity={0.05}
          />
        </mesh>
      </group>
    </Float>
  );
}

export function PokeballScene() {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.3} color="#ff6666" />
        <pointLight position={[0, 0, 3]} intensity={0.5} color="#ffffff" />
        <Pokeball />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
