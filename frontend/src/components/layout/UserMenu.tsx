"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Ticket, 
  ShoppingBag, 
  LogOut, 
  LayoutDashboard, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles 
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export function UserMenu() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2.5 rounded-full border border-purple-500/30 bg-purple-950/30 p-1.5 pr-3.5 backdrop-blur-md transition-all duration-200 hover:border-purple-400 hover:bg-purple-900/40 active:scale-95"
      >
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-xs font-bold text-white shadow-[0_0_12px_rgba(168,85,247,0.5)]">
          {user.name ? user.name.charAt(0).toUpperCase() : "U"}
        </div>
        <div className="hidden sm:flex flex-col text-left">
          <span className="text-xs font-semibold text-white leading-tight">
            {user.name}
          </span>
          <span className="text-[10px] text-purple-300/70 capitalize">
            {user.role || "Customer"}
          </span>
        </div>
        <ChevronDown className={`h-3.5 w-3.5 text-white/50 transition-transform duration-200 ${isOpen ? "rotate-180 text-purple-400" : ""}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-white/10 bg-[#12121f]/95 p-2 shadow-2xl backdrop-blur-2xl z-50">
          <div className="px-3 py-2.5 border-b border-white/10 mb-1">
            <p className="text-xs font-semibold text-white">{user.name}</p>
            <p className="text-[11px] text-white/50 truncate">{user.email}</p>
          </div>

          <div className="space-y-1">
            <Link
              href="/profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-purple-600/20 hover:text-purple-300"
            >
              <User className="h-4 w-4 text-purple-400" />
              Profil Saya
            </Link>

            <Link
              href="/tickets"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-purple-600/20 hover:text-purple-300"
            >
              <Ticket className="h-4 w-4 text-cyan-400" />
              Tiket Saya
            </Link>

            <Link
              href="/orders"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-white/80 transition hover:bg-purple-600/20 hover:text-purple-300"
            >
              <ShoppingBag className="h-4 w-4 text-pink-400" />
              Riwayat Pesanan
            </Link>

            {user.role === "admin" && (
              <div className="pt-1 mt-1 border-t border-white/10">
                <Link
                  href="/admin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-amber-300 transition hover:bg-amber-500/20"
                >
                  <LayoutDashboard className="h-4 w-4 text-amber-400" />
                  Dashboard Admin
                </Link>
              </div>
            )}

            <div className="pt-1 mt-1 border-t border-white/10">
              <button
                onClick={() => {
                  setIsOpen(false);
                  logout();
                  window.location.href = "/";
                }}
                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-medium text-rose-400 transition hover:bg-rose-500/15"
              >
                <LogOut className="h-4 w-4" />
                Keluar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default UserMenu;
