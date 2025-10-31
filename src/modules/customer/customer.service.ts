import { db } from "../../config/db.js";
import { customers, measurements, users } from "../../db/schema.js";
import { and, eq } from "drizzle-orm";
import logger from "../../utils/logger.js";

export const CustomerService = {
  // 👤 Create new customer
  async createCustomer(
    userId: string,
    fullName: string,
    email?: string,
    phone?: string,
    gender?: string,
    address?: string
  ) {
    const [userExists] = await db.select().from(users).where(eq(users.id, userId));
    if (!userExists) throw new Error("User not found");

    const existing = await db
      .select()
      .from(customers)
      .where(and(eq(customers.userId, userId), eq(customers.fullName, fullName)));

    if (existing.length > 0) throw new Error("Customer already exists for this user");

    const [customer] = await db
      .insert(customers)
      .values({ userId, fullName, email, phone, gender, address })
      .returning();

    logger.info(`🧍 Customer created: ${customer.fullName}`);
    return customer;
  },

  // 👤 Get all customers owned by a user
  async getCustomersByUserId(userId: string) {
    const list = await db.select().from(customers).where(eq(customers.userId, userId));
    return list;
  },

  // 👤 Get one customer (only if owned)
  async getCustomerWithMeasurements(userId: string, customerId: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.userId, userId)));

    if (!customer) throw new Error("Customer not found or not authorized");

    const customerMeasurements = await db
      .select()
      .from(measurements)
      .where(eq(measurements.customerId, customerId));

    return { customer, measurements: customerMeasurements };
  },

  // ✏️ Update customer (only if owned)
  async updateCustomer(
    userId: string,
    customerId: string,
    updateData: Partial<{
      fullName: string;
      email: string;
      phone: string;
      gender: string;
      address: string;
    }>
  ) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.userId, userId)));

    if (!customer) throw new Error("Customer not found or not authorized");

    const [updated] = await db
      .update(customers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(customers.id, customerId))
      .returning();

    logger.info(`✏️ Customer updated: ${updated.fullName}`);
    return updated;
  },

  // 🗑️ Delete customer (only if owned)
  async deleteCustomer(userId: string, customerId: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.userId, userId)));

    if (!customer) throw new Error("Customer not found or not authorized");

    await db.delete(customers).where(eq(customers.id, customerId));
    logger.info(`🗑️ Customer deleted: ${customer.fullName}`);

    return { success: true };
  },

  // 📏 Add measurement (only if customer owned)
  async addMeasurement(
    userId: string,
    customerId: string,
    type: string,
    data: Record<string, unknown>,
    notes?: string
  ) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.userId, userId)));

    if (!customer) throw new Error("Customer not found or not authorized");

    const [measurement] = await db
      .insert(measurements)
      .values({ customerId, type, data, notes })
      .returning();

    logger.info(`📏 Measurement added for ${customer.fullName}`);
    return measurement;
  },

  // ✏️ Update measurement (only if belongs to user)
  async updateMeasurement(
    userId: string,
    measurementId: string,
    data: Record<string, unknown>,
    notes?: string
  ) {
    const [measurement] = await db
      .select()
      .from(measurements)
      .where(eq(measurements.id, measurementId));
    if (!measurement) throw new Error("Measurement not found");

    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, measurement.customerId), eq(customers.userId, userId)));
    if (!customer) throw new Error("Not authorized to modify this measurement");

    const [updated] = await db
      .update(measurements)
      .set({ data, notes, updatedAt: new Date() })
      .where(eq(measurements.id, measurementId))
      .returning();

    logger.info(`✏️ Measurement updated: ${updated.id}`);
    return updated;
  },

  // 🗑️ Delete measurement (only if belongs to user)
  async deleteMeasurement(userId: string, measurementId: string) {
    const [measurement] = await db
      .select()
      .from(measurements)
      .where(eq(measurements.id, measurementId));
    if (!measurement) throw new Error("Measurement not found");

    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, measurement.customerId), eq(customers.userId, userId)));
    if (!customer) throw new Error("Not authorized to delete this measurement");

    await db.delete(measurements).where(eq(measurements.id, measurementId));
    logger.info(`🗑️ Measurement deleted: ${measurement.id}`);

    return { success: true };
  },

  // 🔍 Get measurement by ID (only if belongs to user)
  async getMeasurementById(userId: string, measurementId: string) {
    const [measurement] = await db
      .select()
      .from(measurements)
      .where(eq(measurements.id, measurementId));
    if (!measurement) throw new Error("Measurement not found");

    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, measurement.customerId), eq(customers.userId, userId)));
    if (!customer) throw new Error("Not authorized to view this measurement");

    return measurement;
  },
};
