-- WebChef — create payload-based lesson ingest function.
--
-- This keeps migrations schema-focused while allowing content ingest from
-- supabase/seed/lessons_seed_payload.json via a lightweight script.

begin;

create or replace function public.ingest_lessons_payload(payload jsonb)
returns void
language plpgsql
set search_path = public
as $$
declare
  dataset_row jsonb;
  skill_row jsonb;
  mini_row jsonb;
  question_row jsonb;
  resolved_category_id uuid;
  resolved_skill_id uuid;
  resolved_mini_lesson_id uuid;
begin
  if payload is null then
    raise exception 'Payload cannot be null';
  end if;

  if jsonb_typeof(payload->'dataset') <> 'array' then
    raise exception 'Payload must include dataset array';
  end if;

  for dataset_row in
    select value from jsonb_array_elements(payload->'dataset')
  loop
    insert into public.easy_mode_categories (name, sort_order)
    values (
      dataset_row->>'categoryName',
      coalesce((dataset_row->>'categorySort')::int, 1)
    )
    on conflict (name) do update
      set sort_order = excluded.sort_order;

    select id into resolved_category_id
    from public.easy_mode_categories
    where name = dataset_row->>'categoryName';

    for skill_row in
      select value from jsonb_array_elements(coalesce(dataset_row->'skills', '[]'::jsonb))
    loop
      insert into public.easy_mode_skills (category_id, name, mode, sort_order)
      values (
        resolved_category_id,
        skill_row->>'name',
        dataset_row->>'mode',
        coalesce((skill_row->>'sort')::int, 1)
      )
      on conflict (category_id, name, mode) do update
        set sort_order = excluded.sort_order,
            mode = excluded.mode;

      select id into resolved_skill_id
      from public.easy_mode_skills
      where category_id = resolved_category_id
        and name = skill_row->>'name'
        and mode = dataset_row->>'mode'
      limit 1;

      for mini_row in
        select value from jsonb_array_elements(coalesce(skill_row->'miniLessons', '[]'::jsonb))
      loop
        insert into public.easy_mode_mini_lessons (skill_id, title, lesson_text, sort_order)
        values (
          resolved_skill_id,
          mini_row->>'title',
          mini_row->>'lessonText',
          coalesce((mini_row->>'sort')::int, 1)
        )
        on conflict (skill_id, sort_order) do update
          set title = excluded.title,
              lesson_text = excluded.lesson_text;

        select id into resolved_mini_lesson_id
        from public.easy_mode_mini_lessons
        where skill_id = resolved_skill_id
          and sort_order = coalesce((mini_row->>'sort')::int, 1)
        limit 1;

        for question_row in
          select value from jsonb_array_elements(coalesce(mini_row->'questions', '[]'::jsonb))
        loop
          insert into public.easy_mode_questions (
            mini_lesson_id,
            prompt,
            choices,
            correct_answer,
            feedback,
            sort_order
          )
          values (
            resolved_mini_lesson_id,
            question_row->>'prompt',
            coalesce(question_row->'choices', '[]'::jsonb),
            upper(coalesce(question_row->>'correctAnswer', 'A')),
            coalesce(question_row->>'feedback', ''),
            coalesce((question_row->>'sort')::int, 1)
          )
          on conflict (mini_lesson_id, sort_order) do update
            set prompt = excluded.prompt,
                choices = excluded.choices,
                correct_answer = excluded.correct_answer,
                feedback = excluded.feedback;
        end loop;
      end loop;
    end loop;
  end loop;
end;
$$;

revoke all on function public.ingest_lessons_payload(jsonb) from public, anon;

commit;
