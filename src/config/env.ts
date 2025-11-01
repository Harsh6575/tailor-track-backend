import dotenv from "dotenv";

const envPath = process.env.ENV_PATH || ".env";
dotenv.config({ path: envPath });

export const env = {
  NODE_ENV: process.env.NODE_ENV ?? "development",
  PORT: Number(process.env.PORT ?? 4000),
  JWT_SECRET: process.env.JWT_SECRET ?? "dev-secret",
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
};
