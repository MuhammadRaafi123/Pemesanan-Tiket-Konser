"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Sparkles, 
  Ticket, 
  Mic2, 
  QrCode, 
  ShoppingBag, 
  User 
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function MobileNav() {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const totalCartItems = useCartStore((state) => state.getTotalItems());

  const items = [
    { label: "Home", href: "/", icon: Sparkles },
    { label: "Konser", href: "/events", icon: Ticket },
    { label: "Artis", href: "/artists", icon: Mic2 },
    { label: "Tiket", href: user ? "/tickets" : "/login", icon: QrCode },
    { 
      label: "Cart", 
      href: "/checkout", 
      icon: ShoppingBag, 
      badge: totalCartItems > 0 ? totalCartItems : undefined 
    },
    { label: "Akun", href: user ? "/profile" : "/login", icon: User },
  ];

  return (
    <div className="fixed bottom-4 left-0 right-0 z-40 px-4 md:hidden">
      <nav className="mx-auto flex max-w-md items-center justify-around rounded-3xl border border-white/15 bg-[#0e0e1a]/90 py-2.5 px-3 shadow-[0_15px_35px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-col items-center gap-1 p-1 transition-all duration-300 active:scale-90 ${
                isActive ? "text-purple-400" : "text-white/50 hover:text-white/80"
              }`}
            >
              {/* Active Indicator Top Dot */}
              {isActive && (
                <span className="absolute -top-1.5 h-1 w-4 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 shadow-[0_0_8px_#c084fc]" />
              )}

              <div className="relative">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-2xl transition-all duration-300 ${
                    isActive
                      ? "bg-purple-600/25 border border-purple-500/40 text-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                      : "hover:bg-white/5"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </div>

                {item.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[9px] font-black text-white shadow-md">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium tracking-tight ${isActive ? "font-bold text-white" : ""}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
export default MobileNav;
