"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mic2, Music, Disc3, ArrowRight, Sparkles, Radio } from "lucide-react";
import { Artist } from "../types";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { resolveMediaUrl } from "@/lib/media";
import { ScrollReveal } from "@/components/shared/ScrollReveal";

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
    <ScrollReveal delay={(index % 5) * 80} className={delayClass}>
      <CardSpotlight
        spotlightColor="rgba(37, 99, 235, 0.14)"
        className="group relative overflow-hidden border-blue-100 bg-white p-6 text-center hover:border-blue-300 hover:shadow-[0_15px_40px_-18px_rgba(37,99,235,0.35)] transition-all duration-300"
      >
        {/* Hologram Vinyl Disc & Avatar Container */}
        <div className="relative mx-auto mb-5 h-32 w-32">
          
          {/* Background Rotating Vinyl Disc (Slides out on hover) */}
          <div className="absolute top-0 right-0 h-32 w-32 rounded-full border-blue-200 bg-blue-50 flex items-center justify-center transition-all duration-500 group-hover:translate-x-6 group-hover:rotate-180 opacity-75 group-hover:opacity-100 shadow-xl">
            <div className="h-12 w-12 rounded-full border-2 border-blue-500 bg-blue-50 flex items-center justify-center">
              <Disc3 className="h-6 w-6 text-[#2563eb]" />
            </div>
          </div>

          {/* Front Glowing Avatar */}
          <div className="relative z-10 h-32 w-32 overflow-hidden rounded-full border-2 border-blue-500/50 bg-blue-50 shadow-[0_12px_28px_-18px_rgba(37,99,235,.5)] group-hover:border-blue-400 group-hover:shadow-[0_16px_32px_-16px_rgba(37,99,235,.55)] transition-all duration-300">
            <Image
              src={resolveMediaUrl(artist.photo || "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=400&auto=format&fit=crop")}
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

          <h3 className="text-lg font-bold text-[#123b6d] group-hover:text-[#2563eb] transition-colors">
            {artist.name}
          </h3>

          <p className="text-xs text-[#6683a3] line-clamp-2 leading-relaxed">
            {artist.description}
          </p>
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-2 gap-2 border-t border-blue-100 pt-4 text-xs">
          <div className="rounded-xl bg-blue-50 p-2">
            <div className="flex items-center justify-center gap-1 text-[10px] text-[#8aa4c1]">
              <Radio className="h-3 w-3 text-[#2563eb]" />
              Pendengar
            </div>
            <p className="mt-0.5 font-bold text-[#123b6d]">{artist.monthlyListeners || "10M+"}</p>
          </div>

          <div className="rounded-xl bg-blue-50 p-2">
            <div className="flex items-center justify-center gap-1 text-[10px] text-[#8aa4c1]">
              <Music className="h-3 w-3 text-[#2563eb]" />
              Konser
            </div>
            <p className="mt-0.5 font-bold text-[#123b6d]">{artist.upcomingEventsCount || 1} Jadwal</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="mt-5">
          <Link href={`/artists/${artist.id}`}>
            <Button variant="secondary" size="sm" className="w-full gap-1.5 group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:text-[#1d4ed8]">
              <Mic2 className="h-3.5 w-3.5 text-[#2563eb]" />
              Lihat Jadwal Konser
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </CardSpotlight>
    </ScrollReveal>
  );
}
export default ArtistCard;
