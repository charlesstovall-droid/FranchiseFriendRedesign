import { randomBytes, scrypt as scryptCb, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCb);

export function createOpaqueToken(bytes = 24): string {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function hashPassword(password: string, salt?: string): Promise<{ hash: string; salt: string }> {
  const useSalt = salt || randomBytes(16).toString("hex");
  const derived = (await scrypt(password, useSalt, 64)) as Buffer;
  return { hash: derived.toString("hex"), salt: useSalt };
}

export async function verifyPassword(password: string, hash: string, salt: string): Promise<boolean> {
  const derived = (await scrypt(password, salt, 64)) as Buffer;
  const expected = Buffer.from(hash, "hex");
  if (derived.length !== expected.length) return false;
  return timingSafeEqual(derived, expected);
}

export function getAppBaseUrl(req?: { headers?: { host?: string; "x-forwarded-proto"?: string } }): string {
  if (process.env.APP_BASE_URL) {
    return process.env.APP_BASE_URL.replace(/\/$/, "");
  }
  if (req?.headers?.host) {
    const proto = req.headers["x-forwarded-proto"] || (process.env.NODE_ENV === "production" ? "https" : "http");
    return `${proto}://${req.headers.host}`;
  }
  return "https://www.charlesstovall.com";
}
