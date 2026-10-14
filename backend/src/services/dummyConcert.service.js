import {
  DUMMY_ARTISTS,
  DUMMY_LOCATIONS,
  DUMMY_SONGS,
} from "../data/dummyConcertData.js";

import {
  DUMMY_EVENTS,
} from "../data/dummyConcertEvents.js";

// These offsets match seed_dummy_catalog.sql and keep demo records separate from user-created IDs.
export const DEMO_EVENT_ID_OFFSET = 900000;
export const DEMO_TICKET_CATEGORY_ID_OFFSET = 1000000;


const normalize = (value) =>
  String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const includes = (haystack, needle) =>
  normalize(haystack).includes(normalize(needle));


const findBy = (
  list,
  key,
  value
) =>
  list.find(
    (item) =>
      normalize(item[key]) === normalize(value)
  ) || null;

const findBySlugOrId = (
  list,
  value
) =>
  findBy(list, "slug", value) ||
  findBy(list, "id", value);

export const findArtist = (value) =>
  findBySlugOrId(DUMMY_ARTISTS, value);

export const findLocation = (value) =>
  findBySlugOrId(DUMMY_LOCATIONS, value);

export const findSong = (value) =>
  findBySlugOrId(DUMMY_SONGS, value);

export const findEvent = (value) => {
  const event = findBySlugOrId(DUMMY_EVENTS, value);

  if (event) {
    return event;
  }

  const databaseId = Number(value);
  return Number.isSafeInteger(databaseId)
    ? DUMMY_EVENTS.find(
        (item) => item.id + DEMO_EVENT_ID_OFFSET === databaseId
      ) || null
    : null;
};

const toDatabaseTicketCategory = (category) => ({
  ...category,
  id: category.id + DEMO_TICKET_CATEGORY_ID_OFFSET,
});


// =========================================
// FORMAT HELPERS
// =========================================

export const formatDuration = (seconds) => {
  const total =
    Number.isFinite(seconds) && seconds > 0
      ? Math.floor(seconds)
      : 0;

  const minutes = Math.floor(total / 60);
  const rest = total % 60;

  return `${minutes}:${String(rest).padStart(2, "0")}`;
};

const formatPrice = (price) => ({
  ...price,
  price_formatted: new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(price.price),
  sold: Math.max(price.quota - price.remaining, 0),
  available: Math.max(
    price.remaining - price.reserved,
    0
  ),
});

const eventDateValue = (event) =>
  new Date(event.event_date).getTime();

const getMinPrice = (event) => {
  if (!event.ticket_categories?.length) {
    return 0;
  }

  return Math.min(
    ...event.ticket_categories.map(
      (category) => category.price
    )
  );
};

const getTotalQuota = (event) =>
  (event.ticket_categories || []).reduce(
    (total, category) => total + category.quota,
    0
  );

const getTotalRemaining = (event) =>
  (event.ticket_categories || []).reduce(
    (total, category) => total + category.remaining,
    0
  );

const getArtistSummaries = (event) =>
  (event.artist_slugs || [])
    .map((slug) => findArtist(slug))
    .filter(Boolean)
    .map((artist) => ({
      id: artist.id,
      slug: artist.slug,
      name: artist.name,
      genre: artist.genre,
      photo: artist.photo,
    }));

const getSetlist = (event) =>
  (event.setlist || [])
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((item) => {
      const song = findSong(item.song_slug);

      if (!song) {
        return null;
      }

      const artist = findArtist(song.artist_slug);

      return {
        order: item.order,
        encore: Boolean(item.encore),
        note: item.note || null,
        song: {
          id: song.id,
          slug: song.slug,
          title: song.title,
          album: song.album,
          release_year: song.release_year,
          genre: song.genre,
          duration_seconds: song.duration_seconds,
          duration: formatDuration(song.duration_seconds),
        },
        artist: artist
          ? {
              id: artist.id,
              slug: artist.slug,
              name: artist.name,
              photo: artist.photo,
            }
          : null,
      };
    })
    .filter(Boolean);

const getTickets = (event) =>
  (event.ticket_categories || []).map(
    formatPrice
  );


// =========================================
// PUBLIC SHAPES
// =========================================

