# WebChef 🍳

A Duolingo-style web app for learning to cook — bite-sized lessons, streaks, XP,
and level progression that build practical kitchen skills. Learners practice
ingredient substitutions, safe cooking temperatures, and prep/cook-time
estimation through short, game-like lessons with immediate feedback.

> **Status:** ✅ **Complete.** All MVP core features from the
> [spec](./spec.md) are implemented and working: auth, lesson flow with
> per-answer feedback, progress/streak tracking, score-based level progression,
> a recipe library, a leaderboard, user-created lessons, and an admin dashboard.
> The app is a static SvelteKit SPA backed by Supabase and deploys to Render.

---

## Tech Stack

| Layer     | Technology                                            |
| --------- | ----------------------------------------------------- |
| Frontend  | SvelteKit (Svelte 5) — static SPA via `adapter-static` |
| Backend   | Supabase (Postgres + Row-Level Security + RPCs)       |
| Database  | PostgreSQL (hosted on Supabase)                        |
| Auth      | Supabase Auth (email + password)                      |
| Hosting   | Render (free Static Site)                             |
| Tooling   | pnpm, Vite, Vitest, Supabase CLI                      |

### Why this stack

- **SvelteKit as a pure SPA** — the app has no server-side code of its own. It
  builds to plain HTML/CSS/JS with `@sveltejs/adapter-static` and talks directly
  to Supabase from the browser, so there is **no separate Express server** (the
  originally-proposed `server/` layer was dropped). *(See [ADR-Svelte.md](./ADR-Svelte.md).)*
- **Supabase as the backend** — Postgres holds all relational data (users,
  lessons, progress, recipes). Business logic that must be trusted (scoring,
  level-ups, admin queries, lesson ingest, account deletion) lives in Postgres
  **RPC functions**, and access is locked down with **Row-Level Security**
  policies. *(See [ADR-DataBase.md](./ADR-DataBase.md).)*
- **Supabase Auth** — handles signup/login/session using the same Supabase
  project as the database, so we don't roll our own auth.
- **Render Static Site** — the built SPA is served as static files with a
  `/* → /200.html` rewrite for client-side routing. Cost: **$0** (Render free
  static site + Supabase free tier).

---

## Features

- **Authentication** — email/password signup, login, logout, and account
  deletion. A user profile row is created automatically on first signup.
- **Lessons** — short lessons across three topics (ingredient substitutions,
  cooking temperatures, how-to-cook) with three difficulty levels
  (Beginner / Intermediate / Advanced) that control how many skills and
  questions appear. Every answer gives immediate feedback, an explanation, and
  a safety tip.
- **Progress & streaks** — lesson completion, best scores, and streaks are saved
  per user and shown on the dashboard.
- **Points, levels & titles** — scoring drives level progression via a Postgres
  function; users unlock and choose cosmetic level titles (e.g. "Saucy Starter")
  that show on the leaderboard.
- **Leaderboard** — ranks users by XP with their chosen level title.
- **Recipe library** — a browsable collection of recipes with tags, optionally
  tied to lessons.
- **User-created lessons** — learners can create their own lessons and manage
  them under "My Lessons".
- **Admin dashboard** — an admin-only `/admin` page (guarded in-database) with
  summary stats, newest users, and top cooks; the Admin nav link only appears
  for admins.
- **Theming** — light/dark mode toggle.

---

## Project Structure

```
/client                  → SvelteKit frontend (the whole app)
  /src
    /routes              → pages: dashboard, lesson, recipes, leaderboard,
                           login, signup, account, admin, lesson/create,
                           lesson/my-lessons, lesson/[lessonId], recipes/[recipeId]
    /lib
      /components        → header, footer, landing, cards, modals, auth-guard
      /stores            → auth, profile, progress (Svelte stores)
      /supabase          → browser Supabase client
      /javascript        → lessons, points, progress, profile, recipes logic
      /JSON              → bundled lesson/question/recipe content
    app.html, app.css    → app shell + global styles
  /static                → images, icons, favicon
  svelte.config.js       → adapter-static (SPA) config
/supabase
  /migrations            → 22 SQL migrations (schema, RLS, functions, seed data)
  /seed                  → seed helpers
  config.toml
/scripts                 → lesson seed/CSV generation + ingest scripts
/tests/unit              → Vitest unit tests
render.yaml              → Render Blueprint (static site deploy)
spec.md                  → the feature specification
ADR*.md                  → architecture decision records
```

---

## Getting Started

The app lives entirely in `client/`. You need [pnpm](https://pnpm.io/) and
Node 24.

```bash
# clone the repo
git clone https://github.com/wpeterashworth/webchef.git
cd webchef/client

# install dependencies
pnpm install

# copy the env template and fill in the shared Supabase credentials
cp .env.example .env

# run the dev server
pnpm dev
```

Other useful commands (run inside `client/`):

```bash
pnpm build     # produce the static site in client/build
pnpm preview   # preview the production build
pnpm check     # svelte-check type/diagnostic pass
pnpm test      # run the Vitest unit tests
```

---

## Environment Variables

The client needs a `.env` in `client/` (never commit real values — it's
gitignored; `client/.env.example` is the committed template):

```
# Supabase (PUBLIC values, safe to expose in the browser)
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=
```

These are read via SvelteKit's `$env/dynamic/public`, and the Supabase client
fails fast with a clear error if either is missing. The shared project URL and
anon key are distributed to the team privately. **Do not commit real credentials.**

For the lesson-ingest scripts at the repo root, a root `.env` supplies a Postgres
connection string (see `scripts/` and `package.json`).

---

## Database

We share a single Supabase Postgres instance. The schema is defined entirely in
`supabase/migrations/` (22 tracked migrations), so changes are reproducible
rather than made ad hoc in the dashboard:

1. Pull the latest changes from the team first.
2. Announce schema changes in the team channel **before** applying them.
3. Add a new timestamped migration file for any schema change — don't edit
   existing migrations.

See [supabase/migrations/MIGRATIONS_GUIDE.md](./supabase/migrations/MIGRATIONS_GUIDE.md)
for how to apply migrations with the Supabase CLI. Highlights of what the
migrations set up: core tables, RLS policies, the point/level system, the
profile-on-signup trigger, lesson seed data for all three modes, the lesson
ingest RPC, user-created lessons, and the admin dashboard RPC.

---

## Deployment

Deployed to **Render** as a free Static Site via [`render.yaml`](./render.yaml)
(a Render Blueprint):

- Root directory: `client`
- Build: `pnpm install && pnpm build`
- Publish: `client/build`
- SPA fallback: `/* → /200.html` rewrite so deep links and refreshes work
- `PUBLIC_SUPABASE_URL` / `PUBLIC_SUPABASE_ANON_KEY` are set in the Render
  dashboard (baked into the bundle at build time)

To deploy: in Render, choose **New → Blueprint**, pick this repo, and set the two
env vars.

---

## Testing

Unit tests run with Vitest. From `client/`:

```bash
pnpm test
```

There are also unit tests at the repo root under `tests/unit/`.

---

## Team Workflow

- Branch naming: `feature/<short-description>`, `fix/<short-description>`
- Open a PR before merging to `main`; at least one teammate reviews.
- Keep commits scoped and descriptive.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full workflow.

---

## Architecture Decision Records

Key technology choices are documented in the ADRs at the project root:

- [ADR-Svelte.md](./ADR-Svelte.md) — choosing SvelteKit as the framework
- [ADR-DataBase.md](./ADR-DataBase.md) — choosing Supabase Postgres
- [ADR.md](./ADR.md) — ADR template / framework selection
