"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  CreditCard,
  Disc3,
  Eye,
  Heart,
  MapPin,
  Mic2,
  Music,
  Play,
  QrCode,
  RefreshCw,
  Search,
  Shield,
  ShoppingBag,
  Star,
  Ticket,
  UserRound,
  Users,
  WalletCards,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CountUp } from "@/components/shared/CountUp";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { Marquee } from "@/components/shared/Marquee";
import { fetchMyOrders } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";
import { fetchProfile } from "@/features/profile/api";
import type { UserProfile } from "@/features/profile/types";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { EventCard } from "@/features/events/components/EventCard";
import { fetchPopularArtists } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { useAuthStore } from "@/stores/authStore";

const EMPTY_EVENT_DATE = "2026-01-01T00:00:00+07:00";

const EMPTY_NEXT_EVENT: Event = {
  id: "",
  title: "Belum ada konser terjadwal",
  description: "Konser berikutnya akan tampil di sini.",
  location: "Indonesia",
  event_date: EMPTY_EVENT_DATE,
  status: "open",
};

const FEATURES = [
  {
    icon: QrCode,
    title: "Dynamic Anti-Calo Barcode",
    desc: "QR Code berganti setiap 30 detik untuk mencegah pemalsuan, duplikasi PDF screenshot, dan sindikat calo tiket.",
    tag: "ISO 27001",
    color: "#ffb703",
  },
  {
    icon: CreditCard,
    title: "Pembayaran Lokal Instan",
    desc: "QRIS, Virtual Account semua bank nasional, GoPay, OVO, hingga cicilan 0% kartu kredit otomatis terverifikasi.",
    tag: "Verifikasi Instan",
    color: "#d5baff",
  },
  {
    icon: Shield,
    title: "Garansi Refund Penuh",
    desc: "Perlindungan pengembalian dana 100% jika musisi berhalangan hadir atau jadwal konser dibatalkan promotor.",
    tag: "Proteksi Finansial",
    color: "#ffd9c0",
  },
  {
    icon: Users,
    title: "Wristband Express Pickup",
    desc: "Penukaran gelang konser cepat melalui jalur express scan booth di venue mitra H-3 sebelum panggung dibuka.",
    tag: "Nol Antrian",
    color: "#ffdea9",
  },
];

const GENRE_CARDS = [
  { label: "K-Pop", count: "8 Konser", color: "#ec4899", query: "K-Pop" },
  { label: "Rock & Indie", count: "14 Konser", color: "#f97316", query: "Rock" },
  { label: "Festival", count: "6 Event", color: "#10b981", query: "Festival" },
  { label: "EDM", count: "11 Event", color: "#8b5cf6", query: "EDM" },
  { label: "Jazz", count: "5 Jadwal", color: "#f59e0b", query: "Jazz" },
  { label: "Pop", count: "16 Konser", color: "#38bdf8", query: "Pop" },
];

const CITIES = ["Semua Kota", "Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Semarang"];

