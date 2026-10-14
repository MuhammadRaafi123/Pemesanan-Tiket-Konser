import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { mapEvent, mapLocation, type DummyArtist, type DummyEvent, type DummyList, type DummyLocation, type DummySetlistEntry } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import type { Artist } from "./types";

type DummyArtistDetail = DummyArtist & {
  banner?: string;
  origin_province?: string;
  debut_year?: number;
  highlights?: string[];
  events?: DummyEvent[];
  songs?: DummySetlistEntry[];
};

export function mapArtistDetail(
  artist: DummyArtistDetail
): Artist {
  return {
    id: artist.id,
    slug: artist.slug,
    name: artist.name,
    photo: artist.photo,
    description: artist.description,
    genre: artist.genre,
    country: artist.country,
    popularity_rank: artist.popularity_rank,
    monthlyListeners: artist.monthly_listeners
      ? `${(artist.monthly_listeners / 1000000).toFixed(
          1
        )} Juta`
      : undefined,
    upcomingEventsCount: artist.upcoming_event_count,
    events: (artist.events || []).map(mapEvent),
    socials: artist.socials,
  };
}

export async function fetchArtists(): Promise<Artist[]> {
  const response = await api.get<
    ApiResponse<DummyList<DummyArtist>>
  >("/dummy/artists", { params: { limit: 100 } });

  return (
    response.data?.data?.items?.map((artist) =>
      mapArtistDetail(artist)
    ) || []
  );
}

export async function fetchPopularArtists(
  limit = 6
): Promise<Artist[]> {
  const response = await api.get<
    ApiResponse<DummyList<DummyArtist>>
  >("/dummy/artists", {
    params: { limit, sort: "popular" },
  });

  return (
    response.data?.data?.items?.map((artist) =>
      mapArtistDetail(artist)
    ) || []
  );
}

export async function fetchArtistById(
  id: number | string
): Promise<Artist | null> {
  const response = await api.get<
    ApiResponse<DummyArtistDetail>
  >(`/dummy/artists/${id}`);

  if (!response.data?.data) {
    return null;
  }

  return mapArtistDetail(response.data.data);
}

export async function fetchArtistEvents(
  id: number | string
): Promise<Event[]> {
  const response = await api.get<
    ApiResponse<DummyList<DummyEvent>>
  >(`/dummy/artists/${id}/events`);

  return (
    response.data?.data?.items?.map(mapEvent) || []
  );
}

export async function fetchArtistSongs(
  id: number | string
) {
  const response = await api.get<
    ApiResponse<DummyList<{ title: string }>>
  >(`/dummy/artists/${id}/songs`);

  return response.data?.data?.items || [];
}

export async function fetchArtistLocationList() {
  const response = await api.get<
    ApiResponse<DummyList<DummyLocation>>
  >("/dummy/locations", {
    params: { limit: 100 },
  });

  return (
    response.data?.data?.items?.map(mapLocation) || []
  );
}
