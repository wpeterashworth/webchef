import { supabase } from "$lib/supabase/client.js";
import {
  countQuestionsForSkills,
  DIFFICULTY_LEVELS,
} from "$lib/javascript/lessons.js";

/** Category slugs used in URLs and user_progress.lesson_slug. */
export const BANK_CATEGORY_META = [
  {
    slug: "ingredient-substitutions",
    name: "Ingredient Substitutions",
    title: "Ingredient Substitutions",
    description:
      "Swap dairy, herbs, spices, and baking binders when you're missing an ingredient.",
  },
  {
    slug: "recipe-adjustment",
    name: "Recipe Adjustment",
    title: "Recipe Adjustment",
    description:
      "Scale recipes up or down, rescue flavors mid-cook, and fix common texture problems.",
  },
  {
    slug: "how-to-cook",
    name: "How to Cook",
    title: "How to Cook",
    description:
      "Master sautéing, boiling, simmering, poaching, roasting, and baking fundamentals.",
  },
  {
    slug: "utensil-handling",
    name: "Utensil Handling",
    title: "Utensil Handling",
    description:
      "Build knife skills, match pans to the job, and improvise with what you have on hand.",
  },
];

const META_BY_SLUG = Object.fromEntries(
  BANK_CATEGORY_META.map((entry) => [entry.slug, entry]),
);

const META_BY_NAME = Object.fromEntries(
  BANK_CATEGORY_META.map((entry) => [entry.name, entry]),
);

const MODE_TO_DIFFICULTY = {
  easy: "beginner",
  medium: "intermediate",
  hard: "advanced",
};

const DEFAULT_DIFFICULTY = DIFFICULTY_LEVELS[0].id;

let cachedBank = { promise: null, categories: null };

function sortByOrder(rows = []) {
  return [...rows].sort((a, b) => a.sort_order - b.sort_order);
}

