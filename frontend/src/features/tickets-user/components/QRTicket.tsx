"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
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
  const poster = resolveMediaUrl(ticket.event.poster || "");

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

  const qrCode = (
    <Image
      src={ticket.qr_code}
      alt={ticket.ticket_code}
      fill
      sizes="(max-width: 640px) 220px, 256px"
      className="object-contain p-2"
    />
  );

  return (
    <>
      <Reveal>
        <article className="overflow-hidden rounded-3xl border border-[#e8e5ef] bg-[#fffdf2] shadow-[0_20px_55px_-36px_rgba(7,22,83,.38)]">
          <header className="relative overflow-hidden bg-[#071653] px-5 py-5 text-white sm:px-7">
            <div className="absolute -right-14 -top-24 h-56 w-56 rounded-full bg-[#6264b5]/40 blur-3xl" />
            <div className="relative flex flex-wrap items-center justify-between gap-4">
              <div className="flex min-w-0 items-center gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-white/20 bg-white/10">
                  {poster ? (
                    <Image src={poster} alt={ticket.event.title} fill sizes="56px" className="object-cover" />
                  ) : (
                    <Ticket className="m-auto h-6 w-6 text-[#c8b7db]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#d9c8e8]">
                    Tiket digital resmi · {ticket.category.category_name}
                  </p>
                  <h3 className="mt-1 truncate text-lg font-extrabold sm:text-xl">{ticket.event.title}</h3>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${
                isActive
                  ? "border-[#c7e0d1]/40 bg-[#e6f1eb]/15 text-[#d4f1df]"
                  : "border-white/20 bg-white/10 text-white/75"
              }`}>
                {isActive ? <><span className="h-1.5 w-1.5 rounded-full bg-[#9bd1ad]" /> Siap digunakan</> : <><CheckCircle2 className="h-3.5 w-3.5" /> Sudah digunakan</>}
              </span>
            </div>
          </header>

          <div className="grid lg:grid-cols-[1fr_300px]">
            <div className="p-5 sm:p-7">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { label: "Pemegang tiket", value: ticket.holder_name, icon: UserRound },
                  { label: "Kategori", value: ticket.category.category_name, icon: Ticket },
                  { label: "Zona / kursi", value: ticket.seat_number || "General Area", icon: QrCode },
                  { label: "Pintu masuk", value: ticket.gate || "Pintu masuk utama", icon: MapPin },
                ].map(({ label, value, icon: Icon }) => (
                  <div key={label} className="rounded-xl border border-[#e8e5ef] bg-[#fffdf2] p-3.5">
                    <p className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.16em] text-[#6264b5]">
                      <Icon className="h-3.5 w-3.5" /> {label}
                    </p>
                    <p className="mt-1.5 truncate text-sm font-bold text-[#071653]">{value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-3 rounded-xl bg-[#f7f4fa] p-4 text-xs text-[#5c6482]">
                <p className="flex items-center gap-2.5">
                  <CalendarDays className="h-4 w-4 shrink-0 text-[#6264b5]" />
                  <span className="font-semibold text-[#071653]">
                    {formatEventDate(ticket.event.event_date, { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
                  </span>
                  <span className="text-[#c8b7db]">·</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#6264b5]">
                    <Clock className="h-3.5 w-3.5" /> {formatEventTime(ticket.event.event_date)} WIB
                  </span>
                </p>
                <p className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 shrink-0 text-[#6264b5]" />
                  <span className="font-medium text-[#071653]">
                    {ticket.event.venue ? `${ticket.event.venue}, ${ticket.event.location}` : ticket.event.location}
                  </span>
                </p>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-[#c8b7db] pt-4">
                <p className="text-[9px] font-bold uppercase tracking-[.16em] text-[#5c6482]">
                  Kode tiket <span className="ml-1 font-mono text-xs tracking-wider text-[#071653]">{ticket.ticket_code}</span>
                </p>
                <button type="button" onClick={handleCopyCode} className="inline-flex items-center gap-1.5 rounded-lg border border-[#e8e5ef] px-3 py-2 text-[10px] font-bold text-[#6264b5] transition hover:border-[#c8b7db] hover:bg-[#f7f4fa]">
                  <Copy className="h-3.5 w-3.5" /> Salin kode
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-lg bg-[#6264b5] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#51539f]">
                  <Download className="h-3.5 w-3.5" /> Unduh QR
                </button>
                <Link href={`/orders/${ticket.order_code}`} className="inline-flex items-center gap-2 rounded-lg border border-[#e8e5ef] px-4 py-2.5 text-xs font-bold text-[#071653] transition hover:border-[#c8b7db] hover:bg-[#f7f4fa]">
                  <ExternalLink className="h-3.5 w-3.5 text-[#6264b5]" /> Detail invoice
                </Link>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center border-t border-[#e8e5ef] bg-[#f7f4fa] p-6 lg:border-l lg:border-t-0">
              <button
                type="button"
                onClick={() => setIsQrModalOpen(true)}
                className="group relative flex h-52 w-52 items-center justify-center overflow-hidden rounded-2xl bg-[#fffdf2] p-3 shadow-[0_14px_38px_-22px_rgba(7,22,83,.32)] ring-4 ring-[#c8b7db]/45 transition hover:ring-[#6264b5]/50"
                aria-label="Perbesar QR tiket"
              >
                {qrCode}
                <span className="absolute inset-0 flex flex-col items-center justify-center bg-[#071653]/75 text-white opacity-0 transition group-hover:opacity-100">
                  <Maximize2 className="h-6 w-6 text-[#d9c8e8]" />
                  <span className="mt-2 text-[10px] font-bold uppercase tracking-wider">Perbesar QR</span>
                </span>
              </button>
              <p className="mt-4 font-mono text-sm font-extrabold tracking-[.16em] text-[#6264b5]">{ticket.ticket_code}</p>
              <p className="mt-1 text-center text-[10px] text-[#5c6482]">Tunjukkan QR ini saat memasuki gate.</p>
            </div>
          </div>
        </article>
      </Reveal>

      {isQrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#071653]/85 p-4 backdrop-blur-md">
          <section className="relative w-full max-w-md rounded-3xl border border-[#c8b7db]/40 bg-[#071653] p-6 text-center text-white shadow-2xl sm:p-8">
            <button type="button" onClick={() => setIsQrModalOpen(false)} aria-label="Tutup QR" className="absolute right-4 top-4 rounded-full border border-white/15 p-2 text-white/70 hover:bg-white/10 hover:text-white">
              <X className="h-4 w-4" />
            </button>
            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl bg-[#6264b5]/30 text-[#d9c8e8]"><QrCode className="h-5 w-5" /></div>
            <h3 className="mt-4 text-xl font-extrabold">Tiket masuk</h3>
            <p className="mt-1 text-xs text-white/65">{ticket.event.title}</p>
            <div className="relative mx-auto my-6 h-64 w-64 overflow-hidden rounded-2xl bg-[#fffdf2] p-4 ring-4 ring-[#c8b7db]/45">{qrCode}</div>
            <p className="font-mono text-sm font-extrabold tracking-[.16em] text-[#d9c8e8]">{ticket.ticket_code}</p>
            <p className="mt-2 text-[11px] leading-5 text-white/65">
              <ShieldCheck className="mr-1 inline h-3.5 w-3.5 text-[#c8b7db]" />
              Atur kecerahan layar agar QR mudah dipindai petugas.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <button type="button" onClick={handleDownload} className="inline-flex items-center gap-2 rounded-xl bg-[#c8b7db] px-5 py-2.5 text-xs font-extrabold text-[#071653] hover:bg-[#e2d5ec]">
                <Download className="h-4 w-4" /> Unduh QR
              </button>
              <button type="button" onClick={() => setIsQrModalOpen(false)} className="rounded-xl border border-white/20 px-5 py-2.5 text-xs font-bold text-white/80 hover:bg-white/10">
                Tutup
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default QRTicket;
