"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  Sparkles, 
  Ticket, 
  Mic2, 
  Search, 
  Flame, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  QrCode, 
  CalendarDays, 
  MapPin, 
  ArrowRight, 
  Disc3, 
  Zap, 
  Headphones, 
  Award,
  Play
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventCard } from "@/features/events/components/EventCard";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { SoundVisualizer } from "@/components/shared/SoundVisualizer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchEvents, MOCK_EVENTS } from "@/features/events/api";
import { fetchArtists, MOCK_ARTISTS } from "@/features/artists/api";
import { Event } from "@/features/events/types";
import { Artist } from "@/features/artists/types";

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [selectedGenre, setSelectedGenre] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetchEvents().then(setEvents);
    fetchArtists().then(setArtists);
  }, []);

  const genres = [
    { id: "all", label: "🔥 Semua Konser", icon: Flame },
    { id: "rock", label: "🎸 Pop & Rock", icon: Sparkles },
    { id: "edm", label: "🎧 EDM & Festival", icon: Zap },
    { id: "jazz", label: "🎷 Jazz & Soul", icon: Headphones },
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedGenre === "all") return true;
    if (selectedGenre === "rock") return e.genre?.toLowerCase().includes("rock") || e.genre?.toLowerCase().includes("pop");
    if (selectedGenre === "edm") return e.genre?.toLowerCase().includes("edm") || e.genre?.toLowerCase().includes("electronic");
    if (selectedGenre === "jazz") return e.genre?.toLowerCase().includes("jazz") || e.genre?.toLowerCase().includes("soul");
    return true;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col selection:bg-purple-600 selection:text-white">
      <Navbar />

      <main className="flex-1 pt-24 sm:pt-28">
        
        {/* =========================================================
            HERO SECTION (High Impact, Animated Shimmer & Equalizer)
            ========================================================= */}
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-6 pb-20">
          
          {/* Ambient Glowing Meshes */}
          <div className="pointer-events-none absolute top-10 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[radial-gradient(circle_at_50%_30%,rgba(139,92,246,0.22),transparent_60%),radial-gradient(circle_at_80%_60%,rgba(6,182,212,0.15),transparent_50%)] blur-2xl" />
          
          {/* Background Grid Pattern */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:48px_48px]" />

          <div className="relative mx-auto max-w-5xl text-center space-y-8">
            
            {/* Top Pill & Soundwave */}
            <div className="inline-flex items-center gap-3 rounded-full border border-purple-500/30 bg-purple-950/40 px-4 py-1.5 backdrop-blur-xl shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400" />
              <span className="text-xs font-bold text-purple-200">
                Tiket Konser Musim 2026 Resmi Dibuka
              </span>
              <span className="hidden sm:inline text-white/30">•</span>
              <span className="hidden sm:inline text-xs text-cyan-300 font-semibold">
                100% Garansi Resmi
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.1] text-white">
              Rasakan Getaran Panggung{" "}
              <span className="text-shimmer block mt-1">
                Konser Spektakuler
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mx-auto max-w-2xl text-base sm:text-lg text-white/60 leading-relaxed">
              Jelajahi konser artis favoritmu, pilih tempat duduk VIP terbaik, dan nikmati kemudahan e-tiket instan dengan teknologi QR terverifikasi.
            </p>

            {/* Interactive Search Bar */}
            <div className="mx-auto max-w-2xl">
              <form
                onSubmit={handleSearchSubmit}
                className="relative flex items-center rounded-3xl border border-purple-500/30 bg-[#121220]/90 p-2 shadow-[0_10px_35px_-10px_rgba(139,92,246,0.35)] backdrop-blur-2xl transition-all duration-300 focus-within:border-purple-400 focus-within:shadow-[0_10px_45px_-5px_rgba(168,85,247,0.5)]"
              >
                <div className="flex items-center pl-4 text-purple-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Cari nama konser, artis, atau kota (contoh: Coldplay, Sheila on 7)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-4 py-2.5 text-sm sm:text-base text-white placeholder:text-white/35 focus:outline-none"
                />
                <Button type="submit" variant="glow" size="default" className="rounded-2xl shrink-0 gap-1.5 px-6">
                  <Sparkles className="h-4 w-4 text-cyan-300" />
                  <span className="hidden sm:inline">Cari Tiket</span>
                </Button>
              </form>
            </div>

            {/* Quick Filter Genre Chips */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
              {genres.map((g) => {
                const isSelected = selectedGenre === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGenre(g.id)}
                    className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? "border border-purple-400 bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)] scale-105"
                        : "border border-white/10 bg-white/5 text-white/70 hover:border-white/20 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span>{g.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Stats Counter Bar (Full Icon & Animated) */}
            <div className="pt-8 grid grid-cols-2 gap-4 sm:grid-cols-4 max-w-4xl mx-auto">
              
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-xl transition hover:border-purple-500/30 hover:bg-white/[0.05]">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
                  <Mic2 className="h-4 w-4" />
                </div>
                <p className="text-2xl font-black text-white">50+</p>
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Top Artis</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-xl transition hover:border-cyan-500/30 hover:bg-white/[0.05]">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400">
                  <Ticket className="h-4 w-4" />
                </div>
                <p className="text-2xl font-black text-cyan-300">100K+</p>
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Tiket Terjual</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-xl transition hover:border-pink-500/30 hover:bg-white/[0.05]">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-pink-600/20 text-pink-400">
                  <Zap className="h-4 w-4" />
                </div>
                <p className="text-2xl font-black text-pink-300">99.9%</p>
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Instan E-Ticket</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-center backdrop-blur-xl transition hover:border-amber-500/30 hover:bg-white/[0.05]">
                <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-amber-600/20 text-amber-400">
                  <Award className="h-4 w-4" />
                </div>
                <p className="text-2xl font-black text-amber-300">4.9 / 5</p>
                <p className="text-[11px] font-semibold text-white/50 uppercase tracking-wider">Rating Penonton</p>
              </div>

            </div>

          </div>

        </section>

        {/* =========================================================
            FEATURED EVENTS (Spotlight 3D Cards)
            ========================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-12 max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-widest mb-1">
                <Flame className="h-4 w-4 text-amber-400" />
                Sedang Tren & Populer
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Konser Unggulan Musim Ini
              </h2>
            </div>

            <Link href="/events">
              <Button variant="outline" size="sm" className="gap-2">
                <span>Lihat Semua Konser</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((evt, idx) => (
              <EventCard key={evt.id} event={evt} index={idx} />
            ))}
          </div>

        </section>

        {/* =========================================================
            TOP ARTISTS SHOWCASE (Rotating Vinyl Hover)
            ========================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 max-w-7xl mx-auto">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-1">
                <Disc3 className="h-4 w-4 text-cyan-400" />
                Lineup Pilihan
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Artis & Musisi Terfavorit
              </h2>
            </div>

            <Link href="/artists">
              <Button variant="outline" size="sm" className="gap-2">
                <span>Semua Artis</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {artists.slice(0, 5).map((art, idx) => (
              <ArtistCard key={art.id} artist={art} index={idx} />
            ))}
          </div>

        </section>

        {/* =========================================================
            HOLOGRAPHIC TICKET EXPERIENCE SHOWCASE
            ========================================================= */}
        <section className="relative px-4 sm:px-6 lg:px-8 py-16 overflow-hidden">
          
          <div className="relative mx-auto max-w-7xl rounded-3xl border border-purple-500/30 bg-gradient-to-br from-purple-950/40 via-[#0e0e18] to-cyan-950/30 p-8 sm:p-12 shadow-2xl backdrop-blur-2xl">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-6">
                <Badge variant="gradient" className="gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  E-Ticket Anti Ribet & Anti Calo
                </Badge>

                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  Tiket Digital Hologram Langsung Masuk Smartphone
                </h2>

                <p className="text-sm sm:text-base text-white/70 leading-relaxed">
                  Tidak perlu antre cetak tiket fisik atau takut tertipu calo. Setiap pesanan tiket Concertix dilengkapi QR Code dinamis dan kode tiket unik terenkripsi yang langsung siap discan di pintu gate venue.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 shrink-0">
                      <QrCode className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">Scan Instan Gate</p>
                      <p className="text-[11px] text-white/50">Masuk venue dalam hitungan detik</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 shrink-0">
                      <ShieldCheck className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white">100% Terverifikasi</p>
                      <p className="text-[11px] text-white/50">Bebas duplikasi & scalper</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <Link href="/events">
                    <Button variant="glow" size="lg" className="gap-2">
                      <Ticket className="h-4 w-4 text-cyan-300" />
                      Mulai Pesan Tiket Sekarang
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Ticket Mockup Preview */}
              <div className="lg:col-span-5 flex justify-center">
                <div className="relative w-full max-w-sm rounded-3xl border border-purple-400/40 bg-[#0d0d1a] p-6 shadow-[0_20px_60px_rgba(168,85,247,0.35)]">
                  <div className="h-1.5 w-full hologram-strip mb-4 rounded-full" />
                  
                  <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                    <span className="text-[10px] font-bold text-purple-400 uppercase">VIP ACCESS PASS</span>
                    <Badge variant="success" className="text-[10px] py-0">VALID</Badge>
                  </div>

                  <h4 className="font-bold text-white text-base">Coldplay: Music of the Spheres</h4>
                  <p className="text-xs text-white/50">GBK Stadium, Jakarta</p>

                  <div className="my-4 rounded-2xl bg-white p-3 flex flex-col items-center justify-center relative overflow-hidden">
                    <div className="relative h-32 w-32">
                      <Image
                        src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=CONCERTIX-PREVIEW-PASS"
                        alt="QR Ticket Preview"
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="absolute left-0 right-0 h-1 bg-cyan-400 shadow-[0_0_10px_#22d3ee]" />
                  </div>

                  <div className="flex justify-between text-xs text-white/60">
                    <span>Zona: VIP Infinity</span>
                    <span className="font-mono text-purple-300 font-bold">CTX-99482</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </section>

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
