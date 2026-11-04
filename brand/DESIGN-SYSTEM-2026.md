# Loogo Labs — website design system (November 2026 redesign)

This supersedes the visual sections of `BRAND-GUIDE.md` for the website. The wordmark rules, voice and tone, and "what not to do" still apply.

## The message

One sentence leads every page: **We plan your marketing. Then we build it.**
Audience, in order: SaaS brands and creators first; local service businesses on their own pages (AI receptionist, reviews, Central Florida).

Side pages (quizzes, Park Supply, event promos) stay live at their URLs but are not in the nav, the footer or the homepage.

## Tokens (`src/styles/globals.css`)

| Role | Value |
|---|---|
| Ink (text, buttons, forest surfaces) | `#1B2A12` |
| Secondary text | `#5A6A4E` |
| Muted text, captions | `#78866B` |
| Page | `#F3F0E7` |
| Card / input surface | `#FBF9F3` |
| Sunken surface, tags | `#E9E5D9` |
| Accent (one per screen at most) | Amber `#B8691C` |
| Hairline | `rgba(27, 42, 18, 0.14)` |

- One typeface: Instrument Sans. Display and headings at weight 500; body 400; UI labels 500. Nothing on the site is bolder than 600.
- No mono, no uppercase tracked labels. Section names are small sentence-case lines.
- Radii: 4 / 6 / 10 / 12 px. Pills are for tags only.
- No shadows, glass, bezels, gradients or grid textures. Surfaces are separated by hairlines and whitespace.
- Motion: hover underlines and arrow nudges only. No scroll-reveal.
- Container 1120px; prose 680px; sections ~112px apart.

## Components

- `Button` → `.ll-btn` (`primary`/`inverse` solid forest, `secondary` outlined, `ghost` text). On forest surfaces wrap in `.ll-on-dark` (or use `Card tone="inverse"`) and the roles flip.
- `Card` → `.ll-card` (hairline, bone). `tone="inverse"` is flat forest; `sage`/`sunken` are the sunken cream.
- `SectionHeading` → `.ll-sh` (eyebrow line, title, description).
- Lists of services, principles, steps and links are hairline-ruled rows (`.hm-list`, `.ll-staple-list`, `.hm-local__links`), not card grids.

## The monogram

The forest monogram is the only picture on the homepage (`.hm-mark`, hero right). It is also the nav mark (28px, with the name beside it) and the footer mark in cream. Keep it flat; never put it on a disc, glow or gradient.
