import {
  ADVISOR_CHAPTERS,
  CHAPTER_LABELS,
  FINANCIAL_DISCLAIMER,
  THESIS_CONCLUSION,
  type AdvisorChapter,
  type ExtractedProfile,
  type MeetingBrief,
  type OwnershipThesis,
  type TurnOutput,
} from "@shared/advisor";
import type { AdvisorApprovedBrand, AdvisorConversationMessage } from "@shared/schema";
import { DEFAULT_CHAPTER_PROMPTS, DEFAULT_SYSTEM_INSTRUCTIONS } from "@shared/advisor-copy";
import { detectFinancialChapter, detectFollowUpHints } from "../followups";
import { mergeExtractedProfile, profileFromRow, summarizeProfile } from "../profile";
import { detectSafetyFlags, filterNamedBrands, sanitizeCandidateMessage } from "../safety";
import { AdvisorNotConfiguredError, createAdvisorProvider, isAdvisorConfigured } from "./provider";

const ROLLING_MESSAGE_LIMIT = 12;

export type OrchestratorSettings = {
  system_instructions?: string;
  chapter_prompts?: Record<string, string>;
  suggested_buttons?: Record<string, string[]>;
};

export function buildTurnPrompt(input: {
  settings: OrchestratorSettings;
  chapter: AdvisorChapter;
  profile: ExtractedProfile;
  messages: AdvisorConversationMessage[];
  userMessage: string;
  followUpHints: Array<{ reason: string; question: string }>;
  approvedBrands: AdvisorApprovedBrand[];
  financialDisclaimerNeeded: boolean;
}): { system: string; user: string } {
  const system = input.settings.system_instructions || DEFAULT_SYSTEM_INSTRUCTIONS;
  const chapterPrompt = input.settings.chapter_prompts?.[input.chapter] || DEFAULT_CHAPTER_PROMPTS[input.chapter];
  const recent = input.messages.slice(-ROLLING_MESSAGE_LIMIT);
  const history = recent.map((m) => `${m.role === "assistant" ? "Advisor" : "Candidate"}: ${m.content}`).join("\n");
  const brands = input.approvedBrands
    .filter((b) => b.approvedForAi)
    .map((b) => {
      const verified = b.dateLastVerified ? new Date(b.dateLastVerified).toISOString().slice(0, 10) : "unverified";
      return `- ${b.brandName} | category: ${b.category || "n/a"} | investment: ${b.investmentRange || "unknown"} | liquidity: ${b.minLiquidity || "unknown"} | role: ${b.ownerRole || "n/a"} | verified: ${verified} | notes: ${b.chuckNotes || "none"}`;
    })
    .join("\n");

  const user = [
    `Current chapter: ${CHAPTER_LABELS[input.chapter]} (${input.chapter})`,
    `Chapter guidance: ${chapterPrompt}`,
    "",
    "Rolling candidate profile (authoritative; update only with new evidence):",
    summarizeProfile(input.profile) || "(empty)",
    "",
    "Recent conversation (do not assume anything outside this window plus the profile):",
    history || "(none yet)",
    "",
    `Latest candidate answer: ${input.userMessage}`,
    "",
    input.followUpHints.length
      ? `Server follow-up judgment to honor if still relevant:\n${input.followUpHints.map((h) => `- ${h.reason}: ${h.question}`).join("\n")}`
      : "No server follow-up hints.",
    input.financialDisclaimerNeeded ? `\nBefore asking for financial ranges, include this sentence: ${FINANCIAL_DISCLAIMER}` : "",
    "",
    "Approved brands you may name (empty means name none as recommendations):",
    brands || "(none)",
    "",
    "Return structured output only. Ask one primary question. Optional suggested_answers should be short and skippable. If the picture is complete enough for a thesis, set ready_for_thesis true.",
  ]
    .filter(Boolean)
    .join("\n");

  return { system, user };
}

