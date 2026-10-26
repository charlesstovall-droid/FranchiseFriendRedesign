import {
  DEFAULT_ADVISOR_COPY,
  DEFAULT_CHAPTER_PROMPTS,
  DEFAULT_FOLLOW_UP_EMAIL_TEMPLATE,
  DEFAULT_SUGGESTED_BUTTONS,
  DEFAULT_SYSTEM_INSTRUCTIONS,
} from "@shared/advisor-copy";
import { HUBSPOT_ADVISOR_PROPERTIES } from "@shared/advisor";

export const DEFAULT_SETTING_VALUES: Record<string, unknown> = {
  copy: DEFAULT_ADVISOR_COPY,
  system_instructions: DEFAULT_SYSTEM_INSTRUCTIONS,
  chapter_prompts: DEFAULT_CHAPTER_PROMPTS,
  suggested_buttons: DEFAULT_SUGGESTED_BUTTONS,
  disclosure: DEFAULT_ADVISOR_COPY.disclosure,
  opening_message: DEFAULT_ADVISOR_COPY.openingMessage,
  report_wording: {
    conclusion: DEFAULT_ADVISOR_COPY.thesisConclusion,
    handoff: DEFAULT_ADVISOR_COPY.callHandoff,
  },
  booking_link: DEFAULT_ADVISOR_COPY.calendlyUrl,
  hubspot_property_mapping: HUBSPOT_ADVISOR_PROPERTIES,
  follow_up_email_template: DEFAULT_FOLLOW_UP_EMAIL_TEMPLATE,
  retention_days: 730,
};

export type AdvisorSettingsMap = typeof DEFAULT_SETTING_VALUES;

const STALE_LOCATION_SENTENCE = "He has been involved in opening more than 100 franchise locations.";
const CURRENT_LOCATION_SENTENCE = "He built 30 franchise locations across 4 brands and exited to private equity.";

function withoutStaleOpenAiKeyCopy<T extends { unconfiguredMessage?: unknown }>(copy: T): T {
  if (typeof copy.unconfiguredMessage === "string" && /openai/i.test(copy.unconfiguredMessage)) {
    return { ...copy, unconfiguredMessage: DEFAULT_ADVISOR_COPY.unconfiguredMessage };
  }
  return copy;
}

function withoutStaleLocationCopy<T extends { landingNearCta?: unknown }>(copy: T): T {
  if (typeof copy.landingNearCta === "string" && /more than 100 franchise locations/i.test(copy.landingNearCta)) {
    return { ...copy, landingNearCta: DEFAULT_ADVISOR_COPY.landingNearCta };
  }
  return copy;
}

function withoutStaleLocationInstructions(value: unknown): unknown {
  if (typeof value !== "string" || !/more than 100 franchise locations/i.test(value)) return value;
  const replaced = value.replaceAll(STALE_LOCATION_SENTENCE, CURRENT_LOCATION_SENTENCE);
  return /more than 100 franchise locations/i.test(replaced) ? DEFAULT_SYSTEM_INSTRUCTIONS : replaced;
}

export function publicCopyFromSettings(settings: Record<string, unknown>): typeof DEFAULT_ADVISOR_COPY {
  const copy = withoutStaleLocationCopy(withoutStaleOpenAiKeyCopy({
    ...DEFAULT_ADVISOR_COPY,
    ...((settings.copy as Record<string, unknown> | undefined) || {}),
  }));
  if (typeof settings.opening_message === "string") copy.openingMessage = settings.opening_message;
  if (typeof settings.disclosure === "string") copy.disclosure = settings.disclosure;
  if (typeof settings.booking_link === "string") copy.calendlyUrl = settings.booking_link;
  const report = settings.report_wording as { conclusion?: string; handoff?: string } | undefined;
  if (report?.conclusion) copy.thesisConclusion = report.conclusion;
  if (report?.handoff) copy.callHandoff = report.handoff;
  return copy as typeof DEFAULT_ADVISOR_COPY;
}

export function sanitizeStoredAdvisorSettings(map: Record<string, unknown>): Record<string, unknown> {
  const next: Record<string, unknown> = {
    ...map,
    system_instructions: withoutStaleLocationInstructions(map.system_instructions),
  };
  const storedCopy = next.copy;
  if (storedCopy && typeof storedCopy === "object") {
    next.copy = withoutStaleLocationCopy(withoutStaleOpenAiKeyCopy({ ...(storedCopy as Record<string, unknown>) }));
  }
  return next;
}
