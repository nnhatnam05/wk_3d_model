import { useGLTF } from '@react-three/drei'
import { forwardRef, useLayoutEffect } from 'react'
import * as THREE from 'three'

const MODEL_URL =
  'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wukong_-.glb'

export const Model = forwardRef<THREE.Group>((_, ref) => {
  const { scene } = useGLTF(MODEL_URL)

  useLayoutEffect(() => {
    if (ref && 'current' in ref && ref.current) {
      const box = new THREE.Box3().setFromObject(ref.current)
      const center = box.getCenter(new THREE.Vector3())
      ref.current.position.sub(center) // center model
    }
  }, [ref])

  return <primitive ref={ref} object={scene} dispose={null} />
})

Model.displayName = 'Model'
useGLTF.preload(MODEL_URL)