function parseChoices(choices) {
  if (Array.isArray(choices)) return choices;
  if (typeof choices === "string") {
    try {
      const parsed = JSON.parse(choices);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
}

function letterToIndex(letter) {
  const index = ["A", "B", "C", "D"].indexOf(String(letter ?? "").toUpperCase());
  return index >= 0 ? index : 0;
}

function skillToSection(skill, categoryName) {
  const miniLessons = sortByOrder(skill.easy_mode_mini_lessons ?? []);
  const firstMini = miniLessons[0];
  const introBody = miniLessons.map((mini) => mini.lesson_text).join("\n\n");

  const questions = [];
  let questionId = 1;

  for (const mini of miniLessons) {
    for (const question of sortByOrder(mini.easy_mode_questions ?? [])) {
      const options = parseChoices(question.choices);
      const correctIndex = letterToIndex(question.correct_answer);

      questions.push({
        id: questionId,
        question: question.prompt,
        options,
        correct_answer: options[correctIndex] ?? options[0] ?? "",
        correct_index: correctIndex,
        explanation: question.feedback ?? "",
        safety_tip: question.feedback ?? "Take your time and follow safe kitchen practices.",
      });

      questionId += 1;
    }
  }

  return {
    skill: skill.name,
    title: skill.name,
    category: categoryName,
    learningGoal: `Learn the core ideas and safe practices for ${skill.name}.`,
    estimatedMinutes: 8,
    intro: {
      headline: firstMini?.title ?? `${skill.name} basics`,
      body: introBody,
    },
    questions,
  };
}

function sectionsForMode(skills, categoryName) {
  return sortByOrder(skills).map((skill) => skillToSection(skill, categoryName));
}

function buildLessonPayload(categoryRow) {
  const meta = META_BY_NAME[categoryRow.name];
  if (!meta) return null;

  const skills = categoryRow.easy_mode_skills ?? [];
  const skillsByMode = { easy: [], medium: [], hard: [] };

  for (const skill of skills) {
    if (skillsByMode[skill.mode]) {
      skillsByMode[skill.mode].push(skill);
    }
  }

  const sectionsByMode = Object.fromEntries(
    Object.entries(skillsByMode).map(([mode, modeSkills]) => [
      MODE_TO_DIFFICULTY[mode],
      sectionsForMode(modeSkills, meta.name),
    ]),
  );

  const defaultSections = sectionsByMode[DEFAULT_DIFFICULTY] ?? [];

  return {
    id: meta.slug,
    title: meta.title,
    description: meta.description,
    category: meta.name,
    sections: defaultSections,
    sectionsByMode,
    skillCount: defaultSections.length,
    totalQuestions: defaultSections.reduce(
      (sum, section) => sum + section.questions.length,
      0,
    ),
    estimatedMinutes: defaultSections.reduce(
      (sum, section) => sum + (section.estimatedMinutes ?? 8),
      0,
    ),
    isBankLesson: true,
  };
}

function rowToCard(categoryRow) {
  const lesson = buildLessonPayload(categoryRow);
  if (!lesson) return null;

  const easySections = lesson.sectionsByMode?.[DEFAULT_DIFFICULTY] ?? lesson.sections;
  const skillCount = easySections.length;

  return {
    title: lesson.title,
    description: lesson.description,
    questionCount: countQuestionsForSkills(easySections, DEFAULT_DIFFICULTY),
    label: `${skillCount} skill${skillCount === 1 ? "" : "s"}`,
    href: `/lesson/${lesson.id}`,
    lessonId: lesson.id,
    skills: easySections,
    isBankLesson: true,
  };
}

async function fetchLessonBankCategories() {
  const { data, error } = await supabase
    .from("easy_mode_categories")
    .select(
      `
      id,
      name,
      sort_order,
      easy_mode_skills (
        id,
        name,
        mode,
        sort_order,
        easy_mode_mini_lessons (
          id,
          title,
          lesson_text,
          sort_order,
          easy_mode_questions (
            id,
            prompt,
            choices,
            correct_answer,
            feedback,
            sort_order
          )
        )
      )
    `,
    )
    .order("sort_order", { ascending: true });

  if (error) {
    throw new Error(`Could not load lessons from the database: ${error.message}`);
  }

  return sortByOrder(data ?? []);
}

async function loadLessonBankCategories() {
  if (cachedBank.categories) return cachedBank.categories;

  if (!cachedBank.promise) {
    cachedBank.promise = fetchLessonBankCategories()
      .then((categories) => {
        cachedBank.categories = categories;
        return categories;
      })
      .finally(() => {
        cachedBank.promise = null;
      });
  }

  return cachedBank.promise;
}

export function clearLessonBankCache() {
  cachedBank = { promise: null, categories: null };
}

export function isBankLessonSlug(slug) {
  return slug in META_BY_SLUG;
}

export function getAllBankLessonIds() {
  return BANK_CATEGORY_META.map((entry) => entry.slug);
}

/** Cards for the /lesson grid. */
export async function getLessonBankCatalog() {
  const categories = await loadLessonBankCategories();
  const order = Object.fromEntries(
    BANK_CATEGORY_META.map((entry, index) => [entry.slug, index]),
  );

  return categories
    .map(rowToCard)
    .filter(Boolean)
    .sort(
      (a, b) =>
        (order[a.lessonId] ?? Number.MAX_SAFE_INTEGER) -
        (order[b.lessonId] ?? Number.MAX_SAFE_INTEGER),
    );
}

/** Full lesson payload for the quiz flow. */
export async function getLessonBankBySlug(slug) {
  if (!isBankLessonSlug(slug)) return null;

  const categories = await loadLessonBankCategories();
  const categoryRow = categories.find((row) => META_BY_NAME[row.name]?.slug === slug);

  return categoryRow ? buildLessonPayload(categoryRow) : null;
}

/** Map of slug -> card fields (for dashboard progress labels). */
export async function getLessonBankCatalogById() {
  const cards = await getLessonBankCatalog();
  return Object.fromEntries(cards.map((card) => [card.lessonId, card]));
}
