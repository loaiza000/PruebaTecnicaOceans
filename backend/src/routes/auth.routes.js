import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/login", authController.login);
router.get("/verify", verifyToken, authController.verifyToken);
router.get("/profile", verifyToken, authController.getProfile);
router.get("/users", verifyToken, verifyAdmin, authController.getAllUsers);

export default router;
