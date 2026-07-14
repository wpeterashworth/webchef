-- WebChef — Row Level Security.
--
-- The app is a browser-only SvelteKit SPA: it talks to Supabase directly with
-- the anon key, and there is no backend to check permissions. So these policies
-- ARE the authorization model — whatever they allow, a user can do.
--
-- Two kinds of tables:
--   * Course content (units, lessons, steps, recipes) — same rows for everyone,
--     read-only from the browser. Seeding happens through migrations, which run
--     as a privileged role and bypass RLS entirely.
--   * Per-user data (users, user_progress) — each person sees and edits only
--     their own rows.
--
-- Two independent locks are used together, because they stop different things:
--   * GRANT/REVOKE decides whether a role may touch the table at all.
--   * RLS policies decide which rows it sees once it is allowed in.
-- A table with RLS on but no policy for an action denies that action outright.

-- ---------------------------------------------------------------------------
-- Step 1: turn RLS on everywhere.
-- ---------------------------------------------------------------------------
alter table units         enable row level security;
alter table lessons       enable row level security;
alter table steps         enable row level security;
alter table recipes       enable row level security;
alter table users         enable row level security;
alter table user_progress enable row level security;

-- ---------------------------------------------------------------------------
-- Step 2: reset table privileges, then hand back only what is needed.
-- The tables were created before the Data API lock-down default, so anon
-- currently holds INSERT/UPDATE/DELETE on all of them. Strip that first.
-- ---------------------------------------------------------------------------
revoke all on units, lessons, steps, recipes, users, user_progress
  from anon, authenticated;

-- Course content: read-only. Recipes are public; the course itself is not.
grant select on units, lessons, steps to authenticated;
grant select on recipes             to anon, authenticated;

-- Per-user data: a signed-in user creates and maintains their own rows.
-- No DELETE — account removal goes through public.delete_own_account(), and
-- deleting a user cascades to their progress.
grant select, insert, update on users, user_progress to authenticated;

-- ---------------------------------------------------------------------------
-- Step 3: course content policies — read for everyone allowed in, no writes.
-- `using (true)` means every row qualifies; the `to` clause is what limits who
-- is asking. There is deliberately no insert/update/delete policy, so those
-- actions are denied even if a privilege were granted by mistake later.
-- ---------------------------------------------------------------------------
create policy "Units are readable by signed-in users"
  on units for select
  to authenticated
  using (true);

create policy "Lessons are readable by signed-in users"
  on lessons for select
  to authenticated
  using (true);

create policy "Steps are readable by signed-in users"
  on steps for select
  to authenticated
  using (true);

-- Recipes are the one public table: the library is browsable logged out.
create policy "Recipes are readable by anyone"
  on recipes for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- Step 4: users — a person may only ever see or touch their own profile row.
--
-- users.auth_user_id is text holding the Supabase auth id, while auth.uid()
-- returns uuid, hence the cast. auth.uid() is wrapped in a scalar subquery so
-- Postgres evaluates it once per query instead of once per row.
-- ---------------------------------------------------------------------------
create policy "Users can read their own profile"
  on users for select
  to authenticated
  using (auth_user_id = (select auth.uid())::text);

-- with check guards the incoming row: you cannot create a profile pointing at
-- somebody else's auth id.
create policy "Users can create their own profile"
  on users for insert
  to authenticated
  with check (auth_user_id = (select auth.uid())::text);

-- update needs both: `using` picks which rows you may edit, `with check`
-- validates the result — without it you could hand your row to another user.
create policy "Users can update their own profile"
  on users for update
  to authenticated
  using (auth_user_id = (select auth.uid())::text)
  with check (auth_user_id = (select auth.uid())::text);

-- ---------------------------------------------------------------------------
-- Step 5: user_progress — same idea, one hop further out.
--
-- user_progress.user_id references users.id (the app's own uuid), not the auth
-- id, so each policy looks up which users row belongs to the caller. That
-- subquery is safe: it reads users, which is itself protected by the policies
-- above, and auth_user_id is unique so it yields at most one id.
-- ---------------------------------------------------------------------------
create policy "Users can read their own progress"
  on user_progress for select
  to authenticated
  using (
    user_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );

create policy "Users can record their own progress"
  on user_progress for insert
  to authenticated
  with check (
    user_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );

create policy "Users can update their own progress"
  on user_progress for update
  to authenticated
  using (
    user_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  )
  with check (
    user_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );
