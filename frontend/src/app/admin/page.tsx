"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BarChart3, CalendarDays, CheckCircle2, DollarSign, LayoutDashboard, Ticket, Users } from "lucide-react";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { formatCurrency } from "@/lib/format";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuthStore } from "@/stores/authStore";

interface DashboardData {
  totalEvents: number;
  totalArtists: number;
  totalOrders: number;
  ticketsSold: number;
  ticketsRemaining: number;
  totalRevenue: number;
  salesByDate: { date: string; orders: number; revenue: number }[];
}

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "admin") {
      router.replace("/home");
      return;
    }

    let active = true;
    api.get<ApiResponse<DashboardData>>("/dashboard")
      .then((response) => {
        if (active && response.data.data) setDashboard(response.data.data);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hydrated, router, user]);

  if (!hydrated || loading) {
    return <main className="flex min-h-screen items-center justify-center bg-[#f4f8ff] text-[#102a43]"><div className="h-10 w-10 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" /></main>;
  }

  const maxRevenue = Math.max(...(dashboard?.salesByDate || []).map((item) => item.revenue), 1);

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#102a43]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div><div className="luxury-eyebrow"><LayoutDashboard className="h-3.5 w-3.5" />Admin workspace</div><h1 className="mt-4 font-display text-5xl tracking-[-0.05em]">Good evening, {user?.name?.split(" ")[0]}.</h1><p className="mt-4 text-sm text-[#6683a3]/40">A quiet overview of what is happening across Concertix.</p></div>
          <Link href="/events" className="inline-flex h-11 items-center gap-2 rounded-xl border border-blue-200/[0.14] px-4 text-xs font-medium text-[#6683a3]/70 transition hover:border-[#2563eb]/50 hover:text-[#60a5fa]">Browse catalog <ArrowUpRight className="h-4 w-4" /></Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { label: "Total revenue", value: formatCurrency(dashboard?.totalRevenue || 0), icon: DollarSign },
            { label: "Tickets sold", value: dashboard?.ticketsSold || 0, icon: Ticket },
            { label: "Open events", value: dashboard?.totalEvents || 0, icon: CalendarDays },
            { label: "Artists", value: dashboard?.totalArtists || 0, icon: Users },
            { label: "Orders", value: dashboard?.totalOrders || 0, icon: BarChart3 },
            { label: "Tickets remaining", value: dashboard?.ticketsRemaining || 0, icon: CheckCircle2 },
          ].map(({ label, value, icon: Icon }) => <div key={label} className="luxury-panel rounded-2xl p-5"><div className="flex items-center justify-between text-[#6683a3]/35"><span className="text-xs">{label}</span><Icon className="h-4 w-4 text-[#2563eb]" /></div><p className="mt-5 font-display text-2xl text-[#123b6d]">{value}</p></div>)}
        </div>

        <section className="mt-12 rounded-[26px] border border-blue-200/[0.09] bg-white/[0.025] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4"><div><div className="luxury-eyebrow"><BarChart3 className="h-3.5 w-3.5" />Sales pulse</div><h2 className="mt-3 font-display text-3xl">Revenue by day</h2></div><span className="text-xs text-[#6683a3]/30">Last 7 records</span></div>
          <div className="mt-8 flex h-56 items-end gap-2 border-b border-l border-blue-200/[0.08] px-3 pb-0 pt-4 sm:gap-4">
            {(dashboard?.salesByDate || []).map((item) => <div key={item.date} className="group flex h-full flex-1 flex-col justify-end gap-2"><div className="relative w-full rounded-t-lg bg-gradient-to-t from-[#2563eb]/35 to-[#2563eb] transition group-hover:from-[#2563eb]/60" style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, 4)}%` }}><span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-[10px] text-[#60a5fa] group-hover:block">{formatCurrency(item.revenue)}</span></div><span className="truncate text-center text-[9px] text-[#6683a3]/25">{item.date.slice(5)}</span></div>)}
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
