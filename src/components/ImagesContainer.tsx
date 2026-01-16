import './ImagesContainer.css'

// Mock data cho giải đấu sắp tới
const tournamentsData = [
  {
    id: 1,
    name: 'Giải Billiards WUKONG',
    rank: 'Hạng G - H',
    date: '27/01/2025',
    totalPlayers: 64,
    registeredPlayers: 18,
    availableSlots: 46,
    registerLink: '#'
  },
  // {
  //   id: 2,
  //   name: 'Cúp Wukong Billiards',
  //   rank: 'Hạng B',
  //   date: '05/02/2025 - 07/02/2025',
  //   totalPlayers: 24,
  //   registeredPlayers: 12,
  //   availableSlots: 12,
  //   registerLink: '#'
  // },
  // {
  //   id: 3,
  //   name: 'Giải Đấu Nhanh Tháng 2',
  //   rank: 'Hạng C',
  //   date: '15/02/2025',
  //   totalPlayers: 16,
  //   registeredPlayers: 8,
  //   availableSlots: 8,
  //   registerLink: '#'
  // },
]

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

      {/* More Content Section - Chia đôi: Bán thẻ tập & Giải đấu */}
      <section className="more-content-section">
        <div className="content-wrapper">
          {/* Bên trái: Giới thiệu bán thẻ tập */}
          <div className="card-sales-section">
            <h2 className="section-title">Thẻ Tập Billiards</h2>
            <div className="card-info">
              <div className="card-feature">
                <div className="feature-text">
                  <h3>Thẻ Tháng</h3>
                  <p>Luyện tập không giới hạn trong 30 ngày</p>
                </div>
              </div>
              <div className="card-feature">
                <div className="feature-text">
                  <h3>Ưu Đãi Đặc Biệt</h3>
                  <p>Giảm giá lên đến 20% cho thành viên mới</p>
                </div>
              </div>
              <div className="card-feature">
                <div className="feature-text">
                  <h3>Chất Lượng Cao</h3>
                  <p>Bàn bida chuyên nghiệp, không gian sang trọng</p>
                </div>
              </div>
            </div>
            <a href="#" className="buy-card-btn">
              Mua Thẻ Ngay
            </a>
          </div>

          {/* Bên phải: Giải đấu sắp tới */}
          <div className="tournaments-section">
            <h2 className="section-title">Wukong Tournaments</h2>
            <div className="tournaments-list">
              {tournamentsData.map((tournament) => (
                <div key={tournament.id} className="tournament-card">
                  <div className="tournament-header">
                    <h3 className="tournament-name">{tournament.name}</h3>
                    <span className="tournament-rank">{tournament.rank}</span>
                  </div>
                  <div className="tournament-info">
                    <div className="info-row">
                      <span className="info-label">Ngày thi đấu:</span>
                      <span className="info-value">{tournament.date}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Số VĐV:</span>
                      <span className="info-value">{tournament.totalPlayers} người</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Đã đăng ký:</span>
                      <span className="info-value registered">{tournament.registeredPlayers} VĐV</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Còn trống:</span>
                      <span className="info-value available">{tournament.availableSlots} slot</span>
                    </div>
                  </div>
                  <a href={tournament.registerLink} className="register-btn">
                    Đăng Ký Ngay
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </section>
  )
}
