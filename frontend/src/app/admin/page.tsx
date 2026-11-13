"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  TrendingUp,
  Ticket,
  Users,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { fetchAdminEvents, fetchAdminOrders } from "@/features/orders/adminApi";
import { formatCurrency, formatEventDate } from "@/lib/format";

interface DashboardData {
  totalEvents: number;
  totalArtists: number;
  totalOrders: number;
  ticketsSold: number;
  ticketsRemaining: number;
  totalRevenue: number;
  salesByDate: { date: string; orders: number; revenue: number }[];
  recentOrders: { id: number | string; name: string; event: string; total: number; status: string; date: string }[];
}

export default function AdminPage() {
  const user = useAuthStore((state) => state.user);
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    Promise.all([fetchAdminOrders(), fetchAdminEvents()])
      .then(([orders, events]) => {
        if (!active) return;
        const totalRevenue = orders.reduce((s, o) => s + (o.status === "paid" ? o.total : 0), 0);
        const ticketsSold = orders.reduce((s, o) => s + (o.order_items ?? []).reduce((t, i) => t + i.qty, 0), 0);
        const ticketsRemaining = events.reduce((s, e) => s + (e.ticket_categories ?? []).reduce((t, c) => t + (c.remaining ?? 0), 0), 0);
        const byDate = orders.reduce<Record<string, { orders: number; revenue: number }>>((acc, o) => {
          const d = new Date(o.created_at).toISOString().slice(0, 10);
          if (!acc[d]) acc[d] = { orders: 0, revenue: 0 };
          acc[d].orders += 1;
          if (o.status === "paid") acc[d].revenue += o.total;
          return acc;
        }, {});
        const recentOrders = orders.slice(0, 5).map((o) => ({
          id: o.id,
          name: o.users?.name ?? "—",
          event: o.order_items?.[0]?.ticket_categories?.events?.title ?? "—",
          total: o.total,
          status: o.status,
          date: o.created_at,
        }));
        setDashboard({
          totalEvents: events.length,
          totalArtists: new Set(events.map((e) => e.artist_id ?? e.id)).size,
          totalOrders: orders.length,
          ticketsSold,
          ticketsRemaining,
          totalRevenue,
          salesByDate: Object.entries(byDate).map(([date, v]) => ({ date, ...v })).slice(-7),
          recentOrders,
        });
      })
      .catch(() => undefined)
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const statCards = [
    { label: "Total Revenue", value: formatCurrency(dashboard?.totalRevenue ?? 0), icon: DollarSign, accent: "#c9a85e" },
    { label: "Tiket Terjual", value: dashboard?.ticketsSold ?? 0, icon: Ticket, accent: "#c9a85e" },
    { label: "Event Aktif", value: dashboard?.totalEvents ?? 0, icon: CalendarDays, accent: "#c9a85e" },
    { label: "Total Artis", value: dashboard?.totalArtists ?? 0, icon: Users, accent: "#c9a85e" },
    { label: "Total Pesanan", value: dashboard?.totalOrders ?? 0, icon: BarChart3, accent: "#c9a85e" },
    { label: "Tiket Tersisa", value: dashboard?.ticketsRemaining ?? 0, icon: CheckCircle2, accent: "#c9a85e" },
  ];

  const chartMax = Math.max(...(dashboard?.salesByDate ?? []).map((d) => d.revenue), 1);

  const statusStyle: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    cancelled: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#c9a85e] border-t-transparent" />
          <p className="text-xs text-[#5a5448]">Memuat data dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-5 py-8 sm:px-8 sm:py-10">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85e]/70">
            Admin Workspace
          </p>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[#f5f0e5] sm:text-3xl">
            Selamat datang, {user?.name?.split(" ")[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-[#5a5448]">
            Berikut ringkasan aktivitas platform hari ini.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/catalog"
            className="inline-flex items-center gap-2 rounded-xl bg-[#c9a85e] px-4 py-2.5 text-xs font-bold text-[#17140d] shadow-lg shadow-[#c9a85e]/20 transition-all hover:bg-[#dfc786] hover:-translate-y-0.5"
          >
            <BookOpen className="h-3.5 w-3.5" />
            Kelola Katalog
          </Link>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 rounded-xl border border-[rgba(201,168,94,0.2)] bg-white/[0.04] px-4 py-2.5 text-xs font-medium text-[#aaa69b] transition-all hover:border-[rgba(201,168,94,0.4)] hover:text-[#f5f0e5]"
          >
            Lihat Konser <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="group relative overflow-hidden rounded-2xl border border-[rgba(201,168,94,0.15)] bg-[#141410] p-5 transition-all duration-300 hover:border-[rgba(201,168,94,0.4)] hover:bg-[#1a1814]"
          >
            <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a85e]/25 to-transparent" />
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#5a5448]">
                {label}
              </p>
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(201,168,94,0.2)] bg-[#c9a85e]/10 text-[#c9a85e]">
                <Icon className="h-3.5 w-3.5" />
              </span>
            </div>
            <p className="mt-4 text-2xl font-bold tabular-nums text-[#f5f0e5]">{value}</p>
            <div className="mt-2 flex items-center gap-1.5 text-[10px] text-[#3a3530]">
              <TrendingUp className="h-3 w-3 text-[#c9a85e]/40" />
              <span>Live data</span>
            </div>
          </div>
        ))}
      </div>

      {/* Chart + Recent orders */}
      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Revenue chart */}
        <section className="lg:col-span-3 relative overflow-hidden rounded-2xl border border-[rgba(201,168,94,0.15)] bg-[#141410] p-6">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a85e]/30 to-transparent" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a85e]/70">
                Grafik Penjualan
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#f5f0e5]">Pendapatan Harian</h2>
            </div>
            <span className="rounded-lg border border-[rgba(201,168,94,0.15)] bg-[#c9a85e]/10 px-2.5 py-1 text-[10px] font-medium text-[#c9a85e]">
              7 Hari Terakhir
            </span>
          </div>

          {dashboard?.salesByDate && dashboard.salesByDate.length > 0 ? (
            <div className="mt-6 flex h-48 items-end gap-2 border-b border-l border-[rgba(201,168,94,0.1)] pb-0 pl-2 pt-3">
              {dashboard.salesByDate.map((item) => (
                <div key={item.date} className="group relative flex h-full flex-1 flex-col justify-end gap-1.5">
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-[#c9a85e]/40 to-[#c9a85e] transition-all duration-500"
                    style={{ height: `${Math.max((item.revenue / chartMax) * 100, 4)}%` }}
                  >
                    <span className="pointer-events-none absolute -top-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-lg border border-[rgba(201,168,94,0.2)] bg-[#1a1814] px-2 py-1 text-[9px] font-medium text-[#f5f0e5] shadow-lg group-hover:block">
                      {formatCurrency(item.revenue)}
                    </span>
                  </div>
                  <span className="text-center text-[9px] text-[#3a3530]">{item.date.slice(5)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-6 flex h-48 items-center justify-center text-sm text-[#3a3530]">
              Belum ada data penjualan.
            </div>
          )}
        </section>

        {/* Recent orders */}
        <section className="lg:col-span-2 relative overflow-hidden rounded-2xl border border-[rgba(201,168,94,0.15)] bg-[#141410] p-6">
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#c9a85e]/30 to-transparent" />
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#c9a85e]/70">
                Pesanan Terbaru
              </p>
              <h2 className="mt-1 text-lg font-bold text-[#f5f0e5]">Aktivitas</h2>
            </div>
          </div>

          {dashboard?.recentOrders && dashboard.recentOrders.length > 0 ? (
            <div className="space-y-3">
              {dashboard.recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-start justify-between gap-3 rounded-xl border border-[rgba(201,168,94,0.08)] bg-white/[0.03] px-3.5 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-[#f5f0e5]">{order.name}</p>
                    <p className="mt-0.5 truncate text-[10px] text-[#5a5448]">{order.event}</p>
                    <p className="mt-1 text-[10px] text-[#3a3530]">{formatEventDate(order.date)}</p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <span className="text-xs font-bold text-[#c9a85e]">{formatCurrency(order.total)}</span>
                    <span
                      className={`rounded-md border px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${
                        statusStyle[order.status] ?? "bg-white/5 text-[#aaa69b] border-white/10"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-32 items-center justify-center text-sm text-[#3a3530]">
              Belum ada pesanan.
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
