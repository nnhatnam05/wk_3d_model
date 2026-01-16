import './MiniGameBanner.css'
import { useState, useEffect } from 'react'

// Mock data cho mini game đang diễn ra
const miniGameData = {
  id: 1,
  title: 'CHƠI LÀ CÓ QUÀ 🎁',
  description: 'Chơi ngay để nhận quà không giới hạn!',
  prize: 'Quà tặng đặc biệt',
  timeRemaining: '2 ngày 5 giờ',
  imageUrl: 'https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/image-banner-1.webp',
  status: 'active', // active, ending, coming-soon
  participants: 1250,
  link: '#'
}

export default function MiniGameBanner() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [pulse, setPulse] = useState(true)

  // Pulse animation
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(prev => !prev)
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className={`mini-game-banner ${isExpanded ? 'expanded' : 'collapsed'} ${pulse ? 'pulse' : ''}`}>
      {isExpanded ? (
        <>
          <button className="close-btn" onClick={toggleExpand} aria-label="Collapse banner">
            ×
          </button>
          <div className="mini-game-content">
            <div className="game-image-container">
              <img 
                src={miniGameData.imageUrl} 
                alt={miniGameData.title}
                className="game-image"
              />
              <div className="game-badge">🔥 ĐANG DIỄN RA</div>
            </div>
            <div className="game-info">
              <h3 className="game-title">{miniGameData.title}</h3>
              <p className="game-description">{miniGameData.description}</p>
              <div className="game-stats">
                <div className="stat-item">
                  <span className="stat-label">Thời gian còn lại:</span>
                  <span className="stat-value">{miniGameData.timeRemaining}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Người chơi:</span>
                  <span className="stat-value">{miniGameData.participants.toLocaleString()}</span>
                </div>
              </div>
              <div className="prize-highlight">
                <span className="prize-icon">🎁</span>
                <span className="prize-text">{miniGameData.prize}</span>
              </div>
              <a href={miniGameData.link} className="play-btn">
                Chơi Ngay →
              </a>
            </div>
          </div>
        </>
      ) : (
        <button className="collapsed-view" onClick={toggleExpand} aria-label="Expand mini game banner">
          <span className="game-icon">🔥</span>
          <div className="collapsed-text">
            <span className="collapsed-title">Mini game wukong</span>
            <span className="collapsed-subtitle">Tham gia ngay →</span>
          </div>
        </button>
      )}
    </div>
  )
}
