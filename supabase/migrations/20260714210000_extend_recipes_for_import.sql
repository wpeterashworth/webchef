-- WebChef — extend `recipes` so it can hold imported recipe data.
--
-- The initial schema covered the fields a hand-written recipe needs (title,
-- description, ingredients, instructions). Recipes imported from an external
-- source also carry a photo, timing, serving count, and a link back to the
-- original — and we need a stable key to dedupe against so re-running the
-- import updates rows instead of duplicating them.
--
-- `spoonacular_id` is that key: it is the upstream recipe id, nullable so
-- hand-written recipes (which have no upstream row) are still allowed, and
-- unique so `on conflict` can target it during seeding.

alter table recipes
  add column spoonacular_id    integer unique,
  add column image_url         text,
  add column source_url        text,
  add column ready_in_minutes  integer check (ready_in_minutes > 0),
  add column servings          integer check (servings > 0);

-- Recipes are browsed newest-first / alphabetically in the library; the seed
-- import also looks rows up by their upstream id, which the unique constraint
-- above already indexes.
create index recipes_title_idx on recipes (title);
