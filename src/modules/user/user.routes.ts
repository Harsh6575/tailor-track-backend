import { Router } from "express";
import { registerUser, loginUser, refreshToken, logoutUser } from "./user.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterUser'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation error
 */
router.post("/register", catchAsync(registerUser));

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Log in an existing user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginUser'
 *     responses:
 *       200:
 *         description: Successful login
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", catchAsync(loginUser));

/**
 * @swagger
 * /api/users/refresh:
 *   post:
 *     summary: Refresh access token using refresh token
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 *       400:
 *         description: Refresh token missing or invalid
 */
router.post("/refresh", catchAsync(refreshToken));

/**
 * @swagger
 * /api/users/logout:
 *   post:
 *     summary: Log out user by invalidating refresh token
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: your_refresh_token_here
 *     responses:
 *       200:
 *         description: Logout successful
 */
router.post("/logout", catchAsync(logoutUser));

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     summary: Get current user profile
 *     description: Returns the authenticated user's details. Requires a valid access token in the Authorization header.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []   # ✅ Tells Swagger this needs Bearer JWT
 *     responses:
 *       200:
 *         description: Successfully retrieved user profile
 *       401:
 *         description: Unauthorized - Missing or invalid token
 */
router.get("/profile", authenticate, (req, res) => {
  res.json({ success: true, user: req.user });
});

export default router;
