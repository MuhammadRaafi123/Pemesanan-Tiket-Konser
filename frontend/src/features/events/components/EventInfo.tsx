"use client";

import { useState } from "react";
import {
  Award,
  Ban,
  Camera,
  CheckCircle2,
  ChevronDown,
  Clock,
  Info,
  MapPin,
  QrCode,
  ShieldCheck,
  Volume2,
} from "lucide-react";
import type { Event } from "../types";
import { Reveal } from "@/components/shared/Reveal";

interface EventInfoProps {
  event: Event;
}

const GUIDELINES = [
  {
    icon: QrCode,
    title: "E-ticket QR Code Check-in",
    description:
      "Tunjukkan e-tiket langsung dari aplikasi smartphone saat pemindaian di gate. Pastikan layar HP dalam tingkat kecerahan maksimal.",
  },
  {
    icon: Clock,
    title: "Jam Buka Gate Pintu Masuk",
    description:
      "Gate venue dibuka 3 jam sebelum jadwal konser dimulai. Sangat disarankan datang lebih awal untuk proses body check dan penukaran wristband.",
  },
  {
    icon: Camera,
    title: "Kebijakan Kamera & Perekam",
    description:
      "Kamera HP / smartphone diperbolehkan. Dilarang keras membawa kamera profesional DSLR, mirrorless dengan lensa tele, tripod, atau tongsis.",
  },
  {
    icon: Ban,
    title: "Barang Terlarang & Larangan Masuk",
    description:
      "Senjata tajam, kembang api / flare, botol kaca, rokok/vape di dalam hall, dan makanan/minuman dari luar tidak diperkenankan masuk.",
  },
  {
    icon: Volume2,
    title: "Kenyamanan & Etika Nonton",
    description:
      "Hormati penonton di sekitarmu, jaga kebersihan hall, dan ikuti seluruh instruksi keamanan dari kru promotor selama acara berlangsung.",
  },
  {
    icon: ShieldCheck,
    title: "Jaminan Refund & Kebijakan Jadwal",
    description:
      "Jika terjadi pembatalan konser oleh promotor atau musisi berhalangan hadir, dana tiket akan dikembalikan 100% sesuai aturan resmi.",
  },
];

export function EventInfo({ event }: EventInfoProps) {
  const [openGuideline, setOpenGuideline] = useState<number | null>(0);

  return (
    <div className="space-y-8">
      {/* 1. Description & Highlights */}
      <Reveal>
        <article className="rounded-3xl border border-[#262a38] bg-[#14161f] p-7 sm:p-9 shadow-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
            <Info className="h-3.5 w-3.5" />
            <span>Tentang Acara</span>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Deskripsi &amp; Pengalaman Konser
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#c4c7d4] whitespace-pre-line sm:text-base">
            {event.description}
          </p>

          {event.highlights && event.highlights.length > 0 ? (
            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {event.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3 rounded-2xl border border-[#2a2d36] bg-[#1a1d27] p-4 transition hover:border-[#ffb703]/30"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#ffb703]" />
                  <p className="text-xs font-semibold leading-relaxed text-white sm:text-sm">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </article>
      </Reveal>

      {/* 2. Venue & Stage Layout */}
      <Reveal delay={80}>
        <article className="rounded-3xl border border-[#262a38] bg-[#14161f] p-7 sm:p-9 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#232733]/80 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d5baff]/30 bg-[#d5baff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#d5baff]">
                <MapPin className="h-3.5 w-3.5" />
                <span>Venue &amp; Denah Panggung</span>
              </div>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">
                {event.venue || event.location}
              </h2>
              <p className="mt-1 text-xs text-[#8a8d98]">{event.location}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-3.5 py-1.5 text-xs font-bold text-[#ffdea9]">
              <Award className="h-4 w-4 text-[#ffb703]" />
              Standar Konser Internasional
            </span>
          </div>

          {/* Interactive Stage Map Graphic */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-[#232733] bg-[#0e1118] p-6 sm:p-8">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#ffb703]">
              PANGGUNG UTAMA (MAIN STAGE)
            </p>
            <div className="mx-auto mt-3 h-2 w-48 rounded-full bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] shadow-[0_0_20px_rgba(255,183,3,0.5)]" />

            <div className="mx-auto mt-8 grid max-w-lg grid-cols-3 gap-3">
              <div className="rounded-xl border border-[#ffd9c0]/40 bg-[#ffd9c0]/10 p-3 text-center text-xs font-bold uppercase tracking-wider text-[#ffd9c0] shadow-sm">
                VIP Left Pass
              </div>
              <div className="rounded-xl border-2 border-[#ffb703] bg-[#ffb703]/20 p-3 text-center text-xs font-black uppercase tracking-wider text-[#ffb703] shadow-[0_0_25px_rgba(255,183,3,0.25)]">
                Infinity Soundcheck Pit
              </div>
              <div className="rounded-xl border border-[#ffd9c0]/40 bg-[#ffd9c0]/10 p-3 text-center text-xs font-bold uppercase tracking-wider text-[#ffd9c0] shadow-sm">
                VIP Right Pass
              </div>

              <div className="col-span-3 rounded-xl border border-[#5eead4]/40 bg-[#5eead4]/10 p-3 text-center text-xs font-extrabold uppercase tracking-wider text-[#5eead4] shadow-sm">
                Festival Standing Area (Zona Bebas Berdiri)
              </div>

              <div className="col-span-3 rounded-xl border border-[#d5baff]/40 bg-[#d5baff]/10 p-3 text-center text-xs font-semibold uppercase tracking-wider text-[#d5baff]">
                Tribune Seated (Kursi Bernomor Tier 1 &amp; Tier 2)
              </div>
            </div>

            <p className="mt-7 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#7a7d88]">
              FOH Soundboard &amp; Lighting Tower Area
            </p>
          </div>
        </article>
      </Reveal>

      {/* 3. Guidelines & Regulations */}
      <Reveal delay={120}>
        <article className="rounded-3xl border border-[#262a38] bg-[#14161f] p-7 sm:p-9 shadow-xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Panduan &amp; Keamanan</span>
          </div>
          <h2 className="mt-3 text-2xl font-black tracking-tight text-white sm:text-3xl">
            Ketentuan Masuk &amp; Kenyamanan Penonton
          </h2>

          <div className="mt-7 space-y-3">
            {GUIDELINES.map(({ icon: Icon, title, description }, index) => {
              const isOpen = openGuideline === index;
              return (
                <div
                  key={title}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#ffb703]/40 bg-[#1a1d27]"
                      : "border-[#232733] bg-[#12141c] hover:border-[#ffb703]/25"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenGuideline(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                          isOpen
                            ? "border-[#ffb703]/50 bg-[#ffb703]/20 text-[#ffb703]"
                            : "border-[#2a2d36] bg-[#1d1f27] text-[#8a8d98]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-bold text-white sm:text-base">{title}</span>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#8a8d98] transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#ffb703]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#2a2d36]/60 px-5 pb-5 pt-3 pl-16 text-xs leading-relaxed text-[#c4c7d4] sm:text-sm">
                      {description}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </article>
      </Reveal>
    </div>
  );
}

export default EventInfo;
