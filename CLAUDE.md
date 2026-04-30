# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

- `npm run dev` — start dev server (Next.js, http://localhost:3000)
- `npm run build` — production build
- `npm run start` — run the production build
- `npm run lint` — ESLint via flat config (`eslint.config.mjs`, `next/core-web-vitals` + `next/typescript`)

There is no test runner configured.

## Stack

- Next.js **16.2.4** (App Router) with React **19.2.4** — see `AGENTS.md`: APIs differ from older Next.js; consult `node_modules/next/dist/docs/` before writing framework code.
- TypeScript, path alias `@/*` → `src/*` (`tsconfig.json`).
- No CSS framework — styling is hand-written CSS in `src/app/globals.css` using CSS custom properties (design tokens like `--paper`, `--ink`, `--signal`, `--mono/--sans/--serif`). Inline `style` props are used heavily across components.

## Architecture

Single Next.js app under `src/`:

- `src/app/` — App Router routes. Top-level routes: `/` (home), `connexion`, `inscription`, `contact`, `profil`, `article/[id]`, `rubriques/[slug]`, and a `qcm/` section with `test`, `code`, `resultats`, `statistiques` sub-pages.
- `src/components/` — shared UI: `header`, `footer`, `account-header`, `auth-screen`, `article-card`, plus `atoms.tsx` (small primitive building blocks reused across pages).
- `src/lib/data.ts` — single source of in-memory mock data (`CATEGORIES`, `SAMPLE_ARTICLES`, etc.). The app currently has no backend / database; pages render from this static module. When adding a new content type, extend `data.ts` rather than introducing a parallel data source.

Domain: French-language editorial site ("Maison·Calorie") about home energy retrofits, plus a QCM (multiple-choice quiz) flow for a professional certification. The `qcm/*` routes form a multi-step flow (test → resultats / statistiques) and the `code/` page gates access via a code.

When editing pages, note that `src/app/layout.tsx` sets `lang="fr"` and only imports `globals.css` — there is no provider tree, so cross-page state must be added explicitly (e.g. via a new client provider component) rather than assumed to exist.
