import supabase from "../config/supabase.js";
import {
  successResponse,
  errorResponse,
} from "../utils/apiResponse.js";
import {
  POPULAR_INDONESIAN_ARTISTS,
} from "../data/popularIndonesianArtists.js";

const normalizeArtistName = (value) =>
  value.trim().toLowerCase().replace(/\s+/g, " ");

const getPopularLimit = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed)) return 6;
  return Math.min(Math.max(parsed, 1), 20);
};


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


export const getPopularArtists = async (
  req,
  res,
  next
) => {
  try {
    const limit = getPopularLimit(req.query.limit);
    const { data: databaseArtists, error } = await supabase
      .from("artists")
      .select("id, name, photo, description");

    if (error) {
      throw error;
    }

    const artistsByName = new Map(
      (databaseArtists || []).map((artist) => [
        normalizeArtistName(artist.name),
        artist,
      ]),
    );

    const data = POPULAR_INDONESIAN_ARTISTS
      .map((artist) => {
        const databaseArtist = artistsByName.get(
          normalizeArtistName(artist.name),
        );

        return {
          ...artist,
          id: databaseArtist?.id || artist.slug,
          photo: databaseArtist?.photo || artist.photo,
          description: databaseArtist?.description || artist.description,
        };
      })
      .slice(0, limit);

    return successResponse(
      res,
      "Artist Indonesia populer berhasil diambil",
      data,
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
    const normalizedId = String(id).trim();

    if (!/^\d+$/.test(normalizedId)) {
      const curatedArtist = POPULAR_INDONESIAN_ARTISTS.find(
        (artist) =>
          artist.slug === normalizedId.toLowerCase() ||
          normalizeArtistName(artist.name) === normalizeArtistName(normalizedId),
      );

      if (curatedArtist) {
        return successResponse(
          res,
          "Detail artist berhasil diambil",
          curatedArtist,
        );
      }

      return errorResponse(
        res,
        "Artist tidak ditemukan",
        404
      );
    }

    const { data, error } =
      await supabase
        .from("artists")
        .select("*")
        .eq("id", normalizedId)
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