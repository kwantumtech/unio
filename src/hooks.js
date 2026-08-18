import { useEffect, useRef, useState } from 'react'

export const EVENT_DATE = new Date('2026-09-19T09:00:00-04:00')

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Adds `.is-in` to an element the first time it enters the viewport, which is
 * what every scroll-reveal in unio.css keys off. One observer per element keeps
 * the work off the scroll thread entirely.
 */
export function useReveal({ threshold = 0.18, rootMargin = '0px 0px -8% 0px' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) {
      el.classList.add('is-in')
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        el.classList.add('is-in')
        observer.disconnect()
      },
      { threshold, rootMargin },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return ref
}

/** True once the page has scrolled past `offset` — drives the nav condense. */
export function useScrolled(offset = 24) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > offset)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [offset])

  return scrolled
}

/**
 * True while a dark-background section sits under the nav bar, so the nav can
 * invert instead of floating as a cream slab over the deep green.
 * Uses a thin observer band at the top of the viewport — no scroll listener.
 */
export function useDarkNav(selector = '.space, .ethos, .interest, .footer', band = 72) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const targets = [...document.querySelectorAll(selector)]
    if (!targets.length || !('IntersectionObserver' in window)) return

    const overlapping = new Set()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) overlapping.add(entry.target)
          else overlapping.delete(entry.target)
        }
        setDark(overlapping.size > 0)
      },
      { rootMargin: `0px 0px ${band - window.innerHeight}px 0px` },
    )

    targets.forEach((t) => observer.observe(t))
    return () => observer.disconnect()
  }, [selector, band])

  return dark
}

/**
 * Drives every `[data-speed]` element from one rAF-throttled scroll listener.
 * Skipped on narrow/coarse-pointer devices, where the cost outweighs the effect.
 */
export function useParallax() {
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(min-width: 860px)').matches) return

    const nodes = [...document.querySelectorAll('[data-speed]')]
    if (!nodes.length) return

    let frame = null

    const apply = () => {
      frame = null
      const viewportHeight = window.innerHeight
      for (const node of nodes) {
        const { top, height } = node.getBoundingClientRect()
        if (top > viewportHeight || top + height < 0) continue
        // -1 → 1 as the element travels through the viewport
        const progress = (top + height / 2 - viewportHeight / 2) / (viewportHeight / 2 + height / 2)
        node.style.transform = `translate3d(0, ${(progress * Number(node.dataset.speed)).toFixed(2)}px, 0)`
      }
    }

    const onScroll = () => {
      frame ??= requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])
}

/**
 * Scales `ref` vertically with scroll progress — the hairline spine down the
 * left margin. Writes straight to style in a rAF, so it never re-renders React.
 */
export function useScrollProgress(ref) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    let frame = null

    const apply = () => {
      frame = null
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0
      el.style.transform = `scaleY(${progress.toFixed(4)})`
    }

    const onScroll = () => {
      frame ??= requestAnimationFrame(apply)
    }

    apply()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [ref])
}

/** True once the given section has reached the viewport — hides the mobile bar. */
export function useSectionPassed(selector) {
  const [passed, setPassed] = useState(false)

  useEffect(() => {
    const target = document.querySelector(selector)
    if (!target || !('IntersectionObserver' in window)) return

    const observer = new IntersectionObserver(([entry]) => setPassed(entry.isIntersecting), {
      rootMargin: '0px 0px -35% 0px',
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [selector])

  return passed
}

/**
 * Pointer-tracked pull on every `.magnetic` element. The button leans toward
 * the cursor while it is near, and springs back on leave. Fine pointers only —
 * on touch there is no hover state to lean into.
 */
export function useMagnetic({ strength = 0.32, radius = 1.6 } = {}) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const nodes = [...document.querySelectorAll('.magnetic')]
    if (!nodes.length) return

    const release = (node) => {
      node.style.transition = 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
      node.style.setProperty('--mx', '0px')
      node.style.setProperty('--my', '0px')
    }

    const cleanups = nodes.map((node) => {
      const onMove = (event) => {
        const { left, top, width, height } = node.getBoundingClientRect()
        const dx = event.clientX - (left + width / 2)
        const dy = event.clientY - (top + height / 2)
        // Fade the pull out toward the edge of the sensing radius.
        const reach = Math.max(width, height) * radius
        const falloff = Math.max(0, 1 - Math.hypot(dx, dy) / reach)
        node.style.transition = 'none'
        node.style.setProperty('--mx', `${(dx * strength * falloff).toFixed(2)}px`)
        node.style.setProperty('--my', `${(dy * strength * falloff * 0.6).toFixed(2)}px`)
      }
      const onLeave = () => release(node)

      node.addEventListener('pointermove', onMove)
      node.addEventListener('pointerleave', onLeave)
      node.addEventListener('blur', onLeave)
      return () => {
        node.removeEventListener('pointermove', onMove)
        node.removeEventListener('pointerleave', onLeave)
        node.removeEventListener('blur', onLeave)
      }
    })

    return () => cleanups.forEach((fn) => fn())
  }, [strength, radius])
}

