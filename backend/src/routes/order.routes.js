import express from "express";

import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  cancelOrder,
} from "../controllers/order.controller.js";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/role.middleware.js";

import {
  validate,
} from "../middlewares/validate.middleware.js";

import {
  createOrderSchema,
} from "../validators/order.validator.js";

const router = express.Router();


// GET ALL ORDERS - ADMIN
router.get(
  "/",
  authenticate,
  authorize("admin"),
  getAllOrders
);


// GET MY ORDERS
router.get(
  "/my",
  authenticate,
  getMyOrders
);

router.patch(
  "/:id/cancel",
  authenticate,
  cancelOrder
);


// GET ORDER BY ID
router.get(
  "/:id",
  authenticate,
  getOrderById
);


// CREATE ORDER
router.post(
  "/",
  authenticate,
  authorize("customer"),
  validate(createOrderSchema),
  createOrder
);


export default router;