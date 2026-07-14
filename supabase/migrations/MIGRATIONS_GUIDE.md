# Supabase Migrations Guide

This folder is append-only history. Do not edit or delete applied files.

## How to Keep Migrations Less Confusing

1. One migration per logical change set.
2. Use clear names: `add_`, `backfill_`, `cleanup_`, `rls_`, `seed_`.
3. Keep schema migrations separate from seed migrations.
4. Never rely on file order by name only; rely on timestamp prefixes.
5. Avoid duplicate descriptions like multiple `seed_recipes` files in one day.
6. Add a short header comment in every migration explaining intent and rollout risk.

## Suggested Naming Pattern

`YYYYMMDDHHMMSS_<scope>_<purpose>.sql`

Examples:

- `20260715090000_lessons_users_models_v2.sql`
- `20260715090500_lessons_backfill_modes.sql`
- `20260715091000_lessons_cleanup_old_constraints.sql`

## Migration Types

- Schema: creates/alters tables, constraints, indexes.
- Data Backfill: transforms existing rows to fit new schema.
- RLS/Permissions: grants, revokes, policies, auth-related functions.
- Seed: initial content inserts (idempotent when possible).

## Current Timeline (quick index)

- `20260623000000_initial_schema.sql`: base app tables.
- `20260708000000_rename_auth0_id_to_auth_user_id.sql`: auth column rename.
- `20260709000000_add_delete_own_account_function.sql`: self-delete function.
- `20260710000000_easy_mode_lessons_schema.sql`: lesson-bank tables.
- `20260714184552_enable_rls_policies.sql`: RLS and grants.
- `20260714210000_extend_recipes_for_import.sql`: recipe import prep.
- `20260714210001_seed_recipes.sql`: recipe seed.
- `20260714210002_add_recipe_tags.sql`: tags support.
- `20260714210003_seed_recipes.sql`: additional recipe seed.
- `20260714210004_create_user_profile_on_signup.sql`: profile creation on signup.
- `20260714210005_user_progress_status.sql`: user progress status updates.

## Team Rules

- Treat applied migrations as immutable.
- If a previous migration needs correction, write a new migration.
- For major cleanup, schedule a deliberate baseline/squash task with team agreement.
- Pair schema changes with validation queries in PR descriptions.
