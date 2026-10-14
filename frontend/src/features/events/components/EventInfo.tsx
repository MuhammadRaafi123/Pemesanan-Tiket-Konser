"use client";

import { Ban, Camera, Clock, Info, MapPin, QrCode, ShieldCheck, Sparkles, Volume2 } from "lucide-react";
import type { Event } from "../types";
import { Badge } from "@/components/ui/badge";
import { Disclosure } from "@/components/shared/Disclosure";
import { Reveal } from "@/components/shared/Reveal";

interface EventInfoProps {
  event: Event;
}

const GUIDELINES = [
  {
    icon: QrCode,
    title: "E-ticket QR code",
    description:
      "Tunjukkan e-tiket langsung dari aplikasi smartphone saat pemindaian di gate. Pastikan layar dalam keadaan terang.",
  },
  {
    icon: Clock,
    title: "Jam buka pintu",
    description:
      "Gate dibuka tiga jam sebelum jadwal konser dimulai. Datang lebih awal untuk menghindari antrean dan proses check-in.",
  },
  {
    icon: Camera,
    title: "Kebijakan kamera",
    description:
      "Kamera HP diperbolehkan. Dilarang membawa kamera profesional DSLR atau mirrorless tanpa izin promoter.",
  },
  {
    icon: Ban,
    title: "Barang terlarang",
    description:
      "Senjata, obat terlarang, flare, botol kaca, dan benda tajam tidak diperkenankan masuk area konser.",
  },
  {
    icon: Volume2,
    title: "Etika penonton",
    description:
      "Jaga volume suara, hormati penonton lain, dan ikut arahan crew selama acara berlangsung.",
  },
  {
    icon: ShieldCheck,
    title: "Refund & perubahan",
    description:
      "Perubahan jadwal resmi diumumkan lewat kanal Concertix. Kebijakan refund mengikuti aturan promoter.",
  },
];

export function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="space-y-6">
      <Reveal>
        <article className="rounded-[28px] border border-border bg-white p-7 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-9">
          <p className="eyebrow">
            <Info className="h-3.5 w-3.5" />
            Tentang acara
          </p>
          <h2 className="font-display mt-4 text-3xl text-ink">Deskripsi & pengalaman konser</h2>
          <p className="prose-soft mt-5 whitespace-pre-line">{event.description}</p>

          {event.highlights && event.highlights.length > 0 ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {event.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-border bg-muted/50 p-4"
                >
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <p className="text-sm leading-6 text-ink-soft">{highlight}</p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      </Reveal>

      <Reveal delay={80}>
        <article className="rounded-[28px] border border-border bg-white p-7 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-9">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="eyebrow">
                <MapPin className="h-3.5 w-3.5" />
                Venue
              </p>
              <h2 className="font-display mt-4 text-3xl text-ink">
                {event.venue || event.location}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">{event.location}</p>
            </div>
            <Badge variant="secondary" className="gap-1.5">
              <Sparkles className="h-3 w-3 text-gold" />
              Standar internasional
            </Badge>
          </div>

          <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-muted/40 p-5 sm:p-7">
            <p className="text-center text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
              Panggung utama
            </p>
            <div className="mx-auto mt-3 h-1.5 w-40 rounded-full bg-gradient-to-r from-primary/25 via-primary to-primary/25" />

            <div className="mx-auto mt-7 grid max-w-md grid-cols-3 gap-2.5">
              <div className="rounded-xl border border-border bg-white p-2.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                VIP Left
              </div>
              <div className="rounded-xl border border-gold-soft/45 bg-[#fdf9f1] p-2.5 text-center text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[#7a5a1f] shadow-[0_10px_24px_-18px_rgba(168,132,63,.8)]">
                Infinity Front
              </div>
              <div className="rounded-xl border border-border bg-white p-2.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                VIP Right
              </div>
              <div className="col-span-3 rounded-xl border border-primary/15 bg-accent/60 p-2.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-primary">
                Festival standing zone
              </div>
              <div className="col-span-3 rounded-xl border border-border bg-white p-2.5 text-center text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                Tribune seated · tier 1 &amp; 2
              </div>
            </div>

            <p className="mt-6 text-center text-[0.62rem] uppercase tracking-[0.2em] text-muted-foreground/70">
              Soundboard &amp; control area
            </p>
          </div>
        </article>
      </Reveal>

      <Reveal delay={140}>
        <article className="rounded-[28px] border border-border bg-white p-7 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-9">
          <p className="eyebrow">
            <ShieldCheck className="h-3.5 w-3.5" />
            Panduan penonton
          </p>
          <h2 className="font-display mt-4 text-3xl text-ink">Yang perlu kamu ketahui</h2>

          <div className="mt-7 space-y-2.5">
            {GUIDELINES.map(({ icon, title, description }) => (
              <Disclosure key={title} title={title} description={description} icon={icon} />
            ))}
          </div>
        </article>
      </Reveal>
    </div>
  );
}

export default EventInfo;
