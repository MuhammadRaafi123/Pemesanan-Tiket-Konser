import { Event } from "@/features/events/types";

export interface Artist {
  id: number | string;
  name: string;
  slug?: string;
  country?: string;
  popularity_rank?: number;
  photo?: string;
  description?: string;
  genre?: string;
  monthlyListeners?: string;
  upcomingEventsCount?: number;
  events?: Event[];
  socials?: {
    instagram?: string;
    spotify?: string;
    youtube?: string;
  };
}
