import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createProxy } from "./gateway/proxy.js";
import { rateLimiter } from "./gateway/rateLimiter.js";
import { requestLogger } from "./middleware/requestLogger.js";

dotenv.config();

// ========================
// Boot Internal API first
// ========================
import("./app.js");

// ========================
// API Gateway Server
// ========================
const gateway = express();
const PORT = process.env.PORT || 8080;
const INTERNAL_PORT = process.env.INTERNAL_PORT || 3001;
const INTERNAL_TARGET = `localhost:${INTERNAL_PORT}`;

// ========================
// Gateway-Level Middleware
// ========================
gateway.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
gateway.use(requestLogger);
gateway.use(rateLimiter);

// ========================
// Health Check (handled at gateway, no proxy)
// ========================
gateway.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    gateway: "running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ========================
// Proxy ALL other requests to Internal API
// ========================
gateway.use("/", createProxy(INTERNAL_TARGET));

// ========================
// Start Gateway
// ========================
gateway.listen(PORT, () => {
  console.log(`\n🚀 API Gateway running on port ${PORT}`);
  console.log(`   ├── Health: http://localhost:${PORT}/health`);
  console.log(`   └── Proxying to: http://${INTERNAL_TARGET}\n`);
});
