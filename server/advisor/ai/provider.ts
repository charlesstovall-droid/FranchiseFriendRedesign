import OpenAI from "openai";
import { turnOutputSchema, ownershipThesisSchema, meetingBriefSchema, type TurnOutput, type OwnershipThesis, type MeetingBrief } from "@shared/advisor";
import { briefJsonSchema, thesisJsonSchema, turnJsonSchema } from "./schemas";

/** Official xAI chat completions base URL (OpenAI-compatible). */
export const XAI_BASE_URL = "https://api.x.ai/v1";

/** Current Grok chat model with structured JSON (`response_format.json_schema`). From xAI docs. */
export const DEFAULT_XAI_MODEL = "grok-4.6";

export class AdvisorNotConfiguredError extends Error {
  constructor() {
    super("XAI_API_KEY is not configured");
    this.name = "AdvisorNotConfiguredError";
  }
}

export class AdvisorProviderError extends Error {
  readonly status?: number;
  readonly code?: string | null;

  constructor(message: string, options: { status?: number; code?: string | null } = {}) {
    super(message);
    this.name = "AdvisorProviderError";
    this.status = options.status;
    this.code = options.code;
  }
}

export interface AdvisorAiProvider {
  completeTurn(system: string, user: string): Promise<TurnOutput>;
  generateThesis(system: string, user: string): Promise<OwnershipThesis>;
  generateBrief(system: string, user: string): Promise<MeetingBrief>;
}

export type AdvisorChatClient = {
  chat: {
    completions: {
      create: (body: OpenAI.Chat.Completions.ChatCompletionCreateParamsNonStreaming) => Promise<OpenAI.Chat.Completions.ChatCompletion>;
    };
  };
};

type JsonSchemaFormat = { name: string; strict: boolean; schema: Record<string, unknown> };

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

export function sanitizeProviderMessage(message: string): string {
  return message
    .replace(/sk-[A-Za-z0-9_-]+/g, "sk-[redacted]")
    .replace(/xai-[A-Za-z0-9_-]+/g, "xai-[redacted]")
    .replace(/Bearer\s+\S+/gi, "Bearer [redacted]")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 240);
}

function errorField(error: unknown, key: string): unknown {
  const record = asRecord(error);
  if (!record) return undefined;
  if (record[key] !== undefined) return record[key];
  const nested = asRecord(record.error);
  return nested?.[key];
}

export function providerErrorDetails(error: unknown): { status?: number; code?: string | null; message: string } {
  const statusRaw = errorField(error, "status");
  const status = typeof statusRaw === "number" ? statusRaw : undefined;
  const codeRaw = errorField(error, "code");
  const code = typeof codeRaw === "string" ? codeRaw : codeRaw === null ? null : undefined;
  const rawMessage =
    (error instanceof Error && error.message) ||
    (typeof errorField(error, "message") === "string" ? (errorField(error, "message") as string) : "unknown provider error");
  return { status, code, message: sanitizeProviderMessage(rawMessage) };
}

export function wrapProviderError(error: unknown): AdvisorProviderError {
  if (error instanceof AdvisorProviderError) return error;
  const details = providerErrorDetails(error);
  const prefix = details.status != null ? `Advisor API ${details.status}` : "Advisor API";
  const codePart = details.code ? ` ${details.code}` : "";
  return new AdvisorProviderError(`${prefix}${codePart}: ${details.message}`, {
    status: details.status,
    code: details.code,
  });
}

export function isOpenAiAuthFailure(error: unknown): boolean {
  if (error instanceof AdvisorNotConfiguredError) return true;
  const details =
    error instanceof AdvisorProviderError
      ? { status: error.status, code: error.code, message: error.message }
      : providerErrorDetails(error);
  const message = details.message.toLowerCase();
  return details.status === 401 || details.code === "invalid_api_key" || message.includes("invalid_api_key");
}

export function isResponseFormatError(error: unknown): boolean {
  const details =
    error instanceof AdvisorProviderError
      ? { status: error.status, code: error.code, message: error.message }
      : providerErrorDetails(error);
  const message = details.message.toLowerCase();
  const param = errorField(error, "param");
  return (
    param === "response_format" ||
    message.includes("response_format") ||
    message.includes("json_schema") ||
    message.includes("invalid schema")
  );
}

export function advisorClientConfig(): { apiKey: string; baseURL: string } {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) {
    throw new AdvisorNotConfiguredError();
  }
  return {
    apiKey,
    baseURL: XAI_BASE_URL,
  };
}

export function advisorModelName(): string {
  return process.env.XAI_MODEL || DEFAULT_XAI_MODEL;
}

export function createAdvisorClient(): AdvisorChatClient {
  return new OpenAI(advisorClientConfig());
}

async function requestCompletion(
  system: string,
  user: string,
  responseFormat: { type: "json_schema"; json_schema: JsonSchemaFormat } | { type: "json_object" },
  createClient: () => AdvisorChatClient,
) {
  const client = createClient();
  try {
    const response = await client.chat.completions.create({
      model: advisorModelName(),
      temperature: 0.4,
      response_format: responseFormat as any,
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
  } catch (error) {
    if (error instanceof AdvisorNotConfiguredError) throw error;
    throw wrapProviderError(error);
  }
}

async function completeJson(
  system: string,
  user: string,
  schema: JsonSchemaFormat,
  createClient: () => AdvisorChatClient,
) {
  try {
    return await requestCompletion(system, user, {
      type: "json_schema",
      json_schema: schema,
    }, createClient);
  } catch (error) {
    if (error instanceof AdvisorNotConfiguredError) throw error;
    if (isResponseFormatError(error)) {
      return await requestCompletion(system, user, { type: "json_object" }, createClient);
    }
    throw wrapProviderError(error);
  }
}

export class XaiAdvisorProvider implements AdvisorAiProvider {
  constructor(private readonly createClient: () => AdvisorChatClient = createAdvisorClient) {}

  async completeTurn(system: string, user: string): Promise<TurnOutput> {
    const raw = await completeJson(system, user, turnJsonSchema, this.createClient);
    return turnOutputSchema.parse(raw);
  }

  async generateThesis(system: string, user: string): Promise<OwnershipThesis> {
    const raw = await completeJson(system, user, thesisJsonSchema, this.createClient);
    return ownershipThesisSchema.parse(raw);
  }

  async generateBrief(system: string, user: string): Promise<MeetingBrief> {
    const raw = await completeJson(system, user, briefJsonSchema, this.createClient);
    return meetingBriefSchema.parse(raw);
  }
}

export function isAdvisorConfigured(): boolean {
  return Boolean(process.env.XAI_API_KEY);
}

export function createAdvisorProvider(): AdvisorAiProvider {
  return new XaiAdvisorProvider();
}
