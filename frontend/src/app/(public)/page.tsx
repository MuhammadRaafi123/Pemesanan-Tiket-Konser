"use client";

import { FormEvent, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  CalendarDays,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchPopularArtists, MOCK_ARTISTS } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";
import { fetchEvents, MOCK_EVENTS } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency, formatEventDate, formatEventTime } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";

function EditorialEventCard({ event }: { event: Event }) {
  const lowestPrice = event.ticket_categories?.length
    ? Math.min(...event.ticket_categories.map((category) => category.price))
    : null;

  return (
    <Link href={`/events/${event.id}`} className="luxury-panel luxury-panel-hover group block overflow-hidden rounded-[26px]">
      <div className="relative aspect-[1.35] overflow-hidden bg-[#dbeafe]">
        <Image src={resolveMediaUrl(event.poster || "/globe.svg")} alt={event.title} fill sizes="(max-width: 768px) 100vw, (max-width: 1100px) 50vw, 33vw" className="object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b2a4a]/90 via-[#0b2a4a]/10 to-transparent" />
        <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/85 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#17457f] shadow-sm backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />
          {event.status === "open" ? "Tickets available" : "Closed"}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
          <div>
            <p className="text-[10px] uppercase tracking-[0.18em] text-blue-100">{event.artists?.name || "Live experience"}</p>
            <h3 className="mt-1 max-w-[250px] font-display text-xl leading-tight text-white">{event.title}</h3>
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white backdrop-blur-md transition group-hover:bg-[#2563eb] group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 px-5 py-4 text-xs text-[#6683a3]">
        <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-[#2563eb]" />{formatEventDate(event.event_date)}</span>
        <span>{lowestPrice ? `Mulai ${formatCurrency(lowestPrice)}` : "Lihat detail"}</span>
      </div>
    </Link>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([fetchEvents(), fetchPopularArtists(8)]).then(([nextEvents, nextArtists]) => {
      if (!active) return;
      setEvents(nextEvents);
      setArtists(nextArtists);
    });
    return () => { active = false; };
  }, []);

  const openEvents = events.filter((event) => event.status === "open");
  const featuredEvent = openEvents[0] || events[0] || MOCK_EVENTS[0];
  const featuredArtist = featuredEvent.artists?.name || "Your next favorite artist";

  const submitSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedQuery = query.trim();
    if (normalizedQuery) router.push(`/events?q=${encodeURIComponent(normalizedQuery)}`);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f8ff] text-[#102a43]">
      <Navbar />
      <main>
        <section className="relative px-5 pb-20 pt-36 sm:px-8 sm:pt-44 lg:px-12 lg:pb-28">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_22%,rgba(37,99,235,.14),transparent_31%),radial-gradient(circle_at_15%_68%,rgba(96,165,250,.12),transparent_34%)]" />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[620px] opacity-70 [background-image:linear-gradient(rgba(37,99,235,.045)_1px,transparent_1px),linear-gradient(90deg,rgba(37,99,235,.045)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.88fr] lg:gap-20">
            <div className="max-w-2xl">
              <div className="luxury-eyebrow"><span className="h-1.5 w-1.5 rounded-full bg-[#2563eb]" />The art of live, curated for you</div>
              <h1 className="mt-7 max-w-3xl font-display text-5xl leading-[0.98] tracking-[-0.055em] text-[#123b6d] sm:text-7xl lg:text-[88px]">Make a night <span className="block text-[#2563eb]">worth remembering.</span></h1>
              <p className="mt-7 max-w-xl text-base leading-8 text-[#5c789b] sm:text-lg">Temukan konser yang tepat, pilih pengalaman terbaik, dan bawa momen live-mu lebih dekat—dengan tiket resmi yang tidak pernah mengecewakan.</p>

              <form onSubmit={submitSearch} className="mt-9 flex max-w-xl items-center gap-2 rounded-2xl border border-[#bfdbfe] bg-white p-2 shadow-[0_20px_60px_-35px_rgba(37,99,235,.45)] focus-within:border-[#2563eb]">
                <Search className="ml-3 h-4 w-4 shrink-0 text-[#2563eb]" />
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search artists, cities, or events" className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm text-[#102a43] outline-none placeholder:text-[#8aa4c1]" aria-label="Search artists, cities, or events" />
                <button type="submit" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-xl bg-[#2563eb] px-4 text-xs font-semibold text-white transition hover:bg-[#1d4ed8] sm:px-5">Explore <ArrowUpRight className="h-3.5 w-3.5" /></button>
              </form>

              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-[#6683a3]">
                <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#2563eb]" />Verified official tickets</span>
                <span className="inline-flex items-center gap-2"><Ticket className="h-3.5 w-3.5 text-[#2563eb]" />Instant digital delivery</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[520px] lg:ml-auto">
              <div className="absolute -inset-8 rounded-full bg-[#60a5fa]/20 blur-3xl" />
              <div className="luxury-panel relative overflow-hidden rounded-[34px] p-3 shadow-[0_40px_100px_-48px_rgba(37,99,235,.45)]">
                <div className="relative aspect-[0.86] overflow-hidden rounded-[26px] bg-[#dbeafe]">
                  <Image src={resolveMediaUrl(featuredEvent.poster || "/globe.svg")} alt={featuredEvent.title} fill priority loading="eager" sizes="(max-width: 1024px) 90vw, 520px" className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b2a4a]/90 via-[#0b2a4a]/10 to-transparent" />
                  <div className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 py-2 text-[10px] uppercase tracking-[0.2em] text-white backdrop-blur-md"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#60a5fa]" />Featured live</div>
                  <div className="absolute inset-x-6 bottom-6">
                    <p className="text-[10px] uppercase tracking-[0.2em] text-blue-100">{featuredArtist}</p>
                    <h2 className="mt-2 max-w-sm font-display text-3xl leading-tight tracking-[-0.03em] text-white sm:text-4xl">{featuredEvent.title}</h2>
                    <div className="mt-5 flex flex-wrap gap-4 text-xs text-blue-50"><span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatEventDate(featuredEvent.event_date)}</span><span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{featuredEvent.location}</span></div>
                    <Link href={`/events/${featuredEvent.id}`} className="mt-6 inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-xs font-semibold text-[#17457f] transition hover:bg-blue-100">View event <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -left-5 hidden items-center gap-3 rounded-2xl border border-[#bfdbfe] bg-white/90 px-4 py-3 shadow-xl shadow-blue-200/40 backdrop-blur-xl sm:flex"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-100 text-[#2563eb]"><Clock3 className="h-4 w-4" /></span><div><p className="text-[10px] uppercase tracking-[0.16em] text-[#8aa4c1]">Doors open</p><p className="mt-0.5 text-sm font-medium text-[#17457f]">{formatEventTime(featuredEvent.event_date)} WIB</p></div></div>
            </div>
          </div>
        </section>

        <section className="border-y border-[#dbeafe] bg-white/70">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-[#dbeafe] px-5 sm:px-8 lg:grid-cols-4">
            {[{ value: `${openEvents.length || 0}+`, label: "Upcoming nights" }, { value: `${artists.length || 0}+`, label: "Artists to discover" }, { value: "100%", label: "Verified tickets" }, { value: "24/7", label: "Your concert wallet" }].map((stat) => <div key={stat.label} className="px-4 py-7 first:pl-0 last:pr-0 sm:px-7 sm:py-9"><p className="font-display text-3xl tracking-[-0.04em] text-[#2563eb] sm:text-4xl">{stat.value}</p><p className="mt-2 text-[10px] uppercase tracking-[0.18em] text-[#8aa4c1]">{stat.label}</p></div>)}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end"><div><div className="luxury-eyebrow"><Sparkles className="h-3.5 w-3.5" />The edit</div><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-[#123b6d] sm:text-5xl">Moments worth leaving home for.</h2><p className="mt-4 max-w-xl text-sm leading-7 text-[#6683a3]">A tighter selection of live experiences, updated from the Concertix catalog.</p></div><Link href="/events" className="group inline-flex items-center gap-2 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]">See all events <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></Link></div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{openEvents.length > 0 ? openEvents.slice(0, 3).map((event) => <EditorialEventCard key={event.id} event={event} />) : <div className="luxury-panel col-span-full rounded-[26px] px-6 py-14 text-center"><p className="font-display text-2xl text-[#123b6d]">The next headline is almost here.</p><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#6683a3]">Belum ada event terbuka saat ini. Cek kembali nanti atau lihat semua halaman konser.</p><Link href="/events" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-[#2563eb]">Browse catalog <ArrowUpRight className="h-3.5 w-3.5" /></Link></div>}</div>
        </section>

        <section className="border-y border-[#dbeafe] bg-[#eaf3ff]">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center lg:py-32">
            <div><div className="luxury-eyebrow"><Users className="h-3.5 w-3.5" />The people on stage</div><h2 className="mt-4 font-display text-4xl tracking-[-0.04em] text-[#123b6d] sm:text-5xl">Find your new favorite sound.</h2><p className="mt-5 max-w-md text-sm leading-7 text-[#6683a3]">Dari panggung intimate sampai festival terbesar, temukan artis yang membuat setiap pilihan tiket terasa tepat.</p><Link href="/artists" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[#2563eb] transition hover:text-[#1d4ed8]">Explore artists <ChevronRight className="h-4 w-4" /></Link></div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{artists.slice(0, 4).map((artist) => <Link key={artist.id} href={`/artists/${artist.id}`} className="group text-center"><div className="relative aspect-square overflow-hidden rounded-[24px] border border-[#bfdbfe] bg-white"><Image src={resolveMediaUrl(artist.photo || "/globe.svg")} alt={artist.name} fill sizes="(max-width: 640px) 45vw, 20vw" className="object-cover grayscale-[20%] transition duration-500 group-hover:scale-105 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b2a4a]/65 to-transparent" /><span className="absolute bottom-3 left-3 text-left text-xs font-medium text-white">{artist.name}</span></div><p className="mt-3 text-[10px] uppercase tracking-[0.14em] text-[#6683a3]">{artist.genre || "Live artist"}</p></Link>)}</div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:py-32"><div className="grid gap-5 lg:grid-cols-3">{[{ number: "01", icon: Search, title: "Discover", text: "Browse event dan artis yang sedang menciptakan momen yang selalu ingin kamu tonton." }, { number: "02", icon: Ticket, title: "Reserve", text: "Pilih kategori tiket, selesaikan checkout, dan dapatkan order code yang aman." }, { number: "03", icon: Heart, title: "Remember", text: "Unggah bukti pembayaran dan simpan QR ticket setelah disetujui." }].map(({ number, icon: Icon, title, text }) => <div key={number} className="luxury-panel luxury-panel-hover rounded-[26px] p-7"><div className="flex items-center justify-between"><span className="font-display text-4xl text-[#2563eb]/45">{number}</span><Icon className="h-5 w-5 text-[#2563eb]" /></div><h3 className="mt-12 font-display text-2xl text-[#123b6d]">{title}</h3><p className="mt-3 text-sm leading-7 text-[#6683a3]">{text}</p></div>)}</div></section>

        <section className="px-5 pb-24 sm:px-8 lg:pb-32"><div className="luxury-panel relative mx-auto max-w-7xl overflow-hidden rounded-[32px] bg-white px-6 py-14 sm:px-12 sm:py-20"><div className="pointer-events-none absolute -right-24 -top-32 h-96 w-96 rounded-full bg-blue-200/45 blur-3xl" /><div className="relative grid gap-10 lg:grid-cols-[1fr_auto] lg:items-end"><div className="max-w-2xl"><Quote className="h-8 w-8 text-[#2563eb]" /><h2 className="mt-6 font-display text-4xl leading-tight tracking-[-0.04em] text-[#123b6d] sm:text-6xl">The best nights don’t need to be complicated.</h2><p className="mt-5 max-w-xl text-sm leading-7 text-[#6683a3]">Buat account, simpan semua momenmu, dan biarkan Concertix yang mengurus bagian yang membingungkan.</p></div><div className="flex flex-wrap gap-3"><Link href="/register" className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#2563eb] px-6 text-sm font-semibold text-white transition hover:bg-[#1d4ed8]">Create account <ArrowUpRight className="h-4 w-4" /></Link><Link href="/login" className="inline-flex h-12 items-center rounded-xl border border-[#bfdbfe] px-6 text-sm font-medium text-[#17457f] transition hover:border-[#2563eb] hover:text-[#1d4ed8]">I already have an account</Link></div></div></div></section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
