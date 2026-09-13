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

    rejection_reason: z
      .string()
      .min(3, "Alasan penolakan minimal 3 karakter")
      .max(500, "Alasan penolakan maksimal 500 karakter")
      .optional(),
  }),
}).superRefine(({ body }, ctx) => {
  if (body.status === "rejected" && !body.rejection_reason) {
    ctx.addIssue({
      code: "custom",
      path: ["body", "rejection_reason"],
      message: "Alasan penolakan wajib diisi",
    });
  }
});
