import assert from "node:assert/strict";
import { BANNED_CANDIDATE_PHRASES, OPENING_QUESTION, THESIS_CONCLUSION, CALL_HANDOFF, FINANCIAL_DISCLAIMER, turnOutputSchema, HUBSPOT_ADVISOR_PROPERTIES, PROFILE_FIELD_KEYS } from "../shared/advisor";
import { DEFAULT_ADVISOR_COPY } from "../shared/advisor-copy";
import {
  AdvisorNotConfiguredError,
  DEFAULT_XAI_MODEL,
  XAI_BASE_URL,
  XaiAdvisorProvider,
  advisorClientConfig,
  advisorModelName,
  createAdvisorClient,
  isAdvisorConfigured,
  type AdvisorChatClient,
} from "../server/advisor/ai/provider";
import { publicCopyFromSettings } from "../server/advisor/settings";
import { mergeExtractedProfile } from "../server/advisor/profile";
import { detectFollowUpHints, detectFinancialChapter } from "../server/advisor/followups";
import { detectSafetyFlags, filterNamedBrands, sanitizeCandidateMessage } from "../server/advisor/safety";
import { createOpaqueToken, hashPassword, verifyPassword } from "../server/advisor/tokens";
import { rateLimit, resetRateLimitForTests } from "../server/advisor/rate-limit";
import { parseCsv, csvToBrandRows, brandsToCsv } from "../server/advisor/csv";
import { advisorMigrationStatements } from "../server/advisor/migrate";
import { primaryConflict, summarizeProfile } from "../server/advisor/profile";
import { turnJsonSchema } from "../server/advisor/ai/schemas";
import {
  isOpenAiAuthFailure,
  isResponseFormatError,
  sanitizeProviderMessage,
  wrapProviderError,
} from "../server/advisor/ai/provider";

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
  assert.deepEqual(parsed.confidence_by_field, {});
});

function collectObjectSchemas(node: unknown, path: string, found: Array<{ path: string; node: Record<string, unknown> }>) {
  if (!node || typeof node !== "object") return;
  if (Array.isArray(node)) {
    node.forEach((item, index) => collectObjectSchemas(item, `${path}[${index}]`, found));
    return;
  }
  const obj = node as Record<string, unknown>;
  if (obj.type === "object") {
    found.push({ path, node: obj });
    collectObjectSchemas(obj.properties, `${path}.properties`, found);
    return;
  }
  if (obj.type === "array") {
    collectObjectSchemas(obj.items, `${path}.items`, found);
    return;
  }
  for (const [key, value] of Object.entries(obj)) {
    collectObjectSchemas(value, `${path}.${key}`, found);
  }
}

section("turn JSON schema is OpenAI structured-output valid", () => {
  const objects: Array<{ path: string; node: Record<string, unknown> }> = [];
  collectObjectSchemas(turnJsonSchema.schema, "turn", objects);
  assert.ok(objects.length >= 3, "expected root, extracted_candidate_data, and confidence_by_field objects");
  for (const { path, node } of objects) {
    assert.equal(node.additionalProperties, false, `${path} must set additionalProperties false`);
    assert.equal(typeof node.properties, "object", `${path} must have a properties map`);
    assert.ok(node.properties && !Array.isArray(node.properties), `${path} properties must be an object`);
  }

  const confidence = objects.find((item) => item.path.endsWith("confidence_by_field"));
  assert.ok(confidence, "confidence_by_field must be an object schema");
  assert.equal(confidence.node.additionalProperties, false);
  const confidenceKeys = Object.keys(confidence.node.properties as Record<string, unknown>);
  assert.deepEqual(confidenceKeys, [...PROFILE_FIELD_KEYS]);
  for (const key of PROFILE_FIELD_KEYS) {
    assert.deepEqual((confidence.node.properties as Record<string, { type: string }>)[key], { type: "number" });
  }

  const extracted = objects.find((item) => item.path.endsWith("extracted_candidate_data"));
  assert.ok(extracted);
  assert.deepEqual(Object.keys(extracted.node.properties as Record<string, unknown>), [...PROFILE_FIELD_KEYS]);
});

