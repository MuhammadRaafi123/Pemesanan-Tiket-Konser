import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type {
  Artist,
  Event,
  EventLocation,
  SetlistEntry,
  TicketCategory,
} from "./types";


// =========================================
// SHARED DUMMY API HELPERS
// =========================================

export type DummyMeta = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
};

export type DummyList<T> = {
  items: T[];
  meta: DummyMeta;
};

export type DummyArtist = {
  id: number | string;
  slug: string;
  name: string;
  genre?: string;
  photo?: string;
  description?: string;
  origin_city?: string;
  country?: string;
  popularity_rank?: number;
  monthly_listeners?: number;
  socials?: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
  event_count?: number;
  upcoming_event_count?: number;
};

export type DummyLocation = {
  id: number | string;
  slug: string;
  name: string;
  short_name?: string;
  venue_type?: string;
  address?: string;
  city: string;
  province: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  capacity?: number;
  facilities?: string[];
  access?: string[];
  description?: string;
  photo?: string;
  event_count?: number;
  upcoming_event_count?: number;
};

export type DummyTicketCategory = {
  id: number | string;
  event_id?: number | string;
  name: string;
  price: number;
  price_formatted?: string;
  quota: number;
  remaining: number;
  reserved?: number;
  sold?: number;
  available?: number;
  perks?: string[];
};

export type DummySetlistEntry = {
  order: number;
  encore: boolean;
  note: string | null;
  song: {
    id: number | string;
    slug: string;
    title: string;
    album?: string;
    release_year?: number;
    genre?: string;
    duration_seconds: number;
    duration: string;
  };
  artist: {
    id: number | string;
    slug: string;
    name: string;
    photo?: string;
  } | null;
};

export type DummyEvent = {
  id: number | string;
  slug: string;
  title: string;
  description: string;
  status: "open" | "closed";
  featured?: boolean;
  genre?: string;
  organizer?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  doors_open?: string;
  duration_minutes?: number;
  poster?: string;
  min_age?: number;
  dress_code?: string | null;
  min_price?: number;
  min_price_formatted?: string;
  total_quota?: number;
  total_remaining?: number;
  setlist_count?: number;
  artist_names?: string[];
  artists?: {
    id: number | string;
    slug: string;
    name: string;
    genre?: string;
    photo?: string;
  }[];
  location?: {
    id: number | string;
    slug: string;
    name: string;
    city: string;
    province: string;
  } | null;
  location_label?: string | null;
  highlights?: string[];
  ticket_categories?: DummyTicketCategory[];
  setlist?: DummySetlistEntry[];
  location_detail?: DummyLocation;
};


// =========================================
// MAPPERS
// =========================================

export function mapArtist(
  artist: DummyArtist
): Artist {
  return {
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    photo: artist.photo,
    description: artist.description,
    genre: artist.genre,
    socials: artist.socials,
  };
}

export function mapLocation(
  location: DummyLocation
): EventLocation {
  return {
    id: location.id,
    slug: location.slug,
    name: location.name,
    short_name: location.short_name,
    venue_type: location.venue_type,
    address: location.address,
    city: location.city,
    province: location.province,
    country: location.country,
    latitude: location.latitude,
    longitude: location.longitude,
    capacity: location.capacity,
    facilities: location.facilities,
    access: location.access,
    description: location.description,
    photo: location.photo,
    event_count: location.event_count,
    upcoming_event_count: location.upcoming_event_count,
  };
}

export function mapTicketCategory(
  category: DummyTicketCategory
): TicketCategory {
  return {
    id: category.id,
    event_id: category.event_id,
    category_name: category.name,
    price: category.price,
    quota: category.quota,
    remaining: category.remaining,
    reserved: category.reserved,
    available: category.available,
    price_formatted: category.price_formatted,
    perks: category.perks,
  };
}

export function mapSetlistEntry(
  entry: DummySetlistEntry
): SetlistEntry {
  return {
    order: entry.order,
    encore: entry.encore,
    note: entry.note,
    song: entry.song,
    artist: entry.artist
      ? mapArtist({
          ...entry.artist,
          slug: entry.artist.slug,
        })
      : null,
  };
}

export function mapEvent(event: DummyEvent): Event {
  const artistsList = (event.artists || []).map(
    (artist) => mapArtist(artist)
  );

  return {
    id: event.id,
    slug: event.slug,
    artist_id: artistsList[0]?.id,
    title: event.title,
    description: event.description,
    location:
      event.location_label ||
      (event.location
        ? `${event.location.city}, ${event.location.province}`
        : ""),
    venue: event.location?.name,
    event_date: event.event_date,
    poster: event.poster,
    status: event.status,
    artists: artistsList[0],
    artists_list: artistsList,
    artist_names: event.artist_names || artistsList.map(
      (artist) => artist.name
    ),
    ticket_categories: (event.ticket_categories || []).map(
      mapTicketCategory
    ),
    setlist: (event.setlist || []).map(mapSetlistEntry),
    setlist_count: event.setlist_count ?? event.setlist?.length ?? 0,
    location_detail: event.location_detail
      ? mapLocation(event.location_detail)
      : event.location
        ? mapLocation({
            ...event.location,
            slug: event.location.slug,
          })
        : null,
    highlights: event.highlights,
    genre: event.genre,
    featured: event.featured,
    organizer: event.organizer,
    start_time: event.start_time,
    end_time: event.end_time,
    doors_open: event.doors_open,
    duration_minutes: event.duration_minutes,
    min_age: event.min_age,
    dress_code: event.dress_code,
    min_price: event.min_price,
    total_quota: event.total_quota,
    total_remaining: event.total_remaining,
  };
}


// =========================================
// FETCHERS (dummy API)
// =========================================

export type EventQuery = {
  search?: string;
  artist?: string;
  city?: string;
  location?: string;
  status?: "open" | "closed";
  genre?: string;
  featured?: boolean;
  sort?: "asc" | "desc" | "price" | "popular";
  page?: number;
  limit?: number;
};

export async function fetchEvents(
  query: EventQuery = {}
): Promise<Event[]> {
  const response = await api.get<
    ApiResponse<DummyList<DummyEvent>>
  >("/dummy/events", { params: query });

  return (
    response.data?.data?.items?.map(mapEvent) || []
  );
}

export async function fetchEventById(
  id: number | string
): Promise<Event | null> {
  const response = await api.get<
    ApiResponse<DummyEvent>
  >(`/dummy/events/${id}`);

  if (!response.data?.data) {
    return null;
  }

  return mapEvent(response.data.data);
}

export async function fetchEventSetlist(
  id: number | string
): Promise<SetlistEntry[]> {
  const response = await api.get<
    ApiResponse<{
      artists: DummyArtist[];
      songs: DummySetlistEntry[];
    }>
  >(`/dummy/events/${id}/songs`);

  return (
    response.data?.data?.songs?.map(mapSetlistEntry) ||
    []
  );
}

export async function fetchEventTickets(
  id: number | string
): Promise<TicketCategory[]> {
  const response = await api.get<
    ApiResponse<{
      ticket_categories: DummyTicketCategory[];
    }>
  >(`/dummy/events/${id}/tickets`);

  return (
    response.data?.data?.ticket_categories?.map(
      mapTicketCategory
    ) || []
  );
}

export async function fetchEventLocation(
  id: number | string
): Promise<EventLocation | null> {
  const response = await api.get<
    ApiResponse<DummyLocation>
  >(`/dummy/events/${id}/location`);

  if (!response.data?.data) {
    return null;
  }

  return mapLocation(response.data.data);
}
