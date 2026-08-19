# Unio — Copy Reference

This document is the source-of-truth reference for the copy currently presented by the site. It is intended for client copy updates and handoff.

## How updates work

- The full Unio experience is rendered at `/preview` while `/` renders the Coming Soon page.
- Page copy lives primarily in `src/App.jsx`.
- SEO and social-share copy lives in `index.html`.
- Coming Soon copy lives in `src/ComingSoon.jsx`.
- Form checkbox values must match the connected Google Form options exactly, including punctuation.
- After changing copy, run `npm run build` and check both desktop and mobile layouts.

## Coming Soon page (`/`)

| Location | Copy |
| --- | --- |
| Page title | `Coming Soon` |
| Caption | `The science of reset` |
| Logo alt text | `Unio` |

## Global navigation

### Desktop and mobile navigation

- `What is Unio`
- `The Space`
- `Ethos`
- `Who It’s For`
- `Purchase tickets`

### Accessibility and supporting text

- Skip link: `Skip to content`
- Home link label: `Unio — home`
- Closed menu label: `Open menu`
- Open menu label: `Close menu`
- External-link announcement: `(opens in a new tab)`

### Mobile menu metadata

```text
09.19.2026 — Sacred Space Miami
Wynwood
```

## Hero

- Eyebrow: `Save the date.`
- Date: `9.19`
- Partner billing: `A-List Events presents`
- Main title: `The Science of Reset.`
- Description:

```text
A science-backed wellness experience for high-performing professionals, leaders, and teams who understand that health is wealth.
```

- Primary button: `Purchase tickets`
- Secondary link: `What is Unio?`
- Countdown labels: `Days`, `Hours`, `Minutes`, `Seconds`
- Chemical annotation: `serotonin`
- Chemical definition:

```text
the neurotransmitter that stabilizes mood and induces feelings of well-being.
```

## Mobile action bar

- Date: `09.19.26`
- Venue: `Sacred Space Miami`
- Button: `Purchase tickets`

## Pillars

### Section label

- Accessibility label: `What Unio does`

### Three pillars

| Title | Supporting copy |
| --- | --- |
| `Recalibrate` | `your baseline` |
| `Regulate` | `with evidence-based tools` |
| `Reset` | `with precision` |

## Section I — What is Unio?

- Kicker: `What is Unio?`
- Heading: `A reset that is engineered, not improvised.`
- Body paragraph 1:

```text
Unio is a science-backed wellness experience designed for high-performing professionals, leaders, and teams who understand that health is wealth. Through neuroscience, breathwork, movement, and curated dialogue, Unio restores clarity, strengthens connection, and recalibrates the nervous system.
```

- Body paragraph 2:

```text
Grounded in research and delivered with intention, Unio equips leaders with practical tools to enhance focus, creativity, and collaboration, while fostering genuine community.
```

## Section II — The Space

- Kicker: `The Space`
- Heading:

```text
We have a date.
And a space designed for it.
```

### Venue facts

| Label | Value |
| --- | --- |
| `Date` | `Saturday, September 19, 2026` |
| `Venue` | `Sacred Space Miami` |
| `Neighborhood` | `Wynwood, Miami` |

- Map button: `Sacred Space Miami — Wynwood`
- Map accessibility text: `(view on Google Maps, opens in a new tab)`

## Section III — Who is Unio for?

- Kicker: `Who is Unio for?`
- Heading: `For the people the room depends on.`

| Audience | Supporting copy |
| --- | --- |
| `Founders and entrepreneurs` | `navigating growth, pressure, and decision fatigue` |
| `Creative leaders and visionaries` | `seeking depth beyond traditional networking` |
| `High-performing professionals` | `who value clarity, regulation, and intentional living` |
| `Individuals` | `who invest in personal growth, leadership, and meaningful community` |
| `Executive teams` | `seeking sustainable performance` |
| `HR leaders and People & Culture teams` | `focused on retention and engagement` |
| `Companies` | `that recognize burnout and disconnection as business risks` |
| `Organizations` | `investing in emotional intelligence, leadership regulation, and culture` |

