import api from "@/lib/axios";
import type { Payment } from "./types";

export async function submitPayment(formData: FormData): Promise<Payment> {
  const response = await api.post<{ data?: Payment }>("/payments", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  if (response.data?.data) {
    return response.data.data;
  }

  throw new Error("Respons pembayaran dari server tidak valid");
}
