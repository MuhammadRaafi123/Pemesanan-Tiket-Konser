import express from "express";

import {
  getTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
} from "../controllers/ticketCategory.controller.js";

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
  createTicketSchema,
  updateTicketSchema,
} from "../validators/ticket.validator.js";

const router = express.Router();


// GET ALL TICKETS
router.get(
  "/",
  getTickets
);


// GET TICKET BY ID
router.get(
  "/:id",
  getTicketById
);


// CREATE TICKET
router.post(
  "/",
  authenticate,
  authorize("admin"),
  validate(createTicketSchema),
  createTicket
);


// UPDATE TICKET
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  validate(updateTicketSchema),
  updateTicket
);


// DELETE TICKET
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteTicket
);


export default router;