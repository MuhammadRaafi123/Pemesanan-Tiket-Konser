export interface Payment {
  id: number | string;
  order_id: number | string;
  payment_method: string;
  proof_image: string;
  status: "pending" | "approved" | "rejected";
  verified_at?: string;
  created_at: string;
}

export interface CreatePaymentPayload {
  order_id: number | string;
  payment_method: string;
  proof_image?: File | string;
}
