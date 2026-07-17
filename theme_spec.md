# TripMind — Visual Identity & Theme Specification

**Direction:** *Modern Cartographer.* The visual language borrows from vintage atlases, brass travel instruments, and passport stamps — reinterpreted with clean, contemporary UI execution. It should feel like a well-made travel journal crossed with a serious data product, not a generic pastel "vacation app." Confident, editorial, a little precise — the kind of interface that makes a viva panel think "this looks like a real product."

Avoid the two most common AI-generated defaults: (1) cream background + terracotta accent, and (2) near-black background + one neon accent. This theme leans **ink navy dominant with a brass/gold accent** instead — closer to a ship's chart table than a beach postcard.

---

## 1. Color Palette

| Role | Name | Hex | Usage |
|---|---|---|---|
| Primary | Ink Navy | `#14213D` | Headers, nav bar, primary buttons, footer, dark section backgrounds |
| Primary Dark | Deep Ink | `#0B152A` | Hero backgrounds, hover state for primary buttons, highest-contrast text on light backgrounds |
| Secondary / Accent | Brass Gold | `#B8863B` | CTAs on dark backgrounds, active states, score badges, dividers, icons, links |
| Accent Light | Warm Sand | `#D9B876` | Hover states for gold elements, subtle highlights, secondary badges |
| Background | Paper White | `#FBF9F4` | Main page background (light mode) — warm off-white, not stark white |
| Surface | Card White | `#FFFFFF` | Cards, modals, input fields — sits on top of Paper White |
| Border / Hairline | Stone | `#E4DFD3` | Card borders, dividers, table lines |
| Text Primary | Ink Navy | `#14213D` | Headings, body copy |
| Text Secondary | Slate | `#5C6478` | Captions, meta info, placeholder text |
| Success / Nature | Pine | `#2F5D50` | Nature score bars, "eco-friendly" tags, positive states |
| Warning / Budget | Rust | `#B4552F` | Budget alerts, high-cost indicators (deliberately distinct from the common #D97757 terracotta) |
| Info | Harbor Blue | `#3C6E91` | Informational badges, map pins, weather/season tags |

### Usage ratio (roughly)
- 55% Paper White / Card White (breathing room, editorial feel)
- 25% Ink Navy (nav, footer, hero, headings)
- 12% Brass Gold + Warm Sand (accents, CTAs, active states — used with restraint)
- 8% supporting colors (Pine / Rust / Harbor Blue for scores and tags only — never as large fills)

**Rule:** Gold is a spice, not a base. It should appear on buttons, icons, score numbers, and dividers — never as a large background fill. If a screen feels "too gold," pull it back to a single CTA and one accent line.

---

## 2. Typography

| Role | Typeface | Source | Weight(s) | Usage |
|---|---|---|---|---|
| Display | **Fraunces** | Google Fonts | 600 (Semibold), 500 for subheads | Page titles, hero headline, destination names, section headers |
| Body | **Inter** | Google Fonts | 400 (body), 500 (labels/buttons) | Paragraphs, form fields, nav links, general UI text |
| Utility / Data | **IBM Plex Mono** | Google Fonts | 400, 500 | Budget numbers, scores (e.g. "92/100"), coordinates, dates, trip codes |

**Why this pairing:** Fraunces is a warm, slightly editorial serif with real personality — it reads like a travel magazine masthead, not a generic sans headline. Inter stays quiet and functional for body text so the serif gets to carry the personality. IBM Plex Mono gives budget figures and match-scores a "ledger / instrument panel" feel that fits the cartographer direction and makes numeric data feel intentional rather than an afterthought.

### Type Scale (desktop)

| Token | Size / Line-height | Font | Example use |
|---|---|---|---|
| `display-xl` | 56px / 1.05 | Fraunces 600 | Hero headline |
| `display-lg` | 40px / 1.1 | Fraunces 600 | Section titles ("Explore Destinations") |
| `display-md` | 28px / 1.2 | Fraunces 500 | Card titles, destination names |
| `body-lg` | 18px / 1.6 | Inter 400 | Intro paragraphs, hero subtext |
| `body-md` | 16px / 1.6 | Inter 400 | Standard body copy |
| `body-sm` | 14px / 1.5 | Inter 400 | Captions, form helper text |
| `label` | 13px / 1.4, uppercase, letter-spacing 0.04em | Inter 500 | Eyebrows, tags, filter labels |
| `mono-data` | 15px / 1.4 | IBM Plex Mono 500 | Scores, prices, dates |

Mobile: scale `display-xl` down to 36px, `display-lg` to 28px; keep body sizes the same for readability.

---

## 3. Layout & Spacing

- **Base unit:** 4px grid (spacing tokens: 4, 8, 12, 16, 24, 32, 48, 64, 96px).
- **Container max-width:** 1200px, with 24px side padding on mobile, 64px on desktop.
- **Border radius:** 8px for cards and inputs, 4px for small tags/badges, 999px (full pill) for buttons and score chips. Keep it consistent — no mixing sharp and heavily rounded corners in the same view.
- **Cards:** 1px Stone border + very subtle shadow (`0 1px 3px rgba(20,33,61,0.06)`), never heavy drop shadows — this keeps the editorial, printed-page feel rather than a "floating app" feel.
- **Section rhythm:** alternate Paper White sections with occasional full-bleed Ink Navy sections (e.g. hero, footer, a mid-page "AI Itinerary" showcase band) to break up the page and give the gold accents somewhere dark to pop.

---

## 4. Signature Element: "Stamped" Destination Cards

The one memorable, recurring motif: every destination card and trip-summary card gets a small **corner stamp** — a circular badge in the top-right corner styled like a passport/postmark stamp, containing the destination's match score or category icon, rendered in Brass Gold on a thin dashed circular border. Route/itinerary views connect stops with a **dashed line** (like a flight path on a map) rather than a solid line or arrow.

This one motif (stamp badge + dashed connector) should be the *only* decorative flourish repeated across the app — everything else stays clean and restrained so the stamp motif keeps its meaning instead of becoming visual noise.

---

## 5. Component Notes

- **Primary button:** Ink Navy background, Paper White text, pill radius, on hover shifts to Deep Ink with a subtle Brass Gold underline animation.
- **Secondary button:** Transparent background, 1px Ink Navy border, Ink Navy text; on dark sections, swap to Brass Gold border + text.
- **Score badges** (destination match %, ratings): circular, Brass Gold border, Ink Navy background, mono font number in Brass Gold — echoes the "stamp" motif.
- **Tags** (Nature, Adventure, Budget-Friendly, etc.): small pill, Stone border, Slate text, colored dot prefix matching category (Pine/Rust/Harbor Blue).
- **Forms/inputs:** Card White background, Stone border, Ink Navy text, focus state = 2px Brass Gold outline (also satisfies accessible focus visibility).
- **Navigation bar:** Ink Navy background, Paper White text/logo, Brass Gold underline on active link.

---

## 6. Motion Guidelines

Keep motion minimal and purposeful — this is an editorial, trustworthy product, not a flashy landing page.

- Page load: a single subtle fade + 8px upward slide on hero content only (300ms, ease-out). No staggered cascades on every element.
- Score badges: on itinerary generation, animate the score number counting up (400ms) — reinforces the "your recommendation engine did real work" feeling.
- Hover states: 150ms ease transitions on color/border changes only — no scale/bounce effects.
- Respect `prefers-reduced-motion`: disable count-up and slide animations, keep instant state changes.

---

## 7. Tailwind Config Snippet

```js
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        navy: { DEFAULT: "#14213D", dark: "#0B152A" },
        gold: { DEFAULT: "#B8863B", light: "#D9B876" },
        paper: "#FBF9F4",
        card: "#FFFFFF",
        stone: "#E4DFD3",
        slate: "#5C6478",
        pine: "#2F5D50",
        rust: "#B4552F",
        harbor: "#3C6E91",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      borderRadius: {
        card: "8px",
        tag: "4px",
        pill: "999px",
      },
    },
  },
};
```

Add fonts in `layout.tsx` via `next/font/google`:

```ts
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-display" });
const inter = Inter({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-body" });
const plexMono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono" });
```

---

## 8. Quick Reference Summary (for report / PPT)

- **Theme name:** Modern Cartographer
- **Primary color:** Ink Navy `#14213D`
- **Secondary/accent color:** Brass Gold `#B8863B`
- **Background:** Paper White `#FBF9F4`
- **Fonts:** Fraunces (display) + Inter (body) + IBM Plex Mono (data)
- **Signature element:** Stamped destination cards with dashed route connectors
