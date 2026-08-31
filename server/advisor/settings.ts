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

function withoutStaleOpenAiKeyCopy<T extends { unconfiguredMessage?: unknown }>(copy: T): T {
  if (typeof copy.unconfiguredMessage === "string" && /openai/i.test(copy.unconfiguredMessage)) {
    return { ...copy, unconfiguredMessage: DEFAULT_ADVISOR_COPY.unconfiguredMessage };
  }
  return copy;
}

export function publicCopyFromSettings(settings: Record<string, unknown>): typeof DEFAULT_ADVISOR_COPY {
  const copy = withoutStaleOpenAiKeyCopy({
    ...DEFAULT_ADVISOR_COPY,
    ...((settings.copy as Record<string, unknown> | undefined) || {}),
  });
  if (typeof settings.opening_message === "string") copy.openingMessage = settings.opening_message;
  if (typeof settings.disclosure === "string") copy.disclosure = settings.disclosure;
  if (typeof settings.booking_link === "string") copy.calendlyUrl = settings.booking_link;
  const report = settings.report_wording as { conclusion?: string; handoff?: string } | undefined;
  if (report?.conclusion) copy.thesisConclusion = report.conclusion;
  if (report?.handoff) copy.callHandoff = report.handoff;
  return copy as typeof DEFAULT_ADVISOR_COPY;
}

export function sanitizeStoredAdvisorSettings(map: Record<string, unknown>): Record<string, unknown> {
  const storedCopy = map.copy;
  if (storedCopy && typeof storedCopy === "object") {
    return { ...map, copy: withoutStaleOpenAiKeyCopy({ ...(storedCopy as Record<string, unknown>) }) };
  }
  return map;
}
