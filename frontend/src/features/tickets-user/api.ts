import { fetchMyOrders } from "@/features/orders/api";
import { UserTicket } from "./types";

export async function fetchMyTickets(): Promise<UserTicket[]> {
  const orders = await fetchMyOrders();
  const paidOrders = orders.filter((order) => order.status === "paid");

  return paidOrders.map((order) => {
    const event = order.events;
    const category = order.order_items?.[0]?.ticket_categories;

    if (!event || !category || !order.qr_code) {
      throw new Error(
        `Data tiket untuk pesanan ${order.order_code} belum lengkap`
      );
    }

    return {
      id: order.id,
      ticket_code: order.order_code,
      order_code: order.order_code,
      event,
      category,
      holder_name: order.users?.name || "Pemegang tiket",
      qr_code: order.qr_code,
      quantity: order.order_items?.reduce((total, item) => total + item.qty, 0) || 1,
      status: "active" as const,
      purchase_date: order.created_at,
    };
  });
}

export async function fetchTicketById(id: number | string): Promise<UserTicket | null> {
  const tickets = await fetchMyTickets();
  return (
    tickets.find(
      (ticket) =>
        String(ticket.id) === String(id) ||
        ticket.ticket_code === String(id)
    ) || null
  );
}
