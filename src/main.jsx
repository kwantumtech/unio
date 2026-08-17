import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './coming.css'

function App() {
  return <main className="coming-soon">
    <div className="coming-soon__content">
      <img className="coming-soon__logo" src="/logo.png" alt="Unio" />
      <h1 className="coming-soon__title">Coming Soon</h1>
      <div className="coming-soon__rule" />
      <p className="coming-soon__caption">The science of reset</p>
    </div>
  </main>
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
