"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Mic2, 
  Radio, 
  Music, 
  Sparkles, 
  CalendarDays, 
  ChevronLeft,
  Share2
} from "lucide-react";
import { Artist } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventCard } from "@/features/events/components/EventCard";
import { useToast } from "@/components/shared/ToastProvider";

interface ArtistInfoProps {
  artist: Artist;
}

export function ArtistInfo({ artist }: ArtistInfoProps) {
  const { success } = useToast();

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("Tautan profil artis berhasil disalin!");
    }
  };

  return (
    <div className="space-y-12">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0c0c16] p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
        
        {/* Ambient Blur */}
        <div className="absolute top-0 right-0 h-96 w-96 rounded-full bg-cyan-600/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-8">
          <Link href="/artists">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <ChevronLeft className="h-4 w-4" />
              Semua Artis
            </Button>
          </Link>

          <Button
            onClick={handleShare}
            variant="secondary"
            size="icon"
            className="rounded-xl h-9 w-9"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-8">
          
          <div className="relative h-44 w-44 shrink-0 overflow-hidden rounded-full border-4 border-purple-500/40 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <Image
              src={artist.photo || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop"}
              alt={artist.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="space-y-4 text-center md:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <Badge variant="gradient" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {artist.genre || "Musisi"}
              </Badge>
              <Badge variant="cyan" className="gap-1">
                <Radio className="h-3 w-3" />
                {artist.monthlyListeners || "10M+"} Pendengar Bulanan
              </Badge>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              {artist.name}
            </h1>

            <p className="max-w-2xl text-sm leading-relaxed text-white/70">
              {artist.description}
            </p>
          </div>

        </div>

      </div>

      {/* Upcoming Concerts for this artist */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white flex items-center gap-2.5">
              <CalendarDays className="h-6 w-6 text-purple-400" />
              Jadwal Konser {artist.name}
            </h2>
            <p className="text-xs text-white/50 mt-1">
              Beli tiket resmi sebelum kehabisan kuota panggung terdepan.
            </p>
          </div>
        </div>

        {artist.events && artist.events.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {artist.events.map((evt, idx) => (
              <EventCard key={evt.id} event={evt} index={idx} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center text-sm text-white/50">
            Saat ini belum ada konser mendatang yang diumumkan untuk {artist.name}.
          </div>
        )}
      </div>

    </div>
  );
}
export default ArtistInfo;
