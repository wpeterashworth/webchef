import { error } from "@sveltejs/kit";
import {
  getAllLessonIds,
  isBuiltInLessonId,
} from "$lib/javascript/lessons.js";
import { isUserLessonSlug } from "$lib/javascript/user-lessons.js";

export function load({ params }) {
  if (isBuiltInLessonId(params.lessonId)) {
    return {
      lesson: null,
      lessonType: "built-in",
      needsFetch: true,
      lessonId: params.lessonId,
    };
  }

  if (isUserLessonSlug(params.lessonId)) {
    return {
      lesson: null,
      lessonType: "user",
      needsFetch: true,
      lessonId: params.lessonId,
    };
  }

  error(404, `Lesson "${params.lessonId}" was not found`);
}

/** Prerender exactly the 4 built-in lesson routes. */
export function entries() {
  return getAllLessonIds().map((lessonId) => ({ lessonId }));
}
