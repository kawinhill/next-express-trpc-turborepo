import { Router } from "express";
import { TestController } from "../controllers/test.controller";

const router = Router();

// GET /test - Test endpoint
router.get("/", TestController.getTest);

// GET /test/health - Health check for test service
router.get("/health", TestController.getHealth);

export default router;
