"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  Clock,
  MapPin,
  Mic2,
  Music,
  Share2,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";
import type { Event } from "../types";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/ToastProvider";
import { formatEventDate, formatEventTime } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

interface EventHeroProps {
  event: Event;
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

export function EventHero({ event }: EventHeroProps) {
  const { success } = useToast();
  const isOpen = event.status === "open";

  const specs = [
    {
      icon: CalendarDays,
      label: "Tanggal Acara",
      value: formatEventDate(event.event_date, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      color: "#ffb703",
    },
    {
      icon: Clock,
      label: "Waktu Mulai",
      value: `${formatEventTime(event.event_date)} WIB (Open Gate H-3 Jam)`,
      color: "#ffdea9",
    },
    {
      icon: MapPin,
      label: "Lokasi & Venue",
      value: event.venue ? `${event.venue} — ${event.location}` : event.location,
      color: "#d5baff",
    },
    ...(event.min_age
      ? [
          {
            icon: Users,
            label: "Batas Usia",
            value: `Minimal ${event.min_age} tahun (Wajib ID/KTP)`,
            color: "#5eead4",
          },
        ]
      : []),
  ];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("Tautan konser berhasil disalin ke clipboard!");
    }
  };

  const rawGenre = (event.genre || event.artists?.genre || "").toLowerCase();
  const matchedKey = Object.keys(GENRE_STYLES).find((key) => rawGenre.includes(key));
  const genreStyle = matchedKey
    ? GENRE_STYLES[matchedKey]
    : { bg: "bg-[#ffb703]/15", text: "text-[#ffdea9]", border: "border-[#ffb703]/30" };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-[#262a38] bg-[#14161f] p-6 shadow-2xl shadow-black/70 sm:p-10">
      {/* Subtle background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 h-[400px] w-[400px] rounded-full bg-[#ffb703]/[0.05] blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-[#6801d1]/[0.07] blur-[120px]"
      />

      <div className="relative">
        {/* Navigation & Status Header */}
        <Reveal className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[#232733]/80 pb-6">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#1a1d27] px-4 py-2 text-xs font-bold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703] press"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Katalog Konser</span>
          </Link>

          <div className="flex items-center gap-3">
            {isOpen ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/40 bg-emerald-500/15 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Tiket Tersedia</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#32353d] bg-[#1d1f27] px-3.5 py-1.5 text-xs font-medium text-[#8a8d98]">
                <span>Penjualan Ditutup</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a2d36] bg-[#1a1d27] text-[#8a8d98] transition hover:border-[#ffb703]/40 hover:text-[#ffb703] press"
              aria-label="Bagikan tautan konser"
              title="Bagikan konser"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        {/* Hero Main Grid: Poster on Left, Info on Right */}
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Poster Showcase */}
          <Reveal variant="scale" className="lg:col-span-5">
            <div className="group/poster relative aspect-[4/5] overflow-hidden rounded-[26px] border-2 border-[#2a2d36] bg-[#181a24] shadow-2xl transition hover:border-[#ffb703]/40 hover:shadow-[#ffb703]/10">
              <Image
                src={resolveMediaUrl(event.poster || "/globe.svg")}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover/poster:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#14161f] via-transparent to-black/25" />
              <div className="scan-line" />

              {event.featured && (
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffb703]/50 bg-gradient-to-r from-[#ffb703] to-[#ff9f00] px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#10131a] shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-[#10131a] text-[#10131a]" />
                    Pilihan Utama
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Details & Specs */}
          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
                >
                  <Music className="h-3.5 w-3.5" />
                  {event.genre || "Live Concert"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#ffb703]/30 bg-[#ffb703]/10 px-3 py-1 text-xs font-bold text-[#ffdea9]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#ffb703]" />
                  Tiket Resmi Terverifikasi Promotor
                </span>
              </div>

              <h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">
                {event.title}
              </h1>
            </Reveal>

            {/* Talent / Headliner Tag */}
            {event.artists ? (
              <Reveal delay={140}>
                <Link
                  href={`/artists/${event.artists.id}`}
                  className="group mt-6 inline-flex items-center gap-3.5 rounded-2xl border border-[#2a2d36] bg-[#1a1d27]/90 py-2 pl-2 pr-5 transition hover:border-[#ffb703]/40 hover:bg-[#202432] shadow-md"
                >
                  <span className="relative h-11 w-11 overflow-hidden rounded-xl border border-[#ffb703]/30 bg-[#12141c]">
                    <Image
                      src={resolveMediaUrl(event.artists.photo || "/globe.svg")}
                      alt={event.artists.name}
                      fill
                      sizes="44px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </span>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8d98]">
                      Musisi / Headliner
                    </span>
                    <span className="flex items-center gap-1.5 text-sm font-bold text-white transition group-hover:text-[#ffb703]">
                      {event.artists.name}
                      <Mic2 className="h-3.5 w-3.5 text-[#ffb703]" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ) : null}

            {/* Specs Grid */}
            <Stagger className="mt-8 grid gap-3 sm:grid-cols-2" step={60}>
              {specs.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-start gap-3.5 rounded-2xl border border-[#262a38] bg-[#1a1d27] p-4.5 transition hover:border-[#ffb703]/25"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `${color}15`,
                      borderColor: `${color}30`,
                      color: color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8a8d98]">
                      {label}
                    </span>
                    <span className="mt-0.5 block text-xs font-bold leading-snug text-white sm:text-sm">
                      {value}
                    </span>
                  </div>
                </div>
              ))}
            </Stagger>
          </div>
        </div>
      </div>
    </section>
  );
}

export default EventHero;
