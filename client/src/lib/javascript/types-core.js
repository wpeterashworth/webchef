/**
 * Shared core app types used by stores and JS utilities.
 */

/** @typedef {"beginner" | "intermediate" | "advanced"} LessonDifficulty */
/** @typedef {"todo" | "in_progress" | "completed"} LessonStatus */

/**
 * @typedef {object} UserProfile
 * @property {string} id
 * @property {string} username
 * @property {number} xp
 * @property {number} level_number
 * @property {string} level_title
 * @property {number} current_streak
 * @property {number} longest_streak
 * @property {boolean} is_admin
 */

/**
 * @typedef {object} ProgressRow
 * @property {string} lesson_slug
 * @property {LessonStatus} status
 * @property {number | null} score
 * @property {LessonDifficulty | null} difficulty
 * @property {number | null} points_earned
 * @property {string | null} completed_at
 * @property {string} created_at
 */

/**
 * @typedef {object} CompletionResult
 * @property {number} points_awarded
 * @property {number} xp
 * @property {number} level_number
 * @property {string} level_title
 * @property {boolean} leveled_up
 */

/**
 * @typedef {object} LeaderboardEntry
 * @property {string} username
 * @property {number} xp
 * @property {number} level_number
 * @property {string} level_title
 */

/**
 * @typedef {object} AdminDashboardData
 * @property {number} total_users
 * @property {number} total_lessons
 * @property {number} total_completions
 */

export {};