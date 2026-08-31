/**
 * Drizzle/Replit schema entrypoint.
 * Replit publish runs drizzle-kit generate against this path (or shared/schema.ts).
 * Advisor_* tables must stay declared here so generate never emits DROP TABLE
 * for production Ownership Advisor data created by PR #10.
 */
export * from "../shared/schema";
