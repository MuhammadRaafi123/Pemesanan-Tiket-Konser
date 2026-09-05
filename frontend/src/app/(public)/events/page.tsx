"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Sparkles, 
  Ticket, 
  Filter, 
  SlidersHorizontal, 
  ArrowUpDown, 
  Flame, 
  Zap, 
  Headphones,
  Music2
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents, MOCK_EVENTS } from "@/features/events/api";
import { Event } from "@/features/events/types";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/shared/Loading";

function EventsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"recommended" | "lowest" | "highest">("recommended");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEvents().then((data) => {
      setEvents(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [initialQuery]);

  const genres = [
    { id: "all", label: "Semua Genre" },
    { id: "rock", label: "Rock & Pop" },
    { id: "edm", label: "EDM & Festival" },
    { id: "jazz", label: "Jazz & Soul" },
  ];

  const filteredEvents = events
    .filter((e) => {
      // Search query filter
      const q = searchQuery.toLowerCase().trim();
      if (q) {
        const titleMatch = e.title.toLowerCase().includes(q);
        const artistMatch = e.artists?.name.toLowerCase().includes(q);
        const locMatch = e.location.toLowerCase().includes(q);
        const venueMatch = e.venue?.toLowerCase().includes(q);
        if (!titleMatch && !artistMatch && !locMatch && !venueMatch) return false;
      }

      // Genre filter
      if (selectedGenre !== "all") {
        if (selectedGenre === "rock" && !(e.genre?.toLowerCase().includes("rock") || e.genre?.toLowerCase().includes("pop"))) return false;
        if (selectedGenre === "edm" && !(e.genre?.toLowerCase().includes("edm") || e.genre?.toLowerCase().includes("electronic"))) return false;
        if (selectedGenre === "jazz" && !(e.genre?.toLowerCase().includes("jazz") || e.genre?.toLowerCase().includes("soul"))) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const priceA = a.ticket_categories?.length ? Math.min(...a.ticket_categories.map((tc) => tc.price)) : 0;
      const priceB = b.ticket_categories?.length ? Math.min(...b.ticket_categories.map((tc) => tc.price)) : 0;

      if (sortBy === "lowest") return priceA - priceB;
      if (sortBy === "highest") return priceB - priceA;
      return 0; // default recommended
    });

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-10 text-center space-y-4">
          <Badge variant="gradient" className="gap-1.5">
            <Ticket className="h-3.5 w-3.5" />
            Jadwal Konser Resmi
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Eksplorasi Konser Musik
          </h1>
          <p className="max-w-xl mx-auto text-sm text-white/60">
            Temukan jadwal konser musisi lokal dan internasional terlengkap dengan tiket resmi terverifikasi.
          </p>
        </div>

        {/* Filter & Controls Bar */}
        <div className="mb-10 space-y-4 rounded-3xl border border-white/10 bg-[#0f0f1c]/80 p-5 backdrop-blur-2xl shadow-2xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Search input */}
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-purple-400" />
              <input
                type="text"
                placeholder="Cari nama konser, artis, atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-white/35 focus:border-purple-500 focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-4 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-2xl border border-white/10 bg-[#161626] py-3 px-4 text-sm text-white focus:border-purple-500 focus:outline-none cursor-pointer"
              >
                <option value="recommended">⭐ Urutkan: Rekomendasi</option>
                <option value="lowest">💵 Harga: Termurah</option>
                <option value="highest">💎 Harga: Termahal</option>
              </select>
            </div>

          </div>

          {/* Genre Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/10">
            <span className="text-xs text-white/40 mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3 text-purple-400" />
              Genre:
            </span>
            {genres.map((g) => {
              const isSelected = selectedGenre === g.id;
              return (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.id)}
                  className={`rounded-full px-3.5 py-1 text-xs font-semibold transition-all ${
                    isSelected
                      ? "border border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-600/40"
                      : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

        </div>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between text-xs text-white/50">
          <span>Menampilkan <strong className="text-purple-300 font-bold">{filteredEvents.length}</strong> konser</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-purple-400 hover:underline"
            >
              Reset Pencarian
            </button>
          )}
        </div>

        {/* Events Grid */}
        {loading ? (
          <Loading message="Memuat daftar konser..." />
        ) : (
          <EventGrid events={filteredEvents} />
        )}

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <EventsContent />
    </Suspense>
  );
}
