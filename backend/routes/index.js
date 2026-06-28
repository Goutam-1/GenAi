import { Router } from "express";
import authRoutes from "./authRoutes.js";
import chatRoutes from "./chatRoutes.js";
import imageRoutes from "./imageRoutes.js";
import resumeRoutes from "./resumeRoutes.js";
import conversationRoutes from "./conversationRoutes.js";
import adminRoutes from "./adminRoutes.js";
import passwordRoutes from "./passwordRoutes.js";

/**
 * Route aggregator — mounts all route modules onto a single router.
 */
const router = Router();

router.use(authRoutes);
router.use(chatRoutes);
router.use(imageRoutes);
router.use(resumeRoutes);
router.use(conversationRoutes);
router.use(adminRoutes);
router.use(passwordRoutes);

export default router;
