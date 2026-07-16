-- WebChef — lesson model updates for multi-difficulty content.
--
-- Forward-only migration. Does not edit previous migration files.
-- Supports easy/medium/hard lesson content.

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

commit;
