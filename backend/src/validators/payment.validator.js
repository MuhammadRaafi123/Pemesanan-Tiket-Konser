import { z } from "zod";

export const createPaymentSchema = z.object({
  body: z.object({
    order_id: z
      .coerce
      .number()
      .int("Order ID harus berupa angka")
      .positive("Order ID harus lebih dari 0"),

    payment_method: z
      .string()
      .min(2, "Metode pembayaran wajib diisi")
      .max(100, "Metode pembayaran maksimal 100 karakter"),
  }),
});

export const verifyPaymentSchema = z.object({
  body: z.object({
    status: z.enum(
      ["approved", "rejected"],
      {
        message:
          "Status harus approved atau rejected",
      }
    ),
  }),
});