export const toArtistSummary = (artist) => {
  const events = DUMMY_EVENTS.filter((event) =>
    event.artist_slugs.includes(artist.slug)
  );

  return {
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    genre: artist.genre,
    origin_city: artist.origin_city,
    origin_province: artist.origin_province,
    country: artist.country,
    debut_year: artist.debut_year,
    popularity_rank: artist.popularity_rank,
    monthly_listeners: artist.monthly_listeners,
    description: artist.description,
    photo: artist.photo,
    banner: artist.banner,
    socials: artist.socials,
    highlights: artist.highlights,
    event_count: events.length,
    upcoming_event_count: events.filter(
      (event) =>
        event.status === "open" &&
        eventDateValue(event) >= Date.now()
    ).length,
  };
};

export const toArtistDetail = (artist) => {
  const events = DUMMY_EVENTS.filter((event) =>
    event.artist_slugs.includes(artist.slug)
  );

  const songs = DUMMY_SONGS.filter(
    (song) => song.artist_slug === artist.slug
  );

  return {
    ...toArtistSummary(artist),
    events: events
      .slice()
      .sort(
        (a, b) =>
          eventDateValue(a) - eventDateValue(b)
      )
      .map(toEventSummary),
    songs: songs.map(toSongSummary),
  };
};

export const toLocationSummary = (location) => {
  const events = DUMMY_EVENTS.filter(
    (event) =>
      event.location_slug === location.slug
  );

  return {
    ...location,
    event_count: events.length,
    upcoming_event_count: events.filter(
      (event) =>
        event.status === "open" &&
        eventDateValue(event) >= Date.now()
    ).length,
  };
};

export const toLocationDetail = (location) => ({
  ...toLocationSummary(location),
  events: DUMMY_EVENTS
    .filter(
      (event) =>
        event.location_slug === location.slug
    )
    .slice()
    .sort(
      (a, b) => eventDateValue(a) - eventDateValue(b)
    )
    .map(toEventSummary),
});

export const toSongSummary = (song) => {
  const artist = findArtist(song.artist_slug);

  const events = DUMMY_EVENTS.filter((event) =>
    event.setlist.some(
      (item) => item.song_slug === song.slug
    )
  );

  return {
    id: song.id,
    slug: song.slug,
    title: song.title,
    album: song.album,
    release_year: song.release_year,
    genre: song.genre,
    duration_seconds: song.duration_seconds,
    duration: formatDuration(song.duration_seconds),
    artist: artist
      ? {
          id: artist.id,
          slug: artist.slug,
          name: artist.name,
          genre: artist.genre,
          photo: artist.photo,
        }
      : null,
    performed_in: events.map((event) => ({
      event_id: event.id,
      event_slug: event.slug,
      event_title: event.title,
      event_date: event.event_date,
      location_name:
        findLocation(event.location_slug)?.name || null,
      encore: Boolean(
        event.setlist.find(
          (item) =>
            item.song_slug === song.slug
        )?.encore
      ),
    })),
  };
};

export const toEventSummary = (event) => {
  const location = findLocation(event.location_slug);
  const setlist = getSetlist(event);

  return {
    id: event.id + DEMO_EVENT_ID_OFFSET,
    slug: event.slug,
    title: event.title,
    description: event.description,
    status: event.status,
    featured: Boolean(event.featured),
    genre: event.genre,
    organizer: event.organizer,
    event_date: event.event_date,
    start_time: event.start_time,
    end_time: event.end_time,
    doors_open: event.doors_open,
    duration_minutes: event.duration_minutes,
    poster: event.poster,
    min_age: event.min_age,
    dress_code: event.dress_code,
    artist_slugs: event.artist_slugs,
    artists: getArtistSummaries(event),
    location: location
      ? {
          id: location.id,
          slug: location.slug,
          name: location.name,
          short_name: location.short_name,
          venue_type: location.venue_type,
          city: location.city,
          province: location.province,
          address: location.address,
          capacity: location.capacity,
          latitude: location.latitude,
          longitude: location.longitude,
        }
      : null,
    location_label: location
      ? `${location.city}, ${location.province}`
      : null,
    min_price: getMinPrice(event),
    min_price_formatted: new Intl.NumberFormat(
      "id-ID",
      {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }
    ).format(getMinPrice(event)),
    total_quota: getTotalQuota(event),
    total_remaining: getTotalRemaining(event),
    ticket_category_count:
      event.ticket_categories?.length || 0,
    setlist_count: setlist.length,
    artist_names: getArtistSummaries(event).map(
      (artist) => artist.name
    ),
  };
};

