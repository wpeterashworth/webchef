import recipeAdjust from "$lib/JSON/RecipeAdjust.json";
import howToCook from "$lib/JSON/Howtocook.json";
import ingredientSub from "$lib/JSON/IngredientSub.json";

const allSkills = [...recipeAdjust, ...howToCook, ...ingredientSub];

/** Top-level lessons — each groups 3 skills from the JSON files. */
const LESSON_META = [
  {
    id: "recipe-adjustment",
    category: "Recipe Adjustment",
    title: "Recipe Adjustment",
    description:
      "Scale recipes up or down, rescue flavors mid-cook, and fix common texture problems.",
  },
  {
    id: "ingredient-substitutions",
    category: "Ingredient Substitutions",
    title: "Ingredient Substitutions",
    description:
      "Swap dairy, herbs, spices, and baking binders when you're missing an ingredient.",
  },
  {
    id: "how-to-cook",
    category: "How to Cook",
    title: "How to Cook",
    description:
      "Master sautéing, boiling, simmering, poaching, roasting, and baking fundamentals.",
  },
  {
    id: "utensil-handling",
    category: "Utensil Handling",
    title: "Utensil Handling",
    description:
      "Build knife skills, match pans to the job, and improvise with what you have on hand.",
  },
];

export const DIFFICULTY_LEVELS = [
  {
    id: "beginner",
    label: "Beginner",
    accentColor: "#22c55e",
    skillCount: 1,
    questionsPerSkill: 3,
  },
  {
    id: "intermediate",
    label: "Intermediate",
    accentColor: "#eab308",
    skillCount: 2,
    questionsPerSkill: 5,
  },
  {
    id: "advanced",
    label: "Expert",
    accentColor: "#ef4444",
    skillCount: 3,
    questionsPerSkill: 10,
  },
];

const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS[0].id;

export function normalizeDifficulty(difficulty) {
  return DIFFICULTY_LEVELS.some((level) => level.id === difficulty)
    ? difficulty
    : DEFAULT_DIFFICULTY;
}

export function getDifficultyLevel(difficulty) {
  const id = normalizeDifficulty(difficulty);
  return DIFFICULTY_LEVELS.find((level) => level.id === id);
}

function skillsForCategory(category) {
  return allSkills.filter((skill) => skill.category === category);
}

function countQuestions(skills, difficultyId) {
  const level = getDifficultyLevel(difficultyId);
  const activeSkills = skills.slice(0, level.skillCount);

  return activeSkills.reduce(
    (sum, skill) => sum + Math.min(level.questionsPerSkill, skill.questions.length),
    0,
  );
}

export function countQuestionsForSkills(skills, difficultyId) {
  return countQuestions(skills, difficultyId);
}

/** Apply a difficulty level to a full lesson payload. */
export function applyDifficulty(lesson, difficulty) {
  const level = getDifficultyLevel(difficulty);
  const sections = lesson.sections
    .slice(0, level.skillCount)
    .map((section) => ({
      ...section,
      questions: section.questions.slice(0, level.questionsPerSkill),
    }));

  return {
    ...lesson,
    difficulty: level.id,
    difficultyLabel: level.label,
    sections,
    skillCount: sections.length,
    totalQuestions: sections.reduce((sum, section) => sum + section.questions.length, 0),
    estimatedMinutes: sections.reduce(
      (sum, section) => sum + (section.estimatedMinutes ?? 8),
      0,
    ),
  };
}

/** Cards for the /lesson list page (4 total). */
export function getLessonCatalog() {
  return LESSON_META.map((meta) => {
    const skills = skillsForCategory(meta.category);

    return {
      title: meta.title,
      description: meta.description,
      questionCount: countQuestions(skills, DEFAULT_DIFFICULTY),
      label: `${skills.length} skills`,
      href: `/lesson/${meta.id}`,
      lessonId: meta.id,
      skills,
    };
  });
}

/** Full lesson payload for the detail / quiz flow. */
export function getLessonById(lessonId) {
  const meta = LESSON_META.find((entry) => entry.id === lessonId);
  if (!meta) return null;

  const sections = skillsForCategory(meta.category);

  return {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    sections,
    skillCount: sections.length,
    totalQuestions: sections.reduce((sum, skill) => sum + skill.questions.length, 0),
    estimatedMinutes: sections.reduce(
      (sum, skill) => sum + (skill.estimatedMinutes ?? 8),
      0,
    ),
  };
}

export function getAllLessonIds() {
  return LESSON_META.map((entry) => entry.id);
}
