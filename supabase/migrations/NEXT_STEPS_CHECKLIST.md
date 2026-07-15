# Next Steps Checklist (Lesson/User Model Rollout)

## Apply Order

1. `20260715090000_lessons_users_models_v2.sql`
2. `20260715090500_lessons_bank_rls.sql`
3. `20260715091500_create_lessons_ingest_function.sql`
4. Build lesson seed payload: `node scripts/generate-lessons-seed-sql.mjs`
5. Ingest payload into DB: `node scripts/ingest-lessons-payload.mjs`
6. (Optional) SQL snapshot seed: `node scripts/generate-lessons-seed-sql.mjs --sql`

## Verification Queries

### 1) Skill modes allowed

```sql
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conname = 'easy_mode_skills_mode_check';
```

### 2) Skill uniqueness includes mode

```sql
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conname = 'easy_mode_skills_category_id_name_mode_key';
```

### 3) Question constraints

```sql
select conname, pg_get_constraintdef(oid)
from pg_constraint
where conname in (
  'easy_mode_questions_choices_len_check',
  'easy_mode_questions_correct_answer_check'
);
```

### 4) RLS enabled on lesson-bank tables

```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename like 'easy_mode_%'
order by tablename;
```

### 5) Policies exist for authenticated read

```sql
select schemaname, tablename, policyname, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename like 'easy_mode_%'
order by tablename, policyname;
```

## Data Ingest Expectations

- easy JSON => rows with `mode = 'easy'`
- medium JSON => rows with `mode = 'medium'`
- hard JSON => rows with `mode = 'hard'`
- mini lesson sort_order should be 1..3 per skill row
- question sort_order should be 1..N per mini lesson row

## Seed Verification Queries

### 1) Skill row totals by mode

```sql
select mode, count(*) as skill_rows
from public.easy_mode_skills
group by mode
order by mode;
```

Expected: `easy=12`, `medium=12`, `hard=12`.

### 2) Mini lesson totals by mode

```sql
select s.mode, count(*) as mini_lessons
from public.easy_mode_mini_lessons ml
join public.easy_mode_skills s on s.id = ml.skill_id
group by s.mode
order by s.mode;
```

Expected: `easy=36`, `medium=36`, `hard=36`.

### 3) Question totals by mode

```sql
select s.mode, count(*) as questions
from public.easy_mode_questions q
join public.easy_mode_mini_lessons ml on ml.id = q.mini_lesson_id
join public.easy_mode_skills s on s.id = ml.skill_id
group by s.mode
order by s.mode;
```

Expected: `easy=36`, `medium=72`, `hard=72`.

## Rollout Note

Keep app reads on JSON until DB ingest verification passes, then move to DB-first + JSON fallback.

## Preferred Seeding Strategy

- Schema-first approach: migrations define structure; content is managed via JSON source files and generated seed payloads.
- Use full SQL seed migration output only when explicitly needed.
