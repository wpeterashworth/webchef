# Lesson Seed Workflow (Schema-First)

Use migrations for schema changes. Use this seed workflow for lesson content updates.

## Why

Large seed migrations become noisy and hard to review. Keeping content in JSON + seed payloads is easier for teams.

## Source of Truth

- `client/src/lib/JSON/easy_mode_lessons.json`
- `client/src/lib/JSON/medium_mode_lessons.json`
- `client/src/lib/JSON/hard_mode_lessons.json`

## Build Seed Payload

From repository root:

```bash
node scripts/generate-lessons-seed-sql.mjs
```

Output:

- `supabase/seed/lessons_seed_payload.json`

## Ingest Payload into Database

Prerequisite:

- Migration `20260715091500_create_lessons_ingest_function.sql` must be applied.
- `DATABASE_URL` must point to your target Postgres database.

Run:

```bash
node scripts/ingest-lessons-payload.mjs
```

Or via npm scripts:

```bash
npm run lessons:ingest
```

## Optional: Generate Full SQL Seed Migration

Only if you explicitly need SQL content snapshots in migrations:

```bash
node scripts/generate-lessons-seed-sql.mjs --sql
```

Output:

- `supabase/migrations/20260715091000_seed_lessons_all_modes.sql`

## Team Guidance

- Prefer payload generation for normal content updates.
- Prefer payload ingest (`lessons:ingest`) for normal data updates.
- Reserve SQL seed generation for release snapshots or environments that require migration-only bootstrap.
- Keep migration history immutable.
