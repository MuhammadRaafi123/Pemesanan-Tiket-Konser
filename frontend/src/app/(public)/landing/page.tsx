"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  CreditCard,
  Eye,
  Heart,
  MapPin,
  QrCode,
  Search,
  Shield,
  Sparkles,
  Star,
  Ticket,
  Users,
  Zap,
  Play,
  Music,
  Mic2,
  Headphones,
  Radio,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { Marquee } from "@/components/shared/Marquee";
import { CountUp } from "@/components/shared/CountUp";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { useAuthStore } from "@/stores/authStore";

const FEATURES = [
  { icon: QrCode, title: "Dynamic Anti-Calo Barcode", desc: "QR Code berubah setiap 30 detik untuk mencegah pemalsuan, duplikasi PDF screenshot, dan sindikat calo tiket.", tag: "ISO 27001", color: "#ffb703" },
  { icon: CreditCard, title: "Pembayaran Lokal Instan", desc: "QRIS, Virtual Account semua bank nasional, GoPay, OVO, hingga cicilan 0% kartu kredit.", tag: "Verifikasi Instan", color: "#d5baff" },
  { icon: Shield, title: "Garansi Refund Penuh", desc: "Perlindungan pengembalian dana 100% jika artis berhalangan hadir atau konser batal.", tag: "Proteksi Finansial", color: "#ffd9c0" },
  { icon: Users, title: "Wristband Express Pickup", desc: "Penukaran gelang konser cepat melalui jalur express scan booth di mall mitra H-3.", tag: "Nol Antrian", color: "#ffdea9" },
];

const TESTIMONIALS = [
  { name: "Audrey Kirana", role: "GBK Jakarta", text: "War tiket Ed Sheeran kemarin beneran lancar! Sistem antriannya transparan ada progress bar-nya. Begitu dapat giliran langsung bayar pakai QRIS, gak sampe 2 menit tiket langsung masuk akun.", rating: 5 },
  { name: "Dimas Wicaksono", role: "ICE BSD", text: "Paling suka fitur Dynamic Barcode-nya. Aman banget dari oknum yang suka nyolong tiket orang. Pas hari H cuma tap barcode di gate langsung bunyi beep dan gelang terpasang.", rating: 5 },
  { name: "Farhan & Nadia", role: "GWK Bali", text: "Paket VIP Hospitality di Bali kemarin luar biasa. Dapat soundcheck pass plus exclusive merch totebag. Customer service WhatsApp juga responsif banget.", rating: 5 },
];

/* ================================ components ================================ */

function CountdownBox({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div className={`flex flex-col items-center rounded-lg py-2.5 transition-all ${highlight ? "bg-[#ffb703]/10 ring-1 ring-[#ffb703]/30" : "bg-[#1e2128] hover:bg-[#272a32]"}`}>
      <span className={`numeral text-lg countdown-tick ${highlight ? "text-[#ffb703]" : "text-[#e1e2ec]"}`}>{value}</span>
      <span className="text-[10px] uppercase tracking-wider text-[#7a7d88]">{label}</span>
    </div>
  );
}

