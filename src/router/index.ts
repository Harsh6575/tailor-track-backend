import { Router } from "express";
import userRoutes from "../modules/user/user.routes.js";

const router = Router();

router.get("/", (_req, res) => {
  res.send("API root is working 🚀");
});

router.use("/users", userRoutes);

export default router;
