import express from "express";
import { getAdminUsers } from "../controllers/adminUser.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { authorize } from "../middlewares/role.middleware.js";

const router = express.Router();

router.get("/", authenticate, authorize("admin"), getAdminUsers);

export default router;
