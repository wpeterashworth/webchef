-- WebChef — initial database schema
-- Duolingo-style cooking app: users, lesson content (units > lessons > steps),
-- per-user progress, and a recipe library.
--
-- Scope: data models only (tables, constraints, indexes). No RLS policies,
-- functions, or seed data yet — those are separate tasks.
--
-- Auth note: this project uses Auth0 (not Supabase Auth), so accounts live in
-- this `users` table keyed by the Auth0 subject, rather than `auth.users`.

-- ---------------------------------------------------------------------------
-- users — one row per account, plus gamification state (XP + streaks)
-- ---------------------------------------------------------------------------
create table users (
    id              uuid primary key default gen_random_uuid(),
    auth0_id        text not null unique,          -- Auth0 "sub" claim
    username        text not null unique,
    email           text not null unique,
    xp              integer not null default 0 check (xp >= 0),
    current_streak  integer not null default 0 check (current_streak >= 0),
    longest_streak  integer not null default 0 check (longest_streak >= 0),
    last_active_on  date,                          -- used to compute streaks
    created_at      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- units — top-level course groupings, shown in order
-- ---------------------------------------------------------------------------
create table units (
    id          uuid primary key default gen_random_uuid(),
    title       text not null,
    description text,
    sort_order  integer not null,
    created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- lessons — belong to a unit, ordered within it, award XP on completion
-- ---------------------------------------------------------------------------
create table lessons (
    id          uuid primary key default gen_random_uuid(),
    unit_id     uuid not null references units (id) on delete cascade,
    title       text not null,
    sort_order  integer not null,
    xp_reward   integer not null default 10 check (xp_reward >= 0),
    created_at  timestamptz not null default now()
);

create index lessons_unit_id_idx on lessons (unit_id);

-- ---------------------------------------------------------------------------
-- steps — the interactions inside a lesson. `content` is JSONB so each
-- step type can store its own shape (choices, correct answers, pairs, etc.)
-- ---------------------------------------------------------------------------
create table steps (
    id          uuid primary key default gen_random_uuid(),
    lesson_id   uuid not null references lessons (id) on delete cascade,
    step_type   text not null check (step_type in ('multiple_choice', 'ordering', 'matching')),
    prompt      text not null,
    content     jsonb not null default '{}'::jsonb,
    sort_order  integer not null,
    created_at  timestamptz not null default now()
);

create index steps_lesson_id_idx on steps (lesson_id);

-- ---------------------------------------------------------------------------
-- user_progress — one row per (user, lesson); tracks completion + score
-- ---------------------------------------------------------------------------
create table user_progress (
    id            uuid primary key default gen_random_uuid(),
    user_id       uuid not null references users (id) on delete cascade,
    lesson_id     uuid not null references lessons (id) on delete cascade,
    completed     boolean not null default false,
    score         integer check (score >= 0),
    completed_at  timestamptz,
    created_at    timestamptz not null default now(),
    unique (user_id, lesson_id)
);

create index user_progress_user_id_idx on user_progress (user_id);
create index user_progress_lesson_id_idx on user_progress (lesson_id);

-- ---------------------------------------------------------------------------
-- recipes — recipe library, optionally unlocked by completing a lesson
-- ---------------------------------------------------------------------------
create table recipes (
    id            uuid primary key default gen_random_uuid(),
    lesson_id     uuid references lessons (id) on delete set null,
    title         text not null,
    description   text,
    ingredients   jsonb not null default '[]'::jsonb,
    instructions  jsonb not null default '[]'::jsonb,
    created_at    timestamptz not null default now()
);

create index recipes_lesson_id_idx on recipes (lesson_id);
