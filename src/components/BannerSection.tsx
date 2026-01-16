import './BannerSection.css'

export default function BannerSection() {
  return (
    <section className="banner-section">
      <h1>wukong billiards & coffee</h1>
      <p>
        Welcome to the relics museum, where history and art come to life. 
        Explore our diverse collection of artifacts, paintings, and sculptures, 
        each with its own unique story to tell. Plan your visit and book tickets online.
      </p>
      <a href="#" className="cta-link">
        plan your visit
        <span>→</span>
      </a>
    </section>
  )
}
