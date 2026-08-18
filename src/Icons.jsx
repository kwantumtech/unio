/**
 * Line icons drawn to match the circle-glyph set on the Unio save-the-date.
 * All decorative — the adjacent text carries the meaning, so they're aria-hidden.
 */

const ring = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.25 }
const line = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.25,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

function Glyph({ children }) {
  return (
    <svg className="glyph" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <circle cx="32" cy="32" r="30.5" {...ring} />
      {children}
    </svg>
  )
}

export const Recalibrate = () => (
  <Glyph>
    <path {...line} d="M17 26c3.75-4 7.5-4 11.25 0S35.5 30 39.25 26 46.75 22 50.5 26" />
    <path {...line} d="M17 34c3.75-4 7.5-4 11.25 0S35.5 38 39.25 34 46.75 30 50.5 34" />
    <path {...line} d="M17 42c3.75-4 7.5-4 11.25 0S35.5 46 39.25 42 46.75 38 50.5 42" />
  </Glyph>
)

export const Regulate = () => (
  <Glyph>
    {/* Top-down brain, mirrored about the fissure — matching the save-the-date
        set. An earlier version drew it in profile, which read as a different
        icon entirely. The two hemispheres are the same path reflected on x. */}
    {/* Narrowed and stretched about the centre. Measured off the flier: the
        brain fills 0.57 of the ring across and 0.71 down — a tall oval, not the
        near-circle the raw path describes. */}
    <g transform="translate(32 32) scale(0.89 1.088) translate(-32 -32)">
      {[1, -1].map((dir) => (
        <g key={dir} transform={dir === 1 ? undefined : 'translate(64,0) scale(-1,1)'}>
          {/* Arc radii sit just above half each chord, which is what gives the
              perimeter its deep scallops rather than a smooth bulge. */}
          <path
            {...line}
            d="M32 13.2a3.5 3.5 0 0 0-5.5.2 3.5 3.5 0 0 0-5 2.8 3.5 3.5 0 0 0-4 4.5
               3.5 3.5 0 0 0-2.5 5.5 3.5 3.5 0 0 0-.7 6 3.5 3.5 0 0 0 1.1 6
               3.5 3.5 0 0 0 2.6 5.5 3.5 3.5 0 0 0 4.5 4.5 3.5 3.5 0 0 0 5.5 2.8
               3.5 3.5 0 0 0 4 .2"
          />
          <path {...line} d="M26.2 20.4c-2.6.2-3.7 2.8-2 4.4" />
          <path {...line} d="M20.6 26.8c2.3.3 3.6 2.5 2.6 4.4" />
          <path {...line} d="M25.6 33.4c-2.5.5-3.4 3.2-1.6 4.7" />
          <path {...line} d="M20.8 41.2c2.4-.2 4.2 1.8 3.6 3.9" />
        </g>
      ))}
      {/* The fissure carries more weight than the outline in the original. */}
      <path {...line} strokeWidth="1.8" d="M32 12.9v38.2" />
    </g>
  </Glyph>
)

export const Reset = () => (
  <Glyph>
    <circle cx="32" cy="32" r="6.5" {...ring} />
    {Array.from({ length: 12 }, (_, i) => {
      const angle = (i * Math.PI) / 6
      const [dx, dy] = [Math.sin(angle), -Math.cos(angle)]
      return (
        <line
          key={i}
          {...line}
          x1={32 + dx * 12}
          y1={32 + dy * 12}
          x2={32 + dx * (i % 2 ? 17 : 21)}
          y2={32 + dy * (i % 2 ? 17 : 21)}
        />
      )
    })}
  </Glyph>
)

export const Pin = () => (
  <svg className="pin" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path {...line} d="M12 21.5s7-6.2 7-11.5a7 7 0 1 0-14 0c0 5.3 7 11.5 7 11.5Z" />
    <circle cx="12" cy="10" r="2.6" {...ring} />
  </svg>
)

const ArrowGlyph = () => (
  <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path {...line} d="M5 12h14M13 6l6 6-6 6" />
  </svg>
)

/** Two stacked arrows: on hover the first exits right as the second arrives. */
export const Arrow = () => (
  <span className="btn__arrows" aria-hidden="true">
    <ArrowGlyph />
    <ArrowGlyph />
  </span>
)

/**
 * Serotonin — 5-hydroxytryptamine. Skeletal structure, drawn to the same
 * line weight as the pillar glyphs: an indole (benzene fused to a pyrrole),
 * a hydroxyl on C5 of the benzene, an ethylamine chain off C3.
 *
 * Overlaid on the hero rather than baked into the footage, so it can be timed
 * to the scroll and repositioned as the camera moves.
 */
export const Serotonin = () => (
  <svg className="molecule" viewBox="0 0 124 92" aria-hidden="true" focusable="false">
    {/* benzene */}
    <path {...line} d="M51.9 37 38 29l-13.9 8v16L38 61l13.9-8Z" />
    {/* aromatic ring — a circle reads cleaner than three inner bonds at this size */}
    <circle cx="38" cy="45" r="8.4" {...ring} strokeOpacity="0.55" />
    {/* pyrrole, fused on the shared edge */}
    <path {...line} d="M51.9 37l15.2-4.9L76.5 45l-9.4 12.9L51.9 53" />
    {/* the ring nitrogen */}
    <text x="67.1" y="29.4" className="molecule__atom">N</text>
    {/* hydroxyl on C5 */}
    <path {...line} d="M24.1 53 13 59.4" />
    <text x="10.4" y="70" className="molecule__atom molecule__atom--end">HO</text>
    {/* ethylamine chain off C3 */}
    <path {...line} d="M67.1 57.9 79 65.2l12-7" />
    <text x="93.4" y="55.4" className="molecule__atom">NH₂</text>
  </svg>
)
