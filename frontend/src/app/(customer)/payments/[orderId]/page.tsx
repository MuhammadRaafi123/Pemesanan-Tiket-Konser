"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Loader2,
  MapPin,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchOrderById } from "@/features/orders/api";
import { fetchLocalPaymentQr, LOCAL_PAYMENT_METHODS } from "@/features/payments/api";
import { PaymentMethodSelector } from "@/features/payments/components/PaymentMethodSelector";
import { isOrderExpired, type Order } from "@/features/orders/types";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";
import { useToast } from "@/components/shared/ToastProvider";

export default function PaymentPage() {
  const params = useParams();
  const orderId = String(params.orderId ?? "");
  const { error } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(Boolean(params.orderId));
  const [selectedMethod, setSelectedMethod] = useState("BCA");
  const [simulationReady, setSimulationReady] = useState(false);
  const [paymentQr, setPaymentQr] = useState<string | null>(null);
  const [scanUrl, setScanUrl] = useState<string | null>(null);
  const [preparingQr, setPreparingQr] = useState(false);
  const currentOrderId = order?.id;
  const currentOrderStatus = order?.status;

  useEffect(() => {
    if (!orderId) return;
    let active = true;
    fetchOrderById(orderId)
      .then((nextOrder) => {
        if (!active) return;
        setOrder(nextOrder);
      })
      .catch((requestError: unknown) => {
        if (active) error(getApiErrorMessage(requestError, "Detail pesanan gagal dimuat."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => { active = false; };
  }, [error, orderId]);

  // Keep the payment screen current if the local simulation was submitted elsewhere.
  useEffect(() => {
    if (!currentOrderId || currentOrderStatus !== "pending") return;
    const refreshInterval = window.setInterval(() => {
      fetchOrderById(currentOrderId)
        .then((latestOrder) => {
          if (latestOrder) setOrder(latestOrder);
        })
        .catch(() => undefined);
    }, 5000);
    return () => window.clearInterval(refreshInterval);
  }, [currentOrderId, currentOrderStatus]);

  const startPayment = async () => {
    if (!order) return;
    setPreparingQr(true);
    try {
      const result = await fetchLocalPaymentQr(order.id, selectedMethod);
      setPaymentQr(result.qr_code);
      setScanUrl(result.scan_url);
      setSimulationReady(true);
    } catch (requestError: unknown) {
      error(getApiErrorMessage(requestError, "QR simulasi gagal dibuat."));
    } finally {
      setPreparingQr(false);
    }
  };

  const selectedMethodName = LOCAL_PAYMENT_METHODS.find((method) => method.id === selectedMethod)?.name || selectedMethod;

  if (loading || !order) {
    return (
      <div className="payment-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pb-24 pt-28">
          <div className="flex flex-col items-center gap-4 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edff] text-[#6264b5]">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Ticket className="h-6 w-6" />}</span><p className="text-sm font-semibold text-[#3156ad]">{loading ? "Memuat pembayaran..." : "Pesanan tidak ditemukan."}</p></div>
        </main>
        <Footer /><MobileNav />
      </div>
    );
  }

  const expired = isOrderExpired(order);
  const pending = order.status === "pending" && !expired;
  const canPay = pending && !order.payment;

  return (
    <div className="payment-page min-h-screen overflow-hidden bg-[#fffdf2] text-[#071653]">
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-28 sm:px-8 sm:pt-36">
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#e6eefb]/50 blur-3xl" />
        <Link href="/orders" className="relative inline-flex items-center gap-2 text-xs font-bold text-[#5c6482] transition hover:text-[#6264b5]"><ArrowLeft className="h-4 w-4" /> Riwayat pesanan</Link>

        <header className="relative mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#6264b5]">Langkah terakhir</p>
            <h1 className="mt-2 font-display text-4xl tracking-[-.05em] sm:text-5xl">Selesaikan pembayaran.</h1>
            <p className="mt-3 text-sm text-[#5c6482]">Pesanan <span className="font-bold text-[#3156ad]">#{order.order_code}</span></p>
          </div>
          <div className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold sm:self-auto ${pending ? "border-[#f5dcb3] bg-[#fff8e9] text-[#9b671b]" : order.status === "paid" ? "border-[#b9e7ca] bg-[#effbf3] text-[#3156ad]" : "border-[#e8e5ef] bg-white text-[#5c6482]"}`}>
            {order.status === "paid" ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
            {pending ? "Menunggu pembayaran" : expired ? "Pesanan hangus" : order.status === "paid" && order.payment?.payment_method.startsWith("SIMULASI_") ? "Simulasi berhasil" : order.status === "paid" ? "Pembayaran lunas" : `Status: ${order.status}`}
          </div>
        </header>

        <div className="relative mt-8 grid items-start gap-6 lg:grid-cols-[1fr_.82fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[30px] border border-white bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(67,45,126,.3)] sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#5c6482]">Detail tagihan</p>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eeebf4] text-[#6264b5]"><Ticket className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-[#071653]">{order.events?.title ?? "Tiket konser"}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#5c6482]"><MapPin className="h-3.5 w-3.5 text-[#6264b5]" />{order.events?.location ?? "Lokasi konser"}</p>
                </div>
              </div>
              <div className="mt-5 divide-y divide-[#e8e5ef] rounded-xl border border-[#e8e5ef] px-4">
                {(order.order_items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-xs">
                    <span className="min-w-0 text-[#3156ad]"><span className="block truncate font-bold">{item.ticket_categories?.category_name || "Tiket konser"}</span><span className="mt-1 block text-[#5c6482]">{item.qty} × {formatCurrency(item.ticket_categories?.price ?? item.subtotal / item.qty)}</span></span>
                    <span className="shrink-0 font-semibold text-[#3156ad]">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-end justify-between gap-4 rounded-2xl bg-[#f7f4fa] p-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#5c6482]">Total pembayaran</p><p className="mt-1 font-display text-3xl text-[#6264b5]">{formatCurrency(order.total)}</p></div>
                <span className="max-w-40 pb-1 text-right text-[10px] font-semibold leading-4 text-[#5c6482]">Biaya tambahan simulasi: Rp0</span>
              </div>
              {order.expires_at && pending && <p className="mt-4 flex items-center gap-2 text-xs text-[#5c6482]"><Clock3 className="h-3.5 w-3.5 text-[#e39b3d]" />Bayar sebelum {order.expires_at}.</p>}
            </section>

            {order.status === "paid" && order.qr_code ? (
              <section className="rounded-[30px] border border-[#c9edd4] bg-[#f7f4fa] p-6 shadow-[0_20px_60px_-46px_rgba(33,134,75,.35)] sm:p-7">
                <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e6eefb] text-[#3156ad]"><CheckCircle2 className="h-5 w-5" /></div><div><h2 className="font-bold text-[#071653]">Tiketmu aktif</h2><p className="text-xs text-[#5c6482]">{order.payment?.payment_method.startsWith("SIMULASI_") ? "Pembayaran ini hanya simulasi lokal." : "Tunjukkan QR ini saat masuk venue."}</p></div></div>
                <div className="mx-auto mt-5 w-fit rounded-2xl border border-[#e8e5ef] bg-white p-3"><Image src={order.qr_code} alt="QR tiket konser" width={190} height={190} unoptimized /></div>
                <Link href="/tickets" className="mx-auto mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#3156ad] hover:text-[#155c30]">Buka tiket saya <ArrowRight className="h-3.5 w-3.5" /></Link>
              </section>
            ) : null}

          </div>
          {canPay ? (
            <aside className="space-y-5 rounded-[30px] border border-white bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(67,45,126,.3)] sm:p-7">
              <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">Pembayaran lokal</p><h2 className="mt-1 text-xl font-bold">{simulationReady ? "Konfirmasi simulasi" : "Pilih metode demo"}</h2></div>
              {!simulationReady ? (
                <>
                  <PaymentMethodSelector methods={LOCAL_PAYMENT_METHODS} selectedMethod={selectedMethod} onSelect={(method) => { setSelectedMethod(method); setSimulationReady(false); }} />
                  <div className="rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] p-4 text-xs leading-5 text-[#3156ad]"><strong>Mode simulasi:</strong> tidak ada uang sungguhan yang ditagih. QR yang dibuat adalah QR demo dan tidak bisa dibayar melalui bank atau e-wallet.</div>
                  <button type="button" disabled={preparingQr} onClick={() => void startPayment()} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6264b5] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#3156ad] disabled:cursor-wait disabled:opacity-60">{preparingQr ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{preparingQr ? "Membuat QR demo..." : "Tampilkan QR pembayaran"}</button>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-[#e8e5ef] bg-[#f7f4fa] p-5 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-[#5c6482]">Metode demo</span><strong>{selectedMethodName}</strong></div>
                    <div className="mt-3 flex justify-between gap-4 border-t border-[#e8e5ef] pt-3"><span className="text-[#5c6482]">Nominal simulasi</span><strong className="text-[#6264b5]">{formatCurrency(order.total)}</strong></div>
                    <div className="mt-3 flex justify-between gap-4 border-t border-[#e8e5ef] pt-3"><span className="text-[#5c6482]">Kode transaksi</span><strong className="text-right">{order.order_code}</strong></div>
                  </div>
                  {paymentQr && <div className="mx-auto w-fit rounded-2xl border border-[#e8e5ef] bg-white p-3"><Image src={paymentQr} alt="QR pembayaran simulasi lokal" width={220} height={220} unoptimized /><p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">QR simulasi</p></div>}
                  <p className="text-xs leading-5 text-[#5c6482]">Pindai QR untuk membuka halaman tagihan pada perangkatmu. Di sana kamu bisa melanjutkan dengan tombol Bayar sekarang.</p>
                  {scanUrl && <Link href={scanUrl} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#6264b5] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#3156ad]"><ArrowRight className="h-4 w-4" />Buka halaman pembayaran</Link>}
                  <button type="button" disabled={preparingQr} onClick={() => setSimulationReady(false)} className="w-full text-xs font-semibold text-[#6264b5] hover:underline">Kembali memilih metode</button>
                </>
              )}
            </aside>
          ) : order.payment && pending ? (
            <aside className="rounded-[30px] border border-[#f1dfbd] bg-[#fff9eb] p-6 text-sm text-[#8b672b]"><Clock3 className="mb-3 h-5 w-5" /><p className="font-bold">Menunggu konfirmasi pembayaran</p><p className="mt-1 text-xs leading-5">Status transaksi: {order.payment.status}. Simulasi akan dikonfirmasi melalui aksi demo.</p><Link href="/orders" className="mt-4 inline-flex items-center gap-2 text-xs font-bold hover:underline">Lihat pesanan <ArrowRight className="h-3.5 w-3.5" /></Link></aside>
          ) : null}
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
