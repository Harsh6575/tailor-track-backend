import { pgTable, uuid, varchar, timestamp, text, jsonb } from "drizzle-orm/pg-core";
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

// 👤 Customers table
export const customers = pgTable("customers", {
  ...baseFields,
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  fullName: varchar("full_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 120 }),
  phone: varchar("phone", { length: 20 }),
  gender: varchar("gender", { length: 10 }),
  address: text("address"),
});

// 📏 Measurements table
export const measurements = pgTable("measurements", {
  ...baseFields,
  customerId: uuid("customer_id")
    .notNull()
    .references(() => customers.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 50 }).notNull(), // e.g. shirt, pant, etc.
  data: jsonb("data").notNull(), // flexible JSON for key-value measurements
  notes: text("notes"),
});
