import { useGLTF } from '@react-three/drei'
import { useLayoutEffect, useRef } from 'react'
import * as THREE from 'three'

const MODEL_URL =
  'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wukong_-.glb'

export function Model() {
  const { scene } = useGLTF(MODEL_URL)
  const internalRef = useRef<THREE.Group>(null)

  useLayoutEffect(() => {
    if (internalRef.current) {
      const box = new THREE.Box3().setFromObject(internalRef.current)
      const center = box.getCenter(new THREE.Vector3())
      internalRef.current.position.sub(center) // center model
    }
  }, [])

  return <primitive ref={internalRef} object={scene} dispose={null} />
}

useGLTF.preload(MODEL_URL)
