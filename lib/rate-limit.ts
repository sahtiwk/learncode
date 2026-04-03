/**
 * Lightweight in-memory rate limiter for API routes.
 * Uses a sliding window approach per IP address.
 *
 * Note: This resets on serverless cold starts. For production at scale,
 * consider using Redis or an external rate-limiting service.
 */

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically (every 60s)
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 60_000);

interface RateLimitOptions {
  /** Max requests allowed within the interval */
  maxRequests: number;
  /** Time window in milliseconds */
  intervalMs: number;
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
}

export function rateLimit(
  identifier: string,
  options: RateLimitOptions
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  // If no entry or window expired, create new window
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + options.intervalMs,
    });
    return {
      success: true,
      remaining: options.maxRequests - 1,
      resetIn: options.intervalMs,
    };
  }

  // Within window — check limit
  if (entry.count >= options.maxRequests) {
    return {
      success: false,
      remaining: 0,
      resetIn: entry.resetTime - now,
    };
  }

  // Increment and allow
  entry.count++;
  return {
    success: true,
    remaining: options.maxRequests - entry.count,
    resetIn: entry.resetTime - now,
  };
}

/**
 * Extract a client identifier from a Request for rate limiting.
 * Uses x-forwarded-for header (common behind proxies) or falls back to a default.
 */
export function getClientIdentifier(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.headers.get("x-real-ip") || "unknown";
}
