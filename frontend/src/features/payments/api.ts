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

export interface PaymentMethodOption {
  id: string;
  category: "bank_transfer" | "virtual_account" | "ewallet" | "qris";
  name: string;
}

export const LOCAL_PAYMENT_METHODS: PaymentMethodOption[] = [
  { id: "BCA", category: "bank_transfer", name: "BCA" },
  { id: "BRI", category: "bank_transfer", name: "BRI" },
  { id: "BNI", category: "bank_transfer", name: "BNI" },
  { id: "MANDIRI", category: "bank_transfer", name: "Mandiri" },
  { id: "CIMB", category: "bank_transfer", name: "CIMB Niaga" },
  { id: "PERMATA", category: "bank_transfer", name: "Permata" },
  { id: "BCA_VA", category: "virtual_account", name: "BCA Virtual Account" },
  { id: "BRI_VA", category: "virtual_account", name: "BRI Virtual Account" },
  { id: "BNI_VA", category: "virtual_account", name: "BNI Virtual Account" },
  { id: "MANDIRI_VA", category: "virtual_account", name: "Mandiri Virtual Account" },
  { id: "PERMATA_VA", category: "virtual_account", name: "Permata Virtual Account" },
  { id: "GOPAY", category: "ewallet", name: "GoPay" },
  { id: "DANA", category: "ewallet", name: "DANA" },
  { id: "OVO", category: "ewallet", name: "OVO" },
  { id: "SHOPEEPAY", category: "ewallet", name: "ShopeePay" },
  { id: "LINKAJA", category: "ewallet", name: "LinkAja" },
  { id: "QRIS", category: "qris", name: "QRIS" },
];

export interface LocalPaymentPreview {
  id: number | string;
  user_id?: number | string;
  order_code: string;
  total: number;
  status: "pending" | "paid" | "rejected" | "cancelled";
  is_expired: boolean;
  qr_code?: string;
  created_at: string;
  expires_at?: string | null;
  events?: { title: string; location: string } | null;
  payment_method: string;
  payment?: { payment_method: string; status: string };
  order_items?: { id: number | string; qty: number; subtotal: number; ticket_categories?: { category_name: string } }[];
}

export async function fetchLocalPaymentPreview(token: string): Promise<LocalPaymentPreview> {
  const response = await api.get<{ data?: LocalPaymentPreview }>("/payments/local-simulation/preview", { params: { token } });
  if (response.data?.data) return response.data.data;
  throw new Error("Tagihan simulasi tidak ditemukan");
}

export async function simulateLocalPayment(token: string, paymentMethod: string): Promise<void> {
  await api.post("/payments/local-simulation/confirm", { token, payment_method: paymentMethod });
}

export async function fetchLocalPaymentQr(orderId: number | string, paymentMethod: string): Promise<{ qr_code: string; scan_url: string; order_code: string; amount: number; expires_at: string | null }> {
  const response = await api.get<{ data?: { qr_code?: string; scan_url?: string; order_code?: string; amount?: number; expires_at?: string | null } }>(`/payments/local-simulation/${orderId}/qr`, { params: { payment_method: paymentMethod } });
  const payment = response.data?.data;
  if (payment?.qr_code && payment.scan_url && payment.order_code && typeof payment.amount === "number") {
    return { qr_code: payment.qr_code, scan_url: payment.scan_url, order_code: payment.order_code, amount: payment.amount, expires_at: payment.expires_at ?? null };
  }
  throw new Error("QR simulasi tidak dapat dibuat");
}
