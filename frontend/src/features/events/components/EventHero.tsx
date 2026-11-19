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
import { usePathname } from "next/navigation";

interface EventHeroProps {
  event: Event;
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

export function EventHero({ event }: EventHeroProps) {
  const pathname = usePathname();
  const eventPath = pathname.startsWith("/home/") ? "/home/events" : "/events";
  const artistPath = pathname.startsWith("/home/") ? "/home/artists" : "/artists";
  const { success } = useToast();
  const isOpen = event.status === "open";
  const lineupArtists = event.artists_list?.length
    ? event.artists_list
    : event.artists
      ? [event.artists]
      : [];

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
      color: "#6264b5",
    },
    {
      icon: Clock,
      label: "Waktu Mulai",
      value: `${event.start_time || formatEventTime(event.event_date)} WIB (Open Gate H-3 Jam)`,
      color: "#8a75b5",
    },
    {
      icon: MapPin,
      label: "Lokasi & Venue",
      value: event.venue ? `${event.venue} — ${event.location}` : event.location,
      color: "#6264b5",
    },
    ...(event.min_age
      ? [
          {
            icon: Users,
            label: "Batas Usia",
            value: `Minimal ${event.min_age} tahun (Wajib ID/KTP)`,
            color: "#397557",
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
    : { bg: "bg-[#eeebf4]", text: "text-[#6264b5]", border: "border-[#c8b7db]" };

  return (
    <section className="overflow-hidden rounded-2xl border border-[#e8e5ef] bg-white p-5 sm:p-8">
      <div className="relative">
        {/* Navigation & Status Header */}
        <Reveal className="mb-6 flex flex-wrap items-center justify-between gap-4 border-b border-[#e8e5ef] pb-5">
          <Link
            href={eventPath}
            className="inline-flex items-center gap-2 rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] px-4 py-2 text-xs font-bold text-[#071653] transition hover:border-[#c8b7db] hover:text-[#6264b5] press"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Kembali ke Katalog Konser</span>
          </Link>

          <div className="flex items-center gap-3">
            {isOpen ? (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#c7e0d1] bg-[#e6f1eb] px-3.5 py-1.5 text-xs font-bold text-[#397557]">
                <span className="h-2 w-2 rounded-full bg-[#397557] animate-pulse" />
                <span>Tiket Tersedia</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-2 rounded-full border border-[#e8e5ef] bg-[#f7f4fa] px-3.5 py-1.5 text-xs font-medium text-[#5c6482]">
                <span>Penjualan Ditutup</span>
              </span>
            )}

            <button
              type="button"
              onClick={handleShare}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] text-[#5c6482] transition hover:border-[#c8b7db] hover:text-[#6264b5] press"
              aria-label="Bagikan tautan konser"
              title="Bagikan konser"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </Reveal>

        {/* Hero Main Grid: Poster on Left, Info on Right */}
        <div className="grid items-start gap-7 md:grid-cols-12 md:gap-9">
          {/* Poster Showcase */}
          <Reveal variant="scale" className="md:col-span-5">
            <div className="group/poster relative aspect-[4/5] max-h-[440px] overflow-hidden rounded-xl border border-[#e8e5ef] bg-[#f7f4fa]">
              <Image
                src={resolveMediaUrl(event.poster || "/globe.svg")}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="object-cover transition-transform duration-700 group-hover/poster:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#071653]/45 via-transparent to-[#071653]/10" />

              {event.featured && (
                <div className="absolute left-4 top-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/60 bg-white px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-[#6264b5] shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-[#6264b5] text-[#6264b5]" />
                    Pilihan Utama
                  </span>
                </div>
              )}
            </div>
          </Reveal>

          {/* Details & Specs */}
          <div className="md:col-span-7">
            <Reveal delay={80}>
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-extrabold uppercase tracking-wider ${genreStyle.bg} ${genreStyle.text} ${genreStyle.border}`}
                >
                  <Music className="h-3.5 w-3.5" />
                  {event.genre || "Live Concert"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#c8b7db] bg-[#eeebf4] px-3 py-1 text-xs font-bold text-[#6264b5]">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#6264b5]" />
                  Tiket Resmi Terverifikasi Promotor
                </span>
              </div>

              <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-[#071653] sm:text-4xl">
                {event.title}
              </h1>
            </Reveal>

            {/* Event Lineup */}
            {lineupArtists.length ? (
              <Reveal delay={140}>
                <div className="mt-5">
                  <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-[#5c6482]">Lineup Artis</p>
                  <div className="flex flex-wrap gap-2">
                    {lineupArtists.map((artist) => (
                      <Link
                        key={artist.id}
                        href={`${artistPath}/${artist.id}`}
                        className="group inline-flex items-center gap-2 rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] py-1.5 pl-1.5 pr-3 transition-colors hover:border-[#c8b7db] hover:bg-[#eeebf4]"
                      >
                        <span className="relative h-9 w-9 overflow-hidden rounded-lg border border-[#c8b7db] bg-white">
                          <Image
                            src={resolveMediaUrl(artist.photo || "/globe.svg")}
                            alt={artist.name}
                            fill
                            sizes="36px"
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                          />
                        </span>
                        <span className="text-xs font-bold text-[#071653] transition group-hover:text-[#6264b5]">{artist.name}</span>
                        <Mic2 className="h-3.5 w-3.5 text-[#6264b5]" />
                      </Link>
                    ))}
                  </div>
                </div>
              </Reveal>
            ) : null}

            {/* Specs Grid */}
            <Stagger className="mt-6 grid gap-3 sm:grid-cols-2" step={60}>
              {specs.map(({ icon: Icon, label, value, color }) => (
                <div
                  key={label}
                  className="flex items-start gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] p-3.5 transition-colors hover:border-[#c8b7db]"
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border"
                    style={{
                      backgroundColor: `${color}15`,
                      borderColor: `${color}30`,
                      color: color,
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">
                      {label}
                    </span>
                    <span className="mt-0.5 block text-xs font-bold leading-snug text-[#071653] sm:text-sm">
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
