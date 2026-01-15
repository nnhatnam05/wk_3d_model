import { Canvas } from '@react-three/fiber'
import { Suspense, useRef } from 'react'
import { OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { Model } from './Model'
import { FitCamera } from './FitCamera'

export default function Model3D() {
  const modelRef = useRef<THREE.Group>(null)

  return (
    <Canvas
      camera={{ fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100vh' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <Suspense fallback={null}>
        <group ref={modelRef}>
          <Model />
        </group>
        <FitCamera target={modelRef.current} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2.3}
        maxPolarAngle={Math.PI / 2.3}
      />
    </Canvas>
  )
}
