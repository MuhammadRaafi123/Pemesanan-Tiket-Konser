import express from "express";
import { createOfflineOrder } from "../controllers/adminOrder.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import { createOfflineOrderSchema } from "../validators/order.validator.js";

const router = express.Router();

router.post("/orders/offline", authenticate, authorize("admin"), validate(createOfflineOrderSchema), createOfflineOrder);

export default router;
