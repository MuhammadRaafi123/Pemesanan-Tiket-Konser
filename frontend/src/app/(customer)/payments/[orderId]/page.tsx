"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Clock, CheckCircle2, CreditCard, FileText, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { PaymentProofUpload } from "@/features/payments/components/PaymentProofUpload";
import { PaymentMethodSelector } from "@/features/payments/components/PaymentMethodSelector";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/ToastProvider";
import { fetchOrderById } from "@/features/orders/api";
import { submitPayment } from "@/features/payments/api";
import { Order } from "@/features/orders/types";
import { Loading } from "@/components/shared/Loading";

export default function PaymentPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const { success, error } = useToast();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("QRIS");
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  useEffect(() => {
    if (orderId) {
      fetchOrderById(orderId).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [orderId]);

  useEffect(() => {
    if (!order?.expires_at) return;
    const parseExpiry = () => new Date(`${order.expires_at!.replace(" ", "T")}+07:00`).getTime();
    const deadline = parseExpiry();
    if (!Number.isFinite(deadline)) return;
    const update = () => setTimeLeft(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
    update();
    const timer = setInterval(() => {
      update();
    }, 1000);
    return () => clearInterval(timer);
  }, [order?.expires_at]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleSubmitProof = async () => {
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

      await submitPayment(formData);
      setIsSuccess(true);
      success("Bukti pembayaran berhasil dikirim untuk verifikasi!");
    } catch {
      error("Gagal mengirim bukti pembayaran.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="light-app min-h-screen bg-[#f4f8ff] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loading message="Memuat detail transaksi..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!order) {
    return <div className="light-app min-h-screen bg-[#f4f8ff] text-[#123b6d] flex flex-col"><Navbar /><main className="flex flex-1 items-center justify-center px-4 pt-24"><div className="max-w-md text-center"><h1 className="text-2xl font-bold">Pesanan tidak ditemukan</h1><p className="mt-3 text-sm text-[#6683a3]">Periksa kembali riwayat pesanan atau buat pesanan baru dari halaman konser.</p><Link href="/orders" className="mt-5 inline-flex rounded-xl bg-[#2563eb] px-4 py-2 text-sm font-semibold text-white">Buka riwayat pesanan</Link></div></main><Footer /><MobileNav /></div>;
  }

  const orderExpired = timeLeft === 0;
  const paymentSubmitted = order.payment?.status === "pending";
  const cannotPay = order.status !== "pending" || orderExpired || paymentSubmitted;

  return (
    <div className="light-app min-h-screen bg-[#f4f8ff] text-[#123b6d] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Success Modal View */}
        {isSuccess ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 sm:p-12 text-center backdrop-blur-2xl space-y-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-emerald-100 text-emerald-600 border border-emerald-200 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
              <CheckCircle2 className="h-10 w-10" />
            </div>

            <div className="space-y-2">
              <Badge variant="success" className="text-xs py-1 px-3">
                Bukti Terkirim
              </Badge>
              <h2 className="text-3xl font-black text-[#123b6d]">
                Pembayaran Sedang Diverifikasi
              </h2>
              <p className="text-sm text-[#6683a3] max-w-md mx-auto leading-relaxed">
                Tim admin kami sedang memverifikasi bukti transfer untuk Pesanan #{order?.order_code || orderId}. E-Ticket digital QR Code akan segera aktif dalam 5-15 menit.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Link href="/tickets">
                <Button variant="glow" size="default" className="gap-2">
                  <Ticket className="h-4 w-4 text-white" />
                  Lihat Tiket Saya
                </Button>
              </Link>
              <Link href="/orders">
                <Button variant="secondary" size="default" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Riwayat Pesanan
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            {/* Header & Urgent Timer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#2563eb]">
                  Pembayaran Pesanan
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-[#123b6d]">
                  Order #{order?.order_code || orderId}
                </h1>
              </div>

              {/* Countdown Timer Badge */}
              <div className="flex items-center gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 backdrop-blur-md">
                <Clock className="h-5 w-5 text-amber-400" />
                <div>
                  <p className="text-[10px] text-[#8aa4c1] uppercase font-bold">Sisa Waktu Bayar</p>
                  <p className="font-mono text-lg font-black text-amber-700">{timeLeft === null ? "—" : formatTimer(timeLeft)}</p>
                </div>
              </div>
            </div>

            {/* Total Amount Card */}
            <CardSpotlight className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-blue-200 bg-white">
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-[#8aa4c1]">Total yang harus ditransfer</span>
                <p className="text-3xl font-black text-[#2563eb]">
                  Rp {order.total.toLocaleString("id-ID")}
                </p>
                <p className="text-xs text-[#8aa4c1]">*Pastikan nominal transfer tepat hingga digit terakhir</p>
              </div>

                <Badge variant={orderExpired ? "destructive" : order.status === "paid" ? "success" : "warning"} className="gap-1.5 self-start sm:self-auto py-1 px-3">
                <Clock className="h-3.5 w-3.5" />
                  Status: {orderExpired ? "Waktu habis" : order.status === "paid" ? "Lunas" : paymentSubmitted ? "Menunggu verifikasi" : order.status === "pending" ? "Menunggu pembayaran" : order.status}
              </Badge>
            </CardSpotlight>

            {/* Payment Method Selector & VA Details */}
            <CardSpotlight className="space-y-5">
              <h3 className="text-lg font-bold text-[#123b6d] flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-sky-600" />
                Pilih & Konfirmasi Metode Pembayaran
              </h3>

              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onSelect={setSelectedMethod}
              />
            </CardSpotlight>

            {/* Proof of Transfer Upload */}
            <CardSpotlight className="space-y-5">
              <h3 className="text-lg font-bold text-[#123b6d] flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#2563eb]" />
                Unggah Bukti Transfer
              </h3>
              <p className="text-xs text-[#8aa4c1]">
                Setelah melakukan transfer sesuai metode yang dipilih, unggah bukti pembayaran. Order akan menunggu pemeriksaan admin; tiket dan QR aktif setelah pembayaran disetujui.
              </p>

              <PaymentProofUpload onFileSelect={setProofFile} />

              <div className="pt-4 border-t border-blue-100 flex justify-end">
                <Button
                  onClick={handleSubmitProof}
                  isLoading={isSubmitting}
                  disabled={cannotPay}
                  variant="glow"
                  size="lg"
                  className="w-full sm:w-auto gap-2"
                >
                  <CheckCircle2 className="h-4 w-4 text-white" />
                  Kirim Bukti Pembayaran
                </Button>
              </div>
              {cannotPay && <p className="text-right text-xs text-rose-600">{orderExpired ? "Batas waktu pembayaran telah berakhir. Buat pesanan baru untuk mencoba kembali." : paymentSubmitted ? "Bukti pembayaran sudah dikirim dan sedang menunggu pemeriksaan admin." : `Pesanan berstatus ${order.status} dan tidak dapat menerima pembayaran lagi.`}</p>}
            </CardSpotlight>
          </>
        )}

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
