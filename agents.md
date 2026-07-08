# NOTES FOR AI

- Summarize tasks done in between tasks completed. Do this in the file found in the root, called: "summary-of-tasks.txt" and add the date and the user's name who completed the task with ai. If you don't know the user's name you should ask for it. This way you can remember what has already been completed in order for tasks to be done one by one rather than taking on huge amounts of work all at one time.
- Only work on one task at a time, and make sure that it is documented. Stop working once one task has been completed, and then verify with the user that the next task should be completed before working on it
- Double check with the user BEFORE working on something to make sure you understand what it is that the user wants to get changed. Even if the user gives you less information, make sure you have all that you need before you start working, or if the user even wants you to work on it just yet. In other words, summarize to the user what you will do before you do it.
- Only install dependencies that are absolutely necessary

# WebChef (working title)

A Duolingo-style web app for learning to cook — bite-sized lessons, streaks, and XP to build cooking skills progressively.

## Tech Stack

| Layer    | Technology                      |
| -------- | ------------------------------- |
| Frontend | Svelte / SvelteKit              |
| Backend  | Node.js + Express               |
| Database | PostgreSQL (hosted on Supabase) |
| Auth     | Supabase Auth                   |
| Hosting  | Render                          |

## Why This Stack

- **Svelte** — minimal boilerplate, fast to build interactive lesson UIs, smaller bundle size for snappy feel.
- **Express + Node** — straightforward REST API layer between the frontend and database.
- **PostgreSQL (Supabase)** — relational data (users, lessons, progress, streaks, XP) maps naturally to tables and relationships. Supabase gives us a free hosted Postgres instance plus a dashboard for the whole team to inspect/edit data without local setup.
- **Supabase Auth** — handles signup/login/session management (email + password) using the same Supabase project as our database, so we don't roll our own auth.
- **Render** — simple deploy target for both the Express API and (if not done via Vercel/Netlify) the SvelteKit frontend.

## Project Structure (proposed)

```
/client          → SvelteKit frontend
/server           → Express API
  /routes
  /controllers
  /db             → connection + queries
.env.example
README.md
```

## Environment Variables

Each team member needs a `.env` file (never commit this) based on `.env.example`:

```
# Database (Supabase Postgres)
DATABASE_URL=

# Supabase Auth (client-side; PUBLIC values, safe to expose in the browser)
PUBLIC_SUPABASE_URL=
PUBLIC_SUPABASE_ANON_KEY=

# Server
PORT=3000
```

Supabase connection string and anon (public) key will be shared with the team via Microsoft Teams. Do not commit real credentials.

## Getting Started

```bash
# clone the repo
git clone <repo-url>
cd <repo-name>

# install backend deps
cd server
npm install

# install frontend deps
cd ../client
npm install

# copy env template and fill in shared credentials
cp .env.example .env
```

Run backend:

```bash
cd server
npm run dev
```

Run frontend:

```bash
cd client
npm run dev
```

## Database

We're sharing a single Supabase Postgres instance for development. Before making schema changes:

1. Pull latest changes from the team first.
2. Communicate schema changes in [team channel] before applying them — since we share one DB, conflicting migrations will break everyone.
3. Consider keeping a `schema.sql` or migration files in the repo so changes are tracked and reproducible, not just made ad hoc in the Supabase dashboard.

## Deployment

- Backend (Express API) deployed on Render as a web service.
- Frontend (SvelteKit) deployed on Render as a static site or Node service, depending on whether we use SSR.
- Environment variables set in Render's dashboard for production (separate from local `.env`).

## Team Workflow

- Branch naming: `feature/<short-description>`, `fix/<short-description>`
- Open a PR before merging to `main`; at least one teammate reviews.
- Keep commits scoped and descriptive.

## Roadmap / Core Features

- [ ] User auth (Supabase Auth signup/login)
- [ ] Lesson structure (units → lessons → steps)
- [ ] Progress tracking (XP, streaks, completion)
- [ ] Quiz/interaction types (multiple choice, ordering steps, ingredient matching)
- [ ] Leaderboard
- [ ] Recipe library tied to completed lessons
