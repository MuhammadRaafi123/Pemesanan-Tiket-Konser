import { z } from "zod";

export const createEventSchema = z.object({
  body: z.object({
    artist_id: z
      .coerce
      .number()
      .int("Artist ID harus berupa angka")
      .positive("Artist ID harus lebih dari 0"),

    title: z
      .string()
      .min(3, "Judul event minimal 3 karakter")
      .max(255, "Judul event maksimal 255 karakter"),

    description: z
      .string()
      .min(10, "Deskripsi minimal 10 karakter"),

    location: z
      .string()
      .min(3, "Lokasi minimal 3 karakter")
      .max(255, "Lokasi maksimal 255 karakter"),

    event_date: z
      .string()
      .datetime({
        message:
          "Format tanggal harus ISO datetime",
      }),
  }),
});

export const updateEventSchema = z.object({
  body: z.object({
    artist_id: z
      .coerce
      .number()
      .int("Artist ID harus berupa angka")
      .positive("Artist ID harus lebih dari 0")
      .optional(),

    title: z
      .string()
      .min(3, "Judul event minimal 3 karakter")
      .max(255, "Judul event maksimal 255 karakter")
      .optional(),

    description: z
      .string()
      .min(10, "Deskripsi minimal 10 karakter")
      .optional(),

    location: z
      .string()
      .min(3, "Lokasi minimal 3 karakter")
      .max(255, "Lokasi maksimal 255 karakter")
      .optional(),

    event_date: z
      .string()
      .datetime({
        message:
          "Format tanggal harus ISO datetime",
      })
      .optional(),

    status: z
      .enum(["open", "closed"], {
        message: "Status harus open atau closed",
      })
      .optional(),
  }),
});