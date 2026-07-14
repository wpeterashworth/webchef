-- WebChef — tag recipes with cuisine and meal so the library can be filtered.
--
-- Both are arrays because a recipe legitimately has more than one of each: a
-- dish can be tagged both "lunch" and "dinner", and Spoonacular sometimes
-- returns several cuisines for one recipe ("Mediterranean" + "Italian").
--
-- `meals` holds our own normalized vocabulary (breakfast / lunch / dinner /
-- dessert / snack), mapped from Spoonacular's messier `dishTypes` list, which
-- mixes meal times with course names ("main course", "morning meal", "antipasti").
-- Normalizing on import keeps the filter UI simple and stable.
--
-- Empty arrays rather than null: an untagged recipe has *no* tags, which is a
-- fact, not missing information — and it keeps the containment queries below
-- from needing null checks.

alter table recipes
  add column cuisines text[] not null default '{}',
  add column meals    text[] not null default '{}';

-- GIN indexes support the containment operator (@>) that the filters use --
-- i.e. "recipes whose meals array contains 'breakfast'". A plain btree index
-- cannot answer that; it would force a sequential scan of the whole table.
create index recipes_cuisines_idx on recipes using gin (cuisines);
create index recipes_meals_idx    on recipes using gin (meals);
