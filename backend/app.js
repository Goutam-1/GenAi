import express from "express";
import cookieparser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import { extractUser } from "./middleware/authMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { requestLogger } from "./middleware/requestLogger.js";
import routes from "./routes/index.js";

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ========================
// Global Middleware
// ========================
app.use(cookieparser());
app.use(cors({
  origin: "http://localhost:5173", // frontend URL
  credentials: true,               // allow cookies
}));
app.use(express.json());
app.use(requestLogger);

// Extract user email from JWT token (non-blocking)
app.use(extractUser);

// ========================
// Mount All Routes
// ========================
app.use(routes);

// ========================
// Global Error Handler (must be last)
// ========================
app.use(errorHandler);

// ========================
// Start Internal Server
// ========================
const INTERNAL_PORT = process.env.INTERNAL_PORT || 3001;

app.listen(INTERNAL_PORT, () => {
  console.log(`🔧 Internal API running on port ${INTERNAL_PORT}`);
});

export default app;
