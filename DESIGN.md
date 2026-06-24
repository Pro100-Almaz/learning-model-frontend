---
name: Qadam
description: "Ascent — turn ЕНТ anxiety into a visible climb toward a grant. Quiet UI with one signature: the Trajectory."
colors:
  ink: "#161427"
  brand: "#6D4AFF"
  brand-press: "#5A3AE0"
  ascent: "#FF8A3D"
  success: "#12B886"
  danger: "#F03E5E"
  surface: "#F6F6FB"
  card: "#FFFFFF"
  muted: "#6E6B85"
  hairline: "#E8E7F0"
typography:
  display:
    fontFamily: "Unbounded, system-ui, -apple-system, sans-serif"
    fontSize: "40px"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.02em"
    fontFeature: "tnum"
  headline:
    fontFamily: "Onest, Inter, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Onest, Inter, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Onest, Inter, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Onest, Inter, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 500
    lineHeight: 1.4
  caption:
    fontFamily: "Onest, Inter, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.4
rounded:
  button: "12px"
  card: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  "2xl": "32px"
components:
  button-primary:
    backgroundColor: "{colors.brand}"
    textColor: "{colors.card}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
    typography: "{typography.label}"
  button-primary-hover:
    backgroundColor: "{colors.brand-press}"
    textColor: "{colors.card}"
    rounded: "{rounded.button}"
  button-ghost:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "12px 20px"
  card-surface:
    backgroundColor: "{colors.card}"
    rounded: "{rounded.card}"
    padding: "20px"
  chip-tag:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.muted}"
    rounded: "{rounded.pill}"
    padding: "4px 12px"
    typography: "{typography.caption}"
  input-field:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.button}"
    padding: "12px 16px"
    typography: "{typography.body}"
---

# Design System: Qadam

## 1. Overview

**Creative North Star: "The Ascent"**

Qadam's identity is a climb. Not a celebration, not a tutorial — a visible, honest climb toward a single high-stakes target (the ЕНТ score that unlocks a state grant). The product must *show* that climb. Everything around the climb gets out of its way.

The surface is quiet by design: lavender-tinted cool neutrals, generous whitespace, one soft shadow, and a single signature accent — **`#6D4AFF` Ascent Violet** — used as a true Committed brand color on actions and progress, not as decoration. Type is restrained Onest for the body, with **Unbounded** reserved for scores and screen titles where the brand needs to flex. The whole system is mobile-first; touch targets, sticky bottom CTAs, and safe-area insets are first-class, not retrofits.

What this system explicitly rejects: Duolingo-style gamification (no cartoon mascots, no confetti, no candy palette), government / LMS portal heaviness (no stock-photo banners, no dated buttons, no dense bureaucratic forms), and edtech-cute illustration sets (no pastel character art carrying the brand).

**Key Characteristics:**
- Mobile-first (designed at 360–414px; desktop is a courtesy).
- Quiet UI, loud moments — color and motion spend only on dopamine beats (XP, streak, correct answer, Trajectory fill).
- One signature: the Trajectory — predicted score climbing toward target. Everything else stays plain.
- Cyrillic-first: every face ships full Cyrillic; no Latin-only display fonts.
- Honest progress. Show the real gap; never fake forward motion.

## 2. Colors

A cool lavender-grey canvas anchors a single committed brand violet, with a warm orange reserved exclusively for motivational momentum (XP, streak) and unambiguous success / danger semantics.

### Primary
- **Ascent Violet** (`#6D4AFF`): The committed brand color. Primary buttons, active navigation, progress fills, links, focus rings, the Trajectory's predicted-score track. Used decisively, not sprinkled.
- **Ascent Violet Press** (`#5A3AE0`): Pressed / active state on primary buttons and links. Only appears under finger / cursor.

### Secondary
- **Momentum Orange** (`#FF8A3D`): The XP and streak color. Reserved exclusively for gamification dopamine beats — XP gain, streak flame, level-up moments. Never used as a UI accent, never as a primary action. Its rarity is the point.

