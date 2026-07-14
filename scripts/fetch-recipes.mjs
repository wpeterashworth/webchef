// Fetch recipes from Spoonacular ONCE and write them into a seed migration.
//
// This is a build-time / developer script — it never ships to the browser and
// it is not part of the app. The app itself has no server (adapter-static), so
// there is nowhere safe to keep an API key at runtime; instead we pull the
// recipes here, commit the resulting SQL, and from then on the app just reads
// the `recipes` table through Supabase like any other content.
//
// Usage — reads SPOONACULAR_API_KEY from the gitignored root .env:
//   node --env-file=.env scripts/fetch-recipes.mjs
//
// Then apply the generated migration:
//   pnpm supabase db push
//
// Re-running is safe and deterministic: the generated seed clears the imported
// recipes and re-inserts the current set, so the library always matches what
// this script last fetched. Hand-written recipes (no spoonacular_id) survive.

import { readdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const API_KEY = process.env.SPOONACULAR_API_KEY;
const MIGRATIONS_DIR = join(import.meta.dirname, "..", "supabase", "migrations");

// Recipes fetched per query. Each query is one API request, so the total cost is
// roughly (CUISINES + MEAL_TYPES) requests — keep an eye on the free-tier quota.
const PER_QUERY = 5;

// We search cuisine by cuisine rather than just grabbing the most popular
// recipes overall, because Spoonacular's `cuisines` field is frequently empty
// on popular recipes — searching *by* cuisine is what guarantees the tag is set.
const CUISINES = [
  "Italian",
  "Mexican",
  "Chinese",
  "Indian",
  "French",
  "Mediterranean",
  "American",
  "Thai",
];

// Same idea for meals: searching by `type` guarantees the dishTypes tag we
// normalize below. These are Spoonacular's vocabulary, not ours.
const MEAL_TYPES = ["breakfast", "main course", "dessert", "appetizer", "snack"];

// Spoonacular's dishTypes mix meal times with course names. Map them onto the
// small, stable vocabulary the filter UI actually offers. Anything unmapped
// (e.g. "antipasti") is simply dropped rather than shown to a learner.
const MEAL_FROM_DISH_TYPE = {
  breakfast: "breakfast",
  "morning meal": "breakfast",
  brunch: "breakfast",
  lunch: "lunch",
  "main course": "dinner",
  "main dish": "dinner",
  dinner: "dinner",
  dessert: "dessert",
  snack: "snack",
  appetizer: "snack",
  fingerfood: "snack",
  "side dish": "snack",
};

if (!API_KEY) {
  console.error(
    "SPOONACULAR_API_KEY is not set.\n" +
      "Add it to the root .env, then run:\n" +
      "  node --env-file=.env scripts/fetch-recipes.mjs",
  );
  process.exit(1);
}

/** Spoonacular summaries are HTML ("a <b>hearty</b> stew..."); the app renders text. */
function stripHtml(html) {
  return (html ?? "")
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Trim a summary down to the first couple of sentences — the cards are small. */
function toDescription(html) {
  const text = stripHtml(html);
  const sentences = text.match(/[^.!?]+[.!?]+/g) ?? [text];
  return sentences.slice(0, 2).join(" ").trim();
}

/** Escape a value for a single-quoted SQL literal, or emit NULL. */
function sql(value) {
  if (value === null || value === undefined || value === "") return "null";
  return `'${String(value).replace(/'/g, "''")}'`;
}

/** Same, but for a JSON column — Postgres needs the ::jsonb cast. */
function sqlJson(value) {
  return `${sql(JSON.stringify(value))}::jsonb`;
}

/** A Postgres text[] literal: array['a','b']::text[], or '{}'::text[] if empty. */
function sqlArray(values) {
  if (values.length === 0) return "'{}'::text[]";
  return `array[${values.map(sql).join(", ")}]::text[]`;
}

/** Spoonacular dishTypes -> our meal vocabulary, deduped. */
function toMeals(dishTypes = []) {
  const meals = dishTypes
    .map((type) => MEAL_FROM_DISH_TYPE[type.toLowerCase()])
    .filter(Boolean);

  return [...new Set(meals)];
}

function toRow(recipe) {
  // `fillIngredients=true` gives us structured amounts; keep the original
  // display string too ("2 cups flour") since that is what a cook reads.
  const ingredients = (recipe.extendedIngredients ?? []).map((item) => ({
    name: item.nameClean ?? item.name,
    amount: item.measures?.us?.amount ?? item.amount,
    unit: item.measures?.us?.unitShort ?? item.unit,
    original: item.original,
  }));

  // Instructions come back grouped; flatten to a plain ordered list of steps.
  const instructions = (recipe.analyzedInstructions ?? [])
    .flatMap((group) => group.steps ?? [])
    .map((step) => step.step)
    .filter(Boolean);

  return {
    spoonacular_id: recipe.id,
    title: recipe.title,
    description: toDescription(recipe.summary),
    image_url: recipe.image ?? null,
    source_url: recipe.sourceUrl ?? null,
    ready_in_minutes: recipe.readyInMinutes ?? null,
    servings: recipe.servings ?? null,
    cuisines: recipe.cuisines ?? [],
    meals: toMeals(recipe.dishTypes),
    ingredients,
    instructions,
  };
}

function toMigration(rows) {
  const values = rows
    .map(
      (row) =>
        "  (" +
        [
          row.spoonacular_id,
          sql(row.title),
          sql(row.description),
          sql(row.image_url),
          sql(row.source_url),
          row.ready_in_minutes ?? "null",
          row.servings ?? "null",
          sqlArray(row.cuisines),
          sqlArray(row.meals),
          sqlJson(row.ingredients),
          sqlJson(row.instructions),
        ].join(", ") +
        ")",
    )
    .join(",\n");

  return `-- WebChef — seed the recipe library.
--
-- Generated by scripts/fetch-recipes.mjs from the Spoonacular API. Do not edit
-- by hand: re-run the script to regenerate. Migrations run as a privileged role
-- and bypass RLS, which is exactly how course content is meant to be seeded.
--
-- Clears the previously imported recipes first so the library always matches the
-- current fetch exactly (an earlier import may have included recipes this one
-- doesn't). Recipes written by hand have no spoonacular_id and are left alone.
-- Nothing references recipes, so removing rows is safe.

delete from recipes where spoonacular_id is not null;

insert into recipes (
  spoonacular_id, title, description, image_url, source_url,
  ready_in_minutes, servings, cuisines, meals, ingredients, instructions
) values
${values};
`;
}

/**
 * YYYYMMDDHHMMSS — the timestamp format the Supabase CLI orders migrations by.
 *
 * Uses the current time, but never a value that would sort *before* a migration
 * already in the folder: Supabase rejects a push whose local file belongs
 * earlier than the last migration applied to the remote database. A hand-written
 * migration dated slightly in the future would otherwise strand this seed.
 */
async function migrationTimestamp() {
  const now = new Date().toISOString().replace(/\D/g, "").slice(0, 14);

  const existing = (await readdir(MIGRATIONS_DIR))
    .filter((name) => name.endsWith(".sql"))
    .map((name) => name.slice(0, 14))
    .filter((stamp) => /^\d{14}$/.test(stamp))
    .sort();

  const latest = existing.at(-1);

  return !latest || now > latest ? now : String(BigInt(latest) + 1n);
}

/** One complexSearch call. `filter` is e.g. { cuisine: "Thai" } or { type: "snack" }. */
async function search(filter) {
  const params = new URLSearchParams({
    apiKey: API_KEY,
    number: String(PER_QUERY),
    addRecipeInformation: "true", // summary, readyInMinutes, cuisines, dishTypes
    fillIngredients: "true", // extendedIngredients with structured amounts
    instructionsRequired: "true", // skip recipes we couldn't teach from
    sort: "popularity",
    ...filter,
  });

  const response = await fetch(
    `https://api.spoonacular.com/recipes/complexSearch?${params}`,
  );

  if (!response.ok) {
    const hint =
      response.status === 402
        ? " — daily free-tier quota is spent; try again tomorrow"
        : response.status === 401
          ? " — check SPOONACULAR_API_KEY in .env"
          : "";

    throw new Error(
      `Spoonacular returned ${response.status} ${response.statusText}${hint}\n` +
        (await response.text()),
    );
  }

  const { results = [] } = await response.json();
  return results;
}

const queries = [
  ...CUISINES.map((cuisine) => ({ cuisine })),
  ...MEAL_TYPES.map((type) => ({ type })),
];

console.log(`Fetching recipes across ${queries.length} queries...`);

// Sequential rather than parallel: the free tier rate-limits concurrent calls,
// and this runs once in a while, so there is nothing to gain from racing.
const byId = new Map();

for (const query of queries) {
  const label = query.cuisine ?? query.type;

  try {
    const results = await search(query);
    // The same recipe legitimately shows up under several queries — first write
    // wins, and the tags come from the recipe itself, not the query, so it does
    // not matter which query found it.
    for (const recipe of results) byId.set(recipe.id, recipe);

    console.log(`  ${label.padEnd(14)} ${results.length} recipes`);
  } catch (error) {
    console.error(`\n${error.message}`);
    process.exit(1);
  }
}

// A recipe with no steps can't drive a library page or a lesson; drop it.
const rows = [...byId.values()]
  .map(toRow)
  .filter((row) => row.instructions.length > 0);

if (rows.length === 0) {
  console.error("No usable recipes returned — nothing to seed.");
  process.exit(1);
}

rows.sort((a, b) => a.title.localeCompare(b.title));

const filePath = join(
  MIGRATIONS_DIR,
  `${await migrationTimestamp()}_seed_recipes.sql`,
);
await writeFile(filePath, toMigration(rows), "utf8");

const tagged = (key) => rows.filter((row) => row[key].length > 0).length;

console.log(
  `\nWrote ${rows.length} unique recipes to:\n  ${filePath}\n\n` +
    `  ${tagged("cuisines")}/${rows.length} have a cuisine tag\n` +
    `  ${tagged("meals")}/${rows.length} have a meal tag\n\n` +
    "Review the SQL, then apply it with:  pnpm supabase db push",
);
