import { Suspense } from 'react'
import './App.css'
import Model3D from './components/Model3D'

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Suspense fallback={null}>
        <Model3D />
      </Suspense>
    </div>
  )
}