section("profile merge keeps current values when the model omits fields", () => {
  const merged = mergeExtractedProfile(
    { firstName: "Alex", whyOwnershipNow: "control" },
    {},
    {},
  );
  assert.equal(merged.firstName, "Alex");
  assert.equal(merged.whyOwnershipNow, "control");
});

section("provider errors stay short and distinguish auth vs schema", () => {
  const wrapped = wrapProviderError({
    status: 401,
    code: "invalid_api_key",
    message: "Incorrect API key provided: sk-test_secret_value",
  });
  assert.equal(wrapped.status, 401);
  assert.equal(wrapped.code, "invalid_api_key");
  assert.match(wrapped.message, /Advisor API 401/);
  assert.match(wrapped.message, /sk-\[redacted\]/);
  assert.doesNotMatch(wrapped.message, /sk-test_secret_value/);
  assert.equal(isOpenAiAuthFailure(wrapped), true);
  assert.equal(isResponseFormatError(wrapped), false);
  assert.equal(sanitizeProviderMessage("Bearer sk-abc123"), "Bearer [redacted]");

  const schemaError = wrapProviderError({
    status: 400,
    param: "response_format",
    message: "Invalid schema for response_format 'advisor_turn': additionalProperties must be false.",
  });
  assert.equal(isResponseFormatError(schemaError), true);
  assert.equal(isOpenAiAuthFailure(schemaError), false);
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

section("unconfigured copy does not tell anyone to add an OpenAI key", () => {
  assert.match(DEFAULT_ADVISOR_COPY.unconfiguredMessage, /not configured yet/i);
  assert.doesNotMatch(DEFAULT_ADVISOR_COPY.unconfiguredMessage, /openai/i);
  const stale = publicCopyFromSettings({
    copy: {
      ...DEFAULT_ADVISOR_COPY,
      unconfiguredMessage: "Chuck still needs to add an OpenAI API key before conversations can run.",
    },
  });
  assert.doesNotMatch(stale.unconfiguredMessage, /openai/i);
});

section("advisor is configured only when XAI_API_KEY is set", () => {
  const previousXai = process.env.XAI_API_KEY;
  const previousOpenAi = process.env.OPENAI_API_KEY;
  const previousModel = process.env.XAI_MODEL;
  try {
    delete process.env.XAI_API_KEY;
    process.env.OPENAI_API_KEY = "sk-openai-should-not-count";
    assert.equal(isAdvisorConfigured(), false);
    assert.throws(() => advisorClientConfig(), AdvisorNotConfiguredError);

    process.env.XAI_API_KEY = "xai-test-key-not-a-secret";
    delete process.env.XAI_MODEL;
    assert.equal(isAdvisorConfigured(), true);
    assert.deepEqual(advisorClientConfig(), { apiKey: "xai-test-key-not-a-secret", baseURL: XAI_BASE_URL });
    assert.equal(XAI_BASE_URL, "https://api.x.ai/v1");
    assert.equal(advisorModelName(), DEFAULT_XAI_MODEL);
    assert.equal(DEFAULT_XAI_MODEL, "grok-4.6");

    process.env.XAI_MODEL = "grok-4";
    assert.equal(advisorModelName(), "grok-4");

    const client = createAdvisorClient() as { baseURL?: string; apiKey?: string };
    assert.equal(client.baseURL, XAI_BASE_URL);
    assert.equal(client.apiKey, "xai-test-key-not-a-secret");
  } finally {
    if (previousXai === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previousXai;
    if (previousOpenAi === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousOpenAi;
    if (previousModel === undefined) delete process.env.XAI_MODEL;
    else process.env.XAI_MODEL = previousModel;
  }
});

function mockAdvisorClient(payload: unknown, captured: { body?: { model?: string; response_format?: { type?: string } } }): AdvisorChatClient {
  return {
    chat: {
      completions: {
        create: async (body) => {
          captured.body = body;
          return {
            choices: [{ message: { content: JSON.stringify(payload) } }],
          } as Awaited<ReturnType<AdvisorChatClient["chat"]["completions"]["create"]>>;
        },
      },
    },
  };
}

{
  const previousXai = process.env.XAI_API_KEY;
  const previousModel = process.env.XAI_MODEL;
  process.env.XAI_API_KEY = "xai-test-key-not-a-secret";
  delete process.env.XAI_MODEL;
  try {
    const captured: { body?: { model?: string; response_format?: { type?: string } } } = {};
    const turn = {
      candidate_message: "That gives me part of the picture. What would you like ownership to change first?",
      current_chapter: "why_now",
      extracted_candidate_data: { firstName: "Sam" },
      ready_for_thesis: false,
    };
    const provider = new XaiAdvisorProvider(() => mockAdvisorClient(turn, captured));
    const parsed = await provider.completeTurn("system", "user");
    assert.equal(parsed.candidate_message.includes("part of the picture"), true);
    assert.equal(captured.body?.model, "grok-4.6");
    assert.equal(captured.body?.response_format?.type, "json_schema");

    const thesisSection = { title: "Title", body: "Body", indicator: "Worth exploring" as const };
    const thesisProvider = new XaiAdvisorProvider(() =>
      mockAdvisorClient(
        {
          whyOwnershipIsBeingConsidered: thesisSection,
          whatCandidateWantsOwnershipToCreate: thesisSection,
          recommendedOwnerRole: thesisSection,
          financialFramework: thesisSection,
          businessCharacteristicsThatMayFit: thesisSection,
          businessCharacteristicsToApproachCarefully: thesisSection,
          strengthsTheCandidateBrings: thesisSection,
          potentialConflictsOrBlindSpots: thesisSection,
          questionsStillRequiringHumanJudgment: thesisSection,
          recommendedNextStep: thesisSection,
          namedBrands: [],
          conclusion: "This profile is a framework, not a franchise recommendation.",
        },
        captured,
      ),
    );
    const thesis = await thesisProvider.generateThesis("system", "user");
    assert.equal(thesis.namedBrands.length, 0);

    const briefProvider = new XaiAdvisorProvider(() =>
      mockAdvisorClient(
        {
          candidateInOneParagraph: "A candidate exploring ownership.",
          whatTheySayTheyWant: "More control.",
          whatTheyMayActuallyBeSolvingFor: "A better week.",
          financialReality: "Ranges only.",
          familyOrLifestyleConstraints: "Family time matters.",
          contradictionsToExplore: "Income versus flexibility.",
          likelyDecisionStyle: "Careful.",
          suitableBusinessModelCharacteristics: "Recurring revenue.",
          modelsToApproachCarefully: "High-buildout concepts.",
          threeQuestionsChuckShouldAskNext: ["What timeline feels honest?"],
          suggestedOpeningForTheStrategyCall: "Let's talk about fit.",
          suggestedFollowUpEmail: "Thanks for the conversation.",
        },
        captured,
      ),
    );
    const brief = await briefProvider.generateBrief("system", "user");
    assert.equal(brief.threeQuestionsChuckShouldAskNext.length, 1);
    console.log("ok  mocked xAI provider still returns Zod turn/thesis/brief shapes");
  } finally {
    if (previousXai === undefined) delete process.env.XAI_API_KEY;
    else process.env.XAI_API_KEY = previousXai;
    if (previousModel === undefined) delete process.env.XAI_MODEL;
    else process.env.XAI_MODEL = previousModel;
  }
}

const { hash, salt } = await hashPassword("correct-horse");
assert.equal(await verifyPassword("correct-horse", hash, salt), true);
assert.equal(await verifyPassword("wrong", hash, salt), false);
console.log("ok  password hashing");
console.log("\nOwnership Advisor self-tests passed (no live keys required).");
