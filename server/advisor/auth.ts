import type { NextFunction, Request, Response } from "express";
import { hashPassword, verifyPassword } from "./tokens";
import { clientKey, rateLimit } from "./rate-limit";

const EXISTING_ADMIN_EMAIL = "charles@franchisefriend.net";

let cachedHash: { hash: string; salt: string } | null = null;

function adminEmail(): string {
  return (process.env.ADMIN_EMAIL || EXISTING_ADMIN_EMAIL).trim().toLowerCase();
}

type AdvisorSession = {
  isAdmin?: boolean;
  memberId?: string;
  memberEmail?: string;
  memberName?: string;
  advisorAdmin?: boolean;
  advisorAdminEmail?: string;
  regenerate: (cb: (err?: Error) => void) => void;
  save: (cb: (err?: Error) => void) => void;
};

export function isExistingAdminSession(req: Request): boolean {
  const session = req.session as unknown as AdvisorSession;
  if (!session) return false;
  if (session.advisorAdmin) return true;
  if (session.isAdmin) return true;
  if (session.memberId === "admin") return true;
  const email = (session.memberEmail || "").toLowerCase();
  return email === EXISTING_ADMIN_EMAIL || email === adminEmail();
}

export async function verifyAdvisorAdminPassword(email: string, password: string): Promise<boolean> {
  if (email.trim().toLowerCase() !== adminEmail()) return false;
  const configured = process.env.ADMIN_PASSWORD;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredSalt = process.env.ADMIN_PASSWORD_SALT || process.env.SESSION_SECRET || "advisor-admin-salt";
  if (!configured && !configuredHash) return false;
  if (configuredHash) {
    return verifyPassword(password, configuredHash, configuredSalt);
  }
  if (!cachedHash) {
    cachedHash = await hashPassword(configured as string, configuredSalt);
  }
  return verifyPassword(password, cachedHash.hash, cachedHash.salt);
}

export function loginRateOk(req: Request): { ok: boolean; retryAfterSec: number } {
  const result = rateLimit({ key: clientKey(req, "advisor-admin-login"), limit: 8, windowMs: 15 * 60 * 1000 });
  return { ok: result.ok, retryAfterSec: result.retryAfterSec };
}

export function requireAdvisorAdmin(req: Request, res: Response, next: NextFunction) {
  if (isExistingAdminSession(req)) return next();
  return res.status(401).json({ error: "Unauthorized" });
}

export async function establishAdvisorAdminSession(req: Request, email: string): Promise<void> {
  await new Promise<void>((resolve, reject) => {
    req.session.regenerate((err) => {
      if (err) return reject(err);
      const session = req.session as unknown as AdvisorSession;
      session.advisorAdmin = true;
      session.advisorAdminEmail = email;
      session.isAdmin = true;
      session.memberEmail = email;
      session.memberName = "Charles Stovall";
      session.memberId = "admin";
      req.session.save((saveErr) => (saveErr ? reject(saveErr) : resolve()));
    });
  });
}

export function adminConfigured(): { passwordLogin: boolean; existingSession: boolean } {
  return {
    passwordLogin: Boolean(process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD_HASH),
    existingSession: true,
  };
}
