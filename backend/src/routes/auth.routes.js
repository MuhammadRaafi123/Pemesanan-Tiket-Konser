import express from "express";

import {
  register,
  login,
  getProfile,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  validate,
} from "../middlewares/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "../validators/auth.validator.js";


const router =
  express.Router();


// =====================================================
// REGISTER
// =====================================================

router.post(
  "/register",
  validate(registerSchema),
  register
);


// =====================================================
// LOGIN
// =====================================================

router.post(
  "/login",
  validate(loginSchema),
  login
);


// =====================================================
// PROFILE
// =====================================================

router.get(
  "/profile",
  authenticate,
  getProfile
);


// =====================================================
// FORGOT PASSWORD
// =====================================================

router.post(
  "/forgot-password",
  validate(
    forgotPasswordSchema
  ),
  forgotPassword
);


// =====================================================
// RESET PASSWORD
// =====================================================

router.post(
  "/reset-password",
  validate(
    resetPasswordSchema
  ),
  resetPassword
);


export default router;