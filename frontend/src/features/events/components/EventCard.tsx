"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  CalendarDays, 
  MapPin, 
  Sparkles, 
  ArrowRight, 
  Ticket, 
  Flame,
  Clock
} from "lucide-react";
import { Event } from "../types";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event;
  index?: number;
}

export function EventCard({ event, index = 0 }: EventCardProps) {
  const formattedDate = new Date(event.event_date).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const lowestPrice = event.ticket_categories?.length
    ? Math.min(...event.ticket_categories.map((tc) => tc.price))
    : 500000;

  const delayClass = [
    "delay-100",
    "delay-200",
    "delay-300",
    "delay-400",
    "delay-500",
  ][index % 5];

  return (
    <div className={`${delayClass} h-full`}>
      <CardSpotlight
        spotlightColor="rgba(168, 85, 247, 0.2)"
        className="group flex h-full flex-col overflow-hidden p-0 border-white/10 bg-[#0e0e18]/90 hover:border-purple-500/50 hover:shadow-[0_15px_40px_-10px_rgba(139,92,246,0.35)] transition-all duration-500"
      >
        {/* ================================================= */}
        {/* POSTER & BADGES */}
        {/* ================================================= */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-900">
          <Image
            src={event.poster || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop"}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e18] via-[#0e0e18]/30 to-transparent opacity-90" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2">
            <Badge variant="gradient" className="gap-1 text-[11px] shadow-lg">
              <Sparkles className="h-3 w-3" />
              {event.genre || "Live Concert"}
            </Badge>

            {event.featured && (
              <Badge variant="warning" className="gap-1 text-[11px] font-bold">
                <Flame className="h-3 w-3 fill-amber-400 text-amber-400" />
                Featured
              </Badge>
            )}
          </div>

          {/* Artist Avatar Pill */}
          {event.artists && (
            <div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/60 px-3 py-1 backdrop-blur-md">
              <div className="relative h-5 w-5 overflow-hidden rounded-full border border-purple-400">
                <Image
                  src={event.artists.photo || "/globe.svg"}
                  alt={event.artists.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-xs font-semibold text-white truncate max-w-[140px]">
                {event.artists.name}
              </span>
            </div>
          )}
        </div>

        {/* ================================================= */}
        {/* CONTENT & DETAILS */}
        {/* ================================================= */}
        <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
          
          <div className="space-y-3">
            {/* Title */}
            <h3 className="text-lg font-bold tracking-tight text-white line-clamp-2 group-hover:text-purple-300 transition-colors duration-200">
              {event.title}
            </h3>

            {/* Date & Location */}
            <div className="space-y-1.5 text-xs text-white/65">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-purple-400 shrink-0" />
                <span>{formattedDate}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-cyan-400 shrink-0" />
                <span className="truncate">{event.venue ? `${event.venue}, ${event.location}` : event.location}</span>
              </div>
            </div>
          </div>

          {/* Bottom Price & Action */}
          <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wider text-white/40">
                Mulai Dari
              </p>
              <p className="text-base font-black text-purple-300">
                Rp {lowestPrice.toLocaleString("id-ID")}
              </p>
            </div>

            <Link href={`/events/${event.id}`}>
              <Button
                variant="glow"
                size="sm"
                className="gap-1.5 group/btn"
              >
                <Ticket className="h-3.5 w-3.5 text-cyan-300" />
                <span>Pesan</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </Link>
          </div>

        </div>
      </CardSpotlight>
    </div>
  );
}
export default EventCard;
