import { eq } from "drizzle-orm";
import { db } from "../../config/db.js";
import { users, userTokens } from "../../db/schema.js";
import { hashPassword, comparePassword } from "../../utils/password.js";
import { generateTokens, verifyRefreshToken } from "../../utils/jwt.js";
import { LoginInput, RegisterInput } from "./user.schema.js";
import logger from "../../utils/logger.js";

export const UserService = {
  // 🧑‍💻 Register user
  async createUser(data: RegisterInput) {
    const existing = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.email, data.email))
      .limit(1);

    if (existing.length > 0) throw new Error("Email already registered");

    const hashedPassword = await hashPassword(data.password);

    const [user] = await db
      .insert(users)
      .values({
        fullName: data.fullName,
        email: data.email,
        password: hashedPassword,
      })
      .returning({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
      });

    logger.info(`📦 User stored in DB: ${user.email}`);
    return user;
  },

  // 🔑 Login user
  async loginUser(data: LoginInput) {
    const [user] = await db.select().from(users).where(eq(users.email, data.email)).limit(1);
    if (!user) throw new Error("Invalid email or password");

    const isValid = await comparePassword(data.password, user.password);
    if (!isValid) throw new Error("Invalid email or password");

    const { accessToken, refreshToken } = generateTokens({
      userId: user.id,
      email: user.email,
    });

    await db.insert(userTokens).values({
      userId: user.id,
      refreshToken,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    logger.info(`🔑 User logged in: ${user.email}`);

    return {
      accessToken,
      refreshToken,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    };
  },

  // ♻️ Refresh token
  // TODO: when logout delete access token from client side too
  async refreshToken(token: string) {
    const payload = verifyRefreshToken(token);

    const [storedToken] = await db
      .select()
      .from(userTokens)
      .where(eq(userTokens.refreshToken, token))
      .limit(1);

    if (!storedToken) throw new Error("Invalid refresh token");

    const { accessToken, refreshToken: newRefreshToken } = generateTokens({
      userId: payload.userId,
      email: payload.email,
    });

    // Replace old token
    await db
      .update(userTokens)
      .set({
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      })
      .where(eq(userTokens.id, storedToken.id));

    return { accessToken, refreshToken: newRefreshToken };
  },

  // 🚪 Logout user
  async logoutUser(token: string) {
    const result = await db.delete(userTokens).where(eq(userTokens.refreshToken, token)).returning({
      id: userTokens.id,
    });

    if (result.length === 0) {
      logger.warn("⚠️ Logout attempted with invalid or already used token");
      return { success: false, message: "Token already invalid or expired" };
    }

    logger.info("👋 User logged out successfully");
    return { success: true };
  },
};
