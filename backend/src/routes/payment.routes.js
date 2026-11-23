import express from "express";

import {
  createPayment,
  getPaymentByOrderId,
  verifyPayment,
  getLocalPaymentPreview,
  getLocalPaymentQr,
  simulateLocalPayment,
} from "../controllers/payment.controller.js";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/role.middleware.js";

import {
  paymentUpload,
} from "../middlewares/upload.middleware.js";

import {
  validate,
} from "../middlewares/validate.middleware.js";

import {
  createPaymentSchema,
  verifyPaymentSchema,
  localPaymentSimulationSchema,
} from "../validators/payment.validator.js";

const router = express.Router();

router.get("/local-simulation/preview", getLocalPaymentPreview);
router.get("/local-simulation/:orderId/qr", authenticate, getLocalPaymentQr);
router.post("/local-simulation/confirm", validate(localPaymentSimulationSchema), simulateLocalPayment);


// CREATE PAYMENT
router.post(
  "/",
  authenticate,
  paymentUpload.single("proof_image"),
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
