/**
 * Simple in-memory rate limiter.
 * Limits requests per IP to prevent abuse at the gateway level.
 *
 * Default: 100 requests per 60 seconds per IP.
 * Can be swapped for Redis-backed solution in production.
 */

const requestCounts = new Map();

const WINDOW_MS = 60 * 1000;     // 1 minute window
const MAX_REQUESTS = 100;         // max requests per window

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of requestCounts) {
    if (now - value.windowStart > WINDOW_MS) {
      requestCounts.delete(key);
    }
  }
}, 5 * 60 * 1000);

export const rateLimiter = (req, res, next) => {
  const clientIp = req.ip || req.connection.remoteAddress || "unknown";
  const now = Date.now();

  if (!requestCounts.has(clientIp)) {
    requestCounts.set(clientIp, { count: 1, windowStart: now });
    return next();
  }

  const record = requestCounts.get(clientIp);

  // Reset window if expired
  if (now - record.windowStart > WINDOW_MS) {
    record.count = 1;
    record.windowStart = now;
    return next();
  }

  // Increment and check
  record.count++;

  if (record.count > MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      error: "Too Many Requests",
      message: `Rate limit exceeded. Try again in ${Math.ceil((WINDOW_MS - (now - record.windowStart)) / 1000)} seconds.`,
    });
  }

  next();
};
