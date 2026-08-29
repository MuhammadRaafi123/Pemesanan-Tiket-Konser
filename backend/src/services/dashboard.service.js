import supabase from "../config/supabase.js";


export const getDashboardData = async () => {
  // Ambil data events
  const {
    count: totalEvents,
    error: eventsError,
  } = await supabase
    .from("events")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (eventsError) {
    throw eventsError;
  }

  // Ambil total artist
  const {
    count: totalArtists,
    error: artistsError,
  } = await supabase
    .from("artists")
    .select("*", {
      count: "exact",
      head: true,
    });

  if (artistsError) {
    throw artistsError;
  }

  // Ambil semua order
  const {
    data: orders,
    error: ordersError,
  } = await supabase
    .from("orders")
    .select("*");

  if (ordersError) {
    throw ordersError;
  }

  // Total order
  const totalOrders = orders.length;

  // Order yang berhasil dibayar
  const paidOrders = orders.filter(
    (order) => order.status === "paid"
  );

  // Total revenue
  const totalRevenue = paidOrders.reduce(
    (total, order) =>
      total + Number(order.total),
    0
  );

  // Total tiket terjual
  const paidOrderIds = paidOrders.map(
    (order) => order.id
  );

  let ticketsSold = 0;

  if (paidOrderIds.length > 0) {
    const {
      data: orderItems,
      error: orderItemsError,
    } = await supabase
      .from("order_items")
      .select("qty")
      .in("order_id", paidOrderIds);

    if (orderItemsError) {
      throw orderItemsError;
    }

    ticketsSold = orderItems.reduce(
      (total, item) =>
        total + item.qty,
      0
    );
  }

  // Total tiket tersisa
  const {
    data: ticketCategories,
    error: ticketsError,
  } = await supabase
    .from("ticket_categories")
    .select("remaining");

  if (ticketsError) {
    throw ticketsError;
  }

  const ticketsRemaining =
    ticketCategories.reduce(
      (total, ticket) =>
        total + ticket.remaining,
      0
    );

  return {
    totalEvents,
    totalArtists,
    totalOrders,
    ticketsSold,
    ticketsRemaining,
    totalRevenue,
  };
};