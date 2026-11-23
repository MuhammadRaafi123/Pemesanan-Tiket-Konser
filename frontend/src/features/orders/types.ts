import type { Event, TicketCategory } from "@/features/events/types";

export interface OrderItem {
  id: number | string;
  order_id?: number | string;
  ticket_category_id: number | string;
  qty: number;
  subtotal: number;
  ticket_categories?: TicketCategory & {
    events?: Pick<Event, "id" | "title" | "event_date" | "location">;
  };
}

export interface Order {
  id: number | string;
  user_id?: number | string;
  order_code: string;
  total: number;
  status: "pending" | "paid" | "rejected" | "cancelled";
  qr_code?: string;
  created_at: string;
  expires_at?: string | null;
  users?: {
    id: number | string;
    name: string;
    email: string;
    phone?: string;
  };
  order_items?: OrderItem[];
  events?: Event;
  payment?: {
    payment_method: string;
    payer_name?: string;
    transaction_reference?: string;
    paid_amount?: number;
    proof_image?: string;
    status: string;
    rejection_reason?: string;
  };
}

export function isOrderExpired(order: Order, now = Date.now()): boolean {
  if (order.status !== "pending" || order.payment || !order.expires_at) return false;
  const expiresAt = new Date(order.expires_at).getTime();
  return Number.isFinite(expiresAt) && expiresAt <= now;
}
