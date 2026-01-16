import './ImagesContainer.css'

// Mock data for images - Thay thế URLs bằng hình ảnh thật của bạn
const imageData = [
  {
    id: 1,
    imageUrl: 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/image-banner-1.webp',
    hoverText: 'Mini game được tổ chức thường xuyên - Nhận quà không giới hạn 🎁',
    title: 'Chơi Là Có Quà 🎁'
  },
  {
    id: 2,
    imageUrl: 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/Screenshot%202026-01-16%20222544.png',
    hoverText: 'Renaissance Paintings - Explore masterpieces from the Renaissance era',
    title: 'Renaissance Gallery'
  },
  {
    id: 3,
    imageUrl: 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/Screenshot%202026-01-16%20222544.png',
    hoverText: 'Modern Sculptures - Contemporary art pieces from renowned artists',
    title: 'Modern Sculptures'
  },
  {
    id: 4,
    imageUrl: 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/Screenshot%202026-01-16%20222544.png',
    hoverText: 'Historical Documents - Rare manuscripts and historical documents',
    title: 'Historical Archive'
  },
  {
    id: 5,
    imageUrl: 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/Screenshot%202026-01-16%20222544.png',
    hoverText: 'Cultural Exhibitions - Immerse yourself in diverse cultural experiences',
    title: 'Cultural Events'
  },
  {
    id: 6,
    imageUrl: 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/Screenshot%202026-01-16%20222544.png',
    hoverText: 'Special Collections - Exclusive collections available for viewing',
    title: 'Special Collections'
  },
]

export default function ImagesContainer() {
  return (
    <section className="images-container">
      {imageData.map((item) => (
        <div key={item.id} className="img">
          <div className="img-main">
            <img 
              src={item.imageUrl} 
              alt={item.title}
              className="gallery-image"
              loading="lazy"
            />
            <div className="image-overlay">
              <div className="hover-text">
                <h3 className="hover-title">{item.title}</h3>
                <p className="hover-description">{item.hoverText}</p>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* More Content Section */}
      <section className="more-content-section">
        <h2>More Content</h2>
        <p>Additional content section to ensure scroll works properly.</p>
      </section>
    </section>
  )
}
