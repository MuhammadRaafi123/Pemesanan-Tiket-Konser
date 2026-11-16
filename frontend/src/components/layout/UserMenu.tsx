"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Compass,
  LayoutDashboard,
  LogOut,
  ShoppingBag,
  Ticket,
  User,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

const MENU_LINKS = [
  { label: "For you", href: "/home", icon: Compass },
  { label: "Profil", href: "/profile", icon: User },
  { label: "Tiket saya", href: "/tickets", icon: Ticket },
  { label: "Pesanan", href: "/orders", icon: ShoppingBag },
];

export function UserMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const isLanding = pathname === "/";
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  if (!user) return null;

  const isAdmin = user.role === "admin";

  return (
    // Keyed on the route so navigating away remounts the menu in its closed state.
    <div className="relative" key={pathname} ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className={`press flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 transition ${
          isLanding
            ? "border-[#e8e2ed] bg-white/90 shadow-sm hover:border-[#6264b5]/40"
            : "border-[#32353d]/50 bg-[#191b23]/85 hover:border-[#ffb703]/40"
        }`}
      >
        <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${isLanding ? "bg-[#6264b5] text-white" : "bg-[#ffb703] text-[#10131a]"}`}>
          {user.name?.charAt(0).toUpperCase() || "U"}
        </span>
        <span className={`hidden max-w-24 truncate text-xs font-semibold sm:block ${isLanding ? "text-[#101b4f]" : "text-[#e1e2ec]"}`}>
          {user.name}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform duration-300 ${
            isLanding ? "text-[#646b82]" : "text-muted-foreground"
          } ${
            isOpen ? `rotate-180 ${isLanding ? "text-[#6264b5]" : "text-[#ffb703]"}` : ""
          }`}
        />
      </button>

      {isOpen ? (
        <div
          className={`login-form-card absolute right-0 top-14 z-50 w-60 rounded-2xl border p-2 ${
            isLanding
              ? "border-[#e8e2ed] bg-[#fffdf2] shadow-[0_30px_80px_-34px_rgba(7,22,83,.25)]"
              : "border-[#32353d]/60 bg-[#191b23] shadow-[0_30px_80px_-34px_rgba(0,0,0,.8)]"
          }`}
          style={{ animationDuration: "320ms" }}
        >
          <div className={`border-b px-3 py-3 ${isLanding ? "border-[#e8e2ed]" : "border-[#2a2d36]"}`}>
            <p className={`truncate text-sm font-semibold ${isLanding ? "text-[#101b4f]" : "text-[#e1e2ec]"}`}>{user.name}</p>
            <p className={`mt-1 truncate text-[0.68rem] ${isLanding ? "text-[#646b82]" : "text-[#8a8d98]"}`}>{user.email}</p>
          </div>

          <div className="mt-2 space-y-0.5">
            {MENU_LINKS.map(({ label, href, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                  isLanding
                    ? "text-[#646b82] hover:bg-[#f0ebf4] hover:text-[#6264b5]"
                    : "text-[#a1a3ac] hover:bg-[#272a32] hover:text-[#ffb703]"
                }`}
              >
                <Icon className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                {label}
              </Link>
            ))}

            {isAdmin ? (
              <Link
                href="/admin"
                onClick={() => setIsOpen(false)}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium transition ${
                  isLanding
                    ? "text-[#646b82] hover:bg-[#f0ebf4] hover:text-[#6264b5]"
                    : "text-[#a1a3ac] hover:bg-[#272a32] hover:text-[#ffb703]"
                }`}
              >
                <LayoutDashboard className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                Admin dashboard
              </Link>
            ) : null}
          </div>

          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
              logout();
              router.replace("/");
            }}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-[#646b82] transition hover:bg-rose-500/10 hover:text-rose-700"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      ) : null}
    </div>
  );
}

export default UserMenu;
