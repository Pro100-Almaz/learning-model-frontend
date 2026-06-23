# Frontend Spec — build-ready

The implementation-level frontend spec. An agent builds against **this + `openapi.yaml`**: design tokens,
component contracts, per-screen specs with states, routing, and data conventions. Strategy lives in
`02_Frontend_Implementation_Plan`; tickets in `03_Ticket_Breakdown`; this is the precision layer.

Stack: React 18 + TS (strict) · Vite · Tailwind + shadcn/ui · React Router v6 · TanStack Query · Zustand ·
Axios · React Hook Form + Zod · Recharts · Framer Motion · `vite-plugin-pwa`.

---

## 1. Conventions

- **Types come from the contract.** Run `openapi-typescript openapi.yaml -o src/lib/api/schema.ts`. Never hand-type a response shape; import from the generated schema. If a shape is wrong, fix the contract, regenerate.
- **Server state = TanStack Query only.** Zustand holds auth + transient UI (modal open, etc.). Never cache server data in Zustand.
- **Feature folders** (`src/features/<domain>/`): each owns its screens, components, hooks, schemas.
- TypeScript strict; no `any`. ESLint + Prettier enforced in CI.
- UI language Russian; all visible strings go through a `t()` dictionary (`src/lib/i18n`) so Kazakh can be added later.

---

## 2. Design system

Direction: **"Ascent"** — the product's job is to turn exam anxiety into a visible climb toward a grant.
Everything quiet and disciplined; spend boldness on one signature element (below).

