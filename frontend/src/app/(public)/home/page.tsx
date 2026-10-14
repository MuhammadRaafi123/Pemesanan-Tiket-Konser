"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Compass,
  CreditCard,
  Disc3,
  Heart,
  MapPin,
  Mic2,
  Music2,
  RefreshCw,
  Sparkles,
  Ticket,
  UserRound,
  WalletCards,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CountUp } from "@/components/shared/CountUp";
import { Reveal, Stagger } from "@/components/shared/Reveal";
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

// Tanggal tetap (bukan Date.now/new Date) supaya render server dan client
// konsisten dan tidak memicu hydration mismatch.
const EMPTY_EVENT_DATE = "2026-01-01T00:00:00+07:00";

const EMPTY_NEXT_EVENT: Event = {
  id: "",
  title: "Belum ada konser terjadwal",
  description: "Konser berikutnya akan tampil di sini.",
  location: "Indonesia",
  event_date: EMPTY_EVENT_DATE,
  status: "open",
};

const STATUS_META: Record<Order["status"], { label: string; className: string }> = {
  paid: { label: "Lunas", className: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300" },
  pending: { label: "Menunggu bayar", className: "border-amber-400/20 bg-amber-400/10 text-amber-300" },
  rejected: { label: "Ditolak", className: "border-rose-400/20 bg-rose-400/10 text-rose-300" },
  cancelled: { label: "Dibatalkan", className: "border-[#2a2d36] bg-[#1e2128] text-[#8a8d98]" },
};

function StatusPill({ status }: { status: Order["status"] }) {
  const meta = STATUS_META[status];
  return (
    <span className={`rounded-full border px-2.5 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.12em] ${meta.className}`}>
      {meta.label}
    </span>
  );
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [eventFilter, setEventFilter] = useState("all");
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);
  const [eventLoadError, setEventLoadError] = useState(false);
  const [artistLoadError, setArtistLoadError] = useState(false);
  const [accountLoadError, setAccountLoadError] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    let active = true;

    Promise.allSettled([
      fetchEvents({ limit: 12 }),
      fetchPopularArtists(8),
      user
        ? Promise.all([fetchProfile(), fetchMyOrders()])
        : Promise.resolve([null, []] as [null, Order[]]),
    ])
      .then(([eventResult, artistResult, accountResult]) => {
        if (!active) return;
        if (eventResult.status === "fulfilled") {
          setEvents(eventResult.value);
          setEventLoadError(false);
        } else {
          console.error("Failed to load home events", eventResult.reason);
          setEventLoadError(true);
        }
        setCurrentTime(Date.now());

        if (artistResult.status === "fulfilled") {
          setArtists(artistResult.value);
          setArtistLoadError(false);
        } else {
          console.error("Failed to load popular artists", artistResult.reason);
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
  const upcomingEvents = events
    .filter(
      (event) =>
        event.status === "open" &&
        (currentTime === null || new Date(event.event_date).getTime() >= currentTime),
    )
    .sort((first, second) => new Date(first.event_date).getTime() - new Date(second.event_date).getTime());
  const nextEvent: Event = upcomingEvents[0] || events.find((event) => event.status === "open") || events[0] || EMPTY_NEXT_EVENT;
  const eventGenres = Array.from(
    new Set(
      events.flatMap((event) =>
        [event.genre, event.artists?.genre, ...(event.artists_list?.map((artist) => artist.genre) || [])]
          .filter((genre): genre is string => Boolean(genre)),
      ),
    ),
  ).slice(0, 5);
  const filteredEvents = events.filter((event) => {
    if (eventFilter === "featured") return Boolean(event.featured);
    if (eventFilter === "all") return true;
    const genres = [
      event.genre,
      event.artists?.genre,
      ...(event.artists_list?.map((artist) => artist.genre) || []),
    ];
    return genres.some((genre) => genre?.toLowerCase() === eventFilter.toLowerCase());
  });
  const paidOrders = orders.filter((order) => order.status === "paid").length;
  const pendingOrders = orders.filter((order) => order.status === "pending");
  const upcomingOrders = orders
    .filter(
      (order) =>
        order.status === "paid" &&
        order.events?.event_date &&
        (currentTime === null || new Date(order.events.event_date).getTime() >= currentTime),
    )
    .sort(
      (first, second) =>
        new Date(first.events?.event_date || "").getTime() -
        new Date(second.events?.event_date || "").getTime(),
    );
  const ticketCount = profile?.tickets_count ?? paidOrders;
  const orderCount = profile?.orders_count ?? orders.length;
  const paidTotal = orders
    .filter((order) => order.status === "paid")
    .reduce((total, order) => total + order.total, 0);
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
        <main className="flex min-h-[70vh] flex-col items-center justify-center px-4 pt-28 text-center">
          <div className="relative mb-5 flex h-14 w-14 items-center justify-center">
            <span className="absolute inset-0 rounded-full border border-[#ffb703]/20" />
            <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-[#ffb703]" />
            <Disc3 className="h-6 w-6 text-[#ffb703]" />
          </div>
          <p className="text-sm font-medium text-[#e1e2ec]">Menyiapkan ruang konsermu</p>
          <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#7a7d88]">Concertix</p>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const stats = user
    ? [
        { label: "Tiket digital", value: ticketCount, icon: Ticket, href: "/tickets" },
        { label: "Total pesanan", value: orderCount, icon: WalletCards, href: "/orders" },
        { label: "Menunggu pembayaran", value: pendingOrders.length, icon: Clock3, href: "/orders" },
      ]
    : [
        { label: "Konser tersedia", value: upcomingEvents.length, icon: Ticket, href: "/events" },
        { label: "Artis pilihan", value: artists.length, icon: Mic2, href: "/artists" },
        {
          label: "Lokasi konser",
          value: new Set(upcomingEvents.map((event) => event.location).filter(Boolean)).size,
          icon: MapPin,
          href: "/events",
        },
      ];

  return (
    <div className="min-h-screen bg-[#0b0e15] text-[#e1e2ec]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <Reveal>
          <section className="relative overflow-hidden rounded-3xl border border-[#232733] bg-[#191b23] p-6 shadow-2xl shadow-black/30 sm:p-10 lg:p-14">
            <div aria-hidden className="pointer-events-none absolute -right-20 -top-24 h-[360px] w-[360px] rounded-full bg-[#ffb703]/[0.1] blur-[100px]" />
            <div aria-hidden className="pointer-events-none absolute -bottom-40 left-1/3 h-[300px] w-[480px] rounded-full bg-[#6801d1]/[0.08] blur-[100px]" />
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,183,3,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.02)_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_15%,transparent_75%)]" />

            <div className="relative grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/25 bg-[#ffb703]/[0.08] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
                  <Sparkles className="h-3.5 w-3.5" />
                  {user ? "Ruang konsermu" : "Temukan live experience"}
                </p>
                <h1 className="mt-5 max-w-2xl text-[clamp(2.2rem,5vw,4rem)] font-extrabold leading-[1.04] tracking-tight text-[#e1e2ec]">
                  {user ? "Selamat datang," : "Malam terbaik"}
                  <br />
                  <span className="bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703] bg-clip-text text-transparent">
                    {user ? `${displayName.split(" ")[0]}.` : "dimulai di sini."}
                  </span>
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-[#8a8d98] sm:text-base">
                  {user
                    ? "Semua momen konsermu ada di satu tempat. Temukan inspirasi berikutnya, cek pesanan, dan bersiap untuk malam yang layak dikenang."
                    : "Jelajahi konser, temukan musisi favorit, dan siapkan dirimu untuk pengalaman live yang tak terlupakan."}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/events"
                    className="press inline-flex h-11 items-center gap-2 rounded-xl bg-[#ffb703] px-5 text-xs font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:-translate-y-0.5 hover:bg-[#ffdea9]"
                  >
                    {user ? "Cari konser berikutnya" : "Jelajahi konser"}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                  {user ? (
                    <Link
                      href="/orders"
                      className="press inline-flex h-11 items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#1e2128] px-5 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                    >
                      Lihat pesanan <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/register"
                      className="press inline-flex h-11 items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#1e2128] px-5 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                    >
                      Buat akun gratis <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>

              <Link
                href={nextEvent.id ? `/events/${nextEvent.id}` : "/events"}
                className="group relative isolate flex min-h-[420px] flex-col justify-between overflow-hidden rounded-2xl border border-[#2a2d36] bg-[#10131a] shadow-2xl shadow-black/40 transition duration-500 hover:border-[#ffb703]/45 hover:shadow-[#ffb703]/10 sm:min-h-[460px]"
              >
                {nextEvent.poster ? (
                  <Image
                    src={resolveMediaUrl(nextEvent.poster)}
                    alt=""
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="absolute inset-0 -z-20 object-cover opacity-45 transition duration-700 group-hover:scale-105 group-hover:opacity-55"
                  />
                ) : null}
                <div aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_65%,rgba(255,183,3,.2),transparent_42%),linear-gradient(180deg,rgba(11,14,21,.2),#0b0e15_88%)]" />
                <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,183,3,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,183,3,0.025)_1px,transparent_1px)] bg-[size:32px_32px]" />

                <div className="absolute inset-x-0 top-0 h-[58%] overflow-hidden" aria-hidden>
                  <div
                    className="absolute left-[17%] top-0 h-[80%] w-8 origin-top opacity-70 blur-[3px]"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,183,3,.7), rgba(255,183,3,.08) 65%, transparent)",
                      clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)",
                      animation: "light-beam 3.8s ease-in-out infinite alternate",
                    }}
                  />
                  <div
                    className="absolute right-[17%] top-0 h-[80%] w-8 origin-top opacity-70 blur-[3px]"
                    style={{
                      background: "linear-gradient(180deg, rgba(213,186,255,.75), rgba(104,1,209,.14) 65%, transparent)",
                      clipPath: "polygon(35% 0, 65% 0, 100% 100%, 0 100%)",
                      animation: "light-beam 4.2s ease-in-out infinite alternate-reverse",
                    }}
                  />
                  <div
                    className="absolute left-1/2 top-0 h-[88%] w-5 -translate-x-1/2 opacity-60 blur-[2px]"
                    style={{
                      background: "linear-gradient(180deg, rgba(255,222,169,.8), rgba(255,183,3,.1) 75%, transparent)",
                      clipPath: "polygon(40% 0, 60% 0, 100% 100%, 0 100%)",
                      animation: "light-beam 3.2s ease-in-out infinite alternate",
                    }}
                  />
                  <div className="absolute inset-x-[12%] top-7 h-2 rounded-full border border-[#ffdea9]/35 bg-[#191b23]/80 shadow-[0_0_24px_rgba(255,183,3,.35)]" />
                  <div className="absolute inset-x-[15%] top-10 flex justify-between">
                    {[0, 1, 2, 3, 4, 5, 6].map((light) => (
                      <span
                        key={light}
                        className={`h-2 w-2 rounded-full ${
                          light % 2 === 0 ? "bg-[#ffb703]" : "bg-[#d5baff]"
                        } shadow-[0_0_12px_currentColor]`}
                      />
                    ))}
                  </div>

                  <div className="absolute left-1/2 top-[32%] w-[68%] -translate-x-1/2 text-center">
                    <div className="mx-auto inline-flex max-w-full flex-col items-center rounded-xl border border-white/10 bg-[#0b0e15]/50 px-5 py-3 shadow-[0_0_50px_rgba(255,183,3,.12)] backdrop-blur-sm">
                      <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-[#ffb703]">
                        {nextEvent.artist_names?.[0] || nextEvent.artists?.name || "TONIGHT"}
                      </span>
                      <span className="mt-1 line-clamp-2 text-base font-black uppercase leading-tight tracking-wide text-white drop-shadow-[0_2px_12px_rgba(255,183,3,.5)] sm:text-lg">
                        {nextEvent.id ? nextEvent.title : "LIVE MUSIC"}
                      </span>
                    </div>
                  </div>

                  <div className="absolute bottom-[13%] left-1/2 h-16 w-[62%] -translate-x-1/2 [perspective:300px]">
                    <div className="absolute inset-x-0 top-0 h-9 border border-[#ffb703]/60 bg-gradient-to-b from-[#ffb703]/30 via-[#6801d1]/20 to-[#10131a] shadow-[0_0_40px_rgba(255,183,3,.25)] [transform:rotateX(-18deg)]" />
                    <div className="absolute left-1/2 top-1 h-6 w-6 -translate-x-1/2 rounded-full bg-[#ffdea9] shadow-[0_0_12px_5px_rgba(255,183,3,.55)]" />
                    <div className="absolute inset-x-0 top-10 h-px bg-gradient-to-r from-transparent via-[#ffb703]/70 to-transparent" />
                  </div>

                  <div className="absolute inset-x-0 bottom-0 flex h-[24%] items-end justify-center gap-[3px] overflow-hidden">
                    {Array.from({ length: 25 }, (_, person) => (
                      <span
                        key={person}
                        className="relative w-[4.5%] shrink-0 rounded-t-full bg-[#080a10] shadow-[0_-6px_18px_rgba(213,186,255,.08)]"
                        style={{
                          height: `${28 + ((person * 17) % 53)}%`,
                          animation: `stage-float ${3.4 + (person % 5) * 0.35}s ease-in-out infinite`,
                          animationDelay: `${(person % 7) * -0.4}s`,
                        }}
                      >
                        <span className="absolute -top-1 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#0a0c12]" />
                      </span>
                    ))}
                  </div>
                  <div className="absolute inset-x-0 bottom-0 h-[28%] bg-gradient-to-t from-[#0b0e15] via-[#0b0e15]/60 to-transparent" />
                </div>

                <div className="relative z-10 flex items-center justify-between p-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-rose-300/25 bg-[#171019]/75 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-rose-200 backdrop-blur">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                    Live experience
                  </span>
                  <span className="rounded-full border border-white/10 bg-[#0b0e15]/50 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#c4c5cc] backdrop-blur">
                    {nextEvent.featured ? "Pilihan minggu ini" : "Upcoming show"}
                  </span>
                </div>

                <div className="relative z-10 mt-auto px-5 pb-5 sm:px-6 sm:pb-6">
                  <div className="mb-4 flex h-8 items-end gap-1 opacity-80" aria-hidden>
                    {[12, 20, 10, 27, 16, 30, 13, 23, 11, 18, 28, 14, 24, 10, 19].map((height, bar) => (
                      <span
                        key={bar}
                        className="w-1 rounded-t-full bg-gradient-to-t from-[#6801d1] to-[#ffb703]"
                        style={{
                          height: `${height}px`,
                          animation: `soundwave 1.1s ease-in-out ${bar * 0.08}s infinite`,
                        }}
                      />
                    ))}
                    <span className="ml-2 text-[9px] font-semibold uppercase tracking-[0.2em] text-[#8a8d98]">
                      Feel the moment
                    </span>
                  </div>
                  <div className="flex items-end justify-between gap-3 border-t border-white/10 pt-4">
                    <div className="min-w-0">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">
                        {nextEvent.id ? "Panggung berikutnya" : "Temukan konser"}
                      </p>
                      <h2 className="mt-1 line-clamp-2 text-lg font-bold leading-tight text-white transition group-hover:text-[#ffdea9] sm:text-xl">
                        {nextEvent.title}
                      </h2>
                      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#b2b4bd]">
                        {nextEvent.id ? (
                          <span className="inline-flex items-center gap-1.5">
                            <CalendarDays className="h-3 w-3 text-[#ffb703]" />
                            {formatEventDate(nextEvent.event_date)}
                          </span>
                        ) : null}
                        <span className="inline-flex min-w-0 items-center gap-1.5">
                          <MapPin className="h-3 w-3 shrink-0 text-[#ffb703]" />
                          <span className="truncate">{nextEvent.venue || nextEvent.location}</span>
                        </span>
                      </div>
                    </div>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffb703] text-[#10131a] shadow-lg shadow-[#ffb703]/25 transition duration-300 group-hover:scale-110 group-hover:bg-[#ffdea9]">
                      <ArrowUpRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </div>
          </section>
        </Reveal>

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={80}>
          {stats.map(({ label, value, icon: Icon, href }) => (
            <Link key={label} href={href} className="group rounded-2xl border border-[#232733] bg-[#191b23] p-6 transition hover:-translate-y-1 hover:border-[#ffb703]/25 hover:shadow-xl hover:shadow-black/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8a8d98]">{label}</span>
                <Icon className="h-4 w-4 text-[#ffb703]" />
              </div>
              <p className="numeral mt-5 text-3xl text-[#e1e2ec]">
                <CountUp value={value} />
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7a7d88] transition group-hover:text-[#ffb703]">
                Buka <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          ))}

          {user ? (
            <Link href="/events" className="group rounded-2xl border border-[#232733] bg-[#191b23] p-6 transition hover:-translate-y-1 hover:border-[#ffb703]/25 hover:shadow-xl hover:shadow-black/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8a8d98]">Genre pilihanmu</span>
                <Heart className="h-4 w-4 text-[#ffb703]" />
              </div>
              <p className="mt-5 truncate text-xl font-semibold text-[#e1e2ec]">
                {profile?.favorite_genre || "Your next pick"}
              </p>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7a7d88] transition group-hover:text-[#ffb703]">
                Jelajahi <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          ) : (
            <Link href="/artists" className="group rounded-2xl border border-[#232733] bg-[#191b23] p-6 transition hover:-translate-y-1 hover:border-[#ffb703]/25 hover:shadow-xl hover:shadow-black/20">
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#8a8d98]">Temukan musisi</span>
                <Compass className="h-4 w-4 text-[#ffb703]" />
              </div>
              <p className="mt-5 truncate text-xl font-semibold text-[#e1e2ec]">Artis &amp; band pilihan</p>
              <span className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7a7d88] transition group-hover:text-[#ffb703]">
                Jelajahi artis <ArrowUpRight className="h-3 w-3" />
              </span>
            </Link>
          )}
        </Stagger>

        {user ? (
          <section className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            <Reveal className="rounded-2xl border border-[#232733] bg-[#191b23] p-6 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
                    Ringkasan aktivitas
                  </p>
                  <h2 className="mt-2 text-xl font-bold text-[#e1e2ec]">Akun konsermu</h2>
                </div>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
                >
                  Riwayat pesanan <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <div className="rounded-xl border border-[#2a2d36] bg-[#10131a] p-4">
                  <div className="flex items-center gap-2 text-[#8a8d98]">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span className="text-[10px] uppercase tracking-wider">Lunas</span>
                  </div>
                  <p className="numeral mt-3 text-2xl text-[#e1e2ec]">{paidOrders}</p>
                  <p className="mt-1 text-[10px] text-[#7a7d88]">{formatCurrency(paidTotal)}</p>
                </div>
                <div className="rounded-xl border border-[#2a2d36] bg-[#10131a] p-4">
                  <div className="flex items-center gap-2 text-[#8a8d98]">
                    <Clock3 className="h-4 w-4 text-amber-300" />
                    <span className="text-[10px] uppercase tracking-wider">Menunggu</span>
                  </div>
                  <p className="numeral mt-3 text-2xl text-[#e1e2ec]">{pendingOrders.length}</p>
                  <p className="mt-1 text-[10px] text-[#7a7d88]">pesanan perlu dibayar</p>
                </div>
                <div className="col-span-2 rounded-xl border border-[#2a2d36] bg-[#10131a] p-4 sm:col-span-1">
                  <div className="flex items-center gap-2 text-[#8a8d98]">
                    <Ticket className="h-4 w-4 text-[#ffb703]" />
                    <span className="text-[10px] uppercase tracking-wider">Tiket aktif</span>
                  </div>
                  <p className="numeral mt-3 text-2xl text-[#e1e2ec]">{ticketCount}</p>
                  <Link
                    href="/tickets"
                    className="mt-1 inline-flex items-center gap-1 text-[10px] font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
                  >
                    Buka dompet tiket <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>

              {pendingOrders.length > 0 ? (
                <div className="mt-4 flex flex-col gap-3 rounded-xl border border-amber-300/15 bg-amber-300/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-amber-100/80">
                    Ada {pendingOrders.length} pesanan yang menunggu pembayaran.
                  </p>
                  <Link
                    href={`/payments/${pendingOrders[0].id}`}
                    className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-[#ffb703] px-3.5 py-2 text-[10px] font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
                  >
                    Lanjutkan pembayaran <CreditCard className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ) : null}
            </Reveal>

            <Reveal delay={80} className="rounded-2xl border border-[#232733] bg-[#191b23] p-6 sm:p-7">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
                Akses cepat
              </p>
              <h2 className="mt-2 text-xl font-bold text-[#e1e2ec]">Kelola pengalamanmu</h2>
              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Tiket saya", href: "/tickets", icon: Ticket },
                  { label: "Pesanan", href: "/orders", icon: WalletCards },
                  { label: "Profil", href: "/profile", icon: UserRound },
                  { label: "Jelajahi", href: "/events", icon: Compass },
                ].map(({ label, href, icon: Icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className="group flex min-h-24 flex-col justify-between rounded-xl border border-[#2a2d36] bg-[#10131a] p-4 transition hover:border-[#ffb703]/35 hover:bg-[#1e2128]"
                  >
                    <Icon className="h-4 w-4 text-[#ffb703]" />
                    <span className="flex items-center justify-between gap-2 text-xs font-semibold text-[#c4c5cc] transition group-hover:text-[#ffdea9]">
                      {label}
                      <ArrowUpRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </Reveal>
          </section>
        ) : null}

        {accountLoadError ? (
          <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-rose-400/20 bg-rose-400/[0.06] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-rose-200">
              Ringkasan akun dan pesanan belum berhasil dimuat. Data konser tetap tersedia.
            </p>
            <button
              type="button"
              onClick={retryLoading}
              className="inline-flex shrink-0 items-center gap-2 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Coba lagi
            </button>
          </div>
        ) : null}

        <section className="mt-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">
                <Ticket className="h-3.5 w-3.5" />
                Pilihan panggung
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#e1e2ec] sm:text-3xl">
                {user ? "Konser yang mungkin kamu suka" : "Konser yang sedang ramai"}
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#8a8d98]">
                Bandingkan jadwal, lokasi, dan pilihan tiket untuk menemukan malam yang paling pas.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
            >
              Jelajahi semua <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Filter konser">
            {[
              { value: "all", label: "Semua konser" },
              { value: "featured", label: "Pilihan" },
              ...eventGenres.map((genre) => ({ value: genre, label: genre })),
            ].map(({ value, label }) => {
              const isSelected = eventFilter === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setEventFilter(value)}
                  aria-pressed={isSelected}
                  className={`rounded-full border px-4 py-2 text-xs font-semibold transition ${
                    isSelected
                      ? "border-[#ffb703] bg-[#ffb703] text-[#10131a]"
                      : "border-[#2a2d36] bg-[#191b23] text-[#a1a3ac] hover:border-[#ffb703]/40 hover:text-[#ffdea9]"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <span className="ml-auto text-[10px] uppercase tracking-[0.15em] text-[#7a7d88]">
              {filteredEvents.length} konser
            </span>
          </div>

          {events.length > 0 ? (
            filteredEvents.length > 0 ? (
              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.slice(0, 6).map((event) => (
                <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-2xl border border-dashed border-[#2a2d36] bg-[#191b23] px-6 py-10 text-center">
                <Music2 className="mx-auto h-7 w-7 text-[#ffb703]" />
                <p className="mt-3 text-sm text-[#a1a3ac]">
                  Belum ada konser dalam kategori ini.
                </p>
                <button
                  type="button"
                  onClick={() => setEventFilter("all")}
                  className="mt-3 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
                >
                  Tampilkan semua konser
                </button>
              </div>
            )
          ) : (
            <div className="mt-7 flex flex-col items-center rounded-2xl border border-dashed border-[#2a2d36] bg-[#191b23] px-6 py-10 text-center">
              <Ticket className="h-7 w-7 text-[#ffb703]" />
              <p className="mt-3 text-sm text-[#a1a3ac]">
                {eventLoadError ? "Konser belum dapat dimuat saat ini." : "Belum ada konser tersedia saat ini."}
              </p>
              {eventLoadError ? (
                <button
                  type="button"
                  onClick={retryLoading}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] hover:text-[#ffdea9]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Coba lagi
                </button>
              ) : null}
            </div>
          )}
        </section>

        <div className="mt-14 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <section>
            <Reveal className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">Aktivitas</p>
                <h2 className="mt-3 text-2xl font-bold text-[#e1e2ec] sm:text-3xl">
                  {user ? "Pesanan terbaru" : "Ruang konsermu"}
                </h2>
              </div>
              <Link href={user ? "/orders" : "/login"} className="text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]">
                {user ? "Lihat semua" : "Masuk"}
              </Link>
            </Reveal>

            {user && orders.length > 0 ? (
              <Stagger className="mt-6 space-y-3" step={70}>
                {orders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-[#232733] bg-[#191b23] p-4 transition hover:border-[#ffb703]/25"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#ffb703]/15 bg-[#ffb703]/[0.08] text-[#ffb703]">
                      <Ticket className="h-5 w-5" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-[#e1e2ec] transition group-hover:text-[#ffb703]">
                        {order.events?.title || "Pesanan konser"}
                      </p>
                      <p className="mt-1 font-mono text-[0.68rem] tracking-[0.06em] text-[#8a8d98]">
                        {order.order_code} · {formatCurrency(order.total)}
                      </p>
                    </div>
                    <StatusPill status={order.status} />
                  </Link>
                ))}
              </Stagger>
            ) : user ? (
              <Reveal delay={70} className="mt-6">
                <div className="rounded-2xl border border-dashed border-[#2a2d36] bg-[#191b23] px-5 py-12 text-center">
                  <p className="text-sm text-[#8a8d98]">Belum ada pesanan.</p>
                  <Link
                    href="/events"
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
                  >
                    Temukan konser pertamamu <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </Reveal>
            ) : (
              <Reveal delay={70} className="mt-6">
                <div className="relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-6 sm:p-8">
                  <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-[#ffb703]/[0.08] blur-3xl" />
                  <div className="relative">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
                      Simpan momenmu
                    </p>
                    <h3 className="mt-3 text-xl font-bold text-[#e1e2ec]">
                      Punya akun? Semua tiketmu menunggu di sini.
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[#8a8d98]">
                      Masuk untuk melihat pesanan dan mengakses tiket digitalmu kapan saja.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <Link href="/login" className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-4 py-2.5 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]">
                        Masuk ke akun <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                      <Link href="/register" className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] px-4 py-2.5 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]">
                        Daftar gratis
                      </Link>
                    </div>
                  </div>
                </div>
              </Reveal>
            )}
          </section>

          <Reveal className="relative overflow-hidden rounded-2xl border border-[#232733] bg-gradient-to-br from-[#191b23] via-[#191b23] to-[#211b2c] p-6 sm:p-7">
            <div aria-hidden className="absolute -right-12 -top-16 h-48 w-48 rounded-full bg-[#6801d1]/[0.12] blur-3xl" />
            <div className="relative">
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">
                <Ticket className="h-3.5 w-3.5" />
                Panduan pemesanan
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#e1e2ec] sm:text-3xl">
                Dari pilih konser sampai siap berangkat
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#8a8d98]">
                Semua langkah penting terhubung dalam satu alur pemesanan.
              </p>

              <ol className="mt-6 space-y-4">
                {[
                  {
                    title: "Pilih konser dan kategori tiket",
                    description: "Cek tanggal, lokasi, ketersediaan, dan harga sebelum menentukan pilihan.",
                    icon: Compass,
                  },
                  {
                    title: "Selesaikan pesanan dan pembayaran",
                    description: "Ikuti instruksi pembayaran yang tersedia pada pesananmu.",
                    icon: CreditCard,
                  },
                  {
                    title: "Akses tiket digital dari akun",
                    description: "Pantau status pesanan dan buka tiket setelah pembayaran terkonfirmasi.",
                    icon: Ticket,
                  },
                ].map(({ title, description, icon: Icon }, index) => (
                  <li key={title} className="flex gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#ffb703]/20 bg-[#ffb703]/[0.08] text-[#ffb703]">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[#e1e2ec]">
                        <span className="mr-2 text-[10px] text-[#ffb703]">0{index + 1}</span>
                        {title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-[#8a8d98]">{description}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href={user ? "/orders" : "/events"}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-4 py-2.5 text-xs font-bold text-[#10131a] transition hover:bg-[#ffdea9]"
              >
                {user ? "Cek pesanan saya" : "Mulai jelajahi konser"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>

        {user ? (
          <section className="mt-16">
            <Reveal className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">
                  <CalendarDays className="h-3.5 w-3.5" />
                  Rencana konser
                </p>
                <h2 className="mt-3 text-2xl font-bold text-[#e1e2ec] sm:text-3xl">
                  Jadwal dari tiketmu
                </h2>
                <p className="mt-2 text-sm leading-6 text-[#8a8d98]">
                  Konser mendatang dari pesanan yang sudah lunas.
                </p>
              </div>
              <Link
                href="/tickets"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
              >
                Buka tiket saya <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Reveal>

            {upcomingOrders.length > 0 ? (
              <Stagger className="mt-7 grid gap-4 md:grid-cols-2 lg:grid-cols-3" step={70}>
                {upcomingOrders.slice(0, 3).map((order) => (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="group flex items-center gap-4 rounded-2xl border border-[#232733] bg-[#191b23] p-4 transition hover:-translate-y-1 hover:border-[#ffb703]/30 hover:shadow-xl hover:shadow-black/20"
                  >
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#2a2d36] bg-[#10131a]">
                      {order.events?.poster ? (
                        <Image
                          src={resolveMediaUrl(order.events.poster)}
                          alt={order.events.title || "Poster konser"}
                          fill
                          sizes="80px"
                          className="zoom-media object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <Ticket className="h-6 w-6 text-[#ffb703]" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-[#e1e2ec] transition group-hover:text-[#ffb703]">
                        {order.events?.title || "Konser"}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#8a8d98]">
                        <CalendarDays className="h-3 w-3 shrink-0 text-[#ffb703]" />
                        {order.events?.event_date
                          ? formatEventDate(order.events.event_date)
                          : "Jadwal konser"}
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#8a8d98]">
                        <MapPin className="h-3 w-3 shrink-0 text-[#ffb703]" />
                        {order.events?.location || "Lokasi"}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-[#7a7d88] transition group-hover:translate-x-1 group-hover:text-[#ffb703]" />
                  </Link>
                ))}
              </Stagger>
            ) : (
              <div className="mt-7 flex flex-col items-center rounded-2xl border border-dashed border-[#2a2d36] bg-[#191b23] px-6 py-10 text-center">
                <CalendarDays className="h-7 w-7 text-[#ffb703]" />
                <p className="mt-3 text-sm text-[#a1a3ac]">
                  Belum ada konser mendatang dari tiket yang sudah lunas.
                </p>
                <Link
                  href="/events"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
                >
                  Cari konser berikutnya <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </section>
        ) : null}

        <section className="mt-16">
          <Reveal className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">
                <Mic2 className="h-3.5 w-3.5" />
                Kenali musisinya
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#e1e2ec] sm:text-3xl">
                Artis pilihan
              </h2>
              <p className="mt-2 max-w-xl text-sm leading-6 text-[#8a8d98]">
                Temukan profil dan jadwal konser musisi favoritmu.
              </p>
            </div>
            <Link
              href="/artists"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition hover:text-[#ffdea9]"
            >
              Semua artis <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Reveal>

          {artists.length > 0 ? (
            <Stagger className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4" step={65}>
              {artists.map((artist) => (
                <Link
                  key={artist.id}
                  href={`/artists/${artist.id}`}
                  className="group relative overflow-hidden rounded-2xl border border-[#232733] bg-[#191b23] p-4 transition duration-300 hover:-translate-y-1 hover:border-[#ffb703]/35 hover:shadow-xl hover:shadow-black/20 sm:p-5"
                >
                  <div className="relative mx-auto aspect-square w-full max-w-36 overflow-hidden rounded-full border border-[#2a2d36] bg-[#1e2128]">
                    <Image
                      src={resolveMediaUrl(artist.photo || "/globe.svg")}
                      alt={artist.name}
                      fill
                      sizes="(max-width: 640px) 42vw, (max-width: 1024px) 26vw, 160px"
                      className="zoom-media object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <p className="truncate text-sm font-bold text-[#e1e2ec] transition group-hover:text-[#ffb703]">
                      {artist.name}
                    </p>
                    <p className="mt-1 truncate text-[10px] uppercase tracking-wider text-[#8a8d98]">
                      {artist.genre || "Musisi"}
                    </p>
                  </div>
                </Link>
              ))}
            </Stagger>
          ) : (
            <div className="mt-7 flex flex-col items-center rounded-2xl border border-dashed border-[#2a2d36] bg-[#191b23] px-6 py-10 text-center">
              <Mic2 className="h-7 w-7 text-[#ffb703]" />
              <p className="mt-3 text-sm text-[#a1a3ac]">
                {artistLoadError ? "Daftar artis belum dapat dimuat saat ini." : "Belum ada artis untuk ditampilkan."}
              </p>
              {artistLoadError ? (
                <button
                  type="button"
                  onClick={retryLoading}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] hover:text-[#ffdea9]"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  Coba lagi
                </button>
              ) : null}
            </div>
          )}
        </section>

        <Reveal className="relative mt-16 overflow-hidden rounded-3xl border border-[#ffb703]/20 bg-[#191b23] px-6 py-10 text-center sm:px-10 sm:py-14">
          <div aria-hidden className="absolute -left-16 -top-24 h-64 w-64 rounded-full bg-[#ffb703]/[0.09] blur-[90px]" />
          <div aria-hidden className="absolute -right-16 -bottom-24 h-64 w-64 rounded-full bg-[#6801d1]/[0.12] blur-[90px]" />
          <div className="relative mx-auto max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/25 bg-[#ffb703]/[0.08] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffdea9]">
              <Sparkles className="h-3.5 w-3.5 text-[#ffb703]" />
              Your next live moment
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-[#e1e2ec] sm:text-4xl">
              Siap untuk pengalaman konser berikutnya?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[#8a8d98]">
              Temukan jadwal yang cocok, pilih kategori tiket, dan simpan semua detail pesananmu di satu tempat.
            </p>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-xs font-bold text-[#10131a] transition hover:-translate-y-0.5 hover:bg-[#ffdea9]"
              >
                Jelajahi semua konser <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
              <Link
                href={user ? "/tickets" : "/register"}
                className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#10131a]/60 px-5 py-3 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/40 hover:text-[#ffdea9]"
              >
                {user ? "Buka tiket saya" : "Buat akun gratis"}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