export const toEventDetail = (event) => {
  const location = findLocation(event.location_slug);

  return {
    ...toEventSummary(event),
    highlights: event.highlights,
    location_detail: location
      ? toLocationSummary(location)
      : null,
    ticket_categories: getTickets(event).map(toDatabaseTicketCategory),
    setlist: getSetlist(event),
  };
};


// =========================================
// PAGINATION
// =========================================

export const parsePagination = (query = {}) => {
  const parsedPage =
    Number.parseInt(query.page, 10);
  const parsedLimit =
    Number.parseInt(query.limit, 10);

  const page =
    Number.isFinite(parsedPage) && parsedPage > 0
      ? parsedPage
      : 1;

  const limit =
    Number.isFinite(parsedLimit) && parsedLimit > 0
      ? Math.min(parsedLimit, 100)
      : 20;

  return { page, limit };
};

export const paginate = (items, { page, limit }) => {
  const total = items.length;
  const total_pages = Math.max(
    Math.ceil(total / limit),
    1
  );

  const start = (page - 1) * limit;

  return {
    items: items.slice(start, start + limit),
    meta: {
      page,
      limit,
      total,
      total_pages,
      has_next: page < total_pages,
      has_prev: page > 1,
    },
  };
};


// =========================================
// FILTERS
// =========================================

const applyCommonFilters = (
  items,
  { search, fields }
) => {
  if (!search) {
    return items;
  }

  return items.filter((item) =>
    fields.some((field) =>
      includes(item[field], search)
    )
  );
};

const sortByDate = (
  items,
  direction = "asc"
) => {
  const multiplier = direction === "desc" ? -1 : 1;

  return items.slice().sort(
    (a, b) =>
      multiplier *
      (eventDateValue(a) - eventDateValue(b))
  );
};


// =========================================
// ARTIST QUERIES
// =========================================

export const getArtists = (query = {}) => {
  const { search, genre, city, sort } = query;
  const { page, limit } = parsePagination(query);

  let items = DUMMY_ARTISTS.slice();

  items = applyCommonFilters(items, {
    search,
    fields: ["name", "genre", "origin_city", "description"],
  });

  if (genre) {
    items = items.filter((artist) =>
      includes(artist.genre, genre)
    );
  }

  if (city) {
    items = items.filter((artist) =>
      includes(artist.origin_city, city)
    );
  }

  if (sort === "name") {
    items.sort((a, b) =>
      a.name.localeCompare(b.name, "id")
    );
  } else {
    items.sort(
      (a, b) =>
        a.popularity_rank - b.popularity_rank
    );
  }

  const { items: paged, meta } = paginate(items, {
    page,
    limit,
  });

  return {
    items: paged.map(toArtistSummary),
    meta,
  };
};

export const getArtistDetailBySlug = (
  slug
) => {
  const artist = findArtist(slug);

  return artist ? toArtistDetail(artist) : null;
};

export const getArtistSongs = (slug) => {
  const artist = findArtist(slug);

  if (!artist) {
    return null;
  }

  return DUMMY_SONGS
    .filter((song) => song.artist_slug === artist.slug)
    .map(toSongSummary);
};

export const getArtistEvents = (slug) => {
  const artist = findArtist(slug);

  if (!artist) {
    return null;
  }

  return sortByDate(
    DUMMY_EVENTS.filter((event) =>
      event.artist_slugs.includes(artist.slug)
    )
  ).map(toEventSummary);
};


// =========================================
// EVENT QUERIES
// =========================================

