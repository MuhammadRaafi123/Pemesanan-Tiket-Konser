export interface TicketCategory {
  id: number | string;
  event_id?: number | string;
  category_name: string;
  price: number;
  quota: number;
  remaining: number;
  perks?: string[];
  reserved?: number;
  available?: number;
  price_formatted?: string;
  events?: { id: number | string; title: string };
}

export interface Artist {
  id: number | string;
  name: string;
  photo?: string;
  description?: string;
  genre?: string;
  slug?: string;
  socials?: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
}

export interface EventLocation {
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
  year_built?: number;
  facilities?: string[];
  access?: string[];
  description?: string;
  photo?: string;
  event_count?: number;
  upcoming_event_count?: number;
}

export interface SetlistSong {
  id: number | string;
  slug: string;
  title: string;
  album?: string;
  release_year?: number;
  genre?: string;
  duration_seconds: number;
  duration: string;
}

export interface SetlistEntry {
  order: number;
  encore: boolean;
  note: string | null;
  song: SetlistSong;
  artist: Artist | null;
}

export interface Event {
  id: number | string;
  slug?: string;
  artist_id?: number | string;
  title: string;
  description: string;
  location: string;
  venue?: string;
  event_date: string;
  poster?: string;
  status: "open" | "closed";
  artists?: Artist;
  artists_list?: Artist[];
  artist_names?: string[];
  ticket_categories?: TicketCategory[];
  setlist?: SetlistEntry[];
  setlist_count?: number;
  location_detail?: EventLocation | null;
  highlights?: string[];
  genre?: string;
  featured?: boolean;
  organizer?: string;
  start_time?: string;
  end_time?: string;
  doors_open?: string;
  duration_minutes?: number;
  min_age?: number;
  dress_code?: string | null;
  min_price?: number;
  total_quota?: number;
  total_remaining?: number;
}
