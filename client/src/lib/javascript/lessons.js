import recipeAdjust from "$lib/JSON/RecipeAdjust.json";
import howToCook from "$lib/JSON/Howtocook.json";
import ingredientSub from "$lib/JSON/IngredientSub.json";
import easyModeLessons from "$lib/JSON/easy_mode_lessons.json";

const flatSkills = [...recipeAdjust, ...howToCook, ...ingredientSub];

function letterToIndex(value) {
  if (typeof value !== "string") return -1;
  const upper = value.trim().toUpperCase();
  const code = upper.charCodeAt(0);
  if (code < 65 || code > 90) return -1;
  return code - 65;
}

function normalizeQuestion(question, index = 0) {
  const options = question.options ?? question.choices ?? [];
  const explicitIndex =
    typeof question.correct_index === "number"
      ? question.correct_index
      : letterToIndex(question.correctAnswer);

  const correctByText =
    question.correct_answer ?? question.correctAnswerText ?? null;

  const fallbackIndex =
    typeof correctByText === "string" ? options.indexOf(correctByText) : -1;

  const resolvedIndex = explicitIndex >= 0 ? explicitIndex : fallbackIndex;

  return {
    id: question.id ?? index + 1,
    question: question.question ?? question.text ?? "",
    options,
    correct_answer: options[resolvedIndex] ?? correctByText ?? options[0] ?? "",
    correct_index: resolvedIndex >= 0 ? resolvedIndex : 0,
    explanation: question.explanation ?? question.feedback ?? "",
    safety_tip: question.safety_tip ?? question.safetyTip ?? "",
  };
}

function normalizeFlatSkill(skill) {
  return {
    lessonId: skill.lessonId,
    category: skill.category,
    skill: skill.skill,
    title: skill.title ?? skill.skill,
    learningGoal: skill.learningGoal ?? "",
    estimatedMinutes: skill.estimatedMinutes ?? 8,
    intro: skill.intro ?? {
      headline: `${skill.skill} Basics`,
      body: `This lesson introduces ${skill.skill}.`,
    },
    questions: (skill.questions ?? []).map((question, index) =>
      normalizeQuestion(question, index),
    ),
    recap: skill.recap ?? [
      `Review the main concepts from ${skill.skill}.`,
      "Focus on accuracy first, then speed.",
      "Use the safety tips during real kitchen practice.",
    ],
    stepMode: skill.stepMode ?? "questionOrder",
    defaultStepType: skill.defaultStepType ?? "multiple_choice",
  };
}

function normalizeEasyModeSkills(source) {
  const categories = source?.categories ?? [];

  return categories.flatMap((category) => {
    const skills = category.skills ?? [];

    return skills.map((skill) => {
      const miniLessons = skill.miniLessons ?? [];
      const firstMiniLesson = miniLessons[0];
      const steps = miniLessons.map((miniLesson, index) => ({
        id: `${skill.name}-${index + 1}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
        type: "mini-lesson",
        title: miniLesson.title ?? `Mini lesson ${index + 1}`,
        lessonText: miniLesson.lessonText ?? "",
        question: normalizeQuestion(miniLesson.question ?? {}, index),
      }));

      return {
        lessonId: `easy-${category.name}-${skill.name}`
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, ""),
        category: category.name,
        skill: skill.name,
        title: skill.name,
        learningGoal: `Learn the core ideas and safe practices for ${skill.name}.`,
        estimatedMinutes: miniLessons.length * 3 || 8,
        intro: {
          headline: firstMiniLesson?.title ?? `${skill.name} Basics`,
          body:
            firstMiniLesson?.lessonText ??
            `This lesson introduces ${skill.name}. Read each prompt carefully, then practice with guided questions and feedback.`,
        },
        steps,
        questions: steps.map((step) => step.question),
        recap: [
          `Review the main concepts from ${skill.name}.`,
          "Focus on understanding why the substitution or technique works.",
          "Apply the concepts in a small kitchen practice task.",
        ],
        stepMode: "questionOrder",
        defaultStepType: "multiple_choice",
      };
    });
  });
}

function mergeSkillsByKey(primary, secondary) {
  const byKey = new Map();

  for (const skill of secondary) {
    byKey.set(`${skill.category}::${skill.skill}`.toLowerCase(), skill);
  }

  for (const skill of primary) {
    byKey.set(`${skill.category}::${skill.skill}`.toLowerCase(), skill);
  }

  return [...byKey.values()];
}

const normalizedFlatSkills = flatSkills.map(normalizeFlatSkill);
const normalizedEasySkills = normalizeEasyModeSkills(easyModeLessons);

// The new lesson system is driven by easy_mode_lessons.json.
// Keep flat JSON as a fallback only if easy-mode content is missing.
const allSkills =
  normalizedEasySkills.length > 0
    ? normalizedEasySkills
    : mergeSkillsByKey(normalizedEasySkills, normalizedFlatSkills);

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
    .map((section) => {
      const sectionSteps = (section.steps ?? []).slice(0, level.questionsPerSkill);
      const sectionQuestions = sectionSteps.length
        ? sectionSteps.map((step) => step.question)
        : section.questions.slice(0, level.questionsPerSkill);

      return {
        ...section,
        steps: sectionSteps,
        questions: sectionQuestions,
      };
    });

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
  }).filter((card) => card.skills.length > 0);
}

/** Full lesson payload for the detail / quiz flow. */
export function getLessonById(lessonId) {
  const meta = LESSON_META.find((entry) => entry.id === lessonId);
  if (!meta) return null;

  const sections = skillsForCategory(meta.category);
  if (sections.length === 0) return null;

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
  return LESSON_META.filter((entry) => skillsForCategory(entry.category).length > 0).map(
    (entry) => entry.id,
  );
}
