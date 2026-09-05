export interface TicketCategory {
  id: number | string;
  event_id?: number | string;
  category_name: string;
  price: number;
  quota: number;
  remaining: number;
  perks?: string[];
}

export interface Artist {
  id: number | string;
  name: string;
  photo?: string;
  description?: string;
  genre?: string;
  socials?: {
    instagram?: string;
    spotify?: string;
  };
}

export interface Event {
  id: number | string;
  artist_id?: number | string;
  title: string;
  description: string;
  location: string;
  venue?: string;
  event_date: string;
  poster?: string;
  status: "open" | "closed";
  artists?: Artist;
  ticket_categories?: TicketCategory[];
  genre?: string;
  featured?: boolean;
}
