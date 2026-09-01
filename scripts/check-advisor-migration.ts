import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ADVISOR_DROP = /DROP\s+TABLE\s+(IF\s+EXISTS\s+)?("?public"?\.)?"?advisor_[a-z0-9_]+"?/i;

function sqlFilesUnder(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir)
    .filter((name) => name.endsWith(".sql"))
    .map((name) => path.join(dir, name));
}

function assertNoAdvisorDrops(files: string[], label: string) {
  for (const file of files) {
    const sql = fs.readFileSync(file, "utf8");
    if (ADVISOR_DROP.test(sql)) {
      throw new Error(`${label} contains DROP TABLE for advisor_* : ${file}`);
    }
  }
}

const before = new Set(sqlFilesUnder("drizzle"));

execFileSync("npx", ["drizzle-kit", "generate", "--name", "check_noop"], {
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL || "postgresql://u:p@127.0.0.1:5432/db" },
  stdio: "inherit",
});

const after = sqlFilesUnder("drizzle");
const created = after.filter((file) => !before.has(file));

assertNoAdvisorDrops(after, "drizzle/*.sql");
assertNoAdvisorDrops(sqlFilesUnder("migrations"), "migrations/*.sql");

if (created.length > 0) {
  const unexpectedDrops = created.filter((file) => ADVISOR_DROP.test(fs.readFileSync(file, "utf8")));
  for (const file of created) {
    fs.rmSync(file);
  }
  const meta = path.join("drizzle", "meta");
  if (fs.existsSync(meta)) {
    for (const name of fs.readdirSync(meta)) {
      if (name.includes("check_noop")) {
        fs.rmSync(path.join(meta, name));
      }
    }
  }
  if (unexpectedDrops.length > 0) {
    throw new Error(`drizzle-kit generate emitted advisor_* DROP TABLE in ${unexpectedDrops.join(", ")}`);
  }
}

console.log("check-advisor-migration: no advisor_* DROP TABLE");
