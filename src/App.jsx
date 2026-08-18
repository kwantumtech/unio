import { Fragment, useEffect, useId, useRef, useState } from 'react'
import { Arrow, Pin, Recalibrate, Regulate, Reset, Serotonin } from './Icons.jsx'
import {
  useCountdown,
  useDarkNav,
  useParallax,
  useReveal,
  useAmbientVideo,
  useHeroFilm,
  useMagnetic,
  usePointerLight,
  useScrollProgress,
  useScrolled,
  useSectionPassed,
} from './hooks.js'

/* ------------------------------------------------------------------ content */

const NAV = [
  ['What is Unio', '#about'],
  ['The Space', '#space'],
  ['Ethos', '#ethos'],
  ['Who It’s For', '#audience'],
]

/** FreshBooks checkout. External processor, so it opens in its own tab. */
const TICKET_URL = 'https://my.freshbooks.com/#/checkout/a50fe30292154de498e3a3d5d300ff62'

const ALIST_URL = 'https://alistevents.net/'
const BUILDER_URL = 'https://kwantumtech.com/'

const MAPS_URL =
  'https://www.google.com/maps/place/Sacred+Space+Miami+%E2%80%94+Wynwood/data=!4m2!3m1!1s0x88d9b6ab88c6f72d:0xbb7883455cfc93e5?sa=X&ved=1t:242&ictx=111'

const PILLARS = [
  [Recalibrate, 'Recalibrate', 'your baseline'],
  [Regulate, 'Regulate', 'with evidence-based tools'],
  [Reset, 'Reset', 'with precision'],
]

const ETHOS = [
  'Unio exists because the way we work is outpacing the way we are wired',
  'Unio exists to recalibrate the internal state of the people making decisions that affect many',
  'Unio exists to restore humanity inside high-performance environments',
  'Unio is rooted in the belief that health is not a perk, it is infrastructure',
  'Unio understands that culture is shaped by the emotional state of its leaders',
]

const AUDIENCE = [
  ['Founders and entrepreneurs', 'navigating growth, pressure, and decision fatigue'],
  ['Creative leaders and visionaries', 'seeking depth beyond traditional networking'],
  ['High-performing professionals', 'who value clarity, regulation, and intentional living'],
  ['Individuals', 'who invest in personal growth, leadership, and meaningful community'],
  ['Executive teams', 'seeking sustainable performance'],
  ['HR leaders and People & Culture teams', 'focused on retention and engagement'],
  ['Companies', 'that recognize burnout and disconnection as business risks'],
  ['Organizations', 'investing in emotional intelligence, leadership regulation, and culture'],
]

// Each entry is its own set of lines, so a break can be placed deliberately
// rather than left to whatever the column width happens to do.
const INTERESTS = [
  'Breathwork and science-backed movement practices',
  'Leadership presence — communication, confidence, and impact',
  'Nervous system regulation and restorative sleep',
  'Gut health and its connection to cognitive performance',
  'Intentional community and curated connection',
  'Emotional regulation under pressure',
]

const BENEFITS = [
  ['Reduce burnout'],
  ['Strengthen connection'],
  ['Elevate', 'workplace culture'],
  ['Increase', 'employee', 'engagement'],
]

/* --------------------------------------------------------------- primitives */

