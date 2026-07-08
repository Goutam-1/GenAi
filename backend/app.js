import express from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { extractUser } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import routes from "./routes/index.js";

dotenv.config();

connectDB();

const app = express();

// ========================
// Global Middleware
// ========================
app.use(cookieparser());

// ❌ REMOVED cors() — gateway handles CORS, not this internal server

app.use(express.json());
app.use(requestLogger);
app.use(extractUser);

app.use(routes);

app.use(errorHandler);

const INTERNAL_PORT = process.env.INTERNAL_PORT || 3001;

app.listen(INTERNAL_PORT, () => {
  console.log(`🔧 Internal API running on port ${INTERNAL_PORT}`);
});

export default app;import express from "express";
import cookieparser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { extractUser } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import routes from "./routes/index.js";

dotenv.config();

connectDB();

const app = express();

// ========================
// Global Middleware
// ========================
app.use(cookieparser());

// ❌ REMOVED cors() — gateway handles CORS, not this internal server

app.use(express.json());
app.use(requestLogger);
app.use(extractUser);

app.use(routes);

app.use(errorHandler);

const INTERNAL_PORT = process.env.INTERNAL_PORT || 3001;

app.listen(INTERNAL_PORT, () => {
  console.log(`🔧 Internal API running on port ${INTERNAL_PORT}`);
});

export default app;