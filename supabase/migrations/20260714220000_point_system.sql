-- WebChef — point system from point-system.txt
--
-- Adds level tiers, lesson completion points (10/25/50 by difficulty), and
-- server-side XP awards so the browser cannot set its own score.

-- ---------------------------------------------------------------------------
-- levels — reference data for level 0..20
-- ---------------------------------------------------------------------------
create table levels (
  level_number  integer primary key check (level_number between 0 and 20),
  title         text not null,
  xp_required   integer not null check (xp_required >= 0),
  min_total_xp  integer not null check (min_total_xp >= 0),
  unlocks       text[] not null default '{}'
);

-- xp_required = points needed for the previous step (0 for level 0).
-- min_total_xp = cumulative XP to reach this level.
insert into levels (level_number, title, xp_required, min_total_xp, unlocks) values
  (0,  'Idiot Sandwitch',      0,    0,    '{}'),
  (1,  'Couch Potato',        10,   10,   '{leaderboard}'),
  (2,  'Couch Potato',        25,   35,   '{intermediate}'),
  (3,  'Couch Potato',        30,   65,   '{}'),
  (4,  'Couch Potato',        35,   100,  '{}'),
  (5,  'Kitchen walker',      40,   140,  '{expert}'),
  (6,  'Kitchen walker',      50,   190,  '{}'),
  (7,  'Kitchen walker',      60,   250,  '{}'),
  (8,  'Kitchen walker',      70,   320,  '{}'),
  (9,  'Kitchen walker',      80,   400,  '{}'),
  (10, 'Lamb Sauce Finder',   90,   490,  '{}'),
  (11, 'Lamb Sauce Finder',  100,   590,  '{}'),
  (12, 'Lamb Sauce Finder',  110,   700,  '{}'),
  (13, 'Lamb Sauce Finder',  120,   820,  '{}'),
  (14, 'Lamb Sauce Finder',  130,   950,  '{}'),
  (15, 'Lamb Sauce Finder',  140,  1090,  '{}'),
  (16, 'Master Chef Dropout', 155, 1245,  '{}'),
  (17, 'Master Chef Dropout', 170, 1415,  '{}'),
  (18, 'Master Chef Dropout', 185, 1600,  '{}'),
  (19, 'Master Chef Dropout', 200, 1800,  '{}'),
  (20, 'Master Chef Dropout', 220, 2020,  '{create_lessons}');

-- ---------------------------------------------------------------------------
-- users — track displayed level alongside total xp
-- ---------------------------------------------------------------------------
alter table users
  add column level_number integer not null default 0
    check (level_number between 0 and 20),
  add column level_title text not null default 'Idiot Sandwitch';

-- Keep existing rows consistent with their current xp.
update users u
set
  level_number = lv.level_number,
  level_title = lv.title
from lateral (
  select level_number, title
  from levels
  where min_total_xp <= u.xp
  order by level_number desc
  limit 1
) lv;

-- ---------------------------------------------------------------------------
-- user_progress — record difficulty played and points earned for a lesson
-- ---------------------------------------------------------------------------
alter table user_progress
  add column difficulty text
    check (difficulty is null or difficulty in ('beginner', 'intermediate', 'advanced')),
  add column points_earned integer not null default 0 check (points_earned >= 0);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
create or replace function public.points_for_difficulty(p_difficulty text)
  returns integer
  language sql
  immutable
as $$
  select case p_difficulty
    when 'beginner' then 10
    when 'intermediate' then 25
    when 'advanced' then 50
    else 0
  end;
$$;

create or replace function public.level_for_xp(p_xp integer)
  returns table (level_number integer, level_title text)
  language sql
  stable
as $$
  select l.level_number, l.title
  from levels l
  where l.min_total_xp <= p_xp
  order by l.level_number desc
  limit 1;
$$;

