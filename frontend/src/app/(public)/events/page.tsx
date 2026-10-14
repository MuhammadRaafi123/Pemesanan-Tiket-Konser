"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Disc3,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Ticket as TicketIcon,
  UserPlus,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency } from "@/lib/format";
import { useAuthStore } from "@/stores/authStore";

type SortBy = "recommended" | "lowest" | "highest";

const GENRES = [
  { id: "all", label: "Semua genre" },
  { id: "rock", label: "Rock & pop" },
  { id: "edm", label: "EDM & festival" },
  { id: "jazz", label: "Jazz & soul" },
];

const SORTS: { id: SortBy; label: string }[] = [
  { id: "recommended", label: "Rekomendasi" },
  { id: "lowest", label: "Harga termurah" },
  { id: "highest", label: "Harga termahal" },
];

function EventsLoading({ fullScreen = false }: { fullScreen?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center ${
        fullScreen ? "fixed inset-0 z-50 bg-[#0b0e15]" : "min-h-[300px]"
      }`}
      role="status"
      aria-live="polite"
    >
      <Disc3 className="mb-5 h-8 w-8 animate-spin text-[#ffb703]" />
      <p className="text-sm font-medium text-[#e1e2ec]">Memuat daftar konser...</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#7a7d88]">Concertix</p>
    </div>
  );
}

function EventsView({ initialQuery }: { initialQuery: string }) {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [events, setEvents] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recommended");
  const [loading, setLoading] = useState<boolean>(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchEvents({ limit: 100 })
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch(() => {
        if (active) setLoadError(true);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filteredEvents = events
    .filter((event) => {
      const query = searchQuery.toLowerCase().trim();
      if (query) {
        const titleMatch = event.title.toLowerCase().includes(query);
        const artistMatch = event.artists?.name?.toLowerCase().includes(query);
        const locationMatch = event.location.toLowerCase().includes(query);
        const venueMatch = event.venue?.toLowerCase().includes(query);
        if (!titleMatch && !artistMatch && !locationMatch && !venueMatch) return false;
      }

      if (selectedGenre !== "all") {
        const genre = event.genre?.toLowerCase() ?? "";
        if (selectedGenre === "rock" && !(genre.includes("rock") || genre.includes("pop"))) return false;
        if (selectedGenre === "edm" && !(genre.includes("edm") || genre.includes("electronic"))) return false;
        if (selectedGenre === "jazz" && !(genre.includes("jazz") || genre.includes("soul"))) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = a.ticket_categories?.length ? Math.min(...a.ticket_categories.map((tc) => tc.price)) : 0;
      const priceB = b.ticket_categories?.length ? Math.min(...b.ticket_categories.map((tc) => tc.price)) : 0;

      if (sortBy === "lowest") return priceA - priceB;
      if (sortBy === "highest") return priceB - priceA;
      return 0;
    });

  const ticketPrices = filteredEvents.flatMap((event) =>
    (event.ticket_categories ?? []).map((category) => category.price),
  );
  const lowestPrice = ticketPrices.length ? Math.min(...ticketPrices) : null;
  const isSignedIn = hydrated && Boolean(user);
  const primaryAccountHref = user?.role === "admin" ? "/admin" : "/home";

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
      <Navbar />

      <main className="flex-1">
        <section className="relative overflow-hidden px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/3 h-[460px] w-[680px] rounded-full bg-[#ffb703]/[0.07] blur-[120px]" />
            <div className="absolute right-0 top-24 h-[300px] w-[300px] rounded-full bg-[#6801d1]/[0.08] blur-[100px]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_top,black_10%,transparent_75%)]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/20 bg-[#ffb703]/[0.08] px-4 py-2">
                <TicketIcon className="h-3.5 w-3.5 text-[#ffb703]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ffb703]">
                  {isSignedIn ? "Pilihan konser untukmu" : "Jadwal konser resmi"}
                </span>
              </div>
              <h1 className="mt-6 text-[clamp(2.3rem,6vw,4.5rem)] font-extrabold leading-[1.04] tracking-tight">
                {isSignedIn ? `Hai, ${user?.name.split(" ")[0]}.` : "Cari panggung"}
                <br />
                <span className="bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] bg-clip-text text-transparent">
                  {isSignedIn ? "Pilih konsermu." : "berikutnya."}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#8a8d98] sm:text-base">
                {isSignedIn
                  ? "Jelajahi konser mendatang dan lanjutkan pengalamanmu. Pesanan serta tiket digitalmu selalu bisa dibuka dari akun."
                  : "Temukan konser yang ingin kamu datangi, pilih tiketnya, dan bersiap untuk malam yang tak terlupakan."}
              </p>
              <div className="mt-7 flex items-center gap-3 text-xs text-[#8a8d98]">
                <CalendarDays className="h-4 w-4 text-[#ffb703]" />
                <span>
                  <span className="font-bold text-[#e1e2ec]">{events.length}</span> konser untuk
                  dijelajahi
                </span>
              </div>
              {hydrated ? (
                <div className="mt-7 flex flex-wrap gap-3">
                  {isSignedIn ? (
                    <>
                      <Link
                        href={primaryAccountHref}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
                      >
                        {user?.role === "admin" ? "Dashboard admin" : "Dashboard saya"}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      {user?.role !== "admin" ? (
                        <Link
                          href="/tickets"
                          className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-5 py-3 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                        >
                          Tiket digital saya
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : null}
                    </>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Buat akun gratis
                      </Link>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-5 py-3 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                      >
                        Sudah punya akun? Masuk
                      </Link>
                    </>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 sm:px-8">
          <div className="rounded-2xl border border-[#232733] bg-[#191b23] p-4 shadow-2xl shadow-black/20 sm:rounded-3xl sm:p-6">
            <div className="grid gap-3 sm:grid-cols-12">
              <div className="sm:col-span-8">
                <label htmlFor="event-search" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8d98]">
                  Cari konser
                </label>
                <div className="flex h-12 items-center gap-3 rounded-xl border border-[#2a2d36] bg-[#10131a] px-4 transition focus-within:border-[#ffb703]/50 focus-within:ring-4 focus-within:ring-[#ffb703]/10">
                  <Search className="h-4 w-4 shrink-0 text-[#ffb703]" />
                  <input
                    id="event-search"
                    type="search"
                    placeholder="Nama konser, artis, venue, atau kota..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#686b75]"
                  />
                </div>
              </div>

              <div className="sm:col-span-4">
                <label htmlFor="event-sort" className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8d98]">
                  Urutkan
                </label>
                <select
                  id="event-sort"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value as SortBy)}
                  className="h-12 w-full cursor-pointer rounded-xl border border-[#2a2d36] bg-[#10131a] px-4 text-sm text-[#e1e2ec] outline-none transition hover:border-[#ffb703]/30 focus:border-[#ffb703]/50 focus:ring-4 focus:ring-[#ffb703]/10"
                >
                  {SORTS.map((sort) => (
                    <option key={sort.id} value={sort.id}>
                      {sort.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-[#2a2d36] pt-5">
              <span className="mr-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8d98]">
                <SlidersHorizontal className="h-3 w-3 text-[#ffb703]" />
                Genre
              </span>
              {GENRES.map((genre) => {
                const isSelected = selectedGenre === genre.id;
                return (
                  <button
                    key={genre.id}
                    type="button"
                    onClick={() => setSelectedGenre(genre.id)}
                    aria-pressed={isSelected}
                    className={`press rounded-full border px-3.5 py-2 text-xs font-semibold transition-all duration-300 ${
                      isSelected
                        ? "border-[#ffb703] bg-[#ffb703] text-[#10131a] shadow-lg shadow-[#ffb703]/15"
                        : "border-[#2a2d36] bg-[#1e2128] text-[#a1a3ac] hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                    }`}
                  >
                    {genre.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-9 flex items-center justify-between gap-4">
            <p className="text-xs text-[#8a8d98]">
              Menampilkan{" "}
              <span className="font-bold text-[#e1e2ec]">{filteredEvents.length}</span> konser
            </p>
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
              >
                Reset pencarian
              </button>
            ) : null}
          </div>

          <div className="mt-5">
            {loading ? (
              <EventsLoading />
            ) : loadError ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#2a2d36] bg-[#191b23] px-6 py-12 text-center">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffb703]/20 bg-[#ffb703]/[0.08] text-[#ffb703]">
                  <RefreshCw className="h-6 w-6" />
                </span>
                <h2 className="text-xl font-bold text-[#e1e2ec]">Konser belum dapat dimuat</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#8a8d98]">
                  Periksa koneksi kamu, lalu coba muat ulang daftar konser.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setLoadError(false);
                    setReloadKey((key) => key + 1);
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Coba lagi
                </button>
              </div>
            ) : (
              <EventGrid events={filteredEvents} variant="dark" />
            )}
          </div>

          {!loading && !loadError && lowestPrice !== null ? (
            <p className="mt-12 text-center text-xs text-[#7a7d88]">
              Harga mulai dari{" "}
              <span className="font-semibold text-[#ffb703]">{formatCurrency(lowestPrice)}</span>
              {" "}· Harga tiket mengikuti kategori yang dipilih
            </p>
          ) : null}
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

function EventsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  return <EventsView key={initialQuery} initialQuery={initialQuery} />;
}

export default function EventsPage() {
  return (
    <Suspense fallback={<EventsLoading fullScreen />}>
      <EventsContent />
    </Suspense>
  );
}
