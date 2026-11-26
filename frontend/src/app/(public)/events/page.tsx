"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
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
import { Loading } from "@/components/shared/Loading";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";

type SortBy = "recommended" | "lowest" | "highest" | "date";

const GENRES = [
  { id: "all", label: "Semua Genre", color: "#6264b5" },
  { id: "pop", label: "Pop", color: "#3156ad" },
  { id: "rock", label: "Rock & Indie", color: "#9a564b" },
  { id: "kpop", label: "K-Pop", color: "#8a75b5" },
  { id: "hiphop", label: "Hip-Hop & Rap", color: "#a34f3c" },
  { id: "rnb", label: "R&B & Soul", color: "#9c4e79" },
  { id: "edm", label: "EDM & Electronic", color: "#6264b5" },
  { id: "jazz", label: "Jazz & Blues", color: "#8b6a2c" },
  { id: "metal", label: "Metal & Punk", color: "#59616e" },
  { id: "folk", label: "Folk & Country", color: "#8b7045" },
  { id: "reggae", label: "Reggae", color: "#397557" },
  { id: "classical", label: "Klasik", color: "#546e9f" },
  { id: "dangdut", label: "Dangdut", color: "#b45e35" },
  { id: "festival", label: "Festival", color: "#397557" },
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
  const pathname = usePathname();
  const router = useRouter();
  const isCustomerCatalog = pathname.startsWith("/home/");
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("recommended");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hydrated && user && !isCustomerCatalog) {
      router.replace("/home/events");
    }
  }, [hydrated, isCustomerCatalog, router, user]);

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
        const genre = `${event.genre ?? ""} ${event.artists?.genre ?? ""} ${event.artists_list?.map((artist) => artist.genre ?? "").join(" ") ?? ""}`.toLowerCase();
        if (selectedGenre === "rock" && !(genre.includes("rock") || genre.includes("indie"))) return false;
        if (selectedGenre === "pop" && !genre.includes("pop")) return false;
        if (selectedGenre === "kpop" && !(genre.includes("k-pop") || genre.includes("kpop") || genre.includes("korean"))) return false;
        if (selectedGenre === "festival" && !genre.includes("festival")) return false;
        if (selectedGenre === "edm" && !(genre.includes("edm") || genre.includes("electronic") || genre.includes("dance"))) return false;
        if (selectedGenre === "hiphop" && !(genre.includes("hip-hop") || genre.includes("hip hop") || genre.includes("hiphop") || genre.includes("rap"))) return false;
        if (selectedGenre === "rnb" && !(genre.includes("r&b") || genre.includes("rnb") || genre.includes("rhythm and blues") || genre.includes("soul"))) return false;
        if (selectedGenre === "jazz" && !(genre.includes("jazz") || genre.includes("blues"))) return false;
        if (selectedGenre === "metal" && !(genre.includes("metal") || genre.includes("punk") || genre.includes("hardcore"))) return false;
        if (selectedGenre === "folk" && !(genre.includes("folk") || genre.includes("country") || genre.includes("bluegrass"))) return false;
        if (selectedGenre === "reggae" && !(genre.includes("reggae") || genre.includes("ska") || genre.includes("dancehall"))) return false;
        if (selectedGenre === "classical" && !(genre.includes("classical") || genre.includes("klasik") || genre.includes("orchestra") || genre.includes("orchestral"))) return false;
        if (selectedGenre === "dangdut" && !genre.includes("dangdut")) return false;
      }

      return true;
    });

    // Sorting
    nextEvents.sort((a, b) => {
      const now = Date.now();
      const aUpcoming = a.status === "open" && Boolean(a.event_date) && new Date(a.event_date).getTime() >= now;
      const bUpcoming = b.status === "open" && Boolean(b.event_date) && new Date(b.event_date).getTime() >= now;
      if (aUpcoming !== bUpcoming) return aUpcoming ? -1 : 1;

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
    <div className="landing-page min-h-screen bg-[#fffdf2] text-[#071653] selection:bg-[#6264b5]/25 selection:text-[#071653]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <section className="rounded-2xl border border-[#e8e5ef] bg-white px-6 py-7 sm:px-9 sm:py-9">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6264b5]"><Music className="h-3.5 w-3.5" />Jadwal live · Indonesia</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#071653] sm:text-5xl">
              Temukan konser <span className="text-[#6264b5]">yang ingin kamu kenang.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#68708a] sm:text-base">
              Dari konser intim hingga festival besar, jelajahi jadwal pertunjukan dari berbagai kota di Indonesia. Temukan artis yang kamu suka, bandingkan lokasi dan tanggal, lalu pilih acara yang paling cocok untuk pengalaman musik berikutnya.
            </p>
          </div>
        </section>

        <section aria-label="Filter konser" className="mt-5 rounded-[1.75rem] border border-[#e6e0ef] bg-gradient-to-br from-white via-white to-[#f7f3fb] p-4 shadow-[0_24px_70px_-48px_rgba(51,37,86,.28)] sm:p-7">
          {/* ==================== MAIN SEARCH BAR CONTAINER ==================== */}
          <div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-12">
              {/* 1. Keyword Search */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition-all duration-200 focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10 hover:border-[#c8b7db] lg:col-span-6">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5] transition-transform group-focus-within:scale-105">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                    Cari Konser / Artis / Venue
                  </label>
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Cari nama konser, artis, kota, atau venue..."
                    className="w-full bg-transparent text-sm font-medium text-[#071653] outline-none placeholder:text-[#8790a8]"
                  />
                </div>
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="rounded-full p-1 text-[#8790a8] transition-colors hover:bg-[#eeebf4] hover:text-[#071653]"
                    title="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* 2. City Dropdown */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition-all duration-200 focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10 hover:border-[#c8b7db] lg:col-span-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5] transition-transform group-focus-within:scale-105">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                    Kota
                  </label>
                  <select
                    value={selectedCity}
                    onChange={(event) => setSelectedCity(event.target.value)}
                    className="w-full cursor-pointer bg-transparent text-sm font-semibold text-[#071653] outline-none"
                  >
                    {CITIES.map((city) => (
                      <option key={city.value} value={city.value} className="bg-white text-[#071653]">
                        {city.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Sort Dropdown */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition-all duration-200 focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10 hover:border-[#c8b7db] lg:col-span-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5] transition-transform group-focus-within:scale-105">
                  <ArrowUpDown className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                    Urutkan
                  </label>
                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value as SortBy)}
                    className="w-full cursor-pointer bg-transparent text-sm font-semibold text-[#071653] outline-none"
                  >
                    <option value="recommended" className="bg-white text-[#071653]">Rekomendasi Populer</option>
                    <option value="lowest" className="bg-white text-[#071653]">Harga: Terendah ke Tertinggi</option>
                    <option value="highest" className="bg-white text-[#071653]">Harga: Tertinggi ke Terendah</option>
                    <option value="date" className="bg-white text-[#071653]">Jadwal Terdekat</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ==================== GENRE PILLS ==================== */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 pr-2 text-xs font-semibold text-[#5c6482]">
                <Music className="h-3.5 w-3.5 text-[#6264b5]" />
                <span className="hidden sm:inline">Pilih Genre:</span>
              </div>

              {GENRES.map((genre) => {
                const isSelected = selectedGenre === genre.id;
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => setSelectedGenre(genre.id)}
                    className={`group relative flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-200 active:scale-95 ${
                      isSelected
                        ? "bg-[#eeebf4]"
                        : "bg-white text-[#5c6482] hover:border-[#c8b7db] hover:text-[#071653]"
                    }`}
                    style={{
                      borderColor: isSelected ? genre.color : `${genre.color}25`,
                      backgroundColor: isSelected ? `${genre.color}20` : undefined,
                      color: isSelected ? genre.color : undefined,
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
                  className="ml-auto inline-flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 transition-colors hover:bg-rose-100"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset Filter
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ==================== RESULTS STATS BAR ==================== */}
        <section className="mt-9">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e5ef] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#eeebf4] px-2 text-xs font-bold text-[#6264b5]">
                {filteredEvents.length}
              </span>
              <p className="text-sm font-medium text-[#5c6482]">
                Menampilkan <strong className="text-[#071653]">{filteredEvents.length}</strong> konser yang sesuai dengan pencarian dan pilihan filter kamu.
                {selectedCity !== "all" && <span> di <strong className="text-[#6264b5]">{selectedCity}</strong></span>}
                {selectedGenre !== "all" && <span> genre <strong className="text-[#6264b5]">{GENRES.find((g) => g.id === selectedGenre)?.label}</strong></span>}
                {query && <span> dengan kata kunci &ldquo;<strong className="text-[#071653]">{query}</strong>&rdquo;</span>}
              </p>
            </div>

            {lowestPrice !== null && (
              <div className="inline-flex items-center gap-2 rounded-xl border border-[#c7e0d1] bg-[#e6f1eb] px-3.5 py-1.5 text-xs font-medium text-[#397557]">
                <Ticket className="h-3.5 w-3.5 text-[#397557]" />
                <span>Harga tiket mulai <strong className="font-bold text-[#071653]">{formatCurrency(lowestPrice)}</strong></span>
              </div>
            )}
          </div>

          {/* ==================== EVENTS GRID ==================== */}
          {loading ? (
            <Loading message="Memuat katalog konser pilihan..." />
          ) : (
            <EventGrid
              events={filteredEvents}
              variant="light"
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
