# Qadam — ent-frontend

Vue 3 SPA frontend for the **Qadam ЕНТ prep platform** (Kazakhstan ЕНТ exam preparation + grant calculator).

The build harness — specs, tickets, and the API contract — lives **in a sibling repo** at:

```
../learning-model/plan/
├── 00_README_Build_Harness.md
├── 02_Data_Model_Spec.md
├── 03_Ticket_Breakdown.md       # T-001..T-404, with acceptance criteria
├── 04_Environment_And_Scaffold.md
├── 05_Seed_Data_Spec.md
├── 06_Frontend_Spec.md          # screen specs, components, copy
└── openapi.yaml                  # ← single source of truth for the API
```

> The Frontend Spec is written for React; this repo overrides to Vue. See the
> stack mapping table in `.claude` memory or rely on the equivalents wired in
> `package.json`.

## Stack

- Vite + Vue 3 (Composition API, `<script setup>`) + TypeScript strict
- vue-router 4, Pinia 2, @tanstack/vue-query 5, axios
- Tailwind CSS v4 (`@theme` design tokens — see `src/styles/main.css`)
- vee-validate 4 + zod, @vueuse/core, @vueuse/motion
- reka-ui (a11y primitives), vue-echarts (radar)
- vite-plugin-pwa, vitest + @vue/test-utils

## Setup

```bash
cp .env.example .env       # set VITE_API_BASE_URL and VITE_GOOGLE_CLIENT_ID
npm install
npm run openapi:gen        # generate src/shared/lib/api/schema.ts from ../learning-model/plan/openapi.yaml
npm run dev                # http://localhost:5173
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `vue-tsc` typecheck + production build |
| `npm run preview` | Serve the built bundle |
| `npm run lint` | ESLint (flat config, zero warnings) |
| `npm run typecheck` | `vue-tsc --noEmit` |
| `npm test` | Vitest, one-shot |
| `npm run test:watch` | Vitest, watch mode |
| `npm run openapi:gen` | Regenerate API types from the sibling `openapi.yaml` |
| `npm run mock:api` | Run a Prism mock server against `openapi.yaml` |

## Project layout

```
src/
├── app/                  # router, top-level wiring
├── features/             # feature folders (auth, onboarding, dashboard, ...)
│   └── <domain>/
│       ├── <Screen>.vue
│       ├── components/
│       ├── composables/
│       └── schemas/
├── shared/
│   ├── components/       # AppShell, BottomNav, Sidebar, Toaster, …
│   ├── composables/
│   ├── lib/
│   │   ├── api/          # axios client + generated schema
│   │   ├── i18n/         # t() + ru dictionary
│   │   └── utils/
│   └── stores/           # Pinia: auth, ui (NO server state)
├── styles/               # main.css with Tailwind v4 @theme tokens
└── test/                 # vitest setup
```

## Conventions

- **Contract-first.** Never hand-type a response shape — import from `src/shared/lib/api/schema.ts`. If the contract is wrong, change `openapi.yaml` first, regen, then update code.
- **Server state lives in vue-query only.** Pinia is for auth + ephemeral UI only.
- **Three states.** Every data view renders loading + empty + error. No bare spinners-forever, no blank screens.
- **All visible strings via `t()`.** Russian dictionary in `src/shared/lib/i18n/ru.ts`. No hardcoded text in templates.
- **Color is never the sole signal.** Correct/wrong uses `success`/`danger` color **and** icon + text.
- **Mobile-first.** Design at 360–414px; `md:` adds sidebar; touch targets ≥ 44px; respect safe-area insets.

## Design tokens

See `src/styles/main.css` (`@theme` block). The brand is `#6D4AFF` ("Ascent"). The repo also contains a `DESIGN.md` (Coursera Blue direction) — **that file is superseded** by the Frontend Spec §2 and should be ignored.

## Status

Scaffolded per **T-005** of `03_Ticket_Breakdown.md` (Epic 0 — Foundations). See in-repo TODOs and ticket stubs in `src/features/*` for what's wired vs. what's still a placeholder.
