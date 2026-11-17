"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Mic2, Music, Radio } from "lucide-react";
import type { Artist } from "../types";
import { resolveMediaUrl } from "@/lib/media";
import { usePathname } from "next/navigation";

interface ArtistCardProps {
  artist: Artist;
  index?: number;
}

export function ArtistCard({ artist }: ArtistCardProps) {
  const pathname = usePathname();
  const artistHref = pathname.startsWith("/home/") ? `/home/artists/${artist.id}` : `/artists/${artist.id}`;
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-5 text-center transition-colors duration-200 hover:border-[#c8b7db] hover:shadow-[0_10px_28px_-20px_rgba(7,22,83,0.22)]">
      <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-full border border-[#e8e5ef] bg-[#f7f4fa]">
          <Image
            src={resolveMediaUrl(artist.photo || "/globe.svg")}
            alt={artist.name}
            fill
            sizes="112px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
      </div>

      <div className="mt-5 space-y-2">
        <span className="inline-flex max-w-full rounded-full bg-[#f7f4fa] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#6264b5]">
          {artist.genre || "Musisi"}
        </span>
        <h3 className="font-display text-xl leading-snug text-[#071653] transition-colors duration-200 group-hover:text-[#6264b5]">
          {artist.name}
        </h3>
        {artist.description ? (
          <p className="line-clamp-2 min-h-10 text-xs leading-5 text-[#5c6482]">{artist.description}</p>
        ) : null}
      </div>

      <dl className="mt-4 flex justify-center divide-x divide-[#e8e5ef] border-t border-[#eeecf2] pt-4 text-xs">
        <div className="flex-1 px-2">
          <dt className="flex items-center justify-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] text-[#5c6482]">
            <Radio className="h-3 w-3 text-[#6264b5]" />
            Pendengar
          </dt>
          <dd className="numeral mt-1 font-semibold text-[#071653]">{artist.monthlyListeners || "10M+"}</dd>
        </div>
        <div className="flex-1 px-2">
          <dt className="flex items-center justify-center gap-1 text-[0.6rem] uppercase tracking-[0.12em] text-[#5c6482]">
            <Music className="h-3 w-3 text-[#6264b5]" />
            Konser
          </dt>
          <dd className="numeral mt-1 font-semibold text-[#071653]">{artist.upcomingEventsCount || 1}</dd>
        </div>
      </dl>

      <Link
        href={artistHref}
        className="press mt-4 inline-flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold text-[#6264b5] transition-colors hover:bg-[#f7f4fa] hover:text-[#51539f]"
      >
        <Mic2 className="h-3.5 w-3.5" />
        Lihat jadwal
        <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </Link>
    </article>
  );
}

export default ArtistCard;