function CountdownBox({ value, label, highlight }: { value: string; label: string; highlight?: boolean }) {
  return (
    <div
      className={`flex flex-col items-center rounded-lg py-2 transition-all ${
        highlight
          ? "bg-[#ffb703]/15 ring-1 ring-[#ffb703]/40 shadow-[0_0_15px_rgba(255,183,3,0.15)]"
          : "border border-[#2a2d36]/70 bg-[#161821] hover:bg-[#1d202b]"
      }`}
    >
      <span className={`numeral text-base sm:text-lg font-bold countdown-tick ${highlight ? "text-[#ffb703]" : "text-[#e1e2ec]"}`}>
        {value}
      </span>
      <span className="text-[9px] uppercase tracking-wider text-[#7a7d88]">{label}</span>
    </div>
  );
}

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [eventFilter, setEventFilter] = useState("all");
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [eventLoadError, setEventLoadError] = useState(false);
  const [artistLoadError, setArtistLoadError] = useState(false);
  const [accountLoadError, setAccountLoadError] = useState(false);
  const [countdown, setCountdown] = useState({ d: "02", h: "14", m: "25", s: "33" });

  useEffect(() => {
    if (!hydrated) return;
    let active = true;

    Promise.allSettled([
      fetchEvents({ limit: 12 }),
      fetchPopularArtists(8),
      user ? Promise.all([fetchProfile(), fetchMyOrders()]) : Promise.resolve([null, []] as [null, Order[]]),
    ])
      .then(([eventResult, artistResult, accountResult]) => {
        if (!active) return;
        if (eventResult.status === "fulfilled") {
          setEvents(eventResult.value);
          setEventLoadError(false);
        } else {
          console.error("Failed to load events", eventResult.reason);
          setEventLoadError(true);
        }

        if (artistResult.status === "fulfilled") {
          setArtists(artistResult.value);
          setArtistLoadError(false);
        } else {
          console.error("Failed to load artists", artistResult.reason);
          setArtistLoadError(true);
        }

        if (accountResult.status === "fulfilled") {
          setProfile(accountResult.value[0]);
          setOrders(accountResult.value[1]);
          setAccountLoadError(false);
        } else {
          console.error("Failed to load account activity", accountResult.reason);
          setAccountLoadError(Boolean(user));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hydrated, reloadKey, user]);

  const displayName = profile?.name || user?.name || "Tamu";
  const firstName = displayName.split(" ")[0];

  const upcomingEvents = useMemo(() => {
    const now = Date.now();
    return events
      .filter((event) => event.status === "open" && new Date(event.event_date).getTime() >= now)
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime());
  }, [events]);

  const nextEvent: Event = upcomingEvents[0] || events.find((e) => e.status === "open") || events[0] || EMPTY_NEXT_EVENT;

  // Real or dynamic countdown computation
  useEffect(() => {
    const targetDate = nextEvent?.event_date ? new Date(nextEvent.event_date).getTime() : 0;

    const updateTimer = () => {
      const now = Date.now();
      if (targetDate && targetDate > now) {
        const diff = Math.floor((targetDate - now) / 1000);
        const days = Math.floor(diff / 86400);
        const hours = Math.floor((diff % 86400) / 3600);
        const minutes = Math.floor((diff % 3600) / 60);
        const seconds = diff % 60;
        setCountdown({
          d: String(days).padStart(2, "0"),
          h: String(hours).padStart(2, "0"),
          m: String(minutes).padStart(2, "0"),
          s: String(seconds).padStart(2, "0"),
        });
      } else {
        // Fallback ticker
        setCountdown((prev) => {
          let s = parseInt(prev.s, 10);
          let m = parseInt(prev.m, 10);
          let h = parseInt(prev.h, 10);
          let d = parseInt(prev.d, 10);
          if (s > 0) s--;
          else {
            s = 59;
            if (m > 0) m--;
            else {
              m = 59;
              if (h > 0) h--;
              else {
                h = 23;
                if (d > 0) d--;
              }
            }
          }
          return {
            d: String(d).padStart(2, "0"),
            h: String(h).padStart(2, "0"),
            m: String(minutesFallback(m)).padStart(2, "0"),
            s: String(s).padStart(2, "0"),
          };
        });
      }
    };

    const minutesFallback = (m: number) => Math.max(0, m);

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [nextEvent]);

  // Orders statistics
  const paidOrders = orders.filter((order) => order.status === "paid");
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const upcomingOrders = paidOrders
    .filter((order) => order.events?.event_date && new Date(order.events.event_date).getTime() >= Date.now())
    .sort(
      (a, b) =>
        new Date(a.events?.event_date || "").getTime() - new Date(b.events?.event_date || "").getTime(),
    );

  const ticketCount = profile?.tickets_count ?? paidOrders.length;
  const orderCount = profile?.orders_count ?? orders.length;
  const paidTotal = paidOrders.reduce((sum, order) => sum + order.total, 0);

  // Event Genres
  const eventGenres = Array.from(
    new Set(
      events.flatMap((event) =>
        [event.genre, event.artists?.genre, ...(event.artists_list?.map((a) => a.genre) || [])].filter(
          (genre): genre is string => Boolean(genre),
        ),
      ),
    ),
  ).slice(0, 6);

  // Filtered Events
  const filteredEvents = events.filter((event) => {
    const matchQuery =
      !searchQuery ||
      event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (event.artists?.name && event.artists.name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchCity =
      selectedCity === "Semua Kota" ||
      (event.location && event.location.toLowerCase().includes(selectedCity.toLowerCase()));

    if (!matchQuery || !matchCity) return false;

    if (eventFilter === "featured") return Boolean(event.featured);
    if (eventFilter === "all") return true;

    const genres = [event.genre, event.artists?.genre, ...(event.artists_list?.map((a) => a.genre) || [])];
    return genres.some((genre) => genre?.toLowerCase() === eventFilter.toLowerCase());
  });

  const retryLoading = () => {
    setLoading(true);
    setEventLoadError(false);
    setArtistLoadError(false);
    setAccountLoadError(false);
    setReloadKey((key) => key + 1);
  };

  if (!hydrated || loading) {
    return (
      <div className="min-h-screen bg-[#0b0e15] text-[#e1e2ec]">
        <Navbar />
        <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 pt-28 text-center">
          <div className="relative mb-5 flex h-16 w-16 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[#ffb703]/20" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#ffb703]" />
            <Disc3 className="h-7 w-7 text-[#ffb703] animate-pulse" />
          </div>
          <p className="text-base font-semibold text-[#e1e2ec]">Menyiapkan Ruang Konsermu</p>
          <p className="mt-1 text-xs text-[#8a8d98]">Memuat lineup panggung dan tiket digital...</p>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.25em] text-[#ffb703]/80">Tixora Experience</p>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const marqueeLineup = [
    "Sheila On 7",
    "Coldplay",
    "Stray Kids",
    "Ed Sheeran",
    "Bruno Major",
    "NIKI",
    "Tulus",
    "Hindia",
    "Juicy Luicy",
    "The 1975",
    "Raim Laode",
    "Maliq & D'Essentials",
  ];

  return (
    <div className="min-h-screen bg-[#0b0e15] text-[#e1e2ec] page-enter selection:bg-[#ffb703]/30 selection:text-white">
      <Navbar />

      <main className="relative overflow-hidden">
        {/* ==================== AMBIENT LIGHTS & GRID ==================== */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute -top-32 left-1/2 h-[550px] w-[850px] -translate-x-1/2 rounded-full bg-[#ffb703]/[0.06] blur-[130px] animate-[drift-a_18s_ease-in-out_infinite_alternate]" />
          <div className="absolute right-0 top-36 h-[380px] w-[380px] rounded-full bg-[#6801d1]/[0.08] blur-[110px] animate-[drift-b_22s_ease-in-out_infinite_alternate]" />
          <div className="absolute top-[800px] left-0 h-[300px] w-[450px] rounded-full bg-[#ffb703]/[0.03] blur-[90px] animate-[drift-a_20s_ease-in-out_infinite_alternate-reverse]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.02)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_75%)]" />

          {/* Micro floating particles */}
          <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-[#ffb703]/30 animate-[float-slow_7s_ease-in-out_infinite]" />
          <div className="absolute top-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-[#d5baff]/30 animate-[float-slow_9s_ease-in-out_infinite_1s]" />
          <div className="absolute top-2/3 left-1/3 h-1 w-1 rounded-full bg-[#ffdea9]/30 animate-[float-slow_11s_ease-in-out_infinite_2s]" />
        </div>

        {/* ==================== HERO SECTION ==================== */}
        <section className="relative z-10 mx-auto max-w-7xl px-5 pb-16 pt-28 sm:px-8 sm:pt-36">
          <div className="grid items-center gap-10 lg:grid-cols-12">
            {/* Left Column: Greeting & Copy */}
            <div className="space-y-6 lg:col-span-7">

              <Reveal delay={80}>
                <h1 className="text-[clamp(2.3rem,5vw,4.2rem)] font-extrabold leading-[1.03] tracking-tight text-[#e1e2ec]">
                  {user ? "Konser Impianmu," : "Malam Terbaik"}
                  <br />
                  <span className="bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] bg-clip-text text-transparent">
                    {user ? `Siap Nyanyi, ${firstName}?` : "Dimulai di Sini."}
                  </span>
                </h1>
              </Reveal>

              <Reveal delay={160}>
                <p className="max-w-xl text-base leading-relaxed text-[#8a8d98] sm:text-lg">
                  {user
                    ? "Semua akses tiket digital, jadwal tur musisi favorit, dan keamanan transaksi anti-calo ada di kendalimu. Bersiaplah untuk momen panggung spektakuler berikutnya."
                    : "Platform tiket konser terpercaya di Indonesia dengan teknologi barcode anti-calo, verifikasi instan, serta jaminan refund penuh 100%."}
                </p>
              </Reveal>

              <Reveal delay={240}>
                <div className="flex flex-wrap items-center gap-4 pt-1">
                  <Link
                    href="/events"
                    className="group inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-7 py-3.5 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/25 transition-all hover:-translate-y-0.5 hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 press"
                  >
                    <span>Cari Konser Berikutnya</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  {user ? (
                    <Link
                      href="/tickets"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-6 py-3.5 text-sm font-semibold text-[#e1e2ec] transition-all hover:border-[#ffb703]/40 hover:text-[#ffb703] press"
                    >
                      <Ticket className="h-4 w-4 text-[#ffb703]" />
                      <span>Buka Tiket Saya ({ticketCount})</span>
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-6 py-3.5 text-sm font-semibold text-[#e1e2ec] transition-all hover:border-[#ffb703]/40 hover:text-[#ffb703] press"
                    >
                      <span>Daftar Akun Gratis</span>
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>
              </Reveal>

              {/* Live Status Counters */}
              <Reveal delay={300}>
                <div className="flex flex-wrap items-center gap-6 pt-3 border-t border-[#232733]/70">
                  {user ? (
                    <>
                      <Link href="/tickets" className="group">
                        <p className="text-2xl font-extrabold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
                          <CountUp value={ticketCount} />
                        </p>
                        <p className="text-xs text-[#8a8d98]">Tiket Digital Aktif</p>
                      </Link>
                      <div className="h-8 w-px bg-[#232733]" />
                      <Link href="/orders" className="group">
                        <p className="text-2xl font-extrabold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
                          <CountUp value={orderCount} />
                        </p>
                        <p className="text-xs text-[#8a8d98]">Total Transaksi</p>
                      </Link>
                      <div className="h-8 w-px bg-[#232733]" />
                      <div className="group">
                        <p className="text-2xl font-extrabold text-[#ffb703] transition-colors group-hover:text-[#ffdea9]">
                          {paidOrders.length > 0 ? "VIP Pass" : "Member"}
                        </p>
                        <p className="text-xs text-[#8a8d98]">Status Akun</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="group">
                        <p className="text-2xl font-extrabold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
                          <CountUp value={1200000} format={(v) => `${(v / 1000000).toFixed(1)}M+`} />
                        </p>
                        <p className="text-xs text-[#8a8d98]">Tiket Terjual</p>
                      </div>
                      <div className="h-8 w-px bg-[#232733]" />
                      <div className="group">
                        <p className="text-2xl font-extrabold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
                          <CountUp value={45} format={(v) => `${v}+`} />
                        </p>
                        <p className="text-xs text-[#8a8d98]">Promotor Resmi</p>
                      </div>
                      <div className="h-8 w-px bg-[#232733]" />
                      <div className="group">
                        <p className="text-2xl font-extrabold text-[#ffb703] transition-colors group-hover:text-[#ffdea9]">4.9</p>
                        <p className="text-xs text-[#8a8d98]">Rating Fans</p>
                      </div>
                    </>
                  )}
                </div>
              </Reveal>
            </div>

            {/* Right Column: Hero Spotlight Stage Card */}
            <Reveal delay={200} className="lg:col-span-5">
              <div className="relative group hover-sheen">
                {/* Glow backdrop */}
                <div className="absolute -inset-4 rounded-3xl bg-gradient-to-br from-[#ffb703]/25 via-transparent to-[#6801d1]/25 blur-2xl transition-all duration-500 group-hover:from-[#ffb703]/35 group-hover:to-[#6801d1]/35" />

                <div className="relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] shadow-2xl transition-all duration-500 group-hover:border-[#ffb703]/40">
                  {/* Poster Header */}
                  <div className="relative h-64 overflow-hidden bg-[#151720]">
                    {nextEvent.poster ? (
                      <Image
                        src={resolveMediaUrl(nextEvent.poster)}
                        alt={nextEvent.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 40vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-[#191b23]">
                        <Ticket className="h-16 w-16 text-[#2a2d36]" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#191b23] via-[#191b23]/30 to-transparent" />

                    {/* Stage Badges */}
                    <div className="absolute left-4 top-4 flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#ffb703] px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-[#10131a] shadow-lg shadow-[#ffb703]/20">
                        <Star className="h-3 w-3 fill-current" />
                        {nextEvent.featured ? "Pilihan Utama" : "Next Stage"}
                      </span>
                      <span className="rounded-lg border border-white/10 bg-[#0b0e15]/70 px-2.5 py-1.5 text-[10px] font-semibold text-[#e1e2ec] backdrop-blur">
                        Live 2026
                      </span>
                    </div>

                    {/* Floating play / soundwave icon */}
                    <div className="absolute bottom-4 right-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ffb703]/30 bg-[#ffb703]/20 text-[#ffb703] backdrop-blur transition-all duration-300 group-hover:scale-110 group-hover:bg-[#ffb703]/30">
                        <Play className="h-4 w-4 ml-0.5 fill-current" />
                      </div>
                    </div>

                    <div className="scan-line" />
                  </div>

                  {/* Info & Countdown Box */}
                  <div className="space-y-4 p-5 sm:p-6">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-widest text-[#d5baff]">
                        {nextEvent.artist_names?.join(", ") || nextEvent.artists?.name || "Konser Spektakuler"}
                      </p>
                      <h3 className="mt-1 line-clamp-1 text-xl font-extrabold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
                        {nextEvent.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8a8d98]">
                        <span className="inline-flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-[#ffb703]" />
                          {formatEventDate(nextEvent.event_date)}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#ffb703]" />
                          <span className="truncate max-w-[170px]">{nextEvent.venue || nextEvent.location}</span>
                        </span>
                      </div>
                    </div>

                    {/* Real-time Countdown Box */}
                    <div className="rounded-xl border border-[#232733] bg-[#14161f] p-3.5">
                      <div className="mb-2 flex items-center justify-between text-xs">
                        <span className="text-[10px] uppercase tracking-wider text-[#8a8d98]">Hitung Mundur Panggung</span>
                        <span className="text-xs font-bold text-[#ffb703]">
                          {nextEvent.total_remaining ? `Sisa ${nextEvent.total_remaining} Tiket` : "Seat Terbatas"}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        <CountdownBox value={countdown.d} label="Hari" />
                        <CountdownBox value={countdown.h} label="Jam" />
                        <CountdownBox value={countdown.m} label="Mnt" />
                        <CountdownBox value={countdown.s} label="Dtk" highlight />
                      </div>
                    </div>

                    {/* Price & Action */}
                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-[#8a8d98]">Mulai Dari</span>
                        <p className="text-xl font-black text-[#ffb703]">
                          {formatCurrency(nextEvent.min_price ?? 0)}
                        </p>
                      </div>
                      <Link
                        href={nextEvent.id ? `/events/${nextEvent.id}` : "/events"}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-2.5 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 press"
                      >
                        <span>Pesan Tiket</span>
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* ==================== INTERACTIVE SEARCH & FILTER BAR ==================== */}
          <Reveal delay={350}>
            <div className="mt-12 rounded-2xl border border-[#232733] bg-[#191b23]/90 p-4 shadow-2xl shadow-black/40 backdrop-blur-xl lg:p-5 hover-sheen">
              <form
                className="grid items-center gap-3 sm:grid-cols-2 lg:grid-cols-12"
                onSubmit={(e) => {
                  e.preventDefault();
                  const targetSec = document.getElementById("concert-explore");
                  if (targetSec) targetSec.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {/* Search Input */}
                <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3 transition-all focus-within:border-[#ffb703]/50 focus-within:ring-2 focus-within:ring-[#ffb703]/10 lg:col-span-5">
                  <Search className="h-4 w-4 shrink-0 text-[#ffb703]" />
                  <div className="w-full">
                    <label className="block text-[9px] uppercase tracking-wider text-[#a8843f]">
                      Cari Artis / Konser
                    </label>
                    <input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Coldplay, Sheila On 7, NIKI, GBK..."
                      className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none placeholder:text-[#525666]"
                    />
                  </div>
                </div>

                {/* City Select */}
                <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3 transition-all focus-within:border-[#d5baff]/50 focus-within:ring-2 focus-within:ring-[#d5baff]/10 lg:col-span-3">
                  <MapPin className="h-4 w-4 shrink-0 text-[#d5baff]" />
                  <div className="w-full">
                    <label className="block text-[9px] uppercase tracking-wider text-[#9b8ec4]">Kota / Venue</label>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none cursor-pointer"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#1d1f27] text-[#e1e2ec]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Genre Select */}
                <div className="flex items-center gap-2.5 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3 transition-all focus-within:border-[#ffb703]/50 focus-within:ring-2 focus-within:ring-[#ffb703]/10 lg:col-span-2">
                  <Music className="h-4 w-4 shrink-0 text-[#ffb703]" />
                  <div className="w-full">
                    <label className="block text-[9px] uppercase tracking-wider text-[#a8843f]">Genre</label>
                    <select
                      value={eventFilter}
                      onChange={(e) => setEventFilter(e.target.value)}
                      className="w-full bg-transparent text-sm text-[#e1e2ec] outline-none cursor-pointer"
                    >
                      <option value="all" className="bg-[#1d1f27] text-[#e1e2ec]">Semua Genre</option>
                      <option value="featured" className="bg-[#1d1f27] text-[#e1e2ec]">Unggulan</option>
                      {eventGenres.map((g) => (
                        <option key={g} value={g} className="bg-[#1d1f27] text-[#e1e2ec]">
                          {g}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Submit button */}
                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    className="inline-flex h-full min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#ffb703] px-5 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition-all hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 hover:-translate-y-0.5 press"
                  >
                    <Search className="h-4 w-4" />
                    <span>Cari</span>
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </section>

        {/* ==================== ARTIST LINEUP MARQUEE ==================== */}
        <section className="relative w-full overflow-hidden border-y border-[#1e2128] bg-[#0e1118] py-4">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-28 bg-gradient-to-r from-[#0e1118] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-28 bg-gradient-to-l from-[#0e1118] to-transparent" />
          <Marquee
            items={marqueeLineup}
            className="text-xs font-bold uppercase tracking-[0.25em] text-[#4e5361] hover:text-[#ffb703] transition-colors"
          />
        </section>

        {/* ==================== USER COMMAND CENTER / QUICK ACCESS ==================== */}
        {user ? (
          <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
            {/* Pending Payment Alert if any */}
            {pendingOrders.length > 0 ? (
              <Reveal>
                <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-amber-400/30 bg-gradient-to-r from-amber-500/15 via-[#191b23] to-[#191b23] p-5 shadow-xl shadow-amber-500/5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400/20 text-amber-300 ring-1 ring-amber-400/30">
                      <Clock3 className="h-5 w-5 animate-pulse" />
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-[#e1e2ec]">
                        {pendingOrders.length} Pesanan Menunggu Pembayaran
                      </h4>
                      <p className="mt-0.5 text-xs text-[#8a8d98]">
                        Selesaikan transaksi untuk pesanan <span className="text-[#ffb703] font-mono">{pendingOrders[0].order_code}</span> sebelum kursi dirilis kembali.
                      </p>
                    </div>
                  </div>
                  <Link
                    href={`/payments/${pendingOrders[0].id}`}
                    className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-2.5 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:bg-[#ffdea9] press"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Bayar Sekarang ({formatCurrency(pendingOrders[0].total)})</span>
                  </Link>
                </div>
              </Reveal>
            ) : null}

            {/* Dashboard 4 Cards */}
            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={60}>
              <Link
                href="/tickets"
                className="group relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/30 hover:shadow-xl hover:shadow-black/30 hover-sheen"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#8a8d98]">Tiket Digital Saya</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffb703]/10 text-[#ffb703]">
                    <Ticket className="h-4 w-4" />
                  </span>
                </div>
                <p className="numeral mt-4 text-3xl font-extrabold text-[#e1e2ec] group-hover:text-[#ffb703] transition-colors">
                  <CountUp value={ticketCount} />
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-[#7a7d88]">Siap scan di gate</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#ffb703] group-hover:underline">
                    Buka <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              <Link
                href="/orders"
                className="group relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#d5baff]/30 hover:shadow-xl hover:shadow-black/30 hover-sheen"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#8a8d98]">Riwayat Pesanan</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d5baff]/10 text-[#d5baff]">
                    <WalletCards className="h-4 w-4" />
                  </span>
                </div>
                <p className="numeral mt-4 text-3xl font-extrabold text-[#e1e2ec] group-hover:text-[#d5baff] transition-colors">
                  <CountUp value={orderCount} />
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-[#7a7d88]">{paidOrders.length} Berhasil lunas</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#d5baff] group-hover:underline">
                    Detail <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>

              <div className="group relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#8a8d98]">Total Pengeluaran Tiket</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 truncate text-xl font-bold text-[#e1e2ec]">
                  {formatCurrency(paidTotal)}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-[#7a7d88]">Transaksi terverifikasi</span>
                  <span className="text-emerald-400 font-semibold">100% Aman</span>
                </div>
              </div>

              <Link
                href="/events"
                className="group relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffdea9]/30 hover:shadow-xl hover:shadow-black/30 hover-sheen"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-[#8a8d98]">Genre Favorit</span>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffdea9]/10 text-[#ffdea9]">
                    <Heart className="h-4 w-4" />
                  </span>
                </div>
                <p className="mt-4 truncate text-lg font-bold text-[#e1e2ec] group-hover:text-[#ffb703] transition-colors">
                  {profile?.favorite_genre || "Live Concert"}
                </p>
                <div className="mt-3 flex items-center justify-between text-[11px]">
                  <span className="text-[#7a7d88]">Rekomendasi khusus</span>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#ffb703] group-hover:underline">
                    Jelajahi <ArrowUpRight className="h-3 w-3" />
                  </span>
                </div>
              </Link>
            </Stagger>

            {/* Upcoming Live Ticket Passes (If any paid tickets) */}
            {upcomingOrders.length > 0 ? (
              <div className="mt-10">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#ffb703]">Tiket Panggung Mendatang</p>
                    <h3 className="mt-1 text-xl font-extrabold text-[#e1e2ec]">Jadwal Konser yang Akan Kamu Hadiri</h3>
                  </div>
                  <Link href="/tickets" className="text-xs font-semibold text-[#ffb703] hover:text-[#ffdea9] inline-flex items-center gap-1">
                    Semua Tiket ({ticketCount}) <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>

                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {upcomingOrders.slice(0, 3).map((order) => (
                    <Link
                      key={order.id}
                      href={`/orders/${order.id}`}
                      className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/30 hover:shadow-xl hover-sheen"
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[#2a2d36] bg-[#10131a]">
                          {order.events?.poster ? (
                            <Image
                              src={resolveMediaUrl(order.events.poster)}
                              alt={order.events.title || "Poster"}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <Ticket className="h-6 w-6 text-[#ffb703]" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-bold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
                            {order.events?.title || "Konser Musik"}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8a8d98]">
                            <CalendarDays className="h-3 w-3 text-[#ffb703]" />
                            <span>{order.events?.event_date ? formatEventDate(order.events.event_date) : "Jadwal"}</span>
                          </p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#8a8d98]">
                            <MapPin className="h-3 w-3 text-[#ffb703]" />
                            <span className="truncate">{order.events?.location || "Venue"}</span>
                          </p>
                        </div>
                      </div>

                      {/* Ticket stub connector */}
                      <div className="relative -mx-4 my-3 flex items-center justify-between px-2">
                        <span className="h-3 w-3 rounded-full bg-[#0b0e15] ring-1 ring-[#232733]" />
                        <span className="h-0 flex-1 border-t border-dashed border-[#2a2d36]" />
                        <span className="h-3 w-3 rounded-full bg-[#0b0e15] ring-1 ring-[#232733]" />
                      </div>

                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono text-[11px] text-[#8a8d98]">{order.order_code}</span>
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#ffb703]">
                          Buka QR Gate <ChevronRight className="h-3 w-3" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ) : null}

        {/* ==================== GENRE EXPLORE WITH SOUNDWAVE ==================== */}
        <section className="w-full border-y border-[#1e2128] bg-[#0e1118] px-5 py-16 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-[#d5baff]">Kurasi Musik</p>
                <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl">
                  Pilih Sesuai Vibe & Genre
                </h2>
              </div>
              {eventFilter !== "all" && (
                <button
                  type="button"
                  onClick={() => setEventFilter("all")}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-[#ffb703] hover:text-[#ffdea9] transition-colors"
                >
                  Reset Pilihan ({eventFilter}) &times;
                </button>
              )}
            </Reveal>

            <Stagger className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6" step={50}>
              {GENRE_CARDS.map(({ label, count, color, query }) => {
                const isSelected = eventFilter.toLowerCase() === query.toLowerCase();

                return (
                  <button
                    type="button"
                    key={label}
                    onClick={() => {
                      setEventFilter((prev) => (prev.toLowerCase() === query.toLowerCase() ? "all" : query));
                      const sec = document.getElementById("concert-explore");
                      if (sec) sec.scrollIntoView({ behavior: "smooth" });
                    }}
                    className={`group relative flex items-center gap-3 rounded-xl border p-3.5 text-left transition-all duration-300 overflow-hidden cursor-pointer active:scale-95 ${
                      isSelected
                        ? "shadow-xl ring-2 -translate-y-1"
                        : "bg-[#191b23] hover:-translate-y-1 hover:shadow-lg hover:shadow-black/30 hover-sheen"
                    }`}
                    style={{
                      borderColor: isSelected ? color : `${color}40`,
                      backgroundColor: isSelected ? `${color}25` : "#191b23",
                      boxShadow: isSelected ? `0 0 25px ${color}40, inset 0 0 15px ${color}20` : undefined,
                    }}
                  >
                    {/* Background glow on active */}
                    <div
                      className={`absolute inset-0 transition-opacity duration-300 ${
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                      style={{ background: `radial-gradient(circle at 50% 50%, ${color}20, transparent 70%)` }}
                    />

                    {/* Soundwave animation */}
                    <div
                      className={`absolute bottom-0 left-0 right-0 h-1 flex items-end justify-center gap-0.5 transition-opacity duration-300 ${
                        isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1 rounded-t-full origin-bottom"
                          style={{
                            backgroundColor: color,
                            height: "100%",
                            animation: `soundwave 1.2s ease-in-out ${i * 0.12}s infinite`,
                          }}
                        />
                      ))}
                    </div>

                    <span
                      className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: isSelected ? `${color}40` : `${color}18`,
                        borderColor: isSelected ? color : `${color}50`,
                      }}
                    >
                      <Music className="h-4 w-4" style={{ color }} />
                    </span>

                    <div className="relative flex-1 min-w-0">
                      <h3
                        className={`text-xs truncate transition-colors ${
                          isSelected ? "text-white font-bold" : "text-[#e1e2ec] font-semibold group-hover:text-white"
                        }`}
                      >
                        {label}
                      </h3>
                      <p className="text-[10px] font-medium" style={{ color }}>
                        {count}
                      </p>
                    </div>
                  </button>
                );
              })}
            </Stagger>
          </div>
        </section>

        {/* ==================== CURATED CONCERTS GRID ==================== */}
        <section id="concert-explore" className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
                <Ticket className="h-3.5 w-3.5" />
                <span>Lineup Panggung 2026</span>
              </div>
              <h2 className="mt-2.5 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                {user ? "Konser Pilihan Khusus Untukmu" : "Jelajahi Konser & Tur Musik Terpopuler"}
              </h2>
              <p className="mt-1.5 max-w-xl text-xs sm:text-sm text-[#9da1b0]">
                Pilih konser favoritmu, cek ketersediaan tiket presale, dan amankan tempat terbaik sebelum habis terjual.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#14161f] px-4 py-2.5 text-xs font-bold text-[#ffb703] transition-all hover:border-[#ffb703]/50 hover:bg-[#ffb703]/10 hover:text-[#ffdea9] press"
            >
              <span>Lihat Semua Konser ({events.length})</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Reveal>

          {/* Active Search / City Indicator if applied */}
          {(searchQuery || selectedCity !== "Semua Kota") && (
            <div className="mb-6 flex flex-wrap items-center gap-2 rounded-xl border border-[#ffb703]/25 bg-[#ffb703]/[0.06] p-3 text-xs">
              <span className="font-semibold text-[#ffdea9]">Filter Aktif:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#191b23] border border-[#2a2d36] px-2.5 py-1 text-xs text-white">
                  Kata Kunci: &quot;{searchQuery}&quot;
                  <button type="button" onClick={() => setSearchQuery("")} className="text-[#ffb703] hover:text-white font-bold ml-1">
                    &times;
                  </button>
                </span>
              )}
              {selectedCity !== "Semua Kota" && (
                <span className="inline-flex items-center gap-1 rounded-md bg-[#191b23] border border-[#2a2d36] px-2.5 py-1 text-xs text-[#d5baff]">
                  Kota: {selectedCity}
                  <button type="button" onClick={() => setSelectedCity("Semua Kota")} className="text-[#d5baff] hover:text-white font-bold ml-1">
                    &times;
                  </button>
                </span>
              )}
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("Semua Kota");
                  setEventFilter("all");
                }}
                className="ml-auto text-[11px] font-bold text-[#ffb703] hover:underline"
              >
                Reset Filter
              </button>
            </div>
          )}

          {/* Filter Pills with Clear Vibrant States */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <button
              type="button"
              onClick={() => setEventFilter("all")}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${
                eventFilter === "all"
                  ? "border-[#ffb703] bg-[#ffb703] text-[#10131a] shadow-lg shadow-[#ffb703]/30 scale-105"
                  : "border-[#2a2d36] bg-[#14161f] text-[#8a8d98] hover:border-[#ffb703]/40 hover:text-white"
              }`}
            >
              Semua Konser ({events.length})
            </button>
            <button
              type="button"
              onClick={() => setEventFilter("featured")}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${
                eventFilter === "featured"
                  ? "border-[#ffb703] bg-[#ffb703] text-[#10131a] shadow-lg shadow-[#ffb703]/30 scale-105"
                  : "border-[#2a2d36] bg-[#14161f] text-[#8a8d98] hover:border-[#ffb703]/40 hover:text-white"
              }`}
            >
              Unggulan Pilihan
            </button>
            {eventGenres.map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setEventFilter(g)}
                className={`rounded-full border px-4 py-2 text-xs font-bold transition-all duration-300 ${
                  eventFilter.toLowerCase() === g.toLowerCase()
                    ? "border-[#ffb703] bg-[#ffb703] text-[#10131a] shadow-lg shadow-[#ffb703]/30 scale-105"
                    : "border-[#2a2d36] bg-[#14161f] text-[#8a8d98] hover:border-[#ffb703]/40 hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}

            <span className="ml-auto rounded-lg border border-[#2a2d36] bg-[#14161f] px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-[#ffb703]">
              {filteredEvents.length} Konser Tersedia
            </span>
          </div>

          {/* Grid or Empty */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <div className="rounded-3xl border border-dashed border-[#2a2d36] bg-[#14161f]/70 px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#ffb703]/10 text-[#ffb703] ring-1 ring-[#ffb703]/25">
                <Ticket className="h-8 w-8" />
              </div>
              <h3 className="text-base font-bold text-white">Tidak ada konser yang cocok</h3>
              <p className="mt-1 text-xs text-[#8a8d98]">
                Coba sesuaikan kata kunci pencarian atau ganti filter kota dan genre musik.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCity("Semua Kota");
                  setEventFilter("all");
                }}
                className="mt-5 inline-flex items-center gap-1.5 rounded-xl bg-[#ffb703] px-5 py-2.5 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9] press shadow-md"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Reset Semua Filter
              </button>
            </div>
          )}
        </section>

        {/* ==================== 3D INTERACTIVE VENUE & SEAT MAP ==================== */}
        <section className="w-full border-y border-[#1e2128] bg-[#0b0e15] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <Reveal className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] shadow-2xl shadow-black/40 hover-sheen">
                  <div className="flex items-center justify-between border-b border-[#1e2128] px-5 py-4">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
                        Seat Map 3D Interaktif
                      </p>
                      <h4 className="mt-0.5 text-base font-bold text-[#e1e2ec]">Stadion Utama GBK — Jakarta</h4>
                    </div>
                    <div className="flex items-center gap-2 rounded-lg border border-[#232733] bg-[#1d1f27] px-3 py-1.5">
                      <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
                      <span className="text-[11px] font-semibold text-[#e1e2ec]">Live Stage Simulation</span>
                    </div>
                  </div>

                  {/* 3D Visual Stage Simulator */}
                  <div className="relative flex aspect-[16/10] w-full items-center justify-center bg-[#0b0e15] p-6 overflow-hidden">
                    <div className="relative w-full max-w-[480px] h-[260px]" style={{ perspective: "1200px" }}>
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transformStyle: "preserve-3d",
                          animation: "stage-float 8s ease-in-out infinite",
                        }}
                      >
                        {/* Stage 3D Structure */}
                        <div
                          className="relative"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: "rotateX(55deg) rotateZ(-45deg)",
                            animation: "stage-rotate 25s linear infinite",
                          }}
                        >
                          {/* Stage Floor */}
                          <div
                            className="absolute w-[190px] h-[190px] rounded-lg border-2 border-[#ffb703]/60"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(255,183,3,0.2) 0%, rgba(255,183,3,0.08) 50%, rgba(104,1,209,0.1) 100%)",
                              transform: "translateZ(0px)",
                              boxShadow: "0 0 50px rgba(255,183,3,0.3), inset 0 0 60px rgba(255,183,3,0.15)",
                            }}
                          />
                          {/* Stage Back Wall */}
                          <div
                            className="absolute w-[190px] h-[75px] rounded-t-lg"
                            style={{
                              background: "linear-gradient(180deg, rgba(255,183,3,0.4) 0%, rgba(104,1,209,0.2) 100%)",
                              transform: "translateZ(35px) translateY(-35px)",
                              border: "2px solid rgba(255,183,3,0.5)",
                              borderBottom: "none",
                            }}
                          />
                          {/* Stage Wings */}
                          <div
                            className="absolute w-[50px] h-[190px] rounded-l-lg"
                            style={{
                              background: "linear-gradient(90deg, rgba(255,183,3,0.3) 0%, rgba(104,1,209,0.15) 100%)",
                              transform: "translateZ(18px) translateX(-70px) rotateY(90deg)",
                              border: "2px solid rgba(255,183,3,0.4)",
                            }}
                          />
                          <div
                            className="absolute w-[50px] h-[190px] rounded-r-lg"
                            style={{
                              background: "linear-gradient(-90deg, rgba(255,183,3,0.3) 0%, rgba(104,1,209,0.15) 100%)",
                              transform: "translateZ(18px) translateX(210px) rotateY(-90deg)",
                              border: "2px solid rgba(255,183,3,0.4)",
                            }}
                          />
                          {/* Center Spotlight Ring */}
                          <div
                            className="absolute w-[45px] h-[45px] rounded-full"
                            style={{
                              background: "radial-gradient(circle, rgba(255,183,3,0.9) 0%, rgba(104,1,209,0.4) 50%, transparent 70%)",
                              transform: "translateZ(80px) translateX(72px) translateY(72px)",
                              animation: "pulse-glow 2s ease-in-out infinite",
                            }}
                          />
                        </div>

                        {/* Audience Zones 3D */}
                        <div
                          className="absolute"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: "rotateX(55deg) rotateZ(-45deg) translateY(110px)",
                          }}
                        >
                          <div
                            className="absolute w-[280px] h-[140px] rounded-lg border-2 border-[#ffb703]/40"
                            style={{
                              background: "linear-gradient(180deg, rgba(255,183,3,0.12) 0%, rgba(104,1,209,0.06) 100%)",
                              transform: "translateZ(-10px)",
                            }}
                          />
                          <div
                            className="absolute w-[70px] h-[140px] rounded-l-lg border-2 border-[#d5baff]/40"
                            style={{
                              background: "linear-gradient(90deg, rgba(213,186,255,0.15) 0%, rgba(213,186,255,0.04) 100%)",
                              transform: "translateZ(-5px) translateX(-170px)",
                            }}
                          />
                          <div
                            className="absolute w-[70px] h-[140px] rounded-r-lg border-2 border-[#d5baff]/40"
                            style={{
                              background: "linear-gradient(-90deg, rgba(213,186,255,0.15) 0%, rgba(213,186,255,0.04) 100%)",
                              transform: "translateZ(-5px) translateX(280px)",
                            }}
                          />
                        </div>

                        {/* Light Beams */}
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <div
                            className="absolute top-0 left-1/4 w-[3px] h-full origin-top"
                            style={{
                              background: "linear-gradient(180deg, rgba(255,183,3,0.8) 0%, transparent 100%)",
                              transform: "rotate(-18deg)",
                              animation: "light-beam 2.5s ease-in-out infinite alternate",
                              filter: "blur(1px)",
                            }}
                          />
                          <div
                            className="absolute top-0 right-1/4 w-[3px] h-full origin-top"
                            style={{
                              background: "linear-gradient(180deg, rgba(104,1,209,0.8) 0%, transparent 100%)",
                              transform: "rotate(18deg)",
                              animation: "light-beam 2.5s ease-in-out infinite alternate-reverse",
                              filter: "blur(1px)",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 flex justify-between text-[10px]">
                      <span className="text-[#ffb703] font-bold">MAIN STAGE</span>
                      <span className="text-[#d5baff] font-bold">TRIBUNE A & B</span>
                      <span className="text-[#ffd9c0] font-bold">VIP HOSPITALITY</span>
                    </div>
                  </div>

                  {/* Seat Categories Legend */}
                  <div className="flex flex-wrap items-center gap-4 border-t border-[#1e2128] px-5 py-3">
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-[#ffb703]" />
                      <span className="text-[11px] text-[#e1e2ec]">Festival Standing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-[#d5baff]" />
                      <span className="text-[11px] text-[#e1e2ec]">Tribune Numbered</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="h-3 w-3 rounded-sm bg-[#ffd9c0]" />
                      <span className="text-[11px] text-[#e1e2ec]">VIP Hospitality Pass</span>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* Right column explanation */}
              <Reveal delay={120} className="space-y-6 lg:col-span-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#ffb703]">Transparansi Panggung</p>
                  <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl">
                    Pilih Kursi Nyaman Tanpa Blind Spot
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#8a8d98]">
                    Sistem visualisasi venue interaktif memungkinkanmu memeriksa perkiraan jarak ke panggung dan tata suara sebelum memesan tiket konser.
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { icon: Eye, title: "Preview Sudut Pandang 360°", desc: "Pastikan tidak ada pilar atau halangan sound tower.", color: "#ffb703" },
                    { icon: Users, title: "Aksesibilitas & Jalur Medis", desc: "Titik kursi khusus kursi roda dan akses evakuasi cepat.", color: "#d5baff" },
                    { icon: Ticket, title: "Blok Kursi Bersebelahan", desc: "Pesan tiket bersama teman di blok yang sama secara otomatis.", color: "#ffdea9" },
                  ].map(({ icon: Icon, title, desc, color }) => (
                    <div
                      key={title}
                      className="group flex items-start gap-3.5 rounded-xl border border-[#232733] bg-[#191b23] p-4 transition-all hover:border-[#3a3d46] hover:bg-[#1d1f27] hover-sheen"
                    >
                      <span
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform group-hover:scale-110"
                        style={{ backgroundColor: `${color}15` }}
                      >
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
          </div>
        </section>

        {/* ==================== POPULAR ARTISTS SPOTLIGHT ==================== */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-[#ffb703]">Musisi & Band</p>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl">
                Artis Populer Minggu Ini
              </h2>
              <p className="mt-1 text-xs text-[#8a8d98]">
                Ikuti musisi idolamu dan dapatkan notifikasi presale konser lebih awal.
              </p>
            </div>
            <Link
              href="/artists"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] hover:text-[#ffdea9] transition-colors"
            >
              Semua Artis <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          {artists.length > 0 ? (
            <Stagger className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4" step={60}>
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/35 hover:shadow-xl hover:shadow-black/30 hover-sheen"
                >
                  <div className="relative mx-auto aspect-square w-28 sm:w-32 overflow-hidden rounded-full border-2 border-[#2a2d36] bg-[#1e2128] group-hover:border-[#ffb703]/50 transition-colors">
                    <Image
                      src={resolveMediaUrl(artist.photo || "/globe.svg")}
                      alt={artist.name}
                      fill
                      sizes="128px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110 zoom-media"
                    />
                  </div>
                  <h4 className="mt-4 truncate text-sm font-bold text-[#e1e2ec] transition-colors group-hover:text-[#ffb703]">
                    {artist.name}
                  </h4>
                  <p className="mt-1 truncate text-[10px] uppercase tracking-wider text-[#8a8d98]">
                    {artist.genre || "Musisi"}
                  </p>
                </Link>
              ))}
            </Stagger>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#2a2d36] bg-[#191b23]/50 px-6 py-10 text-center">
              <Mic2 className="mx-auto h-7 w-7 text-[#ffb703]" />
              <p className="mt-3 text-xs text-[#8a8d98]">Belum ada artis yang ditampilkan saat ini.</p>
            </div>
          )}
        </section>

        {/* ==================== WHY TIXORA / TRUST & SECURITY ==================== */}
        <section className="w-full border-y border-[#1e2128] bg-[#0e1118] px-5 py-20 sm:px-8">
          <div className="mx-auto max-w-7xl">
            <Reveal className="mx-auto mb-12 max-w-2xl text-center">
              <p className="text-[11px] uppercase tracking-widest text-[#ffb703]">Keunggulan Platform</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl">
                Jaminan Nonton Konser Aman & Nyaman
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[#8a8d98] sm:text-sm">
                Dirancang khusus untuk konser skala nasional dan internasional dengan standar keamanan tinggi.
              </p>
            </Reveal>

            <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" step={60}>
              {FEATURES.map(({ icon: Icon, title, desc, tag, color }) => (
                <div
                  key={title}
                  className="group relative rounded-2xl border border-[#232733] bg-[#191b23] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffb703]/25 hover:shadow-xl hover:shadow-black/30 overflow-hidden hover-sheen"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: `radial-gradient(circle at 50% 0%, ${color}10, transparent 70%)` }}
                  />

                  {/* Bar rise animation */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 flex items-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-t-full origin-bottom"
                        style={{
                          backgroundColor: color,
                          height: "100%",
                          animation: `bar-rise 1.5s ease-in-out ${i * 0.08}s infinite alternate`,
                        }}
                      />
                    ))}
                  </div>

                  <span
                    className="relative mb-4 flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${color}15` }}
                  >
                    <Icon className="h-5 w-5" style={{ color }} />
                  </span>
                  <h3 className="relative font-bold text-sm text-[#e1e2ec]">{title}</h3>
                  <p className="relative mt-2 text-xs leading-relaxed text-[#8a8d98]">{desc}</p>
                  <span
                    className="relative mt-4 inline-flex items-center gap-1.5 text-[11px] font-semibold"
                    style={{ color }}
                  >
                    <BadgeCheck className="h-3.5 w-3.5" />
                    {tag}
                  </span>
                </div>
              ))}
            </Stagger>
          </div>
        </section>

        {/* ==================== VIP BLACK TIER BANNER ==================== */}
        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[#232733] bg-gradient-to-br from-[#191b23] via-[#1d1f27] to-[#191b23] group hover-sheen">
              <div className="absolute -right-20 -top-20 h-[300px] w-[300px] rounded-full bg-[#ffb703]/10 blur-[80px] animate-[drift-a_15s_ease-in-out_infinite_alternate]" />
              <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-[#6801d1]/10 blur-[80px] animate-[drift-b_18s_ease-in-out_infinite_alternate]" />

              <div className="relative grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-12">
                <div className="space-y-4 lg:col-span-8">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-4 py-1.5">
                    <Star className="h-3.5 w-3.5 text-[#ffb703]" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-[#ffb703]">
                      VIP Hospitality & Soundcheck Pass
                    </span>
                  </div>
                  <h2 className="max-w-xl text-2xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-3xl lg:text-4xl">
                    Nikmati Akses Karpet Merah & Lounge Ber-AC
                  </h2>
                  <p className="max-w-lg text-xs leading-relaxed text-[#8a8d98] sm:text-sm">
                    Dapatkan soundcheck pass eksklusif, meet & greet terpilih, merchandise limited edition, dan jalur masuk VIP tanpa antrian panjang di gate konser.
                  </p>
                  <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link
                      href="/events"
                      className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-7 py-3 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/25 transition-all hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 press"
                    >
                      <Star className="h-4 w-4" />
                      <span>Jelajahi Tiket VIP</span>
                    </Link>
                    <Link
                      href={user ? "/tickets" : "/register"}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#10131a]/60 px-6 py-3 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffdea9]"
                    >
                      <span>{user ? "Cek Tiket Saya" : "Daftar Member"}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
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

        {/* ==================== DROP TICKET NEWSLETTER ==================== */}
        <section className="mx-auto max-w-7xl px-5 pb-24 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-8 sm:p-12 group hover-sheen">
              <div className="absolute -right-10 -top-10 h-[200px] w-[200px] rounded-full bg-[#ffb703]/[0.08] blur-[60px]" />
              <div className="absolute -left-10 -bottom-10 h-[200px] w-[200px] rounded-full bg-[#6801d1]/[0.06] blur-[60px]" />

              <div className="relative grid items-center gap-8 lg:grid-cols-12">
                <div className="space-y-2 lg:col-span-7">
                  <p className="text-[11px] uppercase tracking-widest text-[#ffb703]">Notifikasi Instan</p>
                  <h3 className="text-2xl font-extrabold tracking-tight text-[#e1e2ec]">
                    Jangan Ketinggalan Presale Konser Artis Favorit
                  </h3>
                  <p className="text-xs leading-relaxed text-[#8a8d98]">
                    Dapatkan alert pembukaan tiket, kuota flash sale bank partner, dan jadwal tur konser langsung di akunmu.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <form className="flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
                    <input
                      placeholder="Masukkan email kamu..."
                      type="email"
                      className="flex-1 rounded-xl border border-[#232733] bg-[#1d1f27] px-4 py-3 text-xs text-[#e1e2ec] outline-none placeholder:text-[#525666] focus:border-[#ffb703]/50"
                    />
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#ffb703] px-6 py-3 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:bg-[#ffdea9] press"
                    >
                      Langganan
                    </button>
                  </form>
                  <p className="mt-2 text-[10px] text-[#7a7d88]">Bebas spam. Kamu dapat berhenti berlangganan kapan saja.</p>
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
