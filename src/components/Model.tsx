import { useGLTF } from '@react-three/drei'
import { forwardRef, useEffect, useRef } from 'react'
import * as THREE from 'three'

export const Model = forwardRef<THREE.Group>((_props, ref) => {
  const { scene } = useGLTF(
    'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wk.glb'
  )
  const internalRef = useRef<THREE.Group>(null)

  useEffect(() => {
    // Set ref for parent
    if (ref && 'current' in ref) {
      ;(ref as React.MutableRefObject<THREE.Group | null>).current =
        internalRef.current
    }

    // Center model - delay để đảm bảo geometry đã load
    const timer = setTimeout(() => {
      if (internalRef.current) {
        const box = new THREE.Box3().setFromObject(internalRef.current)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)

        if (maxDim > 0) {
          internalRef.current.position.sub(center) // center model
        }
      }
    }, 200)

    return () => clearTimeout(timer)
  }, [ref, scene])

  return <primitive ref={internalRef} object={scene} scale={0.1} />
})

Model.displayName = 'Model'

useGLTF.preload(
  'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wk.glb'
)
