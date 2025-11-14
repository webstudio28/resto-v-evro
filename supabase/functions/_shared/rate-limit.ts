/**
 * Simple in-memory rate limiter (for Edge Functions)
 * In production, consider using Redis or Supabase Realtime for distributed rate limiting
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

/**
 * Check if request should be rate limited
 * @param key - Unique identifier (IP + device ID, or just IP)
 * @param maxRequests - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns true if rate limited, false otherwise
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = 60 * 1000 // 1 minute default
): boolean {
  const now = Date.now()
  const entry = rateLimitStore.get(key)

  if (!entry || entry.resetAt < now) {
    // Create new entry or reset expired entry
    rateLimitStore.set(key, {
      count: 1,
      resetAt: now + windowMs,
    })
    return false
  }

  if (entry.count >= maxRequests) {
    return true // Rate limited
  }

  // Increment count
  entry.count++
  rateLimitStore.set(key, entry)
  return false
}

/**
 * Clean up expired entries periodically (call this in a cron or on each request)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now()
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetAt < now) {
      rateLimitStore.delete(key)
    }
  }
}

