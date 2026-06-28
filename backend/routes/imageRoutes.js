import { Router } from "express";
import { generateImage, generateImageHF } from "../controllers/imageController.js";

const router = Router();

router.get("/image", generateImage);
router.get("/img", generateImageHF);

export default router;
