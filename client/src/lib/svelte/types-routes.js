/**
 * Route-facing lesson and card types consumed by Svelte pages.
 */

/**
 * @typedef {object} LessonQuestion
 * @property {number} id
 * @property {string} question
 * @property {string[]} options
 * @property {string} correct_answer
 * @property {number | null | undefined} correct_index
 * @property {string} explanation
 * @property {string} safety_tip
 */

/**
 * @typedef {object} LessonSection
 * @property {string} skill
 * @property {string} title
 * @property {string} category
 * @property {string} learningGoal
 * @property {number=} estimatedMinutes
 * @property {{ headline: string, body: string }} intro
 * @property {LessonQuestion[]} questions
 * @property {string[]=} recap
 */

/**
 * @typedef {object} LessonPayloadBase
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {string} category
 * @property {LessonSection[]} sections
 * @property {number} skillCount
 * @property {number} totalQuestions
 * @property {number} estimatedMinutes
 */

/**
 * @typedef {LessonPayloadBase & {
 *   difficulty: import("$lib/javascript/types-core.js").LessonDifficulty,
 *   difficultyLabel: string
 * }} LessonPayloadResolved
 */

/**
 * @typedef {object} LessonCard
 * @property {string} title
 * @property {string} description
 * @property {number} questionCount
 * @property {string} label
 * @property {string} href
 * @property {string} lessonId
 * @property {LessonSection[]} skills
 * @property {boolean=} isBankLesson
 * @property {boolean=} isUserLesson
 * @property {boolean=} isPublic
 */

export {};