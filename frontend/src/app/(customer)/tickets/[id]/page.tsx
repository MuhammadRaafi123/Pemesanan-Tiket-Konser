"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QRTicket } from "@/features/tickets-user/components/QRTicket";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Reveal } from "@/components/shared/Reveal";
import { fetchTicketById } from "@/features/tickets-user/api";
import type { UserTicket } from "@/features/tickets-user/types";
import { getApiErrorMessage } from "@/lib/apiError";

export default function SingleTicketPage() {
  const params = useParams();
  const id = params.id as string;

  const [ticket, setTicket] = useState<UserTicket | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    if (!id) return;

    fetchTicketById(id)
      .then((data) => {
        if (active) setTicket(data);
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
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <Loading message="Memuat tiket..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !ticket) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <ErrorState
            title={loadError ? "Tiket gagal dimuat" : "Tiket tidak ditemukan"}
            message={loadError || "Data e-ticket tidak valid atau telah kedaluwarsa."}
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <Reveal className="mb-8">
          <Link href="/tickets">
            <Button variant="secondary" className="gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Kembali ke tiket saya
            </Button>
          </Link>
        </Reveal>

        <QRTicket ticket={ticket} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
