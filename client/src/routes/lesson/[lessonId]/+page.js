import { error } from "@sveltejs/kit";
import { getAllLessonIds, getLessonById } from "$lib/javascript/lessons.js";
import { isUserLessonSlug } from "$lib/javascript/user-lessons.js";

export function load({ params }) {
  const lesson = getLessonById(params.lessonId);

  if (lesson) {
    return { lesson, needsFetch: false, lessonId: params.lessonId };
  }

  if (isUserLessonSlug(params.lessonId)) {
    return { lesson: null, needsFetch: true, lessonId: params.lessonId };
  }

  error(404, `Lesson "${params.lessonId}" was not found`);
}

/** Prerender exactly the 4 built-in lesson routes. */
export function entries() {
  return getAllLessonIds().map((lessonId) => ({ lessonId }));
}
