import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const root = process.cwd();
const jsonDir = path.join(root, "client", "src", "lib", "JSON");
const outputDir = path.join(root, "supabase", "seed", "csv");

const sources = [
  { mode: "easy", file: "easy_mode_lessons.json" },
  { mode: "medium", file: "medium_mode_lessons.json" },
  { mode: "hard", file: "hard_mode_lessons.json" },
];

function deterministicUuid(seed) {
  const hash = crypto.createHash("sha1").update(seed).digest("hex");
  const base = hash.slice(0, 32).split("");

  base[12] = "4";
  const variant = parseInt(base[16], 16);
  base[16] = ((variant & 0x3) | 0x8).toString(16);

  const hex = base.join("");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20, 32)}`;
}

function normalizeMiniQuestions(miniLesson) {
  if (Array.isArray(miniLesson.questions) && miniLesson.questions.length > 0) {
    return miniLesson.questions;
  }

  if (miniLesson.question && typeof miniLesson.question === "object") {
    return [miniLesson.question];
  }

  return [];
}

function normalizeQuestion(question) {
  const choices = Array.isArray(question.choices)
    ? question.choices
    : Array.isArray(question.options)
      ? question.options
      : [];

  const correctAnswerRaw =
    question.correctAnswer ?? question.correct_answer ?? question.correctAnswerText ?? "";

  let correctAnswer = String(correctAnswerRaw).trim().toUpperCase();
  if (!["A", "B", "C", "D"].includes(correctAnswer) && choices.length > 0) {
    const idx = choices.findIndex(
      (choice) => String(choice).trim() === String(correctAnswerRaw).trim(),
    );
    if (idx >= 0 && idx <= 3) {
      correctAnswer = ["A", "B", "C", "D"][idx];
    }
  }

  if (!["A", "B", "C", "D"].includes(correctAnswer)) {
    correctAnswer = "A";
  }

  return {
    prompt: question.text ?? question.question ?? "",
    choices,
    correctAnswer,
    feedback: question.feedback ?? question.explanation ?? "",
  };
}

function loadSource(mode, file) {
  const sourcePath = path.join(jsonDir, file);
  const data = JSON.parse(fs.readFileSync(sourcePath, "utf8"));
  const categories = Array.isArray(data.categories) ? data.categories : [];

  return categories.map((category, categoryIndex) => ({
    mode,
    categoryName: category.name,
    categorySort: categoryIndex + 1,
    skills: (category.skills ?? []).map((skill, skillIndex) => ({
      name: skill.name,
      sort: skillIndex + 1,
      miniLessons: (skill.miniLessons ?? []).map((miniLesson, miniIndex) => ({
        title: miniLesson.title ?? `Mini lesson ${miniIndex + 1}`,
        lessonText: miniLesson.lessonText ?? "",
        sort: miniIndex + 1,
        questions: normalizeMiniQuestions(miniLesson).map((question, questionIndex) => ({
          ...normalizeQuestion(question),
          sort: questionIndex + 1,
        })),
      })),
    })),
  }));
}

function validateDataset(dataset) {
  for (const category of dataset) {
    if (!category.categoryName) {
      throw new Error("Category name is required for all rows");
    }

    for (const skill of category.skills) {
      if (!skill.name) {
        throw new Error(`Skill name missing in category ${category.categoryName}`);
      }

      if (skill.miniLessons.length !== 3) {
        throw new Error(
          `Skill ${skill.name} (${category.mode}) must have exactly 3 mini lessons; got ${skill.miniLessons.length}`,
        );
      }

      for (const mini of skill.miniLessons) {
        if (!mini.title || !mini.lessonText) {
          throw new Error(`Mini lesson title/text missing in skill ${skill.name} (${category.mode})`);
        }

        if (mini.questions.length < 1) {
          throw new Error(`Mini lesson ${mini.title} in ${skill.name} (${category.mode}) has no questions`);
        }

        for (const question of mini.questions) {
          if (!question.prompt) {
            throw new Error(`Question prompt missing in ${skill.name} (${category.mode})`);
          }
          if (!Array.isArray(question.choices) || question.choices.length !== 4) {
            throw new Error(
              `Question in ${skill.name} (${category.mode}) must have exactly 4 choices`,
            );
          }
          if (!["A", "B", "C", "D"].includes(question.correctAnswer)) {
            throw new Error(
              `Question in ${skill.name} (${category.mode}) has invalid correct answer`,
            );
          }
        }
      }
    }
  }
}

function escapeCsvCell(value) {
  const raw = value == null ? "" : String(value);
  const escaped = raw.replace(/"/g, '""');
  return `"${escaped}"`;
}

function toCsv(columns, rows) {
  const header = columns.join(",");
  const lines = rows.map((row) =>
    columns.map((column) => escapeCsvCell(row[column])).join(","),
  );
  return `${header}\n${lines.join("\n")}\n`;
}

function buildRows(dataset) {
  const categories = [];
  const skills = [];
  const miniLessons = [];
  const questions = [];

  const categoryIdByName = new Map();

  for (const category of dataset) {
    let categoryId = categoryIdByName.get(category.categoryName);
    if (!categoryId) {
      categoryId = deterministicUuid(`category:${category.categoryName}`);
      categoryIdByName.set(category.categoryName, categoryId);
      categories.push({
        id: categoryId,
        name: category.categoryName,
        sort_order: category.categorySort,
      });
    }

    for (const skill of category.skills) {
      const skillId = deterministicUuid(
        `skill:${category.categoryName}:${category.mode}:${skill.sort}:${skill.name}`,
      );
      skills.push({
        id: skillId,
        category_id: categoryId,
        name: skill.name,
        mode: category.mode,
        sort_order: skill.sort,
      });

      for (const mini of skill.miniLessons) {
        const miniLessonId = deterministicUuid(
          `mini:${category.categoryName}:${category.mode}:${skill.sort}:${mini.sort}:${mini.title}`,
        );
        miniLessons.push({
          id: miniLessonId,
          skill_id: skillId,
          title: mini.title,
          lesson_text: mini.lessonText,
          sort_order: mini.sort,
        });

        for (const question of mini.questions) {
          questions.push({
            id: deterministicUuid(
              `question:${category.categoryName}:${category.mode}:${skill.sort}:${mini.sort}:${question.sort}:${question.prompt}`,
            ),
            mini_lesson_id: miniLessonId,
            prompt: question.prompt,
            choices: JSON.stringify(question.choices),
            correct_answer: question.correctAnswer,
            feedback: question.feedback,
            sort_order: question.sort,
          });
        }
      }
    }
  }

  return { categories, skills, miniLessons, questions };
}

function main() {
  const dataset = sources.flatMap((source) => loadSource(source.mode, source.file));
  validateDataset(dataset);

  const { categories, skills, miniLessons, questions } = buildRows(dataset);

  fs.mkdirSync(outputDir, { recursive: true });

  fs.writeFileSync(
    path.join(outputDir, "easy_mode_categories.csv"),
    toCsv(["id", "name", "sort_order"], categories),
    "utf8",
  );

  fs.writeFileSync(
    path.join(outputDir, "easy_mode_skills.csv"),
    toCsv(["id", "category_id", "name", "mode", "sort_order"], skills),
    "utf8",
  );

  fs.writeFileSync(
    path.join(outputDir, "easy_mode_mini_lessons.csv"),
    toCsv(["id", "skill_id", "title", "lesson_text", "sort_order"], miniLessons),
    "utf8",
  );

  fs.writeFileSync(
    path.join(outputDir, "easy_mode_questions.csv"),
    toCsv(
      ["id", "mini_lesson_id", "prompt", "choices", "correct_answer", "feedback", "sort_order"],
      questions,
    ),
    "utf8",
  );

  console.log(
    `Generated CSV files in ${path.relative(root, outputDir)}: ${categories.length} categories, ${skills.length} skills, ${miniLessons.length} mini lessons, ${questions.length} questions.`,
  );
}

main();
