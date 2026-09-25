"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowRight, CalendarDays, Compass, LogIn, Search, ShoppingBag, Sparkles, Ticket, UserPlus, X } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { UserMenu } from "@/components/layout/UserMenu";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "/", icon: Sparkles },
    { label: "Konser", href: "/events", icon: Ticket },
    { label: "Artis", href: "/artists", icon: CalendarDays },
    ...(user ? [{ label: "For You", href: "/home", icon: Compass }] : []),
  ];

  const submitSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;
    setSearchOpen(false);
    router.push(`/events?q=${encodeURIComponent(query)}`);
  };

  return <>
    <header className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${scrolled ? "border-b border-blue-100 bg-white/90 py-3 shadow-[0_16px_45px_-35px_rgba(37,99,235,.45)] backdrop-blur-2xl" : "bg-transparent py-5"}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-1 rounded-full border border-blue-100 bg-white/75 p-1.5 shadow-sm backdrop-blur-xl md:flex">{navLinks.map((link) => { const Icon = link.icon; const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href)); return <Link key={link.href} href={link.href} className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${isActive ? "bg-blue-100 text-[#1d4ed8]" : "text-[#6683a3] hover:bg-blue-50 hover:text-[#17457f]"}`}><Icon className="h-3.5 w-3.5" />{link.label}</Link>; })}</nav>
        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => setSearchOpen(true)} className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white/80 text-[#6683a3] transition hover:border-blue-300 hover:text-[#2563eb]" aria-label="Cari konser"><Search className="h-4 w-4" /></button>
          <Link href="/checkout" className="relative flex h-10 w-10 items-center justify-center rounded-full border border-blue-100 bg-white/80 text-[#6683a3] transition hover:border-blue-300 hover:text-[#2563eb]" aria-label="Keranjang tiket"><ShoppingBag className="h-4 w-4" />{totalCartItems > 0 && <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[9px] font-bold text-white">{totalCartItems}</span>}</Link>
          {user ? <UserMenu /> : <div className="hidden items-center gap-2 sm:flex"><Link href="/login" className="inline-flex h-10 items-center gap-2 rounded-full px-3 text-xs font-medium text-[#6683a3] transition hover:text-[#17457f]"><LogIn className="h-3.5 w-3.5" />Masuk</Link><Link href="/register" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563eb] px-4 text-xs font-semibold text-white transition hover:bg-[#1d4ed8]"><UserPlus className="h-3.5 w-3.5" />Daftar</Link></div>}
        </div>
      </div>
    </header>

    {searchOpen && <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-28"><button type="button" aria-label="Tutup pencarian" onClick={() => setSearchOpen(false)} className="absolute inset-0 cursor-default bg-[#dbeafe]/70 backdrop-blur-md" /><div className="relative w-full max-w-xl rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_30px_100px_-30px_rgba(37,99,235,.35)] sm:p-7"><div className="mb-5 flex items-center justify-between"><div className="flex items-center gap-2 text-sm font-medium text-[#2563eb]"><Compass className="h-4 w-4" />Cari live experience</div><button type="button" onClick={() => setSearchOpen(false)} className="rounded-full p-2 text-[#8aa4c1] transition hover:bg-blue-50 hover:text-[#2563eb]" aria-label="Tutup"><X className="h-4 w-4" /></button></div><form onSubmit={submitSearch} className="flex items-center gap-3 rounded-2xl border border-blue-100 bg-blue-50/50 px-4 py-2 focus-within:border-[#2563eb]"><Search className="h-4 w-4 shrink-0 text-[#2563eb]" /><input autoFocus value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari artis, kota, atau konser..." className="min-w-0 flex-1 bg-transparent py-2 text-sm text-[#102a43] outline-none placeholder:text-[#8aa4c1]" /><button type="submit" className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563eb] px-3 text-xs font-semibold text-white transition hover:bg-[#1d4ed8]">Cari <ArrowRight className="h-3.5 w-3.5" /></button></form><p className="mt-4 text-[10px] uppercase tracking-[0.18em] text-[#8aa4c1]">Try: Coldplay · Jakarta · Jazz</p></div></div>}
  </>;
}

export default Navbar;
