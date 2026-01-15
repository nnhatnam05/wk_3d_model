import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function FitCamera({ target }: { target: THREE.Object3D | null }) {
  const { camera } = useThree()
  const fitted = useRef(false)

  useEffect(() => {
    if (!target || fitted.current) return
    if (!(camera instanceof THREE.PerspectiveCamera)) return

    const box = new THREE.Box3().setFromObject(target)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = (camera.fov * Math.PI) / 180
    let cameraZ = maxDim / (2 * Math.tan(fov / 2))
    cameraZ *= 1.4 // padding

    camera.position.set(center.x, center.y, cameraZ)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    fitted.current = true
  }, [camera, target])

  return null
}
