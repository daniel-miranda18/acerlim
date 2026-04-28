import { Router } from "express";
import { authController } from "./auth.controller";
import { requireAuth } from "../../shared/middlewares/auth.middleware";

const router = Router();

router.post("/login", authController.login);
router.post("/verify-2fa", authController.verify2FA);
router.post("/resend-2fa", authController.resend2FA);
router.post("/logout", requireAuth, authController.logout);
router.get("/me", requireAuth, authController.me);

export default router;

