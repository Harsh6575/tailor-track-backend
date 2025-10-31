import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    export interface Request {
      user?: JwtPayload | { id: string; email: string }; // 👈 adjust based on your payload structure
    }
  }
}
