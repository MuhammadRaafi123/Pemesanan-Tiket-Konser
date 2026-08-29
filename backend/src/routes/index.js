import express from "express";

import authRoutes from "./auth.routes.js";
import artistRoutes from "./artist.routes.js";
import eventRoutes from "./event.routes.js";
import ticketCategoryRoutes from "./ticketCategory.routes.js";
import orderRoutes from "./order.routes.js";
import paymentRoutes from "./payment.routes.js";
import dashboardRoutes from "./dashboard.routes.js";

const router = express.Router();


router.use(
  "/auth",
  authRoutes
);

router.use(
  "/artists",
  artistRoutes
);

router.use(
  "/events",
  eventRoutes
);

router.use(
  "/tickets",
  ticketCategoryRoutes
);

router.use(
  "/orders",
  orderRoutes
);

router.use(
  "/payments",
  paymentRoutes
);

router.use(
  "/dashboard",
  dashboardRoutes
);


export default router;