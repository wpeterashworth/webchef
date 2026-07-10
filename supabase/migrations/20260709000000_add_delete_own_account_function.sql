-- WebChef — let a logged-in user delete their own account.
--
-- Removing the actual login lives in Supabase's internal `auth.users` table,
-- which the browser's anon/authenticated key cannot touch directly. This
-- function runs with `security definer` (i.e. with the privileges of the
-- role that owns it) so it *can* reach `auth.users` — but `auth.uid()` pins
-- every call to the caller's own row, so a user can only ever delete
-- themselves, never anyone else.

create or replace function public.delete_own_account()
  returns void
  language plpgsql
  security definer
  set search_path = ''      -- avoid search_path hijacking in a definer function
as $$
begin
  -- Remove the app-level profile row first, if one exists (no-op otherwise).
  -- Stored as text, so cast the uuid from auth.uid() to match.
  delete from public.users where auth_user_id = auth.uid()::text;

  -- Remove the login itself.
  delete from auth.users where id = auth.uid();
end;
$$;

-- Only signed-in users may call this; deny anon/public outright.
revoke all on function public.delete_own_account() from public, anon;
grant execute on function public.delete_own_account() to authenticated;
