"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpDown,
  Check,
  Disc3,
  Mic2,
  Music,
  RefreshCw,
  RotateCcw,
  Search,
  Ticket,
  UserPlus,
  X,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { Stagger } from "@/components/shared/Reveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { fetchPopularArtists } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";
import { useAuthStore } from "@/stores/authStore";

type SortBy = "popular" | "az" | "za" | "events";

const GENRES = [
  { id: "all", label: "Semua Genre", color: "#ffb703" },
  { id: "pop", label: "Pop", color: "#38bdf8" },
  { id: "rock", label: "Rock & Indie", color: "#f97316" },
  { id: "kpop", label: "K-Pop", color: "#ec4899" },
  { id: "jazz", label: "Jazz & Soul", color: "#f59e0b" },
  { id: "edm", label: "EDM", color: "#8b5cf6" },
  { id: "metal", label: "Metal & Alternatif", color: "#10b981" },
];

export default function ArtistsPage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [sortBy, setSortBy] = useState<SortBy>("popular");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchPopularArtists(24)
      .then((data) => {
        if (active) setArtists(data);
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

  const filteredArtists = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const list = artists.filter((artist) => {
      // Search match
      if (query) {
        const matchText = [
          artist.name,
          artist.genre ?? "",
          artist.description ?? "",
          artist.country ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!matchText.includes(query)) return false;
      }

      // Genre filter
      if (selectedGenre !== "all") {
        const genre = (artist.genre ?? "").toLowerCase();
        if (selectedGenre === "pop" && !genre.includes("pop")) return false;
        if (selectedGenre === "rock" && !(genre.includes("rock") || genre.includes("indie"))) return false;
        if (selectedGenre === "kpop" && !(genre.includes("k-pop") || genre.includes("kpop") || genre.includes("korean"))) return false;
        if (selectedGenre === "jazz" && !(genre.includes("jazz") || genre.includes("soul") || genre.includes("blues"))) return false;
        if (selectedGenre === "edm" && !(genre.includes("edm") || genre.includes("electronic") || genre.includes("dance"))) return false;
        if (selectedGenre === "metal" && !(genre.includes("metal") || genre.includes("alt") || genre.includes("punk") || genre.includes("hardcore"))) return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === "az") return a.name.localeCompare(b.name);
      if (sortBy === "za") return b.name.localeCompare(a.name);
      if (sortBy === "events") {
        const aEvents = a.upcomingEventsCount ?? (a.events?.length ?? 0);
        const bEvents = b.upcomingEventsCount ?? (b.events?.length ?? 0);
        return bEvents - aEvents;
      }
      // "popular"
      const aRank = a.popularity_rank ?? 999;
      const bRank = b.popularity_rank ?? 999;
      return aRank - bRank;
    });

    return list;
  }, [artists, searchQuery, selectedGenre, sortBy]);

  const isSignedIn = hydrated && Boolean(user);
  const accountHref = user?.role === "admin" ? "/admin" : "/profile";
  const hasActiveFilters = Boolean(searchQuery || selectedGenre !== "all" || sortBy !== "popular");

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedGenre("all");
    setSortBy("popular");
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] selection:bg-[#ffb703]/30 selection:text-white">
      <Navbar />

      <main className="relative flex-1">
        {/* ==================== HERO SECTION ==================== */}
        <section className="relative overflow-hidden px-5 pb-12 pt-32 sm:px-8 sm:pb-16 sm:pt-40">
          {/* Ambient Lighting Gradients */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/3 h-[500px] w-[750px] -translate-x-1/4 rounded-full bg-[#ffb703]/[0.06] blur-[140px]" />
            <div className="absolute right-0 top-20 h-[360px] w-[400px] rounded-full bg-[#6801d1]/[0.08] blur-[120px]" />
            <div className="absolute bottom-0 left-10 h-[250px] w-[350px] rounded-full bg-[#ec4899]/[0.04] blur-[100px]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="max-w-3xl">

              {/* Title */}
              <h1 className="mt-6 text-[clamp(2.4rem,5.5vw,4.5rem)] font-extrabold leading-[1.05] tracking-tight text-white">
                Temukan Suara &amp;{" "}
                <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] bg-clip-text text-transparent">
                  Musisi Favoritmu.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#9497a6] sm:text-base">
                Kenali musisi idola, jelajahi karya mereka, dan dapatkan akses langsung ke jadwal konser serta tiket resmi di seluruh panggung Indonesia.
              </p>

              {/* Stats Bar */}
              <div className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#141720]/80 px-3.5 py-2">
                  <Disc3 className="h-4 w-4 text-[#ffb703]" />
                  <span className="text-xs text-[#8a8d9b]">
                    <strong className="font-bold text-white">{artists.length || "24+"}</strong> Artis Pilihan
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#141720]/80 px-3.5 py-2">
                  <Music className="h-4 w-4 text-[#ec4899]" />
                  <span className="text-xs text-[#8a8d9b]">
                    <strong className="font-bold text-white">6+</strong> Genre Musik
                  </span>
                </div>
                <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#141720]/80 px-3.5 py-2">
                  <Ticket className="h-4 w-4 text-[#10b981]" />
                  <span className="text-xs text-[#8a8d9b]">
                    <strong className="font-bold text-white">Live</strong> Tiket Tersedia
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              {hydrated ? (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all hover:-translate-y-0.5 hover:bg-[#ffdea9] hover:shadow-[#ffb703]/30"
                  >
                    Lihat Jadwal Konser
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {isSignedIn ? (
                    <Link
                      href={accountHref}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-5 py-3 text-xs font-semibold text-[#e1e2ec] transition-all hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                    >
                      {user?.role === "admin" ? "Dashboard Admin" : "Profil Saya"}
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-5 py-3 text-xs font-semibold text-[#e1e2ec] transition-all hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Gabung Gratis
                    </Link>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        {/* ==================== SEARCH & FILTERS HUB ==================== */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
          <div className="relative overflow-hidden rounded-[24px] border border-[#232733] bg-[#141720]/95 p-5 shadow-[0_25px_70px_-25px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-7">
            {/* Top gold accent line */}
            <div aria-hidden className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#ffb703]/50 to-transparent" />

            {/* Search Input & Sort Grid */}
            <div className="grid gap-3 sm:grid-cols-12">
              {/* Search input */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#262a37] bg-[#1a1d26] px-4 py-3 transition-all duration-300 focus-within:border-[#ffb703] focus-within:bg-[#1d212d] focus-within:ring-2 focus-within:ring-[#ffb703]/20 hover:border-[#383d4f] sm:col-span-8 lg:col-span-9">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#ffb703]/30 bg-[#ffb703]/10 text-[#ffb703] shadow-[0_0_12px_rgba(255,183,3,0.15)] transition-transform group-focus-within:scale-105">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label htmlFor="artist-search" className="block text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
                    Cari Musisi / Band / Genre
                  </label>
                  <input
                    id="artist-search"
                    type="search"
                    placeholder="Ketik Coldplay, Sheila On 7, NIKI, Taylor Swift..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#555866]"
                  />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full p-1 text-[#6b6e7d] transition-colors hover:bg-[#282c3a] hover:text-white"
                    title="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#262a37] bg-[#1a1d26] px-4 py-3 transition-all duration-300 focus-within:border-[#a855f7] focus-within:bg-[#1d212d] focus-within:ring-2 focus-within:ring-[#a855f7]/20 hover:border-[#383d4f] sm:col-span-4 lg:col-span-3">
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
                    <option value="popular" className="bg-[#141720] text-[#e1e2ec]">Paling Populer</option>
                    <option value="az" className="bg-[#141720] text-[#e1e2ec]">Nama: A - Z</option>
                    <option value="za" className="bg-[#141720] text-[#e1e2ec]">Nama: Z - A</option>
                    <option value="events" className="bg-[#141720] text-[#e1e2ec]">Jadwal Konser Terbanyak</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Genre Pills Filter */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#1e222e] pt-3.5">
              <div className="flex items-center gap-1.5 pr-2 text-xs font-semibold text-[#8a8d9b]">
                <Music className="h-3.5 w-3.5 text-[#ffb703]" />
                <span className="hidden sm:inline">Kategori Genre:</span>
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

          {/* ==================== RESULTS STATS ==================== */}
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#1e2128] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#232733] bg-[#141720] text-xs font-bold text-[#ffb703]">
                {filteredArtists.length}
              </span>
              <p className="text-sm font-medium text-[#8a8d9b]">
                Menampilkan <strong className="text-white">{filteredArtists.length}</strong> musisi
                {selectedGenre !== "all" && <span> kategori <strong className="text-[#ffb703]">{GENRES.find((g) => g.id === selectedGenre)?.label}</strong></span>}
                {searchQuery && <span> dengan pencarian &ldquo;<strong className="text-white">{searchQuery}</strong>&rdquo;</span>}
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
              >
                Tampilkan Semua Artis &times;
              </button>
            )}
          </div>

          {/* ==================== ARTISTS GRID ==================== */}
          <div className="mt-6">
            {loading ? (
              <div
                className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#232733] bg-[#141720]/50 p-12 text-center"
                role="status"
                aria-live="polite"
              >
                <Disc3 className="mb-4 h-9 w-9 animate-spin text-[#ffb703]" />
                <p className="text-sm font-medium text-[#e1e2ec]">Memuat data artis &amp; musisi...</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#7a7d88]">
                  Tixora Music
                </p>
              </div>
            ) : loadError ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#2a2d36] bg-[#141720] px-6 py-12 text-center">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffb703]/20 bg-[#ffb703]/[0.08] text-[#ffb703]">
                  <RefreshCw className="h-6 w-6" />
                </span>
                <h2 className="text-xl font-bold text-[#e1e2ec]">Data artis belum dapat dimuat</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#8a8d98]">
                  Periksa koneksi kamu, lalu coba muat ulang daftar musisi.
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
            ) : filteredArtists.length > 0 ? (
              <Stagger
                className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                step={60}
              >
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </Stagger>
            ) : (
              <EmptyState
                icon={Disc3}
                title="Artis tidak ditemukan"
                description="Tidak ada musisi yang cocok dengan kata kunci atau filter genre kamu."
                actionLabel="Reset pencarian"
                onAction={resetFilters}
                variant="dark"
              />
            )}
          </div>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
