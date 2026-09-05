"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  Sparkles, 
  Ticket, 
  Mic2, 
  ShoppingBag, 
  Search, 
  LogIn, 
  UserPlus, 
  QrCode, 
  Music2, 
  X,
  Compass
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { UserMenu } from "./UserMenu";
import { SoundVisualizer } from "@/components/shared/SoundVisualizer";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, initializeAuth } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    initializeAuth();
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [initializeAuth]);

  const navLinks = [
    { label: "Beranda", href: "/", icon: Sparkles },
    { label: "Konser", href: "/events", icon: Ticket },
    { label: "Artis", href: "/artists", icon: Mic2 },
    ...(user ? [
      { label: "Tiket Saya", href: "/tickets", icon: QrCode },
      { label: "Pesanan", href: "/orders", icon: ShoppingBag },
    ] : []),
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/events?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "border-b border-white/10 bg-[#08080c]/85 py-3 backdrop-blur-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent py-5"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* ================================================= */}
          {/* BRAND / LOGO */}
          {/* ================================================= */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-105 active:scale-95"
          >
            <div className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-cyan-400 p-[2px] shadow-[0_0_20px_rgba(168,85,247,0.5)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.8)] transition-all">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[#0c0c14]">
                <Music2 className="h-5 w-5 text-purple-400 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>

            <div className="flex flex-col">
              <span className="text-xl font-black tracking-tight text-white flex items-center gap-1">
                Concert<span className="text-purple-400">ix</span>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
              </span>
              <span className="text-[10px] font-medium tracking-widest uppercase text-white/40 -mt-1">
                Live Experience
              </span>
            </div>
          </Link>

          {/* ================================================= */}
          {/* DESKTOP NAVIGATION (Full Icon + Hover Glow) */}
          {/* ================================================= */}
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/10 bg-[#12121e]/80 p-1.5 backdrop-blur-xl shadow-lg">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`group relative flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                    isActive
                      ? "bg-purple-600 text-white shadow-[0_0_20px_rgba(147,51,234,0.6)]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 group-hover:scale-110 ${isActive ? "text-cyan-300" : "text-purple-400"}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* ================================================= */}
          {/* RIGHT CONTROLS (Soundwave, Search, Cart, Auth) */}
          {/* ================================================= */}
          <div className="flex items-center gap-3">
            
            {/* Live Beats Equalizer */}
            <div className="hidden lg:block">
              <SoundVisualizer />
            </div>

            {/* Quick Search Button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-950/40 hover:text-purple-300 active:scale-95"
              title="Cari Konser atau Artis (Ctrl + K)"
            >
              <Search className="h-4 w-4" />
            </button>

            {/* Cart / Ticket Checkout Drawer Trigger */}
            <Link
              href="/checkout"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 backdrop-blur-md transition-all duration-200 hover:border-purple-500/40 hover:bg-purple-950/40 hover:text-purple-300 active:scale-95"
              title="Keranjang Tiket"
            >
              <ShoppingBag className="h-4 w-4" />
              {totalCartItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-[10px] font-black text-white shadow-[0_0_10px_rgba(236,72,153,0.7)]">
                  {totalCartItems}
                </span>
              )}
            </Link>

            {/* User Auth or Menu */}
            {user ? (
              <UserMenu />
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-xs">
                    <LogIn className="h-3.5 w-3.5 text-purple-400" />
                    Masuk
                  </Button>
                </Link>
                <Link href="/register">
                  <Button variant="glow" size="sm" className="gap-1.5 text-xs">
                    <UserPlus className="h-3.5 w-3.5 text-cyan-300" />
                    Daftar
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ================================================= */}
      {/* SEARCH OVERLAY MODAL */}
      {/* ================================================= */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={() => setSearchOpen(false)}
          />

          <div className="relative z-50 w-full max-w-xl rounded-3xl border border-purple-500/30 bg-[#0e0e18]/95 p-6 shadow-2xl backdrop-blur-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-purple-300">
                <Compass className="h-4 w-4 text-cyan-400" />
                Cari Konser, Artis, atau Venue
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="rounded-xl p-1.5 text-white/50 hover:bg-white/10 hover:text-white transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit}>
              <div className="relative flex items-center">
                <Search className="absolute left-4 h-5 w-5 text-purple-400" />
                <input
                  type="text"
                  placeholder="Ketik nama konser atau artis favoritmu..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                  className="w-full rounded-2xl border border-white/15 bg-white/5 py-3.5 pl-12 pr-4 text-base text-white placeholder:text-white/40 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                />
              </div>

              <div className="mt-4 flex flex-wrap gap-2 text-xs text-white/60">
                <span className="text-white/40">Populer:</span>
                {["Coldplay", "Blackpink", "Sheila on 7", "Tulus", "Dewa 19", "EDM Festival"].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setSearchQuery(tag);
                      router.push(`/events?q=${encodeURIComponent(tag)}`);
                      setSearchOpen(false);
                    }}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/70 hover:border-purple-400 hover:text-purple-300 transition"
                  >
                    #{tag}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <Button type="submit" variant="glow" size="default" className="gap-2">
                  <Search className="h-4 w-4" />
                  Temukan Konser
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default Navbar;
