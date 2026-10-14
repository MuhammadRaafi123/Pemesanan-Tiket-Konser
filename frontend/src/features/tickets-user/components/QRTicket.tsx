"use client";

import { useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  MapPin,
  Maximize2,
  QrCode,
  Sparkles,
} from "lucide-react";
import type { UserTicket } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Reveal } from "@/components/shared/Reveal";
import { useToast } from "@/components/shared/ToastProvider";
import { formatEventDate, formatEventTime } from "@/lib/format";

interface QRTicketProps {
  ticket: UserTicket;
}

export function QRTicket({ ticket }: QRTicketProps) {
  const { success, error } = useToast();
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const isActive = ticket.status === "active";

  const details = [
    { label: "Pemegang tiket", value: ticket.holder_name },
    { label: "Kategori", value: ticket.category.category_name },
    { label: "Jumlah tiket", value: String(ticket.quantity) },
    { label: "Kursi / zona", value: ticket.seat_number || "General area" },
    { label: "Gate", value: ticket.gate || "Main gate" },
  ];

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = ticket.qr_code;
    link.download = `${ticket.ticket_code}.png`;
    document.body.append(link);
    link.click();
    link.remove();
    success("QR tiket berhasil diunduh.");
  };

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(ticket.ticket_code);
      success(`Kode tiket ${ticket.ticket_code} disalin ke clipboard!`);
    } catch {
      error("Kode tiket tidak dapat disalin di browser ini.");
    }
  };

  return (
    <>
      <Reveal>
        <article className="relative mx-auto w-full max-w-3xl overflow-hidden rounded-[30px] border border-border bg-white shadow-[0_2px_6px_rgba(10,27,51,.05),0_40px_90px_-46px_rgba(13,38,84,.6)]">
          <div className="hologram-strip h-1 w-full" />

          <div className="relative p-6 sm:p-9">
            <header className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-white shadow-[0_12px_26px_-14px_rgba(27,69,199,.9)]">
                  <Sparkles className="h-5 w-5" />
                </span>
                <div>
                  <p className="meta-label">Official digital pass</p>
                  <h3 className="font-display mt-1 text-lg leading-snug text-ink">
                    {ticket.event.title}
                  </h3>
                </div>
              </div>
              <Badge variant={isActive ? "success" : "secondary"} className="gap-1.5">
                <CheckCircle2 className="h-3 w-3" />
                {isActive ? "Tiket valid" : "Sudah digunakan"}
              </Badge>
            </header>

            <div className="relative my-7 flex items-center gap-3">
              <div className="h-px flex-1 border-t border-dashed border-border" />
              <span className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
              <span className="meta-label">Scan di gate</span>
              <span className="h-2.5 w-2.5 rounded-full border border-border bg-background" />
              <div className="h-px flex-1 border-t border-dashed border-border" />
            </div>

            <div className="grid gap-7 lg:grid-cols-12 lg:items-center">
              <div className="space-y-5 lg:col-span-7">
                <dl className="grid gap-3 sm:grid-cols-2">
                  {details.map((detail) => (
                    <div key={detail.label} className="rounded-2xl border border-border bg-muted/50 p-4">
                      <dt className="meta-label">{detail.label}</dt>
                      <dd className="mt-1.5 truncate text-sm font-semibold text-ink">{detail.value}</dd>
                    </div>
                  ))}
                </dl>

                <div className="space-y-2.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2.5">
                    <CalendarDays className="h-4 w-4 shrink-0 text-primary" />
                    {formatEventDate(ticket.event.event_date, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}{" "}
                    · {formatEventTime(ticket.event.event_date)} WIB
                  </p>
                  <p className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-primary" />
                    {ticket.event.venue
                      ? `${ticket.event.venue}, ${ticket.event.location}`
                      : ticket.event.location}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-center lg:col-span-5">
                <button
                  type="button"
                  onClick={() => setIsQrModalOpen(true)}
                  className="press group relative h-44 w-44 overflow-hidden rounded-2xl border border-border bg-white p-3 shadow-[0_20px_50px_-30px_rgba(13,38,84,.7)]"
                  aria-label="Perbesar QR code"
                >
                  <Image
                    src={ticket.qr_code}
                    alt={ticket.ticket_code}
                    fill
                    sizes="176px"
                    className="object-contain p-2"
                  />
                  <span className="scan-line top-1/2" />
                  <span className="absolute inset-0 flex items-center justify-center bg-ink/45 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <Maximize2 className="h-5 w-5 text-white" />
                  </span>
                </button>
                <p className="mt-4 font-mono text-xs font-semibold tracking-[0.14em] text-primary">
                  {ticket.ticket_code}
                </p>
                <p className="mt-1 text-[0.65rem] text-muted-foreground">Ketuk untuk memperbesar</p>
              </div>
            </div>

            <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <span className="font-mono text-[0.68rem] tracking-[0.1em] text-muted-foreground">
                ORDER {ticket.order_code}
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={handleShare} className="gap-1.5">
                  <Copy className="h-3.5 w-3.5" />
                  Salin kode
                </Button>
                <Button size="sm" onClick={handleDownload} className="gap-1.5">
                  <Download className="h-3.5 w-3.5" />
                Unduh QR
                </Button>
              </div>
            </footer>
          </div>
        </article>
      </Reveal>

      <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen} label="QR tiket">
        <div className="text-center">
          <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-primary">
            <QrCode className="h-6 w-6" />
          </span>
          <DialogTitle>Pindai di gate</DialogTitle>
          <DialogDescription className="mx-auto mt-2 max-w-xs">
            Tunjukkan layar ini langsung ke petugas pemindai di pintu masuk venue.
          </DialogDescription>

          <div className="relative mx-auto mt-6 h-64 w-64 overflow-hidden rounded-2xl border-4 border-primary/15 bg-white p-3">
            <Image src={ticket.qr_code} alt={ticket.ticket_code} fill sizes="256px" className="object-contain p-2" />
            <span className="scan-line top-1/2" />
          </div>

          <p className="mt-5 font-mono text-sm font-semibold tracking-[0.14em] text-primary">
            {ticket.ticket_code}
          </p>
        </div>
      </Dialog>
    </>
  );
}

export default QRTicket;
