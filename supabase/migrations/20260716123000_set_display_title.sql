-- Let users pick a previously unlocked cosmetic level title (stored in users.level_title).

create or replace function public.unlocked_titles_for_level(p_level integer)
  returns text[]
  language sql
  stable
  set search_path = ''
as $$
  select coalesce(
    array_agg(title order by min_level),
    '{}'::text[]
  )
  from (
    select title, min(level_number) as min_level
    from public.levels
    group by title
  ) tiers
  where min_level <= p_level;
$$;

create or replace function public.set_display_title(p_title text)
  returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_user_id uuid;
  v_level integer;
  v_clean text;
begin
  v_clean := trim(p_title);

  if v_clean = '' then
    raise exception 'Title cannot be empty';
  end if;

  select id, level_number
  into v_user_id, v_level
  from public.users
  where auth_user_id = (select auth.uid())::text;

  if v_user_id is null then
    raise exception 'No profile row for the signed-in user';
  end if;

  if not (v_clean = any(public.unlocked_titles_for_level(v_level))) then
    raise exception 'That title is not unlocked yet';
  end if;

  update public.users
  set level_title = v_clean
  where id = v_user_id;

  return jsonb_build_object('level_title', v_clean);
end;
$$;

revoke all on function public.unlocked_titles_for_level(integer) from public, anon, authenticated;
revoke all on function public.set_display_title(text) from public, anon;

grant execute on function public.set_display_title(text) to authenticated;
