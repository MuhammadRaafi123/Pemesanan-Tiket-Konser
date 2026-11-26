"use client";

import { useState, type FormEvent } from "react";
import { CircleDollarSign, Landmark, Loader2, Send, ShieldCheck } from "lucide-react";
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
  const selectedMethodName = LOCAL_PAYMENT_METHODS.find((item) => item.id === method)?.name || method;

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
      <div className="flex items-start gap-3 rounded-2xl bg-[#f8f6ff] p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-[#7048e8] shadow-sm"><Landmark className="h-5 w-5" /></span>
        <div><p className="text-sm font-bold text-[#211a39]">Transfer manual</p><p className="mt-1 text-xs leading-5 text-[#817994]">Transfer sesuai tagihan, lalu isi detail transaksi dan unggah bukti pembayaran.</p></div>
      </div>
      <div>
        <p className="mb-3 text-xs font-bold text-[#51486c]">1. Pilih metode transfer</p>
        <PaymentMethodSelector methods={LOCAL_PAYMENT_METHODS.filter((item) => item.category !== "qris")} selectedMethod={method} onSelect={setMethod} />
      </div>
      <div className="rounded-2xl border border-[#eeeaf6] bg-[#f8f6ff] p-4">
        <p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#817994]">Rekening tujuan</p>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold text-[#51486c]">{selectedMethodName} · Tixora Demo</span>
          <span className="font-mono text-lg font-bold tracking-wider text-[#7048e8]">1234567890</span>
        </div>
      </div>
      <label className="block text-xs font-semibold text-[#51486c]">Nama pengirim
        <input required minLength={2} maxLength={120} value={payerName} onChange={(event) => setPayerName(event.target.value)} autoComplete="name" className="mt-2 w-full rounded-xl border border-[#e8e5ef] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa4b6] focus:border-[#7048e8] focus:ring-4 focus:ring-[#7048e8]/10" placeholder="Nama sesuai rekening" />
      </label>
      <label className="block text-xs font-semibold text-[#51486c]">Nomor referensi transaksi
        <input required minLength={3} maxLength={120} value={reference} onChange={(event) => setReference(event.target.value)} className="mt-2 w-full rounded-xl border border-[#e8e5ef] bg-white px-4 py-3 text-sm outline-none transition placeholder:text-[#aaa4b6] focus:border-[#7048e8] focus:ring-4 focus:ring-[#7048e8]/10" placeholder="Contoh: ID transaksi atau nomor referensi" />
      </label>
      <label className="block text-xs font-semibold text-[#51486c]">Nominal yang dibayar
        <div className="relative mt-2"><CircleDollarSign className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9b8cc2]" /><input required type="number" min="1" step="1" value={paidAmount} onChange={(event) => setPaidAmount(event.target.value)} className="w-full rounded-xl border border-[#e8e5ef] bg-white py-3 pl-11 pr-4 text-sm outline-none transition focus:border-[#7048e8] focus:ring-4 focus:ring-[#7048e8]/10" /></div>
        <span className="mt-1.5 block font-normal text-[#817994]">Total tagihan: {formatCurrency(amount)}</span>
      </label>
      <div><p className="mb-2 text-xs font-semibold text-[#51486c]">Bukti pembayaran</p><PaymentProofUpload onFileSelect={setProof} /></div>
      {formError && <p role="alert" className="rounded-xl bg-[#fff1ef] p-3 text-xs text-[#a3473f]">{formError}</p>}
      <p className="flex items-start gap-2 rounded-xl bg-[#f8f6ff] p-3.5 text-xs leading-5 text-[#51486c]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#7048e8]" />Pembayaran manual menunggu verifikasi admin setelah bukti dan detail transaksi diperiksa.</p>
      <button type="submit" disabled={submitting} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7048e8] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#5c36d2] disabled:cursor-wait disabled:opacity-60">{submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}{submitting ? "Mengirim bukti..." : "Kirim bukti pembayaran"}</button>
    </form>
  );
}
