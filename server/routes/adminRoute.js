import { Router } from "express";
import multer from "multer";
import { postProducts } from "../controller/adminController.js";

// Configure multer storage
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage: storage });

const router = Router();

// Route to handle product uploads with file
router.post("/product", upload.single("image"), postProducts);

export { router as adminRoutes };
