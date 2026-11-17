"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Disc3, Music2, Search, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { fetchArtists } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";
import { Loading } from "@/components/shared/Loading";
import { getApiErrorMessage } from "@/lib/apiError";

const GENRES = ["Semua", "Pop", "Rock", "K-Pop", "Jazz", "EDM", "Metal"];

export default function CustomerArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchArtists()
      .then((data) => {
        if (active) setArtists(data);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(getApiErrorMessage(error, "Daftar artis gagal dimuat."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const genres = useMemo(
    () => ["Semua", ...Array.from(new Set(artists.map((artist) => artist.genre).filter((value): value is string => Boolean(value))))],
    [artists],
  );
  const filteredArtists = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return artists.filter((artist) => {
      const matchesQuery =
        !normalizedQuery ||
        [artist.name, artist.genre, artist.description, artist.country].filter(Boolean).join(" ").toLowerCase().includes(normalizedQuery);
      const matchesGenre = genre === "Semua" || (artist.genre || "").toLowerCase().includes(genre.toLowerCase());
      return matchesQuery && matchesGenre;
    });
  }, [artists, genre, query]);

  return (
    <div className="landing-page min-h-screen bg-[#fffdf2] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <section className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#071653] p-7 text-white sm:p-10">
            <div className="absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-[#6264b5]/35 blur-3xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#d9c8e8]">
                <Music2 className="h-4 w-4" /> Artis & musisi
              </p>
              <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight sm:text-5xl">
                Ikuti suara yang menggerakkanmu.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
                Kenali lineup, jelajahi genre, lalu temukan konser berikutnya dari musisi favoritmu.
              </p>
              <Link href="/home/events" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c8b7db] px-5 py-3 text-xs font-extrabold text-[#071653] transition hover:bg-[#e2d5ec]">
                Cari jadwal konser <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="flex items-center gap-3 rounded-2xl border border-[#e8e5ef] bg-[#f7f4fa] p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fffdf2] text-[#6264b5]"><Disc3 className="h-5 w-5" /></span>
              <div><p className="text-2xl font-extrabold">{artists.length}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">Artis terdaftar</p></div>
            </div>
            <div className="flex items-center gap-3 rounded-2xl border border-[#e8e5ef] bg-[#f7f4fa] p-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fffdf2] text-[#6264b5]"><Ticket className="h-5 w-5" /></span>
              <div><p className="text-2xl font-extrabold">{genres.length - 1}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">Genre musik</p></div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-4 shadow-[0_12px_35px_-28px_rgba(7,22,83,.25)] sm:p-5">
          <label className="flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 focus-within:border-[#6264b5]">
            <Search className="h-4 w-4 text-[#6264b5]" />
            <span className="sr-only">Cari artis</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, genre, atau asal artis"
              className="w-full bg-transparent text-sm outline-none placeholder:text-[#8790a8]"
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-2">
            {GENRES.map((genreOption) => (
              <button
                key={genreOption}
                type="button"
                onClick={() => setGenre(genreOption)}
                aria-pressed={genre === genreOption}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  genre === genreOption ? "bg-[#6264b5] text-white" : "border border-[#e8e5ef] bg-[#fffdf2] text-[#5c6482] hover:border-[#c8b7db] hover:text-[#071653]"
                }`}
              >
                {genreOption}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-9">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">Lineup pilihan</p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">{filteredArtists.length} artis untuk dijelajahi</h2>
            </div>
            {(query || genre !== "Semua") && (
              <button type="button" onClick={() => { setQuery(""); setGenre("Semua"); }} className="text-xs font-bold text-[#6264b5] hover:text-[#071653]">
                Hapus filter
              </button>
            )}
          </div>
          {loading ? (
            <div className="rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] py-16"><Loading message="Memuat profil artis..." /></div>
          ) : loadError ? (
            <div className="rounded-2xl border border-rose-200 bg-[#fffdf2] p-8 text-center">
              <p className="text-sm font-semibold text-rose-700">{loadError}</p>
              <button type="button" onClick={() => { setLoading(true); setLoadError(""); setReloadKey((key) => key + 1); }} className="mt-4 rounded-lg bg-[#6264b5] px-4 py-2 text-xs font-bold text-white">Coba lagi</button>
            </div>
          ) : filteredArtists.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredArtists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#c8b7db] bg-[#f7f4fa] px-6 py-14 text-center">
              <Disc3 className="mx-auto h-8 w-8 text-[#6264b5]" />
              <h3 className="mt-3 font-bold">Artis tidak ditemukan</h3>
              <p className="mt-1 text-sm text-[#5c6482]">Coba ubah kata kunci atau pilih genre lain.</p>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
