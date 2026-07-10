// Looks up a single lesson by the `lessonId` in the URL. Because the JSON is
// bundled with the app, this runs at build time during prerendering — each
// linked lesson becomes its own static HTML page.
import { error } from "@sveltejs/kit";
import recipeAdjust from "$lib/JSON/RecipeAdjust.json";
import howToCook from "$lib/JSON/Howtocook.json";
import ingredientSub from "$lib/JSON/IngredientSub.json";

const allLessons = [...recipeAdjust, ...howToCook, ...ingredientSub];

export function load({ params }) {
  const lesson = allLessons.find((l) => l.lessonId === params.lessonId);

  if (!lesson) {
    error(404, `Lesson "${params.lessonId}" was not found`);
  }

  return { lesson };
}
