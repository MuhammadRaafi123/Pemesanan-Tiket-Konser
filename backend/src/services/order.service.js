import supabase from "../config/supabase.js";
import { generateOrderCode } from "../utils/generateOrderCode.js";


// =====================================================
// CREATE ORDER
// =====================================================

export const createOrderService = async (
  userId,
  items
) => {
  // =========================================
  // CEK DUPLIKAT TICKET CATEGORY
  // =========================================

  const ticketCategoryIds = items.map(
    (item) => item.ticket_category_id
  );

  const uniqueIds = new Set(
    ticketCategoryIds
  );

  if (
    uniqueIds.size !==
    ticketCategoryIds.length
  ) {
    const error = new Error(
      "Kategori tiket yang sama tidak boleh dimasukkan lebih dari sekali"
    );

    error.statusCode = 400;

    throw error;
  }


  // =========================================
  // AMBIL DATA TICKET CATEGORY + EVENT
  // =========================================

  const {
    data: ticketCategories,
    error: ticketError,
  } = await supabase
    .from("ticket_categories")
    .select(`
      id,
      event_id,
      category_name,
      price,
      quota,
      remaining,
      reserved,
      events (
        id,
        title,
        status
      )
    `)
    .in(
      "id",
      ticketCategoryIds
    );


  if (ticketError) {
    throw ticketError;
  }


  // =========================================
  // CEK SEMUA TICKET DITEMUKAN
  // =========================================

  if (
    !ticketCategories ||
    ticketCategories.length !==
      ticketCategoryIds.length
  ) {
    const error = new Error(
      "Satu atau lebih kategori tiket tidak ditemukan"
    );

    error.statusCode = 404;

    throw error;
  }


  // =========================================
  // CEK EVENT HARUS OPEN
  // =========================================

  for (
    const ticket of ticketCategories
  ) {
    if (
      !ticket.events ||
      ticket.events.status !== "open"
    ) {
      const error = new Error(
        `Penjualan event "${ticket.events?.title || "ini"}" sudah ditutup`
      );

      error.statusCode = 400;

      throw error;
    }
  }


  // =========================================
  // RESERVE TICKET
  // =========================================

  const reservedTickets = [];

  try {

    for (const item of items) {

      const {
        data: reservedTicket,
        error: reserveError,
      } = await supabase.rpc(
        "reserve_ticket_stock",
        {
          p_ticket_category_id:
            item.ticket_category_id,

          p_qty: item.qty,
        }
      );


      if (reserveError) {
        throw reserveError;
      }


      if (
        !reservedTicket ||
        reservedTicket.length === 0
      ) {
        const error = new Error(
          "Stok tiket tidak mencukupi"
        );

        error.statusCode = 400;

        throw error;
      }


      reservedTickets.push({
        ticket_category_id:
          item.ticket_category_id,

        qty: item.qty,
      });
    }


    // =========================================
    // HITUNG TOTAL
    // =========================================

    let total = 0;

    const orderItems = items.map(
      (item) => {

        const ticket =
          ticketCategories.find(
            (category) =>
              category.id ===
              item.ticket_category_id
          );


        if (!ticket) {
          const error = new Error(
            "Kategori tiket tidak ditemukan"
          );

          error.statusCode = 404;

          throw error;
        }


        const subtotal =
          Number(ticket.price) *
          item.qty;


        total += subtotal;


        return {
          ticket_category_id:
            ticket.id,

          qty: item.qty,

          subtotal,
        };
      }
    );


    // =========================================
    // GENERATE ORDER CODE
    // =========================================

    let orderCode =
      generateOrderCode();

    let isUnique = false;


    while (!isUnique) {

      const {
        data: existingOrder,
        error: orderCheckError,
      } = await supabase
        .from("orders")
        .select("id")
        .eq(
          "order_code",
          orderCode
        )
        .maybeSingle();


      if (orderCheckError) {
        throw orderCheckError;
      }


      if (!existingOrder) {
        isUnique = true;
      } else {
        orderCode =
          generateOrderCode();
      }
    }


    // =========================================
    // SET ORDER EXPIRATION
    // 15 MENIT
    // =========================================

    const expiresAt = new Date(
      Date.now() +
      15 * 60 * 1000
    ).toISOString();


    // =========================================
    // CREATE ORDER
    // =========================================

    const {
      data: order,
      error: orderError,
    } = await supabase
      .from("orders")
      .insert({
        user_id: userId,

        order_code: orderCode,

        total,

        status: "pending",

        expires_at: expiresAt,
      })
      .select()
      .single();


    if (orderError) {
      throw orderError;
    }


    // =========================================
    // CREATE ORDER ITEMS
    // =========================================

    const orderItemsWithOrderId =
      orderItems.map(
        (item) => ({
          ...item,

          order_id: order.id,
        })
      );


    const {
      data: createdOrderItems,
      error: orderItemsError,
    } = await supabase
      .from("order_items")
      .insert(
        orderItemsWithOrderId
      )
      .select();


    if (orderItemsError) {
      throw orderItemsError;
    }


    // =========================================
    // RETURN
    // =========================================

    return {
      order,

      items:
        createdOrderItems,
    };

  } catch (error) {

    // =========================================
    // RELEASE RESERVATION
    // JIKA CREATE ORDER GAGAL
    // =========================================

    for (
      const reservation
      of reservedTickets
    ) {

      try {

        await supabase.rpc(
          "release_ticket_stock",
          {
            p_ticket_category_id:
              reservation.ticket_category_id,

            p_qty:
              reservation.qty,
          }
        );

      } catch (
        releaseError
      ) {

        console.error(
          "Gagal release reservation:",
          releaseError
        );

      }
    }


    throw error;
  }
};


// =====================================================
// EXPIRE PENDING ORDERS
// =====================================================

export const expirePendingOrdersService =
  async () => {

    const {
      data,
      error,
    } = await supabase.rpc(
      "expire_pending_orders"
    );


    if (error) {
      throw error;
    }


    return data;
  };