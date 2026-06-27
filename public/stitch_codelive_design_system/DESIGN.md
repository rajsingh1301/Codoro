---
name: Developer-First Modernism
colors:
  surface: '#0f172a'
  surface-dim: '#13121b'
  surface-bright: '#393842'
  surface-container-lowest: '#0e0d16'
  surface-container-low: '#1b1b24'
  surface-container: '#1f1f28'
  surface-container-high: '#2a2933'
  surface-container-highest: '#35343e'
  on-surface: '#e4e1ee'
  on-surface-variant: '#c7c4d8'
  inverse-surface: '#e4e1ee'
  inverse-on-surface: '#302f39'
  outline: '#918fa1'
  outline-variant: '#464555'
  surface-tint: '#c3c0ff'
  primary: '#c3c0ff'
  on-primary: '#1d00a5'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#4d44e3'
  secondary: '#c0c6de'
  on-secondary: '#2a3043'
  secondary-container: '#43485d'
  on-secondary-container: '#b2b7d0'
  tertiary: '#ffb695'
  on-tertiary: '#571f00'
  tertiary-container: '#a44100'
  on-tertiary-container: '#ffd2be'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#dce1fb'
  secondary-fixed-dim: '#c0c6de'
  on-secondary-fixed: '#151b2d'
  on-secondary-fixed-variant: '#40465a'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb695'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7b2f00'
  background: '#13121b'
  on-background: '#e4e1ee'
  surface-variant: '#35343e'
  surface-elevated: '#1e293b'
  success: '#10b981'
  danger: '#e11d48'
  warning: '#f59e0b'
  text-primary: '#f8fafc'
  text-secondary: '#cbd5e1'
  text-muted: '#64748b'
  border-subtle: rgba(255, 255, 255, 0.05)
typography:
  headline-lg:
    fontFamily: Geist
    fontSize: 30px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.025em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '800'
    lineHeight: 32px
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
  headline-sm:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  caption:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  tiny:
    fontFamily: Geist
    fontSize: 10px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  max-width: 1280px
  margin-desktop: 32px
  margin-tablet: 24px
  margin-mobile: 16px
  unit: 8px
  space-1: 4px
  space-2: 8px
  space-3: 12px
  space-4: 16px
  space-6: 24px
  space-8: 32px
  space-10: 40px
  space-12: 48px
  space-16: 64px
---

# CodeLive Design System

## Design Philosophy
CodeLive is a developer-first streaming platform. The interface should feel:
* Premium
* Minimal
* Modern
* Technical
* Professional

Inspired by:
* Linear
* Vercel
* GitHub
* Stripe
* Raycast
* Arc Browser

Avoid generic Tailwind template aesthetics. The design should prioritize clarity over decoration.

---

## Core Principles
1. **Less is more**: Keep visual noise to a minimum.
2. **Purposeful elements**: Every border, background, and icon must have a structural purpose.
3. **Consistent spacing**: Layout integrity relies on spacing grids rather than flashy shadows or neon accents.
4. **Typography & Whitespace**: Lean heavily on balanced font sizes, weights, and alignment to establish contrast and visual weight.

---

## Layout
* **Maximum Content Width**: `1280px` (`max-w-[1280px]`)
* **Centered Layout**: Always center content grids using consistent horizontal container padding.
  - Desktop: `px-8`
  - Tablet: `px-6`
  - Mobile: `px-4`
* **Boundary Rules**: Never allow core layouts to stretch edge-to-edge.

---

## Spacing System
Use a strict 8-point spacing grid. Allowed values:
* `4px` (`space-1` or `p-1`)
* `8px` (`space-2` or `p-2`)
* `12px` (`space-3` or `p-3`)
* `16px` (`space-4` or `p-4`)
* `24px` (`space-6` or `p-6`)
* `32px` (`space-8` or `p-8`)
* `40px` (`space-10` or `p-10`)
* `48px` (`space-12` or `p-12`)
* `64px` (`space-16` or `p-16`)
* `80px` (`space-20` or `p-20`)
* `96px` (`space-24` or `p-24`)

---

## Border Radius
* **Buttons**: `12px` (`rounded-xl`)
* **Cards**: `16px` (`rounded-2xl`)
* **Inputs**: `12px` (`rounded-xl`)
* **Dialogs**: `20px` (`rounded-[20px]`)