export const getEvents = (query = {}) => {
  const {
    search,
    artist,
    city,
    location,
    status,
    genre,
    featured,
    date_from,
    date_to,
    sort,
  } = query;

  const { page, limit } = parsePagination(query);

  let items = DUMMY_EVENTS.slice();

  items = applyCommonFilters(items, {
    search,
    fields: ["title", "description", "genre", "organizer"],
  });

  if (artist) {
    const target = findArtist(artist);

    if (target) {
      items = items.filter((event) =>
        event.artist_slugs.includes(target.slug)
      );
    } else {
      items = items.filter((event) =>
        event.artist_slugs.some((slug) =>
          includes(slug, artist)
        )
      );
    }
  }

  if (location) {
    items = items.filter(
      (event) =>
        event.location_slug === normalize(location)
    );
  }

  if (city) {
    items = items.filter((event) => {
      const eventLocation = findLocation(
        event.location_slug
      );

      return (
        eventLocation &&
        (includes(eventLocation.city, city) ||
          includes(eventLocation.province, city))
      );
    });
  }

  if (genre) {
    items = items.filter((event) =>
      includes(event.genre, genre)
    );
  }

  if (status) {
    items = items.filter(
      (event) => event.status === normalize(status)
    );
  }

  if (featured !== undefined) {
    const isFeatured =
      String(featured) === "true" ||
      featured === true;

    items = items.filter(
      (event) => Boolean(event.featured) === isFeatured
    );
  }

  if (date_from) {
    const from = new Date(date_from).getTime();

    if (Number.isFinite(from)) {
      items = items.filter(
        (event) => eventDateValue(event) >= from
      );
    }
  }

  if (date_to) {
    const to = new Date(date_to).getTime();

    if (Number.isFinite(to)) {
      items = items.filter(
        (event) => eventDateValue(event) <= to
      );
    }
  }

  if (sort === "price") {
    items.sort(
      (a, b) => getMinPrice(a) - getMinPrice(b)
    );
  } else if (sort === "popular") {
    items.sort(
      (a, b) =>
        getTotalRemaining(a) - getTotalRemaining(b)
    );
  } else if (sort === "desc") {
    items = sortByDate(items, "desc");
  } else {
    items = sortByDate(items, "asc");
  }

  const { items: paged, meta } = paginate(items, {
    page,
    limit,
  });

  return {
    items: paged.map(toEventSummary),
    meta,
  };
};

export const getEventDetailBySlug = (slug) => {
  const event = findEvent(slug);

  return event ? toEventDetail(event) : null;
};

export const getEventSetlist = (slug) => {
  const event = findEvent(slug);

  if (!event) {
    return null;
  }

  return {
    event: {
      id: event.id,
      slug: event.slug,
      title: event.title,
      event_date: event.event_date,
      poster: event.poster,
    },
    artists: getArtistSummaries(event),
    songs: getSetlist(event),
    total_duration: getSetlist(event).reduce(
      (total, item) =>
        total + (item.song?.duration_seconds || 0),
      0
    ),
  };
};

export const getEventTickets = (slug) => {
  const event = findEvent(slug);

  if (!event) {
    return null;
  }

  return {
    event: {
      id: event.id + DEMO_EVENT_ID_OFFSET,
      slug: event.slug,
      title: event.title,
      status: event.status,
      event_date: event.event_date,
    },
    ticket_categories: getTickets(event).map(
      (category) => ({
        ...toDatabaseTicketCategory(category),
        event_id: event.id + DEMO_EVENT_ID_OFFSET,
        event_slug: event.slug,
      })
    ),
    total_quota: getTotalQuota(event),
    total_remaining: getTotalRemaining(event),
  };
};

export const getEventLocation = (slug) => {
  const event = findEvent(slug);

  if (!event) {
    return null;
  }

  const location = findLocation(event.location_slug);

  if (!location) {
    return null;
  }

  return {
    ...toLocationSummary(location),
    event: {
      id: event.id,
      slug: event.slug,
      title: event.title,
      event_date: event.event_date,
      start_time: event.start_time,
      end_time: event.end_time,
      doors_open: event.doors_open,
    },
  };
};


// =========================================
// LOCATION QUERIES
// =========================================

