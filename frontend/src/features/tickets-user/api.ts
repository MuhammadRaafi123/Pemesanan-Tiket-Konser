import { fetchMyOrders } from "@/features/orders/api";
import { UserTicket } from "./types";
import { MOCK_EVENTS } from "@/features/events/api";

export const MOCK_USER_TICKETS: UserTicket[] = [
  {
    id: 1,
    ticket_code: "TKT-CP-88910-01",
    order_code: "CTX-2026-88910",
    event: MOCK_EVENTS[0],
    category: MOCK_EVENTS[0].ticket_categories![0],
    holder_name: "Muhammad Rafi",
    qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TKT-CP-88910-01-VIP-INFINITY",
    status: "active",
    seat_number: "VIP-ROW-A12",
    gate: "Gate 1 VIP Entrance (North)",
    purchase_date: "2026-08-28T14:20:00Z",
  },
  {
    id: 2,
    ticket_code: "TKT-SO7-77341-01",
    order_code: "CTX-2026-77341",
    event: MOCK_EVENTS[1],
    category: MOCK_EVENTS[1].ticket_categories![1],
    holder_name: "Muhammad Rafi",
    qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=TKT-SO7-77341-01-FESTIVAL",
    status: "active",
    seat_number: "Free Standing Zone A",
    gate: "Gate 4 Festival Entrance",
    purchase_date: "2026-09-01T10:15:00Z",
  },
];

export async function fetchMyTickets(): Promise<UserTicket[]> {
  const orders = await fetchMyOrders();

  return orders
    .filter((order) => order.status === "paid" && order.events)
    .map((order) => {
      const event = order.events!;
      const category = order.order_items?.[0]?.ticket_categories;
      const ticketCode = `${order.order_code}-01`;

      return {
        id: order.id,
        ticket_code: ticketCode,
        order_code: order.order_code,
        event,
        category: category || {
          id: order.id,
          category_name: "Digital ticket",
          price: order.total,
          quota: 1,
          remaining: 0,
        },
        holder_name: "Concertix guest",
        qr_code: order.qr_code || `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticketCode)}`,
        status: "active" as const,
        purchase_date: order.created_at,
      };
    });
}

export async function fetchTicketById(id: number | string): Promise<UserTicket | null> {
  const tickets = await fetchMyTickets();
  return tickets.find((ticket) => String(ticket.id) === String(id) || ticket.ticket_code === String(id)) || tickets[0] || null;
}
