import { pgTable, uuid, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// 🧱 Base fields shared by all tables
export const baseFields = {
  id: uuid("id").defaultRandom().primaryKey(),
  createdAt: timestamp("created_at")
    .default(sql`NOW()`)
    .notNull(),
  updatedAt: timestamp("updated_at")
    .default(sql`NOW()`)
    .notNull(),
};

// 👤 Users table
export const users = pgTable("users", {
  ...baseFields,
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 120 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  isActive: boolean("is_active").default(true).notNull(),
});

// 🔐 Refresh Tokens table
export const userTokens = pgTable("user_tokens", {
  ...baseFields,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  refreshToken: varchar("refresh_token", { length: 500 }).notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});
