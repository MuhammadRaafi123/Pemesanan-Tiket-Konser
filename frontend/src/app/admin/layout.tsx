"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BookOpen,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  Music2,
  Ticket,
  Users,
  X,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { Loading } from "@/components/shared/Loading";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/catalog", label: "Katalog", icon: BookOpen },
  { href: "/admin/events", label: "Event", icon: Music2 },
  { href: "/admin/orders", label: "Pesanan", icon: BarChart3 },
  { href: "/admin/tickets", label: "Tiket", icon: Ticket },
  { href: "/admin/users", label: "Pengguna", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, hydrated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (hydrated && (!user || user.role !== "admin")) {
      router.replace("/home");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  if (!hydrated || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0b09]">
        <Loading message="Memeriksa akses admin..." />
      </main>
    );
  }

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const NavItems = () => (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
      {NAV.map(({ href, label, icon: Icon, exact }) => {
        const active = isActive(href, exact);
        return (
          <Link
            key={href}
            href={href}
            className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
              active
                ? "bg-[#c9a85e]/15 text-[#c9a85e] shadow-[inset_0_0_0_1px_rgba(201,168,94,0.25)]"
                : "text-[#aaa69b] hover:bg-white/[0.05] hover:text-[#f5f0e5]"
            }`}
          >
            <Icon
              className={`h-4 w-4 shrink-0 transition-colors ${
                active ? "text-[#c9a85e]" : "text-[#5a5448] group-hover:text-[#aaa69b]"
              }`}
            />
            {!collapsed && <span className="truncate">{label}</span>}
            {collapsed && (
              <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-lg border border-[rgba(201,168,94,0.2)] bg-[#1a1814] px-2.5 py-1.5 text-xs font-medium text-[#f5f0e5] shadow-xl group-hover:block">
                {label}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-[#0b0b09] text-[#f5f0e5]">
      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[rgba(201,168,94,0.12)] bg-[#0f0e0b] transition-all duration-300 lg:relative lg:translate-x-0 ${
          collapsed ? "lg:w-[68px]" : "lg:w-60"
        } ${mobileOpen ? "w-72 translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div
          className={`flex h-16 shrink-0 items-center border-b border-[rgba(201,168,94,0.1)] px-4 ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <Link href="/admin" className="flex items-center gap-2">
              <Image src="/tixora.png" alt="Tixora" width={96} height={48} className="h-7 w-auto" />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a85e]/60">
                Admin
              </span>
            </Link>
          )}
          {collapsed && (
            <Link href="/admin">
              <Image src="/tixora.png" alt="Tixora" width={32} height={32} className="h-6 w-auto" />
            </Link>
          )}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden rounded-lg p-1.5 text-[#5a5448] transition hover:text-[#c9a85e] lg:block"
            aria-label="Toggle sidebar"
          >
            <ChevronLeft
              className={`h-4 w-4 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
            />
          </button>
          <button
            onClick={() => setMobileOpen(false)}
            className="rounded-lg p-1.5 text-[#5a5448] transition hover:text-[#c9a85e] lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Nav */}
        <NavItems />

        {/* User + Logout */}
        <div className="shrink-0 border-t border-[rgba(201,168,94,0.1)] p-3">
          {!collapsed && (
            <div className="mb-2 flex items-center gap-2.5 rounded-xl bg-white/[0.04] px-3 py-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#c9a85e]/20 text-xs font-bold text-[#c9a85e]">
                {user.name?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold text-[#f5f0e5]">{user.name}</p>
                <p className="truncate text-[10px] text-[#5a5448]">{user.email}</p>
              </div>
            </div>
          )}
          <button
            onClick={() => { logout(); router.replace("/"); }}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-medium text-[#5a5448] transition-all hover:bg-red-500/10 hover:text-red-400 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Keluar"}
          </button>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-[rgba(201,168,94,0.1)] bg-[#0f0e0b] px-4 lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="rounded-lg p-2 text-[#5a5448] hover:text-[#c9a85e]"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Image src="/tixora.png" alt="Tixora" width={80} height={40} className="h-6 w-auto" />
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#c9a85e]/60">Admin</span>
        </header>

        <main className="min-w-0 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