### Tertiary (semantic states)
- **Success Green** (`#12B886`): Correct answer in tests; "qualifies for grant" margin badge.
- **Danger Red** (`#F03E5E`): Wrong answer; gap-to-goal callout; destructive confirmations.

### Neutral
- **Deep Ink** (`#161427`): Primary text. Near-black with a slight violet undertone so it sits inside the brand family. Body, headings, icon strokes.
- **Muted** (`#6E6B85`): Secondary text — metadata, captions, helper text. Sits in the violet family rather than going generic gray.
- **Surface** (`#F6F6FB`): App background. Cool, very-light lavender — the canvas under all cards.
- **Card** (`#FFFFFF`): Content surface. Cards, sheets, dialogs.
- **Hairline** (`#E8E7F0`): Borders and dividers. Internal structure only; never used as decoration.

### Named Rules

**The One Voice Rule.** Ascent Violet (`#6D4AFF`) is the *only* color that may carry a primary action or carry the Trajectory's predicted-score track. Do not use it as a background tint, a decorative gradient, or a "brand splash." Its impact comes from rarity and consistency.

**The Momentum Quarantine.** Momentum Orange (`#FF8A3D`) is quarantined to gamification: XP toasts, the streak flame, level-up moments. It must never carry a button, a link, an icon outside the gamification system, or a page background. The moment it leaks, the dopamine signal dies.

**The Color-Never-Alone Rule.** Correct / wrong, qualifies / doesn't qualify, error / success: color *always* pairs with an icon and a text label. A red border, a green checkmark, a violet underline — none of these stand on their own.

## 3. Typography

**Display Font:** Unbounded (with `system-ui`, `-apple-system` fallback).
**Body Font:** Onest (with `Inter`, `system-ui` fallback).

**Character:** A geometric, distinctive display face (Unbounded) used *with restraint* on scores and screen titles, paired with a humanist sans (Onest) tuned for sustained Russian and Kazakh reading. Both ship full Cyrillic — non-negotiable for this market. The pair contrasts on the geometric ↔ humanist axis, not on serif/sans, which keeps Unbounded's character punchy without making the UI feel mismatched.

### Hierarchy
- **Display** (700, 40px, line-height 1.1, letter-spacing -0.02em, tabular-nums): Predicted score on the dashboard, score header on results, Trajectory primary readout. Sparingly. *Unbounded.*
- **Headline** (700, 28px, 1.2): Screen titles, section heroes. *Onest.*
- **Title** (600, 20px, 1.3): Card titles, dialog headers, module names. *Onest.*
- **Body** (400, 16px, 1.5): Default reading text — lesson descriptions, question stems, prose. Line length capped at 65–75ch. *Onest.*
- **Label** (500, 14px, 1.4): Button text, form labels, list-row primary text. *Onest.*
- **Caption** (500, 12px, 1.4): Metadata, timestamps, helper text under inputs, chip text. *Onest.*

### Named Rules

**The Tabular-Nums Rule.** Every score, XP value, percent, countdown, and Trajectory readout uses `font-variant-numeric: tabular-nums`. Digits must not jitter as they animate; the dashboard predicted score moving from 134 → 137 must change *value*, not *width*.

**The Unbounded Quarantine.** Unbounded appears in three places only: the predicted score on the dashboard, the score header on `/results`, and the Trajectory's primary readout. Everywhere else is Onest. If you're reaching for Unbounded on a section heading or a button, you're wrong — pull back to Onest.

**The Cyrillic Hard-Constraint Rule.** Any new face introduced into the system must ship full Cyrillic glyph coverage. Latin-only display fonts are forbidden. The fallback stack (`system-ui, -apple-system, sans-serif`) is the safety net, not the design.

## 4. Elevation

