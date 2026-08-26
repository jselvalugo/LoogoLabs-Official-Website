# Loogo Labs — Brand Guide

---

## Logo

The wordmark is **"Loogo Labs"** in Instrument Sans Bold, followed by a cyan period. The period is the only colored element — it acts as the brand's signal: precise, technical, alive.

### Files in this folder

| File | Use |
|---|---|
| `loogo-labs-logo.png` | Primary — dark text, transparent background. Use on white/light surfaces. |
| `loogo-labs-logo-white.png` | Reversed — light text, transparent background. Use on dark surfaces. |
| `loogo-labs-logo-dark-bg.png` | Preview of reversed version on dark background. |

### Construction rules

- The dot **"."** is always `#00E5FF` (Cyan 500). Never change its color.
- Minimum clear space: equal to the height of the capital "L" on all sides.
- Minimum size: 120px wide for digital, 30mm for print.
- Never stretch, rotate, recolor, or add effects to the wordmark.
- Never use the wordmark on a busy photo without a solid backing.

---

## Colors

### Primary palette

| Name | Hex | Role |
|---|---|---|
| Ink 900 | `#0B0F12` | Primary text, borders, button fills |
| Ink 800 | `#12181F` | Inverse card surface |
| Ink 700 | `#1B232C` | Hover state on inverse |
| Ink 600 | `#2A343F` | Secondary text on dark |
| Ink 500 | `#3D4A57` | Muted elements |
| Ink 400 | `#5C6A76` | Secondary text, labels |
| Ink 300 | `#8695A1` | Placeholder, disabled |
| Ink 200 | `#B4C0C8` | Subtle borders |
| Ink 100 | `#D9E1E5` | Light dividers |

### Surface palette

| Name | Hex | Role |
|---|---|---|
| Paper 000 | `#FFFFFF` | Card surface |
| Paper 100 | `#F5F7F8` | Page background |
| Paper 200 | `#E7ECEE` | Sunken / hover surface |

### Accent — Electric Cyan

One accent. Used sparingly and loudly.

| Name | Hex | Role |
|---|---|---|
| Cyan 500 | `#00E5FF` | Primary buttons, logo dot, focus rings, highlights |
| Cyan 600 | `#00B8CC` | Cyan hover |
| Cyan 700 | `#007D8C` | Cyan on light (links, tinted text) |
| Cyan 100 | `#CFF9FF` | Cyan tint (button hover wash) |

### Status colors

| Name | Hex | Use |
|---|---|---|
| OK / Green | `#2FD07E` | Success states |
| Warning | `#FFB000` | Caution, degraded |
| Danger | `#FF4A3D` | Error, destructive |

---

## Typography

### Typefaces

| Role | Family | Fallback |
|---|---|---|
| Display & Body | **Instrument Sans** | "Helvetica Neue", Arial, sans-serif |
| Mono / Code / Labels | **IBM Plex Mono** | ui-monospace, SFMono-Regular, Menlo, monospace |

Instrument Sans handles all display, heading, and body copy. IBM Plex Mono is reserved for labels, eyebrows, data readouts, code, and UI utility text (tabs, badges).

### Type scale

| Token | Size | Line height | Tracking | Use |
|---|---|---|---|---|
| Display 1 | 88px | 0.92 | −0.04em | Hero, max impact |
| Display 2 | 64px | 0.94 | −0.035em | Section hero |
| Display 3 | 48px | 1.00 | −0.03em | Large feature header |
| H1 | 36px | 1.08 | −0.025em | Page titles |
| H2 | 28px | 1.15 | −0.02em | Section titles |
| H3 | 22px | 1.25 | −0.015em | Card headers |
| Body LG | 18px | 1.55 | — | Lead paragraphs |
| Body | 16px | 1.60 | — | Default prose |
| Body SM | 14px | 1.50 | — | Supporting copy |
| Label (mono) | 12px | 1.20 | +0.12em | Eyebrows, tabs, badges — uppercase |
| Micro (mono) | 11px | 1.20 | +0.10em | Timestamps, fine print |
| Data (mono) | 14px | 1.40 | 0 | Numbers, IDs, code |

### Weight usage

