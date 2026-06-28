/**
 * Request logging middleware.
 * Logs HTTP method, URL, status code, and response time for each request.
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();

  // Log after response is finished
  res.on("finish", () => {
    const duration = Date.now() - start;
    const log = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;

    if (res.statusCode >= 400) {
      console.warn(log);
    } else {
      console.log(log);
    }
  });

  next();
};
