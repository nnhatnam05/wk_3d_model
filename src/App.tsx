import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import './App.css'

const Model3D = lazy(() => import('./components/Model3D'))

function App() {
  const [show3D, setShow3D] = useState(false)

  const isDesktop = useMemo(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(pointer: fine) and (min-width: 768px)').matches
  }, [])

  useEffect(() => {
    // Mount after page load to avoid blocking first paint
    const id = window.setTimeout(() => setShow3D(true), 0)
    return () => window.clearTimeout(id)
  }, [])

  return (
    <div className="landing-page">
      {isDesktop && show3D ? (
        <Suspense fallback={null}>
          <Model3D />
        </Suspense>
      ) : null}
    </div>
  )
}

export default App
