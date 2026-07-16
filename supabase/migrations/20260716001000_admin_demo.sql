-- Demo admin support: a lightweight role flag plus one admin-only dashboard RPC.

alter table public.users
  add column if not exists is_admin boolean not null default false;

create or replace function public.get_admin_dashboard()
  returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_is_admin boolean := false;
begin
  select u.is_admin
  into v_is_admin
  from public.users u
  where u.auth_user_id = (select auth.uid())::text;

  if coalesce(v_is_admin, false) is not true then
    raise exception 'Admin access required';
  end if;

  return jsonb_build_object(
    'counts', jsonb_build_object(
      'users', (select count(*) from public.users),
      'course_lessons', (select count(*) from public.lessons),
      'community_lessons', (select count(*) from public.user_lessons),
      'recipes', (select count(*) from public.recipes),
      'completed_runs', (
        select count(*)
        from public.user_progress
        where completed = true
      )
    ),
    'recent_users', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'username', recent.username,
          'email', recent.email,
          'joined_at', recent.created_at,
          'xp', recent.xp,
          'level_number', recent.level_number,
          'is_admin', recent.is_admin
        )
        order by recent.created_at desc
      )
      from (
        select username, email, created_at, xp, level_number, is_admin
        from public.users
        order by created_at desc
        limit 5
      ) as recent
    ), '[]'::jsonb),
    'top_cooks', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'username', top_users.username,
          'xp', top_users.xp,
          'level_number', top_users.level_number,
          'level_title', top_users.level_title
        )
        order by top_users.xp desc, top_users.created_at asc
      )
      from (
        select username, xp, level_number, level_title, created_at
        from public.users
        order by xp desc, created_at asc
        limit 5
      ) as top_users
    ), '[]'::jsonb),
    'generated_at', now()
  );
end;
$$;

revoke all on function public.get_admin_dashboard() from public, anon;
grant execute on function public.get_admin_dashboard() to authenticated;

-- Promote your demo account manually in Supabase SQL after running migrations:
-- update public.users set is_admin = true where email = 'you@example.com';