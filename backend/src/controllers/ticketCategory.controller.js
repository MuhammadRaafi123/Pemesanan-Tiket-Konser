import supabase from "../config/supabase.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";


export const getTickets = async (
  req,
  res,
  next
) => {
  try {
    const { event_id } = req.query;

    let query = supabase
      .from("ticket_categories")
      .select(`
        *,
        events (
          id,
          title
        )
      `)
      .order("created_at", {
        ascending: false,
      });

    if (event_id) {
      query = query.eq(
        "event_id",
        event_id
      );
    }

    const { data, error } =
      await query;

    if (error) {
      throw error;
    }

    return successResponse(
      res,
      "Data kategori tiket berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getTicketById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("ticket_categories")
        .select(`
          *,
          events (
            id,
            title
          )
        `)
        .eq("id", id)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return errorResponse(
        res,
        "Kategori tiket tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Detail kategori tiket berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const createTicket = async (
  req,
  res,
  next
) => {
  try {
    const {
      event_id,
      category_name,
      price,
      quota,
    } = req.validated.body;

    // Pastikan event ada
    const { data: event, error: eventError } =
      await supabase
        .from("events")
        .select("id")
        .eq("id", event_id)
        .maybeSingle();

    if (eventError) {
      throw eventError;
    }

    if (!event) {
      return errorResponse(
        res,
        "Event tidak ditemukan",
        404
      );
    }

    const { data, error } =
      await supabase
        .from("ticket_categories")
        .insert({
          event_id,
          category_name,
          price,
          quota,
          remaining: quota,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return successResponse(
      res,
      "Kategori tiket berhasil dibuat",
      data,
      201
    );
  } catch (error) {
    next(error);
  }
};


export const updateTicket = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const {
      category_name,
      price,
      quota,
      remaining,
    } = req.validated.body;

    const updateData = {};

    if (category_name !== undefined) {
      updateData.category_name =
        category_name;
    }

    if (price !== undefined) {
      updateData.price = price;
    }

    if (quota !== undefined) {
      updateData.quota = quota;
    }

    if (remaining !== undefined) {
      updateData.remaining = remaining;
    }

    const { data, error } =
      await supabase
        .from("ticket_categories")
        .update(updateData)
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return errorResponse(
        res,
        "Kategori tiket tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Kategori tiket berhasil diperbarui",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const deleteTicket = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("ticket_categories")
        .delete()
        .eq("id", id)
        .select()
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return errorResponse(
        res,
        "Kategori tiket tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Kategori tiket berhasil dihapus",
      data
    );
  } catch (error) {
    next(error);
  }
};