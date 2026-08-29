import supabase from "../config/supabase.js";
import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";


export const getArtists = async (
  req,
  res,
  next
) => {
  try {
    const { data, error } =
      await supabase
        .from("artists")
        .select("*")
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      throw error;
    }

    return successResponse(
      res,
      "Data artist berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const getArtistById = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("artists")
        .select("*")
        .eq("id", id)
        .maybeSingle();

    if (error) {
      throw error;
    }

    if (!data) {
      return errorResponse(
        res,
        "Artist tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Detail artist berhasil diambil",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const createArtist = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      description,
    } = req.validated.body;

    let photo = null;

    if (req.file) {
      photo = `/uploads/artists/${req.file.filename}`;
    }

    const { data, error } =
      await supabase
        .from("artists")
        .insert({
          name,
          description: description || null,
          photo,
        })
        .select()
        .single();

    if (error) {
      throw error;
    }

    return successResponse(
      res,
      "Artist berhasil ditambahkan",
      data,
      201
    );
  } catch (error) {
    next(error);
  }
};


export const updateArtist = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const {
      name,
      description,
    } = req.validated.body;

    const updateData = {};

    if (name !== undefined) {
      updateData.name = name;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    if (req.file) {
      updateData.photo =
        `/uploads/artists/${req.file.filename}`;
    }

    const { data, error } =
      await supabase
        .from("artists")
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
        "Artist tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Artist berhasil diperbarui",
      data
    );
  } catch (error) {
    next(error);
  }
};


export const deleteArtist = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    const { data, error } =
      await supabase
        .from("artists")
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
        "Artist tidak ditemukan",
        404
      );
    }

    return successResponse(
      res,
      "Artist berhasil dihapus",
      data
    );
  } catch (error) {
    next(error);
  }
};