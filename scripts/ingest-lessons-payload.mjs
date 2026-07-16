import fs from "node:fs";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const root = process.cwd();
const payloadPath = path.join(root, "supabase", "seed", "lessons_seed_payload.json");

async function main() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL is required to ingest lesson payload.");
  }

  if (!fs.existsSync(payloadPath)) {
    throw new Error(
      `Missing payload file at ${payloadPath}. Run: node scripts/generate-lessons-seed-sql.mjs`,
    );
  }

  const payload = JSON.parse(fs.readFileSync(payloadPath, "utf8"));

  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });

  await client.connect();
  try {
    await client.query("select public.ingest_lessons_payload($1::jsonb)", [
      JSON.stringify(payload),
    ]);
    console.log("Lesson payload ingest completed successfully.");
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
