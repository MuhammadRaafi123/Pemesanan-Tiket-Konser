"use client";

import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  ChevronLeft,
  Clock,
  MapPin,
  Mic2,
  Share2,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import type { Event } from "../types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/ToastProvider";
import { formatEventDate, formatEventTime } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

interface EventHeroProps {
  event: Event;
}

export function EventHero({ event }: EventHeroProps) {
  const { success } = useToast();
  const isOpen = event.status === "open";

  const specs = [
    { icon: CalendarDays, label: "Tanggal acara", value: formatEventDate(event.event_date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) },
    { icon: Clock, label: "Waktu mulai", value: `${formatEventTime(event.event_date)} WIB` },
    { icon: MapPin, label: "Lokasi", value: event.venue ? `${event.venue} — ${event.location}` : event.location },
    ...(event.min_age ? [{ icon: Users, label: "Minimal usia", value: `${event.min_age} tahun` }] : []),
  ];

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      success("Tautan konser berhasil disalin ke clipboard!");
    }
  };

  return (
    <section className="relative overflow-hidden rounded-[32px] border border-border bg-white shadow-[0_1px_2px_rgba(10,27,51,.04),0_30px_80px_-46px_rgba(13,38,84,.4)]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: `url(${resolveMediaUrl(event.poster || "/globe.svg")})`, backgroundSize: "cover", backgroundPosition: "center" }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 dot-grid opacity-60" />

      <div className="relative p-6 sm:p-10">
        <Reveal className="mb-9 flex items-center justify-between gap-4">
          <Link href="/events">
            <Button variant="secondary" size="sm" className="gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Semua konser
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant={isOpen ? "success" : "secondary"} className="gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${isOpen ? "pulse-dot bg-emerald-500 text-emerald-500" : "bg-muted-foreground/50"}`} />
              {isOpen ? "Tiket tersedia" : "Penjualan ditutup"}
            </Badge>
            <Button
              type="button"
              onClick={handleShare}
              variant="secondary"
              size="icon"
              className="h-9 w-9 rounded-full"
              aria-label="Bagikan konser"
            >
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </Reveal>

        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          <Reveal variant="scale" className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] border border-border bg-muted shadow-[0_40px_80px_-40px_rgba(13,38,84,.55)]">
              <Image
                src={resolveMediaUrl(event.poster || "/globe.svg")}
                alt={event.title}
                fill
                priority
                sizes="(max-width: 1024px) 92vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/35 to-transparent" />
              <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal delay={80}>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="gold" className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  {event.genre || "World tour"}
                </Badge>
                <Badge variant="secondary" className="gap-1">
                  <ShieldCheck className="h-3 w-3 text-primary" />
                  Tiket resmi terverifikasi
                </Badge>
              </div>

              <h1 className="font-display-xl mt-6 text-[2.1rem] leading-[1.05] text-ink sm:text-5xl">
                {event.title}
              </h1>
            </Reveal>

            {event.artists ? (
              <Reveal delay={140}>
                <Link
                  href={`/artists/${event.artists.id}`}
                  className="group mt-6 inline-flex items-center gap-3 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-5 transition hover:border-primary/30 hover:shadow-[0_12px_30px_-20px_rgba(27,69,199,.5)]"
                >
                  <span className="relative h-9 w-9 overflow-hidden rounded-full border border-border">
                    <Image
                      src={resolveMediaUrl(event.artists.photo || "/globe.svg")}
                      alt={event.artists.name}
                      fill
                      sizes="36px"
                      className="object-cover"
                    />
                  </span>
                  <span>
                    <span className="meta-label block">Talent utama</span>
                    <span className="flex items-center gap-1.5 text-sm font-semibold text-ink transition group-hover:text-primary">
                      {event.artists.name}
                      <Mic2 className="h-3.5 w-3.5 text-primary" />
                    </span>
                  </span>
                </Link>
              </Reveal>
            ) : null}

            <Stagger className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2" step={60}>
              {specs.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3 bg-white p-5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-accent text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <span className="min-w-0">
                    <span className="meta-label block">{label}</span>
                    <span className="mt-1 block text-sm font-semibold leading-snug text-ink">{value}</span>
                  </span>
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