Qadam is flat by default with a single soft shadow for cards. Depth is mostly conveyed through tonal layering — cards (`#FFFFFF`) on the lavender-tinted surface (`#F6F6FB`) — with shadow used only to lift the card a half-step off the page. Modals and toasts lift further with `elevated`; nothing in the system uses heavy shadows, layered shadows, or "shadow soup."

### Shadow Vocabulary
- **Card** (`box-shadow: 0 2px 12px rgb(22 20 39 / 0.06)`): The default card shadow. Tinted with the ink color so it reads as belonging to the violet family, not a neutral gray drop. Applies to dashboard tiles, course cards, sheets, the Trajectory container.
- **Elevated** (`box-shadow: 0 8px 24px rgb(22 20 39 / 0.10)`): Reserved for modals, toasts, the XP gain pop, and any element that needs to read as floating above the page.

### Named Rules

**The Flat-By-Default Rule.** Surfaces are flat at rest. Don't reach for shadow to communicate hierarchy; reach for whitespace, type weight, and color first. Shadow is the last resort, not the first.

**The Single-Shadow Rule.** A card has *one* shadow. Layering two box-shadows on the same element ("ambient + key") is forbidden — it's the saturated 2014 SaaS look, and it doesn't read as "premium," it reads as "designed before flat design was settled."

## 5. Components

### Buttons
- **Shape:** Gentle rounding (`12px` radius). Pills (`9999px`) only on chips and small affordances, never on primary CTAs.
- **Primary:** Ascent Violet (`#6D4AFF`) background, white (`#FFFFFF`) text, 12px × 20px padding, Label typography. The single most important affordance in the system; never decorated, never gradient, never iconized "just to look interactive."
- **Hover / Press:** Background shifts to `#5A3AE0` (Ascent Violet Press); no shadow change, no scale.
- **Ghost / Secondary:** White card background, ink text, 1px hairline border. Used for secondary actions in the same flow as a primary; never used for the *one* primary CTA on a screen.
- **Disabled:** 50% opacity on the entire button. No grey-out — opacity preserves brand color while signaling unavailability.
- **Touch target:** ≥44px tall on mobile, always. Sticky bottom CTAs on lesson and test screens sit within thumb reach and honor `env(safe-area-inset-bottom)`.

### Cards
- **Corner Style:** `16px` radius (`{rounded.card}`).
- **Background:** White (`#FFFFFF`) on the lavender surface.
- **Shadow Strategy:** Card shadow (see Elevation) by default. No hover lift; this is a serious learning surface, not a click-bait carousel.
- **Border:** None by default. A `1px solid #E8E7F0` (Hairline) only when the card sits on white (e.g. inside a modal) and needs an edge to separate it from the surrounding surface.
- **Internal Padding:** `20px` standard; `16px` on dense mobile cards.

### Inputs / Fields
- **Style:** White card background, `12px` radius, `1px solid #E8E7F0` hairline border, `12px × 16px` padding, Body typography.
- **Focus:** 2px solid Ascent Violet outline with 2px offset. Never relies on color alone — the outline shift is structural.
- **Error:** 2px Danger Red outline + an icon + a Caption-sized error message below the field. Three signals, never one.
- **Disabled:** Background drops to Surface (`#F6F6FB`); cursor: not-allowed.

### Chips / Tags
- **Style:** Pill (`9999px`), Surface (`#F6F6FB`) background, Muted (`#6E6B85`) text, Caption typography, `4px × 12px` padding. No border by default.
- **Active / selected:** Background fills with Ascent Violet, text flips to white. Used in onboarding's subject selectors, analytics tag filters, recommendation rows.

### Navigation
- **Mobile (`<BottomNav>`):** Fixed bottom bar, four tabs (Главная · Темы · Тесты · Профиль), each ≥44px target. Active tab shows Ascent Violet icon + label; inactive tabs use Muted. Safe-area inset honored.
- **Desktop (`<Sidebar>`, `md:`+):** Left rail. Active item: Ascent Violet text + a 2px left accent bar in the same color. Inactive: Muted text, no decoration.
- **No hover-only affordances anywhere.** Every interaction works on touch.

