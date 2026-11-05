# Ramp — Style Reference
> Editorial finance desk, black-and-white pages with a single neon highlighter. A near-monochrome publication surface where one vivid chartreuse mark turns every interaction into a money signal.

**Theme:** light

Source measurements are normalized; roles and recommendations are interpreted. Font summary lists are independent, not paired by position. HTML examples are reconstructions, not source components.

Ramp operates as a black-and-white editorial system punctuated by a single highlighter-yellow accent — the visual equivalent of a finance journal with a neon Sharpie. The interface stays nearly monochrome: warm off-white canvas, white cards, hairline gray borders, and deep near-black text. That one vivid chartreuse (#e4f222) appears only where money moves — CTAs, live counters, active states — making every action feel switched-on. Typography is a single-weight, neo-grotesque custom face (lausanne) at 400, used at large display sizes with tight leading (lineHeight ~1.0 at 64px) and positive tracking on small uppercase labels. Components are flat, hairline-bordered, and shadow-free: cards rest on borders, not shadows, with 12–16px radii; buttons are 6px-radius rectangles. Density is comfortable, rhythm is 8/12/16/24px, and motion is moderate and utility-focused rather than decorative.

## Tokens — Colors

| Name | Value | Token | Role |
|------|-------|-------|------|
| Highlighter Yellow | `#e4f222` | `--color-highlighter-yellow` | Primary action fill, live counters, active-state highlights — the only chromatic accent in the system, making CTAs read as switched-on |
| Ink | `#0c0a08` | `--color-ink` | Primary text, heading fill, dark surface backgrounds — near-black with the faintest warm cast |
| Obsidian | `#1a1919` | `--color-obsidian` | Dark panels, navigation bar, inverted sections — slightly warmer and lighter than Ink for tonal variation |
| Paper | `#ffffff` | `--color-paper` | Card surfaces, modal panels, light fills, reversed text on dark backgrounds |
| Bone | `#f4f2f0` | `--color-bone` | Page canvas, subtle card washes, link background hover states — warm off-white base layer |
| Ash | `#6d6c6b` | `--color-ash` | Secondary text, hushed captions, muted labels — the 60% opacity voice of --text-primary |
| Hairline | `#e5e7eb` | `--color-hairline` | Card borders, divider lines, structural outlines — 1px hairlines replace shadows as the elevation primitive |
| Smoke | `#d3d3d3` | `--color-smoke` | Subtle borders, muted backgrounds, skeleton states — the 200-step in the black scale |

## Tokens — Typography

### lausanne — Sole typeface across the entire system — headings, body, UI labels, nav, buttons, inputs. A single weight (400) forces hierarchy through size and tracking rather than weight contrast. · `--font-lausanne`
- **Substitute:** Inter, IBM Plex Sans, or Söhne
- **Weights:** 400
- **Sizes:** 10px, 13px, 14px, 16px, 18px, 20px, 24px, 28px, 40px, 48px, 64px
- **Line height:** 0.74–2.20 (tight at display, generous at caption)
- **Letter spacing:** 0.018em at 10px (uppercase micro-labels), 0.05em at small uppercase, 0 (normal) at body and display sizes
- **OpenType features:** `"ss01" on`
- **Role:** Sole typeface across the entire system — headings, body, UI labels, nav, buttons, inputs. A single weight (400) forces hierarchy through size and tracking rather than weight contrast.

### Type Scale

| Role | Family | Weight | Size | Line Height | Letter Spacing | Token |
|------|--------|--------|------|-------------|----------------|-------|
| caption | — | — | 10px | 2.2 | 0.18px | `--text-caption` |
| body | — | — | 16px | 1.5 | — | `--text-body` |
| subheading | — | — | 20px | 1.3 | — | `--text-subheading` |
| heading-sm | — | — | 24px | 1.17 | — | `--text-heading-sm` |
| heading | — | — | 28px | 1.14 | — | `--text-heading` |
| heading-lg | — | — | 40px | 1.05 | — | `--text-heading-lg` |
| display | — | — | 64px | 1 | — | `--text-display` |

## Tokens — Spacing & Shapes

**Base unit:** 4px
**Density:** comfortable

### Border Radius

| Element | Value |
|---------|-------|
| tags | 6px |
| cards | 16px |
| inputs | 10px |
| buttons | 6px |

### Shadows

| Name | Value | Token |
|------|-------|-------|
| subtle | `rgba(255, 255, 255, 0.6) 0px 0px 2px 0px inset` | `--shadow-subtle` |

### Layout

- **Page max-width:** 1200px
- **Section gap:** 64-128px
- **Card padding:** 20-24px
- **Element gap:** 8px
