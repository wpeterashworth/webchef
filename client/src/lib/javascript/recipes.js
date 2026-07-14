// Recipe library data access.
//
// Unlike lessons (which live in $lib/JSON and are bundled at build time),
// recipes live in the `recipes` table and are fetched at runtime. The table is
// public-readable by both anon and authenticated users, so the library works
// logged out — see the RLS migration.

import { supabase } from "$lib/supabase/client.js";

// Everything the cards need; the heavy jsonb columns are left out so the list
// query stays small. The detail page asks for them separately.
const CARD_FIELDS =
  "id, title, description, image_url, ready_in_minutes, servings, cuisines, meals";

// The meal filter's options and their order. Fixed rather than derived from the
// data so the UI doesn't reshuffle when the recipe set changes — and so it reads
// in the order a day actually happens.
export const MEALS = ["breakfast", "lunch", "dinner", "snack", "dessert"];

/**
 * Recipes, newest filters applied, alphabetical.
 *
 * `cuisine` and `meal` are optional; passing neither returns everything. Both
 * columns are text[], so we ask Postgres for rows whose array *contains* the
 * value — a recipe tagged ["lunch","dinner"] matches a filter of "dinner".
 */
export async function getRecipes({ cuisine = null, meal = null } = {}) {
  let query = supabase.from("recipes").select(CARD_FIELDS);

  if (cuisine) query = query.contains("cuisines", [cuisine]);
  if (meal) query = query.contains("meals", [meal]);

  const { data, error } = await query.order("title");

  if (error) throw new Error(`Could not load recipes: ${error.message}`);

  return data ?? [];
}

/**
 * The cuisines actually present in the library, alphabetical.
 *
 * Derived from the data instead of hard-coded: the import decides which cuisines
 * exist, and offering a filter that returns nothing is worse than omitting it.
 */
export async function getCuisines() {
  const { data, error } = await supabase.from("recipes").select("cuisines");

  if (error) throw new Error(`Could not load cuisines: ${error.message}`);

  const cuisines = new Set((data ?? []).flatMap((row) => row.cuisines ?? []));

  return [...cuisines].sort();
}

/** One full recipe, including ingredients + instructions. Null if not found. */
export async function getRecipeById(id) {
  const { data, error } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .maybeSingle(); // no row => null, rather than an error

  if (error) throw new Error(`Could not load recipe: ${error.message}`);

  return data;
}

/** Recipes unlocked by finishing a given lesson. */
export async function getRecipesForLesson(lessonId) {
  const { data, error } = await supabase
    .from("recipes")
    .select(CARD_FIELDS)
    .eq("lesson_id", lessonId)
    .order("title");

  if (error) throw new Error(`Could not load recipes: ${error.message}`);

  return data ?? [];
}

/** "1h 20m" / "35m" — readyInMinutes is stored raw. */
export function formatMinutes(minutes) {
  if (!minutes) return null;
  if (minutes < 60) return `${minutes}m`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  return rest === 0 ? `${hours}h` : `${hours}h ${rest}m`;
}
