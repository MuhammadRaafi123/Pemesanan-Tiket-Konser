"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventHero } from "@/features/events/components/EventHero";
import { EventTicketList } from "@/features/events/components/EventTicketList";
import { EventInfo } from "@/features/events/components/EventInfo";
import { fetchEventById } from "@/features/events/api";
import { Event } from "@/features/events/types";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";

export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchEventById(id).then((data) => {
        setEvent(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loading message="Memuat detail konser..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 px-4">
          <ErrorState
            title="Konser Tidak Ditemukan"
            message="Event yang kamu cari tidak tersedia atau telah berakhir."
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

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-12">
        {/* Hero Section */}
        <EventHero event={event} />

        {/* Ticket Selector Section */}
        <EventTicketList event={event} />

        {/* Venue, Stage Layout & Guidelines */}
        <EventInfo event={event} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
