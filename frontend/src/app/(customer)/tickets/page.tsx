"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Clock,
  Compass,
  Info,
  MapPin,
  Plus,
  QrCode,
  RefreshCw,
  Search,
  ShieldCheck,
  Ticket,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { QRTicket } from "@/features/tickets-user/components/QRTicket";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { fetchMyTickets } from "@/features/tickets-user/api";
import type { UserTicket } from "@/features/tickets-user/types";
import { getApiErrorMessage } from "@/lib/apiError";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "used">("all");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setLoadError("");

    fetchMyTickets()
      .then((data) => {
        if (active) {
          setTickets(data);
          setLoadError("");
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(getApiErrorMessage(requestError, "Gagal memuat tiket digital. Silakan coba lagi."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [reloadKey]);

  // Statistics
  const activeTickets = useMemo(() => tickets.filter((t) => t.status === "active"), [tickets]);
  const usedTickets = useMemo(() => tickets.filter((t) => t.status === "used"), [tickets]);

  // Filtered tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((ticket) => {
      const matchStatus =
        statusFilter === "all" ? true : ticket.status === statusFilter;

      const query = searchQuery.toLowerCase().trim();
      const matchQuery =
        !query ||
        ticket.event.title.toLowerCase().includes(query) ||
        ticket.ticket_code.toLowerCase().includes(query) ||
        (ticket.event.location && ticket.event.location.toLowerCase().includes(query)) ||
        (ticket.event.venue && ticket.event.venue.toLowerCase().includes(query));

      return matchStatus && matchQuery;
    });
  }, [tickets, statusFilter, searchQuery]);

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] page-enter selection:bg-[#ffb703]/30 selection:text-white">
      <Navbar />

      <main className="relative flex-1 overflow-hidden">
        {/* Background Ambient Glows & Grid */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#ffb703]/[0.05] blur-[120px] animate-[drift-a_18s_ease-in-out_infinite_alternate]" />
          <div className="absolute right-0 top-32 h-[350px] w-[350px] rounded-full bg-[#6801d1]/[0.07] blur-[100px] animate-[drift-b_22s_ease-in-out_infinite_alternate]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.02)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />
        </div>

        <div className="relative z-10 mx-auto w-full max-w-6xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
          {/* Header Banner */}
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-[#232733]/80 pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Dompet E-Ticket Digital</span>
                </div>
                <h1 className="mt-3 text-3xl font-black tracking-tight text-[#e1e2ec] sm:text-4xl">
                  Tiket Konser{" "}
                  <span className="bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] bg-clip-text text-transparent">
                    Saya
                  </span>
                </h1>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-[#8a8d98]">
                  Akses QR code tiket digitalmu kapan saja. Tunjukkan langsung ke barcode scanner petugas di gate panggung.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href="/events"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 press"
                >
                  <Plus className="h-4 w-4" />
                  <span>Cari Konser Baru</span>
                </Link>
              </div>
            </div>
          </Reveal>

          {/* Quick Metrics & Tips Bar */}
          {!loading && !loadError && tickets.length > 0 ? (
            <Reveal delay={80}>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#232733] bg-[#14161f] p-4.5 shadow-lg">
                  <div className="flex items-center justify-between text-[#8a8d98]">
                    <span className="text-xs font-medium">Total E-Ticket</span>
                    <Ticket className="h-4 w-4 text-[#ffb703]" />
                  </div>
                  <p className="numeral mt-2 text-2xl font-black text-[#e1e2ec]">{tickets.length}</p>
                  <p className="mt-1 text-[11px] text-[#7a7d88]">Tersimpan aman di akunmu</p>
                </div>

                <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.04] p-4.5 shadow-lg">
                  <div className="flex items-center justify-between text-emerald-300">
                    <span className="text-xs font-semibold">Siap Scan di Gate</span>
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <p className="numeral mt-2 text-2xl font-black text-emerald-300">{activeTickets.length}</p>
                  <p className="mt-1 text-[11px] text-emerald-400/80">Tiket valid untuk konser mendatang</p>
                </div>

                <div className="rounded-2xl border border-[#232733] bg-[#14161f] p-4.5 shadow-lg">
                  <div className="flex items-center justify-between text-[#8a8d98]">
                    <span className="text-xs font-medium">Sudah Digunakan</span>
                    <CheckCircle2 className="h-4 w-4 text-[#8a8d98]" />
                  </div>
                  <p className="numeral mt-2 text-2xl font-black text-[#e1e2ec]">{usedTickets.length}</p>
                  <p className="mt-1 text-[11px] text-[#7a7d88]">Riwayat panggung selesai</p>
                </div>
              </div>
            </Reveal>
          ) : null}

          {/* Search & Filter Tabs */}
          {!loading && !loadError && tickets.length > 0 ? (
            <Reveal delay={120}>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#ffb703]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama konser, venue, atau kode tiket..."
                    className="w-full rounded-xl border border-[#232733] bg-[#14161f] py-2.5 pl-10 pr-4 text-xs text-[#e1e2ec] outline-none transition focus:border-[#ffb703]/50 focus:ring-2 focus:ring-[#ffb703]/10 placeholder:text-[#525666]"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8a8d98] hover:text-white"
                    >
                      &times;
                    </button>
                  )}
                </div>

                {/* Status Tabs */}
                <div className="flex items-center gap-1.5 rounded-xl border border-[#232733] bg-[#14161f] p-1">
                  <button
                    type="button"
                    onClick={() => setStatusFilter("all")}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                      statusFilter === "all"
                        ? "bg-[#ffb703] text-[#10131a] shadow-md shadow-[#ffb703]/20"
                        : "text-[#8a8d98] hover:text-[#e1e2ec]"
                    }`}
                  >
                    Semua ({tickets.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("active")}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                      statusFilter === "active"
                        ? "bg-[#ffb703] text-[#10131a] shadow-md shadow-[#ffb703]/20"
                        : "text-[#8a8d98] hover:text-[#e1e2ec]"
                    }`}
                  >
                    Siap Scan ({activeTickets.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter("used")}
                    className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                      statusFilter === "used"
                        ? "bg-[#ffb703] text-[#10131a] shadow-md shadow-[#ffb703]/20"
                        : "text-[#8a8d98] hover:text-[#e1e2ec]"
                    }`}
                  >
                    Sudah Digunakan ({usedTickets.length})
                  </button>
                </div>
              </div>
            </Reveal>
          ) : null}

          {/* Ticket Listing Content */}
          <div className="mt-8">
            {loading ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-[#232733] bg-[#14161f]/70 py-20 text-center">
                <div className="relative mb-4 flex h-14 w-14 items-center justify-center">
                  <span className="absolute inset-0 rounded-full border border-[#ffb703]/20" />
                  <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#ffb703]" />
                  <Ticket className="h-6 w-6 text-[#ffb703] animate-pulse" />
                </div>
                <p className="text-sm font-semibold text-[#e1e2ec]">Memuat E-Ticket Digital...</p>
                <p className="mt-1 text-xs text-[#8a8d98]">Menghubungkan ke server gate Tixora</p>
              </div>
            ) : loadError ? (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-rose-500/20 bg-rose-500/[0.05] p-8 text-center sm:p-12">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-500/10 text-rose-300">
                  <Info className="h-6 w-6" />
                </div>
                <h3 className="text-base font-bold text-rose-200">Gagal Memuat Tiket</h3>
                <p className="mt-1 max-w-md text-xs leading-relaxed text-[#8a8d98]">{loadError}</p>
                <button
                  type="button"
                  onClick={() => setReloadKey((k) => k + 1)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-2.5 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9] press"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Coba Muat Ulang
                </button>
              </div>
            ) : tickets.length > 0 ? (
              filteredTickets.length > 0 ? (
                <Stagger className="space-y-8" step={90}>
                  {filteredTickets.map((ticket) => (
                    <QRTicket key={ticket.id} ticket={ticket} />
                  ))}
                </Stagger>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#232733] bg-[#14161f]/60 py-16 text-center">
                  <Search className="h-8 w-8 text-[#ffb703]" />
                  <h3 className="mt-3 text-sm font-bold text-[#e1e2ec]">Tidak ada tiket yang cocok</h3>
                  <p className="mt-1 text-xs text-[#8a8d98]">
                    Tidak ditemukan tiket dengan filter atau kata kunci &quot;{searchQuery}&quot;.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setStatusFilter("all");
                    }}
                    className="mt-4 text-xs font-bold text-[#ffb703] hover:underline"
                  >
                    Reset Filter
                  </button>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-[#232733] bg-[#14161f]/60 py-20 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffb703]/10 text-[#ffb703] ring-1 ring-[#ffb703]/25">
                  <Ticket className="h-8 w-8" />
                </div>
                <h3 className="text-lg font-bold text-[#e1e2ec]">Belum Memiliki Tiket Konser</h3>
                <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-[#8a8d98]">
                  Tiket konser yang telah lunas akan otomatis muncul di halaman ini lengkap dengan kode QR gate check-in.
                </p>
                <Link
                  href="/events"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-6 py-3 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:bg-[#ffdea9] press"
                >
                  <Ticket className="h-4 w-4" />
                  <span>Jelajahi Konser Sekarang</span>
                </Link>
              </div>
            )}
          </div>

          {/* Gate Entry Protocol / Tips Section */}
          <Reveal delay={160}>
            <div className="mt-14 rounded-3xl border border-[#232733] bg-[#14161f]/90 p-6 sm:p-8">
              <div className="flex items-center gap-2.5 text-[#ffb703]">
                <ShieldCheck className="h-5 w-5" />
                <h4 className="text-sm font-bold uppercase tracking-wider text-[#e1e2ec]">
                  Panduan Masuk Gate Konser
                </h4>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#232733] bg-[#10131a] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#ffb703]/10 text-[#ffb703] text-xs font-bold">
                    01
                  </div>
                  <h5 className="mt-3 text-xs font-bold text-[#e1e2ec]">Kecerahan Layar 100%</h5>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#8a8d98]">
                    Tingkatkan kecerahan layar smartphone ke tingkat maksimal saat mendekati meja scanner gate.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#232733] bg-[#10131a] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#d5baff]/10 text-[#d5baff] text-xs font-bold">
                    02
                  </div>
                  <h5 className="mt-3 text-xs font-bold text-[#e1e2ec]">Siapkan Kartu Identitas</h5>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#8a8d98]">
                    Pastikan nama pemegang tiket sesuai dengan kartu identitas sah (e-KTP, SIM, atau Paspor).
                  </p>
                </div>

                <div className="rounded-2xl border border-[#232733] bg-[#10131a] p-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#38bdf8]/10 text-[#38bdf8] text-xs font-bold">
                    03
                  </div>
                  <h5 className="mt-3 text-xs font-bold text-[#e1e2ec]">Simpan Salinan Offline</h5>
                  <p className="mt-1 text-[11px] leading-relaxed text-[#8a8d98]">
                    Gunakan tombol &quot;Unduh QR&quot; untuk menyimpan gambar tiket di galeri jika sinyal di venue padat.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
