"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  QrCode, 
  Download, 
  Share2, 
  Sparkles, 
  CalendarDays, 
  MapPin, 
  Maximize2,
  CheckCircle2
} from "lucide-react";
import { UserTicket } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/components/shared/ToastProvider";

interface QRTicketProps {
  ticket: UserTicket;
}

export function QRTicket({ ticket }: QRTicketProps) {
  const { success } = useToast();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const formattedDate = new Date(ticket.event.event_date).toLocaleDateString("id-ID", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const handleDownload = () => {
    success("E-Ticket berhasil diunduh (PDF / Wallet Pass)!");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(ticket.ticket_code);
      success(`Kode tiket ${ticket.ticket_code} disalin ke clipboard!`);
    }
  };

  return (
    <>
      <div className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-blue-200 bg-white shadow-[0_24px_70px_-38px_rgba(37,99,235,.4)] backdrop-blur-2xl transition-all duration-300 hover:border-blue-300 hover:shadow-[0_26px_75px_-36px_rgba(37,99,235,.45)]">
        
        {/* Holographic Security Top Strip */}
        <div className="h-2 w-full hologram-strip" />

        <div className="p-6 sm:p-8">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-blue-100 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-md">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563eb]">
                  Official Digital Pass
                </span>
                <h3 className="text-lg font-black text-[#123b6d]">{ticket.event.title}</h3>
              </div>
            </div>

            <Badge variant={ticket.status === "active" ? "success" : "secondary"} className="gap-1 px-3 py-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {ticket.status === "active" ? "Tiket Valid (Siap Scan)" : "Sudah Digunakan"}
            </Badge>
          </div>

          {/* Main Body */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
            
            {/* Left: Specs */}
            <div className="md:col-span-7 space-y-4">
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                  <p className="text-[10px] font-semibold text-[#8aa4c1] uppercase">Pemegang Tiket</p>
                  <p className="font-bold text-[#123b6d] text-sm mt-0.5">{ticket.holder_name}</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                  <p className="text-[10px] font-semibold text-[#8aa4c1] uppercase">Kategori Tiket</p>
                  <p className="font-bold text-amber-300 text-sm mt-0.5">{ticket.category.category_name}</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                  <p className="text-[10px] font-semibold text-[#8aa4c1] uppercase">Nomor Kursi / Zona</p>
                  <p className="font-bold text-sky-600 text-xs mt-0.5">{ticket.seat_number || "General Area"}</p>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-3">
                  <p className="text-[10px] font-semibold text-[#8aa4c1] uppercase">Pintu Masuk (Gate)</p>
                  <p className="font-bold text-[#123b6d] text-xs mt-0.5">{ticket.gate || "Main Gate"}</p>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-[#6683a3] pt-2">
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4 text-[#2563eb]" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-sky-600" />
                  <span>{ticket.event.venue ? `${ticket.event.venue}, ${ticket.event.location}` : ticket.event.location}</span>
                </div>
              </div>

            </div>

            {/* Right: Holographic QR Code Box */}
            <div className="md:col-span-5 flex flex-col items-center justify-center text-center p-4 rounded-2xl border border-blue-200 bg-blue-50">
              <div
                onClick={() => setIsQrModalOpen(true)}
                className="group relative h-40 w-40 cursor-pointer overflow-hidden rounded-2xl border-2 border-blue-400/50 bg-white p-2 shadow-[0_12px_30px_-18px_rgba(37,99,235,.5)] transition-all hover:scale-105"
              >
                <Image
                  src={ticket.qr_code}
                  alt={ticket.ticket_code}
                  fill
                  className="object-contain p-2"
                />

                {/* Animated Green Laser Scanline */}
                <div className="absolute left-0 right-0 h-1 bg-[#2563eb] shadow-[0_0_12px_#22d3ee]" />

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                  <Maximize2 className="h-6 w-6 text-white" />
                </div>
              </div>

              <p className="mt-2 text-[11px] font-mono font-bold tracking-wider text-[#2563eb]">
                {ticket.ticket_code}
              </p>
              <p className="text-[10px] text-[#8aa4c1]">Ketuk untuk memperbesar QR</p>
            </div>

          </div>

          {/* Ticket Perforation Divider Line */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="w-full border-t border-dashed border-blue-200" />
          </div>

          {/* Actions & Barcode */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-[#8aa4c1]">
              <span>ORDER ID: {ticket.order_code}</span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleShare}
                variant="secondary"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <Share2 className="h-3.5 w-3.5" />
                Salin Kode
              </Button>

              <Button
                onClick={handleDownload}
                variant="glow"
                size="sm"
                className="gap-1.5 text-xs"
              >
                <Download className="h-3.5 w-3.5" />
                Unduh PDF
              </Button>
            </div>
          </div>

        </div>

      </div>

      {/* QR ZOOM MODAL */}
      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
        <div className="p-6 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600/20 text-[#2563eb]">
            <QrCode className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-[#123b6d]">Scan Masuk Konser</h3>
          <p className="text-xs text-[#6683a3]">Tunjukkan layar ini langsung ke petugas scanner di gate venue.</p>
          
          <div className="relative mx-auto h-64 w-64 overflow-hidden rounded-2xl bg-white p-3 shadow-2xl border-4 border-blue-500">
            <Image
              src={ticket.qr_code}
              alt={ticket.ticket_code}
              fill
              className="object-contain p-2"
            />
            <div className="absolute left-0 right-0 h-1 bg-[#2563eb] shadow-[0_0_12px_#22d3ee]" />
          </div>

          <p className="text-sm font-mono font-bold text-[#2563eb]">{ticket.ticket_code}</p>
        </div>
      </Dialog>
    </>
  );
}
export default QRTicket;
