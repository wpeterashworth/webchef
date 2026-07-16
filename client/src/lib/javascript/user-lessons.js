import { supabase } from "$lib/supabase/client.js";

export const USER_LESSON_PREFIX = "custom-";

export function isUserLessonSlug(slug) {
  return slug?.startsWith(USER_LESSON_PREFIX);
}

/** Turn a DB row into the lesson payload the quiz flow expects. */
export function userLessonRowToPayload(row) {
  const sections = row.content?.sections ?? [];

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

/** Card fields for the /lesson grid. */
export function userLessonRowToCard(row) {
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

export async function getPublicUserLessons() {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("slug, title, description, content, is_public, created_at, author_id")
    .eq("is_public", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(`Could not load community lessons: ${error.message}`);

  return data ?? [];
}

export async function getMyUserLessons() {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("slug, title, description, content, is_public, created_at, updated_at")
    .order("updated_at", { ascending: false });

  if (error) throw new Error(`Could not load your lessons: ${error.message}`);

  return data ?? [];
}

export async function getUserLessonBySlug(slug) {
  const { data, error } = await supabase
    .from("user_lessons")
    .select("slug, title, description, content, is_public, author_id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`Could not load lesson: ${error.message}`);
  if (!data) return null;

  return userLessonRowToPayload(data);
}

export async function createUserLesson(title, description, content) {
  const { data, error } = await supabase.rpc("create_user_lesson", {
    p_title: title,
    p_description: description,
    p_content: content,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function updateUserLesson(slug, title, description, content) {
  const { data, error } = await supabase.rpc("update_user_lesson", {
    p_slug: slug,
    p_title: title,
    p_description: description,
    p_content: content,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function setUserLessonVisibility(slug, isPublic) {
  const { data, error } = await supabase.rpc("set_user_lesson_visibility", {
    p_slug: slug,
    p_is_public: isPublic,
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteUserLesson(slug) {
  const { error } = await supabase.rpc("delete_user_lesson", { p_slug: slug });
  if (error) throw new Error(error.message);
}

/** Build content JSON from the create-lesson form state. */
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

export function emptyQuestion() {
  return {
    question: "",
    options: ["", ""],
    correctIndex: 0,
    explanation: "",
    safetyTip: "",
  };
}
