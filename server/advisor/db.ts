import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "@shared/schema";

let pool: pg.Pool | null = null;
let advisorDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getAdvisorDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL must be set for the Ownership Advisor.");
  }
  if (!advisorDb) {
    pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    advisorDb = drizzle(pool, { schema });
  }
  return advisorDb;
}
