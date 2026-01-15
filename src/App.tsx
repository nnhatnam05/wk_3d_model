import { lazy, Suspense, useEffect, useState } from 'react'
import './App.css'
import LoadingPlaceholder from './components/LoadingPlaceholder'

const Model3D = lazy(() => import('./components/Model3D'))

function App() {
  const [show3D, setShow3D] = useState(false)

  useEffect(() => {
    setShow3D(true)
  }, [])

  return (
    <div className="landing-page">
      <Suspense fallback={<LoadingPlaceholder />}>
        {show3D && <Model3D />}
      </Suspense>
    </div>
  )
}

export default App
