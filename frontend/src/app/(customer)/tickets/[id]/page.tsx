"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Info, RefreshCw, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QRTicket } from "@/features/tickets-user/components/QRTicket";
import { Reveal } from "@/components/shared/Reveal";
import { fetchTicketById } from "@/features/tickets-user/api";
import type { UserTicket } from "@/features/tickets-user/types";
import { getApiErrorMessage } from "@/lib/apiError";

export default function SingleTicketPage() {
  const params = useParams();
  const id = params.id as string;

  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!id) return;
    setLoading(true);
    setLoadError("");

    fetchTicketById(id)
      .then((data) => {
        if (active) setTicket(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(getApiErrorMessage(requestError, "Gagal memuat tiket. Silakan coba lagi."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] page-enter">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-[#232733] bg-[#14161f]/70 p-12 text-center">
            <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-[#ffb703]/20" />
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#ffb703]" />
              <Ticket className="h-6 w-6 text-[#ffb703] animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-[#e1e2ec]">Memuat E-Ticket Digital...</p>
            <p className="mt-1 text-xs text-[#8a8d98]">Memverifikasi status QR tiket</p>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !ticket) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] page-enter">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/[0.05] p-8 text-center sm:p-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-rose-200">
              {loadError ? "Tiket Gagal Dimuat" : "Tiket Tidak Ditemukan"}
            </h3>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-[#8a8d98]">
              {loadError || "Data e-ticket tidak valid atau pesanan ini belum berstatus lunas."}
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="/tickets"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2d36] bg-[#1a1d27] px-4 py-2 text-xs font-semibold text-[#e1e2ec] transition hover:bg-[#232733]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke Tiket Saya
              </Link>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#ffb703] px-4 py-2 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9] press"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Coba Lagi
              </button>
            </div>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] page-enter selection:bg-[#ffb703]/30 selection:text-white">
      <Navbar />

      <main className="relative flex-1 overflow-hidden">
        {/* Ambient Lights */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#ffb703]/[0.05] blur-[120px]" />
          <div className="absolute right-0 top-32 h-[350px] w-[350px] rounded-full bg-[#6801d1]/[0.07] blur-[100px]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-5xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
          <Reveal className="mb-6">
            <Link
              href="/tickets"
              className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#14161f] px-4 py-2.5 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703] press"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Dompet Tiket</span>
            </Link>
          </Reveal>

          <QRTicket ticket={ticket} />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
