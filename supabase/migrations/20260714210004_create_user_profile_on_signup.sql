-- WebChef — give every account a row in public.users.
--
-- Signing up only creates a row in Supabase's internal auth.users. Nothing ever
-- created the matching public.users profile, which means `user_progress` could
-- not be written at all: every one of its RLS policies resolves the caller with
--
--   user_id = (select id from users where auth_user_id = auth.uid()::text)
--
-- and with no profile row that subquery is NULL, so the check always failed.
-- This migration closes that gap for new signups (trigger) and for the accounts
-- that already exist (backfill at the bottom).

-- ---------------------------------------------------------------------------
-- users.username is `not null unique`, so we cannot just use the person's first
-- name — two Peters would collide and the second signup would fail. Walk a
-- counter until we find a free name: peter, peter1, peter2...
-- ---------------------------------------------------------------------------
create or replace function public.unique_username(base text)
  returns text
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  root      text := coalesce(nullif(trim(base), ''), 'chef');
  candidate text := root;
  suffix    integer := 0;
begin
  while exists (select 1 from public.users where username = candidate) loop
    suffix := suffix + 1;
    candidate := root || suffix::text;
  end loop;

  return candidate;
end;
$$;

-- ---------------------------------------------------------------------------
-- Runs as the table owner (security definer) because the signing-up user has no
-- session yet at insert time — and auth.users is not writable from the browser
-- anyway. `on conflict do nothing` keeps a re-fired trigger harmless.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
  returns trigger
  language plpgsql
  security definer
  set search_path = ''
as $$
begin
  insert into public.users (auth_user_id, username, email)
  values (
    new.id::text,
    public.unique_username(
      -- signup stashes the first name here; fall back to the email local part
      coalesce(
        nullif(new.raw_user_meta_data ->> 'first_name', ''),
        split_part(new.email, '@', 1)
      )
    ),
    new.email
  )
  on conflict (auth_user_id) do nothing;

  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- These are internal plumbing — nothing in the browser should ever call them.
revoke all on function public.unique_username(text) from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Backfill: accounts created before this trigger existed have no profile row.
-- Looped rather than a set-based insert because unique_username() has to see
-- each row it just wrote in order to avoid handing out the same name twice.
-- ---------------------------------------------------------------------------
do $$
declare
  account record;
begin
  for account in
    select a.id, a.email, a.raw_user_meta_data
    from auth.users a
    where not exists (
      select 1 from public.users u where u.auth_user_id = a.id::text
    )
  loop
    insert into public.users (auth_user_id, username, email)
    values (
      account.id::text,
      public.unique_username(
        coalesce(
          nullif(account.raw_user_meta_data ->> 'first_name', ''),
          split_part(account.email, '@', 1)
        )
      ),
      account.email
    )
    on conflict (auth_user_id) do nothing;
  end loop;
end;
$$;