### The Trajectory (signature component)
The product's single distinctive component. A track showing the student's **predicted ЕНТ score climbing toward their target line**, with the gap explicitly called out.

- **Track:** Ascent Violet fill on a Hairline (`#E8E7F0`) base track. The fill height is the predicted value; the target line sits as a 2px Ink (`#161427`) marker above (or below) the fill.
- **Readouts:** Predicted score in Display type (Unbounded, tabular-nums). Target score in Title type. Gap in Caption with a directional indicator.
- **Variants:**
  - **Compact** — on the dashboard, ~120px tall, horizontal orientation, predicted + target + delta visible.
  - **Full** — on `/grant`, dominant element of the screen, ~280px tall, vertical orientation, with math `{x} + другие {y} = прогноз {N}` annotation and the qualifying universities list rendered below.
- **Motion:** The fill animates from 0 → predicted on first paint (≤600ms, exponential ease-out). Subsequent updates animate from previous → new value. Both respect `prefers-reduced-motion: reduce` — the value snaps without animation.
- **Empty state:** Before any mock test exists, the Trajectory is replaced by a CTA card prompting the student to take the first mock. The component never renders empty.

## 6. Do's and Don'ts

### Do:
- **Do** spend the Ascent Violet on what matters: the primary button on the screen, the Trajectory fill, the active nav state, the focus ring. Nothing else.
- **Do** use tabular-nums on every numeric readout — scores, XP, percentages, countdowns, Trajectory values.
- **Do** ship every data view with three states: `LoadingSkeleton`, `EmptyState` (with a CTA), `ErrorState` (with retry). No bare spinners-forever, no blank screens.
- **Do** pair color with icon + text on every semantic state (correct, wrong, qualifies, doesn't qualify, error).
- **Do** design at 360–414px first. Touch targets ≥44px. Sticky bottom CTAs honor `env(safe-area-inset-bottom)`.
- **Do** quarantine Momentum Orange (`#FF8A3D`) to XP and streak. Anywhere else, the dopamine signal dies.
- **Do** keep Unbounded for predicted-score, results header, and Trajectory readout. Use Onest everywhere else.
- **Do** honor `prefers-reduced-motion: reduce` globally — Trajectory fill, XP toast, streak pulse, level-up, certificate reveal all collapse to instant or crossfade.
- **Do** write copy in active voice, sentence case, Russian. Buttons name the action and keep the name through the flow ("Рассчитать" stays "Рассчитать"). Empty states invite action; errors give direction.

### Don't:
- **Don't** make this look like Duolingo. No cartoon mascots, no confetti, no candy-colored UI, no points-as-personality. XP and streak stay quiet.
- **Don't** make this look like a government or LMS portal (BilimLand, e-gov, Moodle). No stock-photo banners, no dated buttons, no dense bureaucratic forms.
- **Don't** introduce edtech-cute illustrations. No pastel students, books, rockets, or mascots carrying the brand. Identity comes from type, motion, and the Trajectory — not character art.
- **Don't** use `border-left` greater than 1px as a colored side-stripe accent on cards, callouts, or list items. It's the saturated AI-default move; rewrite with full borders, background tints, or leading icons.
- **Don't** use gradient text (`background-clip: text` + gradient). Solid color only. Emphasis via weight or size.
- **Don't** decorate with glassmorphism (backdrop-filter blurs as a default). Rare and purposeful, or nothing.
- **Don't** stack two box-shadows on one element ("ambient + key"). One shadow per surface; everything else is shadow soup.
- **Don't** use Ascent Violet as a background tint, gradient, or decorative wash. It carries actions and progress; outside that, it's white space.
- **Don't** reuse `brand` for semantic state. Correct uses `success`, wrong uses `danger`. Never overload the brand color into a state signal.
- **Don't** introduce a new font without full Cyrillic coverage. Latin-only display fonts are forbidden in this product.
- **Don't** rely on hover-only affordances. Every interaction must work on touch.
