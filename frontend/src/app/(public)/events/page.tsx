
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency } from "@/lib/format";

type SortBy = "recommended" | "lowest" | "highest";

const GENRES = [
  { id: "all", label: "Semua genre" },
  { id: "rock", label: "Rock & pop" },
  { id: "edm", label: "EDM & festival" },
  { id: "jazz", label: "Jazz & soul" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("recommended");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetchEvents({ limit: 100 })
      .then((nextEvents) => {
        if (active) setEvents(nextEvents);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const nextEvents = [...events].filter((event) => {
      if (normalizedQuery) {
        const match = [event.title, event.artists?.name, event.location, event.venue ?? ""].join(" ").toLowerCase();
        if (!match.includes(normalizedQuery)) return false;
      }

      if (selectedGenre !== "all") {
        const genre = (event.genre ?? "").toLowerCase();
        if (selectedGenre === "rock" && !(genre.includes("rock") || genre.includes("pop"))) return false;
        if (selectedGenre === "edm" && !(genre.includes("edm") || genre.includes("electronic"))) return false;
        if (selectedGenre === "jazz" && !(genre.includes("jazz") || genre.includes("soul"))) return false;
      }

      return true;
    });

    nextEvents.sort((a, b) => {
      if (sortBy === "lowest") {
        const aPrice = a.ticket_categories?.length ? Math.min(...a.ticket_categories.map((item) => item.price)) : Number.POSITIVE_INFINITY;
        const bPrice = b.ticket_categories?.length ? Math.min(...b.ticket_categories.map((item) => item.price)) : Number.POSITIVE_INFINITY;
        return aPrice - bPrice;
      }

      if (sortBy === "highest") {
        const aPrice = a.ticket_categories?.length ? Math.max(...a.ticket_categories.map((item) => item.price)) : 0;
        const bPrice = b.ticket_categories?.length ? Math.max(...b.ticket_categories.map((item) => item.price)) : 0;
        return bPrice - aPrice;
      }

      return 0;
    });

    return nextEvents;
  }, [events, query, selectedGenre, sortBy]);

  const lowestPrice = useMemo(() => {
    const prices = events.flatMap((event) => event.ticket_categories?.map((category) => category.price) ?? []);
    return prices.length ? Math.min(...prices) : null;
  }, [events]);

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#102a43]">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <section className="rounded-[32px] border border-blue-200/70 bg-white/80 p-6 shadow-[0_25px_80px_-36px_rgba(37,99,235,0.35)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Concertix</p>
              <h1 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[#123b6d] sm:text-5xl">Jelajahi konser pilihanmu</h1>
            </div>
            <Link href="/" className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2 text-xs font-semibold text-[#1d4ed8]">Kembali ke beranda</Link>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_0.7fr]">
            <div className="relative">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2563eb]" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Cari konser, artis, kota, atau venue..." className="h-12 w-full rounded-2xl border border-blue-100 bg-[#f6f9ff] pl-11 pr-4 text-sm text-[#123b6d] outline-none transition focus:border-[#2563eb]" />
            </div>

            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#2563eb]" />
              <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortBy)} className="h-12 w-full appearance-none rounded-2xl border border-blue-100 bg-[#f6f9ff] pl-11 pr-4 text-sm text-[#123b6d] outline-none transition focus:border-[#2563eb]">
                <option value="recommended">Rekomendasi</option>
                <option value="lowest">Harga termurah</option>
                <option value="highest">Harga termahal</option>
              </select>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {GENRES.map((genre) => (
              <button key={genre.id} type="button" onClick={() => setSelectedGenre(genre.id)} className={`rounded-full border px-3 py-2 text-xs font-medium transition ${selectedGenre === genre.id ? "border-[#2563eb] bg-[#2563eb] text-white" : "border-blue-100 bg-blue-50 text-[#3b5f96] hover:border-[#93c5fd]"}`}>
                {genre.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8">
          {loading ? (
            <div className="rounded-2xl border border-blue-100 bg-white p-8 text-center text-sm text-[#526d93]">Memuat daftar konser...</div>
          ) : (
            <>
              <div className="mb-5 flex items-center justify-between gap-4 text-xs text-[#4b698f]">
                <span>Menampilkan <strong className="text-[#123b6d]">{filteredEvents.length}</strong> konser</span>
                {lowestPrice !== null ? <span>Harga mulai dari <strong className="text-[#2563eb]">{formatCurrency(lowestPrice)}</strong></span> : null}
              </div>
              <EventGrid events={filteredEvents} />
            </>
          )}
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
