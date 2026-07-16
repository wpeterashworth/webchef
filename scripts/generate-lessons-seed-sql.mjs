import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const jsonDir = path.join(root, "client", "src", "lib", "JSON");

const sources = [
  { mode: "easy", file: "easy_mode_lessons.json" },
  { mode: "medium", file: "medium_mode_lessons.json" },
  { mode: "hard", file: "hard_mode_lessons.json" },
];

const defaultSqlOutputPath = path.join(
  root,
  "supabase",
  "migrations",
  "20260715091000_seed_lessons_all_modes.sql",
);

const payloadOutputPath = path.join(
  root,
  "supabase",
  "seed",
  "lessons_seed_payload.json",
);

function sqlString(value) {
  return `'${String(value).replace(/'/g, "''")}'`;
}

function sqlJson(value) {
  return `${sqlString(JSON.stringify(value))}::jsonb`;
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

function generateSql(dataset) {
  const lines = [];

  lines.push("-- WebChef — seed lesson-bank content for easy/medium/hard modes.");
  lines.push("-- Generated from JSON lesson files. Safe to re-run via upserts.");
  lines.push("-- Requires schema migration 20260715090000_lessons_users_models_v2.sql.");
  lines.push("");
  lines.push("begin;");
  lines.push("");

  const categorySeen = new Set();

  for (const category of dataset) {
    if (!categorySeen.has(category.categoryName)) {
      lines.push(
        `insert into public.easy_mode_categories (name, sort_order) values (${sqlString(category.categoryName)}, ${category.categorySort})`,
      );
      lines.push("on conflict (name) do update");
      lines.push("set sort_order = excluded.sort_order;");
      lines.push("");
      categorySeen.add(category.categoryName);
    }

    for (const skill of category.skills) {
      lines.push("with category_ref as (");
      lines.push(
        `  select id from public.easy_mode_categories where name = ${sqlString(category.categoryName)}`,
      );
      lines.push(")");
      lines.push(
        "insert into public.easy_mode_skills (category_id, name, mode, sort_order)",
      );
      lines.push(
        `select id, ${sqlString(skill.name)}, ${sqlString(category.mode)}, ${skill.sort} from category_ref`,
      );
      lines.push("on conflict (category_id, name, mode) do update");
      lines.push(
        "set sort_order = excluded.sort_order, mode = excluded.mode;",
      );
      lines.push("");

      for (const mini of skill.miniLessons) {
        lines.push("with skill_ref as (");
        lines.push("  select s.id");
        lines.push("  from public.easy_mode_skills s");
        lines.push("  join public.easy_mode_categories c on c.id = s.category_id");
        lines.push(
          `  where c.name = ${sqlString(category.categoryName)} and s.name = ${sqlString(skill.name)} and s.mode = ${sqlString(category.mode)}`,
        );
        lines.push(")");
        lines.push(
          "insert into public.easy_mode_mini_lessons (skill_id, title, lesson_text, sort_order)",
        );
        lines.push(
          `select id, ${sqlString(mini.title)}, ${sqlString(mini.lessonText)}, ${mini.sort} from skill_ref`,
        );
        lines.push("on conflict (skill_id, sort_order) do update");
        lines.push(
          "set title = excluded.title, lesson_text = excluded.lesson_text;",
        );
        lines.push("");

        for (const question of mini.questions) {
          lines.push("with skill_ref as (");
          lines.push("  select s.id");
          lines.push("  from public.easy_mode_skills s");
          lines.push("  join public.easy_mode_categories c on c.id = s.category_id");
          lines.push(
            `  where c.name = ${sqlString(category.categoryName)} and s.name = ${sqlString(skill.name)} and s.mode = ${sqlString(category.mode)}`,
          );
          lines.push("), mini_ref as (");
          lines.push("  select ml.id");
          lines.push("  from public.easy_mode_mini_lessons ml");
          lines.push("  join skill_ref sr on sr.id = ml.skill_id");
          lines.push(`  where ml.sort_order = ${mini.sort}`);
          lines.push(")");
          lines.push(
            "insert into public.easy_mode_questions (mini_lesson_id, prompt, choices, correct_answer, feedback, sort_order)",
          );
          lines.push(
            `select id, ${sqlString(question.prompt)}, ${sqlJson(question.choices)}, ${sqlString(question.correctAnswer)}, ${sqlString(question.feedback)}, ${question.sort} from mini_ref`,
          );
          lines.push("on conflict (mini_lesson_id, sort_order) do update");
          lines.push(
            "set prompt = excluded.prompt, choices = excluded.choices, correct_answer = excluded.correct_answer, feedback = excluded.feedback;",
          );
          lines.push("");
        }
      }
    }
  }

  lines.push("commit;");
  lines.push("");

  return lines.join("\n");
}

function main() {
  const args = new Set(process.argv.slice(2));
  const writeSql = args.has("--sql");

  const dataset = sources.flatMap((source) => loadSource(source.mode, source.file));
  validateDataset(dataset);

  fs.mkdirSync(path.dirname(payloadOutputPath), { recursive: true });
  fs.writeFileSync(
    payloadOutputPath,
    `${JSON.stringify({ generatedAt: new Date().toISOString(), sources, dataset }, null, 2)}\n`,
    "utf8",
  );

  if (writeSql) {
    const sql = generateSql(dataset);
    fs.writeFileSync(defaultSqlOutputPath, sql, "utf8");
  }

  const categories = new Set(dataset.map((row) => row.categoryName));
  const skills = dataset.reduce((sum, row) => sum + row.skills.length, 0);
  const miniLessons = dataset.reduce(
    (sum, row) =>
      sum + row.skills.reduce((skillSum, skill) => skillSum + skill.miniLessons.length, 0),
    0,
  );
  const questions = dataset.reduce(
    (sum, row) =>
      sum +
      row.skills.reduce(
        (skillSum, skill) =>
          skillSum +
          skill.miniLessons.reduce((miniSum, mini) => miniSum + mini.questions.length, 0),
        0,
      ),
    0,
  );

  const summary = `${categories.size} categories, ${skills} skill rows, ${miniLessons} mini lessons, ${questions} questions`;

  if (writeSql) {
    console.log(
      `Generated payload ${path.relative(root, payloadOutputPath)} and SQL ${path.relative(root, defaultSqlOutputPath)} with ${summary}.`,
    );
    return;
  }

  console.log(
    `Generated payload ${path.relative(root, payloadOutputPath)} with ${summary}. Use --sql only when you explicitly want a full seed migration file.`,
  );
}

main();
