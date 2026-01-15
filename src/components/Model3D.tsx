import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { Model } from './Model'
import { FitCamera } from './FitCamera'

export default function Model3D() {
  const modelRef = useRef<THREE.Group>(null)

  return (
    <Canvas
      camera={{ fov: 45, position: [0, 0, 5] }}
      frameloop="always"
      onCreated={({ gl, invalidate }) => {
        gl.setClearColor('#111')
        invalidate()
      }}
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance' }}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
      }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[5, 10, 5]} intensity={1.2} />
      <pointLight position={[-5, -5, -5]} intensity={0.5} />

      <Suspense fallback={null}>
        <Model ref={modelRef} />
        <FitCamera targetRef={modelRef} />
      </Suspense>

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        target={[0, 0, 0]}
        minDistance={0.15}
        maxDistance={20}
        zoomSpeed={1.2}
      />
    </Canvas>
  )
}
