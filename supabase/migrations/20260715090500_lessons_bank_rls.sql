-- WebChef — RLS and grants for lesson-bank tables.
--
-- Applies the same browser-auth model used elsewhere in the project:
-- authenticated users can read lesson content; anon has no access.
-- No insert/update/delete policies are added for these tables.

begin;

-- ---------------------------------------------------------------------------
-- 1) Enable RLS on lesson-bank tables.
-- ---------------------------------------------------------------------------
alter table public.easy_mode_categories   enable row level security;
alter table public.easy_mode_skills       enable row level security;
alter table public.easy_mode_mini_lessons enable row level security;
alter table public.easy_mode_questions    enable row level security;

-- ---------------------------------------------------------------------------
-- 2) Reset table privileges, then grant read-only access to authenticated.
-- ---------------------------------------------------------------------------
revoke all on public.easy_mode_categories,
             public.easy_mode_skills,
             public.easy_mode_mini_lessons,
             public.easy_mode_questions
  from anon, authenticated;

grant select on public.easy_mode_categories,
                public.easy_mode_skills,
                public.easy_mode_mini_lessons,
                public.easy_mode_questions
  to authenticated;

-- ---------------------------------------------------------------------------
-- 3) Read policies for authenticated users only.
-- ---------------------------------------------------------------------------
drop policy if exists "Easy mode categories readable by signed-in users"
  on public.easy_mode_categories;
create policy "Easy mode categories readable by signed-in users"
  on public.easy_mode_categories for select
  to authenticated
  using (true);

drop policy if exists "Easy mode skills readable by signed-in users"
  on public.easy_mode_skills;
create policy "Easy mode skills readable by signed-in users"
  on public.easy_mode_skills for select
  to authenticated
  using (true);

drop policy if exists "Easy mode mini lessons readable by signed-in users"
  on public.easy_mode_mini_lessons;
create policy "Easy mode mini lessons readable by signed-in users"
  on public.easy_mode_mini_lessons for select
  to authenticated
  using (true);

drop policy if exists "Easy mode questions readable by signed-in users"
  on public.easy_mode_questions;
create policy "Easy mode questions readable by signed-in users"
  on public.easy_mode_questions for select
  to authenticated
  using (true);

commit;
