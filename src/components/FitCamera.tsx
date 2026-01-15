import { useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import * as THREE from 'three'

export function FitCamera({
  targetRef,
}: {
  targetRef: React.RefObject<THREE.Object3D | null>
}) {
  const { camera } = useThree()
  const fitted = useRef(false)

  useEffect(() => {
    if (fitted.current) return
    if (!(camera instanceof THREE.PerspectiveCamera)) return

    const target = targetRef.current
    if (!target) return

    const box = new THREE.Box3().setFromObject(target)
    const size = box.getSize(new THREE.Vector3())
    const center = box.getCenter(new THREE.Vector3())

    const maxDim = Math.max(size.x, size.y, size.z)
    if (maxDim === 0) return

    const fov = THREE.MathUtils.degToRad(camera.fov)
    let distance = maxDim / (2 * Math.tan(fov / 2))

    distance *= 1.1 // padding NHẸ (KHÔNG 1.4)

    camera.position.set(center.x, center.y, distance)
    camera.lookAt(center)
    camera.updateProjectionMatrix()

    fitted.current = true
  }, [camera, targetRef])

  return null
}
