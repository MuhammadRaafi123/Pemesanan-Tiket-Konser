import express from "express";

import {
  getArtists,
  getArtistById,
  createArtist,
  updateArtist,
  deleteArtist,
} from "../controllers/artist.controller.js";

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
  createArtistSchema,
  updateArtistSchema,
} from "../validators/artist.validator.js";

const router = express.Router();


// GET ALL ARTISTS
router.get(
  "/",
  getArtists
);


// GET ARTIST BY ID
router.get(
  "/:id",
  getArtistById
);


// CREATE ARTIST
router.post(
  "/",
  authenticate,
  authorize("admin"),
  upload.single("photo"),
  validate(createArtistSchema),
  createArtist
);


// UPDATE ARTIST
router.put(
  "/:id",
  authenticate,
  authorize("admin"),
  upload.single("photo"),
  validate(updateArtistSchema),
  updateArtist
);


// DELETE ARTIST
router.delete(
  "/:id",
  authenticate,
  authorize("admin"),
  deleteArtist
);


export default router;