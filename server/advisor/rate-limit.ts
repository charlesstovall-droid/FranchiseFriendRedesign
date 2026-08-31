type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { ok: boolean; remaining: number; retryAfterSec: number } {
  const now = Date.now();
  const bucket = buckets.get(options.key) ?? { timestamps: [] };
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < options.windowMs);
  if (bucket.timestamps.length >= options.limit) {
    buckets.set(options.key, bucket);
    const oldest = bucket.timestamps[0] ?? now;
    return {
      ok: false,
      remaining: 0,
      retryAfterSec: Math.max(1, Math.ceil((options.windowMs - (now - oldest)) / 1000)),
    };
  }
  bucket.timestamps.push(now);
  buckets.set(options.key, bucket);
  return {
    ok: true,
    remaining: options.limit - bucket.timestamps.length,
    retryAfterSec: 0,
  };
}

export function clientKey(req: { ip?: string; headers: { [key: string]: unknown } }, scope: string): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    (typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : undefined) ||
    req.ip ||
    "unknown";
  return `${scope}:${ip}`;
}

export function resetRateLimitForTests() {
  buckets.clear();
}
