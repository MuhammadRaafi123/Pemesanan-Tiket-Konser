import { z } from "zod";

export const createArtistSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Nama artist minimal 2 karakter")
      .max(150, "Nama artist maksimal 150 karakter"),

    description: z
      .string()
      .max(2000, "Deskripsi maksimal 2000 karakter")
      .optional(),
  }),
});

export const updateArtistSchema = z.object({
  body: z.object({
    name: z
      .string()
      .min(2, "Nama artist minimal 2 karakter")
      .max(150, "Nama artist maksimal 150 karakter")
      .optional(),

    description: z
      .string()
      .max(2000, "Deskripsi maksimal 2000 karakter")
      .optional(),
  }),
});