export async function runAdvisorTurn(input: {
  settings: OrchestratorSettings;
  chapter: AdvisorChapter;
  profile: ExtractedProfile | Record<string, unknown>;
  messages: AdvisorConversationMessage[];
  userMessage: string;
  priorFollowUpReasons?: string[];
  approvedBrands: AdvisorApprovedBrand[];
}): Promise<{ output: TurnOutput; mergedProfile: ExtractedProfile }> {
  if (!isAdvisorConfigured()) {
    throw new AdvisorNotConfiguredError();
  }

  const currentProfile = profileFromRow(input.profile as Record<string, unknown>);
  const hints = detectFollowUpHints(input.userMessage, input.priorFollowUpReasons);
  const financialDisclaimerNeeded =
    input.chapter === "financial_reality" || detectFinancialChapter(input.userMessage);
  const { system, user } = buildTurnPrompt({
    settings: input.settings,
    chapter: input.chapter,
    profile: currentProfile,
    messages: input.messages,
    userMessage: input.userMessage,
    followUpHints: hints,
    approvedBrands: input.approvedBrands,
    financialDisclaimerNeeded,
  });

  const provider = createAdvisorProvider();
  const output = await provider.completeTurn(system, user);
  output.candidate_message = sanitizeCandidateMessage(output.candidate_message);
  const extraFlags = detectSafetyFlags(output.candidate_message);
  output.safety_flags = Array.from(new Set([...(output.safety_flags || []), ...extraFlags]));
  if (hints[0] && !output.follow_up_reason) {
    output.follow_up_reason = hints[0].reason;
  }
  if (!ADVISOR_CHAPTERS.includes(output.current_chapter)) {
    output.current_chapter = input.chapter;
  }

  const mergedProfile = mergeExtractedProfile(
    currentProfile,
    output.extracted_candidate_data,
    output.confidence_by_field,
  );

  return { output, mergedProfile };
}

export async function runThesisGeneration(input: {
  settings: OrchestratorSettings;
  profile: ExtractedProfile | Record<string, unknown>;
  contradictions: Array<{ tension: string; question: string }>;
  approvedBrands: AdvisorApprovedBrand[];
}): Promise<OwnershipThesis> {
  if (!isAdvisorConfigured()) {
    throw new AdvisorNotConfiguredError();
  }
  const profile = profileFromRow(input.profile as Record<string, unknown>);
  const approved = input.approvedBrands.filter((b) => b.approvedForAi);
  const system = `${input.settings.system_instructions || DEFAULT_SYSTEM_INSTRUCTIONS}

Write the Ownership Thesis. Use only the candidate profile. Do not invent financial results, territories, or brand performance. You may describe business-model characteristics freely. You may name a franchise only if it is in the approved list and you explain why it is an option to investigate, not an endorsement. Conclusion must be: ${THESIS_CONCLUSION}`;
  const user = [
    summarizeProfile(profile),
    "",
    "Contradictions:",
    input.contradictions.map((c) => `- ${c.tension}`).join("\n") || "(none recorded)",
    "",
    "Approved brands:",
    approved.map((b) => `${b.brandName} (${b.category || "n/a"}; ${b.investmentRange || "investment unknown"})`).join("\n") || "(none)",
  ].join("\n");

  const thesis = await createAdvisorProvider().generateThesis(system, user);
  thesis.conclusion = THESIS_CONCLUSION;
  thesis.namedBrands = filterNamedBrands(
    thesis.namedBrands || [],
    approved.map((b) => b.brandName),
  );
  for (const key of Object.keys(thesis) as Array<keyof OwnershipThesis>) {
    const section = thesis[key];
    if (section && typeof section === "object" && "body" in section && typeof section.body === "string") {
      section.body = sanitizeCandidateMessage(section.body);
    }
  }
  return thesis;
}

export async function runBriefGeneration(input: {
  settings: OrchestratorSettings;
  profile: ExtractedProfile | Record<string, unknown>;
  thesis: OwnershipThesis;
  firstName?: string | null;
}): Promise<MeetingBrief> {
  if (!isAdvisorConfigured()) {
    throw new AdvisorNotConfiguredError();
  }
  const profile = profileFromRow(input.profile as Record<string, unknown>);
  const system = `${input.settings.system_instructions || DEFAULT_SYSTEM_INSTRUCTIONS}

Write Chuck's private Meeting Brief. Be direct and useful. Do not invent facts. The suggested follow-up email should be calm and human, with no hype.`;
  const user = [
    `Candidate name: ${input.firstName || profile.firstName || "the candidate"}`,
    summarizeProfile(profile),
    "",
    "Ownership Thesis JSON:",
    JSON.stringify(input.thesis),
  ].join("\n");
  return createAdvisorProvider().generateBrief(system, user);
}
