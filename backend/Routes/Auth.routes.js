import { Router } from "express";
import { authMiddleware } from "../middleware/Auth.middleware.js";
import {
  login, signup, logout, getMe, updateMe, changePassword,
  loginWithGoogle, loginWithGoogle_CreateUser,
} from "../Controler/Auth.controler.js";

const router = Router();

// Public routes
router.post("/login", login);
router.post("/signup", signup);
router.post("/register", signup);   // alias — frontend calls /auth/register
router.post("/logout", logout);
router.post("/google", loginWithGoogle);
router.post("/google/create", loginWithGoogle_CreateUser);

// Protected routes
router.get("/me", authMiddleware, getMe);
router.put("/me", authMiddleware, updateMe);
router.put("/change-password", authMiddleware, changePassword);

export default router;