| Weight | Value | When to use |
|---|---|---|
| Regular | 400 | Body copy |
| Medium | 500 | UI labels, subtle emphasis |
| Semibold | 600 | Buttons, strong labels |
| Bold | 700 | Display, headings, wordmark |

---

## Buttons

### Variants

**Primary** — Cyan 500 fill, Ink 900 border + text, 2px hard shadow offset.
Use for the single most important action on a screen.

**Secondary** — White fill, Ink 900 border + text, 2px hard shadow offset.
Use for alternative actions alongside a primary.

**Ghost** — Transparent fill, 1px hairline border.
Use for tertiary, destructive, or low-emphasis actions.

**Inverse** — Ink 900 fill, Paper text, cyan shadow.
Use on dark/inverse surfaces.

### Sizing

| Size | Padding | Font size |
|---|---|---|
| SM | 7px 12px | 13px |
| MD | 10px 16px | 14px |
| LG | 14px 22px | 16px |

### Press interaction

All bordered buttons shift `translate(2px, 2px)` on press and drop their shadow, creating a mechanical "click" feel. Transitions are short: 90ms ease-standard.

---

## Shadows & Surfaces

### Hard shadow — the signature

```
--shadow-hard:    4px 4px 0 #0B0F12
--shadow-hard-sm: 2px 2px 0 #0B0F12
--shadow-hard-accent: 4px 4px 0 #00E5FF
```

The offset shadow is the single most distinctive visual element. It reads as retro-computing precision — not soft SaaS. Use it on primary buttons, cards, and feature callouts. Never use it on every element; reserve it for focal points.

### Soft elevation

```
--shadow-soft-1: 0 1px 2px rgba(11,15,18, 0.08)
--shadow-soft-2: 0 8px 24px rgba(11,15,18, 0.12)
```

Use only for overlays, menus, and modals.

---

## Border Radius

Near-square. Retro-computing precision, not soft SaaS.

| Token | Value | Use |
|---|---|---|
| radius-0 | 0px | Flush dividers |
| radius-1 | 2px | Badges, tags |
| radius-2 | 4px | Buttons, inputs, cards (default) |
| radius-3 | 8px | Modals, large cards |
| radius-pill | 999px | Pills, avatars |

---

## Grid & Texture

Pages use a subtle **32×32px grid line** texture as a background to reinforce the precision / data aesthetic:

- Light surfaces: `rgba(11, 15, 18, 0.07)` lines
- Dark/inverse surfaces: `rgba(245, 247, 248, 0.08)` lines

The grid is never the hero — it should be barely perceptible, adding depth without distraction.

---

## Spacing

8-point base with a 2px root.

| Token | Value |
|---|---|
| space-1 | 2px |
| space-2 | 4px |
| space-3 | 8px |
| space-4 | 12px |
| space-5 | 16px |
| space-6 | 24px |
| space-7 | 32px |
| space-8 | 48px |
| space-9 | 64px |
| space-10 | 96px |
| space-11 | 128px |

Max content width: **1240px**. Narrow content (prose, forms): **760px**.

---

## Motion

Short, mechanical, no bounce.

| Token | Duration | Easing |
|---|---|---|
| dur-fast | 90ms | cubic-bezier(0.2, 0, 0, 1) |
| dur-base | 160ms | cubic-bezier(0.2, 0, 0, 1) |
| dur-slow | 280ms | cubic-bezier(0.2, 0, 0, 1) |

Exit: `cubic-bezier(0.4, 0, 1, 1)`. Never use spring or bounce easing.

---

## Voice & Tone

- **Direct.** Say what we do, then why it matters. No filler sentences.
- **Problem-first.** Lead with the pain, not the feature.
- **Technical but human.** We respect the reader's intelligence without hiding behind jargon.
- **Confident, not loud.** We don't need exclamation marks to land a point.
- **Never name the apps** (CartCaddie, Distillr, PropIQ) in customer-facing copy. Speak to the underlying problem space.

---

## What not to do

- Don't use more than one accent color at a time. Cyan is the only one.
- Don't use gradients on surfaces. Gradients are reserved for very specific hero treatments.
- Don't use rounded corners larger than 8px.
- Don't animate with bounce or spring easings.
- Don't use the logo smaller than 120px wide.
- Don't place the wordmark on a busy background without a backdrop.
- Don't use the "Labs" portion without "Loogo" — the name is always the full two words.
