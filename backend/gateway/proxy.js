import proxy from "express-http-proxy";

/**
 * Creates an express-http-proxy middleware that forwards requests
 * to the internal Express app.
 *
 * @param {string} target - The target host (e.g., "localhost:3001")
 * @returns {Function} Express middleware
 */
export const createProxy = (target) => {
  return proxy(target, {
    // Preserve the original request path
    proxyReqPathResolver: (req) => {
      return req.originalUrl;
    },

    // Forward cookies and headers
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      // Forward all original headers
      proxyReqOpts.headers = { ...proxyReqOpts.headers };
      return proxyReqOpts;
    },

    // Handle proxy errors gracefully
    proxyErrorHandler: (err, res, next) => {
      console.error("[GATEWAY] Proxy error:", err.message);

      if (res.headersSent) {
        return next(err);
      }

      res.status(502).json({
        success: false,
        error: "Bad Gateway",
        message: "The internal service is unavailable. Please try again later.",
      });
    },

    // Parse response body based on content type
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      return proxyResData;
    },

    // Increase timeout for long-running requests (e.g., AI generation)
    timeout: 120000, // 2 minutes
  });
};
