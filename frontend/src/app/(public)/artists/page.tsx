"use client";

import React, { useState, useEffect } from "react";
import { Search, Mic2, Disc3 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { fetchPopularArtists } from "@/features/artists/api";
import { Artist } from "@/features/artists/types";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/shared/Loading";
import { EmptyState } from "@/components/shared/EmptyState";

export default function ArtistsPage() {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularArtists(20).then((data) => {
      setArtists(data);
      setLoading(false);
    });
  }, []);

  const filteredArtists = artists.filter((a) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      (a.genre && a.genre.toLowerCase().includes(q))
    );
  });

  return (
    <div className="light-app min-h-screen bg-[#f4f8ff] text-[#102a43] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-10 text-center space-y-4">
          <Badge variant="gradient" className="gap-1.5">
            <Mic2 className="h-3.5 w-3.5" />
            Daftar Musisi & Band
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-[#102a43] tracking-tight">
            Artis & Musisi Pilihan
          </h1>
          <p className="max-w-xl mx-auto text-sm text-[#6683a3]">
            Temukan musisi idola, dengarkan karya terbaik mereka, dan dapatkan tiket konser terdepan.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-10 mx-auto max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[#2563eb]" />
            <input
              type="text"
              placeholder="Cari nama artis atau genre musik..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-2xl border border-blue-100 bg-white py-3.5 pl-11 pr-4 text-sm text-[#102a43] placeholder:text-[#8aa4c1] focus:border-blue-400 focus:outline-none backdrop-blur-xl shadow-xl"
            />
          </div>
        </div>

        {/* Artists Grid */}
        {loading ? (
          <Loading message="Memuat data artis..." />
        ) : filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filteredArtists.map((artist, idx) => (
              <ArtistCard key={artist.id} artist={artist} index={idx} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Disc3}
            title="Artis Tidak Ditemukan"
            description="Tidak ada musisi yang cocok dengan pencarianmu."
            actionLabel="Reset Pencarian"
            onAction={() => setSearchQuery("")}
          />
        )}

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
