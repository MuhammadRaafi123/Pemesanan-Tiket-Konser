"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Disc3, Mic2, Music, Radio } from "lucide-react";
import type { Artist } from "../types";
import { resolveMediaUrl } from "@/lib/media";

interface ArtistCardProps {
  artist: Artist;
  index?: number;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-5 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ffb703]/30 hover:shadow-2xl hover:shadow-black/40 hover-sheen">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-[#ffb703]/[0.06] blur-2xl transition-all duration-700 group-hover:bg-[#ffb703]/[0.12]"
      />

      <div className="relative mx-auto h-32 w-32">
        <span
          aria-hidden
          className="absolute inset-0 rounded-full border border-dashed border-[#ffb703]/30 transition-transform duration-[900ms] group-hover:rotate-[24deg]"
        />
        <div className="relative h-32 w-32 overflow-hidden rounded-full border border-[#2a2d36] bg-[#1e2128] shadow-[0_20px_40px_-24px_rgba(0,0,0,.8)]">
          <Image
            src={resolveMediaUrl(artist.photo || "/globe.svg")}
            alt={artist.name}
            fill
            sizes="128px"
            className="zoom-media object-cover grayscale-[15%] transition-[filter] duration-700 group-hover:grayscale-0"
          />
        </div>
        <span className="absolute -bottom-1 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full border border-[#2a2d36] bg-[#191b23] text-[#ffb703] shadow-lg shadow-black/30 transition-transform duration-500 group-hover:scale-110">
          <Disc3 className="h-3.5 w-3.5" />
        </span>
      </div>

      <div className="mt-6 space-y-2">
        <span className="inline-flex rounded-full border border-[#ffb703]/20 bg-[#ffb703]/[0.08] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#ffdea9]">
          {artist.genre || "Musisi"}
        </span>
        <h3 className="font-display text-xl leading-snug text-[#e1e2ec] transition-colors duration-300 group-hover:text-[#ffb703]">
          {artist.name}
        </h3>
        {artist.description ? (
          <p className="line-clamp-2 text-xs leading-6 text-[#8a8d98]">{artist.description}</p>
        ) : null}
      </div>

      <dl className="mt-6 grid grid-cols-2 gap-2 border-t border-[#2a2d36] pt-5 text-xs">
        <div className="rounded-xl border border-[#2a2d36] bg-[#1e2128] p-3">
          <dt className="flex items-center justify-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] text-[#8a8d98]">
            <Radio className="h-3 w-3 text-[#ffb703]" />
            Pendengar
          </dt>
          <dd className="numeral mt-1 text-sm text-[#e1e2ec]">{artist.monthlyListeners || "10M+"}</dd>
        </div>
        <div className="rounded-xl border border-[#2a2d36] bg-[#1e2128] p-3">
          <dt className="flex items-center justify-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] text-[#8a8d98]">
            <Music className="h-3 w-3 text-[#ffb703]" />
            Konser
          </dt>
          <dd className="numeral mt-1 text-sm text-[#e1e2ec]">{artist.upcomingEventsCount || 1}</dd>
        </div>
      </dl>

      <Link
        href={`/artists/${artist.id}`}
        className="press mt-6 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition-colors hover:text-[#ffdea9]"
      >
        <Mic2 className="h-3.5 w-3.5" />
        Lihat jadwal
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}

export default ArtistCard;
