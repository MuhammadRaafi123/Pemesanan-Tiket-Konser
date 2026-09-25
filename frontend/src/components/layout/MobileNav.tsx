"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarDays, Compass, QrCode, ShoppingBag, Sparkles, Ticket, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItems());
  const items = [{ label: "Home", href: "/", icon: Sparkles }, { label: "Konser", href: "/events", icon: Ticket }, { label: "Artis", href: "/artists", icon: CalendarDays }, ...(user ? [{ label: "For You", href: "/home", icon: Compass }] : []), { label: "Cart", href: "/checkout", icon: ShoppingBag, badge: totalCartItems > 0 ? totalCartItems : undefined }, { label: user ? "Account" : "Login", href: user ? "/profile" : "/login", icon: user ? User : QrCode }];
  return <div className="fixed bottom-3 left-0 right-0 z-40 px-4 md:hidden"><nav className="mx-auto flex max-w-lg items-center justify-around rounded-2xl border border-blue-100 bg-white/95 p-2 shadow-[0_18px_50px_-22px_rgba(37,99,235,.35)] backdrop-blur-2xl">{items.map((item) => { const Icon = item.icon; const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href)); return <Link key={`${item.label}-${item.href}`} href={item.href} className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition ${isActive ? "bg-blue-100 text-[#1d4ed8]" : "text-[#6683a3]"}`}><div className="relative"><Icon className="h-4 w-4" />{item.badge !== undefined && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2563eb] px-1 text-[8px] font-bold text-white">{item.badge}</span>}</div><span className="truncate text-[9px] font-medium">{item.label}</span></Link>; })}</nav></div>;
}

export default MobileNav;
