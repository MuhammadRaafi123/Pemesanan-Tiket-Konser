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