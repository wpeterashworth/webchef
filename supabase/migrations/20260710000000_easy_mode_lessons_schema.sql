-- WebChef — additive schema for the easy-mode lesson bank
--
-- This migration adds a separate, normalized content model for the JSON lesson
-- bank in cooking_app_easy_mode_lessons_for_copilot.md / JSON/easy_mode_lessons.json.
-- It does not modify or drop any existing tables, so it can coexist with the
-- current schema and be reviewed safely before any live database rollout.

create table easy_mode_categories (
    id          uuid primary key default gen_random_uuid(),
    name        text not null unique,
    sort_order  integer not null,
    created_at  timestamptz not null default now()
);

create table easy_mode_skills (
    id            uuid primary key default gen_random_uuid(),
    category_id   uuid not null references easy_mode_categories (id) on delete cascade,
    name          text not null,
    mode          text not null default 'easy' check (mode = 'easy'),
    sort_order    integer not null,
    created_at    timestamptz not null default now(),
    unique (category_id, name)
);

create index easy_mode_skills_category_id_idx on easy_mode_skills (category_id);

create table easy_mode_mini_lessons (
    id            uuid primary key default gen_random_uuid(),
    skill_id      uuid not null references easy_mode_skills (id) on delete cascade,
    title         text not null,
    lesson_text   text not null,
    sort_order    integer not null,
    created_at    timestamptz not null default now(),
    unique (skill_id, title)
);

create index easy_mode_mini_lessons_skill_id_idx on easy_mode_mini_lessons (skill_id);

create table easy_mode_questions (
    id              uuid primary key default gen_random_uuid(),
    mini_lesson_id  uuid not null references easy_mode_mini_lessons (id) on delete cascade,
    prompt          text not null,
    choices         jsonb not null default '[]'::jsonb,
    correct_answer   text not null,
    feedback        text not null,
    sort_order      integer not null,
    created_at      timestamptz not null default now()
);

create index easy_mode_questions_mini_lesson_id_idx on easy_mode_questions (mini_lesson_id);
