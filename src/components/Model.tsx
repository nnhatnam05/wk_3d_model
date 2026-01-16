import { useGLTF } from '@react-three/drei'
import { forwardRef, useEffect, useRef } from 'react'
import * as THREE from 'three'

export const Model = forwardRef<THREE.Group>((_props, _ref) => {
  const { scene } = useGLTF(
    'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wukong.glb'
  )
  const internalRef = useRef<THREE.Group>(null)

  useEffect(() => {
    if (!internalRef.current) return
  
    const box = new THREE.Box3().setFromObject(internalRef.current)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())
  
    const maxDim = Math.max(size.x, size.y, size.z)
  
    // Center model
    internalRef.current.position.sub(center)
  
    const TARGET_SIZE = 1.2 // world units
    const scale = TARGET_SIZE / maxDim
    internalRef.current.scale.setScalar(scale)
  
  }, [scene])
  

  return (
    <primitive 
      ref={internalRef} 
      object={scene} 
      scale={1}
      rotation={[0, Math.PI, 0]}
    />
  )
})

Model.displayName = 'Model'

useGLTF.preload(
  'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wukong.glb'
)
