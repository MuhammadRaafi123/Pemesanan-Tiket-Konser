"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, ChevronRight, MapPin, Sparkles, Ticket } from "lucide-react";
import type { Event } from "../types";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event }: EventCardProps) {
  const isOpen = event.status === "open";
  const lowestPrice = event.ticket_categories?.length
    ? Math.min(...event.ticket_categories.map((category) => category.price))
    : null;
  const poster = resolveMediaUrl(event.poster || "");

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ffb703]/30 hover:shadow-2xl hover:shadow-black/50 hover-sheen">
      <Link href={`/events/${event.id}`} className="flex h-full flex-col">
        <div className="relative h-52 overflow-hidden bg-[#1e2128]">
          {poster ? (
            <Image
              src={poster}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105 zoom-media"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Ticket className="h-12 w-12 text-[#2a2d36]" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#191b23] to-transparent" />

          <div className="absolute left-3 top-3">
            <span
              className={`inline-flex items-center gap-1.5 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                isOpen
                  ? "bg-[#ffb703] text-[#10131a]"
                  : "border border-white/15 bg-[#0b0e15]/85 text-[#c4c5cc]"
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "bg-[#10131a]" : "bg-[#8a8d98]"}`} />
              {isOpen ? "Tiket tersedia" : "Penjualan ditutup"}
            </span>
          </div>
          {event.featured ? (
            <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded border border-[#ffb703]/30 bg-[#0b0e15]/85 px-2.5 py-1 text-[10px] font-semibold text-[#ffdea9] backdrop-blur">
              <Sparkles className="h-3 w-3 text-[#ffb703]" />
              Unggulan
            </span>
          ) : null}

          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 text-[11px]">
            <span className="flex min-w-0 items-center gap-1.5 rounded bg-[#272a32]/90 px-2.5 py-1 text-[#e1e2ec]">
              <CalendarDays className="h-3 w-3 shrink-0 text-[#ffb703]" />
              <span className="truncate">
                {formatEventDate(event.event_date, { day: "numeric", month: "short", year: "numeric" })}
              </span>
            </span>
            <span className="max-w-[55%] truncate rounded bg-[#272a32]/90 px-2.5 py-1 text-[#e1e2ec]">
              {event.location}
            </span>
          </div>
        </div>

        <div className="relative z-10 -my-2 flex items-center justify-between px-3">
          <span className="h-4 w-4 rounded-full bg-[#0b0e15] ring-2 ring-[#232733]" />
          <span className="h-0 flex-1 border-t-2 border-dashed border-[#2a2d36]" />
          <span className="h-4 w-4 rounded-full bg-[#0b0e15] ring-2 ring-[#232733]" />
        </div>

        <div className="flex flex-1 flex-col gap-2.5 p-4 pt-1.5">
          <div>
            <p className="truncate text-[10px] uppercase tracking-wider text-[#d5baff]">
              {event.artist_names?.join(", ") || event.artists?.name || "Live Experience"}
            </p>
            <h3 className="mt-0.5 truncate text-lg font-bold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
              {event.title}
            </h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8a8d98]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ffb703]" />
              <span className="truncate">{event.venue || event.location}</span>
            </p>
          </div>
          {event.ticket_categories && event.ticket_categories.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {event.ticket_categories.slice(0, 3).map((category) => (
                <span
                  key={category.id}
                  className="rounded border border-[#2a2d36] bg-[#1e2128] px-2 py-0.5 text-[10px] text-[#8a8d98]"
                >
                  {category.category_name}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-3 border-t border-[#2a2d36] pt-3">
            <div>
              <span className="text-[10px] text-[#8a8d98]">Mulai</span>
              <p className="text-lg font-bold text-[#ffb703]">
                {lowestPrice !== null ? formatCurrency(lowestPrice) : "Lihat harga"}
              </p>
            </div>
            <span className="press inline-flex items-center gap-1.5 rounded-lg bg-[#ffb703] px-4 py-2 text-xs font-bold text-[#10131a] transition-colors group-hover:bg-[#ffdea9]">
              Beli Tiket
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export default EventCard;