function TicketCard({ event, index }: { event: Event; index: number }) {
  const minPrice = event.min_price ?? 0;
  const poster = resolveMediaUrl(event.poster || "");

  return (
    <Reveal delay={index * 70}>
      <Link
        href={`/events/${event.id}`}
        className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] transition-all duration-300 hover:-translate-y-1.5 hover:border-[#ffb703]/30 hover:shadow-2xl hover:shadow-black/50 hover-sheen"
      >
        <div className="relative h-52 overflow-hidden">
          {poster ? (
            <Image src={poster} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-105 zoom-media" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#1e2128]">
              <Ticket className="h-12 w-12 text-[#2a2d36]" />
            </div>
          )}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-[#191b23]" style={{ maskImage: "linear-gradient(to top, black, transparent)", WebkitMaskImage: "linear-gradient(to top, black, transparent)" }} />
          <div className="absolute left-3 top-3">
            <span className="inline-flex items-center gap-1.5 rounded bg-[#ffb703] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#10131a]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10131a]" />
              Presale
            </span>
          </div>
          <div className="absolute right-3 top-3">
            <span className="rounded bg-[#0b0e15]/85 px-2.5 py-1 text-[10px] font-semibold text-[#e1e2ec]">
              Sisa {event.total_remaining ?? 0}
            </span>
          </div>
          <div className="absolute inset-x-3 bottom-3 flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 rounded bg-[#272a32]/90 px-2.5 py-1 text-[#e1e2ec]">
              <CalendarDays className="h-3 w-3 text-[#ffb703]" />
              {formatEventDate(event.event_date, { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="rounded bg-[#272a32]/90 px-2.5 py-1 text-[#e1e2ec]">{event.location}</span>
          </div>
        </div>
        <div className="relative z-10 -my-2 flex items-center justify-between px-3">
          <span className="h-4 w-4 rounded-full bg-[#0b0e15] ring-2 ring-[#232733]" />
          <span className="h-0 flex-1 border-t-2 border-dashed border-[#2a2d36]" />
          <span className="h-4 w-4 rounded-full bg-[#0b0e15] ring-2 ring-[#232733]" />
        </div>
        <div className="flex flex-1 flex-col gap-2.5 p-4 pt-1.5">
          <div>
            <p className="truncate text-[10px] uppercase tracking-wider text-[#d5baff]">
              {event.artist_names?.join(", ") || "Live Experience"}
            </p>
            <h3 className="mt-0.5 truncate text-lg font-bold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">{event.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8a8d98]">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#ffb703]" />
              <span className="truncate">{event.venue || event.location}</span>
            </p>
          </div>
          {event.ticket_categories && event.ticket_categories.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {event.ticket_categories.slice(0, 3).map((cat) => (
                <span key={cat.id} className="rounded border border-[#2a2d36] bg-[#1e2128] px-2 py-0.5 text-[10px] text-[#8a8d98]">
                  {cat.category_name}
                </span>
              ))}
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-between pt-3">
            <div>
              <span className="text-[10px] text-[#8a8d98]">Mulai</span>
              <p className="text-lg font-bold text-[#ffb703]">{formatCurrency(minPrice)}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffb703] px-4 py-2 text-xs font-bold text-[#10131a] transition-colors group-hover:bg-[#ffdea9] press">
              Beli Tiket
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ================================== page ================================== */

export default function LandingPage() {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [countdown, setCountdown] = useState({ d: "02", h: "14", m: "25", s: "33" });

  useEffect(() => {
    let active = true;
    fetchEvents({ limit: 6, status: "open" })
      .then((data) => { if (active) setEvents(data); })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let s = 33, m = 25, h = 14, d = 2;
    const id = setInterval(() => {
      if (s > 0) s--;
      else { s = 59; if (m > 0) m--; else { m = 59; if (h > 0) h--; else { h = 23; if (d > 0) d--; } } }
      setCountdown({ d: String(d).padStart(2, "0"), h: String(h).padStart(2, "0"), m: String(m).padStart(2, "0"), s: String(s).padStart(2, "0") });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const filteredEvents = events.filter((e) => {
    const matchSearch = !searchQuery || e.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchGenre = selectedGenre === "Semua" || (e.genre || "").toLowerCase().includes(selectedGenre.toLowerCase());
    return matchSearch && matchGenre;
  });

  const featuredEvent = events.find((e) => e.featured) || events[0];

  return (
    <div className="min-h-screen bg-[#0b0e15] text-[#e1e2ec] page-enter">
      <Navbar />

      <main>
        {/* ==================== HERO ==================== */}
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-36">
          {/* Background accents */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-40 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[#ffb703]/[0.06] blur-[120px] animate-[drift-a_18s_ease-in-out_infinite_alternate]" />
            <div className="absolute right-0 top-20 h-[300px] w-[300px] rounded-full bg-[#6801d1]/[0.08] blur-[100px] animate-[drift-b_22s_ease-in-out_infinite_alternate]" />
            <div className="absolute bottom-0 left-0 h-[200px] w-[400px] rounded-full bg-[#ffb703]/[0.03] blur-[80px] animate-[drift-a_20s_ease-in-out_infinite_alternate-reverse]" />
            {/* Animated grid */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
            {/* Floating particles */}
            <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-[#ffb703]/30 animate-[float-slow_7s_ease-in-out_infinite]" />
            <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-[#d5baff]/30 animate-[float-slow_9s_ease-in-out_infinite_1s]" />
            <div className="absolute bottom-1/4 left-1/2 h-1 w-1 rounded-full bg-[#ffdea9]/30 animate-[float-slow_11s_ease-in-out_infinite_2s]" />
          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Left: Copy */}
              <div className="space-y-6 lg:col-span-7">
                <Reveal>
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/20 bg-[#ffb703]/[0.08] px-4 py-2 backdrop-blur-sm">
                    <span className="relative flex h-2 w-2 pulse-dot">
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ffb703]" />
                    </span>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#ffb703]">
                      Tiket Konser Resmi Indonesia
                    </span>
                  </div>
                </Reveal>

                <Reveal delay={80}>
                  <h1 className="text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.04] tracking-tight">
                    Konser Impianmu,
                    <br />
                    <span className="bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] bg-clip-text text-transparent">
                      Satu Klik Saja.
                    </span>
                  </h1>
                </Reveal>

                <Reveal delay={160}>
                  <p className="max-w-xl text-base leading-relaxed text-[#8a8d98] sm:text-lg">
                    Platform tiket konser terpercaya dengan QR anti-calo, pembayaran instan,
                    dan garansi refund 100%. Dari Coldplay sampai Sheila On 7.
                  </p>
                </Reveal>

                <Reveal delay={240}>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/events"
                      className="group inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-7 py-3.5 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/25 transition-all hover:-translate-y-0.5 hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 press"
                    >
                      {user ? "Cari konser berikutnya" : "Jelajahi Konser"}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <Link
                      href={user ? "/home" : "/register"}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-7 py-3.5 text-sm font-semibold text-[#e1e2ec] transition-all hover:border-[#ffb703]/40 hover:text-[#ffb703] press"
                    >
                      {user ? "Buka dashboard" : "Daftar Gratis"}
                    </Link>
                  </div>
                </Reveal>

                <Reveal delay={320}>
                  <div className="flex items-center gap-6 pt-2">
                    <div className="group">
                      <p className="text-2xl font-extrabold text-[#e1e2ec] group-hover:text-[#ffb703] transition-colors">
                        <CountUp value={1200000} format={(v) => `${(v / 1000000).toFixed(1)}M+`} />
                      </p>
                      <p className="text-xs text-[#8a8d98]">Tiket Terjual</p>
                    </div>
                    <div className="h-10 w-px bg-[#232733]" />
                    <div className="group">
                      <p className="text-2xl font-extrabold text-[#e1e2ec] group-hover:text-[#ffb703] transition-colors">
                        <CountUp value={45} format={(v) => `${v}+`} />
                      </p>
                      <p className="text-xs text-[#8a8d98]">Promotor Partner</p>
                    </div>
                    <div className="h-10 w-px bg-[#232733]" />
                    <div className="group">
                      <p className="text-2xl font-extrabold text-[#ffb703] group-hover:text-[#ffdea9] transition-colors">4.9</p>
                      <p className="text-xs text-[#8a8d98]">Rating Pengguna</p>
                    </div>
                  </div>
                </Reveal>
              </div>

              {/* Right: Featured Event Card */}
              <Reveal delay={200} className="lg:col-span-5">
                {featuredEvent ? (
                  <div className="relative group hover-sheen">
                    <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#ffb703]/20 via-transparent to-[#6801d1]/20 blur-2xl transition-all duration-500 group-hover:from-[#ffb703]/30 group-hover:to-[#6801d1]/30" />
                    <div className="relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] transition-all duration-500 group-hover:border-[#ffb703]/30">
                      {/* Poster */}
                      <div className="relative h-64 overflow-hidden">
                        {resolveMediaUrl(featuredEvent.poster || "") ? (
                          <Image
                            src={resolveMediaUrl(featuredEvent.poster || "")}
                            alt={featuredEvent.title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 40vw"
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-[#1e2128]">
                            <Ticket className="h-16 w-16 text-[#2a2d36]" />
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#191b23] to-transparent" />
                        <div className="absolute left-4 top-4">
                          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffb703] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10131a]">
                            <Star className="h-3 w-3" />
                            Featured
                          </span>
                        </div>
                        {/* Floating play button */}
                        <div className="absolute bottom-4 right-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#ffb700]/20 backdrop-blur-sm border border-[#ffb700]/30 transition-all duration-300 group-hover:bg-[#ffb700]/30 group-hover:scale-110 press">
                            <Play className="h-5 w-5 text-[#ffb703] ml-0.5" />
                          </div>
                        </div>
                        {/* Scan line effect */}
                        <div className="scan-line" />
                      </div>

                      {/* Info */}
                      <div className="space-y-4 p-5">
                        <div>
                          <p className="text-[11px] uppercase tracking-wider text-[#d5baff]">
                            {featuredEvent.artist_names?.join(", ") || "Live Experience"}
                          </p>
                          <h3 className="mt-1 text-xl font-bold text-[#e1e2ec] group-hover:text-[#ffb703] transition-colors">{featuredEvent.title}</h3>
                        </div>

                        {/* Countdown */}
                        <div className="rounded-xl bg-[#1d1f27] p-3.5 border border-[#232733]">
                          <div className="mb-2 flex items-center justify-between text-xs">
                            <span className="uppercase tracking-wider text-[#8a8d98]">Presale Fase 2</span>
                            <span className="font-semibold text-[#ffb703]">Sisa {featuredEvent.total_remaining ?? 0}</span>
                          </div>
                          <div className="grid grid-cols-4 gap-1.5">
                            <CountdownBox value={countdown.d} label="Hari" />
                            <CountdownBox value={countdown.h} label="Jam" />
                            <CountdownBox value={countdown.m} label="Mnt" />
                            <CountdownBox value={countdown.s} label="Dtk" highlight />
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] text-[#8a8d98]">Mulai Dari</span>
                            <p className="text-lg font-bold text-[#ffb703]">{formatCurrency(featuredEvent.min_price ?? 0)}</p>
                          </div>
                          <Link
                            href={`/events/${featuredEvent.id}`}
                            className="inline-flex items-center gap-2 rounded-lg bg-[#ffb703] px-5 py-2.5 text-xs font-bold text-[#10131a] transition-all hover:bg-[#ffdea9] hover:shadow-lg hover:shadow-[#ffb703]/20 press"
                          >
                            Lihat Detail
                            <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </Reveal>
            </div>

            {/* Search Bar */}
            <Reveal delay={400}>
              <div className="mt-14 rounded-2xl border border-[#232733] bg-[#191b23]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl lg:p-5 hover-sheen">
                <form className="grid items-center gap-3 sm:grid-cols-2 lg:grid-cols-12" onSubmit={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3 transition-all focus-within:border-[#ffb703]/50 focus-within:ring-2 focus-within:ring-[#ffb703]/10 lg:col-span-5">
                    <Search className="h-4 w-4 shrink-0 text-[#ffb703]" />
                    <div className="w-full">
                      <label className="block text-[10px] uppercase tracking-wider text-[#514532]">Cari Artis / Konser</label>
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Coldplay, Sheila On 7, NIKI..."
                        className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3 transition-all focus-within:border-[#d5baff]/50 focus-within:ring-2 focus-within:ring-[#d5baff]/10 lg:col-span-3">
                    <MapPin className="h-4 w-4 shrink-0 text-[#d5baff]" />
                    <div className="w-full">
                      <label className="block text-[10px] uppercase tracking-wider text-[#514532]">Kota</label>
                      <select className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none">
                        <option>Semua Kota</option>
                        <option>Jakarta</option>
                        <option>Bandung</option>
                        <option>Surabaya</option>
                        <option>Bali</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3 transition-all focus-within:border-[#ffb703]/50 focus-within:ring-2 focus-within:ring-[#ffb703]/10 lg:col-span-2">
                    <Sparkles className="h-4 w-4 shrink-0 text-[#ffdea9]" />
                    <div className="w-full">
                      <label className="block text-[10px] uppercase tracking-wider text-[#514532]">Genre</label>
                      <select
                        value={selectedGenre}
                        onChange={(e) => setSelectedGenre(e.target.value)}
                        className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none"
                      >
                        <option>Semua</option>
                        <option>Pop</option>
                        <option>Rock</option>
                        <option>K-Pop</option>
                        <option>Jazz</option>
                      </select>
                    </div>
                  </div>

                  <div className="lg:col-span-2">
                    <button
                      type="submit"
                      className="inline-flex h-full min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#ffb703] px-5 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 hover:-translate-y-0.5 press"
                    >
                      <Search className="h-4 w-4" />
                      Cari
                    </button>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==================== ARTIST MARQUEE ==================== */}
        <section className="w-full overflow-hidden border-y border-[#1e2128] py-5 bg-[#0e1118] relative">
          {/* Gradient overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#0e1118] to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#0e1118] to-transparent z-10" />
          <Marquee
            items={["Sheila On 7", "Stray Kids", "Ed Sheeran", "Coldplay", "Bruno Major", "Raim Laode", "NIKI", "Tulus", "Hindia", "Payung Teduh"]}
            className="text-xs font-bold uppercase tracking-[0.25em] text-[#3a3d46] hover:text-[#ffb703] transition-colors"
          />
        </section>

        {/* ==================== UPCOMING CONCERTS ==================== */}
        <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8 relative">
          {/* Background accent */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-[#ffb703]/[0.02] blur-[100px]" />
          </div>
          <Reveal className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end relative">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#ffb703]">Jadwal Terbaru</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-4xl">
                Konser yang Akan Datang
              </h2>
            </div>
            <Link
              href="/events"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-[#ffb703] transition-colors hover:text-[#ffdea9]"
            >
              Lihat Semua
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>

          {loading ? (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={70}>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-96 animate-pulse rounded-2xl border border-[#1e2128] bg-[#191b23]/60" />
              ))}
            </Stagger>
          ) : filteredEvents.length > 0 ? (
            <Stagger className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" step={70}>
              {filteredEvents.slice(0, 6).map((event: Event, i: number) => (
                <TicketCard key={event.id} event={event} index={i} />
              ))}
            </Stagger>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2a2d36] bg-[#191b23]/50 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#ffb700]/10">
                <Ticket className="h-8 w-8 text-[#ffb703]" />
              </div>
              <p className="text-sm text-[#8a8d98]">Tidak ada konser yang cocok dengan filter.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedGenre("Semua"); }}
                className="mt-4 text-xs font-semibold text-[#ffb703] hover:text-[#ffdea9] transition-colors"
              >
                Reset Filter
              </button>
            </div>
          )}
        </section>

        {/* ==================== GENRE EXPLORE ==================== */}
        <section className="w-full border-y border-[#1e2128] bg-[#0e1118] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-10">
              <p className="text-[11px] uppercase tracking-widest text-[#d5baff]">Jelajahi</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-4xl">
                Pilih Berdasarkan Genre
              </h2>
            </Reveal>

            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5" step={60}>
              {[
                { label: "K-Pop", icon: Heart, count: "8 Konser", color: "#d5baff" },
                { label: "Rock & Indie", icon: Zap, count: "14 Konser", color: "#ffb703" },
                { label: "Festival", icon: Sparkles, count: "6 Event", color: "#ffd9c0" },
                { label: "EDM", icon: Star, count: "11 Event", color: "#d5baff" },
                { label: "Jazz", icon: Eye, count: "5 Jadwal", color: "#ffdea9" },
              ].map(({ label, icon: Icon, count, color }: { label: string; icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>; count: string; color: string }) => (
                <Link
                  key={label}
                  href="/events"
                  className="group relative flex items-center gap-3 rounded-xl border border-[#232733] bg-[#191b23] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/25 hover:shadow-xl hover:shadow-black/40 overflow-hidden hover-sheen"
                >
                  {/* Hover glow effect */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at 50% 50%, ${color}10, transparent 70%)` }}
                  />
                  {/* Soundwave animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end justify-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1 rounded-t-full origin-bottom"
                        style={{
                          backgroundColor: color,
                          height: '100%',
                          animation: `soundwave 1.2s ease-in-out ${i * 0.1}s infinite`,
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </span>
                  <div className="relative">
                    <h3 className="text-sm font-semibold text-[#e1e2ec] group-hover:text-white transition-colors">{label}</h3>
                    <p className="text-[11px] text-[#8a8d98]">{count}</p>
                  </div>
                </Link>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ==================== SEAT MAP 3D ==================== */}
        <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] shadow-2xl shadow-black/20 hover-sheen">
                <div className="flex items-center justify-between border-b border-[#1e2128] px-5 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-[#ffb703]">Seat Map 3D Interaktif</p>
                    <h4 className="mt-0.5 text-base font-bold text-[#e1e2ec]">Stadion GBK — Jakarta</h4>
                  </div>
                  <div className="flex items-center gap-2 rounded-lg border border-[#232733] bg-[#1d1f27] px-3 py-1.5">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                    <span className="text-[11px] font-semibold text-[#e1e2ec]">Live</span>
                  </div>
                </div>

                {/* 3D Stage Container */}
                <div className="relative flex aspect-[16/10] w-full items-center justify-center bg-[#0b0e15] p-6 overflow-hidden">
                  {/* 3D Perspective Container */}
                  <div className="relative w-full max-w-[500px] h-[280px]" style={{ perspective: '1200px' }}>
                    {/* 3D Scene */}
                    <div 
                      className="absolute inset-0 flex items-center justify-center"
                      style={{ 
                        transformStyle: 'preserve-3d',
                        animation: 'stage-float 8s ease-in-out infinite',
                      }}
                    >
                      {/* Stage Platform - 3D */}
                      <div 
                        className="relative"
                        style={{ 
                          transformStyle: 'preserve-3d',
                          transform: 'rotateX(55deg) rotateZ(-45deg)',
                          animation: 'stage-rotate 25s linear infinite',
                        }}
                      >
                        {/* Main Stage Floor */}
                        <div 
                          className="absolute w-[200px] h-[200px] rounded-lg border-2 border-[#ffb703]/60"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,183,3,0.2) 0%, rgba(255,183,3,0.08) 50%, rgba(104,1,209,0.1) 100%)',
                            transform: 'translateZ(0px)',
                            boxShadow: '0 0 60px rgba(255,183,3,0.3), inset 0 0 80px rgba(255,183,3,0.15)',
                          }}
                        />
                        {/* Stage Back Wall */}
                        <div 
                          className="absolute w-[200px] h-[80px] rounded-t-lg"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,183,3,0.4) 0%, rgba(104,1,209,0.2) 100%)',
                            transform: 'translateZ(40px) translateY(-40px)',
                            border: '2px solid rgba(255,183,3,0.5)',
                            borderBottom: 'none',
                            boxShadow: '0 0 40px rgba(255,183,3,0.2)',
                          }}
                        />
                        {/* Stage Left Wing */}
                        <div 
                          className="absolute w-[60px] h-[200px] rounded-l-lg"
                          style={{
                            background: 'linear-gradient(90deg, rgba(255,183,3,0.3) 0%, rgba(104,1,209,0.15) 100%)',
                            transform: 'translateZ(20px) translateX(-80px) rotateY(90deg)',
                            border: '2px solid rgba(255,183,3,0.4)',
                            borderRight: 'none',
                          }}
                        />
                        {/* Stage Right Wing */}
                        <div 
                          className="absolute w-[60px] h-[200px] rounded-r-lg"
                          style={{
                            background: 'linear-gradient(-90deg, rgba(255,183,3,0.3) 0%, rgba(104,1,209,0.15) 100%)',
                            transform: 'translateZ(20px) translateX(220px) rotateY(-90deg)',
                            border: '2px solid rgba(255,183,3,0.4)',
                            borderLeft: 'none',
                          }}
                        />
                        {/* Stage Top */}
                        <div 
                          className="absolute w-[200px] h-[200px] rounded-lg"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,183,3,0.35) 0%, rgba(104,1,209,0.2) 100%)',
                            transform: 'translateZ(80px)',
                            border: '2px solid rgba(255,183,3,0.6)',
                            boxShadow: '0 0 60px rgba(255,183,3,0.25)',
                          }}
                        />
                        {/* Stage Center Light */}
                        <div 
                          className="absolute w-[50px] h-[50px] rounded-full"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,183,3,0.9) 0%, rgba(104,1,209,0.4) 50%, transparent 70%)',
                            transform: 'translateZ(90px) translateX(75px) translateY(75px)',
                            animation: 'pulse-glow 2s ease-in-out infinite',
                          }}
                        />
                        {/* Stage Decorative Rings */}
                        <div 
                          className="absolute w-[120px] h-[120px] rounded-full border border-[#ffb703]/30"
                          style={{
                            transform: 'translateZ(1px) translateX(40px) translateY(40px)',
                            animation: 'ripple 3s ease-out infinite',
                          }}
                        />
                        <div 
                          className="absolute w-[160px] h-[160px] rounded-full border border-[#6801d1]/20"
                          style={{
                            transform: 'translateZ(2px) translateX(20px) translateY(20px)',
                            animation: 'ripple 3s ease-out infinite 1s',
                          }}
                        />
                      </div>

                      {/* Audience Area - 3D */}
                      <div 
                        className="absolute"
                        style={{ 
                          transformStyle: 'preserve-3d',
                          transform: 'rotateX(55deg) rotateZ(-45deg) translateY(120px)',
                        }}
                      >
                        {/* Festival Floor */}
                        <div 
                          className="absolute w-[300px] h-[150px] rounded-lg border-2 border-[#ffb703]/40"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,183,3,0.12) 0%, rgba(104,1,209,0.06) 100%)',
                            transform: 'translateZ(-10px)',
                            boxShadow: 'inset 0 0 50px rgba(255,183,3,0.08)',
                          }}
                        />
                        {/* Tribune Left */}
                        <div 
                          className="absolute w-[80px] h-[150px] rounded-l-lg border-2 border-[#d5baff]/40"
                          style={{
                            background: 'linear-gradient(90deg, rgba(213,186,255,0.15) 0%, rgba(213,186,255,0.04) 100%)',
                            transform: 'translateZ(-5px) translateX(-190px)',
                          }}
                        />
                        {/* Tribune Right */}
                        <div 
                          className="absolute w-[80px] h-[150px] rounded-r-lg border-2 border-[#d5baff]/40"
                          style={{
                            background: 'linear-gradient(-90deg, rgba(213,186,255,0.15) 0%, rgba(213,186,255,0.04) 100%)',
                            transform: 'translateZ(-5px) translateX(310px)',
                          }}
                        />
                        {/* VIP Left */}
                        <div 
                          className="absolute w-[60px] h-[60px] rounded-lg border-2 border-[#ffd9c0]/50"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,217,192,0.2) 0%, rgba(255,217,192,0.08) 100%)',
                            transform: 'translateZ(5px) translateX(-100px) translateY(100px)',
                            boxShadow: '0 0 25px rgba(255,217,192,0.15)',
                          }}
                        />
                        {/* VIP Right */}
                        <div 
                          className="absolute w-[60px] h-[60px] rounded-lg border-2 border-[#ffd9c0]/50"
                          style={{
                            background: 'linear-gradient(135deg, rgba(255,217,192,0.2) 0%, rgba(255,217,192,0.08) 100%)',
                            transform: 'translateZ(5px) translateX(160px) translateY(100px)',
                            boxShadow: '0 0 25px rgba(255,217,192,0.15)',
                          }}
                        />
                      </div>

                      {/* Animated Light Beams */}
                      <div className="absolute inset-0 pointer-events-none overflow-hidden">
                        <div 
                          className="absolute top-0 left-1/4 w-[3px] h-full origin-top"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,183,3,0.8) 0%, rgba(255,183,3,0.2) 50%, transparent 100%)',
                            transform: 'rotate(-20deg)',
                            animation: 'light-beam 2.5s ease-in-out infinite alternate',
                            filter: 'blur(1px)',
                          }}
                        />
                        <div 
                          className="absolute top-0 right-1/4 w-[3px] h-full origin-top"
                          style={{
                            background: 'linear-gradient(180deg, rgba(104,1,209,0.8) 0%, rgba(104,1,209,0.2) 50%, transparent 100%)',
                            transform: 'rotate(20deg)',
                            animation: 'light-beam 2.5s ease-in-out infinite alternate-reverse',
                            filter: 'blur(1px)',
                          }}
                        />
                        <div 
                          className="absolute top-0 left-1/2 w-[2px] h-full origin-top"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,222,169,0.7) 0%, rgba(255,222,169,0.2) 50%, transparent 100%)',
                            transform: 'rotate(0deg)',
                            animation: 'light-beam 3.5s ease-in-out infinite alternate',
                            filter: 'blur(0.5px)',
                          }}
                        />
                        <div 
                          className="absolute top-0 left-[30%] w-[2px] h-full origin-top"
                          style={{
                            background: 'linear-gradient(180deg, rgba(213,186,255,0.6) 0%, transparent 100%)',
                            transform: 'rotate(-10deg)',
                            animation: 'light-beam 3s ease-in-out infinite alternate',
                            filter: 'blur(1px)',
                          }}
                        />
                        <div 
                          className="absolute top-0 right-[30%] w-[2px] h-full origin-top"
                          style={{
                            background: 'linear-gradient(180deg, rgba(255,217,192,0.6) 0%, transparent 100%)',
                            transform: 'rotate(10deg)',
                            animation: 'light-beam 3s ease-in-out infinite alternate-reverse',
                            filter: 'blur(1px)',
                          }}
                        />
                      </div>

                      {/* Floating Particles */}
                      <div className="absolute inset-0 pointer-events-none">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-1 h-1 rounded-full"
                            style={{
                              backgroundColor: i % 3 === 0 ? 'rgba(255,183,3,0.5)' : i % 3 === 1 ? 'rgba(104,1,209,0.5)' : 'rgba(213,186,255,0.5)',
                              left: `${5 + i * 5}%`,
                              top: `${15 + (i % 5) * 15}%`,
                              animation: `float-slow ${4 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`,
                            }}
                          />
                        ))}
                      </div>
                    </div>

                    {/* Ripple effect on stage */}
                    <div className="absolute top-[35%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                      <div className="h-10 w-10 rounded-full border-2 border-[#ffb703]/40 animate-[ripple_2s_ease-out_infinite]" />
                      <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-[#6801d1]/30 animate-[ripple_2s_ease-out_infinite_0.3s]" />
                      <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-[#ffb703]/20 animate-[ripple_2s_ease-out_infinite_0.6s]" />
                      <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-[#d5baff]/15 animate-[ripple_2s_ease-out_infinite_0.9s]" />
                      <div className="absolute inset-0 h-10 w-10 rounded-full border-2 border-[#ffb703]/10 animate-[ripple_2s_ease-out_infinite_1.2s]" />
                    </div>
                  </div>

                  {/* 3D Labels */}
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px]">
                    <span className="text-[#ffb703] font-semibold">STAGE</span>
                    <span className="text-[#d5baff] font-semibold">TRIBUNE</span>
                    <span className="text-[#ffd9c0] font-semibold">VIP</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 border-t border-[#1e2128] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#ffb703]" />
                    <span className="text-[11px] text-[#e1e2ec]">Festival (Rp 1.85jt)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#d5baff]" />
                    <span className="text-[11px] text-[#e1e2ec]">Tribune (Rp 1.15jt)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-sm bg-[#ffd9c0]" />
                    <span className="text-[11px] text-[#e1e2ec]">VIP (Rp 3.5jt)</span>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120} className="space-y-6 lg:col-span-5">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-[#ffb703]">Transparansi</p>
                <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl">
                  Lihat Dudukmu Sebelum Membeli
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#8a8d98]">
                  Peta venue 3D interaktif dengan preview sudut pandang 360°. Tidak ada kejutan
                  kursi terhalang atau posisi yang terlalu jauh.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { icon: Eye, title: "Preview 360°", desc: "Cek jarak pandang ke layar dan panggung", color: "#ffb703" },
                  { icon: Users, title: "Aksesibilitas", desc: "Kursi roda, pos medis, dan jalur evakuasi", color: "#d5baff" },
                  { icon: Ticket, title: "Kursi Berurutan", desc: "Beli 4 tiket bersama, duduk tetap satu blok", color: "#ffdea9" },
                ].map(({ icon: Icon, title, desc, color }) => (
                  <div key={title} className="group flex items-start gap-3 rounded-xl border border-[#232733] bg-[#191b23] p-4 transition-all hover:border-[#3a3d46] hover:bg-[#1d1f27] hover-sheen">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}12` }}>
                      <Icon className="h-4 w-4" style={{ color }} />
                    </span>
                    <div>
                      <h5 className="text-sm font-semibold text-[#e1e2ec]">{title}</h5>
                      <p className="mt-0.5 text-xs text-[#8a8d98]">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==================== WHY TIXORA ==================== */}
        <section className="w-full border-y border-[#1e2128] bg-[#0e1118] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-widest text-[#ffb703]">Keunggulan</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-4xl">
                Kenapa Pilih Tixora?
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-[#8a8d98]">
                Dirancang untuk iklim konser Indonesia — cepat, transparan, dan aman.
              </p>
            </Reveal>

            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={70}>
              {FEATURES.map(({ icon: Icon, title, desc, tag, color }) => (
                <div key={title} className="group relative rounded-2xl border border-[#232733] bg-[#191b23] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/25 hover:shadow-xl hover:shadow-black/30 overflow-hidden hover-sheen">
                  {/* Hover glow */}
                  <div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${color}08, transparent 70%)` }}
                  />
                  {/* Bar rise animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(12)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-full origin-bottom"
                        style={{
                          backgroundColor: color,
                          height: '100%',
                          animation: `bar-rise 1.5s ease-in-out ${i * 0.08}s infinite alternate`,
                        }}
                      />
                    ))}
                  </div>
                  <span className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110" style={{ backgroundColor: `${color}12` }}>
                    <Icon className="h-5 w-5" style={{ color }} />
                  </span>
                  <h3 className="relative font-semibold text-[#e1e2ec]">{title}</h3>
                  <p className="relative mt-2 text-[13px] leading-relaxed text-[#8a8d98]">{desc}</p>
                  <span className="relative mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold" style={{ color }}>
                    <Sparkles className="h-3 w-3" />
                    {tag}
                  </span>
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section className="mx-auto w-full max-w-7xl px-5 py-20 sm:px-8">
          <Reveal className="mb-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#d5baff]">Testimoni</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-4xl">
                Kata Mereka
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#8a8d98]">
              <span className="text-xl font-bold text-[#ffb703]">4.9/5</span>
              <span>dari 240rb+ ulasan</span>
            </div>
          </Reveal>

          <Stagger className="grid gap-4 md:grid-cols-3" step={80}>
            {TESTIMONIALS.map(({ name, role, text, rating }) => (
              <div key={name} className="group relative flex flex-col justify-between rounded-2xl border border-[#232733] bg-[#191b23] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/20 hover:shadow-xl hover:shadow-black/20 overflow-hidden hover-sheen">
                {/* Ripple effect */}
                <div className="absolute top-4 right-4 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="h-6 w-6 rounded-full border border-[#ffb703]/20 animate-[ripple_2s_ease-out_infinite]" />
                </div>
                <div className="space-y-3">
                  <div className="flex gap-0.5 text-[#ffb703]">
                    {Array.from({ length: rating }).map((_: unknown, i: number) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-[#b0b3bd]">&ldquo;{text}&rdquo;</p>
                </div>
                <div className="mt-5 border-t border-[#1e2128] pt-3.5 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#ffb703] to-[#ffdea9] text-[#10131a] font-bold text-sm">
                    {name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#e1e2ec]">{name}</p>
                    <p className="text-[11px] text-[#8a8d98]">{role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Stagger>
        </section>

        {/* ==================== VIP CTA ==================== */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-20 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[#232733] group hover-sheen">
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#191b23] via-[#1d1f27] to-[#191b23]" />
              <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-[#ffb703]/10 blur-[80px] transition-all duration-500 group-hover:bg-[#ffb703]/15 animate-[drift-a_15s_ease-in-out_infinite_alternate]" />
              <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-[#6801d1]/10 blur-[80px] transition-all duration-500 group-hover:bg-[#6801d1]/15 animate-[drift-b_18s_ease-in-out_infinite_alternate]" />
              {/* Grid pattern */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
              {/* Floating particles */}
              <div className="absolute top-1/4 right-1/4 h-2 w-2 rounded-full bg-[#ffb703]/20 animate-[float-slow_8s_ease-in-out_infinite]" />
              <div className="absolute bottom-1/3 left-1/3 h-1.5 w-1.5 rounded-full bg-[#d5baff]/20 animate-[float-slow_10s_ease-in-out_infinite_1s]" />

              <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-12">
                <div className="space-y-5 lg:col-span-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-4 py-1.5">
                    <Star className="h-3.5 w-3.5 text-[#ffb703]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffb703]">
                      VIP Black Tier
                    </span>
                  </div>
                  <h2 className="max-w-xl text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl lg:text-4xl">
                    Soundcheck, Backstage, & Lounge Eksklusif
                  </h2>
                  <p className="max-w-lg text-sm leading-relaxed text-[#8a8d98]">
                    Akses karpet merah, jamuan lounge ber-AC, merchandise limited edition,
                    dan tiket meet & greet dengan artis.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href={user ? "/events" : "/register"}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-7 py-3.5 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/25 transition-all hover:-translate-y-0.5 hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 press"
                    >
                      <Star className="h-4 w-4" />
                      {user ? "Jelajahi Tiket VIP" : "Daftar VIP"}
                    </Link>
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#e1e2ec] hover:text-[#ffb703] transition-colors cursor-pointer">
                      Lihat Manfaat
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
                <div className="hidden lg:col-span-4 lg:block">
                  <div className="flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -inset-8 rounded-full bg-[#ffb700]/10 blur-3xl animate-pulse" />
                      <div className="absolute -inset-4 rounded-full border border-[#ffb700]/20 animate-[ripple_3s_ease-out_infinite]" />
                      <Star className="relative h-24 w-24 text-[#ffb703]/30 animate-[float-slow_6s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* ==================== NEWSLETTER ==================== */}
        <section className="mx-auto w-full max-w-7xl px-5 pb-24 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-8 sm:p-12 group hover-sheen">
              <div className="absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-[#ffb703]/[0.07] blur-[60px] transition-all duration-500 group-hover:bg-[#ffb703]/[0.12] animate-[drift-a_20s_ease-in-out_infinite_alternate]" />
              <div className="absolute -left-10 -bottom-10 h-[200px] w-[200px] rounded-full bg-[#6801d1]/[0.05] blur-[60px] animate-[drift-b_25s_ease-in-out_infinite_alternate]" />
              {/* Floating particles */}
              <div className="absolute top-1/3 right-1/3 h-1.5 w-1.5 rounded-full bg-[#ffb703]/20 animate-[float-slow_9s_ease-in-out_infinite]" />
              <div className="absolute bottom-1/4 left-1/4 h-1 w-1 rounded-full bg-[#d5baff]/20 animate-[float-slow_11s_ease-in-out_infinite_2s]" />
              <div className="relative grid items-center gap-8 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-7">
                  <p className="text-[11px] uppercase tracking-widest text-[#ffb703]">Newsletter</p>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl">
                    Jangan Lewatkan Drop Tiket
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-[#8a8d98]">
                    Notifikasi presale, kode promo kartu kredit, dan bundling hotel — langsung di inbox kamu.
                  </p>
                </div>
                <div className="lg:col-span-5">
                  <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                    <div className="flex flex-1 items-center gap-2.5 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3.5 transition-all focus-within:border-[#ffb703]/50 focus-within:ring-2 focus-within:ring-[#ffb703]/10">
                      <Search className="h-4 w-4 shrink-0 text-[#514532]" />
                      <input
                        placeholder="Email kamu..."
                        type="email"
                        className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#3a3d46]"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffb703] px-7 py-3.5 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 hover:-translate-y-0.5 press"
                    >
                      Langganan
                    </button>
                  </form>
                  <p className="mt-3 text-[11px] text-[#8a8d98]">
                    Tanpa spam. Unsubscribe kapan saja.
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
