import { Router } from "express";
import {
  register,
  login,
  setup2FA,
  verify2FA,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const authRoutes = Router();

authRoutes.post("/register", register);
authRoutes.post("/login", login);
authRoutes.post("/2fa/setup", protect, setup2FA);
authRoutes.post("/2fa/verify", verify2FA);

export default authRoutes;
