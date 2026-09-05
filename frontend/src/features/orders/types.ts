import { Event, TicketCategory } from "@/features/events/types";

export interface OrderItem {
  id: number | string;
  order_id?: number | string;
  ticket_category_id: number | string;
  qty: number;
  subtotal: number;
  ticket_categories?: TicketCategory;
}

export interface Order {
  id: number | string;
  user_id?: number | string;
  order_code: string;
  total: number;
  status: "pending" | "paid" | "rejected" | "cancelled";
  qr_code?: string;
  created_at: string;
  order_items?: OrderItem[];
  events?: Event;
  payment?: {
    payment_method: string;
    proof_image?: string;
    status: string;
  };
}
