import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    items: z
      .array(
        z.object({
          ticket_category_id: z
            .coerce
            .number()
            .int("Ticket category ID harus berupa angka")
            .positive(
              "Ticket category ID harus lebih dari 0"
            ),

          qty: z
            .coerce
            .number()
            .int("Jumlah tiket harus berupa angka")
            .positive(
              "Jumlah tiket harus lebih dari 0"
            ),
        })
      )
      .min(1, "Minimal harus memilih 1 tiket"),
  }),
});

export const createOfflineOrderSchema = z.object({
  body: z.object({
    user_id: z.coerce.number().int().positive("Customer ID harus lebih dari 0"),
    payment_method: z.enum(["cash", "bank_transfer", "e_wallet"], {
      message: "Metode pembayaran harus cash, bank_transfer, atau e_wallet",
    }),
    items: z.array(
      z.object({
        ticket_category_id: z.coerce.number().int().positive(),
        qty: z.coerce.number().int().positive(),
      })
    ).min(1, "Minimal harus memilih 1 tiket"),
  }),
});
