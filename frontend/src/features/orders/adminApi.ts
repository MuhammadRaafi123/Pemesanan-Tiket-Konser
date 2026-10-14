import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Event, TicketCategory } from "@/features/events/types";
import type { Order } from "./types";

export interface AdminOrder extends Order {
  users?: { id: number | string; name: string; email: string; phone?: string };
  payments?: { id: number | string; status: string; payment_method: string; proof_image?: string; verified_at?: string }[];
}

export async function fetchAdminOrders(): Promise<AdminOrder[]> {
  const response = await api.get<ApiResponse<AdminOrder[]>>("/orders");
  return Array.isArray(response.data.data) ? response.data.data : [];
}

export async function fetchAdminEvents(): Promise<Event[]> {
  const [eventsResponse, ticketsResponse] = await Promise.all([
    api.get<ApiResponse<Event[]>>("/events"),
    api.get<ApiResponse<(TicketCategory & { events?: { id: number | string; title: string } })[]>>("/tickets"),
  ]);
  const tickets = Array.isArray(ticketsResponse.data.data) ? ticketsResponse.data.data : [];
  return (Array.isArray(eventsResponse.data.data) ? eventsResponse.data.data : []).map((event) => ({
    ...event,
    ticket_categories: tickets.filter((ticket) => String(ticket.event_id) === String(event.id)),
  }));
}

export async function createOfflineOrder(payload: {
  user_id: number;
  payment_method: "cash" | "bank_transfer" | "e_wallet";
  items: { ticket_category_id: number; qty: number }[];
}): Promise<Order> {
  const response = await api.post<ApiResponse<Order>>("/admin/orders/offline", payload);
  if (!response.data.data) throw new Error("Order loket tidak berhasil dibuat");
  return response.data.data;
}

export async function verifyPayment(id: number | string, status: "approved" | "rejected", rejection_reason?: string) {
  const response = await api.patch<ApiResponse>(`/payments/${id}/verify`, {
    status,
    ...(rejection_reason ? { rejection_reason } : {}),
  });
  return response.data;
}
