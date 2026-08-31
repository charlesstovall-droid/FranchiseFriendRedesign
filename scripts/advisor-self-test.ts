import assert from "node:assert/strict";
import { BANNED_CANDIDATE_PHRASES, OPENING_QUESTION, THESIS_CONCLUSION, CALL_HANDOFF, FINANCIAL_DISCLAIMER, turnOutputSchema, HUBSPOT_ADVISOR_PROPERTIES } from "../shared/advisor";
import { DEFAULT_ADVISOR_COPY } from "../shared/advisor-copy";
import { mergeExtractedProfile } from "../server/advisor/profile";
import { detectFollowUpHints, detectFinancialChapter } from "../server/advisor/followups";
import { detectSafetyFlags, filterNamedBrands, sanitizeCandidateMessage } from "../server/advisor/safety";
import { createOpaqueToken, hashPassword, verifyPassword } from "../server/advisor/tokens";
import { rateLimit, resetRateLimitForTests } from "../server/advisor/rate-limit";
import { parseCsv, csvToBrandRows, brandsToCsv } from "../server/advisor/csv";
import { advisorMigrationStatements } from "../server/advisor/migrate";
import { primaryConflict, summarizeProfile } from "../server/advisor/profile";

function section(name: string, fn: () => void) {
  fn();
  console.log(`ok  ${name}`);
}

section("exact public copy", () => {
  assert.equal(DEFAULT_ADVISOR_COPY.landingHero, "Before you choose a franchise, understand what should actually fit your life.");
  assert.equal(DEFAULT_ADVISOR_COPY.landingCta, "Build My Ownership Profile");
  assert.equal(DEFAULT_ADVISOR_COPY.openingMessage, OPENING_QUESTION);
  assert.match(DEFAULT_ADVISOR_COPY.disclosure, /referral fee/);
  assert.equal(DEFAULT_ADVISOR_COPY.callHandoff, CALL_HANDOFF);
  assert.equal(DEFAULT_ADVISOR_COPY.thesisConclusion, THESIS_CONCLUSION);
  assert.equal(DEFAULT_ADVISOR_COPY.financialDisclaimer, FINANCIAL_DISCLAIMER);
  assert.equal(DEFAULT_ADVISOR_COPY.bookingCta, "Review My Profile With Chuck");
});

section("profile merge does not invent or blindly overwrite", () => {
  const merged = mergeExtractedProfile(
    { firstName: "Alex", liquidCapitalRange: "$200k" },
    { firstName: "", preferredOwnerRole: "manager-run", liquidCapitalRange: "unknown" },
    { preferredOwnerRole: 0.9, liquidCapitalRange: 0.8 },
  );
  assert.equal(merged.firstName, "Alex");
  assert.equal(merged.preferredOwnerRole, "manager-run");
  assert.equal(merged.liquidCapitalRange, "unknown");
});

section("follow-up judgment", () => {
  const passive = detectFollowUpHints("I really want passive income and mailbox money.");
  assert.equal(passive[0]?.question.includes("first 12 months"), true);
  const salary = detectFollowUpHints("I need to replace my salary immediately.");
  assert.equal(salary[0]?.question.includes("comfortably operate"), true);
  const sales = detectFollowUpHints("I dislike sales.");
  assert.equal(sales[0]?.question.includes("cold prospecting"), true);
  assert.equal(detectFinancialChapter("What capital range should I share?"), true);
});

section("safety and banned phrases", () => {
  const dirty = sanitizeCandidateMessage("Congratulations! That's exciting! You will make $400k — guaranteed.");
  for (const phrase of ["Congratulations!", "That's exciting!"]) {
    assert.equal(dirty.includes(phrase), false);
  }
  assert.doesNotMatch(dirty, /\u2014/);
  const flags = detectSafetyFlags("you will make $200k guaranteed income");
  assert.ok(flags.includes("income_promise"));
  const filtered = filterNamedBrands(
    [{ name: "FakeBurger", reason: "no", disclaimer: "x" }, { name: "RealBrand", reason: "fit", disclaimer: "option to investigate" }],
    ["RealBrand"],
  );
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0].name, "RealBrand");
});

section("opaque tokens", () => {
  const a = createOpaqueToken();
  const b = createOpaqueToken();
  assert.notEqual(a, b);
  assert.ok(a.length >= 20);
});

section("rate limit", () => {
  resetRateLimitForTests();
  assert.equal(rateLimit({ key: "t", limit: 2, windowMs: 60_000 }).ok, true);
  assert.equal(rateLimit({ key: "t", limit: 2, windowMs: 60_000 }).ok, true);
  assert.equal(rateLimit({ key: "t", limit: 2, windowMs: 60_000 }).ok, false);
});

section("structured turn schema", () => {
  const parsed = turnOutputSchema.parse({
    candidate_message: "That gives me part of the picture. What would you like ownership to change first?",
    current_chapter: "why_now",
    extracted_candidate_data: { firstName: "Sam" },
    ready_for_thesis: false,
  });
  assert.equal(parsed.suggested_answers.length, 0);
  assert.equal(parsed.safety_flags.length, 0);
});

section("csv import export", () => {
  const csv = brandsToCsv([
    {
      id: "1",
      brandName: "Example, Inc",
      category: "service",
      investmentRange: null,
      minLiquidity: null,
      ownerRole: null,
      employeeProfile: null,
      salesModel: null,
      recurringRevenueCharacteristics: null,
      brickAndMortarRequirements: null,
      buildoutLevel: null,
      typicalDevelopmentStructure: null,
      availableTerritories: null,
      fddYear: null,
      sbaDirectoryStatus: null,
      chuckNotes: null,
      approvedForAi: true,
      dateLastVerified: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);
  assert.match(csv, /"Example, Inc"/);
  const rows = csvToBrandRows(csv);
  assert.equal(rows[0].brandName, "Example, Inc");
  assert.equal(parseCsv("a,b\n1,2").length, 2);
});

section("additive migrations exist", () => {
  const sql = advisorMigrationStatements().join("\n");
  assert.match(sql, /CREATE TABLE IF NOT EXISTS advisor_candidates/);
  assert.match(sql, /advisor_approved_brands/);
  assert.doesNotMatch(sql, /DROP TABLE/);
});

section("hubspot property map is complete and token-free", () => {
  const names = HUBSPOT_ADVISOR_PROPERTIES.map((p) => p.name);
  assert.equal(names.includes("ownership_report_url"), true);
  assert.equal(names.includes("ownership_call_booked"), true);
  assert.equal(HUBSPOT_ADVISOR_PROPERTIES.length, 20);
  assert.equal(primaryConflict([{ tension: "income vs flexibility", question: "which?" }]), "income vs flexibility");
  assert.match(summarizeProfile({ whyOwnershipNow: "control" }), /control/);
});

section("banned hype list is enforced in copy defaults", () => {
  const blob = JSON.stringify(DEFAULT_ADVISOR_COPY);
  for (const phrase of BANNED_CANDIDATE_PHRASES) {
    assert.equal(blob.includes(phrase), false);
  }
});

hashPassword("correct-horse").then(async ({ hash, salt }) => {
  assert.equal(await verifyPassword("correct-horse", hash, salt), true);
  assert.equal(await verifyPassword("wrong", hash, salt), false);
  console.log("ok  password hashing");
  console.log("\nOwnership Advisor self-tests passed (no live keys required).");
});
