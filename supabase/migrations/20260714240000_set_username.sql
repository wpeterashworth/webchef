-- Let signed-in users pick a leaderboard display name. Uniqueness is checked
-- case-insensitively. Signup can also request a username via auth metadata.

create or replace function public.set_username(p_username text)
  returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_user_id uuid;
  v_clean text;
  v_current text;
begin
  v_clean := trim(p_username);

  if v_clean = '' then
    raise exception 'Username cannot be empty';
  end if;

  if char_length(v_clean) > 30 then
    raise exception 'Username must be 30 characters or fewer';
  end if;

  select id, username
  into v_user_id, v_current
  from public.users
  where auth_user_id = (select auth.uid())::text;

  if v_user_id is null then
    raise exception 'No profile row for the signed-in user';
  end if;

  if lower(v_clean) = lower(v_current) then
    return jsonb_build_object('username', v_current);
  end if;

  if exists (
    select 1
    from public.users
    where lower(username) = lower(v_clean)
      and id <> v_user_id
  ) then
    raise exception 'That username is already taken';
  end if;

  update public.users
  set username = v_clean
  where id = v_user_id;

  return jsonb_build_object('username', v_clean);
end;
$$;

revoke all on function public.set_username(text) from public, anon;
grant execute on function public.set_username(text) to authenticated;

-- Honour a requested username at signup when it is still available.
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_requested text;
  v_username text;
begin
  v_requested := nullif(trim(new.raw_user_meta_data ->> 'username'), '');

  if v_requested is not null
    and char_length(v_requested) <= 30
    and not exists (
      select 1
      from public.users
      where lower(username) = lower(v_requested)
    )
  then
    v_username := v_requested;
  else
    v_username := public.unique_username(
      coalesce(
        nullif(new.raw_user_meta_data ->> 'first_name', ''),
        split_part(new.email, '@', 1)
      )
    );
  end if;

  insert into public.users (auth_user_id, username, email)
  values (new.id::text, v_username, new.email)
  on conflict (auth_user_id) do nothing;

  return new;
end;
$$;
