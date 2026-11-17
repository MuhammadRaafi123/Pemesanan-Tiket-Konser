"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  CreditCard,
  Eye,
  Layers,
  Lock,
  MapPin,
  Music,
  Play,
  QrCode,
  Radio,
  RefreshCw,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Users,
  Volume2,
  X,
  Zap,
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

/* ================================= DATA ================================= */

const MARQUEE_ARTISTS = [
  "Coldplay",
  "Sheila On 7",
  "Stray Kids",
  "Ed Sheeran",
  "Bruno Major",
  "NIKI",
  "Tulus",
  "Hindia",
  "Reality Club",
  "Rich Brian",
  "Raim Laode",
  "Payung Teduh",
];

const GENRES = [
  { id: "Semua", label: "Semua Genre", icon: Sparkles, count: "50+ Event" },
  { id: "Pop", label: "Pop", icon: Music, count: "18 Konser" },
  { id: "Rock", label: "Rock & Indie", icon: Volume2, count: "14 Konser" },
  { id: "K-Pop", label: "K-Pop", icon: Star, count: "8 Konser" },
  { id: "Festival", label: "Festival", icon: Layers, count: "6 Event" },
  { id: "EDM", label: "EDM & Rave", icon: Zap, count: "11 Event" },
  { id: "Jazz", label: "Jazz & Soul", icon: Music, count: "5 Jadwal" },
];

const CITIES = [
  "Semua Kota",
  "Jakarta",
  "Bandung",
  "Surabaya",
  "Bali",
  "Yogyakarta",
  "Semarang",
];

const SECURITY_FEATURES = [
  {
    icon: QrCode,
    badge: "ISO 27001 ENCRYPTED",
    title: "Dynamic Anti-Calo Barcode",
    desc: "Token barcode kriptografi SHA-256 yang berganti otomatis setiap 30 detik. Tangkapan layar, duplikat PDF, dan calo tiket 100% tertolak di gerbang scan gate.",
    accent: "from-[#6264b5]/10 to-transparent",
    pillColor: "text-[#6264b5] border-[#c8b7db] bg-[#c8b7db]/20",
  },
  {
    icon: Zap,
    badge: "NEURAL BOT SHIELD",
    title: "Antrean War Cerdas & Adil",
    desc: "Arsitektur penahan bot canggih dengan mitigasi multi-IP dan traffic limiter real-time. Rasakan checkout tiket tanpa crash dan adil bagi seluruh penggemar sejati.",
    accent: "from-[#c8b7db]/20 to-transparent",
    pillColor: "text-[#071653] border-[#6264b5]/30 bg-[#6264b5]/10",
  },
  {
    icon: CreditCard,
    badge: "INSTANT SETTLEMENT",
    title: "Pembayaran Instan Terverifikasi",
    desc: "Mendukung QRIS otomatis, Virtual Account semua bank nasional, GoPay, OVO, hingga kartu kredit cicilan 0% dengan konfirmasi real-time dalam 3 detik.",
    accent: "from-[#6264b5]/10 to-transparent",
    pillColor: "text-[#6264b5] border-[#c8b7db] bg-[#c8b7db]/20",
  },
  {
    icon: Shield,
    badge: "PROTEKSI FINANSIAL",
    title: "100% Garansi Refund Resmi",
    desc: "Jaminan pengembalian dana penuh tanpa potongan berbelit jika musisi berhalangan hadir atau jadwal konser dibatalkan resmi oleh pihak promotor.",
    accent: "from-[#c8b7db]/20 to-transparent",
    pillColor: "text-[#071653] border-[#6264b5]/30 bg-[#6264b5]/10",
  },
];

interface SeatingZone {
  id: string;
  name: string;
  price: string;
  distance: string;
  visibility: string;
  color: string;
  features: string[];
}

const SEATING_ZONES: Record<string, SeatingZone> = {
  vvip: {
    id: "vvip",
    name: "Royal Lounge VVIP",
    price: "Rp 3.850.000",
    distance: "12 m dari panggung",
    visibility: "Pandangan panorama dari area lounge",
    color: "#6264b5",
    features: [
      "Area lounge eksklusif dengan pendingin ruangan",
      "Jalur masuk khusus tanpa antre panjang",
      "Akses sesi soundcheck terbatas",
      "Layanan dan konsumsi premium",
    ],
  },
  diamond: {
    id: "diamond",
    name: "Pit Diamond",
    price: "Rp 2.250.000",
    distance: "3 m dari bibir panggung",
    visibility: "Barisan depan, tepat menghadap panggung",
    color: "#071653",
    features: [
      "Posisi paling dekat dengan panggung",
      "Suara dan efek cahaya terasa maksimal",
      "Jalur masuk lebih awal",
      "Merchandise khusus kategori",
    ],
  },
  platinum: {
    id: "platinum",
    name: "Tribun Platinum",
    price: "Rp 1.450.000",
    distance: "30 m dari panggung",
    visibility: "Tribun tinggi dengan pandangan luas",
    color: "#6264b5",
    features: [
      "Kursi bernomor ergonomis dengan sandaran tangan",
      "Sudut elevasi tinggi tanpa terhalang barisan depan",
      "Akustik tata suara surround paling seimbang",
      "Akses toilet dan area makanan khusus tribun",
    ],
  },
  festival: {
    id: "festival",
    name: "Area Festival",
    price: "Rp 850.000",
    distance: "20 m dari panggung",
    visibility: "Area berdiri dengan suasana meriah",
    color: "#8486d4",
    features: [
      "Lautan penonton dengan atmosfer euforia terbaik",
      "Kebebasan bergerak di seluruh area festival luas",
      "Akses merchandise booth & visual screens raksasa",
      "Gelang masuk khusus yang menyala saat konser dimulai",
    ],
  },
};

