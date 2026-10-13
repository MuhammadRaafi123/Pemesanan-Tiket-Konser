"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Search,
  Ticket,
  SlidersHorizontal,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventGrid } from "@/features/events/components/EventGrid";
import { fetchEvents, MOCK_EVENTS } from "@/features/events/api";
import { Event } from "@/features/events/types";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/shared/Loading";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

type SortBy = "recommended" | "lowest" | "highest";

type EventsViewProps = {
  initialQuery: string;
};

function EventsView({ initialQuery }: EventsViewProps) {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [searchQuery, setSearchQuery] = useState<string>(initialQuery);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("recommended");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchEvents()
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);


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
        const artistMatch = e.artists?.name?.toLowerCase().includes(q);
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
    <div className="light-app min-h-screen bg-[#f4f8ff] text-[#102a43] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <ScrollReveal className="mb-10 text-center space-y-4">
          <Badge variant="gradient" className="gap-1.5">
            <Ticket className="h-3.5 w-3.5" />
            Jadwal Konser Resmi
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#102a43] tracking-tight">
            Eksplorasi Konser Musik
          </h1>
          <p className="max-w-xl mx-auto text-sm text-[#6683a3]">
            Temukan jadwal konser musisi lokal dan internasional terlengkap dengan tiket resmi terverifikasi.
          </p>
        </ScrollReveal>

        {/* Filter & Controls Bar */}
        <ScrollReveal className="mb-10 space-y-4 rounded-3xl border border-blue-100 bg-white p-5 backdrop-blur-2xl shadow-2xl">
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Search input */}
            <div className="sm:col-span-8 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2563eb]" />
              <input
                type="text"
                placeholder="Cari nama konser, artis, atau kota..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-blue-100 bg-blue-50/50 py-3 pl-11 pr-4 text-sm text-[#102a43] placeholder:text-[#8aa4c1] focus:border-blue-400 focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-4 relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="w-full rounded-2xl border border-blue-100 bg-white py-3 px-4 text-sm text-[#102a43] focus:border-blue-400 focus:outline-none cursor-pointer"
              >
                <option value="recommended">⭐ Urutkan: Rekomendasi</option>
                <option value="lowest">💵 Harga: Termurah</option>
                <option value="highest">💎 Harga: Termahal</option>
              </select>
            </div>

          </div>

          {/* Genre Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-blue-100">
            <span className="text-xs text-[#8aa4c1] mr-1 flex items-center gap-1">
              <SlidersHorizontal className="h-3 w-3 text-[#2563eb]" />
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
                      ? "border border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200"
                      : "border border-blue-100 bg-white text-[#6683a3] hover:bg-blue-50 hover:text-[#2563eb]"
                  }`}
                >
                  {g.label}
                </button>
              );
            })}
          </div>

        </ScrollReveal>

        {/* Results Info */}
        <div className="mb-6 flex items-center justify-between text-xs text-[#8aa4c1]">
          <span>Menampilkan <strong className="text-[#2563eb] font-bold">{filteredEvents.length}</strong> konser</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-[#2563eb] hover:underline"
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

function EventsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  return <EventsView key={initialQuery} initialQuery={initialQuery} />;
}
