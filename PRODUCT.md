# Product

## Register

product

## Users

Kazakhstani high-school students preparing for the **ЕНТ** (Unified National Test), the single exam that determines university admission and — crucially — whether a student qualifies for a state **grant** (free tuition). They study under real pressure: a fixed test date, limited weeks of runway, and a score-to-grant relationship that most students don't fully understand until it's too late.

They use Qadam mostly on Android phones, often in short evening sessions between school and other obligations. The primary jobs:

1. **See where I stand.** Take a mock test, get an honest predicted ЕНТ score, and see whether I currently qualify for a grant at the universities I want.
2. **Close the gap.** Find out which topics are dragging me down, drill those with micro-tests, and watch the predicted score move.
3. **Stay on it.** Come back tomorrow. The streak and XP exist for this reason and no other.

Russian-language UI in v1; Kazakh slated for v2 via `t()`.

## Product Purpose

Qadam turns ЕНТ prep from anxiety into a visible climb toward a grant. Most prep tools sell content; Qadam's wedge is the **honest feedback loop** — the predicted score, the gap to target, the qualifying universities — and the **shortest path between a weak topic and a 5-minute micro-test that addresses it**.

Success is not "lessons completed." Success is: the predicted score on the dashboard goes up week over week, and on test day the student sits down knowing what grant they're going to win.

## Brand Personality

**Sharp · Modern · Confident.**

Voice: active, sentence case, no filler. Buttons name the action and keep the name through the flow ("Рассчитать" stays "Рассчитать", not "Отправить"). Empty states invite action. Errors give direction, not apology — *"Сначала пройди пробный тест по математике — без него не рассчитать прогноз."*

Treats the student as capable. Tells the truth about the gap rather than softening it; the platform's job is to make the truth actionable, not to flatter. Closer in tone to Linear or Stripe than to Duolingo or a typical edtech app.

## Anti-references

This product must explicitly NOT look or feel like:

- **Duolingo-style gamification** — no cartoon mascots, no confetti, no candy-colored UI, no points-as-personality. XP and streak exist but stay quiet; they are signals, not decoration.
- **Government / LMS portals** (BilimLand, e-gov, Moodle) — no heavy chrome, no stock-photo banners, no dated buttons, no dense bureaucratic forms. Qadam must read as a modern product, not a state service.
- **Edtech-cute illustrations** — no pastel character art of students, books, rockets, or mascots carrying the brand. The product surface stays photo-free and illustration-free; identity comes from typography, motion on the dopamine moments, and the Trajectory itself.

## Design Principles

1. **The Trajectory is the soul.** One signature element — the predicted-score-climbing-toward-target track — carries the product's identity. Everything around it stays disciplined and quiet so it can shine on the dashboard and dominate the grant screen.
2. **Honest progress over flattering progress.** Show the real gap to target, the real weak tags, the real margin to qualify. Never fake forward motion. If the student isn't qualifying yet, say so and point at the next action.
3. **Quiet UI, loud moments.** Restraint is the default — flat surfaces, one soft shadow, sparse color. Motion and color spend is reserved for the moments that actually matter: XP gain, level up, streak active, correct answer, Trajectory fill.
4. **Three states or none.** Every data view renders loading, empty, and error explicitly. No bare spinners-forever, no blank screens. Empty states carry a CTA; errors carry a next step.
5. **Mobile is the product.** Designed at 360–414px first. Touch targets ≥44px, sticky bottom CTAs within thumb reach, safe-area insets honored. The desktop layout is a courtesy, not the canonical surface.

## Accessibility & Inclusion

- Target **WCAG 2.2 AA** for all flows; AAA where contrast permits (body text on surface already at 18.7:1).
- **Color is never the sole signal.** Correct/wrong always pairs `success`/`danger` with an icon and a text label.
- **Cyrillic is a hard constraint.** All display and body faces ship full Cyrillic (Unbounded display, Onest body). No Latin-only display fonts.
- **`prefers-reduced-motion` honored globally** — every Trajectory animation, XP toast, streak pulse, and reveal collapses to instant or a crossfade.
- **Visible keyboard focus** with 2px brand outline + 2px offset; `aria-label`s on icon buttons; skip-nav into the main content area.
- **Tabular numerals** on every score, XP, and Trajectory readout so digits don't jitter during animation — important for students glancing at a moving score.
