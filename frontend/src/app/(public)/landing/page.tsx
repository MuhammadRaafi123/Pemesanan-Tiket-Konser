"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, ArrowRight, CalendarDays, Check, ChevronDown, Clock, MapPin, Music2, Search, Star } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency, formatEventDate, formatEventTime } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

const GENRES = [
  { value: "Pop", label: "Pop", tone: "from-fuchsia-950/90" },
  { value: "Rock", label: "Rock & Indie", tone: "from-slate-950/90" },
  { value: "K-Pop", label: "K-Pop", tone: "from-violet-950/90" },
  { value: "Hip-Hop & Rap", label: "Hip-Hop & Rap", tone: "from-rose-950/90" },
  { value: "R&B & Soul", label: "R&B & Soul", tone: "from-pink-950/90" },
  { value: "EDM", label: "EDM & Electronic", tone: "from-indigo-950/90" },
  { value: "Jazz", label: "Jazz & Blues", tone: "from-amber-950/90" },
  { value: "Metal", label: "Metal & Punk", tone: "from-zinc-950/90" },
  { value: "Folk & Country", label: "Folk & Country", tone: "from-orange-950/90" },
  { value: "Reggae", label: "Reggae", tone: "from-emerald-950/90" },
  { value: "Classical", label: "Klasik", tone: "from-blue-950/90" },
  { value: "Dangdut", label: "Dangdut", tone: "from-yellow-950/90" },
];

function matchesGenre(event: Event, genre: string): boolean {
  const value = `${event.genre || ""} ${event.artists?.genre || ""}`.toLowerCase();
  if (genre === "Rock") return value.includes("rock") || value.includes("indie");
  if (genre === "K-Pop") return value.includes("k-pop") || value.includes("kpop") || value.includes("korean");
  if (genre === "EDM") return value.includes("edm") || value.includes("electronic") || value.includes("dance");
  if (genre === "Hip-Hop & Rap") return value.includes("hip-hop") || value.includes("hip hop") || value.includes("hiphop") || value.includes("rap");
  if (genre === "R&B & Soul") return value.includes("r&b") || value.includes("rnb") || value.includes("rhythm and blues") || value.includes("soul");
  if (genre === "Jazz") return value.includes("jazz") || value.includes("blues");
  if (genre === "Metal") return value.includes("metal") || value.includes("punk") || value.includes("hardcore");
  if (genre === "Folk & Country") return value.includes("folk") || value.includes("country") || value.includes("bluegrass");
  if (genre === "Reggae") return value.includes("reggae") || value.includes("ska") || value.includes("dancehall");
  if (genre === "Classical") return value.includes("classical") || value.includes("klasik") || value.includes("orchestra");
  if (genre === "Dangdut") return value.includes("dangdut");
  return value.includes(genre.toLowerCase());
}

function getLowestPrice(event: Event): number | null {
  if (event.ticket_categories?.length) return Math.min(...event.ticket_categories.map((ticket) => ticket.price));
  return event.min_price ?? null;
}

const fallbackTickets = [
  { name: "Regular", price: 450000, perks: ["Akses area regular", "E-ticket digital", "Free standing"] },
  { name: "Festival", price: 850000, perks: ["Akses festival floor", "Fast lane entry", "Exclusive wristband"] },
  { name: "VIP", price: 1650000, perks: ["Zona dekat panggung", "Dedicated entrance", "Merchandise eksklusif"] },
  { name: "VVIP", price: 2850000, perks: ["Premium viewing deck", "Lounge & refreshments", "Meet & greet session"] },
];

function getTicketZone(name: string, index: number) {
  const normalized = name.toLowerCase();
  if (/vvip|diamond|soundcheck|meet/.test(normalized)) return { index: 3, label: "Zona premium, paling dekat dengan panggung" };
  if (/vip|platinum|gold/.test(normalized)) return { index: 2, label: "Zona VIP di sisi depan panggung" };
  if (/festival|pit|standing/.test(normalized)) return { index: 1, label: "Festival floor, tepat di depan panggung" };
  if (/regular|reguler|tribune|tribun|silver/.test(normalized)) return { index: 0, label: "Area reguler di sisi kiri panggung" };
  const zones = [
    "Area reguler di sisi kiri panggung",
    "Festival floor, tepat di depan panggung",
    "Zona VIP di sisi depan panggung",
    "Zona premium, paling dekat dengan panggung",
  ];
  return { index: index % zones.length, label: zones[index % zones.length] };
}

const highlights = [
  { n: "01", title: "Energi panggung yang terasa langsung", text: "Rasakan setiap chorus, riff, dan drop dalam pengalaman musik yang bisa dinikmati bersama." },
  { n: "02", title: "Penampilan berkesan dari para artis", text: "Temukan konser dan lineup pilihan untuk berbagai suasana dan jenis acara." },
  { n: "03", title: "Cerita dan kenangan untuk dibawa pulang", text: "Nikmati musik, suasana, dan momen yang membuat setiap acara terasa istimewa." },
];

