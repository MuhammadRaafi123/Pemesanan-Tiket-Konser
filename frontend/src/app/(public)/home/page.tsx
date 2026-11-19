"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownUp,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Clock,
  Compass,
  MapPin,
  Music2,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  TrendingUp,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { Loading } from "@/components/shared/Loading";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency, formatEventDate, formatEventTime } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { useAuthStore } from "@/stores/authStore";

type DateFilter = "all" | "week" | "month";
type SortOption = "popular" | "date" | "price";

const GENRES = [
  { value: "Pop", label: "Pop", tone: "from-fuchsia-950/90" },
  { value: "Rock", label: "Rock & Indie", tone: "from-slate-950/90" },
  { value: "K-Pop", label: "K-Pop", tone: "from-violet-950/90" },
  { value: "EDM", label: "EDM", tone: "from-indigo-950/90" },
  { value: "Jazz", label: "Jazz & Soul", tone: "from-amber-950/90" },
  { value: "Festival", label: "Festival", tone: "from-emerald-950/90" },
];

function getLowestPrice(event: Event): number | null {
  if (event.ticket_categories?.length) {
    return Math.min(...event.ticket_categories.map((category) => category.price));
  }
  return event.min_price ?? null;
}

function getCity(event: Event): string {
  return event.location_detail?.city || event.location?.split(",")[0]?.trim() || "";
}

function matchesGenre(event: Event, genre: string): boolean {
  if (genre === "all") return true;
  const value = `${event.genre || ""} ${event.artists?.genre || ""}`.toLowerCase();
  if (genre === "Rock") return value.includes("rock") || value.includes("indie");
  if (genre === "K-Pop") return value.includes("k-pop") || value.includes("kpop") || value.includes("korean");
  if (genre === "EDM") return value.includes("edm") || value.includes("electronic") || value.includes("dance");
  if (genre === "Jazz") return value.includes("jazz") || value.includes("soul") || value.includes("blues");
  return value.includes(genre.toLowerCase());
}

function eventHref(event: Event, isMember: boolean): string {
  return `${isMember ? "/home/events" : "/events"}/${event.id}`;
}

