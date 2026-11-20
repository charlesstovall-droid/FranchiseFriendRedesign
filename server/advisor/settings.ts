import {
  DEFAULT_ADVISOR_COPY,
  DEFAULT_CHAPTER_PROMPTS,
  DEFAULT_FOLLOW_UP_EMAIL_TEMPLATE,
  DEFAULT_SUGGESTED_BUTTONS,
  DEFAULT_SYSTEM_INSTRUCTIONS,
} from "@shared/advisor-copy";
import { HUBSPOT_ADVISOR_PROPERTIES } from "@shared/advisor";
import { BOOKING_URL } from "@shared/site";

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
  booking_link: DEFAULT_ADVISOR_COPY.bookingUrl,
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

/** Old scheduler links saved in settings or email templates still book on HubSpot. */
const LEGACY_SCHEDULER_URL = /https?:\/\/(?:www\.)?calendly\.com\/[^\s"'<>)]+/gi;

export function rewriteLegacyBookingText(value: string): string {
  return value.replaceAll("{{calendlyUrl}}", "{{bookingUrl}}").replace(LEGACY_SCHEDULER_URL, BOOKING_URL);
}

function normalizeBookingCopy(copy: Record<string, unknown>): Record<string, unknown> {
  const next = { ...copy };
  if (typeof next.bookingUrl !== "string" && typeof next.calendlyUrl === "string") {
    next.bookingUrl = next.calendlyUrl;
  }
  delete next.calendlyUrl;
  if (typeof next.bookingUrl === "string") next.bookingUrl = rewriteLegacyBookingText(next.bookingUrl);
  return next;
}

export function resolveBookingUrl(stored?: string | null): string {
  const fromEnv = process.env.BOOKING_URL?.trim();
  const candidate = (fromEnv || stored || BOOKING_URL).trim();
  const rewritten = rewriteLegacyBookingText(candidate);
  return rewritten || BOOKING_URL;
}

export function publicCopyFromSettings(settings: Record<string, unknown>): typeof DEFAULT_ADVISOR_COPY {
  const storedCopy = (settings.copy as Record<string, unknown> | undefined) || {};
  const copy = withoutStaleLocationCopy(withoutStaleOpenAiKeyCopy({
    ...DEFAULT_ADVISOR_COPY,
    ...normalizeBookingCopy(storedCopy),
  }));
  if (typeof settings.opening_message === "string") copy.openingMessage = settings.opening_message;
  if (typeof settings.disclosure === "string") copy.disclosure = settings.disclosure;
  if (typeof settings.booking_link === "string") copy.bookingUrl = rewriteLegacyBookingText(settings.booking_link);
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
  if (typeof next.system_instructions === "string") {
    next.system_instructions = rewriteLegacyBookingText(next.system_instructions);
  }
  if (typeof next.booking_link === "string") next.booking_link = rewriteLegacyBookingText(next.booking_link);
  if (typeof next.follow_up_email_template === "string") {
    next.follow_up_email_template = rewriteLegacyBookingText(next.follow_up_email_template);
  }
  const storedCopy = next.copy;
  if (storedCopy && typeof storedCopy === "object") {
    next.copy = withoutStaleLocationCopy(
      withoutStaleOpenAiKeyCopy(normalizeBookingCopy({ ...(storedCopy as Record<string, unknown>) })),
    );
  }
  return next;
}
