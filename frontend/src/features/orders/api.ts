import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { Order, OrderItem } from "./types";
import { MOCK_EVENTS } from "@/features/events/api";
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

type BackendOrder = Omit<Order, "events" | "payment" | "order_items"> & {
  order_items?: BackendOrderItem[];
  payments?: Order["payment"][];
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
  };
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    order_code: "CTX-2026-88910",
    total: 3500000,
    status: "paid",
    qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=CTX-2026-88910-VIP-INFINITY",
    created_at: "2026-08-28T14:20:00Z",
    events: MOCK_EVENTS[0],
    order_items: [
      {
        id: 1,
        ticket_category_id: 101,
        qty: 1,
        subtotal: 3500000,
        ticket_categories: MOCK_EVENTS[0].ticket_categories![0],
      },
    ],
    payment: {
      payment_method: "QRIS",
      proof_image: "/globe.svg",
      status: "approved",
    },
  },
  {
    id: 2,
    order_code: "CTX-2026-77341",
    total: 1300000,
    status: "pending",
    created_at: "2026-09-01T10:15:00Z",
    events: MOCK_EVENTS[1],
    order_items: [
      {
        id: 2,
        ticket_category_id: 202,
        qty: 2,
        subtotal: 1300000,
        ticket_categories: MOCK_EVENTS[1].ticket_categories![1],
      },
    ],
    payment: {
      payment_method: "BCA Virtual Account",
      status: "pending",
    },
  },
];

export async function fetchMyOrders(): Promise<Order[]> {
  try {
    const response = await api.get<ApiResponse<BackendOrder[]>>("/orders/my");
    if (Array.isArray(response.data?.data)) {
      return response.data.data.map(normalizeOrder);
    }
  } catch {
    return [];
  }

  return [];
}

export async function fetchOrderById(id: number | string): Promise<Order | null> {
  try {
    const response = await api.get<ApiResponse<BackendOrder>>(`/orders/${id}`);
    if (response.data?.data) {
      return normalizeOrder(response.data.data);
    }
  } catch {
    // Fall through to the local preview data.
  }

  const found = MOCK_ORDERS.find((order) => String(order.id) === String(id) || order.order_code === String(id));
  return found || MOCK_ORDERS[0];
}

export async function createOrder(payload: {
  items: { ticket_category_id: number | string; qty: number }[];
}): Promise<Order> {
  try {
    const response = await api.post<ApiResponse<{ order: Order; items: OrderItem[] }>>("/orders", payload);
    if (response.data?.data?.order) {
      return response.data.data.order;
    }
  } catch (error: unknown) {
    throw error;
  }

  throw new Error("Order response tidak valid");
}
