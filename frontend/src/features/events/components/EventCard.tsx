"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronRight, MapPin, Sparkles, Star, Ticket } from "lucide-react";
import type { Event } from "../types";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

interface EventCardProps {
  event: Event;
  index?: number;
}

const GENRE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  kpop: { bg: "bg-pink-500/15", text: "text-pink-300", border: "border-pink-500/30" },
  "k-pop": { bg: "bg-pink-500/15", text: "text-pink-300", border: "border-pink-500/30" },
  rock: { bg: "bg-orange-500/15", text: "text-orange-300", border: "border-orange-500/30" },
  indie: { bg: "bg-orange-500/15", text: "text-orange-300", border: "border-orange-500/30" },
  festival: { bg: "bg-emerald-500/15", text: "text-emerald-300", border: "border-emerald-500/30" },
  edm: { bg: "bg-purple-500/15", text: "text-purple-300", border: "border-purple-500/30" },
  electronic: { bg: "bg-purple-500/15", text: "text-purple-300", border: "border-purple-500/30" },
  jazz: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  pop: { bg: "bg-sky-500/15", text: "text-sky-300", border: "border-sky-500/30" },
};

export function EventCard({ event }: EventCardProps) {
  const isOpen = event.status === "open";
  const lowestPrice = event.ticket_categories?.length
    ? Math.min(...event.ticket_categories.map((category) => category.price))
    : event.min_price ?? null;
  const poster = resolveMediaUrl(event.poster || "");

  // Genre detection
  const rawGenre = (event.genre || event.artists?.genre || "").toLowerCase();
  const matchedKey = Object.keys(GENRE_STYLES).find((key) => rawGenre.includes(key));
  const genreStyle = matchedKey
    ? GENRE_STYLES[matchedKey]
    : { bg: "bg-[#ffb703]/15", text: "text-[#ffdea9]", border: "border-[#ffb703]/30" };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#262a38] bg-[#14161f] shadow-xl shadow-black/40 transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ffb703]/50 hover:shadow-2xl hover:shadow-[#ffb703]/10 hover-sheen">
      <Link href={`/events/${event.id}`} className="flex h-full flex-col">
        {/* Poster Header */}
        <div className="relative h-56 overflow-hidden bg-[#181a24]">
          {poster ? (
            <Image
              src={poster}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 zoom-media"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1a1d27] text-[#ffb703]">
              <Ticket className="h-14 w-14 opacity-50" />
            </div>
          )}

          {/* Deep Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14161f] via-[#14161f]/25 to-black/35" />

          {/* Top Left Status Badge */}
          <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
            {isOpen ? (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/40 bg-emerald-500/90 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-white shadow-lg shadow-emerald-950/40 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                Tiket Tersedia
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#0b0e15]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#c4c5cc] backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-[#8a8d98]" />
                Penjualan Ditutup
              </span>
            )}

            {event.featured ? (
              <span className="inline-flex items-center gap-1 rounded-lg border border-[#ffb703]/50 bg-gradient-to-r from-[#ffb703] to-[#ff9f00] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#10131a] shadow-lg shadow-[#ffb703]/25 backdrop-blur">
                <Star className="h-3 w-3 fill-[#10131a] text-[#10131a]" />
                Pilihan
              </span>
            ) : null}
          </div>

          {/* Top Right Remaining Tickets Pill */}
          {event.total_remaining !== undefined && event.total_remaining !== null ? (
            <div className="absolute right-3.5 top-3.5">
              <span className="rounded-lg border border-white/15 bg-[#0b0e15]/85 px-2.5 py-1 text-[10px] font-bold text-[#ffdea9] backdrop-blur shadow-md">
                Sisa {event.total_remaining} Tiket
              </span>
            </div>
          ) : null}

          {/* Bottom Poster Info Pill: Date & City */}
          <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-2 text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5 rounded-lg border border-white/10 bg-[#0b0e15]/90 px-2.5 py-1.5 font-semibold text-white backdrop-blur shadow-md">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#ffb703]" />
              <span className="truncate">
                {formatEventDate(event.event_date, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </span>

            <span className="flex max-w-[50%] min-w-0 items-center gap-1.5 rounded-lg border border-white/10 bg-[#0b0e15]/90 px-2.5 py-1.5 font-semibold text-[#d5baff] backdrop-blur shadow-md">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ffb703]" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
        </div>

        {/* Perforated Stub Connector */}
        <div className="relative z-10 -my-2.5 flex items-center justify-between px-2.5">
          <span className="h-5 w-5 rounded-full bg-[#0b0e15] ring-2 ring-[#262a38] transition-colors group-hover:ring-[#ffb703]/40" />
          <span className="h-0 flex-1 border-t-2 border-dashed border-[#2a2d36]" />
          <span className="h-5 w-5 rounded-full bg-[#0b0e15] ring-2 ring-[#262a38] transition-colors group-hover:ring-[#ffb703]/40" />
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col gap-3 p-5 pt-3">
          {/* Artist & Genre */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[11px] font-bold uppercase tracking-wider text-[#d5baff]">
                {event.artist_names?.join(", ") || event.artists?.name || "Live Experience"}
              </p>
              {event.genre ? (
                <span
                  className={`rounded-md border px-2 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
                >
                  {event.genre}
                </span>
              ) : null}
            </div>

            {/* Concert Title */}
            <h3 className="mt-1 line-clamp-1 text-lg font-black text-white transition-colors group-hover:text-[#ffb703]">
              {event.title}
            </h3>

            {/* Venue & Location */}
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#b2b4bd]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ffb703]" />
              <span className="truncate">{event.venue || event.location}</span>
            </p>
          </div>

          {/* Ticket Category Pills */}
          {event.ticket_categories && event.ticket_categories.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.ticket_categories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className="rounded-md border border-[#2a2d36] bg-[#1a1d27] px-2 py-0.5 text-[10px] font-semibold text-[#8a8d98] transition-colors group-hover:border-[#ffb703]/20 group-hover:text-[#e1e2ec]"
                >
                  {category.category_name}
                </span>
              ))}
              {event.ticket_categories.length > 3 ? (
                <span className="rounded-md border border-[#2a2d36] bg-[#1a1d27] px-1.5 py-0.5 text-[10px] font-bold text-[#ffb703]">
                  +{event.ticket_categories.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Price & Action Button Footer */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#262a38] pt-3.5">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#8a8d98]">
                Harga Mulai
              </span>
              <p className="text-lg font-black text-[#ffb703] drop-shadow-[0_2px_8px_rgba(255,183,3,0.25)]">
                {lowestPrice !== null ? formatCurrency(lowestPrice) : "Lihat Jadwal"}
              </p>
            </div>

            <span className="press inline-flex items-center gap-1.5 rounded-xl bg-[#ffb703] px-4 py-2 text-xs font-black text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all group-hover:bg-[#ffdea9] group-hover:shadow-[#ffb703]/40">
              <span>Beli Tiket</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default EventCard;
