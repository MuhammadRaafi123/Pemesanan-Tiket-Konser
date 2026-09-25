"use client";

import React from "react";
import { 
  Info, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  QrCode, 
  Sparkles, 
  Ban,
  Camera
} from "lucide-react";
import { Event } from "../types";
import { CardSpotlight } from "@/components/shared/CardSpotlight";

interface EventInfoProps {
  event: Event;
}

export function EventInfo({ event }: EventInfoProps) {
  return (
    <div className="space-y-8">
      
      {/* Event Overview / Description */}
      <CardSpotlight className="space-y-4">
        <h3 className="text-lg font-bold text-[#123b6d] flex items-center gap-2">
          <Info className="h-5 w-5 text-[#2563eb]" />
          Deskripsi & Pengalaman Konser
        </h3>
        <p className="text-sm leading-relaxed text-[#6683a3] whitespace-pre-line">
          {event.description}
        </p>
      </CardSpotlight>

      {/* Venue & Layout Guide */}
      <CardSpotlight className="space-y-4">
        <h3 className="text-lg font-bold text-[#123b6d] flex items-center gap-2">
          <MapPin className="h-5 w-5 text-sky-600" />
          Informasi Venue & Akses Lokasi
        </h3>
        
        <div className="rounded-2xl border border-blue-100 bg-white p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-4">
            <div>
              <p className="text-base font-bold text-[#123b6d]">{event.venue || event.location}</p>
              <p className="text-xs text-[#8aa4c1]">{event.location}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200 px-3 py-1 text-xs font-semibold text-sky-700">
              <Sparkles className="h-3.5 w-3.5" />
              Venue Berstandar Internasional
            </span>
          </div>

          {/* Interactive Stage Mockup */}
          <div className="relative aspect-[21/9] w-full rounded-xl border border-blue-200 bg-blue-50 p-4 flex flex-col items-center justify-between text-center overflow-hidden">
            <div className="w-48 rounded-lg bg-[#2563eb] py-1.5 text-xs font-black tracking-widest text-white uppercase shadow-[0_10px_24px_-14px_rgba(37,99,235,.6)]">
              ★ MAIN STAGE ★
            </div>
            <div className="grid grid-cols-3 gap-2 w-full max-w-md my-auto">
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-[10px] font-bold text-amber-300">
                VIP Left
              </div>
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/20 p-2 text-[10px] font-black text-amber-200 shadow-md">
                VIP Infinity Front
              </div>
              <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 p-2 text-[10px] font-bold text-amber-300">
                VIP Right
              </div>
              <div className="col-span-3 rounded-lg border border-blue-200 bg-white p-2 text-[10px] font-semibold text-[#17457f]">
                FESTIVAL STANDING ZONE
              </div>
              <div className="col-span-3 rounded-lg border border-blue-100 bg-white/5 p-1.5 text-[9px] text-[#8aa4c1]">
                TRIBUNE SEATED AREA (TIER 1 & 2)
              </div>
            </div>
            <span className="text-[10px] text-[#8aa4c1]">Soundboard & Control Area</span>
          </div>
        </div>
      </CardSpotlight>

      {/* Rules & Guidelines */}
      <CardSpotlight className="space-y-4">
        <h3 className="text-lg font-bold text-[#123b6d] flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          Panduan & Ketentuan Penonton
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#6683a3]">
          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-white p-3">
            <QrCode className="h-4 w-4 text-[#2563eb] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#123b6d]">E-Ticket QR Code</p>
              <p className="text-[#8aa4c1] text-[11px]">Tunjukkan e-tiket langsung dari aplikasi smartphone saat scan gate.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-white p-3">
            <Clock className="h-4 w-4 text-sky-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#123b6d]">Pintu Masuk (Open Gate)</p>
              <p className="text-[#8aa4c1] text-[11px]">Gate dibuka 3 jam sebelum jadwal konser dimulai. Harap datang tepat waktu.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-white p-3">
            <Camera className="h-4 w-4 text-[#2563eb] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#123b6d]">Kebijakan Kamera</p>
              <p className="text-[#8aa4c1] text-[11px]">Kamera HP diperbolehkan. Dilarang membawa kamera profesional DSLR/Mirrorless.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-blue-100 bg-white p-3">
            <Ban className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#123b6d]">Barang Terlarang</p>
              <p className="text-[#8aa4c1] text-[11px]">Dilarang membawa senjata, obat terlarang, flare, dan botol kaca ke dalam area.</p>
            </div>
          </div>
        </div>
      </CardSpotlight>

    </div>
  );
}
export default EventInfo;
