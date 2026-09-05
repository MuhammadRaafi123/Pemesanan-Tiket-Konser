"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mic2, Music, Disc3, ArrowRight, Sparkles, Radio } from "lucide-react";
import { Artist } from "../types";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ArtistCardProps {
  artist: Artist;
  index?: number;
}

export function ArtistCard({ artist, index = 0 }: ArtistCardProps) {
  const delayClass = [
    "delay-100",
    "delay-200",
    "delay-300",
    "delay-400",
    "delay-500",
  ][index % 5];

  return (
    <div className={`${delayClass}`}>
      <CardSpotlight
        spotlightColor="rgba(6, 182, 212, 0.2)"
        className="group relative overflow-hidden border-white/10 bg-[#0d0d18]/90 p-6 text-center hover:border-cyan-500/40 hover:shadow-[0_15px_40px_-10px_rgba(6,182,212,0.3)] transition-all duration-300"
      >
        {/* Hologram Vinyl Disc & Avatar Container */}
        <div className="relative mx-auto mb-5 h-32 w-32">
          
          {/* Background Rotating Vinyl Disc (Slides out on hover) */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full border border-white/15 bg-black flex items-center justify-center transition-all duration-500 group-hover:translate-x-6 group-hover:rotate-180 opacity-75 group-hover:opacity-100 shadow-xl">
            <div className="h-12 w-12 rounded-full border-2 border-purple-500 bg-zinc-900 flex items-center justify-center">
              <Disc3 className="h-6 w-6 text-cyan-400" />
            </div>
          </div>

          {/* Front Glowing Avatar */}
          <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border-2 border-purple-500/50 bg-zinc-900 shadow-[0_0_20px_rgba(168,85,247,0.3)] group-hover:border-cyan-400 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.5)] transition-all duration-300">
            <Image
              src={artist.photo || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop"}
              alt={artist.name}
              fill
              sizes="128px"
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>

        </div>

        {/* Info */}
        <div className="space-y-2">
          <Badge variant="gradient" className="text-[10px] py-0.5 px-2.5">
            <Sparkles className="h-2.5 w-2.5" />
            {artist.genre || "Musisi Populer"}
          </Badge>

          <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
            {artist.name}
          </h3>

          <p className="text-xs text-white/55 line-clamp-2 leading-relaxed">
            {artist.description}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-white/10 pt-4 text-xs">
          <div className="rounded-xl bg-white/[0.03] p-2">
            <div className="flex items-center justify-center gap-1 text-[10px] text-white/40">
              <Radio className="h-3 w-3 text-cyan-400" />
              Pendengar
            </div>
            <p className="mt-0.5 font-bold text-white">{artist.monthlyListeners || "10M+"}</p>
          </div>

          <div className="rounded-xl bg-white/[0.03] p-2">
            <div className="flex items-center justify-center gap-1 text-[10px] text-white/40">
              <Music className="h-3 w-3 text-purple-400" />
              Konser
            </div>
            <p className="mt-0.5 font-bold text-white">{artist.upcomingEventsCount || 1} Jadwal</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Link href={`/artists/${artist.id}`}>
            <Button variant="secondary" size="sm" className="w-full gap-1.5 group-hover:border-cyan-500/40 group-hover:bg-cyan-950/30 group-hover:text-cyan-200">
              <Mic2 className="h-3.5 w-3.5 text-cyan-400" />
              Lihat Jadwal Konser
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardSpotlight>
    </div>
  );
}
export default ArtistCard;
