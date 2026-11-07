"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Download,
  ExternalLink,
  MapPin,
  Maximize2,
  QrCode,
  ShieldCheck,
  Ticket,
  UserRound,
  X,
  Zap,
} from "lucide-react";
import type { UserTicket } from "../types";
import { Reveal } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/ToastProvider";
import { formatEventDate, formatEventTime } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

interface QRTicketProps {
  ticket: UserTicket;
}

export function QRTicket({ ticket }: QRTicketProps) {
  const { success, error } = useToast();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const isActive = ticket.status === "active";

  const handleDownload = () => {
    try {
      const link = document.createElement("a");
      link.href = ticket.qr_code;
      link.download = `TIXORA-${ticket.ticket_code}.png`;
      document.body.append(link);
      link.click();
      link.remove();
      success("QR tiket berhasil diunduh ke perangkatmu.");
    } catch {
      error("Gagal mengunduh QR tiket.");
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(ticket.ticket_code);
      success(`Kode tiket ${ticket.ticket_code} berhasil disalin!`);
    } catch {
      error("Kode tiket tidak dapat disalin otomatis.");
    }
  };

  const poster = resolveMediaUrl(ticket.event.poster || "");

  return (
    <>
      <Reveal>
        <article className="group relative mx-auto w-full max-w-4xl overflow-hidden rounded-3xl border border-[#232733] bg-[#14161f] shadow-2xl shadow-black/60 transition-all duration-300 hover:border-[#ffb703]/35 hover-sheen">
          {/* Holographic Glowing Header Ribbon */}
          <div className="h-1.5 w-full bg-gradient-to-r from-[#ffb703] via-[#d5baff] to-[#38bdf8] shadow-[0_0_15px_rgba(255,183,3,0.3)]" />

          <div className="relative p-6 sm:p-8 lg:p-9">
            {/* Header Event & Pass Status */}
            <header className="flex flex-wrap items-start justify-between gap-4 border-b border-[#232733]/80 pb-6">
              <div className="flex items-center gap-4">
                {/* Event Poster or Icon */}
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl border border-[#2a2d36] bg-[#1a1d27] shadow-lg">
                  {poster ? (
                    <Image
                      src={poster}
                      alt={ticket.event.title}
                      fill
                      sizes="64px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-[#1e2128] text-[#ffb703]">
                      <Ticket className="h-8 w-8" />
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ffb703]">
                      <Ticket className="h-3 w-3" />
                      Official Digital Pass
                    </span>
                    <span className="text-[10px] font-semibold text-[#8a8d98]">
                      {ticket.category.category_name}
                    </span>
                  </div>
                  <h3 className="mt-1.5 text-xl font-extrabold text-[#e1e2ec] transition-colors group-hover:text-white sm:text-2xl">
                    {ticket.event.title}
                  </h3>
                </div>
              </div>

              {/* Status Pill with Vivid Colors */}
              <div className="flex items-center gap-2">
                {isActive ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-1.5 text-xs font-bold text-emerald-300 shadow-[0_0_15px_rgba(52,211,153,0.15)]">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                    Tiket Valid · Siap Scan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#32353d] bg-[#1e2128] px-3.5 py-1.5 text-xs font-medium text-[#8a8d98]">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    Sudah Digunakan
                  </span>
                )}
              </div>
            </header>

            {/* Perforated Stub Line with Circles */}
            <div className="relative -mx-6 my-6 flex items-center justify-between sm:-mx-8 lg:-mx-9">
              <span className="h-6 w-6 rounded-full bg-[#0b0e15] ring-2 ring-[#232733]" />
              <div className="h-0 flex-1 border-t-2 border-dashed border-[#2a2d36]" />
              <span className="px-3 text-[9px] font-bold uppercase tracking-[0.2em] text-[#7a7d88]">
                Tear / Scan Gate
              </span>
              <div className="h-0 flex-1 border-t-2 border-dashed border-[#2a2d36]" />
              <span className="h-6 w-6 rounded-full bg-[#0b0e15] ring-2 ring-[#232733]" />
            </div>

            {/* Main Pass Grid: Details on Left, QR Code on Right */}
            <div className="grid gap-8 lg:grid-cols-12 lg:items-center">
              {/* Left Column: Attendee & Seat Info */}
              <div className="space-y-5 lg:col-span-7">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#232733] bg-[#1a1d27]/80 p-3.5 transition hover:border-[#ffb703]/25">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
                      <UserRound className="h-3 w-3" />
                      Pemegang Tiket
                    </div>
                    <p className="mt-1.5 truncate text-sm font-bold text-[#e1e2ec]">
                      {ticket.holder_name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#232733] bg-[#1a1d27]/80 p-3.5 transition hover:border-[#ffb703]/25">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#d5baff]">
                      <Ticket className="h-3 w-3" />
                      Kategori Tiket
                    </div>
                    <p className="mt-1.5 truncate text-sm font-bold text-[#e1e2ec]">
                      {ticket.category.category_name}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#232733] bg-[#1a1d27]/80 p-3.5 transition hover:border-[#ffb703]/25">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#ffd9c0]">
                      <Compass className="h-3 w-3" />
                      Kursi / Zona
                    </div>
                    <p className="mt-1.5 truncate text-sm font-bold text-[#e1e2ec]">
                      {ticket.seat_number || "General Area / Festival"}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-[#232733] bg-[#1a1d27]/80 p-3.5 transition hover:border-[#ffb703]/25">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-[#5eead4]">
                      <Zap className="h-3 w-3" />
                      Pintu / Gate Masuk
                    </div>
                    <p className="mt-1.5 truncate text-sm font-bold text-[#e1e2ec]">
                      {ticket.gate || "Pintu Masuk Utama (Main Gate)"}
                    </p>
                  </div>
                </div>

                {/* Event Schedule & Location */}
                <div className="space-y-2.5 rounded-2xl border border-[#232733] bg-[#10131a]/80 p-4 text-xs text-[#b2b4bd]">
                  <p className="flex items-center gap-2.5 font-medium">
                    <CalendarDays className="h-4 w-4 shrink-0 text-[#ffb703]" />
                    <span className="text-[#e1e2ec]">
                      {formatEventDate(ticket.event.event_date, {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <span className="text-[#7a7d88]">·</span>
                    <span className="inline-flex items-center gap-1 text-[#ffdea9]">
                      <Clock className="h-3 w-3 text-[#ffb703]" />
                      {formatEventTime(ticket.event.event_date)} WIB
                    </span>
                  </p>
                  <p className="flex items-center gap-2.5 font-medium">
                    <MapPin className="h-4 w-4 shrink-0 text-[#ffb703]" />
                    <span className="text-[#e1e2ec]">
                      {ticket.event.venue
                        ? `${ticket.event.venue}, ${ticket.event.location}`
                        : ticket.event.location}
                    </span>
                  </p>
                </div>
              </div>

              {/* Right Column: High-Contrast QR Code Gate Scanner */}
              <div className="flex flex-col items-center justify-center lg:col-span-5">
                <div
                  onClick={() => setIsQrModalOpen(true)}
                  className="group/qr relative flex h-48 w-48 cursor-pointer items-center justify-center overflow-hidden rounded-2xl bg-white p-3.5 shadow-[0_0_35px_rgba(255,183,3,0.15)] ring-4 ring-[#ffb703]/25 transition-all duration-300 hover:ring-[#ffb703]/50 hover:scale-105"
                  title="Ketuk untuk memperbesar QR code di gate"
                >
                  <Image
                    src={ticket.qr_code}
                    alt={ticket.ticket_code}
                    fill
                    sizes="192px"
                    className="object-contain p-2"
                  />
                  <div className="scan-line" />

                  {/* Hover Overlay Hint */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#0b0e15]/75 opacity-0 backdrop-blur-xs transition-opacity duration-300 group-hover/qr:opacity-100">
                    <Maximize2 className="h-6 w-6 text-[#ffb703]" />
                    <span className="mt-1.5 text-[10px] font-bold uppercase tracking-wider text-white">
                      Perbesar Layar
                    </span>
                  </div>
                </div>

                {/* Ticket Code Tag */}
                <div className="mt-4 flex items-center gap-2">
                  <p className="font-mono text-sm font-bold tracking-widest text-[#ffb703]">
                    {ticket.ticket_code}
                  </p>
                  <button
                    type="button"
                    onClick={handleCopyCode}
                    className="rounded-md border border-[#2a2d36] bg-[#1d1f27] p-1 text-[#8a8d98] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                    title="Salin kode tiket"
                  >
                    <Copy className="h-3.5 w-3.5" />
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-[#7a7d88]">
                  Ketuk QR untuk mode scan layar penuh di gate
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#232733]/80 pt-6">
              <div className="flex items-center gap-2 font-mono text-xs text-[#8a8d98]">
                <span>NO. PESANAN:</span>
                <span className="font-bold text-[#e1e2ec]">{ticket.order_code}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2d36] bg-[#1a1d27] px-4 py-2 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703] press"
                >
                  <Copy className="h-3.5 w-3.5 text-[#ffb703]" />
                  <span>Salin Kode</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#ffb703] px-4 py-2 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:bg-[#ffdea9] press"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Unduh QR</span>
                </button>

                <Link
                  href={`/orders/${ticket.order_code}`}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2d36] bg-[#10131a] px-4 py-2 text-xs font-semibold text-[#8a8d98] transition hover:border-[#ffb703]/30 hover:text-[#e1e2ec] press"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Detail Invoice</span>
                </Link>
              </div>
            </footer>
          </div>
        </article>
      </Reveal>

      {/* Fullscreen Gate Scanner Modal */}
      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-[page-enter_200ms_ease_both]">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-[#ffb703]/40 bg-[#14161f] p-6 sm:p-8 text-center shadow-2xl shadow-black/80">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setIsQrModalOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-[#2a2d36] bg-[#1d1f27] p-2 text-[#8a8d98] transition hover:border-[#ffb703]/40 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>

            {/* Modal Content */}
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffb703]/10 text-[#ffb703] ring-1 ring-[#ffb703]/30">
              <QrCode className="h-6 w-6" />
            </div>

            <h3 className="text-xl font-extrabold text-[#e1e2ec]">Scan Gate Masuk</h3>
            <p className="mt-1 text-xs text-[#8a8d98]">
              Tunjukkan QR Code ini langsung ke petugas tiket di pintu masuk.
            </p>

            {/* High-Contrast Large QR Frame */}
            <div className="relative mx-auto my-6 flex h-64 w-64 items-center justify-center overflow-hidden rounded-2xl bg-white p-4 shadow-[0_0_40px_rgba(255,183,3,0.25)] ring-4 ring-[#ffb703]/40">
              <Image
                src={ticket.qr_code}
                alt={ticket.ticket_code}
                fill
                sizes="256px"
                className="object-contain p-2"
              />
              <div className="scan-line" />
            </div>

            <div className="space-y-1">
              <p className="font-mono text-base font-black tracking-widest text-[#ffb703]">
                {ticket.ticket_code}
              </p>
              <p className="text-xs font-semibold text-[#e1e2ec]">{ticket.event.title}</p>
              <p className="text-[11px] text-[#8a8d98]">
                {ticket.category.category_name} · {ticket.seat_number || "General Area"}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-amber-400/20 bg-amber-400/10 p-3 text-xs text-amber-200/90">
              <ShieldCheck className="h-4 w-4 shrink-0 text-[#ffb703]" />
              <span>Setel kecerahan layar HP ke 100% untuk pembacaan tercepat di scanner gate.</span>
            </div>

            <div className="mt-6 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleDownload}
                className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-6 py-2.5 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:bg-[#ffdea9] press"
              >
                <Download className="h-4 w-4" />
                Unduh Gambar QR
              </button>
              <button
                type="button"
                onClick={() => setIsQrModalOpen(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#1a1d27] px-5 py-2.5 text-xs font-semibold text-[#e1e2ec] transition hover:bg-[#232733]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default QRTicket;
