import { Router } from "express";
import upload from "../utils/multerConfig.js";
import { analyzeResume } from "../controllers/resumeController.js";

const router = Router();

router.post("/analyze-resume", upload.single("resume"), analyzeResume);

export default router;
