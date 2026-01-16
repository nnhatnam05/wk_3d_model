// Model configuration interface for LandingPage
export interface ModelConfig {
  // Model position and initial setup
  modelPosition: [number, number, number]
  modelInitialRotation: [number, number, number]
  modelInitialScale?: number // Optional: if undefined, auto-scale based on bounding box
  modelMaxHeight?: number // Limit model height (optional)
  
  // Camera settings
  cameraPosition: [number, number, number]
  cameraFov: number
  cameraLookAt?: [number, number, number] // Optional lookAt point
  
  // Scroll animations
  scrollRotation: {
    enabled: boolean
    maxRotation: number // Max rotation in radians (e.g., Math.PI * 0.15)
    speed: number // Rotation speed multiplier (1 = normal)
  }
  
  cameraMovement: {
    enabled: boolean
    startY: number // Initial camera Y position
    endY: number // Final camera Y position when scrolling
    startZ?: number // Initial camera Z position (distance)
    endZ?: number // Final camera Z position (move away from model)
    trigger?: string // ScrollTrigger selector (default: 'body')
  }
  
  // Lock position - khi đến điểm này, lock tất cả (camera, model, scale)
  lockPosition?: {
    enabled: boolean
    trigger: string // Element selector (e.g., '.images-container')
    start: string // ScrollTrigger start (e.g., 'top center')
    end: string // ScrollTrigger end (e.g., 'top top')
  }
  
  // Scale animation on scroll
  scaleAnimation: {
    enabled: boolean
    initialScale: number
    maxScale: number // Maximum scale when scrolling
    lockPosition?: string // Scroll position to lock scale (e.g., '.images-container')
  }
  
  // Full body reveal timing
  fullBodyReveal: {
    trigger: string // Element selector that triggers full body reveal
    start: string // ScrollTrigger start (e.g., 'top bottom')
    end: string // ScrollTrigger end (e.g., 'top top')
  }
}
