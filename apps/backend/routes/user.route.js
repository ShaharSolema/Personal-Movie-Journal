import { Router } from "express";
import { loginUser,registerUser,logoutUser,updateUser,getCurrentUser } from "../controllers/user.controller";
import authRequired from "../middleware/auth.middleware.js";

const router = Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.put("/update",authRequired, updateUser);
router.get("/me", getCurrentUser);

export default router;