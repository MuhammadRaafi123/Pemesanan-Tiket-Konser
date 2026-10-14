import type { EventLocation, SetlistSong } from "@/features/events/types";
import type { Artist } from "@/features/artists/types";

export type { EventLocation };

export interface Song {
  id: number | string;
  slug: string;
  title: string;
  album?: string;
  release_year?: number;
  genre?: string;
  duration_seconds: number;
  duration: string;
  artist: Artist | null;
  performed_in: {
    event_id: number | string;
    event_slug: string;
    event_title: string;
    event_date: string;
    location_name: string | null;
    encore: boolean;
  }[];
}

export type { SetlistSong };

export interface CatalogStats {
  total_artists: number;
  total_locations: number;
  total_events: number;
  total_songs: number;
  total_setlist_entries: number;
  upcoming_events: number;
  cities: string[];
  provinces: string[];
  top_artists: {
    slug: string;
    name: string;
    genre?: string;
    photo?: string;
    event_count: number;
  }[];
  next_events: {
    id: number | string;
    slug: string;
    title: string;
    event_date: string;
    location_label?: string | null;
    poster?: string;
  }[];
}
