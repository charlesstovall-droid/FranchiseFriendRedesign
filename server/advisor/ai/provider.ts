import OpenAI from "openai";
import { turnOutputSchema, ownershipThesisSchema, meetingBriefSchema, type TurnOutput, type OwnershipThesis, type MeetingBrief } from "@shared/advisor";
import { briefJsonSchema, thesisJsonSchema, turnJsonSchema } from "./schemas";

export class AdvisorNotConfiguredError extends Error {
  constructor() {
    super("OPENAI_API_KEY is not configured");
    this.name = "AdvisorNotConfiguredError";
  }
}

export interface AdvisorAiProvider {
  completeTurn(system: string, user: string): Promise<TurnOutput>;
  generateThesis(system: string, user: string): Promise<OwnershipThesis>;
  generateBrief(system: string, user: string): Promise<MeetingBrief>;
}

function client(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new AdvisorNotConfiguredError();
  }
  return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

function modelName(): string {
  return process.env.OPENAI_MODEL || "gpt-4o";
}

async function completeJson(system: string, user: string, schema: { name: string; strict: boolean; schema: Record<string, unknown> }) {
  const openai = client();
  const response = await openai.chat.completions.create({
    model: modelName(),
    temperature: 0.4,
    response_format: {
      type: "json_schema",
      json_schema: schema as any,
    },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });
  const content = response.choices[0]?.message?.content;
  if (!content) {
    throw new Error("The model returned an empty response");
  }
  return JSON.parse(content);
}

export class OpenAiAdvisorProvider implements AdvisorAiProvider {
  async completeTurn(system: string, user: string): Promise<TurnOutput> {
    const raw = await completeJson(system, user, turnJsonSchema);
    return turnOutputSchema.parse(raw);
  }

  async generateThesis(system: string, user: string): Promise<OwnershipThesis> {
    const raw = await completeJson(system, user, thesisJsonSchema);
    return ownershipThesisSchema.parse(raw);
  }

  async generateBrief(system: string, user: string): Promise<MeetingBrief> {
    const raw = await completeJson(system, user, briefJsonSchema);
    return meetingBriefSchema.parse(raw);
  }
}

export function isAdvisorConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function createAdvisorProvider(): AdvisorAiProvider {
  return new OpenAiAdvisorProvider();
}
