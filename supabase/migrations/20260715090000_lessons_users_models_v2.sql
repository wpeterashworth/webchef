-- WebChef — lesson/user model updates for multi-difficulty content.
--
-- Forward-only migration. Does not edit previous migration files.
-- Supports easy/medium/hard lesson content and per-difficulty user progress.

begin;

-- ---------------------------------------------------------------------------
-- 1) Lesson model updates
-- ---------------------------------------------------------------------------

-- Expand skill mode beyond easy only.
alter table public.easy_mode_skills
  drop constraint if exists easy_mode_skills_mode_check;

alter table public.easy_mode_skills
  add constraint easy_mode_skills_mode_check
  check (mode in ('easy', 'medium', 'hard'));

-- Allow same skill name across modes inside a category.
alter table public.easy_mode_skills
  drop constraint if exists easy_mode_skills_category_id_name_key;

alter table public.easy_mode_skills
  add constraint easy_mode_skills_category_id_name_mode_key
  unique (category_id, name, mode);

create index if not exists easy_mode_skills_category_mode_idx
  on public.easy_mode_skills (category_id, mode);

-- Mini lessons: enforce stable ordering per skill.
alter table public.easy_mode_mini_lessons
  drop constraint if exists easy_mode_mini_lessons_skill_id_sort_order_key;

alter table public.easy_mode_mini_lessons
  add constraint easy_mode_mini_lessons_skill_id_sort_order_key
  unique (skill_id, sort_order);

create index if not exists easy_mode_mini_lessons_skill_sort_idx
  on public.easy_mode_mini_lessons (skill_id, sort_order);

-- Questions: enforce 4 choices + valid answer letter + stable ordering.
alter table public.easy_mode_questions
  drop constraint if exists easy_mode_questions_choices_len_check;

alter table public.easy_mode_questions
  add constraint easy_mode_questions_choices_len_check
  check (
    jsonb_typeof(choices) = 'array'
    and jsonb_array_length(choices) = 4
  );

alter table public.easy_mode_questions
  drop constraint if exists easy_mode_questions_correct_answer_check;

alter table public.easy_mode_questions
  add constraint easy_mode_questions_correct_answer_check
  check (upper(correct_answer) in ('A', 'B', 'C', 'D'));

alter table public.easy_mode_questions
  drop constraint if exists easy_mode_questions_mini_lesson_id_sort_order_key;

alter table public.easy_mode_questions
  add constraint easy_mode_questions_mini_lesson_id_sort_order_key
  unique (mini_lesson_id, sort_order);

create index if not exists easy_mode_questions_mini_lesson_sort_idx
  on public.easy_mode_questions (mini_lesson_id, sort_order);

-- ---------------------------------------------------------------------------
-- 2) User model updates
-- ---------------------------------------------------------------------------

-- Profile preference for default learning difficulty.
alter table public.users
  add column if not exists difficulty_preference text not null default 'beginner';

alter table public.users
  drop constraint if exists users_difficulty_preference_check;

alter table public.users
  add constraint users_difficulty_preference_check
  check (difficulty_preference in ('beginner', 'intermediate', 'advanced'));

-- Track progress separately per lesson difficulty.
alter table public.user_progress
  add column if not exists difficulty_level text not null default 'beginner';

alter table public.user_progress
  drop constraint if exists user_progress_difficulty_level_check;

alter table public.user_progress
  add constraint user_progress_difficulty_level_check
  check (difficulty_level in ('beginner', 'intermediate', 'advanced'));

alter table public.user_progress
  drop constraint if exists user_progress_user_id_lesson_id_key;

alter table public.user_progress
  add constraint user_progress_user_id_lesson_id_difficulty_level_key
  unique (user_id, lesson_id, difficulty_level);

create index if not exists user_progress_user_lesson_difficulty_idx
  on public.user_progress (user_id, lesson_id, difficulty_level);

commit;
