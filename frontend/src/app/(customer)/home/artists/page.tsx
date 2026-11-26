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

const GENRES = [
  "Semua Genre",
  "Pop",
  "Rock & Indie",
  "K-Pop",
  "Hip-Hop & Rap",
  "R&B & Soul",
  "EDM & Electronic",
  "Jazz & Blues",
  "Metal & Punk",
  "Folk & Country",
  "Reggae",
  "Klasik",
  "Dangdut",
];

function matchesGenre(artistGenre: string | null | undefined, selectedGenre: string): boolean {
  if (selectedGenre === "Semua Genre") return true;

  const genre = (artistGenre || "").toLowerCase();
  const patterns: Record<string, string[]> = {
    "Rock & Indie": ["rock", "indie"],
    "K-Pop": ["k-pop", "kpop", "korean"],
    "Hip-Hop & Rap": ["hip-hop", "hip hop", "hiphop", "rap"],
    "R&B & Soul": ["r&b", "rnb", "rhythm and blues", "soul"],
    "EDM & Electronic": ["edm", "electronic", "dance"],
    "Jazz & Blues": ["jazz", "blues"],
    "Metal & Punk": ["metal", "punk", "hardcore"],
    "Folk & Country": ["folk", "country", "bluegrass"],
    Reggae: ["reggae", "ska", "dancehall"],
    Klasik: ["classical", "klasik", "orchestra", "orchestral"],
  };
  const matches = patterns[selectedGenre] || [selectedGenre.toLowerCase()];
  return matches.some((pattern) => genre.includes(pattern));
}

export default function CustomerArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua Genre");
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
      return matchesQuery && matchesGenre(artist.genre, genre);
    });
  }, [artists, genre, query]);

  return (
    <div className="landing-page customer-lavender-page min-h-screen bg-[#f5f2ff] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <section className="rounded-2xl border border-[#e8e5ef] bg-white px-6 py-7 sm:px-9 sm:py-9">
          <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#6264b5]"><Music2 className="h-4 w-4" />Artis &amp; musisi</p>
          <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#071653] sm:text-5xl">
            Temukan suara baru dan kenali <span className="text-[#6264b5]">musisi favoritmu.</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#68708a] sm:text-base">
            Jelajahi profil, genre, dan perjalanan para musisi dari berbagai panggung. Temukan artis yang sesuai dengan seleramu, lalu lanjutkan ke jadwal konser untuk merencanakan pengalaman musik berikutnya.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e5ef] bg-[#faf9fc] px-3 py-1.5 text-xs text-[#5c6482]"><Disc3 className="h-4 w-4 text-[#6264b5]" /><strong className="text-[#071653]">{artists.length || "24+"}</strong> artis pilihan</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e5ef] bg-[#faf9fc] px-3 py-1.5 text-xs text-[#5c6482]"><Music2 className="h-4 w-4 text-[#6264b5]" /><strong className="text-[#071653]">{genres.length - 1}</strong> genre musik</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e5ef] bg-[#faf9fc] px-3 py-1.5 text-xs text-[#5c6482]"><Ticket className="h-4 w-4 text-[#397557]" /><strong className="text-[#071653]">Live</strong> tiket tersedia</span>
          </div>
          <Link href="/home/events" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6264b5] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#51539f]">
            Lihat Jadwal Konser <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </section>

        <section className="mt-5 rounded-[1.5rem] border border-[#e6e0ef] bg-white p-4 shadow-[0_20px_60px_-42px_rgba(51,37,86,.25)] sm:p-6">
          <label className="group flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition hover:border-[#c8b7db] focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]"><Search className="h-4 w-4" /></span>
            <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">Cari Musisi / Band / Genre</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari nama, genre, atau asal artis"
              className="w-full bg-transparent text-sm font-medium text-[#071653] outline-none placeholder:text-[#8790a8]"
            />
            </span>
          </label>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#e8e5ef] pt-4">
            <span className="mr-1 text-xs font-semibold text-[#5c6482]">Kategori Genre:</span>
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
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e5ef] pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#eeebf4] px-2 text-xs font-bold text-[#6264b5]">{filteredArtists.length}</span>
              <p className="text-sm font-medium text-[#5c6482]">Menampilkan <strong className="text-[#071653]">{filteredArtists.length}</strong> artis yang sesuai dengan pilihan filter kamu.</p>
            </div>
            {(query || genre !== "Semua Genre") && (
              <button type="button" onClick={() => { setQuery(""); setGenre("Semua Genre"); }} className="text-xs font-semibold text-[#6264b5] hover:text-[#51539f]">
                Tampilkan semua artis
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
