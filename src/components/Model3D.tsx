import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Suspense, useEffect, useRef, type RefObject } from 'react'
import * as THREE from 'three'
import { Model } from './Model'
import { FitCamera } from './FitCamera'

function MouseFollowRotation({ target }: { target: RefObject<THREE.Group | null> }) {
  const { invalidate } = useThree()
  const targetRotY = useRef(0)
  const isAnimating = useRef(false)

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1 // [-1..1]
      targetRotY.current = x * 0.3
      isAnimating.current = true
      invalidate()
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [invalidate])

  useFrame(() => {
    const obj = target.current
    if (!obj || !isAnimating.current) return

    obj.rotation.y = THREE.MathUtils.lerp(obj.rotation.y, targetRotY.current, 0.12)

    if (Math.abs(obj.rotation.y - targetRotY.current) < 0.001) {
      obj.rotation.y = targetRotY.current
      isAnimating.current = false
      return
    }

    invalidate()
  })

  return null
}

export default function Model3D() {
  const modelRef = useRef<THREE.Group>(null)

  return (
    <Canvas
      camera={{ fov: 45 }}
      frameloop="demand"
      onCreated={({ invalidate }) => invalidate()}
      dpr={[1, 1.5]}
      gl={{ powerPreference: 'high-performance' }}
      style={{ width: '100%', height: '100vh' }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1} />

      <Suspense
        fallback={
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#aaa',
              fontSize: '18px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Loading 3D model…
          </div>
        }
      >
        <group ref={modelRef}>
          <Model />
        </group>
        <FitCamera targetRef={modelRef} />
      </Suspense>

      <MouseFollowRotation target={modelRef} />
    </Canvas>
  )
}
