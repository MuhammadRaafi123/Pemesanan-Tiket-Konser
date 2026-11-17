"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronRight, MapPin, Star, Ticket } from "lucide-react";
import type { Event } from "../types";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { usePathname } from "next/navigation";

interface EventCardProps {
  event: Event;
  index?: number;
}

const GENRE_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  kpop: { bg: "bg-[#c8b7db]/30", text: "text-[#6264b5]", border: "border-[#c8b7db]" },
  "k-pop": { bg: "bg-[#c8b7db]/30", text: "text-[#6264b5]", border: "border-[#c8b7db]" },
  rock: { bg: "bg-[#f4e3df]", text: "text-[#9a564b]", border: "border-[#e8c7c1]" },
  indie: { bg: "bg-[#f4e3df]", text: "text-[#9a564b]", border: "border-[#e8c7c1]" },
  festival: { bg: "bg-[#e6f1eb]", text: "text-[#397557]", border: "border-[#c7e0d1]" },
  edm: { bg: "bg-[#eeebf4]", text: "text-[#6264b5]", border: "border-[#c8b7db]" },
  electronic: { bg: "bg-[#eeebf4]", text: "text-[#6264b5]", border: "border-[#c8b7db]" },
  jazz: { bg: "bg-[#f8f0df]", text: "text-[#8b6a2c]", border: "border-[#ead9ad]" },
  pop: { bg: "bg-[#e6eefb]", text: "text-[#3156ad]", border: "border-[#cad8f3]" },
};

export function EventCard({ event }: EventCardProps) {
  const pathname = usePathname();
  const eventHref = pathname.startsWith("/home/") ? `/home/events/${event.id}` : `/events/${event.id}`;
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
    : { bg: "bg-[#eeebf4]", text: "text-[#6264b5]", border: "border-[#c8b7db]" };

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] transition-all duration-200 hover:-translate-y-1 hover:border-[#c8b7db] hover:shadow-[0_10px_28px_-20px_rgba(7,22,83,0.22)]">
      <Link href={eventHref} className="flex h-full flex-col">
        {/* Poster Header */}
        <div className="relative h-48 overflow-hidden bg-[#eeebf4]">
          {poster ? (
            <Image
              src={poster}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105 zoom-media"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#eeebf4] to-[#e4dfed] text-[#c8b7db]">
              <Ticket className="h-14 w-14 opacity-50" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#071653]/60 via-transparent to-[#071653]/10" />

          {/* Top Left Status Badge */}
          <div className="absolute left-3.5 top-3.5 flex flex-wrap items-center gap-1.5">
            {isOpen ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#397557]/90 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                Tiket Tersedia
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#071653]/75 px-2.5 py-1 text-[10px] font-semibold text-white/90 backdrop-blur">
                <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                Penjualan Ditutup
              </span>
            )}

            {event.featured ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#fffdf2] px-2.5 py-1 text-[10px] font-bold text-[#6264b5] backdrop-blur">
                <Star className="h-3 w-3 fill-[#6264b5] text-[#6264b5]" />
                Pilihan
              </span>
            ) : null}
          </div>

          {/* Top Right Remaining Tickets Pill */}
          {event.total_remaining !== undefined && event.total_remaining !== null ? (
            <div className="absolute right-3.5 top-3.5">
              <span className="rounded-full bg-[#071653]/75 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur">
                Sisa {event.total_remaining} Tiket
              </span>
            </div>
          ) : null}

          {/* Bottom Poster Info Pill: Date & City */}
          <div className="absolute inset-x-3.5 bottom-3.5 flex items-center justify-between gap-2 text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5 rounded-lg bg-[#071653]/75 px-2.5 py-1.5 font-medium text-white backdrop-blur">
              <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#d5baff]" />
              <span className="truncate">
                {formatEventDate(event.event_date, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </span>

            <span className="flex max-w-[50%] min-w-0 items-center gap-1.5 rounded-lg bg-[#071653]/75 px-2.5 py-1.5 font-medium text-white backdrop-blur">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#d5baff]" />
              <span className="truncate">{event.location}</span>
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="flex flex-1 flex-col gap-3 p-4">
          {/* Artist & Genre */}
          <div>
            <div className="flex items-center justify-between gap-2">
              <p className="truncate text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
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
            <h3 className="mt-1 line-clamp-2 text-base font-bold leading-snug text-[#071653] transition-colors group-hover:text-[#6264b5]">
              {event.title}
            </h3>

            {/* Venue & Location */}
            <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-[#5c6482]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6264b5]" />
              <span className="truncate">{event.venue || event.location}</span>
            </p>
          </div>

          {/* Ticket Category Pills */}
          {event.ticket_categories && event.ticket_categories.length > 0 ? (
            <div className="flex flex-wrap gap-1.5 pt-1">
              {event.ticket_categories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className="rounded-md border border-[#e8e5ef] bg-[#f7f4fa] px-2 py-0.5 text-[10px] font-semibold text-[#5c6482] transition-colors group-hover:border-[#c8b7db] group-hover:text-[#071653]"
                >
                  {category.category_name}
                </span>
              ))}
              {event.ticket_categories.length > 3 ? (
                <span className="rounded-md border border-[#c8b7db] bg-[#f7f4fa] px-1.5 py-0.5 text-[10px] font-bold text-[#6264b5]">
                  +{event.ticket_categories.length - 3}
                </span>
              ) : null}
            </div>
          ) : null}

          {/* Price & Action Button Footer */}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#eeecf2] pt-3">
            <div>
              <span className="text-[9px] font-bold uppercase tracking-widest text-[#5c6482]">
                Harga Mulai
              </span>
              <p className="text-base font-bold text-[#6264b5]">
                {lowestPrice !== null ? formatCurrency(lowestPrice) : "Lihat Jadwal"}
              </p>
            </div>

            <span className="press inline-flex items-center gap-1.5 rounded-lg bg-[#6264b5] px-3 py-2 text-xs font-semibold text-white transition-colors group-hover:bg-[#51539f]">
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
