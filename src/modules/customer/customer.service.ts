import { db } from "../../config/db.js";
import { customers, measurements, users } from "../../db/schema.js";
import { and, count, desc, eq, ilike, or } from "drizzle-orm";
import logger from "../../utils/logger.js";
import { Errors } from "../../utils/AppError.js";

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
    if (!userExists) throw Errors.NotFound("User not found");

    const existing = await db
      .select()
      .from(customers)
      .where(and(eq(customers.userId, userId), eq(customers.fullName, fullName)));

    if (existing.length > 0) throw Errors.Conflict("Customer already exists for this user");

    const [customer] = await db
      .insert(customers)
      .values({ userId, fullName, email, phone, gender, address })
      .returning();

    logger.info(`🧍 Customer created: ${customer.fullName}`);
    return customer;
  },

  // 👤 Get all customers owned by a user
  async getCustomersByUserId(
    userId: string,
    page: number = 1,
    limit: number = 10,
    search?: string
  ) {
    const offset = (page - 1) * limit;

    // Build where conditions properly
    const baseCondition = eq(customers.userId, userId);

    const whereCondition =
      search && search.trim()
        ? and(
            baseCondition,
            or(
              ilike(customers.fullName, `%${search.trim()}%`),
              ilike(customers.phone, `%${search.trim()}%`)
            )
          )
        : baseCondition;

    // Get paginated results
    const list = await db
      .select({
        id: customers.id,
        fullName: customers.fullName,
        phone: customers.phone,
      })
      .from(customers)
      .where(whereCondition)
      .limit(limit)
      .offset(offset)
      .orderBy(desc(customers.createdAt));

    // Get total count for pagination
    const countResult = await db.select({ total: count() }).from(customers).where(whereCondition);

    const totalCount = Number(countResult[0]?.total || 0);

    return {
      customers: list,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  },

  // 👤 Get one customer (with measurements)
  async getCustomerWithMeasurements(userId: string, customerId: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.userId, userId)));

    if (!customer) throw Errors.NotFound("Customer not found or not authorized");

    const customerMeasurements = await db
      .select()
      .from(measurements)
      .where(eq(measurements.customerId, customerId));

    return { customer, measurements: customerMeasurements };
  },

  // ✏️ Update customer
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

    if (!customer) throw Errors.Forbidden("Not authorized to update this customer");

    const [updated] = await db
      .update(customers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(customers.id, customerId))
      .returning();

    logger.info(`✏️ Customer updated: ${updated.fullName}`);
    return updated;
  },

  // 🗑️ Delete customer
  async deleteCustomer(userId: string, customerId: string) {
    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, customerId), eq(customers.userId, userId)));

    if (!customer) throw Errors.Forbidden("Not authorized to delete this customer");

    await db.delete(customers).where(eq(customers.id, customerId));
    logger.info(`🗑️ Customer deleted: ${customer.fullName}`);

    return { success: true, message: "Customer deleted successfully" };
  },

  // 📏 Add measurement
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

    if (!customer) throw Errors.Forbidden("Not authorized to add measurement for this customer");

    const [measurement] = await db
      .insert(measurements)
      .values({ customerId, type, data, notes })
      .returning();

    logger.info(`📏 Measurement added for ${customer.fullName}`);
    return measurement;
  },

  // ✏️ Update measurement
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

    if (!measurement) throw Errors.NotFound("Measurement not found");

    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, measurement.customerId), eq(customers.userId, userId)));

    if (!customer) throw Errors.Forbidden("Not authorized to modify this measurement");

    const [updated] = await db
      .update(measurements)
      .set({ data, notes, updatedAt: new Date() })
      .where(eq(measurements.id, measurementId))
      .returning();

    logger.info(`✏️ Measurement updated: ${updated.id}`);
    return updated;
  },

  // 🗑️ Delete measurement
  async deleteMeasurement(userId: string, measurementId: string) {
    const [measurement] = await db
      .select()
      .from(measurements)
      .where(eq(measurements.id, measurementId));

    if (!measurement) throw Errors.NotFound("Measurement not found");

    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, measurement.customerId), eq(customers.userId, userId)));

    if (!customer) throw Errors.Forbidden("Not authorized to delete this measurement");

    await db.delete(measurements).where(eq(measurements.id, measurementId));
    logger.info(`🗑️ Measurement deleted: ${measurement.id}`);

    return { success: true, message: "Measurement deleted successfully" };
  },

  // 🔍 Get measurement by ID
  async getMeasurementById(userId: string, measurementId: string) {
    const [measurement] = await db
      .select()
      .from(measurements)
      .where(eq(measurements.id, measurementId));

    if (!measurement) throw Errors.NotFound("Measurement not found");

    const [customer] = await db
      .select()
      .from(customers)
      .where(and(eq(customers.id, measurement.customerId), eq(customers.userId, userId)));

    if (!customer) throw Errors.Forbidden("Not authorized to view this measurement");

    return measurement;
  },
};
