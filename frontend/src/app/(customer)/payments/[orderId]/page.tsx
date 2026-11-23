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
  PencilLine,
  QrCode,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchOrderById } from "@/features/orders/api";
import { fetchLocalPaymentQr, LOCAL_PAYMENT_METHODS } from "@/features/payments/api";
import { PaymentMethodSelector } from "@/features/payments/components/PaymentMethodSelector";
import { ManualPaymentForm } from "@/features/payments/components/ManualPaymentForm";
import { isOrderExpired, type Order } from "@/features/orders/types";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";
import { useToast } from "@/components/shared/ToastProvider";

export default function PaymentPage() {
  const params = useParams();
  const orderId = String(params.orderId ?? "");
  const { error } = useToast();
  const [paymentType, setPaymentType] = useState<"qr" | "manual">("qr");
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
      <div className="payment-page flex min-h-screen flex-col bg-[#f5f2ff] text-[#211a39]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pb-24 pt-28">
          <div className="flex flex-col items-center gap-4 text-center"><span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#f1edff] text-[#7048e8]">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Ticket className="h-6 w-6" />}</span><p className="text-sm font-semibold text-[#51486c]">{loading ? "Memuat pembayaran..." : "Pesanan tidak ditemukan."}</p></div>
        </main>
        <Footer /><MobileNav />
      </div>
    );
  }

  const expired = isOrderExpired(order);
  const pending = order.status === "pending" && !expired;
  const canPay = pending && !order.payment;

  return (
    <div className="payment-page min-h-screen overflow-hidden bg-[#f5f2ff] text-[#211a39]">
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-28 sm:px-8 sm:pt-36">
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-[#d9ceff]/50 blur-3xl" />
        <Link href="/orders" className="relative inline-flex items-center gap-2 text-xs font-bold text-[#817994] transition hover:text-[#7048e8]"><ArrowLeft className="h-4 w-4" /> Riwayat pesanan</Link>

        <header className="relative mt-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[.24em] text-[#7048e8]">Langkah terakhir</p>
            <h1 className="mt-2 font-display text-4xl tracking-[-.05em] sm:text-5xl">Selesaikan pembayaran.</h1>
            <p className="mt-3 text-sm text-[#817994]">Pesanan <span className="font-bold text-[#51486c]">#{order.order_code}</span></p>
          </div>
          <div className={`inline-flex items-center gap-2 self-start rounded-full border px-4 py-2 text-xs font-bold sm:self-auto ${pending ? "border-[#f5dcb3] bg-[#fff8e9] text-[#9b671b]" : order.status === "paid" ? "border-[#b9e7ca] bg-[#effbf3] text-[#21864b]" : "border-[#e4def5] bg-white text-[#817994]"}`}>
            {order.status === "paid" ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
            {pending ? "Menunggu pembayaran" : expired ? "Pesanan hangus" : order.status === "paid" && order.payment?.payment_method.startsWith("SIMULASI_") ? "Simulasi berhasil" : order.status === "paid" ? "Pembayaran lunas" : `Status: ${order.status}`}
          </div>
        </header>

        <div className="relative mt-8 grid items-start gap-6 lg:grid-cols-[1fr_.82fr]">
          <div className="space-y-6">
            <section className="overflow-hidden rounded-[30px] border border-white bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(67,45,126,.3)] sm:p-7">
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#817994]">Detail tagihan</p>
              <div className="mt-5 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0ebff] text-[#7048e8]"><Ticket className="h-5 w-5" /></div>
                <div className="min-w-0 flex-1">
                  <h2 className="font-bold text-[#211a39]">{order.events?.title ?? "Tiket konser"}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-[#817994]"><MapPin className="h-3.5 w-3.5 text-[#7048e8]" />{order.events?.location ?? "Lokasi konser"}</p>
                </div>
              </div>
              <div className="mt-5 divide-y divide-[#eeeaf6] rounded-xl border border-[#eeeaf6] px-4">
                {(order.order_items || []).map((item) => (
                  <div key={item.id} className="flex items-center justify-between gap-4 py-3 text-xs">
                    <span className="min-w-0 text-[#51486c]"><span className="block truncate font-bold">{item.ticket_categories?.category_name || "Tiket konser"}</span><span className="mt-1 block text-[#817994]">{item.qty} × {formatCurrency(item.ticket_categories?.price ?? item.subtotal / item.qty)}</span></span>
                    <span className="shrink-0 font-semibold text-[#51486c]">{formatCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-end justify-between gap-4 rounded-2xl bg-[#f8f6ff] p-4">
                <div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-[#817994]">Total pembayaran</p><p className="mt-1 font-display text-3xl text-[#7048e8]">{formatCurrency(order.total)}</p></div>
                <span className="max-w-40 pb-1 text-right text-[10px] font-semibold leading-4 text-[#817994]">Biaya tambahan simulasi: Rp0</span>
              </div>
              {order.expires_at && pending && <p className="mt-4 flex items-center gap-2 text-xs text-[#817994]"><Clock3 className="h-3.5 w-3.5 text-[#e39b3d]" />Bayar sebelum {order.expires_at}.</p>}
            </section>

            {order.status === "paid" && order.qr_code ? (
              <section className="rounded-[30px] border border-[#c9edd4] bg-[#f2fcf5] p-6 shadow-[0_20px_60px_-46px_rgba(33,134,75,.35)] sm:p-7">
                <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#dff6e6] text-[#21864b]"><CheckCircle2 className="h-5 w-5" /></div><div><h2 className="font-bold text-[#205c38]">Tiketmu aktif</h2><p className="text-xs text-[#5c8a6b]">{order.payment?.payment_method.startsWith("SIMULASI_") ? "Pembayaran ini hanya simulasi lokal." : "Tunjukkan QR ini saat masuk venue."}</p></div></div>
                <div className="mx-auto mt-5 w-fit rounded-2xl border border-[#d7ebdd] bg-white p-3"><Image src={order.qr_code} alt="QR tiket konser" width={190} height={190} unoptimized /></div>
                <Link href="/tickets" className="mx-auto mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#51486c] hover:text-[#155c30]">Buka tiket saya <ArrowRight className="h-3.5 w-3.5" /></Link>
              </section>
            ) : null}

          </div>
          {canPay ? (
            <aside className="space-y-5 rounded-[30px] border border-white bg-white/90 p-6 shadow-[0_24px_80px_-48px_rgba(67,45,126,.3)] sm:p-7">
              <div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#7048e8]">Pembayaran lokal</p><h2 className="mt-1 text-xl font-bold">{simulationReady ? "Konfirmasi simulasi" : "Pilih metode demo"}</h2></div>
              <div className="grid grid-cols-2 gap-2 rounded-2xl bg-[#f5f2ff] p-1.5">
                <button type="button" onClick={() => { setPaymentType("qr"); setSimulationReady(false); }} aria-pressed={paymentType === "qr"} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition ${paymentType === "qr" ? "bg-white text-[#7048e8] shadow-sm" : "text-[#817994] hover:text-[#51486c]"}`}><QrCode className="h-4 w-4" /> QR demo</button>
                <button type="button" onClick={() => { setPaymentType("manual"); setSimulationReady(false); }} aria-pressed={paymentType === "manual"} className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-bold transition ${paymentType === "manual" ? "bg-white text-[#7048e8] shadow-sm" : "text-[#817994] hover:text-[#51486c]"}`}><PencilLine className="h-4 w-4" /> Input manual</button>
              </div>
              {paymentType === "manual" ? (
                <ManualPaymentForm orderId={order.id} amount={Number(order.total)} onSubmitted={() => {
                  fetchOrderById(order.id).then(setOrder).catch(() => undefined);
                }} />
              ) : !simulationReady ? (
                <>
                  <PaymentMethodSelector methods={LOCAL_PAYMENT_METHODS} selectedMethod={selectedMethod} onSelect={(method) => { setSelectedMethod(method); setSimulationReady(false); }} />
                  <div className="rounded-xl border border-[#eeeaf6] bg-[#f8f6ff] p-4 text-xs leading-5 text-[#51486c]"><strong>Mode simulasi:</strong> tidak ada uang sungguhan yang ditagih. QR yang dibuat adalah QR demo dan tidak bisa dibayar melalui bank atau e-wallet.</div>
                  <button type="button" disabled={preparingQr} onClick={() => void startPayment()} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#7048e8] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#5c36d2] disabled:cursor-wait disabled:opacity-60">{preparingQr ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}{preparingQr ? "Membuat QR demo..." : "Tampilkan QR pembayaran"}</button>
                </>
              ) : (
                <>
                  <div className="rounded-2xl border border-[#eeeaf6] bg-[#fcfbff] p-5 text-sm">
                    <div className="flex justify-between gap-4"><span className="text-[#817994]">Metode demo</span><strong>{selectedMethodName}</strong></div>
                    <div className="mt-3 flex justify-between gap-4 border-t border-[#eeeaf6] pt-3"><span className="text-[#817994]">Nominal simulasi</span><strong className="text-[#7048e8]">{formatCurrency(order.total)}</strong></div>
                    <div className="mt-3 flex justify-between gap-4 border-t border-[#eeeaf6] pt-3"><span className="text-[#817994]">Kode transaksi</span><strong className="text-right">{order.order_code}</strong></div>
                  </div>
                  {paymentQr && <div className="mx-auto w-fit rounded-2xl border border-[#eeeaf6] bg-white p-3"><Image src={paymentQr} alt="QR pembayaran simulasi lokal" width={220} height={220} unoptimized /><p className="mt-2 text-center text-[10px] font-bold uppercase tracking-wider text-[#7048e8]">QR simulasi</p></div>}
                  <p className="text-xs leading-5 text-[#817994]">Pindai QR untuk membuka halaman tagihan pada perangkatmu. Di sana kamu bisa melanjutkan dengan tombol Bayar sekarang.</p>
                  {scanUrl && <Link href={scanUrl} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#7048e8] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#5c36d2]"><ArrowRight className="h-4 w-4" />Buka halaman pembayaran</Link>}
                  <button type="button" disabled={preparingQr} onClick={() => setSimulationReady(false)} className="w-full text-xs font-semibold text-[#7048e8] hover:underline">Kembali memilih metode</button>
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