### Color tokens (`tailwind.config` → CSS vars)
These are the proposed default pending your brand decision (README blocker #4). Commit to them or replace globally.

| Token | Hex | Use |
|---|---|---|
| `--ink` | `#161427` | primary text, dark surfaces |
| `--brand` | `#6D4AFF` | primary actions, brand |
| `--brand-press` | `#5A3AE0` | pressed/active |
| `--ascent` | `#FF8A3D` | XP, streak flame, momentum |
| `--success` | `#12B886` | correct answer, "qualifies for grant" |
| `--danger` | `#F03E5E` | wrong answer, gap-to-goal |
| `--surface` | `#F6F6FB` | app background |
| `--card` | `#FFFFFF` | cards, sheets |
| `--muted` | `#6E6B85` | secondary text |
| `--hairline` | `#E8E7F0` | borders, dividers |

Semantic mapping: correct/wrong **must** use `success`/`danger`; never reuse `brand` for state.

### Typography — Cyrillic is a hard constraint
The UI is Russian/Kazakh, so faces must ship full Cyrillic. This rules out most Latin-only display fonts.

- **Display** (`--font-display`): **Unbounded** — distinctive, excellent Cyrillic, used *with restraint* for scores and screen titles only.
- **Body/UI** (`--font-body`): **Onest** (or Inter as fallback) — clean, full Cyrillic, the workhorse.
- **Numerals:** scores are central — always `font-variant-numeric: tabular-nums` so digits don't jitter as they animate.
- Type scale (mobile): 12 / 14 / 16 / 20 / 28 / 40. Display weights 600–800 used sparingly; body 400/500/600.

### Spacing / radius / elevation
- 4px spacing base (4/8/12/16/24/32). Card radius 16px, buttons 12px, pills full.
- One soft shadow for cards (`0 2px 12px rgba(22,20,39,.06)`); avoid shadow soup.

### Motion (Framer Motion, restrained)
Animate only the dopamine moments: XP gain, level-up, streak flame pulse, correct-answer tick, and the
trajectory fill. Respect `prefers-reduced-motion`. Everywhere else: instant.

### Signature element — the Trajectory
A single memorable component: a track showing **predicted score climbing toward the target line**, with the
gap called out. It appears on the dashboard (compact) and the grant screen (full). This is the product's soul;
keep all surrounding UI plain so it stands out.

### Copy / voice (Russian, per design skill)
Active voice, sentence case, no filler. Buttons name the action and keep the name through the flow
("Рассчитать" → result, not "Отправить"). Empty states invite action; errors give direction, not apology.
- Empty analytics: «Пройди первый тест — здесь появится твоя карта сильных и слабых тем.»
- Calculator 409: «Сначала пройди пробный тест по математике — без него не рассчитать прогноз.»

---

## 3. Layout & responsive

- **Mobile-first.** Design at 360–414px; `md:` (≥768) adds sidebar + multi-column; `lg:` widens.
- **AppShell** swaps chrome, keeps content shared:
  - mobile: `<BottomNav>` — Главная · Темы · Тесты · Профиль (4 tabs, ≥44px targets).
  - `md+`: `<Sidebar>` left, content right.
- Sticky bottom CTA on lesson/test screens (thumb reach). Respect iOS safe-area insets (`env(safe-area-inset-bottom)`).
- No hover-only affordances; all interactions work on touch.

---

## 4. Data layer & state

### API client
`src/lib/api/client.ts` — Axios instance, `baseURL = VITE_API_BASE_URL`, Bearer from auth store, response
interceptor that refreshes on 401 (calls `/auth/refresh/`, retries once, else logs out).

### Query key conventions
`['profile']` · `['modules']` · `['module', id]` · `['lesson', id]` · `['attempt', id]` ·
`['analytics','tags']` · `['analytics','recos']` · `['gamification']` · `['careers','calc']`.
Mutations invalidate the keys they affect (e.g. finishing an attempt invalidates `analytics`, `gamification`).

### Hooks (one per endpoint, in feature folders)
`useProfile`, `useOnboardingOptions`, `useModules`, `useModule`, `useLesson`, `useStartAttempt`,
`useSubmitAnswer`, `useFinishAttempt`, `useAttemptReview`, `useTagStats`, `useRecommendations`,
`useUniversities`, `useCalculateGrant`, `useGamification`. Return shapes = generated contract types.

### Zustand stores
- `authStore`: `{ accessToken, user, login(), logout(), isAuthed }`.
- `uiStore`: ephemeral UI only.

### Global conventions (DoD-enforced)
Every data view renders **three states**: `<LoadingSkeleton>`, `<EmptyState>` (with a CTA), `<ErrorState>`
(message + retry). No bare spinners-forever, no blank screens.

---

## 5. Routing & guards

| Route | Screen | Guard |
|---|---|---|
| `/login` | Login | public; redirect to `/` if authed |
| `/onboarding` | Onboarding wizard | authed; blocks until `onboarding_completed` |
| `/` | Dashboard | authed + onboarded |
| `/catalog`, `/catalog/:moduleId` | Catalog / module | ″ |
| `/lesson/:id` | Lesson | ″ |
| `/test/:id` | Micro-test | ″ |
| `/mock`, `/mock/:attemptId` | Mock simulator | ″ |
| `/results/:attemptId` | Results + review | ″ |
| `/analytics` | Analytics | ″ |
| `/grant` | Grant calculator | ″ |
| `/profile` | Profile | ″ |

`<RequireAuth>` and `<RequireOnboarded>` wrapper routes. Unauthed → `/login`; authed-but-not-onboarded → `/onboarding`.

---

## 6. Shared component contracts

Props are binding; states must all be handled.

```ts
AppShell({ children })                       // renders BottomNav (mobile) / Sidebar (md+)
VideoPlayer({ url, provider })               // youtube|vimeo embed, 16:9, lazy
QuestionCard({ question, selectedId, onSelect, feedback })
  // feedback?: { correctId, isCorrect } -> color options success/danger after submit
OptionButton({ text, state })                // state: idle|selected|correct|wrong|disabled
Timer({ startedAt, limitSec, onExpire })     // server-synced; warns < 60s
ProgressBar({ percent, tone })               // tone: brand|success|danger
RadarChart({ data })                         // Recharts; data: TagStat[]
Trajectory({ predicted, target, max, variant }) // SIGNATURE; variant: compact|full
XPBar({ totalXp, xpToNext, levelLabel })
StreakFlame({ days, activeToday })           // pulse when activeToday
LevelBadge({ code, label })
UniversityResultCard({ universityName, specialtyName, minScore, margin })
GoalTrackerCard({ goal })                    // goal: GoalTracker; wraps Trajectory + advice
RecommendationCard({ tag, percent, lessons })
SearchSelect({ options, value, onChange })   // searchable; used in onboarding
Stepper({ step, total })
LoadingSkeleton / EmptyState({ title, cta }) / ErrorState({ onRetry })
```

---

## 7. Screen specs

Each: **route · data · layout · states · interactions · AC**. AC is in addition to global DoD.

### Login `/login`
Data: none. Layout: brand mark, one-line value prop, Google button. Interactions: Google → store JWT → route to onboarding or `/`. **AC:** error toast on auth failure; no infinite spinner.

### Onboarding `/onboarding` (T-304)
Data: `useOnboardingOptions`, `useProfile` (PATCH). Layout: `<Stepper total={3}>` — (1) target university + specialty (`SearchSelect`), (2) expected scores for other subjects (numeric inputs, validated 0–max), (3) optional target score. Validation: Zod (§8). **AC:** can't advance past invalid step; submit PATCHes profile and flips `onboarding_completed`; back-navigation preserves entries.

### Dashboard `/` 
Data: `useGamification`, `useRecommendations`. Layout (mobile):
```
[ Привет, {имя}  •  🔥{streak} ]
[ XPBar — уровень {label} ]
[ Trajectory (compact): прогноз → цель ]   <- only if target set
[ Продолжить обучение  → last lesson ]
[ Что подтянуть: top weak tag → lessons ]
```
**AC:** Trajectory hidden gracefully if no target/no mock yet (shows CTA to take mock instead); all tiles tappable.

### Catalog `/catalog`, `/catalog/:moduleId` (T-105)
Data: `useModules` / `useModule`. Layout: module cards → lesson rows with `completed` check. **AC:** completed lessons visibly marked; empty module shows EmptyState.

### Lesson `/lesson/:id` (T-105)
Data: `useLesson`. Layout: `VideoPlayer`, title, description, **sticky CTA «Пройти тест по теме»** (disabled if `micro_test_id` null). **AC:** video embeds by provider; CTA routes to `/test/{micro_test_id}`.

### Micro-test `/test/:id` (T-106)
Data: `useStartAttempt`, `useSubmitAnswer`, `useFinishAttempt`. Flow: start → one `QuestionCard` at a time → on submit show instant feedback (`is_correct`, color options) + XP toast → next → finish → route to results. **AC:** correctness never shown before submit; progress indicator; can't skip unanswered; finishing routes to `/results/{id}`.

### Mock simulator `/mock`, `/mock/:attemptId` (T-207)
Data: same hooks; `Timer` from `started_at`+`time_limit_sec`. Layout: full-screen, distraction-free; question nav; visible countdown, warning <60s. **AC:** `is_correct` withheld until finish (per contract); auto-submits on expiry; refresh resumes the same attempt with correct remaining time (server is source of truth).

### Results + review `/results/:attemptId` (T-106)
Data: `useFinishAttempt` result + `useAttemptReview`. Layout: score header (display font, tabular nums) → list of `ReviewItem`s: your answer vs correct (success/danger) + teacher `explanation`. **AC:** every question shows correct option + explanation; owner-only (handle 403/404 with ErrorState).

### Analytics `/analytics` (T-205)
Data: `useTagStats`, `useRecommendations`. Layout: `RadarChart` of tag strengths → per-tag `ProgressBar`s → «Что нужно подтянуть» `RecommendationCard`s linking to lessons. **AC:** empty state before any test; `percent` rendered null-safe; cards deep-link to lessons.

### Grant calculator `/grant` (T-305) — **centerpiece, max polish**
Data: `useCalculateGrant` (POST), `useProfile`. Layout (full):
```
[ «Рассчитать» button | or auto-run if mock done ]
[ Trajectory (full): math {x} + другие {y} = прогноз {N} ──▲── цель {T} ]
[ GoalTrackerCard: «До цели не хватает {gap} — упор на {weakest_tag}» ]
[ Проходишь на грант: list of UniversityResultCard (margin badge) ]
```
**AC:** renders `GrantCalcResult` exactly; **409 → friendly empty state** linking to `/mock` («Сначала пройди пробный тест»); qualifying list sorted by margin desc; Trajectory animates the fill once (reduced-motion respected); if no `target_score`, show predicted + qualifying list without the goal plate.

### Profile `/profile` (T-206)
Data: `useGamification`. Layout: `LevelBadge`, `XPBar`, `StreakFlame`, longest streak, total XP. **AC:** level-up + XP animations; numbers tabular.

---

## 8. Forms & validation (Zod)

```ts
// onboarding
expectedScore = z.object({ subject: z.string(), score: z.number().int().min(0).max(MAX) })
onboardingSchema = z.object({
  target_university: z.number().nullable(),
  target_specialty:  z.number().nullable(),
  target_score:      z.number().int().min(0).max(MAX).nullable(),
  expected_scores:   z.array(expectedScore).min(1),
})
```
React Hook Form + `@hookform/resolvers/zod`. Inline field errors in the interface voice (no «Invalid input»).

---

## 9. PWA (T-402)

`vite-plugin-pwa`: manifest (name, theme `--brand`, maskable icons 192/512), service worker caching app shell
+ static assets. Installable "добавить на главный экран". Defer push (streak reminders) to post-MVP.

---

## 10. Accessibility & i18n

- Visible keyboard focus, `aria-label`s on icon buttons, color never the sole signal (correct/wrong also use icon/text).
- All strings via `t()`; no hardcoded Russian in JSX. Number/date formatting via `Intl` with `ru` locale.
- `prefers-reduced-motion` honored across all Framer Motion.

---

## 11. Definition of Done (frontend)

- [ ] Matches `openapi.yaml` types (generated client, no hand-typed shapes)
- [ ] Responsive 360px → desktop; BottomNav↔Sidebar swap verified
- [ ] Every data view has loading + empty + error states
- [ ] Correct/wrong use `success`/`danger` + non-color cue
- [ ] Trajectory + gamification animations respect reduced-motion
- [ ] PWA installable; Lighthouse mobile + PWA pass
- [ ] Verified on a real Android phone
