import { z } from "zod";

export const registerSchema = z.object({
  fullName: z.string().trim().min(3, "Name must be at least 3 characters").max(100),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Invalid email format").max(100, "Maximum Length of Email is 100")),
  password: z.string().min(6, "Password must be at least 6 characters").max(64),
  phone: z.string().trim().min(10).max(15).optional(),
});

export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .pipe(z.email("Invalid email format").max(100, "Maximum Length of Email is 100")),
  password: z.string().min(6).max(64),
});

export type LoginInput = z.infer<typeof loginSchema>;
