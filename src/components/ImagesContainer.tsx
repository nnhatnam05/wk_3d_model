import './ImagesContainer.css'

export default function ImagesContainer() {
  return (
    <section className="images-container">
      <div className="img">
        <div className="img-main">
          <div className="placeholder-img">Image 1</div>
        </div>
      </div>
      <div className="img">
        <div className="img-main">
          <div className="placeholder-img">Image 2</div>
        </div>
      </div>
      <div className="img">
        <div className="img-main">
          <div className="placeholder-img">Image 3</div>
        </div>
      </div>
      <div className="img">
        <div className="img-main">
          <div className="placeholder-img">Image 4</div>
        </div>
      </div>
      <div className="img">
        <div className="img-main">
          <div className="placeholder-img">Image 5</div>
        </div>
      </div>
      <div className="img">
        <div className="img-main">
          <div className="placeholder-img">Image 6</div>
        </div>
      </div>

      {/* More Content Section */}
      <section className="more-content-section">
        <h2>More Content</h2>
        <p>Additional content section to ensure scroll works properly.</p>
      </section>
    </section>
  )
}
