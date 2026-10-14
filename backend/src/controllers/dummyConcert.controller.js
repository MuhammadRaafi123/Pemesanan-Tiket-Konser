import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";

import supabase from "../config/supabase.js";

import {
  DEMO_TICKET_CATEGORY_ID_OFFSET,
  findEvent,
  getArtists,
  getArtistDetailBySlug,
  getArtistSongs,
  getArtistEvents,
  getEvents,
  getEventDetailBySlug,
  getEventSetlist,
  getEventTickets,
  getEventLocation,
  getLocations,
  getLocationDetailBySlug,
  getLocationEvents,
  getSongs,
  getSongDetailBySlug,
  getCatalogStats,
} from "../services/dummyConcert.service.js";

const attachLiveInventory = async (events) => {
  const sources = events.map((item) =>
    findEvent(item.slug || item.event?.slug)
  );
  const categoryIds = sources
    .flatMap((event) => event?.ticket_categories || [])
    .map((category) => category.id + DEMO_TICKET_CATEGORY_ID_OFFSET);

  if (categoryIds.length === 0) {
    return events;
  }

  const { data, error } = await supabase
    .from("ticket_categories")
    .select("id, price, quota, remaining, reserved")
    .in("id", categoryIds);

  if (error) {
    throw error;
  }

  const stockById = new Map(
    (data || []).map((category) => [String(category.id), category])
  );

  return events.map((item, index) => {
    const source = sources[index];
    if (!source) return item;

    const ticketCategories = source.ticket_categories.map((category) => {
      const id = category.id + DEMO_TICKET_CATEGORY_ID_OFFSET;
      const live = stockById.get(String(id));

      return {
        ...category,
        id,
        quota: live?.quota ?? 0,
        remaining: live?.remaining ?? 0,
        reserved: live?.reserved ?? 0,
        available: live
          ? Math.max(live.remaining - live.reserved, 0)
          : 0,
        price: live ? Number(live.price) : category.price,
      };
    });
    const availableTickets = ticketCategories.filter(
      (category) => category.available > 0
    );
    const totalAvailable = ticketCategories.reduce(
      (total, category) => total + (category.available || 0),
      0
    );
    const minimumPrice = availableTickets.length > 0
      ? Math.min(...availableTickets.map((category) => category.price))
      : 0;
    const hasStarted = new Date(item.event_date).getTime() <= Date.now();

    return {
      ...item,
      status: hasStarted ? "closed" : item.status,
      min_price: minimumPrice,
      min_price_formatted: new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(minimumPrice),
      total_quota: ticketCategories.reduce(
        (total, category) => total + category.quota,
        0
      ),
      total_remaining: totalAvailable,
      ...(Array.isArray(item.ticket_categories)
        ? {
            ticket_categories: ticketCategories.map((category) => ({
              ...category,
              event_id: item.event?.id || item.id,
              event_slug: source.slug,
            })),
          }
        : {}),
    };
  });
};

const notFound = (
  res,
  message
) => errorResponse(res, message, 404);


// =========================================
// ARTIST
// =========================================

export const listArtists = async (
  req,
  res,
  next
) => {
  try {
    const { items, meta } = getArtists(
      req.query
    );

    return successResponse(
      res,
      "Data artist dummy berhasil diambil",
      {
        items,
        meta,
      }
    );
  } catch (error) {
    next(error);
  }
};


export const getArtist = async (
  req,
  res,
  next
) => {
  try {
    const data = getArtistDetailBySlug(
      req.params.slug
    );

    if (!data) {
      return notFound(
        res,
        "Artist tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Detail artist dummy berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getArtistEventList = async (
  req,
  res,
  next
) => {
  try {
    const items = getArtistEvents(
      req.params.slug
    );

    if (!items) {
      return notFound(
        res,
        "Artist tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Konser milik artist ini berhasil diambil",
      {
        items,
        meta: {
          total: items.length,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};


export const getArtistSongList = async (
  req,
  res,
  next
) => {
  try {
    const items = getArtistSongs(
      req.params.slug
    );

    if (!items) {
      return notFound(
        res,
        "Artist tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Lagu milik artist ini berhasil diambil",
      {
        items,
        meta: {
          total: items.length,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};


// =========================================
// EVENT
// =========================================

export const listEvents = async (
  req,
  res,
  next
) => {
  try {
    const { items, meta } = getEvents(
      req.query
    );
    const liveItems = await attachLiveInventory(items);

    return successResponse(
      res,
      "Data konser dummy berhasil diambil",
      {
        items: liveItems,
        meta,
      }
    );
  } catch (error) {
    next(error);
  }
};


export const getEvent = async (
  req,
  res,
  next
) => {
  try {
    const event = getEventDetailBySlug(
      req.params.slug
    );

    if (!event) {
      return notFound(
        res,
        "Konser tidak ditemukan"
      );
    }

    const [data] = await attachLiveInventory([event]);

    return successResponse(
      res,
      "Detail konser dummy berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getEventSongList = async (
  req,
  res,
  next
) => {
  try {
    const data = getEventSetlist(
      req.params.slug
    );

    if (!data) {
      return notFound(
        res,
        "Konser tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Daftar lagu di konser ini berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getEventTicketList = async (
  req,
  res,
  next
) => {
  try {
    const event = getEventTickets(
      req.params.slug
    );

    if (!event) {
      return notFound(
        res,
        "Konser tidak ditemukan"
      );
    }

    const [data] = await attachLiveInventory([event]);

    return successResponse(
      res,
      "Kategori tiket konser ini berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getEventLocationDetail = async (
  req,
  res,
  next
) => {
  try {
    const data = getEventLocation(
      req.params.slug
    );

    if (!data) {
      return notFound(
        res,
        "Lokasi konser tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Lokasi konser berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


// =========================================
// LOCATION
// =========================================

export const listLocations = async (
  req,
  res,
  next
) => {
  try {
    const { items, meta } = getLocations(
      req.query
    );

    return successResponse(
      res,
      "Data lokasi konser dummy berhasil diambil",
      {
        items,
        meta,
      }
    );
  } catch (error) {
    next(error);
  }
};


export const getLocation = async (
  req,
  res,
  next
) => {
  try {
    const data = getLocationDetailBySlug(
      req.params.slug
    );

    if (!data) {
      return notFound(
        res,
        "Lokasi konser tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Detail lokasi konser berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getLocationEventList = async (
  req,
  res,
  next
) => {
  try {
    const items = getLocationEvents(
      req.params.slug
    );

    if (!items) {
      return notFound(
        res,
        "Lokasi konser tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Konser di lokasi ini berhasil diambil",
      {
        items,
        meta: {
          total: items.length,
        },
      }
    );
  } catch (error) {
    next(error);
  }
};


// =========================================
// SONG
// =========================================

export const listSongs = async (
  req,
  res,
  next
) => {
  try {
    const { items, meta } = getSongs(
      req.query
    );

    return successResponse(
      res,
      "Data lagu dummy berhasil diambil",
      {
        items,
        meta,
      }
    );
  } catch (error) {
    next(error);
  }
};


export const getSong = async (
  req,
  res,
  next
) => {
  try {
    const data = getSongDetailBySlug(
      req.params.slug
    );

    if (!data) {
      return notFound(
        res,
        "Lagu tidak ditemukan"
      );
    }

    return successResponse(
      res,
      "Detail lagu berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


// =========================================
// STATS
// =========================================

export const getStats = async (
  req,
  res,
  next
) => {
  try {
    const data = getCatalogStats();

    return successResponse(
      res,
      "Ringkasan katalog konser dummy berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};
