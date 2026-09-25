"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Ticket, QrCode, Plus } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QRTicket } from "@/features/tickets-user/components/QRTicket";
import { fetchMyTickets, MOCK_USER_TICKETS } from "@/features/tickets-user/api";
import { UserTicket } from "@/features/tickets-user/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loading } from "@/components/shared/Loading";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<UserTicket[]>(MOCK_USER_TICKETS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyTickets().then((data) => {
      setTickets(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="light-app min-h-screen bg-[#f4f8ff] text-[#123b6d] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full space-y-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-6">
          <div>
            <Badge variant="gradient" className="gap-1.5 mb-2">
              <QrCode className="h-3.5 w-3.5" />
              Dompet E-Ticket Digital
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-[#123b6d]">
              Tiket Konser Saya
            </h1>
            <p className="text-xs text-[#8aa4c1] mt-1">
              Tunjukkan QR Code di bawah ini saat memasuki pintu gate konser idola favoritmu.
            </p>
          </div>

          <Link href="/events">
            <Button variant="glow" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-4 w-4" />
              Beli Tiket Baru
            </Button>
          </Link>
        </div>

        {/* Tickets Listing */}
        {loading ? (
          <Loading message="Memuat e-ticket digital..." />
        ) : tickets.length > 0 ? (
          <div className="space-y-8">
            {tickets.map((ticket) => (
              <QRTicket key={ticket.id} ticket={ticket} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Ticket}
            title="Belum Memiliki Tiket Konser"
            description="Kamu belum membeli tiket konser. Temukan konser impianmu sekarang juga!"
            actionLabel="Cari Tiket Konser"
            actionHref="/events"
          />
        )}

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
