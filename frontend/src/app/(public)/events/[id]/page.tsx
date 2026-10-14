"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventHero } from "@/features/events/components/EventHero";
import { EventTicketList } from "@/features/events/components/EventTicketList";
import { EventInfo } from "@/features/events/components/EventInfo";
import { EventSetlist } from "@/features/events/components/EventSetlist";
import { fetchEventById } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Reveal } from "@/components/shared/Reveal";
import { getApiErrorMessage } from "@/lib/apiError";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [inventoryRefreshError, setInventoryRefreshError] = useState("");

  useEffect(() => {
    let active = true;
    if (!id) return;

    fetchEventById(id)
      .then((data) => {
        if (active) setEvent(data);
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
  }, [id]);

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
            getApiErrorMessage(requestError, "Ketersediaan tiket belum dapat diperbarui.")
          );
        }
      } finally {
        requestInFlight = false;
      }
    };

    const timer = window.setInterval(() => void refreshInventory(), 10000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [event, id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <Loading message="Memuat detail konser..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !event) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <ErrorState
            title={loadError ? "Konser gagal dimuat" : "Konser tidak ditemukan"}
            message={loadError || "Event yang kamu cari tidak tersedia atau telah berakhir."}
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 space-y-8 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        {inventoryRefreshError ? (
          <p role="status" className="rounded-xl border border-amber-300/40 bg-amber-50 px-4 py-3 text-xs text-amber-800">
            {inventoryRefreshError} Pembelian akan tetap memeriksa stok terbaru di server.
          </p>
        ) : null}
        <EventHero event={event} />
        <Reveal delay={60}>
          <EventTicketList event={event} />
        </Reveal>
        <Reveal delay={60}>
          <EventInfo event={event} />
        </Reveal>
        <EventSetlist event={event} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
