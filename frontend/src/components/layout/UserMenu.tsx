"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, LayoutDashboard, LogOut, ShoppingBag, Sparkles, Ticket, User } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export function UserMenu() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsOpen(false); };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  return <div className="relative" ref={menuRef}><button type="button" onClick={() => setIsOpen((current) => !current)} className="flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 p-1.5 pr-3 transition hover:border-blue-300" aria-expanded={isOpen}><span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-[#2563eb]">{user.name?.charAt(0).toUpperCase() || "U"}</span><span className="hidden max-w-24 truncate text-xs font-medium text-[#17457f] sm:block">{user.name}</span><ChevronDown className={`h-3.5 w-3.5 text-[#8aa4c1] transition-transform ${isOpen ? "rotate-180 text-[#2563eb]" : ""}`} /></button>{isOpen && <div className="absolute right-0 top-14 z-50 w-60 rounded-2xl border border-blue-100 bg-white p-2 shadow-[0_25px_70px_-30px_rgba(37,99,235,.35)]"><div className="border-b border-blue-100 px-3 py-3"><p className="truncate text-sm font-medium text-[#17457f]">{user.name}</p><p className="mt-1 truncate text-[11px] text-[#8aa4c1]">{user.email}</p></div><div className="mt-2 space-y-1"><Link href="/home" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#6683a3] transition hover:bg-blue-50 hover:text-[#2563eb]"><Sparkles className="h-4 w-4 text-[#2563eb]" />For you</Link><Link href="/profile" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#6683a3] transition hover:bg-blue-50 hover:text-[#2563eb]"><User className="h-4 w-4" />Profile</Link><Link href="/tickets" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#6683a3] transition hover:bg-blue-50 hover:text-[#2563eb]"><Ticket className="h-4 w-4" />My tickets</Link><Link href="/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#6683a3] transition hover:bg-blue-50 hover:text-[#2563eb]"><ShoppingBag className="h-4 w-4" />Orders</Link>{user.role === "admin" && <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-[#6683a3] transition hover:bg-blue-50 hover:text-[#2563eb]"><LayoutDashboard className="h-4 w-4" />Admin dashboard</Link>}<button type="button" onClick={() => { setIsOpen(false); logout(); router.replace("/"); }} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-rose-600 transition hover:bg-rose-50"><LogOut className="h-4 w-4" />Sign out</button></div></div>}</div>;
}

export default UserMenu;
