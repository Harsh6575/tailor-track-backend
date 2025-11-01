import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().min(3).max(100),
  email: z.email(),
  password: z.string().min(6).max(64),
  phone: z.string().min(10).max(15).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(64),
});

export type LoginInput = z.infer<typeof loginSchema>;
