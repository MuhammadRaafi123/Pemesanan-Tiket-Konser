"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Clock3, Loader2, MapPin, ShieldCheck, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchLocalPaymentPreview, LOCAL_PAYMENT_METHODS, simulateLocalPayment, type LocalPaymentPreview } from "@/features/payments/api";
import { PaymentMethodSelector } from "@/features/payments/components/PaymentMethodSelector";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";

function ScanPaymentContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const invalidQr = !token;
  const [order, setOrder] = useState<LocalPaymentPreview | null>(null);
  const [selectedMethod, setSelectedMethod] = useState("BCA");
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (invalidQr) return;
    let active = true;
    fetchLocalPaymentPreview(token)
      .then((result) => { if (active) { setOrder(result); setSelectedMethod(result.payment_method); } })
      .catch((requestError: unknown) => { if (active) setErrorMessage(getApiErrorMessage(requestError, "Tagihan tidak dapat dimuat. Login kembali lalu coba pindai QR.")); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [invalidQr, token]);

  const payNow = async () => {
    if (!order || !token) return;
    setPaying(true);
    setErrorMessage("");
    try {
      await simulateLocalPayment(token, selectedMethod);
      setOrder(await fetchLocalPaymentPreview(token));
    } catch (requestError: unknown) {
      setErrorMessage(getApiErrorMessage(requestError, "Pembayaran gagal diproses."));
    } finally {
      setPaying(false);
    }
  };

  const method = LOCAL_PAYMENT_METHODS.find((item) => item.id === selectedMethod);
  const expired = order?.is_expired ?? false;
  const paid = order?.status === "paid";

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#211a39]">
      <Navbar />
      <main className="relative flex flex-1 items-center justify-center overflow-hidden px-5 pb-24 pt-28 sm:pt-32">
        <div className="pointer-events-none absolute left-1/2 top-20 h-80 w-80 -translate-x-1/2 rounded-full bg-[#eee8ff] blur-3xl" />
        <section className="relative w-full max-w-lg rounded-[30px] border border-[#eeeaf6] bg-white p-7 shadow-[0_24px_80px_-48px_rgba(67,45,126,.32)] sm:p-9">
          {!invalidQr && loading ? (
            <div className="flex flex-col items-center py-10 text-center"><Loader2 className="h-8 w-8 animate-spin text-[#7048e8]" /><p className="mt-4 text-sm font-semibold text-[#51486c]">Memuat tagihan...</p></div>
          ) : !invalidQr && order && method ? (
            <>
              <div className="flex items-center gap-3"><span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${paid ? "bg-[#e7f8ed] text-[#21864b]" : "bg-[#f1edff] text-[#7048e8]"}`}>{paid ? <CheckCircle2 className="h-6 w-6" /> : <Ticket className="h-6 w-6" />}</span><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#7048e8]">{paid ? "Pembayaran berhasil" : "Scan Payment"}</p><h1 className="mt-1 font-display text-2xl tracking-[-.04em]">{paid ? "Tiketmu aktif" : "Selesaikan pembayaran"}</h1></div></div>
              <p className="mt-4 text-xs text-[#817994]">Kode transaksi <strong className="text-[#51486c]">#{order.order_code}</strong></p>
              <div className="mt-5 rounded-2xl border border-[#eeeaf6] bg-[#fcfbff] p-4">
                <p className="font-bold text-[#211a39]">{order.events?.title || "Tiket konser"}</p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#817994]"><MapPin className="h-3.5 w-3.5" />{order.events?.location || "Lokasi konser"}</p>
                {order.order_items?.map((item) => <div key={item.id} className="mt-3 flex justify-between gap-3 text-xs"><span className="text-[#51486c]">{item.ticket_categories?.category_name || "Tiket"} × {item.qty}</span><span className="font-semibold">{formatCurrency(item.subtotal)}</span></div>)}
                <div className="mt-4 flex justify-between border-t border-[#eeeaf6] pt-4 text-sm"><span className="text-[#817994]">Total</span><strong className="text-[#7048e8]">{formatCurrency(order.total)}</strong></div>
                <div className="mt-2 flex justify-between text-xs"><span className="text-[#817994]">Metode</span><strong>{method.name}</strong></div>
              </div>
              {order.expires_at && !paid && <p className="mt-4 flex items-center gap-2 text-xs text-[#817994]"><Clock3 className="h-3.5 w-3.5 text-[#e39b3d]" />Batas pembayaran: {new Date(order.expires_at).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}</p>}
              {order.payment_method === "QRIS" && !paid && !expired && !order.payment && <div className="mt-5"><p className="mb-3 text-xs font-bold text-[#51486c]">Pilih metode pembayaran</p><PaymentMethodSelector methods={LOCAL_PAYMENT_METHODS} selectedMethod={selectedMethod} onSelect={setSelectedMethod} /></div>}
              {paid && order.qr_code ? <div className="mt-5 text-center"><Image src={order.qr_code} alt="QR tiket konser" width={200} height={200} unoptimized className="mx-auto rounded-xl border border-[#e4def5] p-2" /><p className="mt-3 text-xs text-[#51486c]">QR tiket demo. Tunjukkan saat masuk venue.</p></div> : null}
              {!paid && !expired && !order.payment && <button type="button" disabled={paying} onClick={() => void payNow()} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[#7048e8] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#51486c] disabled:cursor-wait disabled:opacity-60">{paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{paying ? "Memproses pembayaran..." : "Bayar sekarang"}</button>}
              {expired && <p className="mt-5 rounded-xl bg-[#fff8e9] p-4 text-xs font-semibold text-[#9b671b]">Pesanan sudah kedaluwarsa. Buat pesanan baru untuk melanjutkan.</p>}
              {order.payment && !paid && <p className="mt-5 rounded-xl bg-[#fff8e9] p-4 text-xs font-semibold text-[#9b671b]">Pembayaran untuk pesanan ini sudah diproses.</p>}
              <p className="mt-4 flex items-start gap-2 rounded-xl bg-[#f8f6ff] p-3 text-[10px] leading-5 text-[#51486c]"><ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#7048e8]" />Ini simulasi lokal. Tidak ada uang sungguhan yang ditagih; QR hanya membuka halaman demo Tixora.</p>
            </>
          ) : (
            <div className="py-8 text-center"><p className="font-bold text-[#211a39]">Tagihan tidak tersedia</p><p className="mt-2 text-sm text-[#817994]">{errorMessage || "QR tidak valid atau pesanan tidak ditemukan."}</p><div className="mt-5 flex flex-wrap justify-center gap-4"><Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#7048e8]">Login lalu pindai ulang</Link><Link href="/orders" className="inline-flex items-center gap-2 text-xs font-bold text-[#7048e8]"><ArrowLeft className="h-4 w-4" />Kembali ke pesanan</Link></div></div>
          )}
          {errorMessage && order && <p role="alert" className="mt-4 rounded-xl bg-[#fff1ef] p-3 text-xs text-[#a3473f]">{errorMessage}</p>}
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

export default function ScanPaymentPage() {
  return <Suspense fallback={<div className="min-h-screen bg-white" />}><ScanPaymentContent /></Suspense>;
}
