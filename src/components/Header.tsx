import './Header.css'

export default function Header() {
  return (
    <header className="header">
      <a href="#" className="logo">
        <h2>LOGO</h2>
      </a>
      <div className="nav-link-container">
        <button>
          <span>🔍</span>
        </button>
        <a href="">visit</a>
        <a href="">exhibitions & events</a>
        <a href="">collection</a>
        <button className="toggle-btn">
          <span>☰</span>
        </button>
      </div>
    </header>
  )
}
