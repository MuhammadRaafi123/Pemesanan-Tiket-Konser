import express from "express";

import {
  getDashboard,
} from "../controllers/dashboard.controller.js";

import {
  authenticate,
} from "../middlewares/auth.middleware.js";

import {
  authorize,
} from "../middlewares/role.middleware.js";

const router = express.Router();


// GET DASHBOARD
router.get(
  "/",
  authenticate,
  authorize("admin"),
  getDashboard
);


export default router;