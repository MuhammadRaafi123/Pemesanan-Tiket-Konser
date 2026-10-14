import api from "@/lib/axios";
import axios from "axios";
import type { ApiResponse } from "@/types/api";
import type { Order, OrderItem } from "./types";
import type { Event, TicketCategory } from "@/features/events/types";

type BackendEventSummary = {
  id: number | string;
  title: string;
  event_date: string;
  location: string;
  poster?: string;
  description?: string;
  status?: "open" | "closed";
};

type BackendOrderItem = Omit<OrderItem, "ticket_categories"> & {
  ticket_categories?: TicketCategory & { events?: BackendEventSummary };
};

type BackendOrder = Omit<Order, "events" | "payment" | "order_items" | "users"> & {
  order_items?: BackendOrderItem[];
  payments?: Order["payment"][];
  users?: Order["users"];
};

function normalizeOrder(rawOrder: BackendOrder): Order {
  const firstItem = rawOrder.order_items?.[0];
  const category = firstItem?.ticket_categories;
  const eventSummary = category?.events;

  const event: Event | undefined = eventSummary
    ? {
        id: eventSummary.id,
        title: eventSummary.title,
        description: eventSummary.description || "",
        location: eventSummary.location,
        event_date: eventSummary.event_date,
        poster: eventSummary.poster,
        status: eventSummary.status || "open",
        ticket_categories: category ? [category] : undefined,
      }
    : undefined;

  return {
    ...rawOrder,
    order_items: rawOrder.order_items?.map((item) => ({
      ...item,
      ticket_categories: item.ticket_categories || undefined,
    })),
    events: event,
    payment: rawOrder.payments?.[0],
    users: rawOrder.users,
  };
}

export async function fetchMyOrders(): Promise<Order[]> {
  const response = await api.get<ApiResponse<BackendOrder[]>>("/orders/my");
  if (Array.isArray(response.data?.data)) {
    return response.data.data.map(normalizeOrder);
  }

  throw new Error("Respons daftar pesanan dari server tidak valid");
}

export async function fetchOrderById(id: number | string): Promise<Order | null> {
  try {
    const response = await api.get<ApiResponse<BackendOrder>>(`/orders/${id}`);
    if (response.data?.data) {
      return normalizeOrder(response.data.data);
    }
    throw new Error("Respons detail pesanan dari server tidak valid");
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function createOrder(payload: {
  items: { ticket_category_id: number | string; qty: number }[];
}): Promise<Order> {
  const response = await api.post<ApiResponse<{ order: Order; items: OrderItem[] }>>("/orders", payload);
  if (response.data?.data?.order) {
    return response.data.data.order;
  }

  throw new Error("Order response tidak valid");
}

export async function cancelOrder(id: number | string): Promise<void> {
  await api.patch<ApiResponse>(`/orders/${id}/cancel`);
}
