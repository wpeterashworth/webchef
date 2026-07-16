-- User-created lessons: personal at level 1+, public sharing at level 20+.
-- Content JSON matches the client quiz shape (sections with questions).

create table user_lessons (
  id          uuid primary key default gen_random_uuid(),
  slug        text not null unique,
  author_id   uuid not null references users (id) on delete cascade,
  title       text not null check (char_length(trim(title)) > 0),
  description text not null default '',
  content     jsonb not null,
  is_public   boolean not null default false,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  check (slug ~ '^custom-[0-9a-f-]{36}$')
);

create index user_lessons_author_id_idx on user_lessons (author_id);
create index user_lessons_public_idx on user_lessons (is_public) where is_public = true;

alter table user_lessons enable row level security;

grant select, insert, update, delete on user_lessons to authenticated;

create policy "Authors and public readers can view user lessons"
  on user_lessons for select
  to authenticated
  using (
    is_public = true
    or author_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );

create policy "Authors can create user lessons"
  on user_lessons for insert
  to authenticated
  with check (
    author_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );

create policy "Authors can update their user lessons"
  on user_lessons for update
  to authenticated
  using (
    author_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  )
  with check (
    author_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );

create policy "Authors can delete their user lessons"
  on user_lessons for delete
  to authenticated
  using (
    author_id = (
      select id from users
      where auth_user_id = (select auth.uid())::text
    )
  );

-- Level 1 unlocks personal lesson creation (was level 20 in point-system.txt).
update levels
set unlocks = '{leaderboard,create_lessons}'
where level_number = 1;

update levels
set unlocks = '{share_lessons}'
where level_number = 20;

create or replace function public.validate_user_lesson_content(p_content jsonb)
  returns boolean
  language plpgsql
  immutable
  set search_path = ''
as $$
declare
  section jsonb;
  question jsonb;
  option_count integer;
begin
  if jsonb_typeof(p_content -> 'sections') <> 'array' then
    return false;
  end if;

  if jsonb_array_length(p_content -> 'sections') < 1 then
    return false;
  end if;

  for section in select * from jsonb_array_elements(p_content -> 'sections')
  loop
    if jsonb_typeof(section -> 'questions') <> 'array' then
      return false;
    end if;

    if jsonb_array_length(section -> 'questions') < 1 then
      return false;
    end if;

    for question in select * from jsonb_array_elements(section -> 'questions')
    loop
      if coalesce(trim(question ->> 'question'), '') = '' then
        return false;
      end if;

      if jsonb_typeof(question -> 'options') <> 'array' then
        return false;
      end if;

      option_count := jsonb_array_length(question -> 'options');
      if option_count < 2 then
        return false;
      end if;

      if coalesce((question ->> 'correct_index')::integer, -1) < 0
        or (question ->> 'correct_index')::integer >= option_count
      then
        return false;
      end if;
    end loop;
  end loop;

  return true;
end;
$$;

create or replace function public.create_user_lesson(
  p_title text,
  p_description text,
  p_content jsonb
)
  returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_author_id uuid;
  v_level integer;
  v_slug text;
  v_row public.user_lessons%rowtype;
begin
  select id, level_number
  into v_author_id, v_level
  from public.users
  where auth_user_id = (select auth.uid())::text;

  if v_author_id is null then
    raise exception 'No profile row for the signed-in user';
  end if;

  if v_level < 1 then
    raise exception 'Reach level 1 to create personal lessons';
  end if;

  if not public.validate_user_lesson_content(p_content) then
    raise exception 'Lesson must include at least one question with two or more options';
  end if;

  v_slug := 'custom-' || gen_random_uuid()::text;

  insert into public.user_lessons (slug, author_id, title, description, content)
  values (v_slug, v_author_id, trim(p_title), coalesce(p_description, ''), p_content)
  returning * into v_row;

  return jsonb_build_object(
    'slug', v_row.slug,
    'title', v_row.title,
    'description', v_row.description,
    'content', v_row.content,
    'is_public', v_row.is_public,
    'created_at', v_row.created_at
  );
end;
$$;

create or replace function public.update_user_lesson(
  p_slug text,
  p_title text,
  p_description text,
  p_content jsonb
)
  returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_author_id uuid;
  v_row public.user_lessons%rowtype;
begin
  select id into v_author_id
  from public.users
  where auth_user_id = (select auth.uid())::text;

  if v_author_id is null then
    raise exception 'No profile row for the signed-in user';
  end if;

  if not public.validate_user_lesson_content(p_content) then
    raise exception 'Lesson must include at least one question with two or more options';
  end if;

  update public.user_lessons
  set
    title = trim(p_title),
    description = coalesce(p_description, ''),
    content = p_content,
    updated_at = now()
  where slug = p_slug
    and author_id = v_author_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Lesson not found or you do not own it';
  end if;

  return jsonb_build_object(
    'slug', v_row.slug,
    'title', v_row.title,
    'description', v_row.description,
    'content', v_row.content,
    'is_public', v_row.is_public,
    'updated_at', v_row.updated_at
  );
end;
$$;

create or replace function public.set_user_lesson_visibility(
  p_slug text,
  p_is_public boolean
)
  returns jsonb
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_author_id uuid;
  v_level integer;
  v_row public.user_lessons%rowtype;
begin
  select id, level_number
  into v_author_id, v_level
  from public.users
  where auth_user_id = (select auth.uid())::text;

  if v_author_id is null then
    raise exception 'No profile row for the signed-in user';
  end if;

  if p_is_public and v_level < 20 then
    raise exception 'Reach level 20 to share lessons publicly';
  end if;

  update public.user_lessons
  set
    is_public = p_is_public,
    updated_at = now()
  where slug = p_slug
    and author_id = v_author_id
  returning * into v_row;

  if v_row.id is null then
    raise exception 'Lesson not found or you do not own it';
  end if;

  return jsonb_build_object(
    'slug', v_row.slug,
    'is_public', v_row.is_public
  );
end;
$$;

create or replace function public.delete_user_lesson(p_slug text)
  returns void
  language plpgsql
  security definer
  set search_path = ''
as $$
declare
  v_author_id uuid;
begin
  select id into v_author_id
  from public.users
  where auth_user_id = (select auth.uid())::text;

  if v_author_id is null then
    raise exception 'No profile row for the signed-in user';
  end if;

  delete from public.user_lessons
  where slug = p_slug
    and author_id = v_author_id;

  if not found then
    raise exception 'Lesson not found or you do not own it';
  end if;
end;
$$;

revoke all on function public.validate_user_lesson_content(jsonb) from public, anon, authenticated;
revoke all on function public.create_user_lesson(text, text, jsonb) from public, anon;
revoke all on function public.update_user_lesson(text, text, text, jsonb) from public, anon;
revoke all on function public.set_user_lesson_visibility(text, boolean) from public, anon;
revoke all on function public.delete_user_lesson(text) from public, anon;

grant execute on function public.create_user_lesson(text, text, jsonb) to authenticated;
grant execute on function public.update_user_lesson(text, text, text, jsonb) to authenticated;
grant execute on function public.set_user_lesson_visibility(text, boolean) to authenticated;
grant execute on function public.delete_user_lesson(text) to authenticated;
