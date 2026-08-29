import express from "express";

import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../controllers/event.controller.js";

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
  createEventSchema,
  updateEventSchema,
} from "../validators/event.validator.js";

const router = express.Router();


// GET ALL EVENTS
router.get(
  "/",
  getEvents
);


// GET EVENT BY ID
router.get(
  "/:id",
  getEventById
);


// CREATE EVENT
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("poster"),
  validate(createEventSchema),
  createEvent
);


// UPDATE EVENT
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("poster"),
  validate(updateEventSchema),
  updateEvent
);


// DELETE EVENT
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteEvent
);


export default router;