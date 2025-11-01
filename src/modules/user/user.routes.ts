import { Router } from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "./user.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

router.post("/register", catchAsync(registerUser));
router.post("/login", catchAsync(loginUser));
router.post("/refresh", catchAsync(refreshToken));
router.post("/logout", catchAsync(logoutUser));

// Example protected route
router.get("/profile", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
