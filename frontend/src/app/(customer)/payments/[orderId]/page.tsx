"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Clock, CreditCard, FileText, PartyPopper, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { PaymentProofUpload } from "@/features/payments/components/PaymentProofUpload";
import { PaymentMethodSelector } from "@/features/payments/components/PaymentMethodSelector";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/ToastProvider";
import { ErrorState } from "@/components/shared/ErrorState";
import { fetchOrderById } from "@/features/orders/api";
import { submitPayment } from "@/features/payments/api";
import type { Order } from "@/features/orders/types";
import { Loading } from "@/components/shared/Loading";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";

const TOTAL_SECONDS = 15 * 60;

const formatTimer = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${rest.toString().padStart(2, "0")}`;
};

function CountdownRing({ seconds }: { seconds: number }) {
  const radius = 26;
  const circumference = 2 * Math.PI * radius;
  const ratio = Math.max(0, Math.min(1, seconds / TOTAL_SECONDS));
  const isUrgent = seconds <= 300;

  return (
    <div className="relative h-16 w-16 shrink-0">
      <svg viewBox="0 0 64 64" className="h-16 w-16 -rotate-90">
        <circle cx="32" cy="32" r={radius} fill="none" strokeWidth="3" className="stroke-amber-100" />
        <circle
          cx="32"
          cy="32"
          r={radius}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - ratio)}
          className={`transition-[stroke-dashoffset] duration-1000 ease-linear ${
            isUrgent ? "stroke-rose-500" : "stroke-amber-500"
          }`}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center">
        <Clock className={`h-5 w-5 ${isUrgent ? "text-rose-500" : "text-amber-500"}`} />
      </span>
    </div>
  );
}

export default function PaymentPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { success, error } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("QRIS");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentSubmitted, setPaymentSubmitted] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [statusRefreshError, setStatusRefreshError] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let active = true;
    if (!orderId) return;

    fetchOrderById(orderId)
      .then((data) => {
        if (!active) return;
        setOrder(data);
        if (data?.expires_at) {
          setTimeLeft(Math.max(0, Math.floor((new Date(data.expires_at).getTime() - Date.now()) / 1000)));
        }
        if (data?.payment?.payment_method) {
          setSelectedMethod(data.payment.payment_method);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(getApiErrorMessage(requestError, "Detail pesanan gagal dimuat."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  useEffect(() => {
    if (!order?.expires_at || order.status !== "pending") return;
    const updateRemainingTime = () => {
      setTimeLeft(Math.max(0, Math.floor((new Date(order.expires_at!).getTime() - Date.now()) / 1000)));
    };
    updateRemainingTime();
    const timer = window.setInterval(updateRemainingTime, 1000);
    return () => window.clearInterval(timer);
  }, [order?.expires_at, order?.status]);

  useEffect(() => {
    if (!orderId || order?.status !== "pending") return;
    let active = true;
    let requestInFlight = false;

    const refreshOrder = async () => {
      if (requestInFlight) return;
      requestInFlight = true;
      try {
        const latestOrder = await fetchOrderById(orderId);
        if (active && latestOrder) {
          setOrder(latestOrder);
          setStatusRefreshError("");
        }
      } catch (requestError: unknown) {
        if (active) {
          setStatusRefreshError(
            getApiErrorMessage(requestError, "Status pembayaran belum dapat diperbarui.")
          );
        }
      } finally {
        requestInFlight = false;
      }
    };

    const timer = window.setInterval(() => void refreshOrder(), 5000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [order?.status, orderId]);

  const handleSubmitProof = async () => {
    if (!order || order.status !== "pending" || timeLeft <= 0) {
      error("Batas waktu pembayaran sudah berakhir atau pesanan tidak lagi dapat dibayar.");
      return;
    }
    if (!proofFile) {
      error("Harap unggah bukti transfer/resi pembayaran terlebih dahulu.");
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append("order_id", orderId);
      formData.append("payment_method", selectedMethod);
      formData.append("proof_image", proofFile);

      const payment = await submitPayment(formData);
      setOrder((current) => current ? { ...current, payment } : current);
      setPaymentSubmitted(true);
      success("Bukti pembayaran berhasil dikirim untuk verifikasi!");
    } catch (requestError: unknown) {
      error(getApiErrorMessage(requestError, "Gagal mengirim bukti pembayaran."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <Loading message="Memuat detail transaksi..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
          <ErrorState
            title={loadError ? "Pesanan gagal dimuat" : "Pesanan tidak ditemukan"}
            message={loadError || "Pesanan tidak ditemukan atau kamu tidak memiliki akses."}
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (paymentSubmitted || order.payment || order.status !== "pending" || timeLeft <= 0) {
    const isPaid = order.status === "paid";
    const isRejected = order.status === "rejected";
    const isExpired = order.status === "cancelled" || (order.status === "pending" && timeLeft <= 0);

    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
          <Reveal variant="scale">
            <section className={`relative overflow-hidden rounded-[32px] border bg-white p-8 text-center shadow-[0_40px_90px_-50px_rgba(16,185,129,.25)] sm:p-14 ${isPaid ? "border-emerald-200/70" : isRejected || isExpired ? "border-rose-200/70" : "border-amber-200/70"}`}>
              <div aria-hidden className="pointer-events-none absolute inset-0 fine-grid opacity-50" />
              <div className="relative">
                <span className={`mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-3xl border ${isPaid ? "border-emerald-200 bg-emerald-50 text-emerald-600" : isRejected || isExpired ? "border-rose-200 bg-rose-50 text-rose-600" : "border-amber-200 bg-amber-50 text-amber-600"}`}>
                  {isPaid ? <CheckCircle2 className="h-9 w-9" /> : <Clock className="h-9 w-9" />}
                </span>
                <Badge variant={isPaid ? "success" : isRejected || isExpired ? "destructive" : "warning"} className="mb-5">
                  {isPaid ? "Pembayaran lunas" : isRejected ? "Pembayaran ditolak" : isExpired ? "Pesanan kedaluwarsa" : "Menunggu verifikasi"}
                </Badge>
                <h1 className="font-display-xl text-[2rem] leading-tight text-ink sm:text-4xl">
                  {isPaid ? "Pembayaran terverifikasi" : isRejected ? "Bukti pembayaran ditolak" : isExpired ? "Waktu pembayaran berakhir" : "Pembayaran sedang diverifikasi"}
                </h1>
                <p className="prose-soft mx-auto mt-4 max-w-lg">
                  {isPaid
                    ? `Pesanan #${order.order_code} telah dibayar. Tiket digital tersedia di dompet tiketmu.`
                    : isRejected
                      ? order.payment?.rejection_reason || "Bukti pembayaran tidak dapat diverifikasi. Hubungi dukungan dengan menyertakan kode pesanan."
                      : isExpired
                        ? `Pesanan #${order.order_code} sudah tidak dapat dibayar. Silakan buat pesanan baru.`
                        : `Bukti pembayaran untuk pesanan #${order.order_code} sedang menunggu verifikasi admin. Status diperbarui otomatis.`}
                </p>
                {statusRefreshError ? (
                  <p role="status" className="mx-auto mt-4 max-w-lg text-xs text-amber-700">
                    {statusRefreshError} Halaman akan mencoba memperbarui lagi.
                  </p>
                ) : null}

                <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  {isPaid ? <Link href="/tickets">
                    <Button className="gap-2">
                      <Ticket className="h-4 w-4" />
                      Lihat tiket saya
                    </Button>
                  </Link> : null}
                  <Link href="/orders">
                    <Button variant="secondary" className="gap-2">
                      <FileText className="h-4 w-4" />
                      Riwayat pesanan
                    </Button>
                  </Link>
                </div>
              </div>
            </section>
          </Reveal>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <PageHeader
          eyebrow="Pembayaran pesanan"
          title={`Order #${order?.order_code || orderId}`}
          description="Selesaikan pembayaran sesuai instruksi di bawah, lalu unggah bukti transfer untuk diverifikasi."
        />

        <Reveal className="mt-8">
          <section className="flex flex-col gap-6 rounded-[28px] border border-amber-200/70 bg-white p-6 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.3)] sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div>
              <p className="meta-label">Total yang harus ditransfer</p>
              <p className="numeral mt-2 text-3xl text-ink">{formatCurrency(order?.total || 0)}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Pastikan nominal transfer tepat hingga digit terakhir.
              </p>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-amber-200/80 bg-amber-50/70 px-5 py-4">
              <CountdownRing seconds={timeLeft} />
              <div>
                <p className="meta-label">Sisa waktu bayar</p>
                <p className="numeral countdown-tick mt-1 text-xl text-ink">{formatTimer(timeLeft)}</p>
              </div>
            </div>
          </section>
        </Reveal>

        <Reveal delay={80} className="mt-6">
          <section className="rounded-[28px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-8">
            <h2 className="flex items-center gap-2.5">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="font-display text-xl text-ink">Pilih &amp; konfirmasi metode</span>
            </h2>
            <div className="mt-6">
              <PaymentMethodSelector selectedMethod={selectedMethod} onSelect={setSelectedMethod} />
            </div>
          </section>
        </Reveal>

        <Reveal delay={140} className="mt-6">
          <section className="rounded-[28px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-8">
            <h2 className="flex items-center gap-2.5">
              <FileText className="h-4 w-4 text-primary" />
              <span className="font-display text-xl text-ink">Unggah bukti transfer</span>
            </h2>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              Setelah melakukan transfer sesuai nomor rekening di atas, unggah foto struk atau
              screenshot bukti transfermu di bawah ini.
            </p>

            <div className="mt-6">
              <PaymentProofUpload onFileSelect={setProofFile} />
            </div>

            <div className="mt-7 flex justify-end border-t border-border pt-6">
              <Button
                onClick={handleSubmitProof}
                isLoading={isSubmitting}
                size="lg"
                className="w-full gap-2 sm:w-auto"
              >
                <PartyPopper className="h-4 w-4" />
                Kirim bukti pembayaran
              </Button>
            </div>
          </section>
        </Reveal>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
