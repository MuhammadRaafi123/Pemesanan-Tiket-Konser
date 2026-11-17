"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
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
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const pathname = usePathname();
  const router = useRouter();
  const eventsPath = pathname.startsWith("/home/") ? "/home/events" : "/events";
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [inventoryRefreshError, setInventoryRefreshError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (hydrated && user && !pathname.startsWith("/home/")) {
      router.replace(`/home/events/${id}`);
    }
  }, [hydrated, id, pathname, router, user]);

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
      <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653] page-enter">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-24">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e8e5ef] bg-white p-10 text-center">
            <div className="relative mb-4 flex h-12 w-12 items-center justify-center">
              <span className="absolute inset-0 rounded-full border border-[#c8b7db]/50" />
              <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#6264b5]" />
              <Ticket className="h-6 w-6 text-[#6264b5] animate-pulse" />
            </div>
            <p className="text-sm font-semibold text-[#071653]">Memuat Detail Konser...</p>
            <p className="mt-1 text-xs text-[#5c6482]">Mengambil informasi jadwal dan kuota tiket terbaru</p>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653] page-enter">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-24">
          <div className="flex flex-col items-center justify-center rounded-2xl border border-[#e8e5ef] bg-white p-8 text-center sm:p-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-700">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-[#071653]">
              {loadError ? "Konser Gagal Dimuat" : "Konser Tidak Ditemukan"}
            </h3>
            <p className="mt-1 max-w-md text-xs leading-relaxed text-[#5c6482]">
              {loadError || "Event yang kamu cari tidak tersedia atau telah berakhir."}
            </p>
            <div className="mt-5 flex gap-3">
              <Link
                href={eventsPath}
                className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8e5ef] bg-white px-4 py-2 text-xs font-semibold text-[#071653] transition hover:border-[#c8b7db] hover:bg-[#f7f4fa]"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Kembali ke Katalog Konser
              </Link>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#6264b5] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#51539f] press"
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
    <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653] page-enter selection:bg-[#6264b5]/25 selection:text-[#071653]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        {inventoryRefreshError ? (
          <p role="status" className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs font-medium text-amber-900">
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