const TESTIMONIALS = [
  {
    name: "Audrey Kirana",
    role: "GBK Senayan • War Tiket Coldplay",
    avatar: "A",
    text: "Sistem antrean Tixora beneran lancar tanpa reload! Progress bar antreannya transparan, begitu dapat giliran langsung bayar via QRIS, 2 menit tiket digital ber-barcode aktif langsung tersimpan di akun.",
    rating: 5,
    tag: "Verified VIP Pass",
  },
  {
    name: "Dimas Wicaksono",
    role: "ICE BSD • Festival Musik Internasional",
    avatar: "D",
    text: "Fitur Dynamic Barcode-nya luar biasa aman. Barcode-nya mutar token tiap 30 detik jadi mustahil dijual oknum calo lewat screenshot. Pas scan di gate cuma tap sekali langsung bunyi beep hijau. Sangat rapi!",
    rating: 5,
    tag: "Verified Diamond Fan",
  },
  {
    name: "Nathania & Arga",
    role: "GWK Bali • Soundcheck Hospitality Experience",
    avatar: "N",
    text: "Peta 3D Seat Map-nya super akurat! View panggung yang kita liat di web sama persis waktu kita duduk di venue aslinya. Fasilitas lounge VVIP-nya mewah dan penukaran gelang wristband tanpa antre sama sekali.",
    rating: 5,
    tag: "Verified VVIP Guest",
  },
];

/* ============================ SUB-COMPONENTS ============================ */