/**
 * Tracks the pointer across a container as `--px`/`--py`, so a soft light can
 * follow the cursor over it. One rAF-throttled listener on the container, no
 * per-cell handlers, no React state. Fine pointers only.
 */
export function usePointerLight(selector) {
  useEffect(() => {
    if (prefersReducedMotion()) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return

    const el = document.querySelector(selector)
    if (!el) return

    let frame = null
    let next = null

    const apply = () => {
      frame = null
      el.style.setProperty('--px', `${next.x.toFixed(1)}px`)
      el.style.setProperty('--py', `${next.y.toFixed(1)}px`)
    }

    const onMove = (event) => {
      const { left, top } = el.getBoundingClientRect()
      next = { x: event.clientX - left, y: event.clientY - top }
      frame ??= requestAnimationFrame(apply)
    }

    const onEnter = () => el.classList.add('is-lit')
    const onLeave = () => el.classList.remove('is-lit')

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerenter', onEnter)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerenter', onEnter)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [selector])
}

/**
 * Picks a rung off the video ladder. Most viewers are on fast connections where
 * bytes are not the constraint, so the default leans to quality: `hi` unless
 * something concrete says otherwise. `navigator.connection` is Chromium-only —
 * absent, we assume a good link and let pixel density decide.
 */
function pickVideoTier() {
  const link = navigator.connection

  if (link?.saveData) return 'lo'
  if (/^(slow-2g|2g|3g)$/.test(link?.effectiveType ?? '')) return 'lo'
  // downlink is Mbps; a 2 MB loop wants a few seconds of headroom, not minutes.
  if (typeof link?.downlink === 'number' && link.downlink < 5) return 'md'

  return (window.devicePixelRatio || 1) >= 1.5 ? 'hi' : 'md'
}

/**
 * An ambient background loop that costs nothing until it is on screen: the
 * source is only attached when the element approaches the viewport, and it
 * pauses again on the way out. Never plays under reduced-motion, where the
 * poster frame stands in for it.
 */
export function useAmbientVideo(ref, base) {
  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (prefersReducedMotion() || !('IntersectionObserver' in window)) return

    const src = `${base}-${pickVideoTier()}.mp4`

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (!video.src) video.src = src
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { rootMargin: '25% 0px' },
    )

    observer.observe(video)
    return () => {
      observer.disconnect()
      video.pause()
    }
  }, [ref, base])
}

/**
 * Cinematic hero playback: the film starts on load, plays through once and
 * parks on its final frame — no loop, no scroll coupling. The still under it
 * covers first paint, and stays as the hero wherever playback never begins
 * (reduced-motion, or an autoplay the browser declines).
 *
 * Also anchors the serotonin overlay by mapping a fixed point in the source
 * frame — her head, once the camera settles at the end of the clip — through
 * the same cover-fit maths the browser applies to the panel, published as
 * `--sx`/`--sy`. The overlay offsets itself into the negative space beside
 * her from there.
 */
export function useHeroFilm(panelRef, videoRef) {
  useEffect(() => {
    const panel = panelRef.current
    const video = videoRef.current
    if (!panel || !video) return

    const anchor = () => {
      const cw = panel.clientWidth
      const ch = panel.clientHeight
      const cover = Math.max(cw / 1280, ch / 720)
      const dw = 1280 * cover
      const dh = 720 * cover
      // Sampled off the clip's held final frame: 0.505 across, 0.455 down.
      panel.style.setProperty('--sx', `${((cw - dw) / 2 + 0.505 * dw).toFixed(1)}px`)
      panel.style.setProperty('--sy', `${((ch - dh) / 2 + 0.455 * dh).toFixed(1)}px`)
    }

    anchor()
    window.addEventListener('resize', anchor, { passive: true })

    if (!prefersReducedMotion()) {
      // Swap the still for the film only once frames are actually rendering,
      // so a blocked autoplay quietly leaves the poster in place.
      video.addEventListener('playing', onPlaying, { once: true })
      video.play().catch(() => {})
    }

    function onPlaying() {
      panel.dataset.film = 'on'
    }

    return () => {
      window.removeEventListener('resize', anchor)
      video.removeEventListener('playing', onPlaying)
    }
  }, [panelRef, videoRef])
}

const UNITS = [
  ['Days', 86_400_000],
  ['Hours', 3_600_000],
  ['Minutes', 60_000],
  ['Seconds', 1_000],
]

/** Returns [{ label, value }] counting down to the event, or null once it passes. */
export function useCountdown(target = EVENT_DATE) {
  const read = () => {
    const remaining = target - Date.now()
    if (remaining <= 0) return null
    let rest = remaining
    return UNITS.map(([label, ms]) => {
      const value = Math.floor(rest / ms)
      rest -= value * ms
      return { label, value: String(value).padStart(2, '0') }
    })
  }

  const [parts, setParts] = useState(read)

  useEffect(() => {
    const id = setInterval(() => setParts(read), 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return parts
}
