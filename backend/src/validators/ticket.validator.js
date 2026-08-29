import { z } from "zod";

export const createTicketSchema = z.object({
  body: z.object({
    event_id: z
      .coerce
      .number()
      .int("Event ID harus berupa angka")
      .positive("Event ID harus lebih dari 0"),

    category_name: z
      .string()
      .min(2, "Nama kategori minimal 2 karakter")
      .max(100, "Nama kategori maksimal 100 karakter"),

    price: z
      .coerce
      .number()
      .positive("Harga harus lebih dari 0"),

    quota: z
      .coerce
      .number()
      .int("Kuota harus berupa angka")
      .positive("Kuota harus lebih dari 0"),
  }),
});

export const updateTicketSchema = z.object({
  body: z.object({
    category_name: z
      .string()
      .min(2, "Nama kategori minimal 2 karakter")
      .max(100, "Nama kategori maksimal 100 karakter")
      .optional(),

    price: z
      .coerce
      .number()
      .positive("Harga harus lebih dari 0")
      .optional(),

    quota: z
      .coerce
      .number()
      .int("Kuota harus berupa angka")
      .positive("Kuota harus lebih dari 0")
      .optional(),

    remaining: z
      .coerce
      .number()
      .int("Sisa tiket harus berupa angka")
      .min(0, "Sisa tiket tidak boleh negatif")
      .optional(),
  }),
});