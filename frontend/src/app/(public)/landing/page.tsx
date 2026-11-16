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
    name: "Royal VVIP Lounge",
    price: "Rp 3.850.000",
    distance: "12m dari Stage",
    visibility: "360° Panoramic Elevated Sightline",
    color: "#6264b5",
    features: [
      "Sofa eksklusif dengan pendingin ruangan privat",
      "Akses jalur karpet merah tanpa antrean sama sekali",
      "Soundcheck exclusive pass & Meet with Artist slot",
      "Free-flow premium hospitality & limited metal card pass",
    ],
  },
  diamond: {
    id: "diamond",
    name: "Diamond Cyber Pit",
    price: "Rp 2.250.000",
    distance: "3m dari Barikade Panggung",
    visibility: "Front-Row Direct Immersion",
    color: "#071653",
    features: [
      "Posisi terdekat tepat di depan stage catwalk",
      "Sensasi audio & efek laser panggung paling maksimal",
      "Gate masuk express 60 menit lebih awal",
      "Exclusive official tour laminate & lanyard",
    ],
  },
  platinum: {
    id: "platinum",
    name: "Platinum Tribune Elevated",
    price: "Rp 1.450.000",
    distance: "30m dari Stage",
    visibility: "Elevated Tier Acoustic Center",
    color: "#6264b5",
    features: [
      "Kursi bernomor ergonomis dengan sandaran tangan",
      "Sudut elevasi tinggi tanpa terhalang barisan depan",
      "Akustik tata suara surround paling seimbang",
      "Akses toilet & F&B dedicated lounge khusus tribune",
    ],
  },
  festival: {
    id: "festival",
    name: "General Festival Ground",
    price: "Rp 850.000",
    distance: "20m dari Stage",
    visibility: "Mass Euphoria Arena",
    color: "#8486d4",
    features: [
      "Lautan penonton dengan atmosfer euforia terbaik",
      "Kebebasan bergerak di seluruh area festival luas",
      "Akses merchandise booth & visual screens raksasa",
      "Wristband hologram bercahaya saat konser dimulai",
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
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-[#c8b7db]/50 bg-[#ffffff] shadow-sm transition-all duration-500 hover:-translate-y-1.5 hover:border-[#6264b5] hover:shadow-[0_20px_50px_-15px_rgba(7,22,83,0.12)]"
      >
        {/* Subtle top edge metallic glow */}
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#6264b5] via-[#c8b7db] to-[#6264b5] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Media Container */}
        <div className="relative h-56 w-full overflow-hidden bg-[#eeebf4]">
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
              <Ticket className="h-12 w-12 text-[#c8b7db]" />
            </div>
          )}

          {/* Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Badges */}
          <div className="absolute left-3.5 top-3.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6264b5] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#fffdf2] shadow-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-[#fffdf2] animate-pulse" />
              Presale
            </span>
            {event.genre && (
              <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#071653] backdrop-blur-md shadow-sm">
                {event.genre}
              </span>
            )}
          </div>

          <div className="absolute right-3.5 top-3.5">
            <span className="rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-[#071653] backdrop-blur-md shadow-sm">
              Sisa {event.total_remaining ?? 0} Tiket
            </span>
          </div>

          {/* Bottom Floating Info Pill */}
          <div className="absolute inset-x-3.5 bottom-3 flex items-center justify-between text-[11px]">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-white/90 px-2.5 py-1 font-semibold text-[#071653] backdrop-blur-md shadow-sm">
              <CalendarDays className="h-3 w-3 text-[#6264b5]" />
              {formatEventDate(event.event_date, {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
            <span className="rounded-lg bg-white/90 px-2.5 py-1 font-semibold text-[#071653] backdrop-blur-md shadow-sm">
              {event.location}
            </span>
          </div>
        </div>

        {/* Realistic Ticket Perforation Notch */}
        <div className="relative z-10 -my-2 flex items-center justify-between px-3">
          <span className="h-4 w-4 rounded-full bg-[#fffdf2] ring-1 ring-[#c8b7db]/60" />
          <span className="h-0 flex-1 border-t-2 border-dashed border-[#c8b7db]/60" />
          <span className="h-4 w-4 rounded-full bg-[#fffdf2] ring-1 ring-[#c8b7db]/60" />
        </div>

        {/* Content Body */}
        <div className="flex flex-1 flex-col p-5 pt-3">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.18em] text-[#6264b5]">
            {event.artist_names?.join(", ") || "Live Concert Experience"}
          </p>
          <h3 className="mt-1 line-clamp-1 text-lg font-extrabold text-[#071653] transition-colors duration-300 group-hover:text-[#6264b5]">
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
                  className="rounded-md border border-[#c8b7db]/50 bg-[#f7f4fa] px-2 py-0.5 text-[10px] font-medium text-[#071653]"
                >
                  {cat.category_name}
                </span>
              ))}
            </div>
          )}

          {/* Footer Card Pricing & Action */}
          <div className="mt-auto flex items-center justify-between border-t border-[#c8b7db]/30 pt-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider text-[#5c6482]">
                Mulai Dari
              </span>
              <p className="font-mono text-base font-extrabold text-[#6264b5]">
                {formatCurrency(minPrice)}
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-xl bg-[#6264b5] px-3.5 py-2 text-xs font-bold text-[#fffdf2] shadow-md shadow-[#6264b5]/25 transition-all duration-300 group-hover:bg-[#51539f] group-hover:translate-x-0.5">
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
              className="object-cover object-center"
            />
            {/* Cinematic Gradient Overlays for contrast, readability, and seamless transition */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#070914]/85 via-[#071653]/65 to-[#fffdf2]" />
            <div className="absolute inset-0 bg-[#070914]/30 backdrop-blur-[0.5px]" />

            {/* Subtle Cyber Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* Glowing Auroras in Lilac & Royal Iris */}
            <div className="absolute -top-32 left-1/2 h-[550px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-b from-[#6264b5]/25 via-[#c8b7db]/15 to-transparent blur-[140px]" />

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
              <div className="mt-12 mx-auto max-w-5xl">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const el = document.getElementById("upcoming-concerts");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="group relative flex flex-col lg:flex-row lg:items-center rounded-2xl lg:rounded-full border border-[#c8b7db]/40 bg-white/95 p-1.5 shadow-[0_16px_40px_-12px_rgba(7,22,83,0.1),0_0_0_1px_rgba(255,255,255,0.8)] backdrop-blur-xl transition-all duration-300 hover:border-[#6264b5]/40 hover:shadow-[0_20px_50px_-12px_rgba(98,100,181,0.15)]"
                >
                  {/* Search Query Field */}
                  <div className="relative flex flex-1 items-center gap-3 rounded-xl lg:rounded-full px-4 py-2.5 transition-colors hover:bg-[#f7f4fa]/70 focus-within:bg-[#f7f4fa]/90">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6264b5]/10 text-[#6264b5]">
                      <Search className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[#6264b5]">
                        Cari Musisi / Jadwal Konser
                      </span>
                      <input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Coldplay, Sheila On 7, NIKI..."
                        className="w-full bg-transparent text-sm font-semibold text-[#071653] outline-none placeholder:text-[#5c6482]/45"
                      />
                    </div>
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="rounded-full p-1 text-[#5c6482] transition-colors hover:bg-[#c8b7db]/30 hover:text-[#071653]"
                        title="Hapus pencarian"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden lg:block h-7 w-px bg-[#c8b7db]/40 shrink-0" />

                  {/* City Selector Field */}
                  <div className="relative flex items-center gap-3 rounded-xl lg:rounded-full px-4 py-2.5 transition-colors hover:bg-[#f7f4fa]/70 focus-within:bg-[#f7f4fa]/90 lg:w-[26%]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6264b5]/10 text-[#6264b5]">
                      <MapPin className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[#5c6482]">
                        Kota Venue
                      </span>
                      <div className="relative flex items-center">
                        <select
                          value={selectedCity}
                          onChange={(e) => setSelectedCity(e.target.value)}
                          className="w-full appearance-none bg-transparent pr-5 text-sm font-semibold text-[#071653] outline-none cursor-pointer"
                        >
                          {CITIES.map((city) => (
                            <option key={city} value={city} className="bg-white text-[#071653]">
                              {city}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-[#5c6482]" />
                      </div>
                    </div>
                  </div>

                  {/* Vertical Divider */}
                  <div className="hidden lg:block h-7 w-px bg-[#c8b7db]/40 shrink-0" />

                  {/* Genre Selector Field */}
                  <div className="relative flex items-center gap-3 rounded-xl lg:rounded-full px-4 py-2.5 transition-colors hover:bg-[#f7f4fa]/70 focus-within:bg-[#f7f4fa]/90 lg:w-[24%]">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#6264b5]/10 text-[#6264b5]">
                      <Music className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="block text-[9px] font-bold uppercase tracking-[0.14em] text-[#5c6482]">
                        Kategori Genre
                      </span>
                      <div className="relative flex items-center">
                        <select
                          value={selectedGenre}
                          onChange={(e) => setSelectedGenre(e.target.value)}
                          className="w-full appearance-none bg-transparent pr-5 text-sm font-semibold text-[#071653] outline-none cursor-pointer"
                        >
                          {GENRES.map((g) => (
                            <option key={g.id} value={g.id} className="bg-white text-[#071653]">
                              {g.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-0 h-3.5 w-3.5 text-[#5c6482]" />
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-1 lg:p-0 lg:pl-1">
                    <a
                      href="#upcoming-concerts"
                      className="inline-flex h-11 lg:h-12 w-full lg:w-auto items-center justify-center gap-2 rounded-xl lg:rounded-full bg-gradient-to-r from-[#6264b5] via-[#7577cf] to-[#6264b5] px-6 text-sm font-bold text-[#fffdf2] shadow-[0_6px_20px_rgba(98,100,181,0.35)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_10px_26px_rgba(98,100,181,0.5)] hover:-translate-y-0.5 active:scale-[0.98] shrink-0"
                    >
                      <Search className="h-4 w-4" />
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
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-96 animate-pulse rounded-2xl border border-[#c8b7db]/40 bg-white"
                />
              ))}
            </div>
          ) : filteredEvents.length > 0 ? (
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" step={50}>
              {filteredEvents.map((event: Event, i: number) => (
                <LuxuryTicketCard key={event.id} event={event} index={i} />
              ))}
            </Stagger>
          ) : (
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
          )}
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
                        3D VENUE SIMULATOR • GBK STADIUM
                      </span>
                      <h4 className="mt-0.5 text-base font-extrabold text-[#071653]">
                        Holographic Seat View Radar
                      </h4>
                    </div>

                    <div className="flex items-center gap-2 rounded-full border border-[#6264b5]/30 bg-[#6264b5]/10 px-3 py-1 text-[#6264b5]">
                      <span className="h-2 w-2 rounded-full bg-[#6264b5] animate-pulse" />
                      <span className="text-[10px] font-mono font-bold uppercase">Active Sensor</span>
                    </div>
                  </div>

                  {/* 3D Scene Viewport */}
                  <div className="relative flex aspect-[16/10] w-full items-center justify-center overflow-hidden bg-gradient-to-b from-[#eeebf4] to-[#e4dfed] p-6">
                    <div
                      className="relative h-[280px] w-full max-w-[500px]"
                      style={{ perspective: "1200px" }}
                    >
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          transformStyle: "preserve-3d",
                          animation: "stage-float 8s ease-in-out infinite",
                        }}
                      >
                        {/* 3D Main Stage Structure */}
                        <div
                          className="relative"
                          style={{
                            transformStyle: "preserve-3d",
                            transform: "rotateX(55deg) rotateZ(-45deg)",
                            animation: "stage-rotate 35s linear infinite",
                          }}
                        >
                          {/* Main Platform Floor */}
                          <div
                            className="absolute h-[180px] w-[180px] rounded-2xl border-2 border-[#6264b5]"
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(98,100,181,0.3) 0%, rgba(200,183,219,0.3) 100%)",
                              transform: "translateZ(0px)",
                              boxShadow:
                                "0 0 60px rgba(98,100,181,0.25), inset 0 0 50px rgba(255,255,255,0.4)",
                            }}
                          />

                          {/* Center Spotlight */}
                          <div
                            className="absolute h-[60px] w-[60px] rounded-full"
                            style={{
                              background:
                                "radial-gradient(circle, rgba(98,100,181,0.8) 0%, rgba(200,183,219,0.4) 60%, transparent 80%)",
                              transform: "translateZ(60px) translateX(60px) translateY(60px)",
                              animation: "pulse-glow 2.5s ease-in-out infinite",
                            }}
                          />

                          {/* Stage Truss Ring */}
                          <div
                            className="absolute h-[140px] w-[140px] rounded-full border border-[#6264b5]/40"
                            style={{
                              transform: "translateZ(40px) translateX(20px) translateY(20px)",
                              animation: "ripple 3.5s ease-out infinite",
                            }}
                          />

                          {/* Diamond Pit Zone */}
                          <div
                            className={`absolute h-[100px] w-[260px] rounded-xl border-2 transition-all duration-500 ${
                              activeZoneKey === "diamond"
                                ? "border-[#071653] bg-[#071653]/30 shadow-[0_0_30px_rgba(7,22,83,0.3)]"
                                : "border-[#6264b5]/40 bg-[#6264b5]/15"
                            }`}
                            style={{
                              transform: "translateZ(-15px) translateX(-40px) translateY(180px)",
                            }}
                          />

                          {/* Festival Floor */}
                          <div
                            className={`absolute h-[90px] w-[320px] rounded-xl border-2 transition-all duration-500 ${
                              activeZoneKey === "festival"
                                ? "border-[#6264b5] bg-[#6264b5]/25 shadow-[0_0_30px_rgba(98,100,181,0.25)]"
                                : "border-[#6264b5]/30 bg-[#6264b5]/10"
                            }`}
                            style={{
                              transform: "translateZ(-25px) translateX(-70px) translateY(280px)",
                            }}
                          />

                          {/* Royal VVIP Boxes */}
                          <div
                            className={`absolute h-[60px] w-[60px] rounded-xl border-2 transition-all duration-500 ${
                              activeZoneKey === "vvip"
                                ? "border-[#6264b5] bg-[#6264b5]/40 shadow-[0_0_30px_rgba(98,100,181,0.35)]"
                                : "border-[#c8b7db] bg-[#c8b7db]/30"
                            }`}
                            style={{
                              transform: "translateZ(20px) translateX(-90px) translateY(100px)",
                            }}
                          />
                          <div
                            className={`absolute h-[60px] w-[60px] rounded-xl border-2 transition-all duration-500 ${
                              activeZoneKey === "vvip"
                                ? "border-[#6264b5] bg-[#6264b5]/40 shadow-[0_0_30px_rgba(98,100,181,0.35)]"
                                : "border-[#c8b7db] bg-[#c8b7db]/30"
                            }`}
                            style={{
                              transform: "translateZ(20px) translateX(210px) translateY(100px)",
                            }}
                          />

                          {/* Platinum Tribune Wings */}
                          <div
                            className={`absolute h-[80px] w-[80px] rounded-xl border-2 transition-all duration-500 ${
                              activeZoneKey === "platinum"
                                ? "border-[#6264b5] bg-[#6264b5]/35 shadow-[0_0_30px_rgba(98,100,181,0.3)]"
                                : "border-[#c8b7db] bg-[#c8b7db]/20"
                            }`}
                            style={{
                              transform: "translateZ(10px) translateX(-180px) translateY(200px)",
                            }}
                          />
                          <div
                            className={`absolute h-[80px] w-[80px] rounded-xl border-2 transition-all duration-500 ${
                              activeZoneKey === "platinum"
                                ? "border-[#6264b5] bg-[#6264b5]/35 shadow-[0_0_30px_rgba(98,100,181,0.3)]"
                                : "border-[#c8b7db] bg-[#c8b7db]/20"
                            }`}
                            style={{
                              transform: "translateZ(10px) translateX(280px) translateY(200px)",
                            }}
                          />
                        </div>

                        {/* Animated Laser Beams */}
                        <div className="pointer-events-none absolute inset-0 overflow-hidden">
                          <div
                            className="absolute top-0 left-1/4 h-full w-[2px] origin-top bg-gradient-to-b from-[#6264b5] via-[#c8b7db]/60 to-transparent blur-[1px]"
                            style={{
                              animation: "light-beam 3s ease-in-out infinite alternate",
                            }}
                          />
                          <div
                            className="absolute top-0 right-1/4 h-full w-[2px] origin-top bg-gradient-to-b from-[#c8b7db] via-[#6264b5]/50 to-transparent blur-[1px]"
                            style={{
                              animation: "light-beam 3.5s ease-in-out infinite alternate-reverse",
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="absolute bottom-4 inset-x-6 flex items-center justify-between text-[11px] font-mono font-bold text-[#071653]">
                      <span>MAIN STAGE</span>
                      <span>DIAMOND PIT</span>
                      <span>TRIBUNE</span>
                      <span>VVIP BOX</span>
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
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#c8b7db] bg-white px-3.5 py-1 text-xs font-semibold text-[#071653]">
                    <Radio className="h-3 w-3 text-[#6264b5] animate-pulse" />
                    <span>Real-time Perspective Sensor</span>
                  </div>

                  <h3 className="mt-3 text-3xl font-extrabold tracking-tight text-[#071653]">
                    Lihat Panggungmu Sebelum Membeli
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-[#4b5578]">
                    Simulasi 3D transparan menghilangkan kekhawatiran tiang terhalang,
                    kemiringan tribun curam, atau kejutan kursi terlalu jauh dari aksi panggung.
                  </p>
                </div>

                {/* Inspected Active Zone Card */}
                <div className="rounded-2xl border border-[#c8b7db]/50 bg-white p-5 shadow-sm">
                  <div className="flex items-center justify-between border-b border-[#c8b7db]/30 pb-3">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">
                        Kategori Terpilih
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
                      <span className="text-[10px] text-[#5c6482]">Jarak ke Artis</span>
                      <p className="font-semibold text-[#071653]">{activeZone.distance}</p>
                    </div>
                    <div className="rounded-xl border border-[#c8b7db]/40 bg-[#f7f4fa] p-2.5">
                      <span className="text-[10px] text-[#5c6482]">Sudut Pandang</span>
                      <p className="font-semibold text-[#071653]">{activeZone.visibility}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2 text-xs text-[#4b5578]">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c6482]">
                      Privilege & Fasilitas:
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
                    Pesan Tiket Kategori Ini
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            </div>
          </div>
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

          {/* ==================== LIVE TOKEN DEMONSTRATION (CLEAN & ELEGANT) ==================== */}
          <Reveal delay={150} className="mt-12">
            <div className="relative overflow-hidden rounded-3xl border border-[#c8b7db]/60 bg-white p-7 sm:p-12 shadow-[0_20px_60px_-15px_rgba(7,22,83,0.06)]">
              {/* Subtle ambient silk glow */}
              <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#6264b5]/05 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[#c8b7db]/15 blur-3xl" />
              </div>

              <div className="relative grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
                {/* Left Column: Clean Copy, Architecture & Interactive Buttons */}
                <div className="space-y-6 lg:col-span-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-[#c8b7db]/60 bg-[#f7f4fa] px-3.5 py-1.5 text-xs font-bold text-[#6264b5]">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>LIVE TOKEN DEMONSTRATION</span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl font-extrabold tracking-tight text-[#071653] sm:text-3xl">
                      Dynamic QR Code Anti-Calo & Anti-Screenshot
                    </h3>
                    <p className="text-sm sm:text-base leading-relaxed text-[#5c6482]">
                      Setiap tiket resmi Tixora dilindungi oleh token kriptografi yang diperbarui otomatis setiap 30 detik. Tangkapan layar (<span className="font-semibold text-[#071653]">screenshot</span>), file PDF duplikat, maupun foto layar calo otomatis ditolak oleh scanner gerbang masuk (<span className="italic">turnstile gate</span>).
                    </p>
                  </div>

                  {/* 3 Clean Security Features */}
                  <div className="grid gap-3 sm:grid-cols-3 pt-1">
                    <div className="rounded-2xl border border-[#c8b7db]/40 bg-[#f7f4fa]/70 p-4 transition-colors hover:border-[#6264b5]/40">
                      <div className="flex items-center gap-2 text-[#6264b5]">
                        <RefreshCw className="h-4 w-4" />
                        <span className="text-xs font-bold text-[#071653]">Rotasi 30 Detik</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-[#5c6482]">
                        Token baru dibuat otomatis secara berkala sebelum kedaluwarsa.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#c8b7db]/40 bg-[#f7f4fa]/70 p-4 transition-colors hover:border-[#6264b5]/40">
                      <div className="flex items-center gap-2 text-[#6264b5]">
                        <Lock className="h-4 w-4" />
                        <span className="text-xs font-bold text-[#071653]">Hardware Bound</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-[#5c6482]">
                        Hanya valid dari akun & perangkat resmi pembeli tiket asli.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-[#c8b7db]/40 bg-[#f7f4fa]/70 p-4 transition-colors hover:border-[#6264b5]/40">
                      <div className="flex items-center gap-2 text-[#6264b5]">
                        <Zap className="h-4 w-4" />
                        <span className="text-xs font-bold text-[#071653]">Scan &lt; 0.2 Detik</span>
                      </div>
                      <p className="mt-1.5 text-[11px] leading-relaxed text-[#5c6482]">
                        Pemindaian instan turnstile tanpa hambatan antrean panjang.
                      </p>
                    </div>
                  </div>

                  {/* Interactive Action Controls */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-1">
                    <button
                      type="button"
                      onClick={handleSimulateGateScan}
                      disabled={isGateScanning}
                      className="inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-[#6264b5] via-[#7577cf] to-[#6264b5] px-6 py-3.5 text-xs font-bold text-[#fffdf2] shadow-md shadow-[#6264b5]/25 transition-all hover:scale-[1.02] hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
                    >
                      <QrCode className="h-4 w-4" />
                      <span>{isGateScanning ? "Memverifikasi Sensor Gate..." : "Simulasikan Scan Gate"}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleManualRotateToken}
                      className="inline-flex items-center gap-2 rounded-xl border border-[#c8b7db] bg-white px-4 py-3.5 text-xs font-semibold text-[#071653] transition-all hover:border-[#6264b5] hover:text-[#6264b5] active:scale-95 cursor-pointer"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 text-[#6264b5] ${qrTokenSeconds === 30 ? "animate-spin" : ""}`} />
                      <span>Perbarui Token</span>
                    </button>
                  </div>

                  {/* Simulation Feedback Alert */}
                  {isGateScanning ? (
                    <div className="flex items-center gap-2.5 rounded-2xl border border-[#6264b5]/30 bg-[#6264b5]/10 p-3.5 text-xs text-[#6264b5] animate-pulse">
                      <span className="h-2 w-2 rounded-full bg-[#6264b5] animate-ping" />
                      <span>Sensor turnstile sedang membaca dan memverifikasi token kriptografi...</span>
                    </div>
                  ) : gateScanResult === "success" ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-50 p-3.5 text-xs text-emerald-800">
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
                      <div>
                        <p className="font-bold text-emerald-900">TIKET RESMI VALID • TURNSTILE GATE 04 TERBUKA</p>
                        <p className="text-[11px] text-emerald-700">Token SHA-256 terverifikasi sukses. Akses masuk 1x disetujui.</p>
                      </div>
                    </div>
                  ) : null}
                </div>

                {/* Right Column: Clean & Elegant Phone / Ticket Pass Card */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-full max-w-sm rounded-3xl border border-[#c8b7db]/60 bg-[#fffdf2] p-5 shadow-xl shadow-[#071653]/05 transition-all">
                    {/* Card Header */}
                    <div className="flex items-center justify-between border-b border-[#c8b7db]/40 pb-3.5">
                      <div>
                        <span className="inline-block rounded-full bg-[#6264b5]/15 px-2.5 py-0.5 text-[10px] font-bold text-[#6264b5]">
                          PASS TERVERIFIKASI
                        </span>
                        <h4 className="mt-1 text-sm font-extrabold text-[#071653]">Coldplay: Music of The Spheres</h4>
                        <p className="text-[11px] text-[#5c6482]">VIP Category 1 • Gate 04</p>
                      </div>
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-[#c8b7db]/40 text-[#6264b5] shadow-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                    </div>

                    {/* Clean Frame: Animasi Pemindaian QR Berhasil GIF */}
                    <div className="my-4 overflow-hidden rounded-2xl border border-[#c8b7db]/50 bg-white p-3 shadow-sm">
                      <div className="relative mx-auto aspect-square max-w-[260px] overflow-hidden rounded-xl bg-[#f7f4fa]">
                        <Image
                          src="/animasi-pemindaian-qr-berhasil.gif"
                          alt="Animasi Pemindaian QR Berhasil"
                          width={507}
                          height={508}
                          unoptimized
                          className="h-full w-full object-cover"
                          priority
                        />
                      </div>
                    </div>

                    {/* Bottom Token & Live Countdown Bar */}
                    <div className="flex items-center justify-between gap-3 rounded-2xl border border-[#c8b7db]/40 bg-white p-3.5 shadow-sm">
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">
                          Token Kriptografi
                        </span>
                        <div className="mt-0.5 flex items-center gap-2">
                          <p className="font-mono text-xs font-black tracking-wider text-[#071653] truncate">
                            {tokenHash}
                          </p>
                          <button
                            type="button"
                            onClick={handleCopyToken}
                            aria-label="Salin Token"
                            className="text-[#5c6482] hover:text-[#071653] transition cursor-pointer"
                          >
                            {copiedToken ? (
                              <Check className="h-3.5 w-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Circular Animated SVG Gauge */}
                      <div className="relative flex h-11 w-11 shrink-0 items-center justify-center">
                        <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                          <path
                            className="text-[#c8b7db]/30"
                            strokeWidth="3"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                          <path
                            className="text-[#6264b5] transition-all duration-1000 ease-linear"
                            strokeDasharray={`${(qrTokenSeconds / 30) * 100}, 100`}
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="none"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                          />
                        </svg>
                        <span className="absolute font-mono text-[10px] font-black text-[#071653]">
                          {qrTokenSeconds}s
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
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
