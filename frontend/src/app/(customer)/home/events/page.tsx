"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarDays, MapPin, Search } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
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
  "Festival",
];

function matchesGenre(event: Event, selectedGenre: string): boolean {
  if (selectedGenre === "Semua Genre") return true;

  const genre = `${event.genre || ""} ${event.artists?.genre || ""}`.toLowerCase();
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

export default function CustomerEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua Genre");
  const [city, setCity] = useState("Semua Kota");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchEvents({ limit: 100, sort: "asc" })
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch((error: unknown) => {
        if (active) setLoadError(getApiErrorMessage(error, "Daftar konser gagal dimuat."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const cities = useMemo(
    () => ["Semua Kota", ...Array.from(new Set(events.map((event) => event.location.split(",")[0].trim()).filter(Boolean)))],
    [events],
  );
  const filteredEvents = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return events.filter((event) => {
      const matchesQuery =
        !normalizedQuery ||
        [event.title, event.artists?.name, event.location, event.venue, event.genre]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(normalizedQuery);
      const matchesSelectedGenre = matchesGenre(event, genre);
      const matchesCity = city === "Semua Kota" || event.location.toLowerCase().includes(city.toLowerCase());
      return matchesQuery && matchesSelectedGenre && matchesCity;
    });
  }, [city, events, genre, query]);

  return (
    <div className="landing-page customer-lavender-page min-h-screen bg-[#f5f2ff] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <section className="rounded-2xl border border-[#e8e5ef] bg-white px-6 py-7 sm:px-9 sm:py-9">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6264b5]"><CalendarDays className="h-4 w-4" />Jadwal live · Indonesia</p>
            <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight tracking-tight text-[#071653] sm:text-5xl">
              Temukan konser <span className="text-[#6264b5]">yang ingin kamu kenang.</span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#68708a] sm:text-base">
              Dari konser intim hingga festival besar, jelajahi jadwal pertunjukan dari berbagai kota di Indonesia. Temukan artis yang kamu suka, bandingkan lokasi dan tanggal, lalu pilih acara yang paling cocok untuk pengalaman musik berikutnya.
            </p>
          </div>
        </section>

        <section className="mt-5 rounded-[1.75rem] border border-[#e6e0ef] bg-gradient-to-br from-white via-white to-[#f7f3fb] p-4 shadow-[0_24px_70px_-48px_rgba(51,37,86,.28)] sm:p-7">
          <div className="grid gap-3 md:grid-cols-[1fr_200px]">
            <label className="group flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition hover:border-[#c8b7db] focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]"><Search className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">Cari Konser / Artis / Venue</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama konser, artis, atau venue"
                className="w-full bg-transparent text-sm font-medium text-[#071653] outline-none placeholder:text-[#8790a8]"
              />
              </span>
            </label>
            <label className="flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition hover:border-[#c8b7db] focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]"><MapPin className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">Kota</span>
              <select value={city} onChange={(event) => setCity(event.target.value)} className="w-full bg-transparent text-sm font-semibold text-[#071653] outline-none">
                {cities.map((cityOption) => <option key={cityOption} value={cityOption}>{cityOption}</option>)}
              </select>
              </span>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#e8e5ef] pt-4">
            <span className="mr-1 text-xs font-semibold text-[#5c6482]">Pilih Genre:</span>
            {GENRES.map((genreOption) => (
              <button
                key={genreOption}
                type="button"
                onClick={() => setGenre(genreOption)}
                aria-pressed={genre === genreOption}
                className={`rounded-full px-4 py-2 text-xs font-bold transition ${
                  genre === genreOption
                    ? "bg-[#6264b5] text-white"
                    : "border border-[#e8e5ef] bg-[#fffdf2] text-[#5c6482] hover:border-[#c8b7db] hover:text-[#071653]"
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
              <span className="flex h-8 min-w-8 items-center justify-center rounded-lg bg-[#eeebf4] px-2 text-xs font-bold text-[#6264b5]">{filteredEvents.length}</span>
              <p className="text-sm font-medium text-[#5c6482]">Menampilkan <strong className="text-[#071653]">{filteredEvents.length}</strong> konser yang sesuai dengan pilihan filter kamu.</p>
            </div>
            {(query || genre !== "Semua Genre" || city !== "Semua Kota") && (
              <button type="button" onClick={() => { setQuery(""); setGenre("Semua Genre"); setCity("Semua Kota"); }} className="text-xs font-semibold text-[#6264b5] hover:text-[#51539f]">
                Tampilkan semua konser
              </button>
            )}
          </div>
          {loading ? (
            <Loading message="Memuat jadwal konser..." />
          ) : loadError ? (
            <div className="rounded-2xl border border-rose-200 bg-[#fffdf2] p-8 text-center">
              <p className="text-sm font-semibold text-rose-700">{loadError}</p>
              <button type="button" onClick={() => { setLoading(true); setLoadError(""); setReloadKey((key) => key + 1); }} className="mt-4 rounded-lg bg-[#6264b5] px-4 py-2 text-xs font-bold text-white">Coba lagi</button>
            </div>
          ) : (
            <EventGrid events={filteredEvents} variant="light" emptyTitle="Konser belum ditemukan" emptyDescription="Coba kata kunci atau filter kota yang berbeda." />
          )}
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
