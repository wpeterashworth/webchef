import { supabase } from "$lib/supabase/client.js";

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
      "Master sauteing, boiling, simmering, poaching, roasting, and baking fundamentals.",
  },
  {
    id: "utensil-handling",
    category: "Utensil Handling",
    title: "Utensil Handling",
    description:
      "Build knife skills, match pans to the job, and improvise with what you have on hand.",
  },
];

const DIFFICULTY_TO_MODE = {
  beginner: "easy",
  intermediate: "medium",
  advanced: "hard",
};

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

function letterToIndex(value) {
  if (typeof value !== "string") return -1;
  const upper = value.trim().toUpperCase();
  const code = upper.charCodeAt(0);
  if (code < 65 || code > 90) return -1;
  return code - 65;
}

function slugify(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function modeForDifficulty(difficultyId) {
  return DIFFICULTY_TO_MODE[difficultyId] ?? DIFFICULTY_TO_MODE.beginner;
}

function normalizeQuestion(question, index = 0) {
  const options = Array.isArray(question.choices)
    ? question.choices
    : Array.isArray(question.options)
      ? question.options
      : [];

  const explicitIndex =
    typeof question.correct_index === "number"
      ? question.correct_index
      : letterToIndex(question.correct_answer ?? question.correctAnswer);

  const correctByText =
    question.correct_answer_text ??
    question.correctAnswerText ??
    question.correct_answer ??
    null;

  const fallbackIndex =
    typeof correctByText === "string" ? options.indexOf(correctByText) : -1;

  const resolvedIndex = explicitIndex >= 0 ? explicitIndex : fallbackIndex;

  return {
    id: question.id ?? index + 1,
    question: question.prompt ?? question.question ?? question.text ?? "",
    options,
    correct_answer: options[resolvedIndex] ?? correctByText ?? options[0] ?? "",
    correct_index: resolvedIndex >= 0 ? resolvedIndex : 0,
    explanation: question.explanation ?? question.feedback ?? "",
    safety_tip: question.safety_tip ?? question.safetyTip ?? "",
  };
}

function buildSection(skill, miniLessons, questionsByMiniLessonId, categoryName) {
  const firstMiniLesson = miniLessons[0];

  const steps = miniLessons.flatMap((miniLesson) => {
    const questions = questionsByMiniLessonId.get(miniLesson.id) ?? [];
    return questions.map((question, index) => ({
      id: `${slugify(skill.name)}-${miniLesson.sort_order}-${question.sort_order ?? index + 1}`,
      type: "mini-lesson",
      title: miniLesson.title ?? `Mini lesson ${miniLesson.sort_order}`,
      lessonText: index === 0 ? miniLesson.lesson_text ?? "" : "",
      question: normalizeQuestion(question, index),
    }));
  });

  return {
    category: categoryName,
    skill: skill.name,
    title: skill.name,
    mode: skill.mode,
    learningGoal: `Learn the core ideas and safe practices for ${skill.name}.`,
    estimatedMinutes: Math.max(8, steps.length * 2),
    intro: {
      headline: firstMiniLesson?.title ?? `${skill.name} Basics`,
      body:
        firstMiniLesson?.lesson_text ??
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
}

async function loadSectionsByCategoryForMode(mode) {
  const { data: categories, error: categoriesError } = await supabase
    .from("easy_mode_categories")
    .select("id, name, sort_order")
    .order("sort_order", { ascending: true });

  if (categoriesError) {
    throw new Error(`Could not load lesson categories: ${categoriesError.message}`);
  }

  const categoryById = new Map(
    (categories ?? []).map((category) => [category.id, category]),
  );

  const { data: skills, error: skillsError } = await supabase
    .from("easy_mode_skills")
    .select("id, category_id, name, mode, sort_order")
    .eq("mode", mode)
    .order("sort_order", { ascending: true });

  if (skillsError) {
    throw new Error(`Could not load lesson skills: ${skillsError.message}`);
  }

  const skillIds = (skills ?? []).map((skill) => skill.id);
  if (skillIds.length === 0) {
    return new Map();
  }

  const { data: miniLessons, error: miniLessonsError } = await supabase
    .from("easy_mode_mini_lessons")
    .select("id, skill_id, title, lesson_text, sort_order")
    .in("skill_id", skillIds)
    .order("sort_order", { ascending: true });

  if (miniLessonsError) {
    throw new Error(`Could not load mini lessons: ${miniLessonsError.message}`);
  }

  const miniLessonsBySkillId = new Map();
  for (const miniLesson of miniLessons ?? []) {
    if (!miniLessonsBySkillId.has(miniLesson.skill_id)) {
      miniLessonsBySkillId.set(miniLesson.skill_id, []);
    }
    miniLessonsBySkillId.get(miniLesson.skill_id).push(miniLesson);
  }

  const miniLessonIds = (miniLessons ?? []).map((miniLesson) => miniLesson.id);

  let questionsByMiniLessonId = new Map();
  if (miniLessonIds.length > 0) {
    const { data: questions, error: questionsError } = await supabase
      .from("easy_mode_questions")
      .select("id, mini_lesson_id, prompt, choices, correct_answer, feedback, sort_order")
      .in("mini_lesson_id", miniLessonIds)
      .order("sort_order", { ascending: true });

    if (questionsError) {
      throw new Error(`Could not load lesson questions: ${questionsError.message}`);
    }

    questionsByMiniLessonId = new Map();
    for (const question of questions ?? []) {
      if (!questionsByMiniLessonId.has(question.mini_lesson_id)) {
        questionsByMiniLessonId.set(question.mini_lesson_id, []);
      }
      questionsByMiniLessonId.get(question.mini_lesson_id).push(question);
    }
  }

  const sectionsByCategory = new Map();
  for (const skill of skills ?? []) {
    const category = categoryById.get(skill.category_id);
    if (!category) continue;

    const categoryName = category.name;
    const miniForSkill = miniLessonsBySkillId.get(skill.id) ?? [];
    const section = buildSection(
      skill,
      miniForSkill,
      questionsByMiniLessonId,
      categoryName,
    );

    if (!sectionsByCategory.has(categoryName)) {
      sectionsByCategory.set(categoryName, []);
    }

    sectionsByCategory.get(categoryName).push(section);
  }

  return sectionsByCategory;
}

async function loadSectionsByCategoryForAllModes() {
  const [easy, medium, hard] = await Promise.all([
    loadSectionsByCategoryForMode("easy"),
    loadSectionsByCategoryForMode("medium"),
    loadSectionsByCategoryForMode("hard"),
  ]);

  return { easy, medium, hard };
}

function questionCountForDifficulty(sections, difficultyId) {
  const level = getDifficultyLevel(difficultyId);
  const activeSections = sections.slice(0, level.skillCount);
  return activeSections.reduce(
    (sum, section) => sum + Math.min(level.questionsPerSkill, section.questions.length),
    0,
  );
}

export function normalizeDifficulty(difficulty) {
  return DIFFICULTY_LEVELS.some((level) => level.id === difficulty)
    ? difficulty
    : DEFAULT_DIFFICULTY;
}

export function getDifficultyLevel(difficulty) {
  const id = normalizeDifficulty(difficulty);
  return DIFFICULTY_LEVELS.find((level) => level.id === id);
}

export function countQuestionsForSkills(sections, difficultyId) {
  return questionCountForDifficulty(sections, difficultyId);
}

export function isBuiltInLessonId(lessonId) {
  return LESSON_META.some((entry) => entry.id === lessonId);
}

export function getAllLessonIds() {
  return LESSON_META.map((entry) => entry.id);
}

export async function getLessonCatalog() {
  const sectionsByCategory = await loadSectionsByCategoryForMode(
    modeForDifficulty(DEFAULT_DIFFICULTY),
  );

  return LESSON_META.map((meta) => {
    const sections = sectionsByCategory.get(meta.category) ?? [];

    return {
      title: meta.title,
      description: meta.description,
      questionCount: questionCountForDifficulty(sections, DEFAULT_DIFFICULTY),
      label: `${sections.length} skills`,
      href: `/lesson/${meta.id}`,
      lessonId: meta.id,
      skills: sections,
    };
  }).filter((card) => card.skills.length > 0);
}

export async function getBuiltInLessonById(lessonId) {
  const meta = LESSON_META.find((entry) => entry.id === lessonId);
  if (!meta) return null;

  const sectionsByMode = await loadSectionsByCategoryForAllModes();

  const lesson = {
    id: meta.id,
    title: meta.title,
    description: meta.description,
    category: meta.category,
    sectionsByMode: {
      easy: sectionsByMode.easy.get(meta.category) ?? [],
      medium: sectionsByMode.medium.get(meta.category) ?? [],
      hard: sectionsByMode.hard.get(meta.category) ?? [],
    },
  };

  const hasAnySections =
    lesson.sectionsByMode.easy.length > 0 ||
    lesson.sectionsByMode.medium.length > 0 ||
    lesson.sectionsByMode.hard.length > 0;

  return hasAnySections ? lesson : null;
}

/** Apply a difficulty level to a full lesson payload. */
export function applyDifficulty(lesson, difficulty) {
  const level = getDifficultyLevel(difficulty);
  const mode = modeForDifficulty(level.id);
  const modeSections = lesson.sectionsByMode?.[mode] ?? [];

  const sections = modeSections.slice(0, level.skillCount).map((section) => {
    const sectionSteps = (section.steps ?? []).slice(0, level.questionsPerSkill);
    const sectionQuestions = sectionSteps.length
      ? sectionSteps.map((step) => step.question)
      : (section.questions ?? []).slice(0, level.questionsPerSkill);

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
    mode,
    sections,
    skillCount: sections.length,
    totalQuestions: sections.reduce((sum, section) => sum + section.questions.length, 0),
    estimatedMinutes: sections.reduce(
      (sum, section) => sum + (section.estimatedMinutes ?? 8),
      0,
    ),
  };
}