-- ---------------------------------------------------------------------------
-- Award lesson points and recompute level. Callable only by signed-in users.
-- Replaying at a higher difficulty awards only the point difference.
-- ---------------------------------------------------------------------------
create or replace function public.complete_lesson(
  p_lesson_slug text,
  p_difficulty text,
  p_score integer default null
)
  returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_user_id uuid;
  v_new_points integer;
  v_old_points integer := 0;
  v_points_awarded integer;
  v_old_level integer;
  v_new_level integer;
  v_new_title text;
  v_total_xp integer;
begin
  if p_difficulty not in ('beginner', 'intermediate', 'advanced') then
    raise exception 'Invalid difficulty: %', p_difficulty;
  end if;

  select id, level_number, xp
  into v_user_id, v_old_level, v_total_xp
  from public.users
  where auth_user_id = (select auth.uid())::text;

  if v_user_id is null then
    raise exception 'No profile row for the signed-in user';
  end if;

  v_new_points := public.points_for_difficulty(p_difficulty);

  select coalesce(points_earned, 0)
  into v_old_points
  from public.user_progress
  where user_id = v_user_id
    and lesson_slug = p_lesson_slug;

  v_points_awarded := greatest(0, v_new_points - v_old_points);

  insert into public.user_progress (
    user_id,
    lesson_slug,
    status,
    difficulty,
    points_earned,
    score,
    completed_at
  )
  values (
    v_user_id,
    p_lesson_slug,
    'completed',
    p_difficulty,
    greatest(v_old_points, v_new_points),
    p_score,
    now()
  )
  on conflict (user_id, lesson_slug) do update
  set
    status = 'completed',
    difficulty = excluded.difficulty,
    points_earned = greatest(user_progress.points_earned, excluded.points_earned),
    score = coalesce(excluded.score, user_progress.score),
    completed_at = now();

  if v_points_awarded > 0 then
    update public.users
    set xp = xp + v_points_awarded
    where id = v_user_id
    returning xp into v_total_xp;
  end if;

  select level_number, level_title
  into v_new_level, v_new_title
  from public.level_for_xp(v_total_xp);

  update public.users
  set
    level_number = v_new_level,
    level_title = v_new_title
  where id = v_user_id;

  return jsonb_build_object(
    'lesson_slug', p_lesson_slug,
    'difficulty', p_difficulty,
    'points_awarded', v_points_awarded,
    'points_earned', greatest(v_old_points, v_new_points),
    'xp', v_total_xp,
    'level_number', v_new_level,
    'level_title', v_new_title,
    'leveled_up', v_new_level > v_old_level
  );
end;
$$;

-- Leaderboard: only users who reached level 1+ (per point-system.txt).
create or replace function public.get_leaderboard(p_limit integer default 50)
  returns table (
    rank bigint,
    username text,
    xp integer,
    level_number integer,
    level_title text
  )
  language sql
  security definer
  stable
  set search_path = ''
as $$
  select
    row_number() over (order by u.xp desc, u.username asc) as rank,
    u.username,
    u.xp,
    u.level_number,
    u.level_title
  from public.users u
  where u.level_number >= 1
  order by u.xp desc, u.username asc
  limit greatest(1, least(p_limit, 100));
$$;

revoke all on function public.points_for_difficulty(text) from public, anon, authenticated;
revoke all on function public.level_for_xp(integer) from public, anon, authenticated;
revoke all on function public.complete_lesson(text, text, integer) from public, anon;
revoke all on function public.get_leaderboard(integer) from public, anon;

grant execute on function public.complete_lesson(text, text, integer) to authenticated;
grant execute on function public.get_leaderboard(integer) to authenticated;

-- ---------------------------------------------------------------------------
-- RLS for levels + leaderboard reads on other users' public stats
-- ---------------------------------------------------------------------------
alter table levels enable row level security;

grant select on levels to authenticated;

create policy "Levels are readable by signed-in users"
  on levels for select
  to authenticated
  using (true);
