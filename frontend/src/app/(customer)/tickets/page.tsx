"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  CircleHelp,
  Search,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QRTicket } from "@/features/tickets-user/components/QRTicket";
import { fetchMyTickets } from "@/features/tickets-user/api";
import type { UserTicket } from "@/features/tickets-user/types";
import { Loading } from "@/components/shared/Loading";
import { getApiErrorMessage } from "@/lib/apiError";

type TicketFilter = "all" | "active" | "used";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<TicketFilter>("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchMyTickets()
      .then((data) => {
        if (active) {
          setTickets(data);
          setLoadError("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) setLoadError(getApiErrorMessage(requestError, "Gagal memuat tiket digital."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  const activeTickets = useMemo(() => tickets.filter((ticket) => ticket.status === "active"), [tickets]);
  const usedTickets = useMemo(() => tickets.filter((ticket) => ticket.status === "used"), [tickets]);
  const filteredTickets = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return tickets.filter((ticket) => {
      const matchesStatus = statusFilter === "all" || ticket.status === statusFilter;
      const matchesQuery =
        !query ||
        [ticket.event.title, ticket.ticket_code, ticket.event.location, ticket.event.venue]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [searchQuery, statusFilter, tickets]);

  const filters: { id: TicketFilter; label: string; count: number }[] = [
    { id: "all", label: "Semua", count: tickets.length },
    { id: "active", label: "Siap digunakan", count: activeTickets.length },
    { id: "used", label: "Riwayat", count: usedTickets.length },
  ];

  return (
    <div className="landing-page customer-lavender-page min-h-screen bg-[#f5f2ff] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <section className="grid gap-6 rounded-2xl border border-[#e8e5ef] bg-white p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6264b5]"><Ticket className="h-4 w-4" />Dompet tiket digital</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#071653] sm:text-5xl">Semua tiketmu, <span className="text-[#6264b5]">siap digunakan.</span></h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[#68708a]">Temukan QR masuk, detail acara, dan kode tiket dalam satu tempat. Buka tiket untuk memeriksa kategori, nama pemegang, lokasi, serta pintu masuk yang tertera. Simpan QR di perangkat sebelum berangkat agar proses pemeriksaan di gate lebih praktis.</p>
            <Link href="/home/events" className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-[#6264b5] transition hover:text-[#51539f]">Jelajahi konser <Ticket className="h-4 w-4" /></Link>
          </div>
          <div className="flex gap-3 border-t border-[#e8e5ef] pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <div className="min-w-24 rounded-xl bg-[#faf9fc] px-4 py-3"><p className="text-[9px] font-bold uppercase tracking-wider text-[#68708a]">Total tiket</p><p className="mt-1 text-2xl font-bold text-[#071653]">{tickets.length}</p></div>
            <div className="min-w-24 rounded-xl bg-[#f0f6f2] px-4 py-3"><p className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-[#397557]"><CheckCircle2 className="h-3 w-3" />Aktif</p><p className="mt-1 text-2xl font-bold text-[#245d43]">{activeTickets.length}</p></div>
          </div>
        </section>

        <section className="mt-5 rounded-[1.5rem] border border-[#e6e0ef] bg-white p-4 shadow-[0_20px_60px_-42px_rgba(51,37,86,.2)] sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label className="group flex max-w-xl flex-1 items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 transition hover:border-[#c8b7db] focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]"><Search className="h-4 w-4" /></span>
              <span className="min-w-0 flex-1"><span className="block text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">Cari tiket</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama konser, lokasi, atau kode tiket"
                className="w-full bg-transparent text-sm font-medium text-[#071653] outline-none placeholder:text-[#8790a8]"
              />
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setStatusFilter(filter.id)}
                  aria-pressed={statusFilter === filter.id}
                  className={`rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    statusFilter === filter.id
                      ? "bg-[#6264b5] text-white"
                      : "border border-[#e8e5ef] bg-[#fffdf2] text-[#5c6482] hover:border-[#c8b7db]"
                  }`}
                >
                  {filter.label} <span className="ml-1 opacity-70">{filter.count}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">Koleksi tiket</p>
              <h2 className="mt-1 text-xl font-extrabold sm:text-2xl">Tiket digital saya</h2>
              <p className="mt-1 text-xs leading-5 text-[#68708a]">Gunakan filter untuk memisahkan tiket acara mendatang dari tiket yang sudah digunakan, atau cari tiket dengan kode dan nama konser.</p>
            </div>
            <span className="hidden items-center gap-2 text-xs font-medium text-[#5c6482] sm:inline-flex">
              <ShieldCheck className="h-4 w-4 text-[#6264b5]" /> QR resmi Tixora
            </span>
          </div>
          {loading ? (
            <div className="rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] py-16"><Loading message="Memuat tiket digital..." /></div>
          ) : loadError ? (
            <div className="rounded-2xl border border-rose-200 bg-[#fffdf2] p-8 text-center">
              <p className="text-sm font-semibold text-rose-700">{loadError}</p>
              <button type="button" onClick={() => { setLoading(true); setReloadKey((key) => key + 1); }} className="mt-4 rounded-lg bg-[#6264b5] px-4 py-2 text-xs font-bold text-white">Coba lagi</button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#c8b7db] bg-[#fffdf2] px-6 py-14 text-center">
              <Ticket className="mx-auto h-9 w-9 text-[#6264b5]" />
              <h3 className="mt-4 text-lg font-bold">Belum ada tiket</h3>
              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#5c6482]">
                Tiket yang sudah lunas akan muncul di sini bersama QR untuk masuk ke acara.
              </p>
              <Link href="/home/events" className="mt-5 inline-flex rounded-xl bg-[#6264b5] px-5 py-3 text-xs font-bold text-white hover:bg-[#51539f]">
                Jelajahi konser
              </Link>
            </div>
          ) : filteredTickets.length ? (
            <div className="space-y-6">
              {filteredTickets.map((ticket) => <QRTicket key={ticket.id} ticket={ticket} />)}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#c8b7db] bg-[#fffdf2] px-6 py-12 text-center">
              <Search className="mx-auto h-8 w-8 text-[#6264b5]" />
              <h3 className="mt-3 font-bold">Tiket tidak ditemukan</h3>
              <button type="button" onClick={() => { setSearchQuery(""); setStatusFilter("all"); }} className="mt-3 text-xs font-bold text-[#6264b5]">
                Reset filter
              </button>
            </div>
          )}
        </section>

        <aside className="mt-10 flex items-start gap-3 rounded-2xl border border-[#e8e5ef] bg-[#eeebf4] p-5 text-sm text-[#4c4e7a]">
          <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-[#6264b5]" />
          <p className="leading-6">Simpan QR tiket di perangkatmu sebelum berangkat dan pastikan layar cukup terang saat dipindai. Tunjukkan kode asli pada petugas gate, cocokkan detail acara pada tiket, serta jangan bagikan tangkapan layar karena QR dapat digunakan untuk validasi masuk.</p>
        </aside>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
