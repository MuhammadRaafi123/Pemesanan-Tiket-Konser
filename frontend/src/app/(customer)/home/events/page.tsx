"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin, Search, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { Loading } from "@/components/shared/Loading";
import { getApiErrorMessage } from "@/lib/apiError";

const GENRES = ["Semua", "Pop", "Rock", "K-Pop", "Festival", "EDM", "Jazz"];

export default function CustomerEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState("Semua");
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
      const matchesGenre =
        genre === "Semua" ||
        `${event.genre || ""} ${event.artists?.genre || ""}`.toLowerCase().includes(genre.toLowerCase());
      const matchesCity = city === "Semua Kota" || event.location.toLowerCase().includes(city.toLowerCase());
      return matchesQuery && matchesGenre && matchesCity;
    });
  }, [city, events, genre, query]);

  return (
    <div className="landing-page min-h-screen bg-[#f7f4fa] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#eeebf4] p-6 sm:p-10">
          <div className="absolute -right-10 -top-20 h-72 w-72 rounded-full bg-[#c8b7db]/60 blur-3xl" />
          <div className="absolute -bottom-36 right-1/4 h-64 w-64 rounded-full bg-[#fffdf2]/70 blur-3xl" />
          <div className="relative grid items-end gap-8 lg:grid-cols-[1fr_auto]">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">
                <CalendarDays className="h-4 w-4" /> Kalender konser
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                Pilih malam yang ingin kamu kenang.
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-[#5c6482]">
                Jadwal konser, lokasi, dan tiket resmi dalam satu katalog khusus untuk akunmu.
              </p>
            </div>
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 justify-self-start rounded-xl bg-[#071653] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#172b70] lg:justify-self-end"
            >
              <Ticket className="h-4 w-4 text-[#c8b7db]" /> Lihat pesananku
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="relative mt-8 flex flex-wrap gap-3 border-t border-[#c8b7db]/70 pt-5">
            <div className="flex items-center gap-2 rounded-xl bg-[#fffdf2] px-3.5 py-2 text-xs font-semibold text-[#071653]">
              <Ticket className="h-4 w-4 text-[#6264b5]" /> {events.length} jadwal tersedia
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-[#fffdf2] px-3.5 py-2 text-xs font-semibold text-[#071653]">
              <MapPin className="h-4 w-4 text-[#6264b5]" /> Berbagai kota di Indonesia
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-4 shadow-[0_12px_35px_-28px_rgba(7,22,83,.25)] sm:p-5">
          <div className="grid gap-3 md:grid-cols-[1fr_200px]">
            <label className="flex items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 focus-within:border-[#6264b5]">
              <Search className="h-4 w-4 text-[#6264b5]" />
              <span className="sr-only">Cari konser</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari nama konser, artis, atau venue"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8790a8]"
              />
            </label>
            <label className="flex items-center gap-2 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-3">
              <MapPin className="h-4 w-4 shrink-0 text-[#6264b5]" />
              <span className="sr-only">Pilih kota</span>
              <select value={city} onChange={(event) => setCity(event.target.value)} className="w-full bg-transparent py-3 text-sm outline-none">
                {cities.map((cityOption) => <option key={cityOption} value={cityOption}>{cityOption}</option>)}
              </select>
            </label>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
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
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">Temukan panggung</p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">{filteredEvents.length} konser cocok untukmu</h2>
            </div>
            {(query || genre !== "Semua" || city !== "Semua Kota") && (
              <button type="button" onClick={() => { setQuery(""); setGenre("Semua"); setCity("Semua Kota"); }} className="text-xs font-bold text-[#6264b5] hover:text-[#071653]">
                Hapus filter
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
