import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import logoUrl from '../logo.png'

const launchDate = new Date('2026-11-07T09:00:00-05:00')

function Countdown() {
  const remaining = Math.max(launchDate - new Date(), 0)
  const units = [['days', 86_400_000], ['hours', 3_600_000], ['mins', 60_000], ['secs', 1_000]]

  return <div className="countdown" aria-label="Countdown to the event">
    {units.map(([label, milliseconds]) => <div className="time-unit" key={label}>
      <span>{String(Math.floor(remaining / milliseconds) % (label === 'days' ? 1000 : 60)).padStart(2, '0')}</span>
      <small>{label}</small>
    </div>)}
  </div>
}

function V2() {
  const handleSubmit = (event) => {
    event.preventDefault()
    event.currentTarget.dataset.submitted = 'true'
    event.currentTarget.reset()
  }

  return <main>
    <div className="ambient ambient-one" /><div className="ambient ambient-two" /><div className="grain" />
    <nav>
      <a className="wordmark" href="#top" aria-label="UNIO home"><img src={logoUrl} alt="UNIO" /></a>
      <p>MIAMI / 2026</p><button className="menu-button" aria-label="Open menu"><i /><i /></button>
    </nav>
    <section className="hero" id="top">
      <div className="eyebrow"><span /> A new kind of gathering <span /></div>
      <h1>Come back<br />to your <em>center.</em></h1>
      <p className="intro">A sunlit pause for body, mind, and the people who make life feel a little more alive.</p>
      <div className="launch-row"><div><p className="micro-label">FIRST GATHERING</p><p className="date">NOVEMBER 07—09<br />MIAMI BEACH</p></div><Countdown /></div>
    </section>
    <section className="signup" aria-labelledby="access-title">
      <div className="signup-copy"><p className="micro-label">BE THE FIRST TO KNOW</p><h2 id="access-title">The feeling<br />is on its way.</h2></div>
      <form onSubmit={handleSubmit}><label className="sr-only" htmlFor="email">Your email address</label><input id="email" type="email" placeholder="Your email address" required /><button type="submit"><span className="button-default">Join the circle</span><span className="button-success">You’re on the list</span><b>↗</b></button></form>
      <p className="fine-print">An occasional note from us. No noise, ever.</p>
    </section>
    <footer><p>© 2026 UNIO</p><a href="https://instagram.com" target="_blank" rel="noreferrer">INSTAGRAM ↗</a><p>MADE FOR THE MOMENT</p></footer>
  </main>
}

createRoot(document.getElementById('root')).render(<StrictMode><V2 /></StrictMode>)
