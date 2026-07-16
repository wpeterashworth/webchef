-- Keep the user's chosen cosmetic level_title unless they level up.

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
  v_display_title text;
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
    level_title = case
      when v_new_level > v_old_level then v_new_title
      else level_title
    end
  where id = v_user_id
  returning level_title into v_display_title;

  return jsonb_build_object(
    'lesson_slug', p_lesson_slug,
    'difficulty', p_difficulty,
    'points_awarded', v_points_awarded,
    'points_earned', greatest(v_old_points, v_new_points),
    'xp', v_total_xp,
    'level_number', v_new_level,
    'level_title', v_display_title,
    'leveled_up', v_new_level > v_old_level
  );
end;
$$;
