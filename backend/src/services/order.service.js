import supabase from "../config/supabase.js";
import { generateOrderCode } from "../utils/generateOrderCode.js";
import { DUMMY_ARTISTS } from "../data/dummyConcertData.js";
import { DUMMY_EVENTS } from "../data/dummyConcertEvents.js";
import { findLocation } from "./dummyConcert.service.js";

const DEMO_EVENT_ID_OFFSET = 900000;
const DEMO_ARTIST_ID_OFFSET = 2000000;
const DEMO_TICKET_CATEGORY_ID_OFFSET = 1000000;

const ensureDemoCatalog = async (ticketCategoryIds) => {
  const requestedIds = new Set(ticketCategoryIds.map(Number));
  // Jangan lakukan upsert katalog dummy untuk setiap checkout. Hanya siapkan
  // kategori demo yang benar-benar belum ada di database.
  const { data: existingCategories, error: lookupError } = await supabase
    .from("ticket_categories")
    .select("id")
    .in("id", [...requestedIds]);
  if (lookupError) throw lookupError;

  const existingIds = new Set((existingCategories || []).map((category) => Number(category.id)));
  const demoEvents = DUMMY_EVENTS.filter((event) =>
    event.ticket_categories.some((category) =>
      requestedIds.has(category.id + DEMO_TICKET_CATEGORY_ID_OFFSET) &&
      !existingIds.has(category.id + DEMO_TICKET_CATEGORY_ID_OFFSET)
    )
  );

  if (demoEvents.length === 0) return;

  const artistSlugs = new Set(demoEvents.flatMap((event) => event.artist_slugs));
  const demoArtists = DUMMY_ARTISTS.filter((artist) => artistSlugs.has(artist.slug));
  const { error: artistError } = await supabase
    .from("artists")
    .upsert(
      demoArtists.map((artist) => ({
        id: artist.id + DEMO_ARTIST_ID_OFFSET,
        name: artist.name,
        photo: artist.photo,
        description: artist.description,
      })),
      { onConflict: "id", ignoreDuplicates: true }
    );
  if (artistError) throw artistError;

  const now = Date.now();
  const { error: eventError } = await supabase
    .from("events")
    .upsert(
      demoEvents.map((event) => {
        const artist = demoArtists.find((item) => event.artist_slugs.includes(item.slug));
        const location = findLocation(event.location_slug);
        return {
          id: event.id + DEMO_EVENT_ID_OFFSET,
          artist_id: artist.id + DEMO_ARTIST_ID_OFFSET,
          title: event.title,
          description: event.description,
          location: location ? `${location.city}, ${location.province}` : event.location_slug,
          event_date: event.event_date,
          poster: event.poster,
          status: new Date(event.event_date).getTime() > now && event.status === "open" ? "open" : "closed",
        };
      }),
      { onConflict: "id", ignoreDuplicates: true }
    );
  if (eventError) throw eventError;

  const categories = demoEvents.flatMap((event) => {
    const baseQuota = Math.floor(10 / event.ticket_categories.length);
    const extraQuota = 10 % event.ticket_categories.length;
    return event.ticket_categories.map((category, index) => {
      const quota = baseQuota + (index < extraQuota ? 1 : 0);
      return {
        id: category.id + DEMO_TICKET_CATEGORY_ID_OFFSET,
        event_id: event.id + DEMO_EVENT_ID_OFFSET,
        category_name: category.name,
        price: category.price,
        quota,
        remaining: quota,
        reserved: 0,
      };
    });
  });
  const { error: categoryError } = await supabase
    .from("ticket_categories")
    .upsert(categories, { onConflict: "id", ignoreDuplicates: true });
  if (categoryError) throw categoryError;
};


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

  await ensureDemoCatalog(ticketCategoryIds);


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
        status,
        event_date
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
      ticket.events.status !== "open" ||
      new Date(ticket.events.event_date).getTime() <= Date.now()
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
              String(category.id) ===
              String(item.ticket_category_id)
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
