"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  Compass,
  LogIn,
  Search,
  ShoppingBag,
  Sparkles,
  Ticket,
  UserPlus,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { UserMenu } from "@/components/layout/UserMenu";
import { ScrollProgress } from "@/components/shared/ScrollProgress";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

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

  const navLinks = [
    { label: user ? "Untukmu" : "Beranda", href: user ? "/home" : "/", icon: user ? Compass : Sparkles },
    { label: "Konser", href: "/events", icon: Ticket },
    { label: "Artis", href: "/artists", icon: CalendarDays },
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
    router.push(`/events?q=${encodeURIComponent(query)}`);
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
          scrolled
            ? "border-b border-[#32353d]/50 bg-[#0b0e15]/85 py-2 shadow-lg shadow-black/20 backdrop-blur-2xl"
            : "border-b border-transparent py-4"
        }`}
      >
        <ScrollProgress className={scrolled ? "opacity-100" : "opacity-0"} />
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <BrandMark href={user ? "/home" : "/"} />

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 rounded-full border border-[#32353d]/40 bg-[#191b23]/70 p-1.5 backdrop-blur-xl md:flex">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-colors duration-300 ${
                    isActive ? "text-[#0b0e15]" : "text-[#d5c4ac] hover:text-[#e1e2ec]"
                  }`}
                >
                  {isActive ? (
                    <span className="absolute inset-0 -z-10 rounded-full bg-[#ffb703] shadow-[0_8px_18px_-8px_rgba(255,183,3,.7)]" />
                  ) : null}
                  <Icon className="h-3.5 w-3.5" />
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
              className="press flex h-10 w-10 items-center justify-center rounded-full border border-[#32353d]/50 bg-[#191b23]/70 text-[#d5c4ac] backdrop-blur-xl transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
              aria-label="Cari konser"
            >
              <Search className="h-4 w-4" />
            </button>

            <Link
              href="/checkout"
              className="press relative flex h-10 w-10 items-center justify-center rounded-full border border-[#32353d]/50 bg-[#191b23]/70 text-[#d5c4ac] backdrop-blur-xl transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
              aria-label="Keranjang tiket"
            >
              <ShoppingBag className="h-4 w-4" />
              {totalCartItems > 0 ? (
                <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#ffb703] px-1 text-[0.55rem] font-bold text-[#0b0e15]">
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
                  className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-xs font-semibold text-[#d5c4ac] transition hover:text-[#ffb703]"
                >
                  <LogIn className="h-3.5 w-3.5" />
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-[#ffb703] px-4 text-xs font-bold text-[#0b0e15] shadow-lg shadow-[#ffb703]/25 transition-all hover:-translate-y-0.5 hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40"
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
            className="absolute inset-0 cursor-default bg-[#0b0e15]/80 backdrop-blur-md"
            style={{ animation: "page-enter 240ms ease both" }}
          />
          <div className="login-form-card relative w-full max-w-xl rounded-3xl border border-[#32353d]/50 bg-[#191b23] p-6 shadow-[0_40px_120px_-40px_rgba(0,0,0,.8)] sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#ffb703]">
                <Compass className="h-4 w-4" />
                Cari live experience
              </div>
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded-full p-2 text-[#d5c4ac] transition hover:bg-[#272a32] hover:text-[#e1e2ec]"
                aria-label="Tutup"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form
              onSubmit={submitSearch}
              className="flex items-center gap-3 rounded-2xl border border-[#32353d]/50 bg-[#10131a] px-4 py-2 transition focus-within:border-[#ffb703]/50 focus-within:ring-4 focus-within:ring-[#ffb703]/10"
            >
              <Search className="h-4 w-4 shrink-0 text-[#ffb703]" />
              <input
                autoFocus
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Cari artis, kota, atau konser..."
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-[#e1e2ec] outline-none placeholder:text-[#514532]"
              />
              <button
                type="submit"
                className="press inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#ffb703] px-4 text-xs font-bold text-[#0b0e15] transition hover:bg-[#ffdea9]"
              >
                Cari <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>

            <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-[#514532]">
              Try: Coldplay · Jakarta · Jazz
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default Navbar;