function FuturisticCountdownBox({
  value,
  label,
  highlight,
}: {
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative flex flex-col items-center justify-center rounded-xl border p-2.5 transition-all duration-300 ${
        highlight
          ? "border-[#6264b5] bg-gradient-to-b from-[#6264b5]/15 to-[#c8b7db]/20 shadow-[0_4px_16px_rgba(98,100,181,0.2)]"
          : "border-[#c8b7db]/40 bg-[#f7f4fa] hover:border-[#6264b5]/40 hover:bg-[#eeebf4]"
      }`}
    >
      <span
        className={`font-mono text-xl font-extrabold tracking-tight ${
          highlight ? "text-[#6264b5]" : "text-[#071653]"
        }`}
      >
        {value}
      </span>
      <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-[#5c6482]">
        {label}
      </span>
      {highlight && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#6264b5] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#6264b5]" />
        </span>
      )}
    </div>
  );
}

function LuxuryTicketCard({ event, index }: { event: Event; index: number }) {
  const minPrice = event.min_price ?? 0;
  const poster = resolveMediaUrl(event.poster || "");

  return (
    <Reveal delay={index * 60}>
      <Link
        href={`/events/${event.id}`}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#e8e5ef] bg-white shadow-[0_2px_10px_rgba(7,22,83,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#c8b7db] hover:shadow-[0_14px_32px_-12px_rgba(7,22,83,0.16)]"
      >
        {/* Media Container */}
        <div className="relative h-52 w-full overflow-hidden bg-[#f4f2f7]">
          {poster ? (
            <Image
              src={poster}
              alt={event.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#eeebf4] to-[#e4dfed]">
              <Ticket className="h-10 w-10 text-[#c8b7db]" />
            </div>
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/10" />

          {/* Badges */}
          <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
            {event.genre && (
              <span className="rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold text-[#071653] shadow-sm">
                {event.genre}
              </span>
            )}
          </div>

          {/* Date and location */}
          <div className="absolute inset-x-3.5 bottom-3 flex items-center gap-2 text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/95 px-2.5 py-1 font-semibold text-[#071653] shadow-sm">
              <CalendarDays className="h-3 w-3 text-[#6264b5]" />
              {formatEventDate(event.event_date, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="truncate rounded-lg bg-white/95 px-2.5 py-1 font-semibold text-[#071653] shadow-sm">{event.location}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-4 sm:p-5">
          <p className="truncate text-[10px] font-semibold uppercase tracking-[0.12em] text-[#777b98]">
            {event.artist_names?.join(", ") || "Live Concert Experience"}
          </p>
          <h3 className="mt-1 line-clamp-1 text-lg font-bold text-[#071653] transition-colors duration-300 group-hover:text-[#6264b5]">
            {event.title}
          </h3>
          <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#5c6482]">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-[#6264b5]" />
            <span className="truncate">{event.venue || event.location}</span>
          </p>

          {/* Ticket categories */}
          {event.ticket_categories && event.ticket_categories.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {event.ticket_categories.slice(0, 3).map((cat) => (
                <span
                  key={cat.id}
                  className="rounded-md bg-[#f5f4f8] px-2 py-1 text-[10px] font-medium text-[#555c7b]"
                >
                  {cat.category_name}
                </span>
              ))}
            </div>
          )}

          {/* Footer Card Pricing & Action */}
          <div className="mt-auto flex items-center justify-between border-t border-[#eeecf2] pt-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#5c6482]">
                Mulai Dari
              </span>
              <p className="mt-0.5 text-base font-bold text-[#071653]">
                {formatCurrency(minPrice)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#6264b5] px-3 py-2 text-xs font-semibold text-white transition-colors duration-300 group-hover:bg-[#51539f]">
              Beli Tiket
              <ChevronRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </Reveal>
  );
}

/* ================================== PAGE ================================== */

export default function LandingPage() {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("Semua");
  const [selectedCity, setSelectedCity] = useState("Semua Kota");
  const [activeZoneKey, setActiveZoneKey] = useState<string>("diamond");
  const [countdown, setCountdown] = useState({ d: "02", h: "14", m: "25", s: "33" });
  const [qrTokenSeconds, setQrTokenSeconds] = useState(28);
  const [tokenHash, setTokenHash] = useState("TX-8492-B7F1-LIVE");
  const [isGateScanning, setIsGateScanning] = useState(false);
  const [gateScanResult, setGateScanResult] = useState<"idle" | "success">("idle");
  const [copiedToken, setCopiedToken] = useState(false);
  const [qrDisplayMode, setQrDisplayMode] = useState<"gif" | "qr">("gif");

  useEffect(() => {
    let active = true;
    fetchEvents({ limit: 8, status: "open" })
      .then((data) => {
        if (active) setEvents(data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  // Presale Countdown
  useEffect(() => {
    let s = 33,
      m = 25,
      h = 14,
      d = 2;
    const id = setInterval(() => {
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
      setCountdown({
        d: String(d).padStart(2, "0"),
        h: String(h).padStart(2, "0"),
        m: String(m).padStart(2, "0"),
        s: String(s).padStart(2, "0"),
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // Dynamic QR Token Counter
  useEffect(() => {
    const id = setInterval(() => {
      setQrTokenSeconds((prev) => {
        if (prev <= 1) {
          setTokenHash(
            `TX-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(16).substring(2, 6).toUpperCase()}-LIVE`
          );
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const handleManualRotateToken = () => {
    setQrTokenSeconds(30);
    setTokenHash(
      `TX-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(16).substring(2, 6).toUpperCase()}-LIVE`
    );
  };

  const handleSimulateGateScan = () => {
    if (isGateScanning) return;
    setQrDisplayMode("gif");
    setIsGateScanning(true);
    setGateScanResult("idle");
    setTimeout(() => {
      setIsGateScanning(false);
      setGateScanResult("success");
      setTimeout(() => {
        setGateScanResult("idle");
      }, 5000);
    }, 900);
  };

  const handleCopyToken = () => {
    navigator.clipboard?.writeText(tokenHash);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  const filteredEvents = events.filter((e) => {
    const matchSearch =
      !searchQuery ||
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.artist_names || []).some((a) =>
        a.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    const matchGenre =
      selectedGenre === "Semua" ||
      (e.genre || "").toLowerCase().includes(selectedGenre.toLowerCase());
    const matchCity =
      selectedCity === "Semua Kota" ||
      (e.location || "").toLowerCase().includes(selectedCity.toLowerCase());
    return matchSearch && matchGenre && matchCity;
  });

  const featuredEvent = events.find((e) => e.featured) || events[0];
  const activeZone = SEATING_ZONES[activeZoneKey] || SEATING_ZONES.diamond;

  return (
    <div className="landing-page min-h-screen bg-[#fffdf2] text-[#071653] selection:bg-[#6264b5]/25 selection:text-[#071653]">
      <Navbar />

      <main>
        {/* ==================== HERO / HEADER SECTION ==================== */}
        <section className="relative overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-36 lg:pb-28">
          {/* Header Background Image: background-header.png */}
          <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
            <Image
              src="/background-header.png"
              alt="Background Header"
              fill
              priority
              quality={90}
              className="object-cover object-center [animation:drift-a_22s_ease-in-out_infinite_alternate]"
            />
            {/* Cinematic Gradient Overlays for contrast, readability, and seamless transition */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#070914]/85 via-[#071653]/65 to-[#fffdf2]" />
            <div className="absolute inset-0 bg-[#070914]/30 backdrop-blur-[0.5px]" />

            {/* Subtle Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Glowing Auroras in Lilac & Royal Iris */}
            <div className="absolute -top-32 left-1/2 h-[550px] w-[900px] -translate-x-1/2">
              <div className="h-full w-full rounded-full bg-gradient-to-b from-[#6264b5]/35 via-[#c8b7db]/20 to-transparent blur-[140px] [animation:drift-b_18s_ease-in-out_infinite_alternate]" />
            </div>
            <div className="absolute right-[8%] top-[28%] h-[300px] w-[420px] rounded-full bg-[#8b7bff]/15 blur-[120px] [animation:drift-b_16s_ease-in-out_infinite_alternate]" />

          </div>

          <div className="relative mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-8">
              {/* Left Column: Tixora Brand Capsule, Copy & CTA */}
              <div className="space-y-7 lg:col-span-7">


                <Reveal delay={100}>
                  <h1 className="font-extrabold tracking-tight text-white text-[clamp(2.5rem,5.2vw,4.5rem)] leading-[1.08] drop-shadow-md">
                    Konser Impianmu,
                    <br />
                    <span className="bg-gradient-to-r from-[#d5baff] via-[#ffffff] to-[#c8b7db] bg-clip-text text-transparent">
                      Satu Detak Bersama Tixora.
                    </span>
                  </h1>
                </Reveal>

                <Reveal delay={180}>
                  <p className="max-w-xl text-base leading-relaxed text-[#d0d3e2] sm:text-lg drop-shadow-sm">
                    Platform tiket konser kurasi resmi dengan Dynamic Anti-Calo Barcode,
                    visualisasi stadium 3D interaktif, dan proteksi refund resmi 100%.
                    Dari musisi lokal legendaris hingga tur dunia spektakuler.
                  </p>
                </Reveal>

                <Reveal delay={240}>
                  <div className="flex flex-wrap items-center gap-4">
                    <Link
                      href="/events"
                      className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#6264b5] via-[#7577cf] to-[#6264b5] px-7 py-4 text-sm font-bold text-[#fffdf2] shadow-[0_10px_25px_-5px_rgba(98,100,181,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_15px_30px_-5px_rgba(98,100,181,0.65)]"
                    >
                      {user ? "Cari Konser Berikutnya" : "Jelajahi Konser Resmi"}
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>

                    <a
                      href="#venue-3d"
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-4 text-sm font-semibold text-white shadow-sm backdrop-blur-xl transition-all duration-300 hover:border-[#6264b5] hover:bg-white/20 hover:text-white"
                    >
                      <Eye className="h-4 w-4 text-[#c8b7db]" />
                      Simulator Panggung 3D
                    </a>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* ==================== BRIGHT FUTURISTIC SEARCH TERMINAL ==================== */}
            <Reveal delay={360}>
              <div className="mt-12 mx-auto w-full max-w-7xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("upcoming-concerts");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group relative flex flex-col min-[900px]:flex-row min-[900px]:items-center rounded-[28px] min-[900px]:rounded-full border border-white/15 bg-[#0b1230]/85 p-2.5 shadow-[0_24px_70px_-24px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-2xl transition-all duration-300 hover:border-[#a6a8ff]/35 hover:bg-[#0d1537]/90"
                >
                  {/* Search Query Field */}
                  <div className="relative flex min-h-[72px] flex-1 items-center gap-4 rounded-2xl min-[900px]:rounded-full border-b border-white/10 px-4 min-[900px]:border-b-0 min-[900px]:border-r min-[900px]:px-6 py-3 transition-colors hover:bg-white/[0.04] focus-within:bg-white/[0.06]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#a5a7ff]/20 bg-[#6264b5]/20 text-[#c5c6ff]">
                      <Search className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="landing-event-search" className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-[#aeb1ed]">
                        Cari Musisi / Jadwal Konser
                      </label>
                      <input
                        id="landing-event-search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Coldplay, Sheila On 7, NIKI..."
                        className="mt-1 w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-[#9aa2c1]"
                      />
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="rounded-full p-1.5 text-[#aab0ca] transition-colors hover:bg-white/10 hover:text-white"
                        aria-label="Hapus pencarian"
                        title="Hapus pencarian"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* City Selector Field */}
                  <div className="relative flex min-h-[72px] items-center gap-4 rounded-2xl min-[900px]:rounded-full border-b border-white/10 px-4 min-[900px]:w-[23%] min-[900px]:border-b-0 min-[900px]:border-r min-[900px]:px-4 py-3 transition-colors hover:bg-white/[0.04] focus-within:bg-white/[0.06]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#a5a7ff]/20 bg-[#6264b5]/20 text-[#c5c6ff]">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="landing-event-city" className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-[#aeb1ed]">
                        Kota Venue
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="landing-event-city"
                          aria-label="Pilih kota venue"
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="mt-1 w-full appearance-none bg-transparent pr-1 text-[13px] font-semibold text-white outline-none cursor-pointer"
                        >
                          {CITIES.map((city) => (
                            <option key={city} value={city} className="bg-[#111832] text-white">
                              {city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#b8bbec]" />
                      </div>
                    </div>
                  </div>

                  {/* Genre Selector Field */}
                  <div className="relative flex min-h-[72px] items-center gap-4 rounded-2xl min-[900px]:rounded-full px-4 min-[900px]:w-[23%] min-[900px]:px-4 py-3 transition-colors hover:bg-white/[0.04] focus-within:bg-white/[0.06]">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-[#a5a7ff]/20 bg-[#6264b5]/20 text-[#c5c6ff]">
                      <Music className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <label htmlFor="landing-event-genre" className="block whitespace-nowrap text-[10px] font-bold uppercase tracking-[0.14em] text-[#aeb1ed]">
                        Kategori Genre
                      </label>
                      <div className="relative flex items-center">
                        <select
                          id="landing-event-genre"
                          aria-label="Pilih kategori genre"
                          value={selectedGenre}
                          onChange={(e) => setSelectedGenre(e.target.value)}
                          className="mt-1 w-full appearance-none bg-transparent pr-1 text-[13px] font-semibold text-white outline-none cursor-pointer"
                        >
                          {GENRES.map((g) => (
                            <option key={g.id} value={g.id} className="bg-[#111832] text-white">
                              {g.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 h-4 w-4 text-[#b8bbec]" />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-1 min-[900px]:p-0 min-[900px]:pl-2">
                    <a
                      href="#upcoming-concerts"
                      className="inline-flex h-12 min-[900px]:h-[68px] w-full min-[900px]:w-auto items-center justify-center gap-2 rounded-2xl min-[900px]:rounded-full border border-white/20 bg-gradient-to-r from-[#6264b5] via-[#7b7ddd] to-[#6264b5] px-5 text-sm font-bold text-white shadow-[0_12px_30px_-8px_rgba(98,100,181,0.75)] transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 hover:shadow-[0_16px_34px_-8px_rgba(98,100,181,0.9)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#a5a7ff] active:translate-y-0 shrink-0"
                    >
                      <Search className="h-5 w-5" />
                      <span className="whitespace-nowrap">Temukan Tiket</span>
                    </a>
                  </div>
                </form>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ==================== ARTIST INFINITE MARQUEE ==================== */}
        <section className="relative w-full overflow-hidden border-y border-[#c8b7db]/40 bg-[#f7f4fa] py-5">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-r from-[#f7f4fa] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 z-10 w-32 bg-gradient-to-l from-[#f7f4fa] to-transparent" />
          <Marquee
            items={MARQUEE_ARTISTS}
            className="text-xs font-bold uppercase tracking-[0.3em] text-[#5c6482] hover:text-[#6264b5] transition-colors"
          />
        </section>

        {/* ==================== UPCOMING CONCERTS SHOWCASE ==================== */}
        <section id="upcoming-concerts" className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end mb-10">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6264b5]">
                Jadwal Konser Paling Dinanti
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#071653] sm:text-4xl">
                Kurasi Panggung 2026
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {(searchQuery || selectedGenre !== "Semua" || selectedCity !== "Semua Kota") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedGenre("Semua");
                    setSelectedCity("Semua Kota");
                  }}
                  className="rounded-xl border border-[#c8b7db] bg-white px-3.5 py-2 text-xs font-semibold text-[#071653] hover:text-[#6264b5] transition-colors"
                >
                  Reset Filter &times;
                </button>
              )}

              <Link
                href="/events"
                className="group inline-flex items-center gap-1.5 rounded-xl border border-[#c8b7db] bg-white px-4 py-2 text-xs font-bold text-[#6264b5] shadow-sm transition-all hover:bg-[#6264b5] hover:text-[#fffdf2]"
              >
                Lihat Semua ({events.length})
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Genre Tabs */}
          <div className="mb-10 flex flex-wrap gap-2 overflow-x-auto pb-2 scrollbar-none">
            {GENRES.map((g) => {
              const isSelected = selectedGenre === g.id;
              const Icon = g.icon;
              return (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setSelectedGenre(g.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? "bg-[#6264b5] text-[#fffdf2] shadow-md shadow-[#6264b5]/30"
                      : "border border-[#c8b7db]/60 bg-white text-[#071653] hover:border-[#6264b5] hover:text-[#6264b5]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{g.label}</span>
                </button>
              );
            })}
          </div>

          {/* Concerts Grid */}
          {filteredEvents.length > 0 ? (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={50}>
              {filteredEvents.map((event: Event, i: number) => (
                <LuxuryTicketCard key={event.id} event={event} index={i} />
              ))}
            </Stagger>
          ) : !loading ? (
            <div className="rounded-3xl border border-dashed border-[#c8b7db] bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#6264b5]/10 text-[#6264b5]">
                <Ticket className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-bold text-[#071653]">Tidak ada konser ditemukan</h4>
              <p className="mx-auto mt-1 max-w-sm text-sm text-[#5c6482]">
                Belum ada jadwal yang sesuai dengan filter pencarianmu saat ini.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGenre("Semua");
                  setSelectedCity("Semua Kota");
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6264b5] px-5 py-2.5 text-xs font-bold text-[#fffdf2] shadow-md hover:bg-[#51539f]"
              >
                Reset Semua Filter
              </button>
            </div>
          ) : null}
        </section>

        {/* ==================== SECURITY & ANTI-SCALPER ARCHITECTURE ==================== */}
        <section className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="mx-auto mb-16 max-w-2xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6264b5]">
              Infrastruktur & Arsitektur
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#071653] sm:text-4xl">
              Kenapa Jutaan Fans Memilih Tixora?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4b5578]">
              Dibangun dari nol untuk menangani lonjakan jutaan penonton Indonesia dengan teknologi
              kriptografi mutakhir dan standar keamanan perbankan.
            </p>
          </Reveal>

          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4" step={70}>
            {SECURITY_FEATURES.map((feat) => {
              const Icon = feat.icon;
              return (
                <div
                  key={feat.title}
                  className="group relative overflow-hidden rounded-3xl border border-[#c8b7db]/50 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#6264b5] hover:shadow-[0_20px_50px_-15px_rgba(7,22,83,0.12)]"
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-b ${feat.accent} opacity-0 transition-opacity duration-500 group-hover:opacity-100`}
                  />

                  <div className="relative">
                    <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c8b7db]/50 bg-[#f7f4fa] text-[#6264b5] transition-transform duration-500 group-hover:scale-110">
                      <Icon className="h-6 w-6" />
                    </span>

                    <span
                      className={`inline-block rounded-full border px-2.5 py-0.5 text-[9px] font-bold tracking-wider ${feat.pillColor}`}
                    >
                      {feat.badge}
                    </span>

                    <h3 className="mt-3 text-base font-extrabold text-[#071653]">{feat.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-[#4b5578]">{feat.desc}</p>
                  </div>
                </div>
              );
            })}
          </Stagger>
        </section>

        {/* ==================== 3D VENUE & SEAT SIMULATOR ==================== */}
        <section id="venue-3d" className="relative w-full border-y border-[#c8b7db]/40 bg-[#f7f4fa] py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              {/* Left: 3D Stage Simulation Canvas */}
              <Reveal className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-3xl border border-[#c8b7db]/50 bg-white shadow-xl">
                  {/* Top Header */}
                  <div className="flex items-center justify-between border-b border-[#c8b7db]/30 px-6 py-4">
                    <div>
                      <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#6264b5]">
                        SIMULASI TATA VENUE • GBK STADIUM
                      </span>
                      <h4 className="mt-0.5 text-base font-extrabold text-[#071653]">
                        Peta Panggung & Area Penonton
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-[#6264b5]/30 bg-[#6264b5]/10 px-3 py-1 text-[#6264b5]">
                      <span className="h-2 w-2 rounded-full bg-[#6264b5] animate-pulse" />
                      <span className="text-[10px] font-mono font-bold uppercase">Simulasi Aktif</span>
                    </div>
                  </div>

                  {/* 3D Scene Viewport */}
                  <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#eeebf4] to-[#e4dfed] p-6">
                    <div
                      className="relative h-[300px] w-full max-w-[560px]"
                      style={{ perspective: "1400px" }}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transformStyle: "preserve-3d",
                          animation: "stage-float 7s ease-in-out infinite",
                        }}
                      >
                        <div
                          aria-hidden="true"
                          className="absolute left-1/2 top-[53%] h-[230px] w-full max-w-[520px]"
                          style={{
                            transform: "translate(-50%, -50%) rotateX(58deg) rotateZ(-5deg)",
                            transformStyle: "preserve-3d",
                          }}
                        >
                          <div
                            className={`absolute inset-0 rounded-[50%] border-[16px] transition-all duration-500 ${
                              activeZoneKey === "platinum"
                                ? "border-[#6264b5]/90 bg-[#6264b5]/20 shadow-[0_0_42px_rgba(98,100,181,0.5)]"
                                : "border-[#8587c9]/55 bg-[#c8b7db]/15"
                            }`}
                          />
                          <div
                            className={`absolute inset-[12%] rounded-[50%] border-[14px] transition-all duration-500 ${
                              activeZoneKey === "diamond"
                                ? "border-[#071653]/90 bg-[#071653]/25 shadow-[0_0_36px_rgba(7,22,83,0.45)]"
                                : "border-[#7779be]/55 bg-[#6264b5]/10"
                            }`}
                          />
                          <div
                            className={`absolute inset-[25%] rounded-[50%] border-[12px] transition-all duration-500 ${
                              activeZoneKey === "festival"
                                ? "border-[#6264b5]/90 bg-[#6264b5]/30 shadow-[0_0_34px_rgba(98,100,181,0.5)]"
                                : "border-[#a49bd4]/60 bg-[#c8b7db]/20"
                            }`}
                          />
                          <div className="absolute inset-[39%] rounded-[50%] border border-white/70 bg-gradient-to-br from-[#fffdf2] to-[#d9d3ef] shadow-[inset_0_0_24px_rgba(98,100,181,0.18)]" />

                          <div className="absolute left-[20%] right-[20%] top-[13%] grid grid-cols-10 gap-x-2">
                            {Array.from({ length: 10 }, (_, index) => (
                              <span
                                key={`upper-seat-${index}`}
                                className={`h-1.5 rounded-full ${
                                  activeZoneKey === "platinum" ? "bg-[#6264b5]" : "bg-[#7779be]/70"
                                }`}
                              />
                            ))}
                          </div>
                          <div className="absolute bottom-[13%] left-[20%] right-[20%] grid grid-cols-10 gap-x-2">
                            {Array.from({ length: 10 }, (_, index) => (
                              <span
                                key={`lower-seat-${index}`}
                                className={`h-1.5 rounded-full ${
                                  activeZoneKey === "platinum" ? "bg-[#6264b5]" : "bg-[#7779be]/70"
                                }`}
                              />
                            ))}
                          </div>

                          <div
                            className={`absolute left-[31%] top-[39%] h-7 w-12 rounded-lg border transition-all duration-500 ${
                              activeZoneKey === "vvip"
                                ? "border-[#6264b5] bg-[#6264b5]/70 shadow-[0_0_24px_rgba(98,100,181,0.65)]"
                                : "border-[#6264b5]/60 bg-[#c8b7db]/70"
                            }`}
                            style={{ transform: "translateZ(32px)" }}
                          />
                          <div
                            className={`absolute right-[31%] top-[39%] h-7 w-12 rounded-lg border transition-all duration-500 ${
                              activeZoneKey === "vvip"
                                ? "border-[#6264b5] bg-[#6264b5]/70 shadow-[0_0_24px_rgba(98,100,181,0.65)]"
                                : "border-[#6264b5]/60 bg-[#c8b7db]/70"
                            }`}
                            style={{ transform: "translateZ(32px)" }}
                          />

                          <svg
                            aria-hidden="true"
                            viewBox="0 0 300 180"
                            className="absolute left-1/2 top-[20%] h-[180px] w-[300px] max-w-[74%] overflow-visible"
                            style={{ transform: "translate(-50%, -50%) translateZ(48px)" }}
                          >
                            <defs>
                              <linearGradient id="venue-stage-screen" x1="0" y1="0" x2="1" y2="1">
                                <stop offset="0" stopColor="#161942" />
                                <stop offset="0.55" stopColor="#41458f" />
                                <stop offset="1" stopColor="#7779d1" />
                              </linearGradient>
                              <linearGradient id="venue-stage-deck" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="#8c8fe0" />
                                <stop offset="1" stopColor="#45488f" />
                              </linearGradient>
                              <linearGradient id="venue-stage-beam" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0" stopColor="#d7ccff" stopOpacity="0.5" />
                                <stop offset="1" stopColor="#a8a2ff" stopOpacity="0" />
                              </linearGradient>
                              <filter id="venue-stage-glow" x="-50%" y="-50%" width="200%" height="200%">
                                <feGaussianBlur stdDeviation="7" />
                              </filter>
                            </defs>

                            <path d="M83 91 19 170h85l20-70Z" fill="url(#venue-stage-beam)" />
                            <path d="m217 91 64 79h-85l-20-70Z" fill="url(#venue-stage-beam)" />
                            <ellipse cx="150" cy="106" rx="82" ry="18" fill="#7779d1" opacity="0.32" filter="url(#venue-stage-glow)" />

                            <path d="M42 37h216M54 37v72m192-72v72M54 66h192" fill="none" stroke="#42457f" strokeWidth="5" strokeLinecap="round" />
                            <path d="M54 37h192M65 37v72m170-72v72" fill="none" stroke="#a9abe9" strokeWidth="1.5" opacity="0.8" />
                            <path d="m66 39 40 26m-40 0 40-28m48 2 40 26m-40 0 40-28m-96 1 32 22m64-22-32 22" fill="none" stroke="#c9caff" strokeWidth="1" opacity="0.65" />

                            {[74, 112, 150, 188, 226].map((x) => (
                              <g key={x}>
                                <circle cx={x} cy="38" r="5" fill="#fffdf2" />
                                <circle cx={x} cy="38" r="10" fill="#b9b4ff" opacity="0.32" filter="url(#venue-stage-glow)" />
                              </g>
                            ))}

                            <path d="m74 52 152 0 13 53H61Z" fill="#25285d" stroke="#b5b6ff" strokeWidth="2" />
                            <path d="m82 58 136 0 9 39H73Z" fill="url(#venue-stage-screen)" />
                            <path d="M86 63h128" stroke="#bdbdff" strokeWidth="1.5" opacity="0.85" />
                            <text x="150" y="82" fill="#fffdf2" textAnchor="middle" fontSize="12" fontWeight="800" letterSpacing="2.5">TIXORA</text>
                            <text x="150" y="92" fill="#d8d8ff" textAnchor="middle" fontSize="5.5" fontWeight="700" letterSpacing="2">LIVE IN CONCERT</text>

                            <path d="m42 108 216 0 21 17H21Z" fill="#34366f" />
                            <path d="m48 105 204 0 17 13H31Z" fill="url(#venue-stage-deck)" stroke="#d4d4ff" strokeWidth="1.5" />
                            <path d="m124 117 52 0 14 42h-80Z" fill="url(#venue-stage-deck)" stroke="#d4d4ff" strokeWidth="1.5" />
                            <path d="m110 159 80 0 8 8h-96Z" fill="#45488f" stroke="#bcbcff" strokeWidth="1" />
                            <path d="M61 108h178" stroke="#fffdf2" strokeWidth="2" opacity="0.8" />
                          </svg>
                        </div>

                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                          <div
                            className="absolute left-[18%] top-[8%] h-[85%] w-px origin-top bg-gradient-to-b from-[#6264b5]/70 via-[#c8b7db]/50 to-transparent blur-[1px]"
                            style={{ animation: "light-beam 3s ease-in-out infinite alternate" }}
                          />
                          <div
                            className="absolute right-[18%] top-[8%] h-[85%] w-px origin-top bg-gradient-to-b from-[#c8b7db] via-[#6264b5]/50 to-transparent blur-[1px]"
                            style={{ animation: "light-beam 3.5s ease-in-out infinite alternate-reverse" }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-[11px] font-mono font-bold text-[#071653]">
                      <span>PANGGUNG</span>
                      <span>PIT DIAMOND</span>
                      <span>TRIBUN</span>
                      <span>LOUNGE VVIP</span>
                    </div>
                  </div>

                  {/* Zone Selector Buttons */}
                  <div className="grid grid-cols-2 gap-2 border-t border-[#c8b7db]/30 p-4 sm:grid-cols-4">
                    {Object.values(SEATING_ZONES).map((z) => {
                      const isActive = activeZoneKey === z.id;
                      return (
                        <button
                          key={z.id}
                          type="button"
                          onClick={() => setActiveZoneKey(z.id)}
                          className={`flex flex-col rounded-xl p-3 text-left transition-all duration-300 ${
                            isActive
                              ? "border border-[#6264b5] bg-[#6264b5]/10 shadow-sm"
                              : "border border-[#c8b7db]/40 bg-[#f7f4fa] hover:bg-[#eeebf4]"
                          }`}
                        >
                          <div className="flex items-center gap-1.5">
                            <span
                              className="h-2.5 w-2.5 rounded-full"
                              style={{ backgroundColor: z.color }}
                            />
                            <span className="truncate text-xs font-bold text-[#071653]">
                              {z.name.split(" ")[0]}
                            </span>
                          </div>
                          <span
                            className="mt-1 font-mono text-[11px] font-extrabold"
                            style={{ color: z.color }}
                          >
                            {z.price}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </Reveal>

              {/* Right: Zone Inspection Detail */}
              <Reveal delay={140} className="space-y-6 lg:col-span-5">
                <div>

                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[#071653]">
                    Pilih Area, Kenali Suasananya
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#4b5578]">
                    Lihat posisi panggung, area festival, dan tribun sebelum memesan tiket.
                    Pilih kategori untuk mengetahui jarak, sudut pandang, dan fasilitasnya.
                  </p>
                </div>

                {/* Inspected Active Zone Card */}
                <div className="rounded-2xl border border-[#c8b7db]/50 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#c8b7db]/30 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">
                        Area Pilihanmu
                      </span>
                      <h4 className="text-lg font-extrabold text-[#071653]">{activeZone.name}</h4>
                    </div>
                    <span
                      className="font-mono text-base font-extrabold"
                      style={{ color: activeZone.color }}
                    >
                      {activeZone.price}
                    </span>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-3 text-xs">
                    <div className="rounded-xl border border-[#c8b7db]/40 bg-[#f7f4fa] p-2.5">
                      <span className="text-[10px] text-[#5c6482]">Jarak ke panggung</span>
                      <p className="font-semibold text-[#071653]">{activeZone.distance}</p>
                    </div>
                    <div className="rounded-xl border border-[#c8b7db]/40 bg-[#f7f4fa] p-2.5">
                      <span className="text-[10px] text-[#5c6482]">Sudut pandang</span>
                      <p className="font-semibold text-[#071653]">{activeZone.visibility}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-[#4b5578]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c6482]">
                      Keunggulan area:
                    </span>
                    {activeZone.features.map((feat, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Check className="h-3.5 w-3.5 shrink-0 text-[#6264b5]" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <Link
                    href="/events"
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#6264b5] to-[#7577cf] px-6 py-3.5 text-xs font-bold text-[#fffdf2] shadow-lg shadow-[#6264b5]/25 hover:brightness-110"
                  >
                    Pilih Tiket Area Ini
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ==================== TESTIMONIALS ==================== */}
        <section className="relative mx-auto w-full max-w-7xl px-5 py-24 sm:px-8">
          <Reveal className="mb-14 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#6264b5]">
                Testimoni Pengguna
              </p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-[#071653] sm:text-4xl">
                Cerita dari Garis Depan Panggung
              </h2>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#5c6482]">
              <span className="font-mono text-xl font-black text-[#6264b5]">4.9/5</span>
              <span>dari 240.000+ ulasan terverifikasi</span>
            </div>
          </Reveal>

          <Stagger className="grid gap-6 md:grid-cols-3" step={80}>
            {TESTIMONIALS.map((item) => (
              <div
                key={item.name}
                className="group relative flex flex-col justify-between rounded-3xl border border-[#c8b7db]/50 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#6264b5] hover:shadow-[0_20px_50px_-15px_rgba(7,22,83,0.12)]"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1 text-[#6264b5]">
                      {Array.from({ length: item.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-[#6264b5]" />
                      ))}
                    </div>
                    <span className="rounded-full border border-[#c8b7db] bg-[#c8b7db]/20 px-2.5 py-0.5 text-[9px] font-bold text-[#071653]">
                      {item.tag}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed text-[#4b5578]">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-[#c8b7db]/30 pt-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#6264b5] to-[#7577cf] font-bold text-[#fffdf2]">
                    {item.avatar}
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-[#071653]">{item.name}</h5>
                    <p className="text-[11px] text-[#5c6482]">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </Stagger>
        </section>

        {/* ==================== RADAR DROP / VIP NEWSLETTER ==================== */}
        <section className="relative mx-auto w-full max-w-7xl px-5 pb-28 sm:px-8">
          <Reveal>
            <div className="relative overflow-hidden rounded-3xl border border-[#c8b7db]/50 bg-white p-8 sm:p-14 shadow-sm">
              <div className="pointer-events-none absolute -right-10 -top-10 h-[250px] w-[250px] rounded-full bg-[#6264b5]/10 blur-[80px]" />
              <div className="pointer-events-none absolute -left-10 -bottom-10 h-[250px] w-[250px] rounded-full bg-[#c8b7db]/20 blur-[80px]" />

              <div className="relative grid items-center gap-8 lg:grid-cols-12">
                <div className="space-y-3 lg:col-span-7">
                  <div className="inline-flex items-center gap-2 text-xs font-bold text-[#6264b5]">
                    <Radio className="h-4 w-4 animate-pulse" />
                    <span>RADAR PRESALE & DROP ALERT</span>
                  </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-[#071653] sm:text-3xl">
                    Jangan Sampai Ketinggalan Tiket Konser
                  </h2>
                  <p className="max-w-md text-sm leading-relaxed text-[#4b5578]">
                    Dapatkan peringatan dini presale tiket, kode promo promotor eksklusif,
                    dan paket akomodasi konser langsung ke email Anda.
                  </p>
                </div>

                <div className="lg:col-span-5">
                  <form
                    className="flex flex-col gap-3 sm:flex-row"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="flex flex-1 items-center gap-2.5 rounded-2xl border border-[#c8b7db]/50 bg-[#f7f4fa] px-4 py-3.5 focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/20">
                      <Search className="h-4 w-4 shrink-0 text-[#5c6482]" />
                      <input
                        placeholder="Alamat email Anda..."
                        type="email"
                        className="w-full bg-transparent text-sm text-[#071653] outline-none placeholder:text-[#5c6482]/50"
                      />
                    </div>
                    <button
                      type="submit"
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#6264b5] to-[#7577cf] px-7 py-3.5 text-sm font-bold text-[#fffdf2] shadow-lg shadow-[#6264b5]/25 transition-all hover:brightness-110 hover:-translate-y-0.5"
                    >
                      Langganan
                    </button>
                  </form>
                  <p className="mt-3 text-[11px] text-[#5c6482]">
                    Bebas spam. Berhenti berlangganan kapan saja dengan 1 klik.
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
