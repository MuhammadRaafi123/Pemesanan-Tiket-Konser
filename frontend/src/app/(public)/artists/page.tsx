"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpDown,
  Check,
  Disc3,
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
];

export default function ArtistsPage() {
  const pathname = usePathname();
  const router = useRouter();
  const eventsPath = pathname.startsWith("/home/") ? "/home/events" : "/events";
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
    if (hydrated && user && !pathname.startsWith("/home/")) {
      router.replace("/home/artists");
    }
  }, [hydrated, pathname, router, user]);

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
        if (selectedGenre === "jazz" && !(genre.includes("jazz") || genre.includes("blues"))) return false;
        if (selectedGenre === "edm" && !(genre.includes("edm") || genre.includes("electronic") || genre.includes("dance"))) return false;
        if (selectedGenre === "hiphop" && !(genre.includes("hip-hop") || genre.includes("hip hop") || genre.includes("hiphop") || genre.includes("rap"))) return false;
        if (selectedGenre === "rnb" && !(genre.includes("r&b") || genre.includes("rnb") || genre.includes("rhythm and blues") || genre.includes("soul"))) return false;
        if (selectedGenre === "metal" && !(genre.includes("metal") || genre.includes("punk") || genre.includes("hardcore"))) return false;
        if (selectedGenre === "folk" && !(genre.includes("folk") || genre.includes("country") || genre.includes("bluegrass"))) return false;
        if (selectedGenre === "reggae" && !(genre.includes("reggae") || genre.includes("ska") || genre.includes("dancehall"))) return false;
        if (selectedGenre === "classical" && !(genre.includes("classical") || genre.includes("klasik") || genre.includes("orchestra") || genre.includes("orchestral"))) return false;
        if (selectedGenre === "dangdut" && !genre.includes("dangdut")) return false;
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
    <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653] selection:bg-[#6264b5]/25 selection:text-[#071653]">
      <Navbar />

      <main className="relative flex-1">
        {/* ==================== HERO SECTION ==================== */}
        <section className="px-5 pb-9 pt-24 sm:px-8 sm:pt-28">
          <div className="mx-auto max-w-7xl">
            <div className="relative overflow-hidden rounded-2xl border border-[#e8e5ef] bg-white px-6 py-7 sm:px-9 sm:py-9">
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6264b5]"><Disc3 className="h-3.5 w-3.5" />Artis &amp; musisi</p>
              <h1 className="mt-3 text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[#071653]">
                Temukan suara baru dan kenali{" "}
                <br className="hidden sm:inline" />
                <span className="text-[#6264b5]">
                  musisi favoritmu.
                </span>
              </h1>

              {/* Subtitle */}
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#68708a] sm:text-base">
                Jelajahi profil, genre, dan perjalanan para musisi dari berbagai panggung. Temukan artis yang sesuai dengan seleramu, lalu lanjutkan ke jadwal konser untuk merencanakan pengalaman musik berikutnya.
              </p>

              {/* Stats Bar */}
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 rounded-full border border-[#e8e5ef] bg-[#faf9fc] px-3 py-1.5">
                  <Disc3 className="h-4 w-4 text-[#6264b5]" />
                  <span className="text-xs text-[#5c6482]">
                    <strong className="font-bold text-[#071653]">{artists.length || "24+"}</strong> Artis Pilihan
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#e8e5ef] bg-[#faf9fc] px-3 py-1.5">
                  <Music className="h-4 w-4 text-[#6264b5]" />
                  <span className="text-xs text-[#5c6482]">
                    <strong className="font-bold text-[#071653]">6+</strong> Genre Musik
                  </span>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-[#e8e5ef] bg-[#faf9fc] px-3 py-1.5">
                  <Ticket className="h-4 w-4 text-[#397557]" />
                  <span className="text-xs text-[#5c6482]">
                    <strong className="font-bold text-[#071653]">Live</strong> Tiket Tersedia
                  </span>
                </div>
              </div>

              {/* CTA Buttons */}
              {hydrated ? (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={eventsPath}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#6264b5] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-[#6264b5]/20 transition-all hover:-translate-y-0.5 hover:bg-[#51539f] hover:shadow-[#6264b5]/30"
                  >
                    Lihat Jadwal Konser
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  {isSignedIn ? (
                    <Link
                      href={accountHref}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#e8e5ef] bg-white px-5 py-3 text-xs font-semibold text-[#071653] transition-all hover:border-[#c8b7db] hover:text-[#6264b5]"
                    >
                      {user?.role === "admin" ? "Dashboard Admin" : "Profil Saya"}
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#e8e5ef] bg-white px-5 py-3 text-xs font-semibold text-[#071653] transition-all hover:border-[#c8b7db] hover:text-[#6264b5]"
                    >
                      <UserPlus className="h-3.5 w-3.5" />
                      Gabung Gratis
                    </Link>
                  )}
                </div>
              ) : null}
            </div>
            </div>
          </div>
        </section>

        {/* ==================== SEARCH & FILTERS HUB ==================== */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <div className="rounded-[1.5rem] border border-[#e6e0ef] bg-white p-4 shadow-[0_20px_60px_-42px_rgba(51,37,86,.25)] sm:p-6">
            {/* Search Input & Sort Grid */}
            <div className="grid gap-3 sm:grid-cols-12">
              {/* Search input */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition-all duration-200 focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10 hover:border-[#c8b7db] sm:col-span-8 lg:col-span-9">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5] transition-transform group-focus-within:scale-105">
                  <Search className="h-4.5 w-4.5" />
                </div>
                <div className="w-full min-w-0">
                  <label htmlFor="artist-search" className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                    Cari Musisi / Band / Genre
                  </label>
                  <input
                    id="artist-search"
                    type="search"
                    placeholder="Cari nama artis, band, genre, atau asal..."
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    className="w-full bg-transparent text-sm font-medium text-[#071653] outline-none placeholder:text-[#8790a8]"
                  />
                </div>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="rounded-full p-1 text-[#8790a8] transition-colors hover:bg-[#eeebf4] hover:text-[#071653]"
                    title="Hapus pencarian"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="group relative flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition-all duration-200 focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10 hover:border-[#c8b7db] sm:col-span-4 lg:col-span-3">
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
                    <option value="popular" className="bg-white text-[#071653]">Paling Populer</option>
                    <option value="az" className="bg-white text-[#071653]">Nama: A - Z</option>
                    <option value="za" className="bg-white text-[#071653]">Nama: Z - A</option>
                    <option value="events" className="bg-white text-[#071653]">Jadwal Konser Terbanyak</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Genre Pills Filter */}
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#e8e5ef] pt-4">
              <div className="flex items-center gap-1.5 pr-2 text-xs font-semibold text-[#5c6482]">
                <Music className="h-3.5 w-3.5 text-[#6264b5]" />
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

          {/* ==================== RESULTS STATS ==================== */}
          <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e5ef] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#eeebf4] px-2 text-xs font-bold text-[#6264b5]">
                {filteredArtists.length}
              </span>
              <p className="text-sm font-medium text-[#5c6482]">
                Menampilkan <strong className="text-[#071653]">{filteredArtists.length}</strong> artis yang cocok dengan pencarian dan pilihan filter kamu.
                {selectedGenre !== "all" && <span> kategori <strong className="text-[#6264b5]">{GENRES.find((g) => g.id === selectedGenre)?.label}</strong></span>}
                {searchQuery && <span> dengan pencarian &ldquo;<strong className="text-[#071653]">{searchQuery}</strong>&rdquo;</span>}
              </p>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-[#6264b5] transition hover:text-[#51539f]"
              >
                Tampilkan Semua Artis &times;
              </button>
            )}
          </div>

          {/* ==================== ARTISTS GRID ==================== */}
          <div className="mt-5">
            {loading ? (
              <div
                className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#e8e5ef] bg-white p-12 text-center"
                role="status"
                aria-live="polite"
              >
                <Disc3 className="mb-4 h-9 w-9 animate-spin text-[#6264b5]" />
                <p className="text-sm font-medium text-[#071653]">Memuat data artis &amp; musisi...</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#5c6482]">
                  Tixora Music
                </p>
              </div>
            ) : loadError ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#e8e5ef] bg-white px-6 py-12 text-center">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]">
                  <RefreshCw className="h-6 w-6" />
                </span>
                <h2 className="text-xl font-bold text-[#071653]">Data artis belum dapat dimuat</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#5c6482]">
                  Periksa koneksi kamu, lalu coba muat ulang daftar musisi.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setLoading(true);
                    setLoadError(false);
                    setReloadKey((key) => key + 1);
                  }}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6264b5] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#51539f]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Coba lagi
                </button>
              </div>
            ) : filteredArtists.length > 0 ? (
              <Stagger
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
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
                description="Kami belum menemukan artis yang sesuai dengan kata kunci atau genre pilihanmu. Coba gunakan nama yang lebih umum atau hapus filter untuk melihat semua musisi."
                actionLabel="Reset pencarian"
                onAction={resetFilters}
                variant="light"
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
