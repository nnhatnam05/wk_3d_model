import './TournamentsBanner.css'
import { useState, useEffect } from 'react'

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

interface TournamentsBannerProps {
  enabled?: boolean // Flag để bật/tắt hiển thị
}

export default function TournamentsBanner({ enabled = true }: TournamentsBannerProps) {
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

  // Không hiển thị nếu disabled
  if (!enabled) {
    return null
  }

  // Lấy giải đấu đầu tiên để hiển thị
  const activeTournament = tournamentsData[0]

  if (!activeTournament) {
    return null
  }

  return (
    <div className={`tournaments-banner ${isExpanded ? 'expanded' : 'collapsed'} ${pulse ? 'pulse' : ''}`}>
      {isExpanded ? (
        <>
          <button className="close-btn" onClick={toggleExpand} aria-label="Collapse banner">
            ×
          </button>
          <div className="tournaments-content">
            <div className="tournament-header-banner">
              <h3 className="tournament-title">{activeTournament.name}</h3>
              <span className="tournament-rank-badge">{activeTournament.rank}</span>
            </div>
            <div className="tournament-info-banner">
              <div className="stat-item">
                <span className="stat-label">Ngày thi đấu:</span>
                <span className="stat-value">{activeTournament.date}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Số VĐV:</span>
                <span className="stat-value">{activeTournament.totalPlayers} người</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Đã đăng ký:</span>
                <span className="stat-value registered">{activeTournament.registeredPlayers} VĐV</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Còn trống:</span>
                <span className="stat-value available">{activeTournament.availableSlots} slot</span>
              </div>
            </div>
            <div className="tournament-highlight">
              <span className="tournament-icon">🏆</span>
              <span className="tournament-text">Đăng ký ngay để tham gia!</span>
            </div>
            <a href={activeTournament.registerLink} className="register-btn-banner">
              Đăng Ký Ngay →
            </a>
          </div>
        </>
      ) : (
        <button className="collapsed-view" onClick={toggleExpand} aria-label="Expand tournaments banner">
          <span className="tournament-icon-small">🏆</span>
          <div className="collapsed-text">
            <span className="collapsed-title">Wukong Tournaments</span>
            <span className="collapsed-subtitle">Đăng ký ngay →</span>
          </div>
        </button>
      )}
    </div>
  )
}
