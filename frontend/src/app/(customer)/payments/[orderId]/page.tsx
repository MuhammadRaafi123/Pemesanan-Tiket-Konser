"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, CreditCard, Loader2, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchOrderById } from "@/features/orders/api";
import { submitPayment } from "@/features/payments/api";
import type { Order } from "@/features/orders/types";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";
import { useToast } from "@/components/shared/ToastProvider";

export default function PaymentPage() {
  const params = useParams();
  const orderId = String(params.orderId ?? "");
  const { success, error } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(params.orderId));
  const [selectedMethod, setSelectedMethod] = useState("QRIS");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId) return;

    let active = true;
    fetchOrderById(orderId)
      .then((nextOrder) => {
        if (active) setOrder(nextOrder);
      })
      .catch((requestError: unknown) => {
        if (active) {
          error(getApiErrorMessage(requestError, "Detail pesanan gagal dimuat."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [error, orderId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!order) return;
    if (!proofFile) {
      error("Silakan unggah bukti pembayaran terlebih dahulu.");
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("order_id", String(order.id));
      formData.append("payment_method", selectedMethod);
      formData.append("proof_image", proofFile);

      const payment = await submitPayment(formData);
      setOrder((current) => (current ? { ...current, payment } : current));
      success("Bukti pembayaran berhasil dikirim untuk diverifikasi.");
    } catch (requestError: unknown) {
      error(getApiErrorMessage(requestError, "Gagal mengirim bukti pembayaran."));
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pb-24 pt-28">
          <div className="flex items-center gap-3 rounded-2xl border border-[#232733] bg-[#141720] px-5 py-4 text-sm font-medium text-white shadow-2xl">
            <Loader2 className="h-5 w-5 animate-spin text-[#ffb703]" />
            Memuat detail pembayaran...
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pb-24 pt-28">
          <div className="max-w-md rounded-[28px] border border-[#232733] bg-[#141720] p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-bold text-white">Pesanan tidak ditemukan</h1>
            <p className="mt-3 text-sm text-[#8a8d9b]">Pesanan yang kamu cari mungkin sudah tidak tersedia atau belum dibuat.</p>
            <Link href="/orders" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-sm font-semibold text-[#10131a] hover:bg-[#ffdea9] transition-colors">Lihat riwayat pesanan</Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const isPending = order.status === "pending";

  return (
    <div className="min-h-screen bg-[#0b0e15] text-[#e1e2ec]">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#ffb703] hover:text-[#ffdea9] transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke riwayat pesanan
        </Link>

        <section className="mt-6 rounded-[30px] border border-[#232733] bg-[#141720] p-6 shadow-2xl sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">Pembayaran</p>
              <h1 className="mt-2 text-3xl font-extrabold text-white">Order #{order.order_code}</h1>
            </div>
            <div className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
              isPending
                ? "border-amber-500/20 bg-amber-500/10 text-amber-300"
                : order.status === "paid"
                ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                : "border-[#232733] bg-[#1a1d26] text-[#8a8d9b]"
            }`}>
              {isPending ? "Menunggu pembayaran" : order.status === "paid" ? "Pembayaran lunas" : `Status: ${order.status}`}
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-[#232733] bg-[#191c26] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8d9b]">Total yang harus dibayar</p>
              <p className="mt-3 text-3xl font-black text-[#ffb703]">{formatCurrency(order.total)}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#8a8d9b]">
                <Clock3 className="h-4 w-4 text-[#ffb703]" />
                Mohon bayar sebelum waktu kedaluwarsa pesanan.
              </div>
            </div>

            <div className="rounded-2xl border border-[#232733] bg-[#191c26] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8a8d9b]">Detail tiket</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#ffb703]/10 text-[#ffb703]">
                  <Ticket className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-white">{order.events?.title ?? "Tiket konser"}</p>
                  <p className="text-xs text-[#8a8d9b]">{order.events?.location ?? "Lokasi konser"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 rounded-[30px] border border-[#232733] bg-[#141720] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center gap-2 text-white">
            <CreditCard className="h-5 w-5 text-[#ffb703]" />
            <h2 className="text-xl font-bold">Unggah bukti pembayaran</h2>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#e1e2ec]">Metode pembayaran</label>
              <select value={selectedMethod} onChange={(event) => setSelectedMethod(event.target.value)} className="h-12 w-full rounded-2xl border border-[#262a37] bg-[#191c26] px-3 text-sm text-white outline-none focus:border-[#ffb703]">
                <option value="QRIS" className="bg-[#141720] text-white">QRIS</option>
                <option value="bank_transfer" className="bg-[#141720] text-white">Transfer bank</option>
                <option value="e_wallet" className="bg-[#141720] text-white">E-wallet</option>
                <option value="cash" className="bg-[#141720] text-white">Tunai</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#e1e2ec]">Bukti transfer / resi</label>
              <input type="file" accept="image/*" onChange={(event) => setProofFile(event.target.files?.[0] ?? null)} className="block h-12 w-full rounded-2xl border border-dashed border-[#2a2e3d] bg-[#191c26] px-3 text-sm text-[#8a8d9b] file:mr-3 file:rounded-xl file:border-0 file:bg-[#ffb703] file:px-4 file:py-2 file:text-sm file:font-bold file:text-[#10131a]" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={submitting || !proofFile || !isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-sm font-bold text-[#10131a] transition hover:bg-[#ffdea9] disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Mengirim...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  Kirim bukti pembayaran
                </>
              )}
            </button>
            {order.payment && <span className="text-sm text-[#8a8d9b]">Status bukti: <strong className="text-white">{order.payment.status}</strong></span>}
          </div>
        </form>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
