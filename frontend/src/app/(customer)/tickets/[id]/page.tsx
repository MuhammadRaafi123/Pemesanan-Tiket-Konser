"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QRTicket } from "@/features/tickets-user/components/QRTicket";
import { fetchTicketById } from "@/features/tickets-user/api";
import { UserTicket } from "@/features/tickets-user/types";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";

export default function SingleTicketPage() {
  const params = useParams();
  const id = params.id as string;

  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchTicketById(id).then((data) => {
        setTicket(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loading message="Memuat tiket..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 px-4">
          <ErrorState
            title="Tiket Tidak Ditemukan"
            message="Data e-ticket tidak valid atau telah kedaluwarsa."
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <Link href="/tickets">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <ChevronLeft className="h-4 w-4" />
              Kembali ke Tiket Saya
            </Button>
          </Link>
        </div>

        <QRTicket ticket={ticket} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
