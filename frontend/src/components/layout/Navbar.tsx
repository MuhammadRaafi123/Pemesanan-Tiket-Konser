"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  Home,
  LogIn,
  MapPin,
  Music2,
  Search,
  ShoppingBag,
  Ticket,
  UserPlus,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { UserMenu } from "@/components/layout/UserMenu";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { fetchEvents } from "@/features/events/api";
import type { Event } from "@/features/events/types";
import { fetchPopularArtists } from "@/features/artists/api";
import type { Artist } from "@/features/artists/types";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isLanding = pathname === "/";
  const isMemberPage =
    pathname.startsWith("/home") ||
    pathname.startsWith("/tickets") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/payments");
  const isCatalog =
    pathname.startsWith("/events") ||
    pathname.startsWith("/artists") ||
    pathname.startsWith("/home/events") ||
    pathname.startsWith("/home/artists");
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendedEvents, setRecommendedEvents] = useState<Event[]>([]);
  const [recommendedArtists, setRecommendedArtists] = useState<Artist[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const isLightChrome = isCatalog || isMemberPage || (isLanding && scrolled);
  const isLightSearch = isLightChrome || isLanding;
  const usesPurpleChrome = isLanding || isCatalog || isMemberPage;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!searchOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSearchOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [searchOpen]);

  useEffect(() => {
    if (!searchOpen || recommendedEvents.length || recommendedArtists.length) return;
    let active = true;
    setLoadingRecommendations(true);
    Promise.all([fetchEvents({ limit: 100, sort: "asc" }), fetchPopularArtists(4)])
      .then(([events, artists]) => {
        if (!active) return;
        const upcoming = events.filter(
          (event) => event.status === "open" && new Date(event.event_date).getTime() >= Date.now(),
        );
        setRecommendedEvents(upcoming.slice(0, 4));
        setRecommendedArtists(artists.slice(0, 4));
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoadingRecommendations(false);
      });
    return () => { active = false; };
  }, [searchOpen, recommendedEvents.length, recommendedArtists.length]);

  const navLinks = [
    { label: user ? "Untukmu" : "Beranda", href: user ? "/home" : "/", icon: user ? Compass : Home },
    { label: "Konser", href: user ? "/home/events" : "/events", icon: Ticket },
    { label: "Artis", href: user ? "/home/artists" : "/artists", icon: CalendarDays },
    ...(user
      ? [
          { label: "Tiket saya", href: "/tickets", icon: Ticket },
          { label: "Pesanan", href: "/orders", icon: ShoppingBag },
        ]
      : []),
  ];

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`${user ? "/home/events" : "/events"}?q=${encodeURIComponent(query)}`);
  };

  const openRecommendation = (href: string) => {
    setSearchOpen(false);
    router.push(href);
  };

  const fillSearch = (value: string) => setSearchQuery(value);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? usesPurpleChrome
              ? "border-b border-[#c8b7db]/40 bg-[#fffdf2]/85 py-2.5 shadow-lg shadow-[#071653]/05 backdrop-blur-2xl"
              : "border-b border-[#232733]/80 bg-[#07090e]/85 py-2.5 shadow-2xl shadow-black/50 backdrop-blur-2xl"
            : isLanding
              ? "border-b border-transparent bg-gradient-to-b from-[#070914]/80 via-[#070914]/30 to-transparent py-4 backdrop-blur-[2px]"
              : isLightChrome
                ? "border-b border-[#c8b7db]/40 bg-[#fffdf2]/90 py-2.5 shadow-lg shadow-[#071653]/05 backdrop-blur-2xl"
              : "border-b border-transparent py-4"
        }`}
      >
        <ScrollProgress className={scrolled ? "opacity-100" : "opacity-0"} />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <BrandMark
            href={user ? "/home" : "/"}
          />

          {/* Desktop Nav */}
          <nav
            className={`hidden items-center gap-1.5 rounded-full border p-1.5 backdrop-blur-2xl transition-all duration-300 md:flex ${
              isLightChrome
                ? "border-[#c8b7db]/50 bg-[#fffdf2] shadow-sm shadow-[#071653]/05"
                : isLanding
                  ? "border-white/15 bg-black/40 shadow-xl shadow-black/25"
                : "border-[#2a2e3d]/70 bg-[#121624]/80 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            }`}
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                pathname === link.href ||
                (link.href !== "/" && link.href !== "/home" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group/nav relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all duration-300 ${
                    isActive
                      ? isLanding && !scrolled && !isCatalog ? "text-white" : "text-[#0b0e15]"
                      : isLightChrome
                        ? "text-[#071653]/75 hover:text-[#071653] hover:bg-[#6264b5]/10"
                        : isLanding
                          ? "text-white/80 hover:text-white hover:bg-white/10"
                        : "text-[#a0a7ba] hover:text-[#ffffff] hover:bg-white/[0.06]"
                  }`}
                >
                  {isActive ? (
                    <span
                      className={`absolute inset-0 -z-10 rounded-full transition-all duration-300 ${
                        usesPurpleChrome
                          ? "bg-gradient-to-r from-[#6264b5] via-[#7577cf] to-[#6264b5] shadow-[0_4px_16px_rgba(98,100,181,0.45)]"
                          : "bg-gradient-to-r from-[#ffb703] to-[#e5a000] shadow-[0_8px_18px_-8px_rgba(255,183,3,.7)]"
                      }`}
                    />
                  ) : null}
                  <Icon className={`h-3.5 w-3.5 transition-transform duration-300 group-hover/nav:scale-110 ${isActive ? (isLanding && !scrolled && !isCatalog ? "text-white" : "text-[#0b0e15]") : ""}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className={`press flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 ${
                isLightChrome
                  ? "border-[#c8b7db]/50 bg-[#fffdf2] text-[#071653] hover:border-[#6264b5] hover:text-[#6264b5] shadow-sm"
                  : isLanding
                    ? "border-white/15 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-xl shadow-lg shadow-black/20"
                    : "border-[#2a2e3d]/60 bg-[#121624]/75 text-[#c8d0e7] hover:border-[#ffb703]/50 hover:text-[#ffb703]"
              }`}
              aria-label="Cari konser"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/checkout"
              className={`press relative flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 ${
                isLightChrome
                  ? "border-[#c8b7db]/50 bg-[#fffdf2] text-[#071653] hover:border-[#6264b5] hover:text-[#6264b5] shadow-sm"
                  : isLanding
                    ? "border-white/15 bg-white/10 text-white hover:bg-white/20 hover:border-white/30 backdrop-blur-xl shadow-lg shadow-black/20"
                    : "border-[#2a2e3d]/60 bg-[#121624]/75 text-[#c8d0e7] hover:border-[#ffb703]/50 hover:text-[#ffb703]"
              }`}
              aria-label="Keranjang tiket"
            >
              <ShoppingBag className="h-4 w-4" />
              {totalCartItems > 0 ? (
                <span
                  className={`absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[0.55rem] font-bold shadow-md animate-pulse ${
                    usesPurpleChrome ? "bg-[#6264b5] text-[#fffdf2]" : "bg-[#ffb703] text-[#0b0e15]"
                  }`}
                >
                  {totalCartItems}
                </span>
              ) : null}
            </Link>

            {user ? (
              <UserMenu />
            ) : hydrated ? (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/login"
                  className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-xs font-semibold transition-all duration-300 hover:scale-[1.02] ${
                    isLightChrome
                      ? "text-[#071653] hover:text-[#6264b5] hover:bg-[#6264b5]/08"
                      : isLanding
                        ? "text-white/90 hover:text-white hover:bg-white/10"
                      : "text-[#a0a7ba] hover:text-[#ffb703]"
                  }`}
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className={`inline-flex h-10 items-center gap-2 rounded-full px-5 text-xs font-bold transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-95 ${
                    usesPurpleChrome
                      ? "bg-gradient-to-r from-[#6264b5] via-[#7577cf] to-[#6264b5] text-[#fffdf2] shadow-lg shadow-[#6264b5]/35 hover:shadow-[0_8px_24px_rgba(98,100,181,0.55)] hover:brightness-110"
                      : "bg-gradient-to-r from-[#ffb703] to-[#e5a000] text-[#0b0e15] shadow-[#ffb703]/25 hover:shadow-[#ffb703]/40"
                  }`}
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Daftar
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      {searchOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-28">
          <button
            type="button"
            aria-label="Tutup pencarian"
            onClick={() => setSearchOpen(false)}
            className={`absolute inset-0 cursor-default backdrop-blur-md ${
              isLightSearch ? "bg-[#071653]/20" : "bg-[#07090e]/85"
            }`}
            style={{ animation: "page-enter 240ms ease both" }}
          />
          <div
            className={`relative w-full max-w-xl rounded-2xl border p-5 shadow-xl sm:p-6 ${
              isLightSearch
                ? "border-[#e6e0ef] bg-white text-[#071653]"
                : "border-[#2a2e3d]/70 bg-[#0d111c]/95 text-white"
            }`}
          >
            <div className="mb-6 flex items-center justify-between">
              <div className={`flex items-center gap-2 text-sm font-semibold ${isLightSearch ? "text-[#6264b5]" : "text-[#ffb703]"}`}>
                <Compass className="h-4 w-4" />
                Cari konser
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className={`rounded-full p-2 transition ${
                  isLightSearch
                    ? "text-[#071653]/60 hover:bg-[#c8b7db]/20 hover:text-[#071653]"
                    : "text-[#c8b7db] hover:bg-[#6264b5]/20 hover:text-[#fffdf2]"
                }`}
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={submitSearch}
              className={`flex items-center gap-3 rounded-xl border px-3 py-2 transition ${
                isLightSearch
                  ? "border-[#e8e5ef] bg-[#fffdf2] focus-within:border-[#6264b5] focus-within:ring-2 focus-within:ring-[#6264b5]/10"
                  : "border-[#c8b7db]/20 bg-[#071653]/80 focus-within:border-[#6264b5] focus-within:ring-4 focus-within:ring-[#6264b5]/20"
              }`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border ${isLightSearch ? "border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]" : "border-[#c8b7db]/20 bg-white/5 text-[#ffb703]"}`}><Search className="h-4 w-4" /></span>
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari artis, kota, atau konser..."
                className={`min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none ${
                  isLightSearch
                    ? "text-[#101b4f] placeholder:text-[#77768c]"
                    : "text-[#e1e2ec] placeholder:text-[#514532]"
                }`}
              />
              <button
                type="submit"
                className={`press inline-flex h-9 items-center gap-1.5 rounded-lg px-4 text-xs font-bold transition ${
                  isLightSearch
                    ? "bg-[#6264b5] text-white hover:bg-[#51539f]"
                    : "bg-[#ffb703] text-[#0b0e15] hover:bg-[#ffdea9]"
                }`}
              >
                Cari <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            <div className="mt-5 border-t border-[#e8e5ef] pt-4">
              <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.16em] text-[#6264b5]">Rekomendasi pencarian</p>
              {recommendedEvents.length || recommendedArtists.length ? (
                <div className="grid max-h-56 gap-2 overflow-y-auto sm:grid-cols-2">
                  {recommendedEvents.slice(0, 3).map((event) => (
                    <button key={`event-${event.id}`} type="button" onClick={() => openRecommendation(`${user ? "/home/events" : "/events"}/${event.id}`)} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] p-3 text-left transition hover:border-[#c8b7db] hover:bg-[#eeebf4]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]"><CalendarDays className="h-4 w-4" /></span>
                      <span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#071653]">{event.title}</span><span className="mt-0.5 flex items-center gap-1 truncate text-[10px] text-[#77768c]"><MapPin className="h-3 w-3 shrink-0" />{event.location || event.venue || "Konser mendatang"}</span></span>
                    </button>
                  ))}
                  {recommendedArtists.slice(0, 3).map((artist) => (
                    <button key={`artist-${artist.id}`} type="button" onClick={() => openRecommendation(`${user ? "/home/artists" : "/artists"}/${artist.id}`)} className="flex min-w-0 items-center gap-3 rounded-xl border border-[#e8e5ef] bg-[#fffdf2] p-3 text-left transition hover:border-[#c8b7db] hover:bg-[#eeebf4]">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#c8b7db] bg-[#eeebf4] text-[#6264b5]"><Music2 className="h-4 w-4" /></span>
                      <span className="min-w-0"><span className="block truncate text-xs font-semibold text-[#071653]">{artist.name}</span><span className="mt-0.5 block truncate text-[10px] text-[#77768c]">{artist.genre || "Artis populer"}</span></span>
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#77768c]">
                    {loadingRecommendations ? "Memuat rekomendasi konser dan artis..." : "Coba cari berdasarkan kota, genre, atau nama musisi."}
                  </p>
                  {!loadingRecommendations ? <div className="mt-3 flex flex-wrap gap-2">
                    {["Jakarta", "Pop", "Festival", "Jazz"].map((term) => <button key={term} type="button" onClick={() => fillSearch(term)} className="rounded-full border border-[#e8e5ef] bg-white px-3 py-1.5 text-[10px] font-semibold text-[#6264b5] transition hover:border-[#c8b7db] hover:bg-[#eeebf4]">{term}</button>)}
                  </div> : null}
                </>
              )}
            </div>

            <p className={`mt-4 text-[11px] uppercase tracking-[0.18em] ${isLightSearch ? "text-[#77768c]" : "text-[#514532]"}`}>
              Try: Coldplay · Jakarta · Jazz
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Navbar;
