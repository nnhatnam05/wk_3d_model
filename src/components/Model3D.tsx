import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
// import { EffectComposer, Bloom } from '@react-three/postprocessing' // Disabled for WebGL compatibility
import { Suspense, useEffect, useRef, useState, forwardRef, useMemo } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register GSAP plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

import type { ModelConfig } from '../types/modelConfig'

interface Model3DProps {
  modelPath?: string
  enableScrollRotation?: boolean
  enableBloom?: boolean // Currently unused but kept for future use
  config?: ModelConfig // Optional config for advanced control
}

// Galaxy Effect component - Based on code sample with customizable settings
function GlowingRing({ 
  position = [0, -1.5, -2],
  rotation = [0, 0, 0],
  rotationSpeed = 0.1, // Tốc độ xoay như cánh quạt
  particlesCount = 15000,
  insideColor = '#00ff00',
  outsideColor = '#1b3984',
  galaxyRadius = 50,
  branches = 6,
  spin = 1.8,
}: {
  position?: [number, number, number]
  rotation?: [number, number, number]
  rotationSpeed?: number // Không sử dụng - galaxy đứng yên
  particlesCount?: number
  insideColor?: string
  outsideColor?: string
  galaxyRadius?: number
  branches?: number
  spin?: number
}) {
  const isMobile = (typeof window !== 'undefined') && (window.innerWidth < 768 || (window.devicePixelRatio > 2 && window.innerWidth < 1024))
  const particlesCountFinal = isMobile ? Math.floor(particlesCount * 0.5) : particlesCount
  const randomness = 0.35
  const randomnessPower = 2.5
  const innerRadius = 1.5
  
  const { positions, colors, sizes } = useMemo(() => {
    const pos = new Float32Array(particlesCountFinal * 3)
    const col = new Float32Array(particlesCountFinal * 3)
    const siz = new Float32Array(particlesCountFinal)
    const colorInside = new THREE.Color(insideColor)
    const colorOutside = new THREE.Color(outsideColor)
    const colorCenter = new THREE.Color('#ffffff')
    
    for (let i = 0; i < particlesCountFinal; i++) {
      const i3 = i * 3
      const radius = Math.pow(Math.random(), 1.8) * (galaxyRadius - innerRadius) + innerRadius
      const branchAngle = ((i % branches) / branches) * 2 * Math.PI
      const spinAngle = radius * spin
      const randomMultiplier = Math.pow(radius / galaxyRadius, 0.5)
      const randomX = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * randomMultiplier
      const randomY = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * randomMultiplier * 0.7
      const randomZ = Math.pow(Math.random(), randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * randomness * randomMultiplier
      
      pos[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX
      pos[i3 + 1] = randomY * 0.5
      pos[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ
      
      const mixedColor = new THREE.Color()
      if (radius < innerRadius * 2) {
        const t = radius / (innerRadius * 2)
        mixedColor.copy(colorCenter).lerp(colorInside, t)
      } else {
        const t = (radius - innerRadius * 2) / (galaxyRadius - innerRadius * 2)
        mixedColor.copy(colorInside).lerp(colorOutside, t)
      }
      
      col[i3] = mixedColor.r
      col[i3 + 1] = mixedColor.g
      col[i3 + 2] = mixedColor.b
      siz[i] = Math.max(0.09, 0.2 * (1 - radius / galaxyRadius))
    }
    
    return { positions: pos, colors: col, sizes: siz }
  }, [insideColor, outsideColor, particlesCountFinal, galaxyRadius, branches, spin])

  const points = useMemo(() => {
    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
    geometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    
    const material = new THREE.ShaderMaterial({
      uniforms: { 
        time: { value: 0 }, 
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) } 
      },
      vertexShader: `
        attribute float size;
        varying vec3 vColor;
        uniform float time;
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          gl_PointSize = size * 300.0 / -mvPosition.z;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        void main() {
          float s = distance(gl_PointCoord, vec2(0.5));
          s = 1.0 - s;
          s = pow(s, 3.0);
          vec3 c = mix(vec3(0.0), vColor, s);
          gl_FragColor = vec4(c, s);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      vertexColors: true
    })
    
    return new THREE.Points(geometry, material)
  }, [positions, colors, sizes])

  // Hiệu ứng xoay như cánh quạt cho galaxy
  useFrame((state) => {
    if (points) {
      // Xoay quanh trục Y (như cánh quạt)
      points.rotation.y = state.clock.elapsedTime * rotationSpeed
      // Có thể thêm xoay quanh trục Z nhẹ để tạo hiệu ứng 3D
      // points.rotation.z = state.clock.elapsedTime * (rotationSpeed * 0.3)
    }
  })

  return (
    <group position={position} rotation={rotation} layers={1}>
      <primitive object={points} castShadow={false} receiveShadow={false} />
    </group>
  )
}

// Torus component with emissive material
function Torus({ position = [0, 1.8, 0] }: { position?: [number, number, number] }) {
  const torusRef = useRef<THREE.Mesh>(null)
  const [autoRotation] = useState(true)
  const [rotationSpeed] = useState(1)

  useFrame((_, delta) => {
    if (!torusRef.current) return

    // Auto rotation
    if (autoRotation) {
      torusRef.current.rotation.z += 0.01 * rotationSpeed * delta * 60
    }
  })

  return (
    <mesh ref={torusRef} position={position} layers={1}>
      <torusGeometry args={[0.2, 0.04, 4, 20]} />
      <meshStandardMaterial
        color="#2555FD"
        emissive="#2555FD"
        emissiveIntensity={5}
        wireframe
      />
    </mesh>
  )
}

// Point light inside torus
function TorusLight({ position = [0, 1.8, -2] }: { position?: [number, number, number] }) {
  const lightRef = useRef<THREE.PointLight>(null)
  const [flickerSpeed] = useState(0.02)
  const [flickerIntensity] = useState(10)
  const timeRef = useRef(0)

  useFrame(() => {
    if (!lightRef.current) return

    timeRef.current += flickerSpeed
    const baseIntensity = 0.01
    lightRef.current.intensity = baseIntensity + Math.sin(timeRef.current) * flickerIntensity
  })

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color="#ffffff"
      intensity={0.01}
      distance={0.25}
      decay={0.0004}
    />
  )
}

// Model component with configurable position, scale, and rotation
const Model = forwardRef<THREE.Group, { 
  modelPath: string
  onLoad?: () => void
  position?: [number, number, number]
  rotation?: [number, number, number]
  initialScale?: number
  maxHeight?: number
}>(({ modelPath, onLoad, position, rotation, initialScale, maxHeight }, ref) => {
  const { scene } = useGLTF(modelPath)
  const internalRef = useRef<THREE.Group>(null)

  useEffect(() => {
    // Set ref for parent
    if (ref && 'current' in ref) {
      ;(ref as React.MutableRefObject<THREE.Group | null>).current = internalRef.current
    }

    if (!internalRef.current) return

    // Calculate scale based on bounding box
    const box = new THREE.Box3().setFromObject(internalRef.current)
    const size = box.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)

    if (maxDim > 0) {
      // Use provided scale or calculate from maxDim
      let scale = initialScale || (2.4 / maxDim)
      
      // Apply maxHeight limit if provided
      if (maxHeight && size.y > maxHeight) {
        scale = maxHeight / size.y
      }
      
      internalRef.current.scale.setScalar(scale)

      // Use provided position or default
      const finalPosition = position || [0, -3.5, 2]
      internalRef.current.position.set(...finalPosition)

    }

    // Setup shadows for all meshes
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })

    // Notify parent that model is loaded
    if (onLoad) {
      const timer = setTimeout(() => {
        onLoad()
      }, 200)
      
      return () => clearTimeout(timer)
    }
  }, [scene, ref, onLoad, position, rotation, initialScale, maxHeight])

  const finalRotation = rotation || [0, Math.PI, 0]

  return (
    <group ref={internalRef} rotation={finalRotation}>
      <primitive object={scene} />
    </group>
  )
})

Model.displayName = 'Model'

// Scroll animation component with configurable parameters
function ScrollRotation({ 
  groupRef, 
  config 
}: { 
  groupRef: React.RefObject<THREE.Group | null>
  config?: ModelConfig
}) {
  const { camera } = useThree()

  useEffect(() => {
    if (!groupRef.current) return

    const scrollRotation = config?.scrollRotation
    const cameraMovement = config?.cameraMovement
    const scaleAnimation = config?.scaleAnimation
    const lockPosition = config?.lockPosition

    // Xác định end point và trigger dựa trên lock position
    let animationEndPoint = 'bottom bottom'
    let animationTrigger: Element | null = null
    if (lockPosition?.enabled) {
      // Nếu có lock position, dừng animation tại đó và dùng lock element làm trigger
      const lockElement = document.querySelector(lockPosition.trigger)
      if (lockElement) {
        animationEndPoint = lockPosition.end
        animationTrigger = lockElement
      }
    }

    // Rotation animation - quay về hướng chính diện ở cuối trang, reversible khi scroll lên
    let rotationAnimation: gsap.core.Tween | gsap.core.Timeline | ScrollTrigger | null = null
    if (scrollRotation?.enabled && groupRef.current) {
      // Lấy initial rotation từ config
      const initialRotationY = config?.modelInitialRotation?.[1] || 0
      const totalRotation = scrollRotation.maxRotation * scrollRotation.speed
      
      
      // Sử dụng ScrollTrigger với onUpdate để tính toán rotation dựa trên scroll progress
      // Đảm bảo reversible: scroll xuống = quay, scroll lên = quay ngược lại
      const scrollTrigger = ScrollTrigger.create({
        trigger: animationTrigger || document.body,
        start: 'top top',
        end: animationEndPoint,
        scrub: 1, // Smooth, reversible
        onUpdate: (self) => {
          if (!groupRef.current) return
          
          const progress = self.progress // 0 → 1
          
          // 70% đầu: quay từ initial → initial + maxRotation (1 vòng)
          // 30% cuối: quay về lại initial (hướng chính diện)
          let currentRotation: number
          
          if (progress <= 0.7) {
            // 0-70%: quay 1 vòng
            const rotationProgress = progress / 0.7 // 0 → 1
            currentRotation = initialRotationY + (totalRotation * rotationProgress)
          } else {
            // 70-100%: quay về lại initial
            const returnProgress = (progress - 0.7) / 0.3 // 0 → 1
            currentRotation = initialRotationY + totalRotation - (totalRotation * returnProgress)
          }
          
          groupRef.current.rotation.y = currentRotation
          
          // Debug log
          if (progress % 0.1 < 0.01) {
          }
        },
      })
      
      // Lưu scrollTrigger để có thể kill sau
      rotationAnimation = scrollTrigger
    }

    // Camera Y and Z movement - dừng khi đến lock position
    let cameraYAnimation: gsap.core.Tween | null = null
    let cameraZAnimation: gsap.core.Tween | null = null
    if (cameraMovement?.enabled) {
      const trigger = cameraMovement.trigger || 'body'
      const triggerElement = trigger === 'body' ? document.body : document.querySelector(trigger)
      
      // Sử dụng lock element làm trigger nếu có, nếu không thì dùng triggerElement
      const finalTrigger = animationTrigger || triggerElement || document.body
      
      // Camera Y movement (up/down) - theo code mẫu (di chuyển xuống)
      if (cameraMovement.endY !== undefined) {
        cameraYAnimation = gsap.to(camera.position, {
          y: cameraMovement.endY,
          ease: 'none', // Code mẫu dùng 'none'
          scrollTrigger: {
            trigger: finalTrigger,
            start: 'top top',
            end: animationEndPoint,
            scrub: 1, // Code mẫu dùng scrub: 1
            invalidateOnRefresh: true,
          },
        })
      }
      
      // Camera Z movement - theo code mẫu (di chuyển gần lại, không phải xa ra)
      if (cameraMovement.endZ !== undefined && cameraMovement.startZ !== undefined) {
        cameraZAnimation = gsap.to(camera.position, {
          z: cameraMovement.endZ,
          ease: 'none', // Code mẫu dùng 'none'
          scrollTrigger: {
            trigger: finalTrigger,
            start: 'top top',
            end: animationEndPoint,
            scrub: 1, // Code mẫu dùng scrub: 1
            invalidateOnRefresh: true,
          },
        })
      }
    }

    // Scale animation on scroll
    let scaleAnimationGSAP: gsap.core.Tween | null = null
    if (scaleAnimation?.enabled && groupRef.current) {
      const trigger = scaleAnimation.lockPosition || 'body'
      const triggerElement = trigger === 'body' ? document.body : document.querySelector(trigger)
      
      scaleAnimationGSAP = gsap.to(groupRef.current.scale, {
        x: scaleAnimation.maxScale,
        y: scaleAnimation.maxScale,
        z: scaleAnimation.maxScale,
        ease: 'none',
        scrollTrigger: {
          trigger: triggerElement || document.body,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
        },
      })
    }

    // Lock position - khi đến điểm này, lock tất cả animations VĨNH VIỄN
    if (config?.lockPosition?.enabled && groupRef.current) {
      const lockTrigger = document.querySelector(config.lockPosition.trigger)
      if (lockTrigger) {
        ScrollTrigger.create({
          trigger: lockTrigger,
          start: config.lockPosition.start,
          end: config.lockPosition.end,
          onEnter: () => {
            // Lock VĨNH VIỄN - không unlock nữa
            if (cameraYAnimation) {
              cameraYAnimation.pause()
              // Set camera Y về giá trị cuối cùng (không cho di chuyển nữa)
              if (cameraMovement?.endY !== undefined) {
                camera.position.y = cameraMovement.endY
              }
            }
            if (cameraZAnimation) {
              cameraZAnimation.pause()
              // Set camera Z về giá trị cuối cùng
              if (cameraMovement?.endZ !== undefined) {
                camera.position.z = cameraMovement.endZ
              }
            }
            // Lock rotation - set về giá trị ban đầu (hướng chính diện)
            if (rotationAnimation) {
              if ('kill' in rotationAnimation && typeof (rotationAnimation as any).kill === 'function') {
                (rotationAnimation as any).kill()
              }
              if (groupRef.current && config?.modelInitialRotation) {
                groupRef.current.rotation.y = config.modelInitialRotation[1] // Về lại hướng chính diện ban đầu
              }
            }
            // Lock scale - set về giá trị cuối cùng
            if (scaleAnimationGSAP) {
              scaleAnimationGSAP.pause()
              if (groupRef.current && scaleAnimation) {
                groupRef.current.scale.setScalar(scaleAnimation.maxScale)
              }
            }
          },
          onLeave: () => {
            // KHÔNG unlock - giữ nguyên vị trí đã lock
            // Model phải luôn hiển thị đầy đủ, không cho di chuyển nữa
            // Force giữ nguyên camera position
            if (cameraMovement?.endY !== undefined) {
              camera.position.y = cameraMovement.endY
            }
            if (cameraMovement?.endZ !== undefined) {
              camera.position.z = cameraMovement.endZ
            }
            // Đảm bảo animations vẫn bị pause
            if (cameraYAnimation) cameraYAnimation.pause()
            if (cameraZAnimation) cameraZAnimation.pause()
            if (rotationAnimation) {
              // Không kill rotation animation khi scroll tiếp, để nó tiếp tục hoạt động
              // Rotation sẽ tự động tính toán dựa trên scroll position
            }
            if (scaleAnimationGSAP) scaleAnimationGSAP.pause()
          },
          onEnterBack: () => {
            // Lock lại khi scroll về (đảm bảo luôn lock)
            if (cameraYAnimation) {
              cameraYAnimation.pause()
              if (cameraMovement?.endY !== undefined) {
                camera.position.y = cameraMovement.endY
              }
            }
            if (cameraZAnimation) {
              cameraZAnimation.pause()
              if (cameraMovement?.endZ !== undefined) {
                camera.position.z = cameraMovement.endZ
              }
            }
            if (rotationAnimation) {
              // Rotation animation sẽ tự động tính toán dựa trên scroll position
              // Không cần force set, để đảm bảo reversible
            }
            if (scaleAnimationGSAP) {
              scaleAnimationGSAP.pause()
              if (groupRef.current && scaleAnimation) {
                groupRef.current.scale.setScalar(scaleAnimation.maxScale)
              }
            }
          },
        })
      }
    }

    return () => {
      rotationAnimation?.kill()
      cameraYAnimation?.kill()
      cameraZAnimation?.kill()
      scaleAnimationGSAP?.kill()
      ScrollTrigger.getAll().forEach((trigger) => {
        trigger.kill()
      })
    }
  }, [groupRef, config, camera])

  return null
}

// Main Model3D component
export default function Model3D({ 
  modelPath = 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wukong.glb',
  enableScrollRotation = true,
  enableBloom: _enableBloom = false, // Disabled for WebGL compatibility on Windows/Intel GPU (prefixed with _ to indicate unused)
  config,
}: Model3DProps) {
  const [modelLoaded, setModelLoaded] = useState(false)
  const [webglError, setWebglError] = useState<string | null>(null)
  const modelRef = useRef<THREE.Group>(null)

  // Preload model
  useGLTF.preload(modelPath)

  // Check WebGL support before rendering
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null
    
    if (!gl) {
      setWebglError('WebGL is not supported or disabled in your browser')
      return
    }

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
    if (debugInfo) {
      const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) as string
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) as string
      
      if (vendor === 'Disabled' || renderer === 'Disabled') {
        setWebglError('WebGL is disabled. Please enable hardware acceleration in Chrome settings.')
      }
    }
  }, [])

  // Show error message if WebGL is disabled
  if (webglError) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          backgroundColor: '#000',
          color: '#fff',
          padding: '40px',
          textAlign: 'center',
        }}
      >
        <h2 style={{ color: '#ff4444', marginBottom: '20px' }}>WebGL Error</h2>
        <p style={{ marginBottom: '20px', fontSize: '16px' }}>{webglError}</p>
        <div style={{ textAlign: 'left', maxWidth: '600px', marginTop: '20px' }}>
          <h3 style={{ color: '#D6F844', marginBottom: '10px' }}>How to fix:</h3>
          <ol style={{ lineHeight: '1.8' }}>
            <li>Open Chrome Settings → System → Enable "Use hardware acceleration when available"</li>
            <li>Restart Chrome</li>
            <li>If still not working, try Chrome flags:
              <ul style={{ marginTop: '10px', marginLeft: '20px' }}>
                <li>Go to <code>chrome://flags</code></li>
                <li>Search for "WebGL" and enable it</li>
                <li>Search for "Hardware-accelerated video decode" and enable it</li>
                <li>Restart Chrome</li>
              </ul>
            </li>
            <li>Update your GPU drivers</li>
            <li>Try a different browser (Firefox, Edge)</li>
          </ol>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Preloader */}
      {!modelLoaded && (
        <div
          id="preloader"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 1001,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            backgroundColor: '#000',
          }}
        >
          <p
            style={{
              fontSize: '1rem',
              color: '#D6F844',
              fontWeight: 400,
            }}
          >
            Please wait while the model is loading...
          </p>
        </div>
      )}

      <Canvas
        camera={{ 
          position: config?.cameraPosition || [
            0, 
            config?.cameraMovement?.startY || 1.4, 
            config?.cameraMovement?.startZ || config?.cameraPosition?.[2] || 6.5
          ], 
          fov: (() => {
            // Responsive FOV: Mobile cần FOV lớn hơn để model không bị quá nhỏ
            const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || (window.devicePixelRatio > 2 && window.innerWidth < 1024))
            const baseFov = config?.cameraFov || 50
            return isMobile ? Math.min(baseFov + 10, 75) : baseFov
          })(), 
          near: 0.1, 
          far: 1000 
        }}
        dpr={typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1}
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: 'default',
          preserveDrawingBuffer: false,
          failIfMajorPerformanceCaveat: false,
          stencil: false,
          depth: true,
          premultipliedAlpha: false,
        }}
        shadows={false}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}
        onCreated={({ gl, camera }) => {
          gl.setClearColor('#000000')
          
          // Set camera lookAt if provided in config
          if (config?.cameraLookAt && camera instanceof THREE.PerspectiveCamera) {
            camera.lookAt(...config.cameraLookAt)
          }
          
          // Handle WebGL context loss
          const handleContextLost = (event: Event) => {
            event.preventDefault()
          }
          
          const handleContextRestored = () => {
          }
          
          const canvas = gl.domElement
          canvas.addEventListener('webglcontextlost', handleContextLost)
          canvas.addEventListener('webglcontextrestored', handleContextRestored)
          
          return () => {
            canvas.removeEventListener('webglcontextlost', handleContextLost)
            canvas.removeEventListener('webglcontextrestored', handleContextRestored)
          }
        }}
        onError={(_error) => {
          setWebglError('Failed to create WebGL context. Please check browser settings.')
        }}
      >
        <Suspense fallback={null}>
          {/* Basic PBR Lighting - REQUIRED */}
          <ambientLight intensity={1.2} />
          <directionalLight
            position={[5, 5, 5]}
            intensity={2}
          />

          {/* Additional Lighting Setup */}
          <TorusLight />
          
          <spotLight
            position={[0, 3, 0.5]}
            intensity={17}
            distance={100}
            angle={10}
            penumbra={10}
            castShadow
          />

          <pointLight
            position={[-2, 2, 2]}
            color="#5599FF"
            intensity={30}
            distance={5}
            decay={2}
          />

          <pointLight
            position={[1, 1, 1]}
            color="#ffffff"
            intensity={20}
            distance={1}
            decay={1.5}
          />

          {/* Glowing Ring - Behind the model - Render FIRST so it's behind */}
          {/* Galaxy Effect - Configurable from modelConfig */}
          {config?.galaxy?.enabled && (
            <GlowingRing
              position={config.galaxy.position}
              rotation={config.galaxy.rotation}
              rotationSpeed={config.galaxy.rotationSpeed}
              particlesCount={config.galaxy.particlesCount}
              insideColor={config.galaxy.insideColor}
              outsideColor={config.galaxy.outsideColor}
              galaxyRadius={config.galaxy.galaxyRadius}
              branches={config.galaxy.branches}
              spin={config.galaxy.spin}
            />
          )}

          {/* Torus */}
          <Torus />

          {/* Model with configurable settings */}
          <Model
            ref={modelRef}
            modelPath={modelPath}
            position={config?.modelPosition}
            rotation={config?.modelInitialRotation}
            initialScale={config?.modelInitialScale}
            maxHeight={config?.modelMaxHeight}
            onLoad={() => {
              setModelLoaded(true)
              // Hide preloader with animation
              const preloader = document.getElementById('preloader')
              if (preloader) {
                gsap.to(preloader, {
                  scale: 1.5,
                  opacity: 0,
                  duration: 0.5,
                  ease: 'linear',
                  onComplete: () => preloader.remove()
                })
              }
            }}
          />
          
          {/* Scroll animations with config */}
          <ScrollRotation 
            groupRef={modelRef} 
            config={config ? {
              ...config,
              scrollRotation: {
                ...config.scrollRotation,
                enabled: enableScrollRotation && config.scrollRotation.enabled,
              }
            } : undefined}
          />

          {/* Post-processing with Bloom - DISABLED for WebGL compatibility */}
          {/* 
          {enableBloom && (
            <EffectComposer>
              <Bloom
                intensity={1}
                luminanceThreshold={0}
                luminanceSmoothing={1.0}
              />
            </EffectComposer>
          )}
          */}

          {/* Orbit Controls - Disabled for landing page (breaks layout) */}
          {/* <OrbitControls
            enablePan={false}
            enableZoom={true}
            enableRotate={true}
            target={[0, 0, 0]}
          /> */}
        </Suspense>
      </Canvas>
    </>
  )
}
