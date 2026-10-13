import api from "@/lib/axios";
import { Payment } from "./types";

export async function submitPayment(formData: FormData): Promise<Payment> {
  const res = await api.post("/payments", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  if (!res.data?.data) throw new Error("Respons pembayaran tidak valid");
  return res.data.data;
}
