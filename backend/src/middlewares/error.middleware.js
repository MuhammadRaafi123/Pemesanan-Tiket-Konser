import { errorResponse } from "../utils/apiResponse.js";

export const notFound = (req, res) => {
  return errorResponse(
    res,
    `Route ${req.originalUrl} tidak ditemukan`,
    404
  );
};

export const errorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error(err);

  // Error dari Multer
  if (err.name === "MulterError") {
    return errorResponse(
      res,
      err.message,
      400
    );
  }

  // File type tidak valid
  if (
    err.message ===
    "Format file harus JPG, JPEG, PNG, atau WEBP"
  ) {
    return errorResponse(
      res,
      err.message,
      400
    );
  }

  return errorResponse(
    res,
    err.message || "Terjadi kesalahan pada server",
    err.statusCode || 500
  );
};