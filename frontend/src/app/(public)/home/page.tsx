"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, ChevronRight, Clock3, Heart, MapPin, Sparkles, Ticket, WalletCards } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { fetchMyOrders } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";
import { fetchProfile } from "@/features/profile/api";
import type { UserProfile } from "@/features/profile/types";
import { fetchEvents, MOCK_EVENTS } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { useAuthStore } from "@/stores/authStore";

function StatusPill({ status }: { status: Order["status"] }) {
  const labels: Record<Order["status"], string> = { paid: "Paid", pending: "Awaiting payment", rejected: "Rejected", cancelled: "Cancelled" };
  const colors: Record<Order["status"], string> = { paid: "border-emerald-200 bg-emerald-50 text-emerald-700", pending: "border-amber-200 bg-amber-50 text-amber-700", rejected: "border-rose-200 bg-rose-50 text-rose-700", cancelled: "border-slate-200 bg-slate-50 text-slate-500" };
  return <span className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${colors[status]}`}>{labels[status]}</span>;
}

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated || !user) return;
    let active = true;
    Promise.all([fetchProfile(), fetchMyOrders(), fetchEvents()]).then(([nextProfile, nextOrders, nextEvents]) => {
      if (!active) return;
      setProfile(nextProfile);
      setOrders(nextOrders);
      setEvents(nextEvents);
    }).catch(() => undefined).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [hydrated, user]);

  const displayName = profile?.name || user?.name || "Tamu";
  const nextEvent = events.find((event) => event.status === "open") || events[0] || MOCK_EVENTS[0];
  const paidOrders = orders.filter((order) => order.status === "paid").length;
  const ticketCount = profile?.tickets_count ?? paidOrders;
  const orderCount = profile?.orders_count ?? orders.length;

  if (!hydrated || (user && loading)) {
    return <div className="min-h-screen bg-[#f4f8ff] text-[#102a43]"><Navbar /><main className="flex min-h-[70vh] items-center justify-center pt-24"><div className="text-center"><div className="mx-auto h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" /><p className="mt-4 text-sm text-[#6683a3]">Menyiapkan ruang konsermu...</p></div></main></div>;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-[#f4f8ff] text-[#102a43]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40 lg:pb-32">
        <section className="relative overflow-hidden rounded-[32px] border border-[#bfdbfe] bg-white px-6 py-8 shadow-[0_25px_80px_-48px_rgba(37,99,235,.4)] sm:px-10 sm:py-10 lg:px-14 lg:py-14">
          <div className="pointer-events-none absolute -right-24 -top-40 h-[440px] w-[440px] rounded-full bg-blue-200/45 blur-3xl" />
          <div className="relative grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div><div className="luxury-eyebrow"><Sparkles className="h-3.5 w-3.5" />Your concert home</div><h1 className="mt-5 max-w-2xl font-display text-5xl leading-[0.98] tracking-[-0.05em] text-[#123b6d] sm:text-6xl">Selamat datang, {displayName.split(" ")[0]}.</h1><p className="mt-5 max-w-xl text-sm leading-7 text-[#6683a3]">Semua momen konsermu ada di satu tempat. Temukan inspiration berikutnya, cek pesanan, dan bersiap untuk malam yang layak dikenang.</p><div className="mt-8 flex flex-wrap gap-3"><Link href="/events" className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2563eb] px-5 text-xs font-semibold text-white transition hover:bg-[#1d4ed8]">Find your next event <ArrowUpRight className="h-3.5 w-3.5" /></Link><Link href="/orders" className="inline-flex h-11 items-center gap-2 rounded-xl border border-[#bfdbfe] px-5 text-xs font-medium text-[#17457f] transition hover:border-[#2563eb] hover:text-[#1d4ed8]">View orders <ChevronRight className="h-3.5 w-3.5" /></Link></div></div>
            <div className="flex items-center gap-4 lg:justify-end"><div className="relative h-28 w-28 overflow-hidden rounded-[24px] border border-[#bfdbfe] bg-blue-50 sm:h-32 sm:w-32"><Image src={resolveMediaUrl(nextEvent.poster || "/globe.svg")} alt={nextEvent.title} fill sizes="128px" className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#0b2a4a]/70 to-transparent" /><span className="absolute bottom-3 left-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-white">Up next</span></div><div><p className="text-[10px] uppercase tracking-[0.18em] text-[#8aa4c1]">Next on your radar</p><Link href={`/events/${nextEvent.id}`} className="mt-2 block max-w-[210px] font-display text-xl leading-tight text-[#123b6d] transition hover:text-[#2563eb]">{nextEvent.title}</Link><p className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#6683a3]"><CalendarDays className="h-3.5 w-3.5 text-[#2563eb]" />{formatEventDate(nextEvent.event_date)}</p></div></div>
          </div>
        </section>

        {!user && <div className="mt-5 flex flex-col justify-between gap-4 rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4 sm:flex-row sm:items-center"><p className="text-sm text-[#476b91]">Masuk untuk melihat pesanan dan tiket digitalmu.</p><Link href="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-[#2563eb]">Go to login <ArrowUpRight className="h-4 w-4" /></Link></div>}

        <section className="mt-10 grid gap-4 sm:grid-cols-3">{[
          { label: "Digital tickets", value: ticketCount, icon: Ticket, href: "/tickets" },
          { label: "Total orders", value: orderCount, icon: WalletCards, href: "/orders" },
          { label: "Saved moments", value: profile?.favorite_genre || "Your next pick", icon: Heart, href: "/events" },
        ].map(({ label: statLabel, value, icon: Icon, href }) => <Link key={statLabel} href={href} className="luxury-panel luxury-panel-hover group rounded-2xl bg-white p-5"><div className="flex items-center justify-between"><span className="text-xs text-[#6683a3]">{statLabel}</span><Icon className="h-4 w-4 text-[#2563eb]" /></div><p className="mt-5 truncate font-display text-2xl text-[#123b6d]">{value}</p><span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.15em] text-[#8aa4c1] transition group-hover:text-[#2563eb]">Open <ArrowUpRight className="h-3 w-3" /></span></Link>)}</section>

        <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div><div className="flex items-end justify-between gap-4"><div><div className="luxury-eyebrow"><Clock3 className="h-3.5 w-3.5" />Your activity</div><h2 className="mt-3 font-display text-3xl text-[#123b6d]">Recent orders</h2></div><Link href="/orders" className="text-xs text-[#2563eb] transition hover:text-[#1d4ed8]">See all</Link></div><div className="mt-6 space-y-3">{orders.length > 0 ? orders.slice(0, 3).map((order) => <Link key={order.id} href={`/orders/${order.id}`} className="luxury-panel luxury-panel-hover flex items-center gap-4 rounded-2xl bg-white p-4"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-[#2563eb]"><Ticket className="h-5 w-5" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#17457f]">{order.events?.title || "Concert order"}</p><p className="mt-1 text-xs text-[#8aa4c1]">{order.order_code} · {formatCurrency(order.total)}</p></div><StatusPill status={order.status} /></Link>) : <div className="rounded-2xl border border-dashed border-[#bfdbfe] bg-white/60 px-5 py-10 text-center"><p className="text-sm text-[#6683a3]">Belum ada pesanan.</p><Link href="/events" className="mt-3 inline-flex text-xs font-semibold text-[#2563eb]">Temukan konser pertamamu <ArrowUpRight className="ml-1 h-3.5 w-3.5" /></Link></div>}</div></div>
          <div><div className="luxury-eyebrow"><MapPin className="h-3.5 w-3.5" />Curated for you</div><h2 className="mt-3 font-display text-3xl text-[#123b6d]">Keep exploring</h2><div className="mt-6 space-y-3">{events.slice(0, 3).map((event) => <Link key={event.id} href={`/events/${event.id}`} className="group flex items-center gap-4 rounded-2xl border border-[#dbeafe] bg-white p-3 transition hover:border-[#93c5fd] hover:bg-blue-50"><div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-blue-50"><Image src={resolveMediaUrl(event.poster || "/globe.svg")} alt={event.title} fill sizes="80px" className="object-cover transition group-hover:scale-105" /></div><div className="min-w-0 flex-1"><p className="truncate text-sm font-medium text-[#17457f]">{event.title}</p><p className="mt-1 text-xs text-[#8aa4c1]">{formatEventDate(event.event_date)} · {event.location}</p></div><ChevronRight className="h-4 w-4 shrink-0 text-[#8aa4c1] transition group-hover:translate-x-0.5 group-hover:text-[#2563eb]" /></Link>)}</div></div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
