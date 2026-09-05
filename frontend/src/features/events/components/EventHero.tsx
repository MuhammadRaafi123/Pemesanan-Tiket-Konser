"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  Sparkles, 
  Share2, 
  Heart, 
  ShieldCheck, 
  Mic2,
  ChevronLeft 
} from "lucide-react";
import { Event } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/shared/ToastProvider";

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  const { success } = useToast();

  const formattedDate = new Date(event.event_date).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const formattedTime = new Date(event.event_date).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  }) + " WIB";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("Tautan konser berhasil disalin ke clipboard!");
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0d0d16] p-6 sm:p-10 shadow-2xl backdrop-blur-2xl">
      
      {/* Background Poster Blur Effect */}
      <div className="absolute inset-0 -z-10 opacity-20 blur-3xl scale-125 pointer-events-none">
        <Image
          src={event.poster || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200&auto=format&fit=crop"}
          alt={event.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Grid Pattern overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Navigation & Action Bar */}
      <div className="flex items-center justify-between gap-4 mb-8">
        <Link href="/events">
          <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
            <ChevronLeft className="h-4 w-4" />
            Kembali ke Daftar Konser
          </Button>
        </Link>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleShare}
            variant="secondary"
            size="icon"
            className="rounded-xl h-9 w-9 text-white/70 hover:text-white"
            title="Bagikan Konser"
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Poster Box */}
        <div className="lg:col-span-5">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl border border-white/15 shadow-2xl group">
            <Image
              src={event.poster || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=800&auto=format&fit=crop"}
              alt={event.title}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <Badge variant={event.status === "open" ? "success" : "destructive"} className="gap-1.5 text-xs py-1 px-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {event.status === "open" ? "Tiket Tersedia" : "Penjualan Ditutup"}
              </Badge>
            </div>
          </div>
        </div>

        {/* Right: Info Box */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="gradient" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {event.genre || "World Tour"}
              </Badge>

              <Badge variant="secondary" className="gap-1">
                <ShieldCheck className="h-3 w-3 text-cyan-400" />
                Official Verified Event
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              {event.title}
            </h1>
          </div>

          {/* Artist link pill */}
          {event.artists && (
            <Link
              href={`/artists/${event.artists.id}`}
              className="inline-flex items-center gap-3 rounded-2xl border border-purple-500/20 bg-purple-950/30 p-2.5 pr-4 backdrop-blur-md hover:border-purple-400 hover:bg-purple-900/40 transition-all duration-200 group"
            >
              <div className="relative h-9 w-9 overflow-hidden rounded-xl border border-purple-400/50">
                <Image
                  src={event.artists.photo || "/globe.svg"}
                  alt={event.artists.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] font-semibold text-purple-300 uppercase tracking-wider">
                  Bintang Tamu Utama
                </p>
                <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1">
                  {event.artists.name}
                  <Mic2 className="h-3.5 w-3.5 text-cyan-400" />
                </p>
              </div>
            </Link>
          )}

          {/* Date, Time & Venue Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            
            <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400 shrink-0">
                <CalendarDays className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-white/40">Tanggal Acara</p>
                <p className="text-xs font-bold text-white">{formattedDate}</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400 shrink-0">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-white/40">Waktu Mulai</p>
                <p className="text-xs font-bold text-white">{formattedTime}</p>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-3.5 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600/20 text-pink-400 shrink-0">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-white/40">Lokasi / Venue</p>
                <p className="text-xs font-bold text-white">
                  {event.venue ? `${event.venue} — ${event.location}` : event.location}
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
export default EventHero;
