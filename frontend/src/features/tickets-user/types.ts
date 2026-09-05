import { Event, TicketCategory } from "@/features/events/types";

export interface UserTicket {
  id: number | string;
  ticket_code: string;
  order_code: string;
  event: Event;
  category: TicketCategory;
  holder_name: string;
  qr_code: string;
  status: "active" | "used" | "pending";
  seat_number?: string;
  gate?: string;
  purchase_date: string;
}