/** Word-masked heading. Each word rises out of its own clip, staggered. */
function Words({ as: Tag = 'h2', text, className = '', delay = 0, step = 38 }) {
  return (
    <Tag className={`words ${className}`}>
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          <span className="words__mask">
            <span className="words__word" style={{ '--d': `${delay + i * step}ms` }}>
              {word}
            </span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Section eyebrow: chapter numeral, rule, label. */
function Kicker({ numeral, children }) {
  return (
    <p className="kicker">
      {numeral && <span className="kicker__numeral">{numeral}</span>}
      <span className="kicker__rule" aria-hidden="true" />
      <span className="kicker__label">{children}</span>
    </p>
  )
}

function Section({ id, tone = 'light', className = '', children, ...rest }) {
  const ref = useReveal()
  return (
    <section id={id} ref={ref} className={`section section--${tone} ${className}`} {...rest}>
      {children}
    </section>
  )
}

/* --------------------------------------------------------------------- nav */

function Spine() {
  const ref = useRef(null)
  useScrollProgress(ref)
  return (
    <div className="spine" aria-hidden="true">
      <span className="spine__fill" ref={ref} />
    </div>
  )
}

function Nav() {
  const scrolled = useScrolled(40)
  const dark = useDarkNav()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('is-locked', open)
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    <>
      <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${dark && !open ? 'is-dark' : ''}`}>
        <a className="nav__brand" href="#top" aria-label="Unio — home">
          <img src="/assets/logos/logo-green.webp" alt="Unio" width="700" height="293" />
          <img src="/assets/logos/logo-cream.webp" alt="" aria-hidden="true" width="700" height="293" />
        </a>

        <nav className="nav__links" aria-label="Primary">
          {NAV.map(([label, href]) => (
            <a key={href} href={href}>
              {label}
            </a>
          ))}
        </nav>

        <a
          className="btn btn--sm nav__cta magnetic"
          href={TICKET_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Purchase tickets
          <span className="sr-only"> (opens in a new tab)</span>
        </a>

        <button
          className={`nav__toggle ${open ? 'is-open' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
        >
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
        </button>
      </header>

      <div id="mobile-menu" className={`menu ${open ? 'is-open' : ''}`} inert={!open}>
        <nav aria-label="Mobile">
          {NAV.map(([label, href], i) => (
            <a key={href} href={href} onClick={() => setOpen(false)} style={{ '--d': `${i * 60}ms` }}>
              {label}
            </a>
          ))}
        </nav>
        <a
          className="btn"
          href={TICKET_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => setOpen(false)}
        >
          Purchase tickets
          <span className="sr-only"> (opens in a new tab)</span>
          <Arrow />
        </a>
        <p className="menu__meta">
          09.19.2026 — Sacred Space Miami
          <br />
          Wynwood
        </p>
      </div>
    </>
  )
}

/** Thumb-reachable action bar; phones only, between the hero and the form. */
function MobileBar() {
  // Up once the hero has left, down again once the form itself is on screen.
  const heroInView = useSectionPassed('#top')
  const atForm = useSectionPassed('#interest')
  const up = !heroInView && !atForm

  return (
    <div className={`actionbar ${up ? 'is-up' : ''}`} inert={up ? undefined : true}>
      <p>
        <b>09.19.26</b>
        <span>Sacred Space Miami</span>
      </p>
      <a className="btn btn--sm" href={TICKET_URL} target="_blank" rel="noopener noreferrer">
        Purchase tickets
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  )
}

/* -------------------------------------------------------------------- hero */

/** A value that rolls: the outgoing number lifts away as the new one arrives. */
function Roll({ value }) {
  const [shown, setShown] = useState(value)
  const rolling = shown !== value

  useEffect(() => {
    if (shown === value) return
    const id = setTimeout(() => setShown(value), 520)
    return () => clearTimeout(id)
  }, [value, shown])

  return (
    <span className={`roll ${rolling ? 'is-rolling' : ''}`}>
      <span className="roll__out">{shown}</span>
      <span className="roll__in" aria-hidden="true">
        {value}
      </span>
    </span>
  )
}

function Countdown() {
  const parts = useCountdown()
  if (!parts) return null

  return (
    <div className="countdown" aria-label="Time remaining until Unio">
      {parts.map(({ label, value }, i) => (
        <div className="countdown__unit" key={label} style={{ '--d': `${1070 + i * 90}ms` }}>
          <span className="countdown__value">
            <Roll value={value} />
          </span>
          <span className="countdown__label">{label}</span>
        </div>
      ))}
    </div>
  )
}

function Hero() {
  const panel = useRef(null)
  const video = useRef(null)
  useHeroFilm(panel, video)

  return (
    // An editorial spread: copy panel beside a contained film panel, not a
    // full-bleed background. The film plays once on load and holds its final
    // frame — no pinning, no scrubbing; scrolling simply moves past it.
    <section className="hero" id="top">
      <div className="hero__media" ref={panel}>
        <video
          ref={video}
          className="hero__film"
          poster="/assets/images/orbit-poster.webp"
          width="1280"
          height="720"
          muted
          playsInline
          preload="auto"
          aria-hidden="true"
        >
          <source src="/assets/video/orbit-hi.mp4" type="video/mp4" media="(min-width: 1200px)" />
          <source src="/assets/video/orbit-md.mp4" type="video/mp4" />
        </video>

        {/* Covers first paint, and stands in as the hero under reduced-motion
            or wherever autoplay is declined. */}
        <img
          className="hero__still"
          src="/assets/images/orbit-poster.webp"
          srcSet="/assets/images/orbit-poster-900.webp 900w, /assets/images/orbit-poster.webp 1280w"
          sizes="100vw"
          alt="A woman seated in meditation on a terrace at sunrise, palms and the Miami skyline beyond the water."
          width="1280"
          height="720"
          fetchPriority="high"
          decoding="async"
        />

        {/* Not an overlay on the footage — a short seam where the copy panel
            bleeds into the film's near edge. */}
        <span className="hero__wash" aria-hidden="true" />

        <div className="hero__molecule" aria-hidden="true">
          <Serotonin />
        </div>
      </div>

      <div className="hero__copy">
        <p className="hero__save">Save the date.</p>

        <div className="hero__dateblock" aria-hidden="true">
          <p className="hero__date">9.19</p>
          <span className="hero__stem" />
        </div>

        <p className="hero__presents">
          <a href={ALIST_URL} target="_blank" rel="noopener noreferrer">
            <img src="/assets/logos/alist.webp" alt="A-List Events" width="443" height="82" />
          </a>
          <span>presents</span>
        </p>

        <h1 className="hero__title">The Science of Reset.</h1>

        <p className="hero__lede">
          A science-backed wellness experience for high-performing professionals, leaders, and
          teams who understand that health is wealth.
        </p>

        <div className="hero__actions">
          <a className="btn magnetic" href={TICKET_URL} target="_blank" rel="noopener noreferrer">
            Purchase tickets
            <span className="sr-only"> (opens in a new tab)</span>
            <Arrow />
          </a>
          <a className="link-quiet" href="#about">
            What is Unio?
          </a>
        </div>

        <Countdown />
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------- sections */

function Pillars() {
  const ref = useReveal({ threshold: 0.25 })
  return (
    <section className="pillars" ref={ref} aria-label="What Unio does">
      <ul className="pillars__grid">
        {PILLARS.map(([Icon, title, note], i) => (
          <li key={title} style={{ '--d': `${i * 120}ms` }}>
            <Icon />
            <h2>{title}</h2>
            <p>{note}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

function About() {
  const video = useRef(null)
  useAmbientVideo(video, '/assets/video/water')

  return (
    <Section id="about" tone="light" className="about">
      <figure className="about__figure reveal-mask">
        <video
          ref={video}
          data-speed="42"
          poster="/assets/images/water-poster.webp"
          width="480"
          height="600"
          muted
          loop
          playsInline
          preload="none"
          aria-hidden="true"
        />
      </figure>

      <div className="about__body">
        <Kicker numeral="I">What is Unio?</Kicker>
        <Words as="h2" className="display" text="A reset that is engineered, not improvised." />
        <p className="prose">
          Unio is a science-backed wellness experience designed for high-performing professionals,
          leaders, and teams who understand that health is wealth. Through neuroscience, breathwork,
          movement, and curated dialogue, Unio restores clarity, strengthens connection, and
          recalibrates the nervous system.
        </p>
        <p className="prose">
          Grounded in research and delivered with intention, Unio equips leaders with practical tools
          to enhance focus, creativity, and collaboration, while fostering genuine community.
        </p>
      </div>
    </Section>
  )
}

function Quote() {
  const ref = useReveal({ threshold: 0.3 })
  return (
    <section className="quote" ref={ref}>
      <img
        className="quote__bg"
        data-speed="-34"
        src="/assets/images/terrace.webp"
        srcSet="/assets/images/terrace-640.webp 640w, /assets/images/terrace-960.webp 960w, /assets/images/terrace.webp 1536w"
        sizes="100vw"
        alt=""
        width="1536"
        height="445"
        loading="lazy"
        decoding="async"
      />
      <blockquote className="plate">
        <p>
          Health is not a perk.
          <br />
          It is <em>infrastructure.</em>
        </p>
      </blockquote>
    </section>
  )
}

function Space() {
  const ref = useReveal({ threshold: 0.2 })
  return (
    <section className="space" id="space" ref={ref}>
      <img
        className="space__bg"
        data-speed="-30"
        src="/assets/images/venue.webp"
        srcSet="/assets/images/venue-800.webp 800w, /assets/images/venue-1200.webp 1200w, /assets/images/venue.webp 1800w"
        sizes="100vw"
        alt="The reflecting pool at Sacred Space Miami at dusk — bamboo, bougainvillea and uplit palms running to a corten steel gate."
        width="1800"
        height="1035"
        loading="lazy"
        decoding="async"
      />
      <div className="space__panel plate">
        <div className="space__lede">
          <Kicker numeral="II">The Space</Kicker>
          <h2 className="display space__title">
            We have <em>a date.</em>
            <br />
            And a space <em>designed</em> for it.
          </h2>
        </div>

        <dl className="space__facts">
          {[
            ['Date', 'Saturday, September 19, 2026'],
            ['Venue', 'Sacred Space Miami'],
            ['Neighborhood', 'Wynwood, Miami'],
          ].map(([term, value], i) => (
            <div key={term} style={{ '--d': `${i * 110}ms` }}>
              <dt>{term}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>

        <a
          className="btn btn--ondark btn--venue magnetic"
          href={MAPS_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          <Pin />
          Sacred Space Miami — Wynwood
          <span className="sr-only"> (view on Google Maps, opens in a new tab)</span>
        </a>
      </div>
    </section>
  )
}

function Ethos() {
  const ref = useReveal({ threshold: 0.12 })
  usePointerLight('.ethos__grid')

  return (
    <section className="ethos" id="ethos" ref={ref}>
      <ol className="ethos__grid">
        <li className="ethos__head">
          <Kicker numeral="IV">Unio’s Ethos</Kicker>
          <h2 className="display">Why Unio exists.</h2>
        </li>

        {ETHOS.map((line, i) => (
          <li key={line} className="ethos__cell" style={{ '--d': `${i * 80}ms` }}>
            <span className="ethos__num">{String(i + 1).padStart(2, '0')}</span>
            <p>{line}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Audience() {
  return (
    <Section id="audience" tone="light" className="audience">
      <header className="audience__head">
        <Kicker numeral="III">Who is Unio for?</Kicker>
        <Words as="h2" className="display" text="For the people the room depends on." />
      </header>

      <ul className="audience__list">
        {AUDIENCE.map(([title, note], i) => (
          <li key={title} style={{ '--d': `${i * 60}ms` }}>
            <span className="audience__idx">{String(i + 1).padStart(2, '0')}</span>
            <h3>{title}</h3>
            <p>{note}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}

function Benefits() {
  return (
    <Section id="benefits" tone="warm" className="benefits">
      <header className="benefits__head">
        <Kicker numeral="V">How can Unio help you?</Kicker>
        <p className="prose prose--lead">
          Unio delivers an emotionally intelligent experience for individuals and teams, which will
          help organizations:
        </p>
      </header>

      <ul className="benefits__grid">
        {BENEFITS.map((lines, i) => (
          <li key={lines.join(' ')} style={{ '--d': `${i * 90}ms` }}>
            <span className="benefits__idx">{String(i + 1).padStart(2, '0')}</span>
            <h3>
              {lines.map((line, n) => (
                <Fragment key={line}>
                  {n > 0 && <br />}
                  {line}
                </Fragment>
              ))}
            </h3>
          </li>
        ))}
      </ul>

      <p className="benefits__foot">
        All of this is achieved through science-backed techniques and community-building.
      </p>
    </Section>
  )
}

/* ------------------------------------------------------------------- form */

/**
 * Google Form backing the Express Interest section. Posting straight to
 * `formResponse` writes a real row into the linked responses sheet.
 *
 * The request must be `no-cors`: Google sends no CORS headers, so the browser
 * would block a readable response. That makes the reply opaque — we can tell
 * the request left the machine, not that Google accepted it. The trade is
 * worth it because the alternative is bouncing the visitor to a Google page.
 *
 * Field ids come from the live form's FB_PUBLIC_LOAD_DATA_; the checkbox
 * values must match its option strings byte for byte or the row lands empty.
 */
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSfSOx2pmIRTtjOvBcnCo5hOcQXid1ojWBIoKqrdC8fuDQh5Gw/formResponse'

const GOOGLE_FIELDS = {
  name: 'entry.1747016377',
  email: 'entry.305553560',
  phone: 'entry.349499540',
  interests: 'entry.2141214542',
}

/** Set to send JSON to your own backend instead of the Google Form. */
const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT

function Interest() {
  const ref = useReveal({ threshold: 0.18 })
  const [status, setStatus] = useState('idle') // idle | sending | done | error
  const [errors, setErrors] = useState({})
  const uid = useId()
  const formRef = useRef(null)

  const clearError = (name) =>
    setErrors(({ [name]: _removed, ...rest }) => rest)

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const data = {
      name: form.get('name')?.trim() ?? '',
      email: form.get('email')?.trim() ?? '',
      phone: form.get('phone')?.trim() ?? '',
      // A checkbox group is many values under one name, so it cannot come
      // through Object.fromEntries — only the last box would survive.
      interests: form.getAll('interests'),
    }

    const next = {}
    if (!data.name) next.name = 'Please tell us your name.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) next.email = 'Please enter a valid email address.'
    if (!data.interests.length) next.interests = 'Please choose at least one.'
    setErrors(next)

    const firstInvalid = Object.keys(next)[0]
    if (firstInvalid) {
      // Focus by name, not by aria-invalid — that attribute lands a render later.
      formRef.current?.querySelector(`[name="${firstInvalid}"]`)?.focus()
      return
    }

    setStatus('sending')
    try {
      if (ENDPOINT) {
        const res = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        })
        if (!res.ok) throw new Error(String(res.status))
      } else {
        const body = new URLSearchParams()
        body.append(GOOGLE_FIELDS.name, data.name)
        body.append(GOOGLE_FIELDS.email, data.email)
        if (data.phone) body.append(GOOGLE_FIELDS.phone, data.phone)
        // Checkboxes repeat the same key once per selection.
        for (const interest of data.interests) body.append(GOOGLE_FIELDS.interests, interest)

        // URLSearchParams sets a CORS-safelisted content type, which is what
        // lets this through under no-cors. Do not add headers here.
        await fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body })
      }

      setStatus('done')
      formRef.current?.reset()
    } catch {
      setStatus('error')
    }
  }

  const field = (name, label, { required = false, ...props } = {}) => (
    <p className={`field field--text ${errors[name] ? 'is-invalid' : ''}`}>
      <label htmlFor={`${uid}-${name}`}>
        {label}
        {required && <b aria-hidden="true">*</b>}
      </label>
      <input
        id={`${uid}-${name}`}
        name={name}
        required={required}
        aria-invalid={errors[name] ? 'true' : undefined}
        aria-describedby={errors[name] ? `${uid}-${name}-err` : undefined}
        onChange={() => errors[name] && clearError(name)}
        {...props}
      />
      {errors[name] && (
        <span className="field__error" id={`${uid}-${name}-err`}>
          {errors[name]}
        </span>
      )}
    </p>
  )

  return (
    <section className="interest" id="interest" ref={ref}>
      <div className="interest__copy">
        <Kicker numeral="VI">Express Interest</Kicker>
        <h2 className="display">
          Seats are limited — <em>intentionally so.</em>
        </h2>
        <p className="prose">
          Tell us who you are. We’ll follow up with the full programme, timings, and how to secure a
          place — for yourself or your team.
        </p>
        <p className="interest__stamp">09.19.2026 — Sacred Space Miami, Wynwood</p>
      </div>

      <form className="interest__form" ref={formRef} onSubmit={handleSubmit} noValidate>
        {field('name', 'Name', { type: 'text', autoComplete: 'name', required: true })}
        {field('email', 'Email', { type: 'email', autoComplete: 'email', required: true })}
        {field('phone', 'Phone number', { type: 'tel', autoComplete: 'tel' })}

        <fieldset
          className={`field field--choice field--interests ${errors.interests ? 'is-invalid' : ''}`}
          aria-describedby={errors.interests ? `${uid}-interests-err` : undefined}
        >
          <legend>
            What would you like to learn more about?
            <b aria-hidden="true">*</b>
            <span>Select all that apply.</span>
          </legend>

          {INTERESTS.map((interest) => (
            <label key={interest}>
              <input
                type="checkbox"
                name="interests"
                value={interest}
                onChange={() => errors.interests && clearError('interests')}
              />
              <span>{interest}</span>
            </label>
          ))}

          {errors.interests && (
            <span className="field__error" id={`${uid}-interests-err`}>
              {errors.interests}
            </span>
          )}
        </fieldset>

        <button className="btn btn--wide magnetic" type="submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Express Interest'} <Arrow />
        </button>

        <p className="interest__status" role="status" aria-live="polite">
          {status === 'done' && 'Thank you — we’ll be in touch shortly.'}
          {status === 'error' && 'Something went wrong. Please email info@alistevents.net.'}
          {status === 'idle' && 'We’ll only ever write to you about Unio.'}
        </p>
      </form>
    </section>
  )
}

/* ------------------------------------------------------------------ footer */

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <img src="/assets/logos/logo-cream.webp" alt="Unio" width="700" height="293" loading="lazy" />
          <p>The Science of Reset.</p>
        </div>

        <a className="footer__alist" href={ALIST_URL} target="_blank" rel="noopener noreferrer">
          <img
            src="/assets/logos/alist-full.webp"
            alt="A-List Events — 360° event management"
            width="571"
            height="230"
            loading="lazy"
          />
        </a>
      </div>

      <div className="footer__legal">
        <p>©2026 A-List Events, Inc. All rights reserved.</p>
        <a href={BUILDER_URL} target="_blank" rel="noopener noreferrer">
          Made with care by Kwantum
        </a>
      </div>
    </footer>
  )
}

/* --------------------------------------------------------------------- app */

export default function App() {
  useParallax()
  useMagnetic()

  return (
    <>
      <a className="skip" href="#about">
        Skip to content
      </a>
      <Spine />
      <Nav />
      <main>
        <Hero />
        <Pillars />
        <About />
        <Space />
        <Audience />
        <Quote />
        <Ethos />
        <Benefits />
        <Interest />
      </main>
      <Footer />
      <MobileBar />
      <div className="grain" aria-hidden="true" />
    </>
  )
}
