import { Event } from "@/features/events/types";

export interface Artist {
  id: number | string;
  name: string;
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
