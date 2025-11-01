import { Request, Response } from "express";
import { UserService } from "./user.service.js";
import { registerSchema, loginSchema } from "./user.schema.js";

export const registerUser = async (req: Request, res: Response) => {
  const data = registerSchema.parse(req.body);
  const user = await UserService.createUser(data);
  res.status(201).json({ success: true, user });
};

export const loginUser = async (req: Request, res: Response) => {
  const data = loginSchema.parse(req.body);
  const result = await UserService.loginUser(data);
  res.status(200).json({ success: true, message: "Login successful", ...result });
};

export const refreshToken = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new Error("Refresh token required");
  const tokens = await UserService.refreshToken(refreshToken);
  res.status(200).json({ success: true, ...tokens });
};

export const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw new Error("Refresh token required");
  const result = await UserService.logoutUser(refreshToken);
  res.status(200).json(result);
};
