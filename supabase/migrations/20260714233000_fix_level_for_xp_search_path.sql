-- Fix: level_for_xp referenced unqualified "levels", which fails when called from
-- complete_lesson (search_path = ''). Qualify the table and lock search_path.

create or replace function public.level_for_xp(p_xp integer)
  returns table (level_number integer, level_title text)
  language sql
  stable
  set search_path = ''
as $$
  select l.level_number, l.title
  from public.levels l
  where l.min_total_xp <= p_xp
  order by l.level_number desc
  limit 1;
$$;
