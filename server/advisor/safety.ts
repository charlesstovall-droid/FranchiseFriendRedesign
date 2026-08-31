import { BANNED_CANDIDATE_PHRASES } from "@shared/advisor";

const SAFETY_PATTERNS: Array<{ flag: string; pattern: RegExp }> = [
  { flag: "legal_advice", pattern: /\b(you should (sign|sue|form an llc)|this is legal advice|as your attorney)\b/i },
  { flag: "tax_advice", pattern: /\b(this (will|won't) be tax[- ]deductible|file this on your taxes|as your cpa)\b/i },
  { flag: "income_promise", pattern: /\b(guaranteed (income|return)|you will make|you'll earn \$?\d|average owner makes)\b/i },
  { flag: "invented_earnings", pattern: /\b(item 19|fpr|average unit (volume|sales)|owners typically (net|earn))\b/i },
  { flag: "perfect_match", pattern: /\bperfect (franchise|match|fit)\b/i },
];

export function detectSafetyFlags(text: string): string[] {
  return SAFETY_PATTERNS.filter((item) => item.pattern.test(text)).map((item) => item.flag);
}

export function sanitizeCandidateMessage(text: string): string {
  let next = text.replace(/\u2014/g, ". ").replace(/\s+—\s+/g, ". ");
  for (const phrase of BANNED_CANDIDATE_PHRASES) {
    const re = new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    next = next.replace(re, "");
  }
  next = next.replace(/!{2,}/g, ".");
  return next.replace(/\n{3,}/g, "\n\n").trim();
}

export function brandsMentioned(text: string): string[] {
  const matches = text.match(/\b[A-Z][A-Za-z0-9&'.-]+(?:\s+[A-Z][A-Za-z0-9&'.-]+){0,3}\b/g) || [];
  return Array.from(new Set(matches));
}

export const LIVED_EXPERIENCE_BRANDS = ["Boost Mobile", "Massage Envy", "YogaSix", "IMAGE Studios", "Image Studios"];

export function filterNamedBrands(
  named: Array<{ name: string; reason: string; disclaimer?: string }>,
  approvedNames: string[],
): Array<{ name: string; reason: string; disclaimer: string }> {
  const allowed = new Set(approvedNames.map((n) => n.toLowerCase()));
  return named
    .filter((item) => allowed.has(item.name.toLowerCase()))
    .map((item) => ({
      name: item.name,
      reason: item.reason,
      disclaimer: item.disclaimer || "This is an option to investigate, not an endorsement.",
    }));
}
