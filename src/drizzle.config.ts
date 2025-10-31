import { defineConfig } from "drizzle-kit";
import "dotenv/config";

export default defineConfig({
  schema: "./src/db/schema.ts",
  out: "./src/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
    ssl: false,
  },
  // dbCredentials: {
  //   host: process.env.DB_HOST ?? "localhost",
  //   port: Number(process.env.DB_PORT ?? 5432),
  //   user: process.env.POSTGRES_USER ?? "postgres",
  //   password: process.env.POSTGRES_PASSWORD ?? "postgres",
  //   database: process.env.POSTGRES_DB ?? "tailor_db",
  //   ssl: false,
  // },
  verbose: true,
  strict: true,
});
