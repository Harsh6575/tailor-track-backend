import { Router } from "express";
import {
  createCustomer,
  getCustomersByUserId,
  getCustomer,
  updateCustomer,
  deleteCustomer,
  addMeasurement,
  getMeasurementById,
  updateMeasurement,
  deleteMeasurement,
} from "./customer.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// Protect all routes
router.use(authenticate);

// 👤 Customers
router.post("/", catchAsync(createCustomer));
router.get("/", catchAsync(getCustomersByUserId));
router.get("/:id", catchAsync(getCustomer));
router.put("/:id", catchAsync(updateCustomer));
router.delete("/:id", catchAsync(deleteCustomer));

// 📏 Measurements
router.post("/measurements", catchAsync(addMeasurement));
router.get("/measurements/:id", catchAsync(getMeasurementById));
router.put("/measurements/:id", catchAsync(updateMeasurement));
router.delete("/measurements/:id", catchAsync(deleteMeasurement));

export default router;
