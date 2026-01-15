export default function LoadingPlaceholder() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          padding: '2rem',
          maxWidth: '600px',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 700,
            marginBottom: '1rem',
            letterSpacing: '-0.02em',
          }}
        >
          Wukong
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2vw, 1.25rem)',
            opacity: 0.9,
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          Loading 3D model…
        </p>
        <div
          style={{
            width: '200px',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            margin: '0 auto',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              width: '40%',
              height: '100%',
              background: '#fff',
              borderRadius: '2px',
              animation: 'loading 1.5s ease-in-out infinite',
            }}
          />
        </div>
      </div>
      <style>{`
        @keyframes loading {
          0%, 100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(250%);
          }
        }
      `}</style>
    </div>
  )
}
