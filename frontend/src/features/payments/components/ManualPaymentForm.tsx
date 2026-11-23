"use client";

import { useState, type FormEvent } from "react";
import { Loader2, Send } from "lucide-react";
import { PaymentMethodSelector } from "./PaymentMethodSelector";
import { PaymentProofUpload } from "./PaymentProofUpload";
import { LOCAL_PAYMENT_METHODS, submitPayment } from "../api";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";

interface ManualPaymentFormProps {
  orderId: number | string;
  amount: number;
  onSubmitted: () => void;
}

export function ManualPaymentForm({ orderId, amount, onSubmitted }: ManualPaymentFormProps) {
  const [method, setMethod] = useState("BCA");
  const [payerName, setPayerName] = useState("");
  const [reference, setReference] = useState("");
  const [paidAmount, setPaidAmount] = useState(String(amount));
  const [proof, setProof] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    if (!proof) {
      setFormError("Unggah bukti pembayaran terlebih dahulu.");
      return;
    }
    setSubmitting(true);
    const data = new FormData();
    data.set("order_id", String(orderId));
    data.set("payment_method", method);
    data.set("payer_name", payerName);
    data.set("transaction_reference", reference);
    data.set("paid_amount", paidAmount);
    data.set("proof_image", proof);
    try {
      await submitPayment(data);
      onSubmitted();
    } catch (error: unknown) {
      setFormError(getApiErrorMessage(error, "Bukti pembayaran gagal dikirim."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={(event) => void handleSubmit(event)} className="space-y-5">
      <div>
        <p className="mb-3 text-xs font-bold text-[#51486c]">Pilih metode transfer</p>
        <PaymentMethodSelector methods={LOCAL_PAYMENT_METHODS.filter((item) => item.category !== "qris")} selectedMethod={method} onSelect={setMethod} />
      </div>
      <label className="block text-xs font-semibold text-[#51486c]">Nama pengirim
        <input required minLength={2} maxLength={120} value={payerName} onChange={(event) => setPayerName(event.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-[#e8e5ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#7048e8]" placeholder="Nama sesuai rekening" />
      </label>
      <label className="block text-xs font-semibold text-[#51486c]">Nomor referensi transaksi
        <input required minLength={3} maxLength={120} value={reference} onChange={(event) => setReference(event.target.value)} className="mt-2 w-full rounded-xl border border-[#e8e5ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#7048e8]" placeholder="Contoh: ID transaksi atau nomor referensi" />
      </label>
      <label className="block text-xs font-semibold text-[#51486c]">Nominal yang dibayar
        <input required type="number" min="1" step="1" value={paidAmount} onChange={(event) => setPaidAmount(event.target.value)} className="mt-2 w-full rounded-xl border border-[#e8e5ef] bg-white px-4 py-3 text-sm outline-none focus:border-[#7048e8]" />
        <span className="mt-1 block font-normal text-[#817994]">Total tagihan: {formatCurrency(amount)}</span>
      </label>
      <div><p className="mb-2 text-xs font-semibold text-[#51486c]">Bukti pembayaran</p><PaymentProofUpload onFileSelect={setProof} /></div>
      {formError && <p role="alert" className="rounded-xl bg-[#fff1ef] p-3 text-xs text-[#a3473f]">{formError}</p>}
      <p className="rounded-xl border border-[#eeeaf6] bg-[#f8f6ff] p-4 text-xs leading-5 text-[#51486c]">Pembayaran manual akan berstatus menunggu sampai admin memeriksa bukti dan rincian transaksi.</p>
      <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#7048e8] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#5c36d2] disabled:cursor-wait disabled:opacity-60">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{submitting ? "Mengirim bukti..." : "Kirim pembayaran untuk diverifikasi"}</button>
    </form>
  );
}
