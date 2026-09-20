'use client';

import React, { useRef, useState, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import { Html, OrbitControls, Float } from '@react-three/drei';
import * as THREE from 'three';

// Extend JSX namespace for @react-three/fiber elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

const LAYER_DATA = [
  { id: 0, name: 'Identity', label: 'Academic Base', icon: '🎓', color: '#EDE8DF', z: 0, description: 'Verified collegiate context' },
  { id: 1, name: 'Photography', label: 'Editorial Visual', icon: '📸', color: '#FFFFFF', z: 50, description: 'Full-bleed personality' },
  { id: 2, name: 'Voice', label: 'Hinge Prompts', icon: '💬', color: '#F5E6E3', z: 100, description: 'Specific conversation hooks' },
  { id: 3, name: 'Connection', label: 'Date Spark', icon: '☕', color: '#FCE4E0', z: 150, description: 'Spontaneous campus meetup' },
];

function MatteMaterial({ color, roughness = 0.9, metalness = 0, opacity = 1 }: {
  color: string;
  roughness?: number;
  metalness?: number;
  opacity?: number;
}) {
  const materialRef = useRef<THREE.MeshStandardMaterial>();

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.color.set(color);
      materialRef.current.roughness = roughness;
      materialRef.current.metalness = metalness;
      materialRef.current.opacity = opacity;
    }
  });

  return (
    <meshStandardMaterial
      ref={materialRef}
      color={color}
      roughness={roughness}
      metalness={metalness}
      transparent={opacity < 1}
      opacity={opacity}
    />
  );
}

function ProfileLayer({ layer, index, exploded, activeLayer, onHover, onClick }: {
  layer: typeof LAYER_DATA[0];
  index: number;
  exploded: number;
  activeLayer: number | null;
  onHover: (id: number | null) => void;
  onClick: (id: number) => void;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const isActive = activeLayer === index;
  const zOffset = layer.z * exploded;

  return (
    <group ref={groupRef} onPointerOver={() => onHover(index)} onPointerOut={() => onHover(null)} onClick={() => onClick(index)}>
      <mesh
        position={[0, exploded * (index - 1.5) * 8, zOffset]}
        scale={isActive ? 1.05 : 1}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[3.2, 2.4, 0.4]} />
        <MatteMaterial color={layer.color} roughness={0.9} />
      </mesh>
      <mesh position={[0, exploded * (index - 1.5) * 8, zOffset + 0.22]}>
        <planeGeometry args={[3, 2.2]} />
        <meshBasicMaterial color={layer.color === '#FFFFFF' ? '#F7F5F0' : layer.color} transparent opacity={0.1} />
      </mesh>
      <Html
        position={[0, exploded * (index - 1.5) * 8, zOffset + 0.3]}
        style={{
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <div style={{
          padding: '12px 16px',
          borderRadius: '12px',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(229, 222, 212, 0.5)',
          boxShadow: '0 8px 32px rgba(22, 20, 19, 0.08)',
          minWidth: '200px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '24px', marginBottom: '4px' }}>{layer.icon}</div>
          <div style={{ fontFamily: 'Playfair Display, serif', fontWeight: 600, fontSize: '14px', color: '#161413' }}>
            {layer.name}
          </div>
          <div style={{ fontSize: '11px', color: '#736B63', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '2px' }}>
            {layer.label}
          </div>
        </div>
      </Html>
    </group>
  );
}

function AmbientParticles({ count = 80 }) {
  const pointsRef = useRef<THREE.Points>(null);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0001 * delta;
      pointsRef.current.rotation.x += 0.00005 * delta;
    }
  });

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const radius = 4 + Math.random() * 8;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) + (Math.random() - 0.5) * 10;
    positions[i * 3 + 2] = radius * Math.cos(phi);

    const colorChoice = Math.random();
    if (colorChoice < 0.4) {
      colors[i * 3] = 200 / 255;
      colors[i * 3 + 1] = 98 / 255;
      colors[i * 3 + 2] = 75 / 255;
    } else if (colorChoice < 0.7) {
      colors[i * 3] = 104 / 255;
      colors[i * 3 + 1] = 126 / 255;
      colors[i * 3 + 2] = 113 / 255;
    } else {
      colors[i * 3] = 182 / 255;
      colors[i * 3 + 1] = 139 / 255;
      colors[i * 3 + 2] = 64 / 255;
    }

    sizes[i] = Math.random() * 1.5 + 0.5;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        <bufferAttribute attach="attributes-size" args={[sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        sizeAttenuation
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function HeroCanvas({ exploded, setExploded, activeLayer, setActiveLayer }: {
  exploded: number;
  setExploded: (value: number | ((prev: number) => number)) => void;
  activeLayer: number | null;
  setActiveLayer: (value: number | null) => void;
}) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.z = 12 + exploded * 8;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <ambientLight intensity={0.6} color="#FFF8F0" />
      <directionalLight position={[3, 5, 4]} intensity={1.2} color="#FFF8F0" castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
      <directionalLight position={[-2, 3, 2]} intensity={0.5} color="#F5E6E3" />
      <hemisphereLight color="#FFF8F0" groundColor="#EDE8DF" intensity={0.4} />

      <AmbientParticles count={60} />

      {LAYER_DATA.map((layer, index) => (
        <ProfileLayer
          key={layer.id}
          layer={layer}
          index={index}
          exploded={exploded}
          activeLayer={activeLayer}
          onHover={setActiveLayer}
          onClick={setActiveLayer}
        />
      ))}

      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
        <mesh position={[0, -3, -2]}>
          <torusGeometry args={[0.8, 0.2, 16, 32]} />
          <MatteMaterial color="#C8624B" roughness={0.7} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={-0.2} floatIntensity={0.7}>
        <mesh position={[2.5, 1, -3]}>
          <octahedronGeometry args={[0.5, 0]} />
          <MatteMaterial color="#687E71" roughness={0.8} />
        </mesh>
      </Float>

      <Float speed={1.8} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[-2.5, -1, -2.5]}>
          <icosahedronGeometry args={[0.4, 0]} />
          <MatteMaterial color="#B68B40" roughness={0.75} />
        </mesh>
      </Float>
    </>
  );
}

