// Lesson progress data access: to-do, in progress, completed.
//
// A row in user_progress exists only once a user has engaged with a lesson at
// all. No row means "not started, not on the list" — that's the fourth state,
// and it needs no storage.

import { supabase } from "$lib/supabase/client.js";

/** @typedef {import("$lib/javascript/types.js").ProgressRow} ProgressRow */
/** @typedef {import("$lib/javascript/types.js").LessonStatus} LessonStatus */
/** @typedef {import("$lib/javascript/types.js").LessonDifficulty} LessonDifficulty */
/** @typedef {import("$lib/javascript/types.js").CompletionResult} CompletionResult */

export const TODO = "todo";
export const IN_PROGRESS = "in_progress";
export const COMPLETED = "completed";

/** Labels for the badges. Keyed by the status values the DB check allows. */
export const STATUS_LABEL = {
  [TODO]: "To-Do",
  [IN_PROGRESS]: "In Progress",
  [COMPLETED]: "Completed",
};

// user_progress.user_id points at users.id (the app's own uuid), not the Supabase
// auth id — so every write needs the profile row's id. It never changes for a
// given login, so look it up once and reuse it.
let cachedProfile = /** @type {{ authUserId: string | null, profileId: string | null }} */ ({
  authUserId: null,
  profileId: null,
});

/**
 * The current user's row id in `users`, or null when signed out.
 *
 * The profile row is created by a database trigger on signup. If this returns
 * null for a signed-in user, that trigger did not run for their account.
 */
export async function getProfileId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    cachedProfile = { authUserId: null, profileId: null };
    return null;
  }

  if (cachedProfile.authUserId === user.id) return cachedProfile.profileId;

  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (error) throw new Error(`Could not load your profile: ${error.message}`);

  if (!data) {
    throw new Error(
      "Your account has no profile row, so progress can't be saved. " +
        "This usually means the signup trigger did not run.",
    );
  }

  cachedProfile = { authUserId: user.id, profileId: data.id };

  return data.id;
}

/** Every progress row for the current user. Empty array when signed out. */
/** @returns {Promise<ProgressRow[]>} */
export async function getProgress() {
  const profileId = await getProfileId();
  if (!profileId) return [];

  const { data, error } = await supabase
    .from("user_progress")
    .select(
      "lesson_slug, status, score, difficulty, points_earned, completed_at, created_at",
    )
    .eq("user_id", profileId);

  if (error) throw new Error(`Could not load your progress: ${error.message}`);

  return data ?? [];
}

/**
 * Set a lesson's status, creating the row if this is the first time.
 *
 * Upserts on (user_id, lesson_slug) — the unique constraint from the migration —
 * so "add to to-do" and "mark completed" are the same operation with a different
 * status, and re-running either is harmless.
 */
/** @returns {Promise<ProgressRow>} */
export async function setStatus(
  /** @type {string} */ lessonSlug,
  /** @type {LessonStatus} */ status,
  /** @type {LessonDifficulty | null} */ difficulty = null,
) {
  const profileId = await getProfileId();
  if (!profileId) throw new Error("You must be signed in to track progress.");

  const payload = /** @type {{ user_id: string, lesson_slug: string, status: LessonStatus, completed_at: string | null, difficulty?: LessonDifficulty }} */ ({
    user_id: profileId,
    lesson_slug: lessonSlug,
    status,
    completed_at: status === COMPLETED ? new Date().toISOString() : null,
  });

  const resolvedDifficulty =
    difficulty ?? (status === TODO ? "beginner" : null);
  if (resolvedDifficulty) {
    payload.difficulty = resolvedDifficulty;
  }

  const { data, error } = await supabase
    .from("user_progress")
    .upsert(payload, { onConflict: "user_id,lesson_slug" })
    .select(
      "lesson_slug, status, score, difficulty, points_earned, completed_at, created_at",
    )
    .single();

  if (error) throw new Error(`Could not save your progress: ${error.message}`);

  return data;
}

/**
 * Mark a lesson complete and award points through the database RPC.
 * Replaying at a higher difficulty only grants the point difference.
 */
/** @returns {Promise<CompletionResult>} */
export async function completeLesson(
  /** @type {string} */ lessonSlug,
  /** @type {LessonDifficulty} */ difficulty,
  /** @type {number | null} */ score = null,
) {
  const { data, error } = await supabase.rpc("complete_lesson", {
    p_lesson_slug: lessonSlug,
    p_difficulty: difficulty,
    p_score: score,
  });

  if (error) throw new Error(`Could not award lesson points: ${error.message}`);

  return data;
}

/**
 * Mark a lesson as started — but never downgrade one that's already finished.
 *
 * This fires when a learner opens the quiz, including when they revisit a
 * lesson they've completed. Without this guard, replaying a finished lesson
 * would quietly un-complete it.
 */
/** @returns {Promise<ProgressRow | null>} */
export async function markStarted(
  /** @type {string} */ lessonSlug,
  /** @type {LessonStatus | undefined} */ currentStatus,
) {
  if (currentStatus === COMPLETED || currentStatus === IN_PROGRESS) return null;

  return setStatus(lessonSlug, IN_PROGRESS);
}

/** Stop tracking a lesson entirely (e.g. taking it off the to-do list). */
/** @param {string} lessonSlug */
export async function clearStatus(lessonSlug) {
  const profileId = await getProfileId();
  if (!profileId) return;

  const { error } = await supabase
    .from("user_progress")
    .delete()
    .eq("user_id", profileId)
    .eq("lesson_slug", lessonSlug);

  if (error) throw new Error(`Could not update your progress: ${error.message}`);
}
