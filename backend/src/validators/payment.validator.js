import { z } from "zod";

export const localPaymentSimulationSchema = z.object({
  body: z.object({
    token: z.string().min(20, "Token QR tidak valid").max(2048),
    payment_method: z.enum([
      "BCA", "BRI", "BNI", "MANDIRI", "CIMB", "PERMATA",
      "BCA_VA", "BRI_VA", "BNI_VA", "MANDIRI_VA", "PERMATA_VA",
      "GOPAY", "DANA", "OVO", "SHOPEEPAY", "LINKAJA", "QRIS",
    ]),
  }),
});

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
    payer_name: z.string().trim().min(2, "Nama pengirim wajib diisi").max(120),
    transaction_reference: z.string().trim().min(3, "Nomor transaksi wajib diisi").max(120),
    paid_amount: z.coerce.number().positive("Nominal pembayaran harus lebih dari 0"),
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
