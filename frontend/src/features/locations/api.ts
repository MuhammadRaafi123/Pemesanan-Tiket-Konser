import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import {
  mapEvent,
  mapLocation,
  type DummyEvent,
  type DummyList,
  type DummyLocation,
} from "@/features/events/api";
import type { Event } from "@/features/events/types";
import type { CatalogStats, EventLocation, Song } from "./types";


type DummySong = {
  id: number | string;
  slug: string;
  title: string;
  album?: string;
  release_year?: number;
  genre?: string;
  duration_seconds: number;
  duration: string;
  artist: {
    id: number | string;
    slug: string;
    name: string;
    genre?: string;
    photo?: string;
  } | null;
  performed_in: Song["performed_in"];
};


// =========================================
// LOCATIONS
// =========================================

export type LocationQuery = {
  search?: string;
  city?: string;
  province?: string;
  venue_type?: string;
  min_capacity?: number;
  sort?: "capacity" | "name";
  page?: number;
  limit?: number;
};

export async function fetchLocations(
  query: LocationQuery = {}
): Promise<EventLocation[]> {
  const response = await api.get<
    ApiResponse<DummyList<DummyLocation>>
  >("/dummy/locations", { params: query });

  return (
    response.data?.data?.items?.map(mapLocation) || []
  );
}

export async function fetchLocationBySlug(
  slug: number | string
): Promise<EventLocation | null> {
  const response = await api.get<
    ApiResponse<DummyLocation & { events?: DummyEvent[] }>
  >(`/dummy/locations/${slug}`);

  if (!response.data?.data) {
    return null;
  }

  return mapLocation(response.data.data);
}

export async function fetchLocationEvents(
  slug: number | string
): Promise<Event[]> {
  const response = await api.get<
    ApiResponse<DummyList<DummyEvent>>
  >(`/dummy/locations/${slug}/events`);

  return (
    response.data?.data?.items?.map(mapEvent) || []
  );
}


// =========================================
// SONGS
// =========================================

export type SongQuery = {
  search?: string;
  artist?: string;
  event?: string;
  genre?: string;
  sort?: "title" | "id";
  page?: number;
  limit?: number;
};

export async function fetchSongs(
  query: SongQuery = {}
): Promise<Song[]> {
  const response = await api.get<
    ApiResponse<DummyList<DummySong>>
  >("/dummy/songs", { params: query });

  return response.data?.data?.items || [];
}

export async function fetchSongBySlug(
  slug: number | string
): Promise<Song | null> {
  const response = await api.get<
    ApiResponse<DummySong>
  >(`/dummy/songs/${slug}`);

  return response.data?.data || null;
}


// =========================================
// STATS
// =========================================

export async function fetchCatalogStats(): Promise<CatalogStats | null> {
  const response = await api.get<
    ApiResponse<CatalogStats>
  >("/dummy/stats");

  return response.data?.data || null;
}
