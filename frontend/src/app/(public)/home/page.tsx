"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Music2,
  ShoppingBag,
  Ticket,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { EventCard } from "@/features/events/components/EventCard";
import { ArtistCard } from "@/features/artists/components/ArtistCard";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { fetchPopularArtists } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";
import { fetchMyOrders } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";
import { Loading } from "@/components/shared/Loading";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { useAuthStore } from "@/stores/authStore";

export default function HomePage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (hydrated && !user) router.replace("/login");
  }, [hydrated, router, user]);

  useEffect(() => {
    if (!hydrated || !user) return;
    let active = true;

    Promise.allSettled([
      fetchEvents({ limit: 6, sort: "asc" }),
      fetchPopularArtists(4),
      fetchMyOrders(),
    ])
      .then(([eventResult, artistResult, orderResult]) => {
        if (!active) return;
        const failures: string[] = [];
        if (eventResult.status === "fulfilled") setEvents(eventResult.value);
        else failures.push(getApiErrorMessage(eventResult.reason, "Jadwal konser gagal dimuat."));
        if (artistResult.status === "fulfilled") setArtists(artistResult.value);
        else failures.push(getApiErrorMessage(artistResult.reason, "Daftar artis gagal dimuat."));
        if (orderResult.status === "fulfilled") setOrders(orderResult.value);
        else failures.push(getApiErrorMessage(orderResult.reason, "Ringkasan pesanan gagal dimuat."));
        setLoadError(failures.join(" "));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hydrated, reloadKey, user]);

  const nextEvent = useMemo(() => {
    return (
      events
        .filter((event) => event.status === "open")
        .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())[0] ||
      events[0]
    );
  }, [events]);
  const paidOrders = orders.filter((order) => order.status === "paid");
  const ticketCount = paidOrders.reduce(
    (total, order) => total + (order.order_items || []).reduce((count, item) => count + item.qty, 0),
    0,
  );

  if (!hydrated || !user || loading) {
    return (
      <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pt-24">
          <Loading message="Menyiapkan beranda konsermu..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="landing-page min-h-screen bg-[#f7f4fa] text-[#071653] selection:bg-[#c8b7db]/60">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        {loadError ? (
          <div role="alert" className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900">
            <p>{loadError}</p>
            <button type="button" onClick={() => { setLoading(true); setLoadError(""); setReloadKey((key) => key + 1); }} className="font-bold underline underline-offset-2">
              Muat ulang
            </button>
          </div>
        ) : null}
        <section className="grid gap-5 lg:grid-cols-[1.05fr_.95fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-[#071653] p-7 text-white shadow-[0_28px_70px_-38px_rgba(7,22,83,.6)] sm:p-10">
            <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#6264b5]/35 blur-3xl" />
            <div className="absolute -bottom-36 left-1/4 h-64 w-64 rounded-full bg-[#c8b7db]/20 blur-3xl" />
            <div className="relative">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.18em] text-[#e5d9f0]">
                <Music2 className="h-3.5 w-3.5" />
                Ruang konsermu
              </span>
              <h1 className="mt-6 max-w-xl text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
                Hai, {user.name.split(" ")[0] || "Teman"}.
                <span className="mt-1 block font-display font-normal text-[#d9c8e8]">
                  Siap untuk momen berikutnya?
                </span>
              </h1>
              <p className="mt-5 max-w-lg text-sm leading-7 text-white/70">
                Jadwal pilihan, pesanan, dan tiket konser tersusun rapi dalam satu tempat.
                Tinggal pilih panggung yang ingin kamu datangi.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="/home/events"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#c8b7db] px-5 py-3 text-xs font-extrabold text-[#071653] transition hover:bg-[#e2d5ec]"
                >
                  Jelajahi konser <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/tickets"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-xs font-bold text-white transition hover:bg-white/10"
                >
                  <Ticket className="h-4 w-4" /> Tiket saya
                </Link>
              </div>
              <div className="mt-9 grid max-w-md grid-cols-2 gap-3 border-t border-white/15 pt-5">
                <Link href="/orders" className="rounded-xl bg-white/[.07] p-3 transition hover:bg-white/[.12]">
                  <p className="text-2xl font-extrabold">{orders.length}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">Pesanan</p>
                </Link>
                <Link href="/tickets" className="rounded-xl bg-white/[.07] p-3 transition hover:bg-white/[.12]">
                  <p className="text-2xl font-extrabold">{ticketCount}</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/60">Tiket aktif</p>
                </Link>
              </div>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-[2rem] border border-[#e8e5ef] bg-[#e8e2f0]">
            {nextEvent?.poster ? (
              <Image
                src={resolveMediaUrl(nextEvent.poster)}
                alt={nextEvent.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,#c8b7db,transparent_38%),linear-gradient(135deg,#071653,#6264b5)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#071653]/95 via-[#071653]/20 to-transparent" />
            <div className="absolute left-5 top-5 rounded-full border border-white/25 bg-[#071653]/45 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-white backdrop-blur">
              Pilihan untukmu
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-8">
              {nextEvent ? (
                <>
                  <p className="text-xs font-semibold uppercase tracking-wider text-[#e2d5eb]">
                    {nextEvent.genre || "Live music"}
                  </p>
                  <h2 className="mt-2 max-w-xl text-3xl font-extrabold leading-tight">{nextEvent.title}</h2>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-white/80">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="h-3.5 w-3.5" />
                      {formatEventDate(nextEvent.event_date, { day: "numeric", month: "long", year: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" /> {nextEvent.venue || nextEvent.location}
                    </span>
                  </div>
                  <Link
                    href={`/home/events/${nextEvent.id}`}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#fffdf2] px-4 py-2.5 text-xs font-bold text-[#071653] transition hover:bg-[#f3edf7]"
                  >
                    Lihat detail <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold">Panggung berikutnya menantimu</h2>
                  <p className="mt-2 text-sm text-white/75">Jelajahi katalog untuk menemukan jadwal terbaru.</p>
                  <Link href="/home/events" className="mt-5 inline-flex rounded-lg bg-[#fffdf2] px-4 py-2.5 text-xs font-bold text-[#071653]">
                    Lihat semua konser
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">Kurasi Tixora</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Konser yang akan datang</h2>
            </div>
            <Link href="/home/events" className="inline-flex items-center gap-1 text-xs font-bold text-[#6264b5] hover:text-[#071653]">
              Semua konser <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {events.length ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {events.slice(0, 3).map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-[#c8b7db] bg-[#fffdf2] p-8 text-center text-sm text-[#5c6482]">
              Belum ada konser yang tersedia.
            </p>
          )}
        </section>

        <section className="mt-14">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">Lineup pilihan</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">Kenali para artis</h2>
            </div>
            <Link href="/home/artists" className="inline-flex items-center gap-1 text-xs font-bold text-[#6264b5] hover:text-[#071653]">
              Semua artis <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          {artists.length ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {artists.map((artist) => <ArtistCard key={artist.id} artist={artist} />)}
            </div>
          ) : (
            <p className="rounded-2xl border border-dashed border-[#c8b7db] bg-[#fffdf2] p-8 text-center text-sm text-[#5c6482]">
              Belum ada artis yang ditampilkan.
            </p>
          )}
        </section>

        <section className="mt-12 flex flex-col gap-5 rounded-3xl border border-[#e8e5ef] bg-[#fffdf2] p-6 shadow-[0_18px_48px_-38px_rgba(7,22,83,.32)] sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eeebf4] text-[#6264b5]">
              <ShoppingBag className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-bold">Pantau perjalanan konsermu</h2>
              <p className="mt-1 text-sm text-[#5c6482]">Cek status pembayaran, invoice, dan e-ticket kapan saja.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href="/orders" className="rounded-xl border border-[#e8e5ef] px-4 py-2.5 text-xs font-bold text-[#071653] hover:border-[#c8b7db]">
              Pesanan
            </Link>
            <Link href="/tickets" className="rounded-xl bg-[#6264b5] px-4 py-2.5 text-xs font-bold text-white hover:bg-[#51539f]">
              Tiket saya
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
