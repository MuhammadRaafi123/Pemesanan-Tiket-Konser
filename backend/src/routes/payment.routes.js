import express from "express";

import {
  createPayment,
  getPaymentByOrderId,
  verifyPayment,
} from "../controllers/payment.controller.js";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/role.middleware.js";

import {
  upload,
} from "../middlewares/upload.middleware.js";

import {
  validate,
} from "../middlewares/validate.middleware.js";

import {
  createPaymentSchema,
  verifyPaymentSchema,
} from "../validators/payment.validator.js";

const router = express.Router();


// CREATE PAYMENT
router.post(
  "/",
  authenticate,
  upload.single("proof_image"),
  validate(createPaymentSchema),
  createPayment
);


// GET PAYMENT BY ORDER ID
router.get(
  "/order/:orderId",
  authenticate,
  getPaymentByOrderId
);


// VERIFY PAYMENT - ADMIN
router.patch(
  "/:id/verify",
  authenticate,
  authorize("admin"),
  validate(verifyPaymentSchema),
  verifyPayment
);


export default router;