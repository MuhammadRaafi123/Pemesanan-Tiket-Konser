"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, QrCode, Ticket } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QRTicket } from "@/features/tickets-user/components/QRTicket";
import { PageHeader } from "@/components/shared/PageHeader";
import { Stagger } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { fetchMyTickets } from "@/features/tickets-user/api";
import type { UserTicket } from "@/features/tickets-user/types";
import { getApiErrorMessage } from "@/lib/apiError";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    fetchMyTickets()
      .then((data) => {
        if (active) setTickets(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(getApiErrorMessage(requestError, "Gagal memuat tiket. Silakan coba lagi."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <PageHeader
          eyebrow={
            <>
              <QrCode className="h-3.5 w-3.5" />
              Dompet e-ticket
            </>
          }
          title="Tiket konser saya"
          description="Tunjukkan QR code di bawah ini saat memasuki gate konser idola favoritmu."
          actions={
            <Link href="/events">
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />
                Beli tiket baru
              </Button>
            </Link>
          }
        />

        <div className="mt-10">
          {loading ? (
            <Loading message="Memuat e-ticket digital..." />
          ) : loadError ? (
            <ErrorState title="Tiket gagal dimuat" message={loadError} />
          ) : tickets.length > 0 ? (
            <Stagger className="space-y-8" step={110}>
              {tickets.map((ticket) => (
                <QRTicket key={ticket.id} ticket={ticket} />
              ))}
            </Stagger>
          ) : (
            <EmptyState
              icon={Ticket}
              title="Belum memiliki tiket konser"
              description="Kamu belum membeli tiket konser. Temukan konser impianmu sekarang juga!"
              actionLabel="Cari tiket konser"
              actionHref="/events"
            />
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
