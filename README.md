# WebChef 🍳

A Duolingo-style web app for learning to cook — bite-sized lessons, streaks, and XP
to build cooking skills progressively.

> **Status:** Early development. The repo currently contains planning docs and
> architecture decision records (ADRs). Application code (`client/`, `server/`)
> has not been scaffolded yet.

---

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | Svelte / SvelteKit              |
| Backend  | Node.js + Express *(or SvelteKit API routes — see note below)* |
| Database | PostgreSQL (hosted on Supabase) |
| Auth     | Auth0                           |
| Hosting  | Render                          |

### Why this stack

- **SvelteKit** — minimal boilerplate, fast interactive lesson UIs, and a small
  bundle for a snappy feel. File-based routing and built-in API routes mean we may
  be able to skip a separate Express server entirely. *(See [ADR-Svelte.md](./ADR-Svelte.md).)*
- **PostgreSQL on Supabase** — relational data (users, lessons, progress, streaks,
  XP) maps naturally to tables. Supabase gives the whole team a single shared,
  hosted Postgres instance plus a dashboard to inspect/edit data without local
  setup. *(See [ADR-DataBase.md](./ADR-DataBase.md).)*
- **Auth0** — handles signup/login/session management so we don't roll our own auth.
- **Render** — simple deploy target for both the API and the SvelteKit frontend.

> **Open decision:** SvelteKit can handle backend API routes itself, so we may use
> SvelteKit + Postgres directly and drop the separate Express server. This is not
> finalized — see [ADR-Svelte.md](./ADR-Svelte.md).

---

## Project Structure (proposed)

```
/client          → SvelteKit frontend
/server          → Express API (if not using SvelteKit API routes)
  /routes
  /controllers
  /db            → connection + queries
.env.example
README.md
```

---

## Getting Started

> These steps assume the `client/` and `server/` folders exist. Until the app is
> scaffolded, only the env setup applies.

```bash
# clone the repo
git clone <repo-url>
cd webchef

# install backend deps
cd server
npm install

# install frontend deps
cd ../client
npm install

# copy the env template and fill in shared credentials
cp .env.example .env
```

Run the backend:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
cd client
npm run dev
```

---

## Environment Variables

Each team member needs a local `.env` file (**never commit this** — it's gitignored)
based on `.env.example`:

```
# Database (Supabase Postgres)
DATABASE_URI=
DB_PASSWORD=

# Auth0
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_AUDIENCE=

# Server
PORT=3000
```

The Supabase connection string and Auth0 credentials are shared with the team via
Microsoft Teams. **Do not commit real credentials.**

---

## Database

We share a single Supabase Postgres instance for development. Because everyone is on
the same database, coordinate before changing the schema:

1. Pull the latest changes from the team first.
2. Announce schema changes in the team channel **before** applying them — conflicting
   changes will break everyone.
3. Keep a `schema.sql` or migration files in the repo so changes are tracked and
   reproducible, not just made ad hoc in the Supabase dashboard.

---

## Deployment

- **Backend** (Express API, if used) deployed on Render as a web service.
- **Frontend** (SvelteKit) deployed on Render as a static site or Node service,
  depending on whether we use SSR.
- Production environment variables are set in Render's dashboard (separate from the
  local `.env`).

---

## Team Workflow

- Branch naming: `feature/<short-description>`, `fix/<short-description>`
- Open a PR before merging to `main`; at least one teammate reviews.
- Keep commits scoped and descriptive.

---

## Roadmap / Core Features

- [ ] User auth (Auth0 signup/login)
- [ ] Lesson structure (units → lessons → steps)
- [ ] Progress tracking (XP, streaks, completion)
- [ ] Quiz/interaction types (multiple choice, ordering steps, ingredient matching)
- [ ] Leaderboard
- [ ] Recipe library tied to completed lessons

---

## Architecture Decision Records

Key technology choices are documented in the ADRs at the project root:

- [ADR-Svelte.md](./ADR-Svelte.md) — choosing SvelteKit as the framework
- [ADR-DataBase.md](./ADR-DataBase.md) — choosing Supabase Postgres
- [ADR.md](./ADR.md) — ADR template / framework selection