## Pull quote

```text
Health is not a perk.
It is infrastructure.
```

## Section IV — Unio’s Ethos

- Kicker: `Unio’s Ethos`
- Heading: `Why Unio exists.`

1. `Unio exists because the way we work is outpacing the way we are wired`
2. `Unio exists to recalibrate the internal state of the people making decisions that affect many`
3. `Unio exists to restore humanity inside high-performance environments`
4. `Unio is rooted in the belief that health is not a perk, it is infrastructure`
5. `Unio understands that culture is shaped by the emotional state of its leaders`

## Section V — How can Unio help you?

- Kicker: `How can Unio help you?`
- Introductory copy:

```text
Unio delivers an emotionally intelligent experience for individuals and teams, which will help organizations:
```

### Benefits

1. `Reduce burnout`
2. `Strengthen connection`
3. `Elevate` / `workplace culture`
4. `Increase` / `employee` / `engagement`

- Supporting copy:

```text
All of this is achieved through science-backed techniques and community-building.
```

## Section VI — Express Interest

- Kicker: `Express Interest`
- Heading: `Seats are limited — intentionally so.`
- Body copy:

```text
Tell us who you are. We’ll follow up with the full programme, timings, and how to secure a place — for yourself or your team.
```

- Event stamp: `09.19.2026 — Sacred Space Miami, Wynwood`

### Form fields

| Field | Required | Label / prompt |
| --- | --- | --- |
| Name | Yes | `Name` |
| Email | Yes | `Email` |
| Phone | No | `Phone number` |
| Interests | Yes | `What would you like to learn more about?` |

- Required marker: `*`
- Interest helper text: `Select all that apply.`
- Submit button: `Express Interest`
- Sending state: `Sending…`
- Privacy note: `We’ll only ever write to you about Unio.`
- Success message: `Thank you — we’ll be in touch shortly.`
- Error message: `Something went wrong. Please email info@alistevents.net.`

### Interest checkbox options

These values are submitted to the Google Form and must remain byte-for-byte identical unless the form is updated at the same time.

1. `Breathwork and science-backed movement practices`
2. `Leadership presence — communication, confidence, and impact`
3. `Nervous system regulation and restorative sleep`
4. `Gut health and its connection to cognitive performance`
5. `Intentional community and curated connection`
6. `Emotional regulation under pressure`

### Validation messages

- Name: `Please tell us your name.`
- Email: `Please enter a valid email address.`
- Interests: `Please choose at least one.`

## Footer

- Tagline: `The Science of Reset.`
- A-List logo alt text: `A-List Events — 360° event management`
- Copyright: `©2026 A-List Events, Inc. All rights reserved.`
- Credit link: `Made with care by Kwantum`

## SEO and social sharing copy

These values are in `index.html` and are used by search engines, Facebook, Messenger, and other link-preview systems.

- Page title: `Unio — The Science of Reset · 9.19 · Sacred Space Miami`
- Meta description:

```text
Unio is a science-backed wellness experience for high-performing professionals, leaders and teams. September 19, 2026 at Sacred Space Miami, Wynwood.
```

- Social title: `Unio — The Science of Reset`
- Social description:

```text
A science-backed wellness experience for high-performing professionals, leaders and teams. 9.19.2026 · Sacred Space Miami, Wynwood.
```

- Social image alt text:

```text
A woman seated in meditation on a terrace above Biscayne Bay at sunrise, beside the Unio wordmark.
```

## Structured event data

The event metadata in `index.html` currently uses:

- Event name: `Unio — The Science of Reset`
- Start: `September 19, 2026 at 9:00 AM EDT`
- End: `September 19, 2026 at 6:00 PM EDT`
- Venue: `Sacred Space Miami`
- City: `Miami`
- State: `FL`
- Organizer: `A-List Events, Inc.`
