"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, Info, RefreshCw, Ticket } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventHero } from "@/features/events/components/EventHero";
import { EventTicketList } from "@/features/events/components/EventTicketList";
import { EventInfo } from "@/features/events/components/EventInfo";
import { EventSetlist } from "@/features/events/components/EventSetlist";
import { fetchEventById } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { Reveal } from "@/components/shared/Reveal";
import { getApiErrorMessage } from "@/lib/apiError";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [inventoryRefreshError, setInventoryRefreshError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    if (!id) return;
    setLoading(true);
    setLoadError("");

    fetchEventById(id)
      .then((data) => {
        if (active) {
          setEvent(data);
          setLoadError("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(getApiErrorMessage(requestError, "Gagal memuat detail konser."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id, reloadKey]);

  useEffect(() => {
    if (!id || !event) return;
    let active = true;
    let requestInFlight = false;

    const refreshInventory = async () => {
      if (requestInFlight) return;
      requestInFlight = true;
      try {
        const latestEvent = await fetchEventById(id);
        if (active && latestEvent) {
          setEvent(latestEvent);
          setInventoryRefreshError("");
        }
      } catch (requestError: unknown) {
        if (active) {
          setInventoryRefreshError(
            getApiErrorMessage(requestError, "Ketersediaan tiket belum dapat diperbarui."),
          );
        }
      } finally {
        requestInFlight = false;
      }
    };

    const timer = window.setInterval(() => void refreshInventory(), 12000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [event, id]);

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
            <p className="text-sm font-semibold text-[#e1e2ec]">Memuat Detail Konser...</p>
            <p className="mt-1 text-xs text-[#8a8d98]">Mengambil informasi jadwal dan kuota tiket terbaru</p>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] page-enter">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/[0.05] p-8 text-center sm:p-12">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-rose-200">
              {loadError ? "Konser Gagal Dimuat" : "Konser Tidak Ditemukan"}
            </h3>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-[#8a8d98]">
              {loadError || "Event yang kamu cari tidak tersedia atau telah berakhir."}
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2d36] bg-[#1a1d27] px-4 py-2 text-xs font-semibold text-[#e1e2ec] transition hover:bg-[#232733]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke Katalog Konser
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

      <main className="relative mx-auto w-full max-w-7xl flex-1 space-y-10 px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        {/* Ambient lighting glows */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-16 left-1/2 h-[500px] w-[850px] -translate-x-1/2 rounded-full bg-[#ffb703]/[0.05] blur-[140px] animate-[drift-a_18s_ease-in-out_infinite_alternate]" />
          <div className="absolute right-0 top-40 h-[400px] w-[400px] rounded-full bg-[#6801d1]/[0.07] blur-[120px] animate-[drift-b_22s_ease-in-out_infinite_alternate]" />
        </div>

        {inventoryRefreshError ? (
          <p role="status" className="rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-3 text-xs font-medium text-amber-200">
            {inventoryRefreshError} Pembelian akan tetap memeriksa stok terbaru di server.
          </p>
        ) : null}

        {/* 1. Hero Event Header with Poster & Specs */}
        <EventHero event={event} />

        {/* 2. Ticket Category Selector */}
        <Reveal delay={60}>
          <EventTicketList event={event} />
        </Reveal>

        {/* 3. Event Details, Venue Stage Map, Guidelines */}
        <Reveal delay={80}>
          <EventInfo event={event} />
        </Reveal>

        {/* 4. Setlist if available */}
        <EventSetlist event={event} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
