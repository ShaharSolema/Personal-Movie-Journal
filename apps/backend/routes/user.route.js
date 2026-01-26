import { Router } from "express";
import { loginUser, registerUser, logoutUser, updateUser, getCurrentUser } from "../controllers/user.controller.js";
import authRequired from "../middleware/auth.middleware.js";

const router = Router();
// Public auth endpoints.
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
// Protected profile endpoints.
router.put("/update",authRequired, updateUser);
router.get("/me", authRequired, getCurrentUser);

export default router;
