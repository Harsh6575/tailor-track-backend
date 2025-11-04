import { beforeAll, afterAll } from "vitest";
import { execSync } from "child_process";
import { Client } from "pg";
import logger from "../utils/logger.js";
import dotenv from "dotenv";
import path from "path";
import { db } from "../config/db.js";

const envFile = ".env.test";
dotenv.config({ path: path.resolve(process.cwd(), envFile) });

async function setupTestDatabase() {
  // Extract database name from DATABASE_URL
  const dbUrl = process.env.DATABASE_URL as string;
  const dbName = dbUrl.split("/").pop()?.split("?")[0];

  // Connect to postgres database (not the test db) to create/drop databases
  const baseUrl = dbUrl.substring(0, dbUrl.lastIndexOf("/"));
  const client = new Client({
    connectionString: `${baseUrl}/postgres`,
  });

  try {
    await client.connect();

    // Terminate active connections to the test database
    logger.info(`🔌 Terminating connections to ${dbName}...`);
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
        AND pid <> pg_backend_pid();
    `);

    // Drop database if exists
    logger.info(`🗑️  Dropping database ${dbName} if exists...`);
    await client.query(`DROP DATABASE IF EXISTS ${dbName};`);

    // Create fresh database
    logger.info(`🔨 Creating database ${dbName}...`);
    await client.query(`CREATE DATABASE ${dbName};`);

    logger.info(`✅ Database ${dbName} ready!`);
  } catch (error) {
    logger.error(`❌ Database setup failed:`, error);
    throw error;
  } finally {
    await client.end();
  }
}

async function teardownTestDatabase() {
  const dbUrl = process.env.DATABASE_URL as string;
  const dbName = dbUrl.split("/").pop()?.split("?")[0];

  const baseUrl = dbUrl.substring(0, dbUrl.lastIndexOf("/"));
  const client = new Client({
    connectionString: `${baseUrl}/postgres`,
  });

  try {
    await client.connect();

    // Terminate active connections to the test database
    logger.info(`🔌 Terminating connections to ${dbName}...`);
    await client.query(`
      SELECT pg_terminate_backend(pg_stat_activity.pid)
      FROM pg_stat_activity
      WHERE pg_stat_activity.datname = '${dbName}'
        AND pid <> pg_backend_pid();
    `);

    // Drop the test database
    logger.info(`🗑️  Dropping test database ${dbName}...`);
    await client.query(`DROP DATABASE IF EXISTS ${dbName};`);

    logger.info(`✅ Test database cleaned up!`);
  } catch (error) {
    logger.error(`❌ Database cleanup failed:`, error);
    // Don't throw - cleanup failure shouldn't fail tests
  } finally {
    await client.end();
  }
}

beforeAll(async () => {
  logger.info("🧱 Setting up test database...");

  // Create the database first
  await setupTestDatabase();

  // Then run migrations (non-interactive for tests)
  execSync("NODE_ENV=test pnpm drizzle:migrate:test", { stdio: "inherit" });
});

afterAll(async () => {
  logger.info("🧹 Tests complete — cleaning up...");

  // Close database connections first
  await db.$client.end();

  // Then drop the database
  await teardownTestDatabase();
});
