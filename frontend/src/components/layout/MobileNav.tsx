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

  const items = [
    { label: user ? "Untukmu" : "Home", href: user ? "/home" : "/", icon: user ? Compass : Sparkles },
    { label: "Konser", href: "/events", icon: Ticket },
    { label: "Artis", href: "/artists", icon: CalendarDays },
    ...(user
      ? [{ label: "Tiket", href: "/tickets", icon: Ticket }]
      : [{
          label: "Cart",
          href: "/checkout",
          icon: ShoppingBag,
          badge: totalCartItems > 0 ? totalCartItems : undefined,
        }]),
    { label: user ? "Akun" : "Masuk", href: user ? "/profile" : "/login", icon: user ? User : QrCode },
  ];

  return (
    <div className="fixed inset-x-0 bottom-3 z-40 px-4 md:hidden">
      <nav className="glass-dock mx-auto flex max-w-lg items-center justify-around rounded-2xl p-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={`${item.label}-${item.href}`}
              href={item.href}
              className={`relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-xl px-1 py-1.5 transition-colors duration-300 ${
                isActive ? "text-white" : "text-muted-foreground"
              }`}
            >
              {isActive ? (
                <span
                  className="absolute inset-0 -z-10 rounded-xl bg-primary shadow-[0_10px_22px_-12px_rgba(27,69,199,.9)]"
                  style={{ animation: "page-enter 380ms cubic-bezier(0.22,1,0.36,1) both" }}
                />
              ) : null}
              <span className="relative">
                <Icon className="h-4 w-4" />
                {item.badge !== undefined ? (
                  <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[0.5rem] font-bold text-white">
                    {item.badge}
                  </span>
                ) : null}
              </span>
              <span className="truncate text-[0.58rem] font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export default MobileNav;