const sampleReviews = [
  { initials: "A", category: "Pembelian tiket", quote: "Alur pemesanan terasa simpel dan informasi kategori tiket mudah dipahami." },
  { initials: "B", category: "Pengalaman event", quote: "Pilihan konsernya menarik. Detail tanggal dan lokasi membantu saat memilih acara." },
  { initials: "C", category: "E-ticket", quote: "Tiket digital mudah ditemukan kembali saat dibutuhkan." },
];

const fallbackArtists = [
  { name: "NIKI", genre: "Alternative R&B", photo: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=900&q=85" },
  { name: "Hindia", genre: "Indie Pop / Rock", photo: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=900&q=85" },
  { name: "Reality Club", genre: "Indie Rock", photo: "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&w=900&q=85" },
];

export default function LandingPage() {
  const [event, setEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedCity, setSelectedCity] = useState("all");
  const [eventSearch, setEventSearch] = useState("");
  const [selectedTicketName, setSelectedTicketName] = useState<string | null>(null);
  const [showAllGenres, setShowAllGenres] = useState(false);
  useEffect(() => {
    let active = true;
    fetchEvents({ status: "open", limit: 100, sort: "popular" })
      .then((items) => {
        if (active) {
          setEvents(items);
          setEvent(items.find((item) => item.slug === "peterpan-tour-of-love") || items.find((item) => item.featured) || items[0] || null);
        }
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const artistNames = event?.artist_names?.length ? event.artist_names : ["NIKI", "Hindia", "Reality Club"];
  const lineup = event?.artists_list?.length
    ? event.artists_list.map((artist, index) => ({
        name: artist.name,
        genre: artist.genre || event.genre || "Live performance",
        photo: resolveMediaUrl(artist.photo || fallbackArtists[index % fallbackArtists.length].photo),
      }))
    : event?.artist_names?.length
      ? event.artist_names.map((name, index) => ({
          name,
          genre: event.genre || "Live performance",
          photo: fallbackArtists[index % fallbackArtists.length].photo,
        }))
      : fallbackArtists;
  const tickets = event?.ticket_categories?.length
    ? event.ticket_categories.map((ticket) => ({ name: ticket.category_name, price: ticket.price, perks: ticket.perks?.length ? ticket.perks : ["Akses konser", "E-ticket digital", "Official event wristband"] }))
    : fallbackTickets;
  const selectedTicket = tickets.find((ticket) => ticket.name === selectedTicketName) || tickets[0];
  const selectedTicketIndex = Math.max(0, tickets.findIndex((ticket) => ticket.name === selectedTicket?.name));
  const selectedZone = selectedTicket ? getTicketZone(selectedTicket.name, selectedTicketIndex) : getTicketZone("Regular", 0);
  const eventHref = event ? `/events/${event.id}` : "/events";
  const firstTitleWord = "Tixora";
  const titleRemainder = "Temukan Momen Musikmu";
  const eventDate = event?.event_date ? formatEventDate(event.event_date, { day: "numeric", month: "long", year: "numeric" }) : "14 November 2026";
  const venue = event?.venue || "Sasana Budaya Ganesha (Sabuga)";
  const city = event?.location || "Bandung, Jawa Barat";
  const visibleEvents = events.filter((item) => {
    const genreMatch = selectedGenre === "all" || matchesGenre(item, selectedGenre);
    const cityMatch = selectedCity === "all" || `${item.location || ""} ${item.venue || ""}`.toLowerCase().includes(selectedCity.toLowerCase());
    const searchable = `${item.title} ${item.artist_names?.join(" ") || ""} ${item.artists_list?.map((artist) => artist.name).join(" ") || ""} ${item.artists?.name || ""} ${item.genre || ""}`.toLowerCase();
    return genreMatch && cityMatch && searchable.includes(eventSearch.trim().toLowerCase());
  });
  const selectGenre = (genre: string) => {
    setSelectedGenre(genre);
    document.getElementById("concert-events")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const cityOptions = ["Jakarta", "Bandung", "Surabaya", "Bali", "Yogyakarta", "Semarang"];

  return <div className="landing-page tixora-event min-h-screen bg-[#0b0917] text-white selection:bg-violet-400 selection:text-[#0b0917]">
    <Navbar />
    <main>
      <section className="relative flex min-h-[620px] items-end overflow-hidden bg-[#0b0917] px-5 pb-10 pt-28 sm:min-h-[690px] sm:px-10 sm:pb-14 lg:min-h-[740px]">
        <div aria-hidden className="home-header-drift absolute inset-0 bg-[url('/background-header.png')] bg-cover bg-[center_38%]" />
        <div aria-hidden className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,24,.92)_0%,rgba(8,7,24,.66)_48%,rgba(8,7,24,.12)_100%),linear-gradient(0deg,#0b0917_0%,transparent_48%)]" />
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(ellipse_at_76%_42%,rgba(139,92,246,.28),transparent_36%)]" />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b0917] to-transparent" />
        <div className="relative mx-auto grid w-full max-w-7xl items-end gap-8 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-8">
          <div className="max-w-3xl">
            <h1 className="max-w-3xl text-[clamp(2.7rem,7vw,5.8rem)] font-black uppercase leading-[.88] tracking-[-.065em] drop-shadow-[0_8px_35px_rgba(0,0,0,.35)]">{firstTitleWord}<br/><span className="bg-gradient-to-r from-violet-200 via-violet-400 to-fuchsia-300 bg-clip-text text-transparent">{titleRemainder}</span></h1>
            <p className="mt-5 max-w-lg text-sm leading-6 text-white/80 sm:mt-6 sm:text-base sm:leading-7">Temukan konser favorit, kenali lineup artis, dan pesan tiket resmi dengan mudah lewat Tixora.</p>
            <div className="mt-6 flex flex-wrap gap-2.5 sm:mt-7 text-xs font-semibold sm:text-sm">
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-3.5 py-2.5 backdrop-blur-md"><CalendarDays className="h-4 w-4 text-violet-300"/>{eventDate}</span>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-black/25 px-3.5 py-2.5 backdrop-blur-md"><MapPin className="h-4 w-4 text-violet-300"/>{venue}, {city}</span>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-3 sm:mt-7 sm:gap-4">
              <Link href={eventHref} className="group inline-flex items-center gap-3 rounded-full bg-violet-300 px-6 py-3.5 text-sm font-extrabold text-[#100d20] shadow-[0_12px_35px_-12px_rgba(167,139,250,.75)] transition duration-300 hover:-translate-y-1 hover:bg-white">Pesan Tiket <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1"/></Link>
              <a href="#lineup" className="inline-flex items-center gap-2 rounded-full border border-white/35 bg-white/[.04] px-5 py-3.5 text-sm font-bold backdrop-blur-sm transition hover:border-white hover:bg-white/10">Lihat lineup <ArrowDown className="h-4 w-4"/></a>
            </div>
            <p className="mt-6 text-[10px] font-medium tracking-wide text-white/50">Tiket resmi Tixora <span className="mx-2 text-violet-300">·</span> E-ticket instan <span className="mx-2 text-violet-300">·</span> Pembayaran aman</p>
          </div>
          <aside className="relative hidden lg:block">
            <div className="absolute -right-4 -top-12 rotate-90 text-[9px] font-bold uppercase tracking-[.35em] text-white/45">Pengalaman konser</div>
            <div className="overflow-hidden rounded-2xl border border-white/20 bg-[#130f25]/75 shadow-[0_30px_100px_-35px_rgba(0,0,0,.9)] backdrop-blur-xl transition duration-500 hover:-translate-y-2 hover:border-violet-300/60">
              <div className="border-b border-dashed border-white/20 p-5">
                <p className="text-[9px] font-bold uppercase tracking-[.24em] text-violet-300">Jadwal konser pilihan</p>
                <p className="mt-3 text-xl font-black uppercase leading-tight">Musiknya memanggil.<br/>Jangan lewatkan.</p>
                <div className="mt-5 flex items-center gap-3 text-xs text-white/65"><CalendarDays className="h-4 w-4 text-violet-300"/>{eventDate}</div>
                <div className="mt-2 flex items-center gap-3 text-xs text-white/65"><MapPin className="h-4 w-4 text-violet-300"/><span className="line-clamp-1">{venue}</span></div>
              </div>
              <div className="flex items-center justify-between p-5"><div><p className="text-[9px] font-bold uppercase tracking-[.2em] text-white/40">Tiket mulai dari</p><p className="mt-1 text-xl font-black text-violet-200">{formatCurrency(Math.min(...tickets.map((ticket) => ticket.price)))}</p></div><Link href={eventHref} aria-label="Pilih tiket" className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-300 text-[#100d20] transition hover:scale-110 hover:bg-white"><ArrowRight className="h-5 w-5"/></Link></div>
              <div className="h-1 bg-gradient-to-r from-violet-500 via-fuchsia-300 to-violet-500"/>
            </div>
          </aside>
        </div>
      </section>

      <section aria-label="Cari event konser" className="border-y border-white/[.08] bg-[#100d20] px-5 pb-8 pt-12 sm:px-10 sm:pb-10 sm:pt-16">
        <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-[#171329] p-3 shadow-[0_18px_55px_-38px_rgba(167,139,250,.65)] sm:p-4">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_minmax(180px,.8fr)_minmax(180px,.8fr)_auto]">
            <label className="flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-[#0f0c1d] px-4 transition focus-within:border-violet-300/60 focus-within:ring-2 focus-within:ring-violet-300/10">
              <Search className="h-5 w-5 shrink-0 text-violet-300" />
              <span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[.16em] text-white/45">Cari konser</span><input type="search" value={eventSearch} onChange={(e) => setEventSearch(e.target.value)} placeholder="Nama event atau artis" className="mt-0.5 w-full bg-transparent text-sm font-semibold text-white outline-none placeholder:font-normal placeholder:text-white/35" /></span>
            </label>
            <label className="relative flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-[#0f0c1d] px-4 transition focus-within:border-violet-300/60">
              <Music2 className="h-5 w-5 shrink-0 text-violet-300" /><span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[.16em] text-white/45">Kategori genre</span><select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="mt-0.5 w-full appearance-none bg-transparent pr-5 text-sm font-semibold text-white outline-none"><option value="all" className="bg-[#171329]">Semua genre</option>{GENRES.map((genre) => <option key={genre.value} value={genre.value} className="bg-[#171329]">{genre.label}</option>)}</select></span><ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/40" />
            </label>
            <label className="relative flex min-h-14 items-center gap-3 rounded-xl border border-white/10 bg-[#0f0c1d] px-4 transition focus-within:border-violet-300/60">
              <MapPin className="h-5 w-5 shrink-0 text-violet-300" /><span className="min-w-0 flex-1"><span className="block text-[9px] font-bold uppercase tracking-[.16em] text-white/45">Kota</span><select value={selectedCity} onChange={(e) => setSelectedCity(e.target.value)} className="mt-0.5 w-full appearance-none bg-transparent pr-5 text-sm font-semibold text-white outline-none"><option value="all" className="bg-[#171329]">Semua kota</option>{cityOptions.map((item) => <option key={item} value={item} className="bg-[#171329]">{item}</option>)}</select></span><ChevronDown className="pointer-events-none absolute right-3 h-4 w-4 text-white/40" />
            </label>
            <button type="button" onClick={() => document.getElementById("concert-events")?.scrollIntoView({ behavior: "smooth", block: "start" })} className="inline-flex min-h-14 items-center justify-center gap-2 rounded-xl bg-violet-300 px-6 text-sm font-extrabold text-[#171329] transition hover:bg-violet-200 lg:min-w-32"><Search className="h-4 w-4" />Cari event</button>
          </div>
        </div>
      </section>

      <section aria-label="Jelajahi berdasarkan genre" className="bg-[#f2effb] px-5 py-14 text-[#171329] sm:px-10 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[.24em] text-violet-700">Pilih suasana</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">Jelajahi berdasarkan genre</h2><p className="mt-2 text-sm text-[#656078]">Temukan konser yang cocok dengan musik favoritmu.</p></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {GENRES.slice(0, showAllGenres ? GENRES.length : 5).map((genre, index) => {
              const art = events.find((item) => matchesGenre(item, genre.value)) || events[index];
              const image = resolveMediaUrl(art?.poster || "");
              const count = events.filter((item) => matchesGenre(item, genre.value)).length;
              return <button key={genre.value} type="button" onClick={() => selectGenre(genre.value)} className="group relative isolate min-h-32 overflow-hidden rounded-2xl bg-[#211634] text-left text-white transition hover:-translate-y-1 hover:shadow-xl sm:min-h-40">
                <Image src={image} alt="" fill sizes="(max-width: 768px) 45vw, 16vw" className="-z-20 object-cover opacity-65 transition duration-700 group-hover:scale-110" />
                <span className={`absolute inset-0 -z-10 bg-gradient-to-br ${genre.tone} via-[#1d1530]/55 to-transparent`} />
                <span className="absolute bottom-3 left-3 right-3"><span className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur"><Music2 className="h-4 w-4"/></span><span className="block text-sm font-extrabold">{genre.label}</span><span className="mt-0.5 block text-[9px] font-medium text-white/65">{count} konser</span></span>
              </button>;
            })}
          </div>
          {GENRES.length > 5 ? <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAllGenres((showAll) => !showAll)}
              aria-expanded={showAllGenres}
              className="inline-flex items-center gap-2 rounded-full border border-violet-300 bg-white px-5 py-2.5 text-sm font-bold text-violet-800 shadow-sm transition hover:border-violet-400 hover:bg-violet-50"
            >
              {showAllGenres ? "Tampilkan lebih sedikit" : "Lihat semua genre"}
              <ChevronDown className={`h-4 w-4 transition-transform ${showAllGenres ? "rotate-180" : ""}`} />
            </button>
          </div> : null}
        </div>
      </section>

      <section id="concert-events" aria-label="Event konser" className="scroll-mt-24 bg-[#fffdfc] px-5 py-14 text-[#171329] sm:px-10 sm:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[.24em] text-violet-700">Konser pilihan</p><h2 className="mt-2 text-3xl font-black sm:text-4xl">{selectedGenre === "all" ? "Event konser" : `Konser ${GENRES.find((genre) => genre.value === selectedGenre)?.label}`}</h2><p className="mt-2 text-sm text-[#656078]">Pilih event dan amankan tiketmu.</p></div>
            <div className="flex items-center gap-3"><button type="button" onClick={() => setSelectedGenre("all")} className={`rounded-full px-3.5 py-2 text-xs font-bold transition ${selectedGenre === "all" ? "bg-violet-100 text-violet-800" : "border border-[#ddd4e9] bg-white text-[#777087] hover:border-violet-300 hover:text-violet-800"}`}>Semua genre</button><Link href="/events" className="inline-flex items-center gap-2 text-sm font-bold text-violet-800 transition hover:text-violet-600">Lihat semua <ArrowRight className="h-4 w-4"/></Link></div>
          </div>
          {visibleEvents.length ? <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleEvents.slice(0, 8).map((item) => {
              const price = getLowestPrice(item);
              const poster = resolveMediaUrl(item.poster || "");
              return <Link key={item.id} href={`/events/${item.id}`} className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#e3deed] bg-white transition duration-300 hover:-translate-y-1 hover:border-[#aa8fd0] hover:shadow-[0_22px_50px_-35px_rgba(19,12,50,.45)]">
                <div className="relative aspect-[1.45] overflow-hidden bg-[#17112b]"><Image src={poster} alt={item.title} fill sizes="(max-width: 768px) 90vw, 25vw" className="object-cover transition duration-700 group-hover:scale-105"/><div className="absolute inset-0 bg-gradient-to-t from-[#0b0820]/90 via-transparent to-[#0b0820]/10"/><span className="absolute left-3 top-3 rounded-full bg-emerald-300/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-emerald-950">Tiket tersedia</span><div className="absolute inset-x-4 bottom-4 text-white"><p className="line-clamp-2 text-[10px] font-semibold uppercase tracking-[.14em] text-white/75">{item.artist_names?.join(", ") || item.artists_list?.map((artist) => artist.name).join(", ") || item.artists?.name || "Live music"}</p><h3 className="mt-1 line-clamp-2 text-lg font-extrabold leading-tight">{item.title}</h3></div></div>
                <div className="flex flex-1 flex-col p-4"><div className="flex items-center gap-2 text-xs text-[#625d73]"><CalendarDays className="h-3.5 w-3.5 shrink-0 text-violet-700"/><span>{formatEventDate(item.event_date, { day: "numeric", month: "short", year: "numeric" })}</span></div><p className="mt-2 flex items-center gap-2 text-xs text-[#625d73]"><MapPin className="h-3.5 w-3.5 shrink-0 text-violet-700"/><span className="truncate">{item.venue || item.location}</span></p><p className="mt-2 flex items-center gap-2 text-xs text-[#625d73]"><Clock className="h-3.5 w-3.5 shrink-0 text-violet-700"/><span>Mulai {item.start_time || formatEventTime(item.event_date)} WIB</span></p><div className="mt-auto flex items-end justify-between gap-3 border-t border-[#eee8f4] pt-3 mt-4"><div><p className="text-[9px] font-bold uppercase tracking-[.14em] text-[#777087]">Harga mulai</p><p className="mt-0.5 text-sm font-extrabold text-[#071653]">{price == null ? "Cek detail" : formatCurrency(price)}</p></div>{item.genre ? <span className="rounded-lg border border-[#e4d9f0] bg-[#f2ebfa] px-2.5 py-1.5 text-[9px] font-bold text-[#624589]">{item.genre}</span> : null}</div></div>
              </Link>;
            })}
          </div> : <p className="rounded-2xl border border-dashed border-[#d6cde1] bg-white p-8 text-center text-sm text-[#777083]">Belum ada konser untuk genre ini.</p>}
        </div>
      </section>

      <section className="bg-[#0b0917] px-5 py-16 sm:px-10 sm:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative min-h-[360px] overflow-hidden rounded-[1.75rem] bg-[#211b35] sm:min-h-[480px]">
            <Image src="/background-header.png" alt="Panggung konser Tixora" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover object-center transition duration-700 hover:scale-105" />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#100d20]/90 via-[#100d20]/20 to-[#100d20]/10" />
            <div className="absolute inset-x-5 bottom-5 sm:inset-x-8 sm:bottom-8">
              <p className="text-[10px] font-bold uppercase tracking-[.24em] text-violet-100">Music for every moment</p>
              <p className="mt-2 max-w-md text-2xl font-black leading-tight text-white sm:text-4xl">Musik yang terasa dekat, di setiap suasana.</p>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[.24em] text-violet-300">The experience</p>
            <h2 className="mt-4 max-w-xl text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">Lebih dari sekadar <span className="text-violet-300">live music.</span></h2>
            <p className="mt-5 max-w-lg text-sm leading-7 text-white/55">Datang untuk musiknya. Pulang membawa cerita yang akan kamu ulang terus.</p>
            <div className="mt-8 border-t border-white/10">
              {highlights.map((item) => <article key={item.n} className="group grid gap-3 border-b border-white/10 py-5 transition sm:grid-cols-[52px_1fr] sm:gap-4">
                <span className="font-mono text-xs font-bold tracking-wider text-violet-300">{item.n}</span>
                <div><h3 className="text-base font-bold text-white transition group-hover:text-violet-200 sm:text-lg">{item.title}</h3><p className="mt-1.5 max-w-lg text-xs leading-6 text-white/50 sm:text-sm">{item.text}</p></div>
              </article>)}
            </div>
          </div>
        </div>
      </section>

      <section id="ticket-zones" className="bg-[#f2effb] px-5 py-16 text-[#171329] sm:px-10 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-bold uppercase tracking-[.24em] text-violet-700">Pilih pengalamanmu</p><h2 className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Panggung &amp; harga tiket<span className="text-violet-600">.</span></h2></div>
            <p className="max-w-sm text-sm leading-6 text-[#656078]">Lihat ilustrasi area panggung dan bandingkan kategori tiket event pilihan.</p>
          </div>
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-12">
            <div className="relative flex min-h-[390px] flex-col items-center justify-center overflow-hidden rounded-3xl bg-[radial-gradient(ellipse_at_50%_30%,#30204f,#100d20_72%)] p-5 sm:min-h-[470px] sm:p-8">
              <div aria-hidden className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(ellipse_at_50%_0%,rgba(196,157,255,.3),transparent_70%)]" />
              <div className="absolute left-5 top-5 z-10"><p className="text-[10px] font-black uppercase tracking-[.2em] text-violet-200">3D stage view</p><p className="mt-1 text-[9px] text-white/55">Berputar 360° · arahkan kursor untuk jeda</p></div>
              <div className="stage-3d-scene relative mt-8 flex h-[280px] w-full max-w-[480px] items-center justify-center sm:h-[320px]" role="img" aria-label="Ilustrasi panggung konser isometrik dengan layar, rig lampu, dan area penonton">
                <div className="stage-3d-turn w-full">
                  <svg viewBox="0 0 680 440" className="h-auto w-full overflow-visible drop-shadow-[0_28px_28px_rgba(0,0,0,.5)]" aria-hidden="true">
                    <defs>
                      <linearGradient id="stageFloor" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#47365d"/><stop offset=".55" stopColor="#251b34"/><stop offset="1" stopColor="#110d1c"/></linearGradient>
                      <linearGradient id="stageDeck" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#725493"/><stop offset="1" stopColor="#21172e"/></linearGradient>
                      <linearGradient id="stageScreen" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#efdcff"/><stop offset=".45" stopColor="#a35dff"/><stop offset="1" stopColor="#3a1f62"/></linearGradient>
                      <linearGradient id="stageBeam" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#d8c1ff" stopOpacity=".5"/><stop offset="1" stopColor="#a78bfa" stopOpacity="0"/></linearGradient>
                      <filter id="stageGlow"><feGaussianBlur stdDeviation="8" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
                    </defs>
                    <g opacity=".7"><path d="m213 116-91 168h46l75-148Z" fill="url(#stageBeam)"/><path d="m467 116 91 168h-46l-75-148Z" fill="url(#stageBeam)"/><path d="m291 117-37 160h44l26-157Z" fill="url(#stageBeam)"/><path d="m389 117 37 160h-44l-26-157Z" fill="url(#stageBeam)"/></g>
                    <path d="m94 293 246-117 246 117-246 120Z" fill="url(#stageFloor)" stroke="#9272ba" strokeOpacity=".6" strokeWidth="2"/>
                    <path d="m112 294 102-49 71 34-102 51Z" fill="#fbbf24" fillOpacity={selectedZone.index === 0 ? ".78" : ".12"} stroke="#fcd34d" strokeOpacity={selectedZone.index === 0 ? ".95" : ".25"} strokeWidth="2"/>
                    <path d="m218 350 122-59 122 59-122 59Z" fill="#e879f9" fillOpacity={selectedZone.index === 1 ? ".72" : ".12"} stroke="#f0abfc" strokeOpacity={selectedZone.index === 1 ? ".95" : ".25"} strokeWidth="2"/>
                    <path d="m395 279 71-34 102 49-71 36Z" fill="#a78bfa" fillOpacity={selectedZone.index === 2 ? ".78" : ".12"} stroke="#c4b5fd" strokeOpacity={selectedZone.index === 2 ? ".95" : ".25"} strokeWidth="2"/>
                    <path d="m273 286 67-33 67 33-67 34Z" fill="#38bdf8" fillOpacity={selectedZone.index === 3 ? ".82" : ".12"} stroke="#7dd3fc" strokeOpacity={selectedZone.index === 3 ? ".95" : ".25"} strokeWidth="2"/>
                    <path d="m94 293 246 120v20L94 313Z" fill="#17111f" stroke="#57436e" strokeWidth="2"/><path d="m340 413 246-120v20L340 433Z" fill="#100c18" stroke="#49365f" strokeWidth="2"/>
                    <path d="m171 274 169-81 169 81-169 82Z" fill="#362746" stroke="#b89bdb" strokeOpacity=".8" strokeWidth="2"/>
                    <path d="m171 274 169 82v19l-169-82Z" fill="url(#stageDeck)"/><path d="m340 356 169-82v19l-169 82Z" fill="#30223f"/>
                    <path d="m265 273 75-35 75 35-75 37Z" fill="#71538c" stroke="#cbb2eb" strokeWidth="2"/><path d="m265 273 75 37v10l-75-37Z" fill="#3c2a50"/><path d="m340 310 75-37v10l-75 37Z" fill="#281d37"/>
                    <path d="m202 150 138-66 138 66v11H202Z" fill="#322443" stroke="#c6a7e8" strokeWidth="4"/><path d="m211 145 129-61 129 61" fill="none" stroke="#e2d0f8" strokeWidth="5"/>
                    <path d="m213 152v118m25-130v142m254-130v118m-25-130v142" fill="none" stroke="#a88dc6" strokeWidth="7"/>
                    <path d="m223 166 117-56 117 56-117 56Z" fill="url(#stageScreen)" stroke="#f0ddff" strokeWidth="3"/><path d="m242 165 98-47 98 47-98 47Z" fill="none" stroke="#f5eaff" strokeOpacity=".55" strokeWidth="2"/>
                    <path d="m193 157 294 0m-268 12 242 0" stroke="#e8d8ff" strokeOpacity=".8" strokeWidth="3"/>
                    <g fill="#f5e8ff" filter="url(#stageGlow)"><circle cx="225" cy="153" r="5"/><circle cx="277" cy="128" r="5"/><circle cx="340" cy="98" r="6"/><circle cx="403" cy="128" r="5"/><circle cx="455" cy="153" r="5"/></g>
                    <g><path d="m172 218 33-16 0 77-33 16Z" fill="#181220" stroke="#a88dc6" strokeWidth="2"/><path d="m177 228 23-11v17l-23 11Zm0 27 23-11v17l-23 11Z" fill="#9874bd"/><path d="m475 202 33 16v77l-33-16Z" fill="#100d16" stroke="#a88dc6" strokeWidth="2"/><path d="m480 217 23 11v17l-23-11Zm0 27 23 11v17l-23-11Z" fill="#9874bd"/></g>
                    <path d="m276 345 22 11v18l-22-11Zm128 0-22 11v18l22-11Z" fill="#ddd0ec" stroke="#8d72aa" strokeWidth="2"/>
                    <g fill="#d8c1ff" opacity=".8"><circle cx="148" cy="306" r="4"/><circle cx="174" cy="318" r="4"/><circle cx="200" cy="331" r="4"/><circle cx="226" cy="344" r="4"/><circle cx="252" cy="357" r="4"/><circle cx="532" cy="306" r="4"/><circle cx="506" cy="318" r="4"/><circle cx="480" cy="331" r="4"/><circle cx="454" cy="344" r="4"/><circle cx="428" cy="357" r="4"/></g>
                  </svg>
                </div>
              </div>
              <div className="relative mt-1 w-full max-w-[480px] border-t border-white/10 pt-3">
                <p className="mb-2 text-[9px] font-bold uppercase tracking-[.18em] text-violet-200">Pilih kategori area</p>
                <div className="grid grid-cols-2 gap-2">
                  {tickets.map((ticket, index) => <button key={ticket.name} type="button" aria-pressed={selectedTicket?.name === ticket.name} onClick={() => setSelectedTicketName(ticket.name)} className={`flex min-w-0 items-start gap-2 rounded-lg border px-2.5 py-2 text-left transition ${selectedTicket?.name === ticket.name ? "border-violet-200/60 bg-violet-300/15" : "border-white/10 bg-black/20 hover:border-white/25 hover:bg-white/[.06]"}`}>
                    <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-sm ${getTicketZone(ticket.name, index).index === 0 ? "bg-amber-300" : getTicketZone(ticket.name, index).index === 1 ? "bg-fuchsia-300" : getTicketZone(ticket.name, index).index === 2 ? "bg-violet-300" : "bg-sky-300"}`} />
                    <span className="min-w-0"><span className="block truncate text-[10px] font-bold text-white">{ticket.name}</span><span className="mt-0.5 block line-clamp-2 text-[9px] leading-4 text-white/55">{getTicketZone(ticket.name, index).label}</span></span>
                  </button>)}
                </div>
              </div>
              <p className="relative mt-1 text-center text-[10px] font-bold uppercase tracking-[.2em] text-white/65">Model ilustrasi · Tampilan dapat berbeda tiap event</p>
            </div>
            <div>
              <div className="mb-4 flex items-center justify-between gap-4"><div><h3 className="text-xl font-extrabold">Detail tiket pilihan</h3><p className="mt-1 text-xs text-[#777087]">Pilih kategori area di bawah panggung untuk melihat isi tiket.</p></div><span className="max-w-[40%] text-right text-[10px] font-semibold uppercase tracking-widest text-[#777087]">{event?.title || "Event pilihan"}</span></div>
              {selectedTicket ? <article className="rounded-2xl border border-violet-300 bg-white p-5 shadow-[0_18px_45px_-34px_rgba(98,57,150,.8)] sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-[10px] font-bold uppercase tracking-[.18em] text-violet-700">Kategori terpilih</p><h4 className="mt-1 text-2xl font-black text-[#171329]">{selectedTicket.name}</h4><p className="mt-2 text-2xl font-black text-violet-800">{formatCurrency(selectedTicket.price)}</p></div><Link href={eventHref} className="inline-flex items-center gap-2 rounded-full bg-violet-700 px-4 py-2.5 text-[10px] font-extrabold text-white transition hover:bg-violet-600">Pilih tiket <ArrowRight className="h-3.5 w-3.5"/></Link></div>
                <div className="mt-5 border-t border-[#eee8f4] pt-4"><p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-[#777087]">Lokasi area</p><p className="mb-4 text-xs font-semibold text-violet-800">{selectedZone.label}</p><p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-[#777087]">Yang termasuk</p>{selectedTicket.perks?.length ? <ul className="space-y-2.5">{selectedTicket.perks.map((perk) => <li key={perk} className="flex items-start gap-2.5 text-xs leading-5 text-[#656078]"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700"/>{perk}</li>)}</ul> : <p className="text-xs text-[#656078]">Detail fasilitas kategori ini tersedia di halaman event.</p>}</div>
              </article> : null}
              <p className="mt-4 text-[10px] leading-5 text-[#777087]">Harga dan ketersediaan tiket mengikuti informasi event.</p>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="audience-reviews-title" className="bg-[#100d20] px-5 py-16 text-white sm:px-10 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-5">
            <div><p className="text-xs font-bold uppercase tracking-[.24em] text-violet-300">Cerita penonton</p><h2 id="audience-reviews-title" className="mt-3 text-3xl font-black tracking-tight sm:text-5xl">Ulasan dari komunitas<span className="text-violet-300">.</span></h2><p className="mt-4 max-w-xl text-sm leading-7 text-white/55">Pengalaman penonton membantu orang lain menemukan acara yang tepat untuk mereka.</p></div>
            <span className="rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-violet-200">Contoh ulasan</span>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {sampleReviews.map((review, index) => <article key={review.category} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-violet-300/35 hover:bg-white/[.07] sm:p-6">
              <div aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-violet-400/10 blur-2xl transition group-hover:bg-violet-400/20" />
              <div className="relative flex items-center justify-between gap-3"><div className="flex gap-1" aria-label="Rating contoh 5 dari 5">{Array.from({ length: 5 }, (_, star) => <Star key={star} className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />)}</div><span className="font-mono text-[10px] text-white/35">0{index + 1}</span></div>
              <p className="relative mt-5 min-h-20 text-sm leading-6 text-white/75">&ldquo;{review.quote}&rdquo;</p>
              <div className="relative mt-5 flex items-center gap-3 border-t border-white/10 pt-4"><span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-300 to-fuchsia-400 text-xs font-black text-[#171129]">{review.initials}</span><div><p className="text-xs font-bold text-white">Penonton Tixora</p><p className="mt-0.5 text-[10px] text-white/45">{review.category}</p></div></div>
            </article>)}
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <MobileNav />
  </div>;
}
