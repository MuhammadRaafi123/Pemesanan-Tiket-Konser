export interface Payment {
  id: number | string;
  order_id: number | string;
  payment_method: string;
  payer_name?: string;
  transaction_reference?: string;
  paid_amount?: number;
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
