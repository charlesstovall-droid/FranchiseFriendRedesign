import { HUBSPOT_ADVISOR_PROPERTIES } from "@shared/advisor";
import type { ExtractedProfile } from "@shared/advisor";
import { primaryConflict, summarizeProfile } from "./profile";
import { clientKey, rateLimit } from "./rate-limit";
import * as store from "./storage";

const HUBSPOT_API = "https://api.hubapi.com";

export function isHubspotConfigured(): boolean {
  return Boolean(process.env.HUBSPOT_PRIVATE_APP_TOKEN);
}

function token(): string {
  return process.env.HUBSPOT_PRIVATE_APP_TOKEN || "";
}

async function hubspotFetch(path: string, init: RequestInit = {}) {
  if (!isHubspotConfigured()) {
    throw new Error("HUBSPOT_PRIVATE_APP_TOKEN is not set");
  }
  const limited = rateLimit({ key: "hubspot:global", limit: 30, windowMs: 10 * 60 * 1000 });
  if (!limited.ok) {
    throw new Error("HubSpot rate limit reached. Try again shortly.");
  }
  const response = await fetch(`${HUBSPOT_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token()}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await response.text();
  let body: unknown = text;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!response.ok) {
    const err = new Error(`HubSpot ${response.status}`);
    (err as Error & { body?: unknown }).body = body;
    throw err;
  }
  return body;
}

export function hubspotPropertiesFromProfile(input: {
  profile: ExtractedProfile;
  status: string;
  reportUrl?: string | null;
  bookingStatus?: string;
  contradictions?: Array<{ tension: string; question: string }>;
  completedAt?: Date | null;
}): Record<string, string> {
  return {
    ownership_advisor_status: input.status,
    ownership_why_now: input.profile.whyOwnershipNow || "",
    desired_owner_role: input.profile.preferredOwnerRole || "",
    income_goal: input.profile.incomeGoal || "",
    income_timeline: input.profile.incomeReplacementTimeline || "",
    liquid_capital_range: input.profile.liquidCapitalRange || "",
    comfortable_investment: input.profile.comfortableInvestmentAmount || "",
    financing_interest: input.profile.financingInterest || "",
    spouse_alignment: input.profile.spouseOrPartnerAlignment || "",
    employee_tolerance: input.profile.employeeTolerance || "",
    sales_comfort: input.profile.salesComfort || "",
    recurring_revenue_preference: input.profile.recurringRevenuePreference || "",
    brick_and_mortar_tolerance: input.profile.brickAndMortarTolerance || "",
    ownership_timeline: input.profile.timelineToAct || "",
    risk_tolerance: input.profile.riskTolerance || "",
    ownership_fit_summary: summarizeProfile(input.profile).slice(0, 65000),
    ownership_primary_conflict: primaryConflict(input.contradictions) || "",
    ownership_report_url: input.reportUrl || "",
    ownership_assessment_completed_at: input.completedAt ? input.completedAt.toISOString() : "",
    ownership_call_booked: input.bookingStatus || "not_decided",
  };
}

export async function searchContactByEmail(email: string): Promise<{ id: string } | null> {
  const body = (await hubspotFetch("/crm/v3/objects/contacts/search", {
    method: "POST",
    body: JSON.stringify({
      filterGroups: [{ filters: [{ propertyName: "email", operator: "EQ", value: email }] }],
      properties: ["email"],
      limit: 1,
    }),
  })) as { results?: Array<{ id: string }> };
  return body.results?.[0] ? { id: body.results[0].id } : null;
}

export async function upsertAdvisorContact(input: {
  candidateId: string;
  email: string;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  profile: ExtractedProfile;
  status: string;
  reportUrl?: string | null;
  bookingStatus?: string;
  contradictions?: Array<{ tension: string; question: string }>;
  completedAt?: Date | null;
  note?: string;
}): Promise<{ contactId: string | null; skipped: boolean }> {
  if (!isHubspotConfigured()) {
    await store.logHubspotEvent({
      candidateId: input.candidateId,
      eventType: "upsert_skipped",
      status: "skipped",
      requestSummary: `No token; email ${input.email}`,
    });
    return { contactId: null, skipped: true };
  }

  const properties = {
    email: input.email,
    firstname: input.firstName || "",
    lastname: input.lastName || "",
    phone: input.phone || "",
    ...hubspotPropertiesFromProfile(input),
  };

  try {
    const existing = await searchContactByEmail(input.email);
    let contactId: string;
    if (existing) {
      await hubspotFetch(`/crm/v3/objects/contacts/${existing.id}`, {
        method: "PATCH",
        body: JSON.stringify({ properties }),
      });
      contactId = existing.id;
    } else {
      const created = (await hubspotFetch("/crm/v3/objects/contacts", {
        method: "POST",
        body: JSON.stringify({ properties }),
      })) as { id: string };
      contactId = created.id;
    }

    if (input.note) {
      await addContactNote(contactId, input.note);
    }

    await store.logHubspotEvent({
      candidateId: input.candidateId,
      eventType: existing ? "contact_updated" : "contact_created",
      status: "ok",
      requestSummary: `email=${input.email}`,
      responseSummary: `contactId=${contactId}`,
    });
    return { contactId, skipped: false };
  } catch (error) {
    const message = error instanceof Error ? error.message : "HubSpot sync failed";
    await store.logHubspotEvent({
      candidateId: input.candidateId,
      eventType: "upsert_failed",
      status: "error",
      requestSummary: `email=${input.email}`,
      error: message,
    });
    console.error("[advisor] HubSpot sync failed:", message);
    return { contactId: null, skipped: false };
  }
}

export async function addContactNote(contactId: string, body: string) {
  const note = (await hubspotFetch("/crm/v3/objects/notes", {
    method: "POST",
    body: JSON.stringify({
      properties: {
        hs_timestamp: Date.now().toString(),
        hs_note_body: body.slice(0, 65000),
      },
    }),
  })) as { id: string };
  await hubspotFetch(`/crm/v3/objects/notes/${note.id}/associations/contacts/${contactId}/note_to_contact`, {
    method: "PUT",
  }).catch(async () => {
    await hubspotFetch("/crm/v4/associations/notes/contacts/batch/create", {
      method: "POST",
      body: JSON.stringify({
        inputs: [{ from: { id: note.id }, to: { id: contactId }, types: [{ associationCategory: "HUBSPOT_DEFINED", associationTypeId: 202 }] }],
      }),
    });
  });
}

export async function ensureHubspotProperties(): Promise<{ created: string[]; existing: string[]; errors: string[] }> {
  const created: string[] = [];
  const existing: string[] = [];
  const errors: string[] = [];
  if (!isHubspotConfigured()) {
    return { created, existing, errors: ["HUBSPOT_PRIVATE_APP_TOKEN is not set"] };
  }
  for (const property of HUBSPOT_ADVISOR_PROPERTIES) {
    try {
      await hubspotFetch(`/crm/v3/properties/contacts/${property.name}`);
      existing.push(property.name);
    } catch {
      try {
        await hubspotFetch("/crm/v3/properties/contacts", {
          method: "POST",
          body: JSON.stringify({
            name: property.name,
            label: property.label,
            type: property.type === "datetime" ? "datetime" : "string",
            fieldType: property.type === "datetime" ? "date" : "textarea",
            groupName: "contactinformation",
          }),
        });
        created.push(property.name);
      } catch (error) {
        errors.push(`${property.name}: ${error instanceof Error ? error.message : "failed"}`);
      }
    }
  }
  return { created, existing, errors };
}

export function hubspotContactUrl(contactId: string): string {
  return `https://app.hubspot.com/contacts/${contactId}`;
}

export function rateLimitHubspotFromRequest(req: { ip?: string; headers: Record<string, unknown> }) {
  return rateLimit({ key: clientKey(req, "hubspot"), limit: 20, windowMs: 10 * 60 * 1000 });
}