export const getLocations = (query = {}) => {
  const { search, city, province, venue_type, min_capacity, sort } =
    query;

  const { page, limit } = parsePagination(query);

  let items = DUMMY_LOCATIONS.slice();

  items = applyCommonFilters(items, {
    search,
    fields: ["name", "short_name", "city", "province", "address"],
  });

  if (city) {
    items = items.filter((location) =>
      includes(location.city, city)
    );
  }

  if (province) {
    items = items.filter((location) =>
      includes(location.province, province)
    );
  }

  if (venue_type) {
    items = items.filter((location) =>
      includes(location.venue_type, venue_type)
    );
  }

  if (min_capacity) {
    const minimum =
      Number.parseInt(min_capacity, 10);

    if (Number.isFinite(minimum)) {
      items = items.filter(
        (location) =>
          location.capacity >= minimum
      );
    }
  }

  if (sort === "name") {
    items.sort((a, b) =>
      a.name.localeCompare(b.name, "id")
    );
  } else {
    items.sort(
      (a, b) => b.capacity - a.capacity
    );
  }

  const { items: paged, meta } = paginate(items, {
    page,
    limit,
  });

  return {
    items: paged.map(toLocationSummary),
    meta,
  };
};

export const getLocationDetailBySlug = (
  slug
) => {
  const location = findLocation(slug);

  return location ? toLocationDetail(location) : null;
};

export const getLocationEvents = (slug) => {
  const location = findLocation(slug);

  if (!location) {
    return null;
  }

  return sortByDate(
    DUMMY_EVENTS.filter(
      (event) =>
        event.location_slug === location.slug
    )
  ).map(toEventSummary);
};


// =========================================
// SONG QUERIES
// =========================================

export const getSongs = (query = {}) => {
  const { search, artist, event, genre, sort } = query;
  const { page, limit } = parsePagination(query);

  let items = DUMMY_SONGS.slice();

  items = applyCommonFilters(items, {
    search,
    fields: ["title", "album", "genre"],
  });

  if (artist) {
    const target = findArtist(artist);

    items = target
      ? items.filter(
          (song) => song.artist_slug === target.slug
        )
      : items.filter((song) =>
          includes(song.artist_slug, artist)
        );
  }

  if (genre) {
    items = items.filter((song) =>
      includes(song.genre, genre)
    );
  }

  if (event) {
    const targetEvent = findEvent(event);

    if (targetEvent) {
      items = items.filter((song) =>
        targetEvent.setlist.some(
          (item) => item.song_slug === song.slug
        )
      );
    } else {
      items = [];
    }
  }

  if (sort === "title") {
    items.sort((a, b) =>
      a.title.localeCompare(b.title, "id")
    );
  } else {
    items.sort(
      (a, b) => a.id - b.id
    );
  }

  const { items: paged, meta } = paginate(items, {
    page,
    limit,
  });

  return {
    items: paged.map(toSongSummary),
    meta,
  };
};

export const getSongDetailBySlug = (slug) => {
  const song = findSong(slug);

  return song ? toSongSummary(song) : null;
};


// =========================================
// STATS
// =========================================

export const getCatalogStats = () => {
  const upcoming = DUMMY_EVENTS.filter(
    (event) =>
      event.status === "open" &&
      eventDateValue(event) >= Date.now()
  );

  const cities = [
    ...new Set(
      DUMMY_LOCATIONS.map(
        (location) => location.city
      )
    ),
  ];

  const provinces = [
    ...new Set(
      DUMMY_LOCATIONS.map(
        (location) => location.province
      )
    ),
  ];

  const genres = [
    ...new Set(
      DUMMY_ARTISTS.map((artist) => artist.genre)
    ),
  ];

  return {
    total_artists: DUMMY_ARTISTS.length,
    total_locations: DUMMY_LOCATIONS.length,
    total_events: DUMMY_EVENTS.length,
    total_songs: DUMMY_SONGS.length,
    total_setlist_entries: DUMMY_EVENTS.reduce(
      (total, event) => total + event.setlist.length,
      0
    ),
    upcoming_events: upcoming.length,
    cities,
    provinces,
    top_artists: DUMMY_ARTISTS.slice(0, 5).map(
      (artist) => {
        const eventCount =
          DUMMY_EVENTS.filter((event) =>
            event.artist_slugs.includes(artist.slug)
          ).length;

        return {
          slug: artist.slug,
          name: artist.name,
          genre: artist.genre,
          photo: artist.photo,
          event_count: eventCount,
        };
      }
    ),
    next_events: sortByDate(upcoming, "asc")
      .slice(0, 5)
      .map(toEventSummary),
  };
};
