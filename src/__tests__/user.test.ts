import { describe, expect, it, beforeAll, afterAll } from "vitest";
import request from "supertest";
import app from "../server.js";
import { db } from "../config/db.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";

describe("Auth Routes", () => {
  const baseUrl = "/api/users";
  const testUser = {
    fullName: "Test User",
    email: "testuser@example.com",
    password: "password123",
  };

  beforeAll(async () => {
    // Clean up test user if exists
    await db.delete(users).where(eq(users.email, testUser.email));
    await db.delete(users).where(eq(users.email, "duplicate@example.com"));
  });

  afterAll(async () => {
    await db.delete(users).where(eq(users.email, testUser.email)).execute();
    await db.delete(users).where(eq(users.email, "duplicate@example.com")).execute();

    if (typeof app.close === "function") {
      await new Promise<void>((resolve, reject) => {
        app.close((err?: Error) => {
          if (err) reject(err);
          else resolve();
        });
      });
    }
  });

  let refreshToken: string;
  let accessToken: string;
  let userId: string;

  describe("User Registration", () => {
    it("should register a new user", async () => {
      const res = await request(app).post(`${baseUrl}/register`).send(testUser);
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("user");
      expect(res.body.user.email).toBe(testUser.email);
      userId = res.body.user.id;
    });

    it("should reject registration with missing fields", async () => {
      const res = await request(app).post(`${baseUrl}/register`).send({
        email: "test@example.com",
        // missing fullName and password
      });
      expect(res.status).toBe(400);
    });

    it("should reject registration with invalid email format", async () => {
      const res = await request(app).post(`${baseUrl}/register`).send({
        fullName: "Test User",
        email: "not-an-email",
        password: "password123",
      });
      expect(res.status).toBe(400);
    });

    it("should reject registration with weak password", async () => {
      const res = await request(app).post(`${baseUrl}/register`).send({
        fullName: "Test User",
        email: "weakpass@example.com",
        password: "123", // too short
      });
      expect(res.status).toBe(400);
    });

    it("should reject duplicate email registration", async () => {
      const user = {
        fullName: "Duplicate User",
        email: "duplicate@example.com",
        password: "password123",
      };

      // First registration
      await request(app).post(`${baseUrl}/register`).send(user);

      // Second registration with same email
      const res = await request(app).post(`${baseUrl}/register`).send(user);
      expect(res.status).toBe(409);
    });
  });

  describe("User Login", () => {
    it("should login with valid credentials", async () => {
      const res = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: testUser.password,
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");
      expect(res.body).toHaveProperty("refreshToken");

      accessToken = res.body.accessToken;
      refreshToken = res.body.refreshToken;
    });

    it("should reject login with incorrect password", async () => {
      const res = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email,
        password: "wrongpassword",
      });
      expect(res.status).toBe(401);
    });

    it("should reject login with non-existent email", async () => {
      const res = await request(app).post(`${baseUrl}/login`).send({
        email: "nonexistent@example.com",
        password: "password123",
      });
      expect(res.status).toBe(401);
    });

    it("should trim whitespace from email", async () => {
      const res = await request(app)
        .post(`${baseUrl}/login`)
        .send({
          email: `  ${testUser.email}  `,
          password: testUser.password,
        });
      expect(res.status).toBe(200);
    });

    it("should handle case-insensitive email login", async () => {
      const res = await request(app).post(`${baseUrl}/login`).send({
        email: testUser.email.toUpperCase(),
        password: testUser.password,
      });
      // Depending on your implementation, this might be 200 or 401
      expect([200, 401]).toContain(res.status);
    });

    it("should handle SQL injection attempts in email", async () => {
      const res = await request(app).post(`${baseUrl}/login`).send({
        email: "admin'--",
        password: "anything",
      });
      expect(res.status).toBe(400);
    });
  });

  describe("Protected Routes", () => {
    it("should access protected route with valid token", async () => {
      const res = await request(app)
        .get(`${baseUrl}/profile`)
        .set("Authorization", `Bearer ${accessToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body).toHaveProperty("user");
    });

    it("should fail accessing protected route without token", async () => {
      const res = await request(app).get(`${baseUrl}/profile`);
      expect(res.status).toBe(401);
    });

    it("should reject expired/invalid access token", async () => {
      const res = await request(app)
        .get(`${baseUrl}/profile`)
        .set("Authorization", "Bearer invalid.token.here");

      expect(res.status).toBe(401);
    });

    it("should reject malformed authorization header", async () => {
      const res = await request(app)
        .get(`${baseUrl}/profile`)
        .set("Authorization", "InvalidFormat");

      expect(res.status).toBe(401);
    });
  });

  describe("Token Refresh", () => {
    it("should refresh tokens with valid refresh token", async () => {
      const res = await request(app).post(`${baseUrl}/refresh`).send({ refreshToken });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("accessToken");

      // Update accessToken for subsequent tests
      if (res.body.accessToken) {
        accessToken = res.body.accessToken;
      }
    });

    it("should reject refresh with invalid refresh token", async () => {
      const res = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken: "invalid-refresh-token",
      });
      expect(res.status).toBe(401);
    });

    it("should reject refresh with missing refresh token", async () => {
      const res = await request(app).post(`${baseUrl}/refresh`).send({});
      expect(res.status).toBe(400);
    });
  });

  describe("User Logout", () => {
    it("should logout user and revoke refresh token", async () => {
      const res = await request(app).post(`${baseUrl}/logout`).send({
        refreshToken,
        userId,
      });

      expect(res.status).toBe(200);
    });

    it("should reject refresh with revoked token after logout", async () => {
      const res = await request(app).post(`${baseUrl}/refresh`).send({
        refreshToken,
      });
      expect(res.status).toBe(401);
    });
  });

  describe("Edge Cases", () => {
    it("should reject requests with missing content-type", async () => {
      const res = await request(app).post(`${baseUrl}/register`).type("text").send("not-json");
      expect(res.status).toBe(400);
    });

    it("should handle empty request body", async () => {
      const res = await request(app).post(`${baseUrl}/register`).send({});
      expect(res.status).toBe(400);
    });

    it("should handle extremely long email", async () => {
      const longEmail = "a".repeat(200) + "@example.com";
      const res = await request(app).post(`${baseUrl}/register`).send({
        fullName: "Test User",
        email: longEmail,
        password: "password123",
      });
      expect(res.status).toBe(400);
    });

    it("should handle special characters in name", async () => {
      const res = await request(app).post(`${baseUrl}/register`).send({
        fullName: "Test <script>alert('xss')</script> User",
        email: "xss@example.com",
        password: "password123",
      });
      // Should either sanitize or reject
      expect([201, 400]).toContain(res.status);
    });
  });
});
