import request from "supertest";
import app from "../app.js";

import { describe, it, expect } from "vitest";

describe("App Health Check", () => {
  it("should return ok on /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});
