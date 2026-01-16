import Model3D from '../components/Model3D'
import Header from '../components/Header'
import BannerSection from '../components/BannerSection'
import ImagesContainer from '../components/ImagesContainer'
import MiniGameBanner from '../components/MiniGameBanner'
import type { ModelConfig } from '../types/modelConfig'
import { useMemo } from 'react'

export default function LandingPage() {
  const modelPath = 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/wukong.glb'

  // Detect mobile device for responsive config
  const isMobile = typeof window !== 'undefined' && (window.innerWidth < 768 || (window.devicePixelRatio > 2 && window.innerWidth < 1024))

  // ============================================
  // MODEL CONFIGURATION - Tùy chỉnh tại đây
  // Responsive: Tự động điều chỉnh cho mobile
  // ============================================
  const modelConfig: ModelConfig = useMemo(() => ({
    // Vị trí xuất hiện của model [x, y, z]
    // Điều chỉnh Y để model không bị đẩy lên khi scroll
    // Mobile: Điều chỉnh Y thấp hơn để model hiển thị tốt hơn
    modelPosition: isMobile ? [0, -2.8, 2] : [0, -2.5, 2],
    
    // Góc xoay ban đầu của model [x, y, z] (radians)
    // Y rotation (quan trọng nhất): 
    //   0 = nhìn trực diện (front)
    //   Math.PI / 2 = nhìn sang trái (left)
    //   Math.PI = nhìn sau lưng (back)
    //   -Math.PI / 2 = nhìn sang phải (right)
    //   Math.PI * 0.25 = nhìn chéo trái (diagonal left)
    //   Math.PI * 0.75 = nhìn chéo phải (diagonal right)
    modelInitialRotation: [0, -7.9, 0], // [x, y, z] - Y là trục quay chính
    
    // Kích thước ban đầu (bỏ qua nếu muốn auto-scale từ bounding box)
     modelInitialScale: 1.2, // Uncomment và set giá trị nếu muốn scale cụ thể
    
    // Giới hạn chiều cao tối đa của model (bỏ qua nếu không giới hạn)
     modelMaxHeight: 5, // Uncomment và set giá trị nếu muốn giới hạn chiều cao
    
    // Vị trí camera [x, y, z]
    // Mobile: Camera xa hơn và cao hơn để model hiển thị đầy đủ
    cameraPosition: isMobile ? [0, 1.6, 7.5] : [0, 1.4, 6.5],
    
    // Góc nhìn camera (Field of View)
    // Mobile: FOV lớn hơn để model không bị quá nhỏ
    cameraFov: isMobile ? 60 : 50,
    
    // Điểm camera nhìn vào [x, y, z] (optional)
    cameraLookAt: undefined, // undefined = không set lookAt
    
    // Animation xoay model khi scroll - quay 1 vòng rồi về hướng chính diện
    scrollRotation: {
      enabled: true,
      maxRotation: Math.PI * 2, // Xoay 1 vòng tròn đầy đủ (6.28 radians)
      speed: 1, // Tốc độ xoay (1 = bình thường, 2 = nhanh gấp đôi)
    },
    
    // Di chuyển camera khi scroll - zoom xa ra vừa đủ, không quá nhiều để model không bị thu nhỏ
    cameraMovement: {
      enabled: true,
      startY: isMobile ? 1.6 : 1.4, // Vị trí Y ban đầu của camera
      endY: isMobile ? 0.6 : 0.5, // Vị trí Y cuối khi scroll (không quá thấp để model không bị đẩy lên)
      startZ: isMobile ? 7.5 : 6.5, // Vị trí Z ban đầu (khoảng cách camera)
      endZ: isMobile ? 9.5 : 8.5, // Vị trí Z cuối (zoom xa vừa đủ, không quá nhiều để model không bị thu nhỏ)
      trigger: 'body', // Element trigger (default: 'body')
    },
    
    // Lock position - theo code mẫu, không có lock, animation chạy đến cuối trang
    // Tắt lock để animation chạy mượt như code mẫu
    lockPosition: {
      enabled: false, // Tắt lock để animation chạy đến cuối trang như code mẫu
      trigger: '.images-container',
      start: 'top top',
      end: 'top top',
    },
    
    // Animation scale khi scroll
    scaleAnimation: {
      enabled: false, // Bật/tắt scale animation
      initialScale: 1, // Scale ban đầu
      maxScale: 1.2, // Scale tối đa khi scroll
      lockPosition: undefined, // Vị trí scroll để khóa scale (e.g., '.images-container')
    },
    
    // Thời điểm model xuất hiện toàn thân
    fullBodyReveal: {
      trigger: '.images-container', // Element trigger
      start: 'top bottom', // ScrollTrigger start
      end: 'top top', // ScrollTrigger end
    },
    
    // Galaxy effect configuration - Hiệu ứng thiên hà
    // Vị trí và góc nghiêng cố định - Dễ dàng chỉnh sửa tại đây
    galaxy: {
      enabled: true, // Bật/tắt hiệu ứng thiên hà
      
      // VỊ TRÍ CỐ ĐỊNH - Điều chỉnh [x, y, z] để di chuyển galaxy
      // x: trái (-) / phải (+)
      // y: thấp (-) / cao (+)
      // z: gần (+) / xa (-)
      position: [0, -1.5, -2], // Vị trí cố định phía sau model
      
      // GÓC NGHIÊNG CỐ ĐỊNH - Điều chỉnh [x, y, z] để nghiêng galaxy
      // x: nghiêng lên (+) / xuống (-) - radians (0.3 ≈ 17 độ)
      // y: xoay trái (-) / phải (+) - radians
      // z: nghiêng ngang - radians
      rotation: [4, 4, 0], // Góc nghiêng cố định - nghiêng lên 0.25 rad (≈14 độ)
      
      rotationSpeed: 0.1, // Tốc độ xoay (0.1 = chậm, 0.5 = nhanh)
      particlesCount: isMobile ? 8000 : 15000, // Số lượng hạt (Mobile: ít hơn để tối ưu performance)
      insideColor: '#ffff00', // Màu bên trong thiên hà
      outsideColor: '#ff4500', // Màu bên ngoài thiên hà
      galaxyRadius: 2, // Bán kính thiên hà (càng lớn càng rộng)
      branches: 10, // Số nhánh xoắn ốc (3-8)
      spin: 1.5, // Độ xoắn (1.0-3.0)
    },
  }), [isMobile])

  return (
    <>
      {/* 3D BACKGROUND - Fixed behind content */}
      <Model3D 
        modelPath={modelPath}
        enableScrollRotation={true}
        enableBloom={false}
        config={modelConfig}
      />

      {/* UI / SCROLL CONTENT - On top of canvas */}
      <main className="main-content">
        <Header />
        <BannerSection />
        <ImagesContainer />
      </main>

      {/* Mini Game Banner - Fixed position */}
      <MiniGameBanner />
    </>
  )
}