export function KampusLinkHero3D() {
  const [exploded, setExploded] = useState(0.65);
  const [activeLayer, setActiveLayer] = useState<number | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="relative h-[500px] sm:h-[600px] w-full flex items-center justify-center bg-canvas">
        <div className="w-12 h-12 border-2 border-terracotta-200 border-t-terracotta rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-canvas" aria-label="Kampu$Link 3D Profile Anatomy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-sand border border-border-subtle text-terracotta text-xs font-serif italic">
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
              <line x1="12" y1="22" x2="12" y2="15.5" />
              <polyline points="22 8.5 12 15.5 2 8.5" />
              <line x1="2" y1="8.5" x2="12" y2="2" />
            </svg>
            The Anatomy of a Profile
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink-heading tracking-tight">
            Deconstructed for Real Connection
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed">
            Unlike shallow swipe apps that reduce someone to a photograph, Kampu$Link layers identity, authentic voice, and conversation starters.
            {prefersReducedMotion ? ' Drag the scrubber to explore the layers.' : ' Hover layers to inspect, drag the scrubber to explode in 3D.'}
          </p>
        </div>

        <div className="mb-10 flex flex-wrap items-center justify-center gap-4">
          <div className="flex items-center gap-3 bg-surface px-4 py-2 rounded-full border border-border shadow-soft">
            <span className="text-xs font-semibold text-ink-muted">Assembled</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={exploded}
              onChange={(e) => setExploded(parseFloat(e.target.value))}
              className="w-32 sm:w-48 h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-terracotta"
              aria-label="Deconstruct 3D profile layers"
            />
            <span className="text-xs font-semibold text-terracotta">Exploded 3D</span>
          </div>
          <button
            onClick={() => setExploded(prev => prev > 0.4 ? 0 : 0.85)}
            className="px-4 py-2 rounded-full bg-surface hover:bg-surface-sand text-xs font-semibold text-ink border border-border transition shadow-soft flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-terracotta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="6" x2="20" y2="6" />
              <line x1="4" y1="18" x2="20" y2="18" />
            </svg>
            {exploded > 0.2 ? 'Recombine Profile' : 'Deconstruct in 3D'}
          </button>
        </div>

        <div className="relative h-[500px] sm:h-[600px] w-full" style={{ width: '100%', height: '100%' }}>
          <Canvas
            camera={{ position: [0, 0, 18], fov: 35 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.1 }}
            shadows
          >
            <Suspense fallback={null}>
              <HeroCanvas exploded={exploded} setExploded={setExploded} activeLayer={activeLayer} setActiveLayer={setActiveLayer} />
            </Suspense>
            {prefersReducedMotion ? null : <OrbitControls enablePan={false} enableZoom={false} maxPolarAngle={Math.PI / 2} minPolarAngle={0} />}
          </Canvas>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto">
          {LAYER_DATA.map((layer, index) => (
            <button
              key={layer.id}
              onClick={() => setActiveLayer(activeLayer === index ? null : index)}
              onMouseEnter={() => setActiveLayer(index)}
              onMouseLeave={() => setActiveLayer(null)}
              className={`p-4 rounded-2xl bg-surface border border-border shadow-soft transition-all duration-200 text-left ${
                activeLayer === index ? 'ring-2 ring-terracotta shadow-hover border-terracotta/30' : 'hover:border-terracotta/30 hover:shadow-hover'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{layer.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">Layer 0{index + 1}</span>
              </div>
              <p className="text-sm font-serif font-medium text-ink-heading">{layer.name}</p>
              <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">{layer.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Hero3DFallback() {
  return (
    <section className="relative w-full overflow-hidden bg-canvas py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-surface-sand border border-border-subtle text-terracotta text-xs font-serif italic">
            The Anatomy of a Profile
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-ink-heading tracking-tight">
            Deconstructed for Real Connection
          </h2>
          <p className="mt-3 text-sm sm:text-base text-ink-muted leading-relaxed">
            Unlike shallow swipe apps that reduce someone to a photograph, Kampu$Link layers identity, authentic voice, and conversation starters.
          </p>
        </div>

        <div className="relative aspect-[4/3] max-w-md mx-auto bg-surface border border-border rounded-3xl overflow-hidden shadow-modal">
          <div className="absolute inset-0 bg-gradient-to-br from-terracotta/5 via-canvas to-sage/5" />
          <div className="relative z-10 p-8 flex flex-col items-center justify-center h-full">
            <div className="w-24 h-24 rounded-2xl bg-surface-sand border border-border flex items-center justify-center mb-6 shadow-soft">
              <svg className="w-12 h-12 text-terracotta" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
                <line x1="2" y1="8.5" x2="12" y2="2" />
              </svg>
            </div>
            <h3 className="text-xl font-serif font-medium text-ink-heading">3D Profile Explorer</h3>
            <p className="text-sm text-ink-muted mt-2 text-center max-w-sm">
              Enable WebGL to explore the interactive 3D deconstruction of a Kampu$Link profile.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 max-w-5xl mx-auto">
          {LAYER_DATA.map((layer, index) => (
            <div key={layer.id} className="p-4 rounded-2xl bg-surface border border-border shadow-soft">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{layer.icon}</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-terracotta">Layer 0{index + 1}</span>
              </div>
              <p className="text-sm font-serif font-medium text-ink-heading">{layer.name}</p>
              <p className="text-[11px] text-ink-muted mt-1 leading-relaxed">{layer.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}