import { error } from "@sveltejs/kit";
import { getAllLessonIds, getLessonById } from "$lib/javascript/lessons.js";

export function load({ params }) {
  const lesson = getLessonById(params.lessonId);

  if (!lesson) {
    error(404, `Lesson "${params.lessonId}" was not found`);
  }

  return { lesson };
}

/** Prerender exactly the 4 top-level lesson routes. */
export function entries() {
  return getAllLessonIds().map((lessonId) => ({ lessonId }));
}
