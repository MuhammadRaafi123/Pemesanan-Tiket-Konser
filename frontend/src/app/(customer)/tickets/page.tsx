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
    <div className="landing-page min-h-screen bg-[#f7f4fa] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <section className="grid gap-4 lg:grid-cols-[1fr_300px]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#071653] p-7 text-white sm:p-10">
            <div className="absolute -bottom-28 -right-10 h-72 w-72 rounded-full bg-[#6264b5]/40 blur-3xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#d9c8e8]">
                <Ticket className="h-4 w-4" /> Dompet digital
              </p>
              <h1 className="mt-4 max-w-xl text-4xl font-extrabold leading-tight sm:text-5xl">Tiket konsermu, selalu dekat.</h1>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
                Tampilkan QR di gate, cek detail acara, atau unduh tiket untuk akses offline.
              </p>
              <Link href="/home/events" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#c8b7db] px-5 py-3 text-xs font-extrabold text-[#071653] transition hover:bg-[#e2d5ec]">
                Temukan konser lain <Ticket className="h-4 w-4" />
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
            <div className="rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">Total tiket</p>
              <p className="mt-2 text-3xl font-extrabold">{tickets.length}</p>
              <p className="mt-1 text-xs text-[#5c6482]">Tersimpan di akunmu</p>
            </div>
            <div className="rounded-2xl border border-[#c7e0d1] bg-[#e6f1eb] p-5">
              <p className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-[#397557]">
                <CheckCircle2 className="h-4 w-4" /> Siap scan
              </p>
              <p className="mt-2 text-3xl font-extrabold text-[#245d43]">{activeTickets.length}</p>
              <p className="mt-1 text-xs text-[#397557]">Tiket acara mendatang</p>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-4 shadow-[0_12px_35px_-28px_rgba(7,22,83,.25)] sm:p-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <label className="flex max-w-xl flex-1 items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4 py-3 focus-within:border-[#6264b5]">
              <Search className="h-4 w-4 text-[#6264b5]" />
              <span className="sr-only">Cari tiket</span>
              <input
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari nama konser, lokasi, atau kode tiket"
                className="w-full bg-transparent text-sm outline-none placeholder:text-[#8790a8]"
              />
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
          <p className="leading-6">Simpan QR tiket di perangkatmu sebelum berangkat. Tunjukkan kode asli pada petugas gate dan jangan bagikan tangkapan layar tiket.</p>
        </aside>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
