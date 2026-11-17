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
        <article className="rounded-2xl border border-[#e8e5ef] bg-white p-5 sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8b7db] bg-[#eeebf4] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
            <Info className="h-3.5 w-3.5" />
            <span>Tentang Acara</span>
          </div>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-[#071653] sm:text-2xl">
            Deskripsi &amp; Pengalaman Konser
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#5c6482] whitespace-pre-line sm:text-base">
            {event.description}
          </p>

          {event.highlights && event.highlights.length > 0 ? (
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {event.highlights.map((highlight) => (
                <div
                  key={highlight}
                  className="flex items-start gap-3 rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] p-3.5 transition-colors hover:border-[#c8b7db]"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6264b5]" />
                  <p className="text-xs font-semibold leading-relaxed text-[#071653] sm:text-sm">
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
        <article className="rounded-2xl border border-[#e8e5ef] bg-white p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[#e8e5ef] pb-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#c8b7db] bg-[#eeebf4] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                <MapPin className="h-3.5 w-3.5" />
                <span>Venue &amp; Denah Panggung</span>
              </div>
              <h2 className="mt-2 text-xl font-bold tracking-tight text-[#071653] sm:text-2xl">
                {event.venue || event.location}
              </h2>
              <p className="mt-1 text-xs text-[#5c6482]">{event.location}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c8b7db] bg-[#eeebf4] px-3.5 py-1.5 text-xs font-bold text-[#6264b5]">
              <Award className="h-4 w-4 text-[#6264b5]" />
              Standar Konser Internasional
            </span>
          </div>

          {/* Interactive Stage Map Graphic */}
          <div className="mt-6 overflow-hidden rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] p-4 sm:p-6">
            <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-[#6264b5]">
              PANGGUNG UTAMA (MAIN STAGE)
            </p>
            <div className="mx-auto mt-3 h-2 w-48 rounded-full bg-gradient-to-r from-[#6264b5] via-[#c8b7db] to-[#6264b5] shadow-[0_0_20px_rgba(98,100,181,0.3)]" />

            <div className="mx-auto mt-6 grid max-w-lg grid-cols-3 gap-2">
              <div className="rounded-lg border border-[#c8b7db] bg-white p-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                VIP Left Pass
              </div>
              <div className="rounded-lg border border-[#6264b5] bg-[#eeebf4] p-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                Infinity Soundcheck Pit
              </div>
              <div className="rounded-lg border border-[#c8b7db] bg-white p-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
                VIP Right Pass
              </div>

              <div className="col-span-3 rounded-lg border border-[#c7e0d1] bg-[#e6f1eb] p-2.5 text-center text-[10px] font-bold uppercase tracking-wider text-[#397557]">
                Festival Standing Area (Zona Bebas Berdiri)
              </div>

              <div className="col-span-3 rounded-lg border border-[#e8e5ef] bg-white p-2.5 text-center text-[10px] font-semibold uppercase tracking-wider text-[#5c6482]">
                Tribune Seated (Kursi Bernomor Tier 1 &amp; Tier 2)
              </div>
            </div>

            <p className="mt-7 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#5c6482]">
              FOH Soundboard &amp; Lighting Tower Area
            </p>
          </div>
        </article>
      </Reveal>

      {/* 3. Guidelines & Regulations */}
      <Reveal delay={120}>
        <article className="rounded-2xl border border-[#e8e5ef] bg-white p-5 sm:p-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c7e0d1] bg-[#e6f1eb] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#397557]">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Panduan &amp; Keamanan</span>
          </div>
          <h2 className="mt-3 text-xl font-bold tracking-tight text-[#071653] sm:text-2xl">
            Ketentuan Masuk &amp; Kenyamanan Penonton
          </h2>

          <div className="mt-5 space-y-2">
            {GUIDELINES.map(({ icon: Icon, title, description }, index) => {
              const isOpen = openGuideline === index;
              return (
                <div
                  key={title}
                  className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                    isOpen
                      ? "border-[#c8b7db] bg-[#f7f4fa]"
                      : "border-[#e8e5ef] bg-white hover:border-[#c8b7db]"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenGuideline(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 p-3.5 text-left sm:p-4"
                  >
                    <div className="flex items-center gap-3.5">
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                          isOpen
                            ? "border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]"
                            : "border-[#e8e5ef] bg-[#f7f4fa] text-[#5c6482]"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-bold text-[#071653] sm:text-base">{title}</span>
                    </div>

                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#5c6482] transition-transform duration-300 ${
                        isOpen ? "rotate-180 text-[#6264b5]" : ""
                      }`}
                    />
                  </button>

                  {isOpen && (
                    <div className="border-t border-[#e8e5ef] px-5 pb-5 pt-3 pl-16 text-xs leading-relaxed text-[#5c6482] sm:text-sm">
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
