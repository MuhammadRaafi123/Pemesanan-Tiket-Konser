"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Disc3, Mic2, RefreshCw, Search, UserPlus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { Stagger } from "@/components/shared/Reveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { fetchPopularArtists } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";
import { useAuthStore } from "@/stores/authStore";

export default function ArtistsPage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchPopularArtists(20)
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

  const filteredArtists = artists.filter((artist) => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    return (
      artist.name.toLowerCase().includes(query) || Boolean(artist.genre?.toLowerCase().includes(query))
    );
  });
  const isSignedIn = hydrated && Boolean(user);
  const accountHref = user?.role === "admin" ? "/admin" : "/profile";

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
                <Mic2 className="h-3.5 w-3.5 text-[#ffb703]" />
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ffb703]">
                  {isSignedIn ? "Musisi untukmu" : "Daftar musisi &amp; band"}
                </span>
              </div>
              <h1 className="mt-6 text-[clamp(2.3rem,6vw,4.5rem)] font-extrabold leading-[1.04] tracking-tight">
                {isSignedIn ? `Hai, ${user?.name.split(" ")[0]}.` : "Temukan suara"}
                <br />
                <span className="bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] bg-clip-text text-transparent">
                  {isSignedIn ? "Siapa favoritmu?" : "favoritmu."}
                </span>
              </h1>
              <p className="mt-5 max-w-xl text-sm leading-7 text-[#8a8d98] sm:text-base">
                {isSignedIn
                  ? "Jelajahi profil musisi, lihat jadwal panggung mereka, dan temukan konser berikutnya yang ingin kamu datangi."
                  : "Kenali musisi pilihan, jelajahi karya mereka, dan temukan konser berikutnya untuk dinikmati langsung."}
              </p>
              <div className="mt-7 flex items-center gap-3 text-xs text-[#8a8d98]">
                <Disc3 className="h-4 w-4 text-[#ffb703]" />
                <span>
                  <span className="font-bold text-[#e1e2ec]">{artists.length}</span> artis
                  pilihan
                </span>
              </div>
              {hydrated ? (
                <div className="mt-7 flex flex-wrap gap-3">
                  {isSignedIn ? (
                    <>
                      <Link
                        href="/events"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
                      >
                        Lihat jadwal konser
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link
                        href={accountHref}
                        className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-5 py-3 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                      >
                        {user?.role === "admin" ? "Dashboard admin" : "Profil saya"}
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/register"
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
                      >
                        <UserPlus className="h-3.5 w-3.5" />
                        Gabung gratis
                      </Link>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-5 py-3 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                      >
                        Masuk ke akun
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
            <label
              htmlFor="artist-search"
              className="mb-2 block text-[10px] font-semibold uppercase tracking-[0.16em] text-[#8a8d98]"
            >
              Cari artis
            </label>
            <div className="flex h-12 items-center gap-3 rounded-xl border border-[#2a2d36] bg-[#10131a] px-4 transition focus-within:border-[#ffb703]/50 focus-within:ring-4 focus-within:ring-[#ffb703]/10">
              <Search className="h-4 w-4 shrink-0 text-[#ffb703]" />
              <input
                id="artist-search"
                type="search"
                placeholder="Cari nama artis atau genre musik..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="h-full min-w-0 flex-1 bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#686b75]"
              />
            </div>
          </div>

          <div className="mt-9 flex items-center justify-between gap-4">
            <p className="text-xs text-[#8a8d98]">
              Menampilkan{" "}
              <span className="font-bold text-[#e1e2ec]">{filteredArtists.length}</span> artis
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
              <div
                className="flex min-h-[300px] flex-col items-center justify-center p-8 text-center"
                role="status"
                aria-live="polite"
              >
                <Disc3 className="mb-5 h-8 w-8 animate-spin text-[#ffb703]" />
                <p className="text-sm font-medium text-[#e1e2ec]">Memuat data artis...</p>
                <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#7a7d88]">
                  Concertix
                </p>
              </div>
            ) : loadError ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-2xl border border-[#2a2d36] bg-[#191b23] px-6 py-12 text-center">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-[#ffb703]/20 bg-[#ffb703]/[0.08] text-[#ffb703]">
                  <RefreshCw className="h-6 w-6" />
                </span>
                <h2 className="text-xl font-bold text-[#e1e2ec]">Data artis belum dapat dimuat</h2>
                <p className="mt-2 max-w-sm text-sm leading-6 text-[#8a8d98]">
                  Periksa koneksi kamu, lalu coba muat ulang daftar artis.
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
                step={70}
              >
                {filteredArtists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </Stagger>
            ) : (
              <EmptyState
                icon={Disc3}
                title="Artis tidak ditemukan"
                description="Tidak ada musisi yang cocok dengan pencarianmu."
                actionLabel="Reset pencarian"
                onAction={() => setSearchQuery("")}
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
