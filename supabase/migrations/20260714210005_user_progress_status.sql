-- WebChef — track lesson status: to-do, in progress, completed.
--
-- Two changes to user_progress:
--
-- 1. `lesson_id uuid references lessons(id)` -> `lesson_slug text`.
--    Lessons are not in the database. They live in client/src/lib/JSON and are
--    keyed by slug ("recipe-adjustment"), so there is no uuid to point a foreign
--    key at — the lessons table is empty. Storing the slug is what actually
--    matches the app. The cost, stated plainly: Postgres cannot verify that a
--    slug names a real lesson. If lessons ever move into the database, this
--    becomes a foreign key again.
--
-- 2. `completed boolean` -> `status text`.
--    A boolean has two states and we need three. A row's existence means the
--    user has engaged with the lesson at all; `status` says how.
--
-- The table is empty (nothing has ever written to it — see the profile-row bug
-- fixed in the previous migration), so these are plain drops, not data rewrites.

alter table user_progress
  drop column lesson_id,          -- takes its FK + the unique(user_id, lesson_id) with it
  drop column completed;

alter table user_progress
  add column lesson_slug text not null,
  add column status      text not null default 'todo'
    check (status in ('todo', 'in_progress', 'completed'));

-- One row per person per lesson: a lesson is on your to-do list, or in progress,
-- or done — never two at once. This also gives the client's upsert something to
-- conflict on.
alter table user_progress
  add constraint user_progress_user_lesson_key unique (user_id, lesson_slug);

-- The dashboard reads "all of my progress", so the useful index is on the owner.
create index if not exists user_progress_user_id_status_idx
  on user_progress (user_id, status);

-- ---------------------------------------------------------------------------
-- Removing a lesson from your to-do list means deleting the row — there is no
-- "untracked" status, and inventing one would just be a tombstone. The original
-- RLS migration granted no DELETE anywhere; this opens it for user_progress
-- only, and the policy still pins it to the caller's own rows.
-- ---------------------------------------------------------------------------
grant delete on user_progress to authenticated;

create policy "Users can delete their own progress"
  on user_progress for delete
  to authenticated
  using (
    user_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );
