import { Request, Response, NextFunction } from "express";
import { CustomerService } from "./customer.service.js";
import { Errors } from "../../utils/AppError.js";

// 👤 Create new customer
export const createCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { fullName, email, phone, gender, address } = req.body;
    const customer = await CustomerService.createCustomer(
      req.user.id,
      fullName,
      email,
      phone,
      gender,
      address
    );
    res.status(201).json({ success: true, customer });
  } catch (err) {
    next(err);
  }
};

// 👤 Get all customers for logged-in user
export const getCustomersByUserId = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("User not authenticated");

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;

    const result = await CustomerService.getCustomersByUserId(req.user.id, page, limit, search);

    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// 👤 Get a single customer (with measurements)
export const getCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { id } = req.params;
    const result = await CustomerService.getCustomerWithMeasurements(req.user.id, id);
    res.status(200).json({ success: true, ...result });
  } catch (err) {
    next(err);
  }
};

// ✏️ Update customer (owned by user)
export const updateCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { id } = req.params;
    const { fullName, email, phone, gender, address } = req.body;
    const customer = await CustomerService.updateCustomer(req.user.id, id, {
      fullName,
      email,
      phone,
      gender,
      address,
    });
    res.status(200).json({ success: true, customer });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete customer (owned by user)
export const deleteCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { id } = req.params;
    const result = await CustomerService.deleteCustomer(req.user.id, id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

// 👤 Create customer and add measurements at same time
export const createCustomerWithMeasurements = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { measurements, ...customerData } = req.body;

    // 1️⃣ Create customer
    const customer = await CustomerService.createCustomer(
      req.user.id,
      customerData.fullName,
      customerData.email,
      customerData.phone,
      customerData.gender,
      customerData.address
    );

    // 2️⃣ Add measurements
    if (measurements && Array.isArray(measurements)) {
      await Promise.all(
        measurements.map((m) =>
          CustomerService.addMeasurement(req.user!.id, customer.id, m.type, m.data, m.notes)
        )
      );
    }

    res.status(201).json({ success: true, customer });
  } catch (err) {
    next(err);
  }
};

// 📏 Add measurement for a customer
export const addMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { customerId, type, data, notes } = req.body;
    const measurement = await CustomerService.addMeasurement(
      req.user.id,
      customerId,
      type,
      data,
      notes
    );
    res.status(201).json({ success: true, measurement });
  } catch (err) {
    next(err);
  }
};

// 📏 Get a specific measurement
export const getMeasurementById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { id } = req.params;
    const measurement = await CustomerService.getMeasurementById(req.user.id, id);
    res.status(200).json({ success: true, measurement });
  } catch (err) {
    next(err);
  }
};

// ✏️ Update measurement
export const updateMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { id } = req.params;
    const { data, notes } = req.body;
    const measurement = await CustomerService.updateMeasurement(req.user.id, id, data, notes);
    res.status(200).json({ success: true, measurement });
  } catch (err) {
    next(err);
  }
};

// 🗑️ Delete measurement
export const deleteMeasurement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) throw Errors.Unauthorized("Not authenticated");

    const { id } = req.params;
    const result = await CustomerService.deleteMeasurement(req.user.id, id);
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};
