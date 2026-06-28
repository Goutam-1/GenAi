import { Router } from "express";
import {
  getTextConversations,
  getImageConversations,
  getResumeConversations,
  getConversation,
  deleteConversation,
} from "../controllers/conversationController.js";

const router = Router();

router.get("/conversations/text", getTextConversations);
router.get("/conversations/image", getImageConversations);
router.get("/conversations/resume", getResumeConversations);
router.get("/conversation/:id", getConversation);
router.delete("/conversation/:id", deleteConversation);

export default router;