function DiscoveryCard({ event, isMember }: { event: Event; isMember: boolean }) {
  const poster = resolveMediaUrl(event.poster || "");
  const price = getLowestPrice(event);
  const artistNames = event.artist_names?.join(", ") || event.artists_list?.map((artist) => artist.name).join(", ") || event.artists?.name || "Live music";

  return (
    <Link
      href={eventHref(event, isMember)}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3deed] bg-[#fffdfc] transition duration-300 hover:-translate-y-1 hover:border-[#aa8fd0] hover:shadow-[0_22px_50px_-35px_rgba(19,12,50,.45)]"
    >
      <div className="relative aspect-[1.55] overflow-hidden bg-[#17112b]">
        {poster ? (
          <Image src={poster} alt={event.title} fill sizes="(max-width: 768px) 90vw, 32vw" className="object-cover transition duration-700 group-hover:scale-105" />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(192,132,252,.5),transparent_35%),linear-gradient(135deg,#17112b,#43306c)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0820]/90 via-transparent to-[#0b0820]/10" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {event.featured ? <span className="rounded-full border border-white/20 bg-[#140d2c]/75 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-[#eadfff] backdrop-blur">Pilihan</span> : null}
          {event.status === "open" ? <span className="rounded-full bg-emerald-300/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-950">Tiket tersedia</span> : <span className="rounded-full bg-white/85 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-700">Tiket habis</span>}
        </div>
        {event.total_remaining != null ? <span className="absolute right-3 top-3 rounded-full bg-[#140d2c]/75 px-2.5 py-1 text-[9px] font-semibold text-white backdrop-blur">Sisa {event.total_remaining}</span> : null}
        <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-2 text-white">
          <div className="min-w-0">
            <p className="line-clamp-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white/75">{artistNames}</p>
            <h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-tight">{event.title}</h3>
          </div>
          <span className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/10 transition group-hover:bg-white group-hover:text-[#21113b]">
            <ChevronRight className="h-4 w-4" />
          </span>
        </div>
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center gap-2 text-xs text-[#625d73]">
          <CalendarDays className="h-3.5 w-3.5 shrink-0 text-[#7959a6]" />
          <span>{formatEventDate(event.event_date, { day: "numeric", month: "short", year: "numeric" })}</span>
          <span className="text-[#cbc5d3]">·</span>
          <MapPin className="h-3.5 w-3.5 shrink-0 text-[#7959a6]" />
          <span className="truncate">{event.location}</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#625d73]">
          <Clock className="h-3.5 w-3.5 shrink-0 text-[#7959a6]" />
          <span>Mulai {event.start_time || formatEventTime(event.event_date)} WIB</span>
        </div>
        <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#eee8f4] pt-3">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#777087]">Harga mulai</p>
            <p className="mt-0.5 text-sm font-extrabold text-[#071653]">{price == null ? "Cek detail" : formatCurrency(price)}</p>
          </div>
          <div className="text-right">
            {event.genre ? <span className="rounded-lg border border-[#e4d9f0] bg-[#f2ebfa] px-2.5 py-1.5 text-[9px] font-bold text-[#624589]">{event.genre}</span> : null}
            {event.ticket_categories?.length ? <p className="mt-2 text-[9px] font-medium text-[#777087]">{event.ticket_categories.length} kategori tiket</p> : null}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [city, setCity] = useState("all");
  const [genre, setGenre] = useState("all");
  const [dateFilter, setDateFilter] = useState<DateFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("popular");
  const [upcomingWindow, setUpcomingWindow] = useState<DateFilter>("week");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchEvents({ limit: 100, status: "open", sort: "popular" })
      .then((items) => {
        if (active) {
          setEvents(items);
          setError("");
        }
      })
      .catch(() => {
        if (active) setError("Konser belum dapat dimuat. Coba muat ulang.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const cities = useMemo(() => [...new Set(events.map(getCity).filter(Boolean))].sort((a, b) => a.localeCompare(b, "id")), [events]);
  const featuredEvents = useMemo(() => {
    const featured = events.filter((event) => event.featured);
    return (featured.length ? featured : events).slice(0, 3);
  }, [events]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const end = new Date(now);
    if (dateFilter === "week") end.setDate(end.getDate() + 7);
    if (dateFilter === "month") end.setMonth(end.getMonth() + 1);
    const search = query.trim().toLocaleLowerCase("id");

    return events.filter((event) => {
      const searchable = [event.title, ...(event.artist_names || []), event.artists?.name, event.venue, event.location, event.genre]
        .filter(Boolean).join(" ").toLocaleLowerCase("id");
      if (search && !searchable.includes(search)) return false;
      if (city !== "all" && getCity(event) !== city) return false;
      if (!matchesGenre(event, genre)) return false;
      const eventDate = new Date(event.event_date);
      if (dateFilter !== "all" && (eventDate < now || eventDate > end)) return false;
      return true;
    }).sort((a, b) => {
      if (sortBy === "date") return new Date(a.event_date).getTime() - new Date(b.event_date).getTime();
      if (sortBy === "price") return (getLowestPrice(a) ?? Number.MAX_SAFE_INTEGER) - (getLowestPrice(b) ?? Number.MAX_SAFE_INTEGER);
      return events.indexOf(a) - events.indexOf(b);
    });
  }, [city, dateFilter, events, genre, query, sortBy]);

  const upcomingEvents = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const end = new Date(now);
    if (upcomingWindow === "week") end.setDate(end.getDate() + 7);
    else if (upcomingWindow === "month") end.setMonth(end.getMonth() + 1);
    return [...events]
      .filter((event) => new Date(event.event_date) >= now && (upcomingWindow === "all" || new Date(event.event_date) <= end))
      .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      .slice(0, 4);
  }, [events, upcomingWindow]);

  const featureEvent = featuredEvents[0];
  const recommendations = events.filter((event) => !event.featured && event.id !== featureEvent?.id).slice(0, 4);

  const applyGenre = (value: string) => {
    setGenre(value);
    document.getElementById("event-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-[#f5f2f8] text-[#071653] selection:bg-[#d6c4ef] selection:text-[#21123a]">
      <Navbar />
      <main className="pb-20 pt-16 sm:pt-16">
        <section className="relative isolate overflow-hidden bg-[#071331] text-white">
          <Image src="/background-header.png" alt="" fill priority sizes="100vw" className="home-header-drift -z-20 object-cover object-[center_42%] opacity-85" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071331]/90 via-[#17102d]/52 to-[#17102d]/10" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071331]/45 via-transparent to-[#071331]/10" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(255,255,255,.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,.04)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_right,#000,transparent_88%)]" />
          <div aria-hidden="true" className="absolute -right-20 top-0 -z-10 h-[28rem] w-[45rem] rounded-full bg-[#8b5cf6]/15 blur-[110px]" />
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[.88fr_1.12fr] lg:gap-12 lg:py-16">

            <div>
              <h1 className="mt-5 max-w-xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
                {user ? <>Hai, {user.name.split(" ")[0] || "Teman"}.<br /></> : <>Temukan konser<br /></>}
                <span className="font-display font-normal text-[#d9c8e8]">yang ingin kamu datangi.</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/70">
                Jelajahi panggung, artis, dan pengalaman live dari berbagai kota. Cari berdasarkan selera dan tentukan tiketmu.
              </p>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a href="#event-results" className="inline-flex items-center gap-2 rounded-xl bg-[#c8b7db] px-4 py-3 text-xs font-extrabold text-[#071653] transition hover:bg-[#e6dcef]">
                  Lihat semua konser <ArrowRight className="h-4 w-4" />
                </a>
                {user ? (
                  <Link href="/tickets" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-4 py-3 text-xs font-bold text-white transition hover:bg-white/10">
                    <Ticket className="h-4 w-4" /> Tiket saya
                  </Link>
                ) : null}
              </div>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-[10px] font-semibold text-white/55">
                <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c9aae9]" />Pilihan konser terkini</span>
                <span className="inline-flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-[#c9aae9]" />Info tiket dan venue</span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-[1.35fr_.85fr]">
              {featureEvent ? (
                <FeaturePoster event={featureEvent} isMember={Boolean(user)} />
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-sm text-white/60">Konser unggulan akan tampil di sini.</div>
              )}
              <div className="grid gap-3 sm:grid-cols-1">
                {featuredEvents.slice(1, 3).map((event) => <MiniFeature key={event.id} event={event} isMember={Boolean(user)} />)}
                {!featuredEvents.length ? <div className="hidden rounded-3xl border border-white/10 bg-white/5 sm:block" /> : null}
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto mt-8 max-w-7xl px-5 sm:px-8">
          <section aria-label="Pencarian konser" className="rounded-2xl border border-[#e6e0ed] bg-[#fffdfc] p-4 shadow-[0_24px_60px_-36px_rgba(26,15,52,.35)] sm:p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.6fr_1fr_1fr_1fr_auto]">
              <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[#e4deec] bg-[#f8f6fb] px-3.5 focus-within:border-[#6264b5] focus-within:ring-4 focus-within:ring-[#6264b5]/15">
                <Search className="h-4 w-4 shrink-0 text-[#6264b5]" />
                <span className="sr-only">Cari konser atau artis</span>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Konser, artis, atau venue" className="min-w-0 flex-1 bg-transparent text-xs font-medium outline-none placeholder:text-[#9691a1]" />
                {query ? <button type="button" aria-label="Hapus pencarian" onClick={() => setQuery("")}><X className="h-4 w-4 text-[#898396]" /></button> : null}
              </label>
              <label className="flex min-h-12 items-center gap-2.5 rounded-xl border border-[#e4deec] bg-[#f8f6fb] px-3.5 text-xs">
                <MapPin className="h-4 w-4 shrink-0 text-[#6264b5]" /><span className="sr-only">Pilih kota</span>
                <select value={city} onChange={(event) => setCity(event.target.value)} className="w-full bg-transparent font-semibold outline-none">
                  <option value="all">Semua kota</option>{cities.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </label>
              <label className="flex min-h-12 items-center gap-2.5 rounded-xl border border-[#e4deec] bg-[#f8f6fb] px-3.5 text-xs">
                <Music2 className="h-4 w-4 shrink-0 text-[#6264b5]" /><span className="sr-only">Pilih genre</span>
                <select value={genre} onChange={(event) => setGenre(event.target.value)} className="w-full bg-transparent font-semibold outline-none">
                  <option value="all">Semua genre</option>{GENRES.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                </select>
              </label>
              <label className="flex min-h-12 items-center gap-2.5 rounded-xl border border-[#e4deec] bg-[#f8f6fb] px-3.5 text-xs">
                <CalendarDays className="h-4 w-4 shrink-0 text-[#6264b5]" /><span className="sr-only">Filter tanggal</span>
                <select value={dateFilter} onChange={(event) => setDateFilter(event.target.value as DateFilter)} className="w-full bg-transparent font-semibold outline-none">
                  <option value="all">Semua tanggal</option><option value="week">7 hari ke depan</option><option value="month">30 hari ke depan</option>
                </select>
              </label>
              <label className="flex min-h-12 items-center gap-2.5 rounded-xl border border-[#e4deec] bg-[#f8f6fb] px-3.5 text-xs">
                <ArrowDownUp className="h-4 w-4 shrink-0 text-[#6264b5]" /><span className="sr-only">Urutkan konser</span>
                <select value={sortBy} onChange={(event) => setSortBy(event.target.value as SortOption)} className="w-full bg-transparent font-semibold outline-none">
                  <option value="popular">Populer</option><option value="date">Tanggal terdekat</option><option value="price">Harga terendah</option>
                </select>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[10px] font-bold uppercase tracking-wider text-[#858091]">Genre cepat</span>
              {GENRES.map((item) => (
                <button key={item.value} type="button" onClick={() => setGenre(genre === item.value ? "all" : item.value)} className={`rounded-full px-3 py-1.5 text-[10px] font-bold transition ${genre === item.value ? "bg-[#071653] text-white" : "bg-[#efebf5] text-[#5c5570] hover:bg-[#e4dced]"}`}>
                  {item.label}
                </button>
              ))}
              <span className="ml-auto text-[10px] font-semibold text-[#898396]">{filteredEvents.length} event ditemukan</span>
            </div>
          </section>
        </div>

        <section className="mx-auto mt-14 max-w-7xl px-5 sm:px-8">
          <SectionTitle eyebrow="Pilih suasana" title="Jelajahi berdasarkan genre" detail="Temukan panggung yang sesuai dengan musik favoritmu." />
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {GENRES.map((item, index) => {
              const art = events.find((event) => matchesGenre(event, item.value)) || events[index];
              const image = resolveMediaUrl(art?.poster || "");
              return (
                <button key={item.value} type="button" onClick={() => applyGenre(item.value)} className="group relative isolate min-h-32 overflow-hidden rounded-2xl bg-[#211634] text-left text-white transition hover:-translate-y-1 hover:shadow-xl sm:min-h-40">
                  {image ? <Image src={image} alt="" fill sizes="(max-width: 768px) 45vw, 16vw" className="-z-20 object-cover opacity-65 transition duration-700 group-hover:scale-110" /> : null}
                  <span className={`absolute inset-0 -z-10 bg-gradient-to-br ${item.tone} via-[#1d1530]/55 to-transparent`} />
                  <span className="absolute bottom-3 left-3 right-3">
                    <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur"><Music2 className="h-4 w-4" /></span>
                    <span className="block text-sm font-extrabold">{item.label}</span>
                    <span className="mt-0.5 block text-[9px] font-medium text-white/65">{events.filter((event) => matchesGenre(event, item.value)).length} konser</span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle eyebrow="Kurasi Tixora" title="Konser unggulan" detail="Pilihan event yang sedang jadi sorotan." />
            <Link href={user ? "/home/events" : "/events"} className="mb-1 hidden items-center gap-1 text-xs font-bold text-[#71518f] hover:text-[#291941] sm:inline-flex">Semua konser <ArrowRight className="h-3.5 w-3.5" /></Link>
          </div>
          {loading ? <div className="mt-5 flex min-h-48 items-center justify-center rounded-2xl bg-white"><Loading message="Memuat konser pilihan..." /></div> : error ? <InlineError message={error} onRetry={() => setReloadKey((key) => key + 1)} /> : featuredEvents.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{featuredEvents.map((event) => <DiscoveryCard key={event.id} event={event} isMember={Boolean(user)} />)}</div>
          ) : <EmptyEvents />}
        </section>

        <section className="mt-16 border-y border-[#e5dced] bg-[#eee9f4] py-12 sm:py-14">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="flex items-end justify-between gap-4">
              <SectionTitle eyebrow="Sedang diminati" title="Trending konser" detail="Urutan populer mengikuti data event yang tersedia." />
              <TrendingUp className="mb-1 hidden h-7 w-7 text-[#7959a6] sm:block" />
            </div>
            {loading ? <div className="mt-5 flex min-h-48 items-center justify-center rounded-2xl bg-white"><Loading message="Memuat event populer..." /></div> : filteredEvents.length ? (
              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filteredEvents.slice(0, 4).map((event) => <DiscoveryCard key={event.id} event={event} isMember={Boolean(user)} />)}</div>
            ) : <EmptyEvents />}
          </div>
        </section>

        <section id="event-results" className="mx-auto mt-16 max-w-7xl scroll-mt-28 px-5 sm:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionTitle eyebrow="Jadwal terbaru" title="Konser yang akan datang" detail="Saring jadwal menurut waktu, lokasi, genre, atau harga." />
              <div className="flex rounded-xl border border-[#e1d9e9] bg-[#fffdfc] p-1">
              {(["week", "month", "all"] as DateFilter[]).map((period) => (
                <button key={period} type="button" onClick={() => setUpcomingWindow(period)} className={`rounded-lg px-3 py-2 text-[10px] font-bold transition ${upcomingWindow === period ? "bg-[#071653] text-white" : "text-[#655e75] hover:text-[#071653]"}`}>
                  {period === "week" ? "Minggu ini" : period === "month" ? "Bulan ini" : "Semua"}
                </button>
              ))}
            </div>
          </div>
          {loading ? <div className="mt-5 flex min-h-48 items-center justify-center rounded-2xl bg-white"><Loading message="Memuat jadwal..." /></div> : upcomingEvents.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{upcomingEvents.map((event) => <DiscoveryCard key={event.id} event={event} isMember={Boolean(user)} />)}</div>
          ) : <p className="mt-5 rounded-2xl border border-dashed border-[#d6cde1] bg-white p-8 text-center text-sm text-[#777083]">Belum ada konser pada periode ini. Coba lihat semua jadwal.</p>}
          <div className="mt-5 text-center"><Link href={user ? "/home/events" : "/events"} className="inline-flex items-center gap-2 rounded-xl border border-[#6264b5] bg-gradient-to-r from-[#6264b5] to-[#51539f] px-5 py-3 text-xs font-extrabold text-white shadow-[0_10px_24px_-12px_rgba(81,83,159,.75)] transition hover:-translate-y-0.5 hover:from-[#7072c7] hover:to-[#6264b5] hover:shadow-[0_14px_28px_-12px_rgba(81,83,159,.85)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#6264b5]">Jelajahi seluruh jadwal <ArrowRight className="h-4 w-4" /></Link></div>
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <div className="flex items-end justify-between gap-4">
            <SectionTitle eyebrow="Pilihan berikutnya" title="Mungkin kamu suka" detail="Rekomendasi dari event yang tersedia saat ini." />
            <Sparkles className="mb-1 hidden h-6 w-6 text-[#8767a8] sm:block" />
          </div>
          {loading ? <div className="mt-5 flex min-h-48 items-center justify-center rounded-2xl bg-white"><Loading message="Menyiapkan rekomendasi..." /></div> : recommendations.length ? (
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{recommendations.map((event) => <DiscoveryCard key={event.id} event={event} isMember={Boolean(user)} />)}</div>
          ) : <EmptyEvents />}
        </section>

        <section className="mx-auto mt-16 max-w-7xl px-5 sm:px-8">
          <div className="grid gap-3 rounded-3xl bg-[#211634] p-5 text-white sm:grid-cols-2 sm:p-7 lg:grid-cols-4">
            <PlatformFeature icon={Zap} title="E-ticket digital" text="Akses tiket dari halaman akunmu." />
            <PlatformFeature icon={Ticket} title="Pilihan kategori" text="Bandingkan jenis tiket yang tersedia." />
            <PlatformFeature icon={ShieldCheck} title="Pembayaran tercatat" text="Pantau status transaksi dan pesanan." />
            <PlatformFeature icon={Check} title="Status real-time" text="Lihat pembaruan status tiketmu." />
          </div>
        </section>

        <section className="mx-auto mt-12 max-w-7xl px-5 sm:px-8">
            <div className="flex flex-col gap-4 rounded-2xl border border-[#e2dbea] bg-[#fffdfc] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div>
              <p className="text-sm font-extrabold text-[#25183a]">{user ? "Kelola pengalaman konsermu" : "Siapkan konser berikutnya"}</p>
              <p className="mt-1 text-xs text-[#767080]">{user ? "Pesanan dan tiket tersimpan di akunmu." : "Masuk untuk menyimpan dan mengelola tiket konser."}</p>
            </div>
            <div className="flex gap-2">
              {user ? <><Link href="/orders" className="rounded-xl border border-[#e2dbea] px-4 py-2.5 text-xs font-bold text-[#071653] hover:bg-[#f2eef7]">Pesanan</Link><Link href="/tickets" className="rounded-xl bg-[#6264b5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#51539f]">Tiket saya</Link></> : <Link href="/register" className="rounded-xl bg-[#6264b5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#51539f]">Buat akun</Link>}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}

function FeaturePoster({ event, isMember }: { event: Event; isMember: boolean }) {
  const poster = resolveMediaUrl(event.poster || "");
  return (
    <Link href={eventHref(event, isMember)} className="group relative isolate min-h-[330px] overflow-hidden rounded-3xl border border-white/15 bg-[#25193b] sm:min-h-[400px]">
      {poster ? <Image src={poster} alt={event.title} fill sizes="(max-width: 1024px) 90vw, 40vw" priority className="-z-20 object-cover transition duration-700 group-hover:scale-105" /> : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0716]/95 via-[#0a0716]/15 to-[#0a0716]/15" />
      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full border border-white/20 bg-[#170f2b]/65 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[.16em] text-white backdrop-blur"></div>
      <div className="absolute inset-x-5 bottom-5 text-white sm:inset-x-6 sm:bottom-6">
        <p className="line-clamp-2 text-[10px] font-bold uppercase tracking-[.16em] text-[#ddc9f4]">{event.artist_names?.join(", ") || event.artists_list?.map((artist) => artist.name).join(", ") || event.artists?.name || event.genre || "Live music"}</p>
        <h2 className="mt-2 max-w-lg text-2xl font-extrabold leading-tight sm:text-3xl">{event.title}</h2>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] font-medium text-white/80">
          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatEventDate(event.event_date, { day: "numeric", month: "short", year: "numeric" })}</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.location}</span>
          <span className="inline-flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" />Mulai {event.start_time || formatEventTime(event.event_date)} WIB</span>
        </div>
        <span className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white px-3.5 py-2.5 text-[10px] font-extrabold text-[#21123a] transition group-hover:bg-[#e6d9f5]">Lihat konser <ArrowRight className="h-3.5 w-3.5" /></span>
      </div>
    </Link>
  );
}

function MiniFeature({ event, isMember }: { event: Event; isMember: boolean }) {
  const poster = resolveMediaUrl(event.poster || "");
  return (
    <Link href={eventHref(event, isMember)} className="group relative isolate flex min-h-40 overflow-hidden rounded-2xl border border-white/15 bg-[#241937] sm:min-h-0">
      {poster ? <Image src={poster} alt={event.title} fill sizes="(max-width: 640px) 45vw, 20vw" className="-z-20 object-cover transition duration-700 group-hover:scale-105" /> : null}
      <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#0a0716]/90 via-[#0a0716]/25 to-transparent" />
      <div className="mt-auto p-4 text-white">
        <p className="text-[9px] font-bold uppercase tracking-[.15em] text-[#ddc9f4]">{event.genre || "Live music"}</p>
        <h3 className="mt-1 line-clamp-2 text-base font-extrabold leading-tight">{event.title}</h3>
        <p className="mt-2 line-clamp-2 text-[9px] text-white/70">{event.artist_names?.join(", ") || event.artists_list?.map((artist) => artist.name).join(", ") || event.artists?.name || "Live music"}</p>
        <p className="mt-1 text-[9px] text-white/70">{formatEventDate(event.event_date, { day: "numeric", month: "short" })} · {event.start_time || formatEventTime(event.event_date)} WIB · {getCity(event)}</p>
      </div>
    </Link>
  );
}

function SectionTitle({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) {
  return <div><p className="text-[9px] font-extrabold uppercase tracking-[.2em] text-[#6264b5]">{eyebrow}</p><h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-[#071653] sm:text-3xl">{title}</h2><p className="mt-1.5 text-xs leading-5 text-[#625d73]">{detail}</p></div>;
}

function PlatformFeature({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#d9c5f2]/15 text-[#dfccf5]"><Icon className="h-4 w-4" /></span><div><h3 className="text-xs font-extrabold">{title}</h3><p className="mt-1 text-[10px] leading-5 text-white/60">{text}</p></div></div>;
}

function InlineError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-xs text-amber-950"><p>{message}</p><button type="button" onClick={onRetry} className="font-bold underline underline-offset-2">Muat ulang</button></div>;
}

function EmptyEvents() {
  return <p className="mt-5 rounded-2xl border border-dashed border-[#d7cde2] bg-white p-8 text-center text-sm text-[#797286]">Belum ada konser yang cocok. Ubah filter atau coba lagi nanti.</p>;
}
