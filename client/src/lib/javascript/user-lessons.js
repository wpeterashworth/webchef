import { supabase } from "$lib/supabase/client.js";

/** @typedef {import("$lib/svelte/types-routes.js").LessonSection} LessonSection */
/** @typedef {import("$lib/svelte/types-routes.js").LessonPayloadBase} LessonPayloadBase */
/** @typedef {import("$lib/svelte/types-routes.js").LessonCard} LessonCard */

/**
 * @typedef {object} UserLessonRow
 * @property {string} slug
 * @property {string} title
 * @property {string | null} description
 * @property {{ sections?: LessonSection[] } | null} content
 * @property {boolean} is_public
 * @property {string | null=} author_username
 */

/**
 * @typedef {LessonPayloadBase & {
 *  isUserLesson: true,
 *  isPublic: boolean,
 *  authorUsername: string | null
 * }} UserLessonPayload
 */

export const USER_LESSON_PREFIX = "custom-";

/** @param {string | null | undefined} slug */
export function isUserLessonSlug(slug) {
  return slug?.startsWith(USER_LESSON_PREFIX);
}

/**
 * Turn a DB row into the lesson payload the quiz flow expects.
 * @param {UserLessonRow} row
 * @returns {UserLessonPayload}
 */
export function userLessonRowToPayload(/** @type {UserLessonRow} */ row) {
  const sections = /** @type {LessonSection[]} */ (row.content?.sections ?? []);

  return {
    id: row.slug,
    title: row.title,
    description: row.description ?? "",
    category: "Community",
    sections,
    skillCount: sections.length,
    totalQuestions: sections.reduce(
      (sum, section) => sum + (section.questions?.length ?? 0),
      0,
    ),
    estimatedMinutes: sections.reduce(
      (sum, section) => sum + (section.estimatedMinutes ?? 8),
      0,
    ),
    isUserLesson: true,
    isPublic: row.is_public,
    authorUsername: row.author_username ?? null,
  };
}

/**
 * Card fields for the /lesson grid.
 * @param {UserLessonRow} row
 * @returns {LessonCard}
 */
export function userLessonRowToCard(/** @type {UserLessonRow} */ row) {
  const payload = userLessonRowToPayload(row);

  return {
    title: payload.title,
    description: payload.description,
    questionCount: payload.totalQuestions,
    label: row.is_public ? "Community lesson" : "Personal lesson",
    href: `/lesson/${row.slug}`,
    lessonId: row.slug,
    skills: payload.sections,
    isUserLesson: true,
    isPublic: row.is_public,
  };
}

/** @returns {Promise<UserLessonRow[]>} */
export async function getPublicUserLessons() {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("slug, title, description, content, is_public, created_at, author_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load community lessons: ${error.message}`);

  return /** @type {UserLessonRow[]} */ (data ?? []);
}

/** @returns {Promise<UserLessonRow[]>} */
export async function getMyUserLessons() {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("slug, title, description, content, is_public, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Could not load your lessons: ${error.message}`);

  return /** @type {UserLessonRow[]} */ (data ?? []);
}

/**
 * @param {string} slug
 * @returns {Promise<UserLessonPayload | null>}
 */
export async function getUserLessonBySlug(/** @type {string} */ slug) {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("slug, title, description, content, is_public, author_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Could not load lesson: ${error.message}`);
  const row = /** @type {UserLessonRow | null} */ (data);
  if (!row) return null;

  return userLessonRowToPayload(row);
}

/**
 * @param {string} title
 * @param {string} description
 * @param {{ sections: LessonSection[] }} content
 */
export async function createUserLesson(
  /** @type {string} */ title,
  /** @type {string} */ description,
  /** @type {{ sections: LessonSection[] }} */ content,
) {
  const { data, error } = await supabase.rpc("create_user_lesson", {
    p_title: title,
    p_description: description,
    p_content: content,
  });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * @param {string} slug
 * @param {string} title
 * @param {string} description
 * @param {{ sections: LessonSection[] }} content
 */
export async function updateUserLesson(
  /** @type {string} */ slug,
  /** @type {string} */ title,
  /** @type {string} */ description,
  /** @type {{ sections: LessonSection[] }} */ content,
) {
  const { data, error } = await supabase.rpc("update_user_lesson", {
    p_slug: slug,
    p_title: title,
    p_description: description,
    p_content: content,
  });

  if (error) throw new Error(error.message);
  return data;
}

/**
 * @param {string} slug
 * @param {boolean} isPublic
 */
export async function setUserLessonVisibility(
  /** @type {string} */ slug,
  /** @type {boolean} */ isPublic,
) {
  const { data, error } = await supabase.rpc("set_user_lesson_visibility", {
    p_slug: slug,
    p_is_public: isPublic,
  });

  if (error) throw new Error(error.message);
  return data;
}

/** @param {string} slug */
export async function deleteUserLesson(slug) {
  const { error } = await supabase.rpc("delete_user_lesson", { p_slug: slug });
  if (error) throw new Error(error.message);
}

/** Build content JSON from the create-lesson form state. */
/**
 * @param {{
 *   skillName: string,
 *   introHeadline: string,
 *   introBody: string,
 *   questions: Array<{
 *     question: string,
 *     options: string[],
 *     correctIndex: number,
 *     explanation: string,
 *     safetyTip: string
 *   }>
 * }} params
 */
export function buildLessonContent({ skillName, introHeadline, introBody, questions }) {
  return {
    sections: [
      {
        skill: skillName,
        title: skillName,
        category: "Custom",
        learningGoal: `Practice ${skillName}.`,
        estimatedMinutes: 8,
        intro: {
          headline: introHeadline,
          body: introBody,
        },
        questions: questions.map((entry, index) => ({
          id: index + 1,
          question: entry.question.trim(),
          options: entry.options.map((option) => option.trim()).filter(Boolean),
          correct_answer: entry.options[entry.correctIndex]?.trim() ?? "",
          correct_index: entry.correctIndex,
          explanation: entry.explanation.trim(),
          safety_tip: entry.safetyTip.trim(),
        })),
      },
    ],
  };
}

/** @returns {{question: string, options: string[], correctIndex: number, explanation: string, safetyTip: string}} */
export function emptyQuestion() {
  return {
    question: "",
    options: ["", ""],
    correctIndex: 0,
    explanation: "",
    safetyTip: "",
  };
}
