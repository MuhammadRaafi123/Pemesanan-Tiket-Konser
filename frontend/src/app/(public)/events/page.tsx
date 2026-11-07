"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpDown,
  Check,
  MapPin,
  Music,
  RotateCcw,
  Search,
  Ticket,
  X,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency } from "@/lib/format";

type SortBy = "recommended" | "lowest" | "highest" | "date";

const GENRES = [
  { id: "all", label: "Semua Genre", color: "#ffb703" },
  { id: "pop", label: "Pop", color: "#38bdf8" },
  { id: "rock", label: "Rock & Indie", color: "#f97316" },
  { id: "kpop", label: "K-Pop", color: "#ec4899" },
  { id: "festival", label: "Festival", color: "#10b981" },
  { id: "edm", label: "EDM", color: "#8b5cf6" },
  { id: "jazz", label: "Jazz & Soul", color: "#f59e0b" },
];

const CITIES = [
  { value: "all", label: "Semua Kota" },
  { value: "Jakarta", label: "Jakarta" },
  { value: "Bandung", label: "Bandung" },
  { value: "Surabaya", label: "Surabaya" },
  { value: "Bali", label: "Bali" },
  { value: "Yogyakarta", label: "Yogyakarta" },
  { value: "Semarang", label: "Semarang" },
];

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
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
      // Search query filter
      if (normalizedQuery) {
        const match = [
          event.title,
          event.artists?.name,
          event.location,
          event.venue ?? "",
          event.genre ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!match.includes(normalizedQuery)) return false;
      }

      // City filter
      if (selectedCity !== "all") {
        const loc = (event.location ?? "").toLowerCase();
        if (!loc.includes(selectedCity.toLowerCase())) return false;
      }

      // Genre filter
      if (selectedGenre !== "all") {
        const genre = (event.genre ?? "").toLowerCase();
        if (selectedGenre === "rock" && !(genre.includes("rock") || genre.includes("indie"))) return false;
        if (selectedGenre === "pop" && !genre.includes("pop")) return false;
        if (selectedGenre === "kpop" && !(genre.includes("k-pop") || genre.includes("kpop") || genre.includes("korean"))) return false;
        if (selectedGenre === "festival" && !genre.includes("festival")) return false;
        if (selectedGenre === "edm" && !(genre.includes("edm") || genre.includes("electronic") || genre.includes("dance"))) return false;
        if (selectedGenre === "jazz" && !(genre.includes("jazz") || genre.includes("soul") || genre.includes("blues"))) return false;
      }

      return true;
    });

    // Sorting
    nextEvents.sort((a, b) => {
      if (sortBy === "lowest") {
        const aPrice = a.ticket_categories?.length ? Math.min(...a.ticket_categories.map((item) => item.price)) : (a.min_price ?? Number.POSITIVE_INFINITY);
        const bPrice = b.ticket_categories?.length ? Math.min(...b.ticket_categories.map((item) => item.price)) : (b.min_price ?? Number.POSITIVE_INFINITY);
        return aPrice - bPrice;
      }

      if (sortBy === "highest") {
        const aPrice = a.ticket_categories?.length ? Math.max(...a.ticket_categories.map((item) => item.price)) : (a.min_price ?? 0);
        const bPrice = b.ticket_categories?.length ? Math.max(...b.ticket_categories.map((item) => item.price)) : (b.min_price ?? 0);
        return bPrice - aPrice;
      }

      if (sortBy === "date") {
        const aDate = a.event_date ? new Date(a.event_date).getTime() : 0;
        const bDate = b.event_date ? new Date(b.event_date).getTime() : 0;
        return aDate - bDate;
      }

      return 0;
    });

    return nextEvents;
  }, [events, query, selectedGenre, selectedCity, sortBy]);

  const lowestPrice = useMemo(() => {
    const prices = events.flatMap((event) => {
      if (event.ticket_categories?.length) {
        return event.ticket_categories.map((category) => category.price);
      }
      return event.min_price ? [event.min_price] : [];
    });
    return prices.length ? Math.min(...prices) : null;
  }, [events]);

  const hasActiveFilters = Boolean(query || selectedGenre !== "all" || selectedCity !== "all" || sortBy !== "recommended");

  const resetFilters = () => {
    setQuery("");
    setSelectedGenre("all");
    setSelectedCity("all");
    setSortBy("recommended");
  };

  return (
    <div className="min-h-screen bg-[#0b0e15] text-[#e1e2ec] selection:bg-[#ffb703]/30 selection:text-white">
      <Navbar />

      <main className="relative mx-auto w-full max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        {/* Ambient lighting glows in background */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 left-1/2 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-[#ffb703]/[0.05] blur-[140px]" />
          <div className="absolute right-0 top-32 h-[350px] w-[400px] rounded-full bg-[#6801d1]/[0.07] blur-[120px]" />
          <div className="absolute left-0 top-96 h-[300px] w-[350px] rounded-full bg-[#06b6d4]/[0.04] blur-[100px]" />
        </div>

        {/* ==================== HERO & SEARCH SECTION ==================== */}
        <section className="relative overflow-hidden rounded-[28px] border border-[#232733] bg-[#141720]/95 p-6 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-8 md:p-10">
          {/* Subtle top gold accent line */}
          <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb703]/60 to-transparent" />

          {/* Header Title & Nav */}
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>

              <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
                Jelajahi Konser Pilihanmu
              </h1>
              <p className="mt-2.5 max-w-xl text-sm leading-6 text-[#9497a6]">
                Temukan jadwal konser, festival musik, dan musisi idola favoritmu di seluruh kota di Indonesia.
              </p>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-[#262936] bg-[#1b1e27] px-4 py-2.5 text-xs font-semibold text-[#c4c7d4] transition-all hover:border-[#ffb703]/40 hover:bg-[#202430] hover:text-[#ffb703] lg:self-auto"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Kembali ke Beranda
            </Link>
          </div>

          {/* ==================== MAIN SEARCH BAR CONTAINER ==================== */}
          <div className="mt-8 rounded-2xl border border-[#2a2e3d] bg-[#10131b]/90 p-3 shadow-inner sm:p-4">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
              {/* 1. Keyword Search */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#262a37] bg-[#1a1d26] px-4 py-3 transition-all duration-300 focus-within:border-[#ffb703] focus-within:bg-[#1d212d] focus-within:ring-2 focus-within:ring-[#ffb703]/20 hover:border-[#383d4f] lg:col-span-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#ffb703]/30 bg-[#ffb703]/10 text-[#ffb703] shadow-[0_0_12px_rgba(255,183,3,0.15)] transition-transform group-focus-within:scale-105">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
                    Cari Konser / Artis / Venue
                  </label>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Ketik Coldplay, Sheila On 7, GBK..."
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#555866]"
                  />
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded-full p-1 text-[#6b6e7d] transition-colors hover:bg-[#282c3a] hover:text-white"
                    title="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 2. City Dropdown */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#262a37] bg-[#1a1d26] px-4 py-3 transition-all duration-300 focus-within:border-[#06b6d4] focus-within:bg-[#1d212d] focus-within:ring-2 focus-within:ring-[#06b6d4]/20 hover:border-[#383d4f] lg:col-span-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#06b6d4]/30 bg-[#06b6d4]/10 text-[#06b6d4] shadow-[0_0_12px_rgba(6,182,212,0.15)] transition-transform group-focus-within:scale-105">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#22d3ee]">
                    Kota
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(event) => setSelectedCity(event.target.value)}
                    className="w-full cursor-pointer bg-transparent text-sm font-semibold text-white outline-none"
                  >
                    {CITIES.map((city) => (
                      <option key={city.value} value={city.value} className="bg-[#141720] text-[#e1e2ec]">
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Sort Dropdown */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#262a37] bg-[#1a1d26] px-4 py-3 transition-all duration-300 focus-within:border-[#a855f7] focus-within:bg-[#1d212d] focus-within:ring-2 focus-within:ring-[#a855f7]/20 hover:border-[#383d4f] lg:col-span-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#a855f7]/30 bg-[#a855f7]/10 text-[#c084fc] shadow-[0_0_12px_rgba(168,85,247,0.15)] transition-transform group-focus-within:scale-105">
                  <ArrowUpDown className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#c084fc]">
                    Urutkan
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortBy)}
                    className="w-full cursor-pointer bg-transparent text-sm font-semibold text-white outline-none"
                  >
                    <option value="recommended" className="bg-[#141720] text-[#e1e2ec]">Rekomendasi Populer</option>
                    <option value="lowest" className="bg-[#141720] text-[#e1e2ec]">Harga: Terendah ke Tertinggi</option>
                    <option value="highest" className="bg-[#141720] text-[#e1e2ec]">Harga: Tertinggi ke Terendah</option>
                    <option value="date" className="bg-[#141720] text-[#e1e2ec]">Jadwal Terdekat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ==================== GENRE PILLS ==================== */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#1e222e] pt-3.5">
              <div className="flex items-center gap-1.5 pr-2 text-xs font-semibold text-[#8a8d9b]">
                <Music className="h-3.5 w-3.5 text-[#ffb703]" />
                <span className="hidden sm:inline">Pilih Genre:</span>
              </div>

              {GENRES.map((genre) => {
                const isSelected = selectedGenre === genre.id;
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`group relative flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "shadow-lg"
                        : "bg-[#161922] text-[#9a9db0] hover:border-[#383d4f] hover:text-white"
                    }`}
                    style={{
                      borderColor: isSelected ? genre.color : `${genre.color}25`,
                      backgroundColor: isSelected ? `${genre.color}20` : undefined,
                      color: isSelected ? "#ffffff" : undefined,
                      boxShadow: isSelected ? `0 0 16px ${genre.color}35` : undefined,
                    }}
                  >
                    <span
                      className="h-2 w-2 rounded-full transition-transform group-hover:scale-125"
                      style={{ backgroundColor: genre.color }}
                    />
                    {genre.label}
                    {isSelected && (
                      <Check className="h-3.5 w-3.5" style={{ color: genre.color }} />
                    )}
                  </button>
                );
              })}

              {/* Reset button if active */}
              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20 hover:text-red-300"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ==================== RESULTS STATS BAR ==================== */}
        <section className="mt-8">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#1e2128] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#232733] bg-[#141720] text-xs font-bold text-[#ffb703]">
                {filteredEvents.length}
              </span>
              <p className="text-sm font-medium text-[#8a8d9b]">
                Menampilkan <strong className="text-white">{filteredEvents.length}</strong> konser tersedia
                {selectedCity !== "all" && <span> di <strong className="text-[#06b6d4]">{selectedCity}</strong></span>}
                {selectedGenre !== "all" && <span> genre <strong className="text-[#ffb703]">{GENRES.find((g) => g.id === selectedGenre)?.label}</strong></span>}
                {query && <span> dengan kata kunci &ldquo;<strong className="text-white">{query}</strong>&rdquo;</span>}
              </p>
            </div>

            {lowestPrice !== null && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-400">
                <Ticket className="h-3.5 w-3.5 text-emerald-400" />
                <span>Harga tiket mulai <strong className="font-bold text-white">{formatCurrency(lowestPrice)}</strong></span>
              </div>
            )}
          </div>

          {/* ==================== EVENTS GRID ==================== */}
          {loading ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#232733] bg-[#141720]/50 p-12 text-center">
              <div className="h-9 w-9 animate-spin rounded-full border-2 border-[#ffb703] border-t-transparent" />
              <p className="mt-4 text-sm font-medium text-[#8a8d9b]">Memuat katalog konser pilihan...</p>
            </div>
          ) : (
            <EventGrid
              events={filteredEvents}
              variant="dark"
              emptyTitle="Tidak ada konser yang cocok"
              emptyDescription="Coba ubah kata kunci pencarian, pilih kota lain, atau reset filter untuk melihat semua konser."
            />
          )}
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
