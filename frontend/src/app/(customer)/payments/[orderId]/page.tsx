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
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("QRIS");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!orderId) {
      setLoading(false);
      return;
    }

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
      <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-[#102a43]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pb-24 pt-28">
          <div className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-white px-5 py-4 text-sm font-medium text-[#123b6d] shadow-[0_25px_80px_-40px_rgba(37,99,235,0.35)]">
            <Loader2 className="h-5 w-5 animate-spin text-[#2563eb]" />
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
      <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-[#102a43]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pb-24 pt-28">
          <div className="max-w-md rounded-[28px] border border-blue-100 bg-white p-8 text-center shadow-[0_25px_80px_-40px_rgba(37,99,235,0.35)]">
            <h1 className="text-2xl font-bold text-[#123b6d]">Pesanan tidak ditemukan</h1>
            <p className="mt-3 text-sm text-[#5c789b]">Pesanan yang kamu cari mungkin sudah tidak tersedia atau belum dibuat.</p>
            <Link href="/orders" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white">Lihat riwayat pesanan</Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const isPending = order.status === "pending";

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#102a43]">
      <Navbar />
      <main className="mx-auto w-full max-w-5xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <Link href="/orders" className="inline-flex items-center gap-2 text-sm font-medium text-[#2563eb]">
          <ArrowLeft className="h-4 w-4" />
          Kembali ke riwayat pesanan
        </Link>

        <section className="mt-6 rounded-[30px] border border-blue-100 bg-white p-6 shadow-[0_25px_80px_-40px_rgba(37,99,235,0.35)] sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Pembayaran</p>
              <h1 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#123b6d]">Order #{order.order_code}</h1>
            </div>
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {isPending ? "Menunggu pembayaran" : order.status === "paid" ? "Pembayaran lunas" : `Status: ${order.status}`}
            </div>
          </div>

          <div className="mt-7 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-blue-100 bg-[#f8fbff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c789b]">Total yang harus dibayar</p>
              <p className="mt-3 text-3xl font-black text-[#2563eb]">{formatCurrency(order.total)}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-[#5c789b]">
                <Clock3 className="h-4 w-4 text-[#2563eb]" />
                Mohon bayar sebelum waktu kedaluwarsa pesanan.
              </div>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-[#f8fbff] p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5c789b]">Detail tiket</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]">
                  <Ticket className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate font-semibold text-[#123b6d]">{order.events?.title ?? "Tiket konser"}</p>
                  <p className="text-xs text-[#5c789b]">{order.events?.location ?? "Lokasi konser"}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <form onSubmit={handleSubmit} className="mt-8 rounded-[30px] border border-blue-100 bg-white p-6 shadow-[0_25px_80px_-40px_rgba(37,99,235,0.35)] sm:p-8">
          <div className="flex items-center gap-2 text-[#123b6d]">
            <CreditCard className="h-5 w-5 text-[#2563eb]" />
            <h2 className="text-xl font-bold">Unggah bukti pembayaran</h2>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
            <div>
              <label className="mb-2 block text-sm font-medium text-[#123b6d]">Metode pembayaran</label>
              <select value={selectedMethod} onChange={(event) => setSelectedMethod(event.target.value)} className="h-12 w-full rounded-2xl border border-blue-100 bg-[#f8fbff] px-3 text-sm text-[#123b6d] outline-none focus:border-[#2563eb]">
                <option value="QRIS">QRIS</option>
                <option value="bank_transfer">Transfer bank</option>
                <option value="e_wallet">E-wallet</option>
                <option value="cash">Tunai</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[#123b6d]">Bukti transfer / resi</label>
              <input type="file" accept="image/*" onChange={(event) => setProofFile(event.target.files?.[0] ?? null)} className="block h-12 w-full rounded-2xl border border-dashed border-blue-200 bg-[#f8fbff] px-3 text-sm text-[#5c789b] file:mr-3 file:rounded-xl file:border-0 file:bg-[#2563eb] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white" />
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button type="submit" disabled={submitting || !proofFile || !isPending} className="inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-60">
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
            {order.payment && <span className="text-sm text-[#5c789b]">Status bukti: <strong className="text-[#123b6d]">{order.payment.status}</strong></span>}
          </div>
        </form>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
