import { Router } from "express";
import { getDashboard } from "../controllers/adminController.js";

const router = Router();

router.get("/admin/dashboard", getDashboard);

export default router;
