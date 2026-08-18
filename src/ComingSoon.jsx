import './coming.css'
import logoUrl from '../assets/logos/unio-wordmark.png'

export default function ComingSoon() {
  return (
    <main className="coming-soon">
      <div className="coming-soon__content">
        <img className="coming-soon__logo" src={logoUrl} alt="Unio" />
        <h1 className="coming-soon__title">Coming Soon</h1>
        <div className="coming-soon__rule" />
        <p className="coming-soon__caption">The science of reset</p>
      </div>
    </main>
  )
}
