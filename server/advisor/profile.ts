import { extractedProfileSchema, type ExtractedProfile, type ProfileFieldKey, PROFILE_FIELD_KEYS } from "@shared/advisor";

const MIN_CONFIDENCE = 0.45;

function isUsable(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0 && value.trim().toLowerCase() !== "null";
}

export function mergeExtractedProfile(
  current: ExtractedProfile,
  incoming: ExtractedProfile,
  confidenceByField: Record<string, number> = {},
): ExtractedProfile {
  const parsed = extractedProfileSchema.safeParse(incoming);
  const next = { ...current };
  if (!parsed.success) return next;

  for (const key of PROFILE_FIELD_KEYS) {
    const value = parsed.data[key];
    if (!isUsable(value)) continue;
    const confidence = confidenceByField[key] ?? confidenceByField[toSnake(key)] ?? 0.7;
    if (!isUsable(next[key]) || confidence >= MIN_CONFIDENCE) {
      next[key] = value.trim();
    }
  }
  return next;
}

function toSnake(key: string): string {
  return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
}

export function profileFromRow(row: Record<string, unknown> | null | undefined): ExtractedProfile {
  if (!row) return {};
  const mapped: ExtractedProfile = {};
  for (const key of PROFILE_FIELD_KEYS) {
    const value = row[key];
    if (isUsable(value)) mapped[key] = value;
  }
  return mapped;
}

export function contactReady(profile: ExtractedProfile): boolean {
  return Boolean(isUsable(profile.email));
}

export function summarizeProfile(profile: ExtractedProfile): string {
  const lines: string[] = [];
  const add = (label: string, value?: string | null) => {
    if (isUsable(value)) lines.push(`${label}: ${value}`);
  };
  add("Name", [profile.firstName, profile.lastName].filter(Boolean).join(" ") || profile.firstName);
  add("Email", profile.email);
  add("Phone", profile.phone);
  add("Location", [profile.city, profile.state].filter(Boolean).join(", "));
  add("Why now", profile.whyOwnershipNow);
  add("Current work", profile.currentCareerOrBusiness);
  add("Desired change", profile.desiredChange);
  add("Owner role", profile.preferredOwnerRole);
  add("Income goal", profile.incomeGoal);
  add("Income timeline", profile.incomeReplacementTimeline);
  add("Liquid capital", profile.liquidCapitalRange);
  add("Comfortable investment", profile.comfortableInvestmentAmount);
  add("Financing", profile.financingInterest);
  add("Spouse alignment", profile.spouseOrPartnerAlignment);
  add("Employees", profile.employeeTolerance);
  add("Sales", profile.salesComfort);
  add("Recurring revenue", profile.recurringRevenuePreference);
  add("Brick and mortar", profile.brickAndMortarTolerance);
  add("Risk", profile.riskTolerance);
  add("Timeline", profile.timelineToAct);
  add("Concerns", profile.mainConcerns);
  add("Non-negotiables", profile.statedNonNegotiables);
  return lines.join("\n");
}

export function primaryConflict(contradictions: Array<{ tension: string; question: string }> | null | undefined): string | null {
  return contradictions?.[0]?.tension || null;
}

export { PROFILE_FIELD_KEYS };
export type { ProfileFieldKey };
