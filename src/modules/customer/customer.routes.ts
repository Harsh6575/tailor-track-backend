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
  createCustomerWithMeasurements,
} from "./customer.controller.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { authenticate } from "../../middleware/authenticate.js";

const router = Router();

// Protect all routes
router.use(authenticate);

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management routes (protected)
 */

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers for logged-in user
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: John
 *     responses:
 *       200:
 *         description: List of customers
 *       401:
 *         description: Unauthorized
 */
router.get("/", catchAsync(getCustomersByUserId));

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               gender:
 *                 type: string
 *                 enum: [male, female, other]
 *               address:
 *                 type: string
 *                 example: 123 Main Street
 *     responses:
 *       201:
 *         description: Customer created
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       409:
 *         description: Customer already exists for this user
 */
router.post("/", catchAsync(createCustomer));

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     summary: Get a single customer (with measurements)
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer to retrieve
 *     responses:
 *       200:
 *         description: Returns customer details with measurements
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.get("/:id", catchAsync(getCustomer));

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Harsh Vansjaliya
 *               email:
 *                 type: string
 *                 example: harsh@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               gender:
 *                 type: string
 *                 example: male
 *               address:
 *                 type: string
 *                 example: Rajkot, Gujarat
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.put("/:id", catchAsync(updateCustomer));

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the customer to delete
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Customer not found
 */
router.delete("/:id", catchAsync(deleteCustomer));

/**
 * @swagger
 * /api/customers/with-measurements:
 *   post:
 *     summary: Create a customer along with their measurements
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: "Harsh Vansjaliya"
 *               email:
 *                 type: string
 *                 example: "harsh@example.com"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               gender:
 *                 type: string
 *                 example: "male"
 *               address:
 *                 type: string
 *                 example: "Rajkot, Gujarat"
 *               measurements:
 *                 type: array
 *                 description: List of measurements to attach with the customer
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       example: "shirt"
 *                     data:
 *                       type: object
 *                       description: Measurement data object (custom fields)
 *                       example:
 *                         chest: 38
 *                         length: 28
 *                         sleeve: 24
 *                     notes:
 *                       type: string
 *                       example: "Use soft fabric for fitting"
 *     responses:
 *       201:
 *         description: Customer and measurements created successfully
 *       400:
 *         description: Invalid request data
 *       401:
 *         description: Unauthorized - missing or invalid token
 */
router.post("/with-measurements", catchAsync(createCustomerWithMeasurements));

// 📏 Measurements
/**
 * @swagger
 * /api/customers/measurements:
 *   post:
 *     summary: Add a new measurement for a customer
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               customerId:
 *                 type: string
 *                 example: "e5d8a321-9ab0-4a4a-bd4d-8b7f9ad22a1a"
 *               type:
 *                 type: string
 *                 example: "shirt"
 *               data:
 *                 type: object
 *                 description: Key-value pairs of measurements
 *                 example:
 *                   chest: 40
 *                   sleeve: 24
 *                   length: 29
 *               notes:
 *                 type: string
 *                 example: "Use soft cotton fabric"
 *     responses:
 *       201:
 *         description: Measurement created successfully
 *       400:
 *         description: Invalid data or missing fields
 *       401:
 *         description: Unauthorized
 */
router.post("/measurements", catchAsync(addMeasurement));

/**
 * @swagger
 * /api/customers/measurements/{id}:
 *   get:
 *     summary: Get a specific measurement by ID
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the measurement
 *     responses:
 *       200:
 *         description: Measurement retrieved successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Measurement not found
 */
router.get("/measurements/:id", catchAsync(getMeasurementById));

/**
 * @swagger
 * /api/customers/measurements/{id}:
 *   put:
 *     summary: Update an existing measurement
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the measurement
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               data:
 *                 type: object
 *                 example:
 *                   chest: 42
 *                   sleeve: 25
 *               notes:
 *                 type: string
 *                 example: "Adjusted chest size"
 *     responses:
 *       200:
 *         description: Measurement updated successfully
 *       400:
 *         description: Invalid data
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Measurement not found
 */
router.put("/measurements/:id", catchAsync(updateMeasurement));

/**
 * @swagger
 * /api/customers/measurements/{id}:
 *   delete:
 *     summary: Delete a measurement by ID
 *     tags: [Measurements]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the measurement
 *     responses:
 *       200:
 *         description: Measurement deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Measurement not found
 */
router.delete("/measurements/:id", catchAsync(deleteMeasurement));

export default router;
