import './Header.css'
import { useState } from 'react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="header">
      <a href="/" className="logo">
        <img 
          src="https://rus4iiektgqdbkz2.public.blob.vercel-storage.com/logo_wukong.webp" 
          alt="Wukong Logo" 
          className="logo-img"
        />
      </a>
      <div className="nav-link-container">
        {/* Desktop: Show all links */}
        <button className="search-btn">
          <span>🔍</span>
        </button>
        <a href="" className="nav-link">visit</a>
        <a href="" className="nav-link">exhibitions & events</a>
        <a href="" className="nav-link">collection</a>
        
        {/* Mobile: Hamburger menu button */}
        <button className="toggle-btn" onClick={toggleMenu} aria-label="Toggle menu">
          <span>☰</span>
        </button>
      </div>
      
      {/* Mobile Menu Dropdown */}
      <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
        <button className="mobile-search-btn">
          <span>🔍</span> Search
        </button>
        <a href="" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>visit</a>
        <a href="" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>exhibitions & events</a>
        <a href="" className="mobile-nav-link" onClick={() => setIsMenuOpen(false)}>collection</a>
      </div>
    </header>
  )
}