Avoid mixing or nesting mismatched border radii.

---

## Shadows
* **Soft Shadows**: Utilize only flat, highly dispersed elevations (e.g. `shadow-sm`, `shadow-md` with custom dark-opacity colors).
* **Minimal Depth**: No heavy drop shadows. Cards should elevate naturally from surface lines.

---

## Borders
* **Subtle Boundaries**: Separate core areas using clean border strokes (`border-white/5` or `border-slate-800`).
* Avoid floating components without explicit bounds.

---

## Color Palette
* **Primary Background**: Neutral Dark (`bg-slate-950`)
* **Surface Background**: Elevated Neutral (`bg-slate-900/50` or `bg-slate-900`)
* **Primary Accent**: Clean Blue/Indigo (`text-indigo-400` / `bg-indigo-650`)
* **Success**: Green (`text-emerald-400` / `bg-emerald-500/10`)
* **Danger**: Red (`text-rose-400` / `bg-rose-600`)
* **Warning**: Amber (`text-amber-400` / `bg-amber-500/10`)
* **Muted Text**: Gray (`text-slate-400` or `text-slate-500`)

Do not introduce secondary accent hues.

---

## Typography
* **Font Family**: Geist / Geist Mono.
* **Heading Sizes**: Keep title weights heavy but sizes balanced:
  - `H1` (Large Page): `text-3xl font-extrabold tracking-tight`
  - `H2` (Section Headers): `text-xl font-bold`
  - `H3` (Card Titles): `text-base font-semibold`
  - `Body`: `text-sm text-slate-300`
  - `Caption / Metadata`: `text-xs text-slate-400` or `text-[10px] text-slate-500`

---

## Buttons
Variants:
* **Primary**: `bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-bold`
* **Secondary**: `bg-slate-900 hover:bg-slate-800 border border-white/10 hover:border-white/20 text-slate-200`
* **Ghost**: `hover:bg-slate-900 text-slate-400 hover:text-white`
* **Danger**: `bg-rose-600 hover:bg-rose-700 text-white`
* Ensure consistent heights, paddings, transition animations, and focus ring accessibility states.

---

## Inputs
All form elements must feature:
* Clear top label
* Standardized focus states (`focus:border-indigo-500/40`)
* Helper text or validation error fields below the input block
* Consistent sizing and border curves

---

## Cards
Every card component requires:
* Strict padding (`p-6` or `p-5`)
* Hover lift animations
* Structured metadata grouping at the footer, separated by a dividing line

---

## Icons
* **Library**: Use a single consistent icon library. Do not mix multiple icon packs.
* Maintain matching scaling indicators across grid rows.

---

## Hero Section
* **Structure**: Clean headline, single paragraph description, two actions (Primary / Secondary CTA), and simple ambient background gradients.
* Avoid heavy particle scripts, floating graphics, or excessive animations.

---

## Navigation
* Simple layout with active routes explicitly highlighted (e.g. `text-indigo-400` and bold state).

---

## Stream Cards
Must present:
* Title-gradient thumbnail
* Creator Avatar
* Title
* Community Tag
* Blinking LIVE badge / viewer count indicator
* Linear hover lift transition

---

## Community Cards
Must present:
* Community Title
* Description
* Stream metrics (total streams / live streams)
* Hover border-color transition

---

## Dashboard
* Keep dashboard pages minimal, metrics balanced, and OBS settings checklists clean and easy to follow.

---

## Animations
* **Transitions**: Smooth animations for hover, scale, and opacity.
* **Duration**: `150ms` to `250ms` using standard easing (`transition-all duration-200`).
* Do not apply bouncy or elastic transition properties.

---

## Loading & Empty States
* **Skeletons**: Use matching page skeleton grids (`StreamCardSkeleton`) to prevent layout shifts.
* **Empty States**: Present a simple descriptive placeholder emoji, title, instructions, and CTA action link.

---

## Responsive Design
Ensure full desktop-first, tablet, and mobile views are responsive and use correct relative flex layouts.

---

## Accessibility
* Focus-rings for tabs/buttons.
* High color contrast ratios.
* Screen-reader readable labels.
* Standard semantic elements (`header`, `main`, `section`, `nav`).
