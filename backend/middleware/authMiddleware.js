import jwt from "jsonwebtoken";

/**
 * Middleware to extract user email from JWT token in cookies.
 * Sets req.userEmail if a valid token is found.
 * Does NOT block requests without tokens — they proceed as 'guest'.
 */
export const extractUser = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.userEmail = decoded.email;
    }
  } catch (err) {
    // Token invalid or expired, continue without user email
  }
  next();
};
