import express from "express";

import {
  listArtists,
  getArtist,
  getArtistEventList,
  getArtistSongList,
  listEvents,
  getEvent,
  getEventSongList,
  getEventTicketList,
  getEventLocationDetail,
  listLocations,
  getLocation,
  getLocationEventList,
  listSongs,
  getSong,
  getStats,
} from "../controllers/dummyConcert.controller.js";

const router = express.Router();


// =========================================
// STATS
// =========================================

router.get(
  "/stats",
  getStats
);


// =========================================
// ARTIST
// =========================================

// GET ALL ARTISTS
router.get(
  "/artists",
  listArtists
);


// GET ARTIST BY SLUG
router.get(
  "/artists/:slug",
  getArtist
);


// GET EVENTS BY ARTIST
router.get(
  "/artists/:slug/events",
  getArtistEventList
);


// GET SONGS BY ARTIST
router.get(
  "/artists/:slug/songs",
  getArtistSongList
);


// =========================================
// EVENTS
// =========================================

// GET ALL EVENTS
router.get(
  "/events",
  listEvents
);


// GET EVENT BY SLUG
router.get(
  "/events/:slug",
  getEvent
);


// GET SETLIST (lagu + artist) OF EVENT
router.get(
  "/events/:slug/songs",
  getEventSongList
);


// GET TICKET CATEGORIES OF EVENT
router.get(
  "/events/:slug/tickets",
  getEventTicketList
);


// GET LOCATION OF EVENT
router.get(
  "/events/:slug/location",
  getEventLocationDetail
);


// =========================================
// LOCATIONS
// =========================================

// GET ALL LOCATIONS
router.get(
  "/locations",
  listLocations
);


// GET LOCATION BY SLUG
router.get(
  "/locations/:slug",
  getLocation
);


// GET EVENTS AT LOCATION
router.get(
  "/locations/:slug/events",
  getLocationEventList
);


// =========================================
// SONGS
// =========================================

// GET ALL SONGS
router.get(
  "/songs",
  listSongs
);


// GET SONG BY SLUG
router.get(
  "/songs/:slug",
  getSong
);


export default router;
