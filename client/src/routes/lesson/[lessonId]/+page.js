import { error } from "@sveltejs/kit";
import {
  getAllBankLessonIds,
  isBankLessonSlug,
} from "$lib/javascript/lesson-bank.js";
import { isUserLessonSlug } from "$lib/javascript/user-lessons.js";

export function load({ params }) {
  if (isBankLessonSlug(params.lessonId)) {
    return { lesson: null, needsFetch: true, lessonId: params.lessonId };
  }

  if (isUserLessonSlug(params.lessonId)) {
    return { lesson: null, needsFetch: true, lessonId: params.lessonId };
  }

  error(404, `Lesson "${params.lessonId}" was not found`);
}

/** Prerender built-in lesson routes; content loads from Supabase at runtime. */
export function entries() {
  return getAllBankLessonIds().map((lessonId) => ({ lessonId }));
}
