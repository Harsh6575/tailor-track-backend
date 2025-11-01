import { Router } from "express";
import userRoutes from "../modules/user/user.routes.js";
import customerRoutes from "../modules/customer/customer.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send("API root is working 🚀");
});

router.use("/users", userRoutes);
router.use("/customers", customerRoutes);

export default router;
