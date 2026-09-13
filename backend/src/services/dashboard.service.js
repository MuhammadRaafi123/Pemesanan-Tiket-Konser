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

  // Grafik tujuh hari terakhir berdasarkan order yang telah dibayar.
  const today = new Date();
  const salesByDate = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setUTCHours(0, 0, 0, 0);
    date.setUTCDate(date.getUTCDate() - (6 - index));
    return {
      date: date.toISOString().slice(0, 10),
      orders: 0,
      revenue: 0,
    };
  });

  const salesMap = new Map(
    salesByDate.map((sale) => [sale.date, sale])
  );

  for (const order of paidOrders) {
    const date = new Date(order.created_at).toISOString().slice(0, 10);
    const dailySale = salesMap.get(date);

    if (dailySale) {
      dailySale.orders += 1;
      dailySale.revenue += Number(order.total);
    }
  }

  return {
    totalEvents,
    totalArtists,
    totalOrders,
    ticketsSold,
    ticketsRemaining,
    totalRevenue,
    salesByDate,
  };
};
