import api from "@/lib/axios";
import { Order } from "./types";
import { MOCK_EVENTS } from "@/features/events/api";

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
    const res = await api.get("/orders");
    if (res.data?.data && Array.isArray(res.data.data)) {
      return res.data.data;
    }
    return MOCK_ORDERS;
  } catch {
    return MOCK_ORDERS;
  }
}

export async function fetchOrderById(id: number | string): Promise<Order | null> {
  try {
    const res = await api.get(`/orders/${id}`);
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // fallback
  }

  const found = MOCK_ORDERS.find((o) => String(o.id) === String(id) || o.order_code === String(id));
  return found || MOCK_ORDERS[0];
}

export async function createOrder(payload: {
  items: { ticket_category_id: number | string; qty: number }[];
}): Promise<Order> {
  try {
    const res = await api.post("/orders", payload);
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // fallback mock creation
  }

  const newOrder: Order = {
    id: Date.now(),
    order_code: `CTX-${Math.floor(100000 + Math.random() * 900000)}`,
    total: payload.items.reduce((acc, item) => acc + item.qty * 1000000, 0),
    status: "pending",
    created_at: new Date().toISOString(),
    events: MOCK_EVENTS[0],
    order_items: payload.items.map((i, idx) => ({
      id: idx + 1,
      ticket_category_id: i.ticket_category_id,
      qty: i.qty,
      subtotal: i.qty * 1000000,
      ticket_categories: MOCK_EVENTS[0].ticket_categories?.[0] || {
        id: i.ticket_category_id,
        category_name: "VIP Ticket",
        price: 1000000,
        quota: 100,
        remaining: 50,
      },
    })),
  };

  return newOrder;
}
