import supabase from "../config/supabase.js";

import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";


export const getEvents = async (
  req,
  res,
  next
) => {
  try {
    const { data, error } =
      await supabase
        .from("events")
        .select(`
          *,
          artists (
            id,
            name,
            photo
          )
        `)
        .order("event_date", {
          ascending: true,
        });

    if (error) {
      throw error;
    }

    return successResponse(
      res,
      "Data event berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getEventById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("events")
        .select(`
          *,
          artists (
            id,
            name,
            photo,
            description
          ),
          ticket_categories (
            id,
            category_name,
            price,
            quota,
            remaining
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
        "Event tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Detail event berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const createEvent = async (
  req,
  res,
  next
) => {
  try {
    const {
      artist_id,
      title,
      description,
      location,
      event_date,
    } = req.validated.body;

    let poster = null;

    if (req.file) {
      poster =
        `/uploads/posters/${req.file.filename}`;
    }

    const { data, error } =
      await supabase
        .from("events")
        .insert({
          artist_id,
          title,
          description,
          location,
          event_date,
          poster,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return successResponse(
      res,
      "Event berhasil dibuat",
      data,
      201
    );
  } catch (error) {
    next(error);
  }
};


export const updateEvent = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const {
      artist_id,
      title,
      description,
      location,
      event_date,
      status,
    } = req.validated.body;

    const updateData = {};

    if (artist_id !== undefined) {
      updateData.artist_id = artist_id;
    }

    if (title !== undefined) {
      updateData.title = title;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (location !== undefined) {
      updateData.location = location;
    }

    if (event_date !== undefined) {
      updateData.event_date = event_date;
    }

    if (status !== undefined) {
      updateData.status = status;
    }

    if (req.file) {
      updateData.poster =
        `/uploads/posters/${req.file.filename}`;
    }

    const { data, error } =
      await supabase
        .from("events")
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
        "Event tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Event berhasil diperbarui",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const deleteEvent = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("events")
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
        "Event tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Event berhasil dihapus",
      data
    );
  } catch (error) {
    next(error);
  }
};