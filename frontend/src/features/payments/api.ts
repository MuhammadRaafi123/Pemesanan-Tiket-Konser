import api from "@/lib/axios";
import { Payment } from "./types";

export async function submitPayment(formData: FormData): Promise<Payment> {
  try {
    const res = await api.post("/payments", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data?.data) {
      return res.data.data;
    }
  } catch {
    // fallback
  }

  return {
    id: Date.now(),
    order_id: (formData.get("order_id") as string) || "1",
    payment_method: (formData.get("payment_method") as string) || "QRIS",
    proof_image: "/globe.svg",
    status: "pending",
    created_at: new Date().toISOString(),
  };
}
