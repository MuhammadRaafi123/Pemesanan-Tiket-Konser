"use client";

import React from "react";
import { 
  Info, 
  MapPin, 
  ShieldAlert, 
  Clock, 
  QrCode, 
  Sparkles, 
  CheckCircle2, 
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
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <Info className="h-5 w-5 text-purple-400" />
          Deskripsi & Pengalaman Konser
        </h3>
        <p className="text-sm leading-relaxed text-white/70 whitespace-pre-line">
          {event.description}
        </p>
      </CardSpotlight>

      {/* Venue & Layout Guide */}
      <CardSpotlight className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <MapPin className="h-5 w-5 text-cyan-400" />
          Informasi Venue & Akses Lokasi
        </h3>
        
        <div className="rounded-2xl border border-white/10 bg-[#0a0a14] p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <p className="text-base font-bold text-white">{event.venue || event.location}</p>
              <p className="text-xs text-white/50">{event.location}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-950/60 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300">
              <Sparkles className="h-3.5 w-3.5" />
              Venue Berstandar Internasional
            </span>
          </div>

          {/* Interactive Stage Mockup */}
          <div className="relative aspect-[21/9] w-full rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-950/30 to-[#08080f] p-4 flex flex-col items-center justify-between text-center overflow-hidden">
            <div className="w-48 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-500 py-1.5 text-xs font-black tracking-widest text-white uppercase shadow-[0_0_20px_rgba(168,85,247,0.8)]">
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
              <div className="col-span-3 rounded-lg border border-purple-500/30 bg-purple-500/10 p-2 text-[10px] font-semibold text-purple-300">
                FESTIVAL STANDING ZONE
              </div>
              <div className="col-span-3 rounded-lg border border-white/10 bg-white/5 p-1.5 text-[9px] text-white/50">
                TRIBUNE SEATED AREA (TIER 1 & 2)
              </div>
            </div>
            <span className="text-[10px] text-white/40">Soundboard & Control Area</span>
          </div>
        </div>
      </CardSpotlight>

      {/* Rules & Guidelines */}
      <CardSpotlight className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-amber-400" />
          Panduan & Ketentuan Penonton
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-white/70">
          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <QrCode className="h-4 w-4 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">E-Ticket QR Code</p>
              <p className="text-white/50 text-[11px]">Tunjukkan e-tiket langsung dari aplikasi smartphone saat scan gate.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <Clock className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Pintu Masuk (Open Gate)</p>
              <p className="text-white/50 text-[11px]">Gate dibuka 3 jam sebelum jadwal konser dimulai. Harap datang tepat waktu.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <Camera className="h-4 w-4 text-pink-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Kebijakan Kamera</p>
              <p className="text-white/50 text-[11px]">Kamera HP diperbolehkan. Dilarang membawa kamera profesional DSLR/Mirrorless.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-white/5 bg-white/[0.02] p-3">
            <Ban className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-white">Barang Terlarang</p>
              <p className="text-white/50 text-[11px]">Dilarang membawa senjata, obat terlarang, flare, dan botol kaca ke dalam area.</p>
            </div>
          </div>
        </div>
      </CardSpotlight>

    </div>
  );
}
export default EventInfo;
