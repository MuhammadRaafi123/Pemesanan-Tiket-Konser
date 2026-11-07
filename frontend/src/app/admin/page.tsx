"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight, BarChart3, CalendarDays, CheckCircle2, DollarSign, LayoutDashboard, Ticket, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { useAuthStore } from "@/stores/authStore";
import { fetchAdminEvents, fetchAdminOrders } from "@/features/orders/adminApi";
import { formatCurrency } from "@/lib/format";

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

    Promise.all([fetchAdminOrders(), fetchAdminEvents()])
      .then(([nextOrders, nextEvents]) => {
        if (!active) return;

        const totalRevenue = nextOrders.reduce((sum, order) => sum + (order.status === "paid" ? order.total : 0), 0);
        const ticketsSold = nextOrders.reduce((sum, order) => sum + (order.order_items ?? []).reduce((itemTotal, item) => itemTotal + item.qty, 0), 0);
        const ticketsRemaining = nextEvents.reduce((sum, event) => sum + (event.ticket_categories ?? []).reduce((catSum, category) => catSum + (category.remaining ?? 0), 0), 0);
        const salesByDate = nextOrders.reduce<Record<string, { orders: number; revenue: number }>>((acc, order) => {
          const date = new Date(order.created_at).toISOString().slice(0, 10);
          if (!acc[date]) acc[date] = { orders: 0, revenue: 0 };
          acc[date].orders += 1;
          if (order.status === "paid") acc[date].revenue += order.total;
          return acc;
        }, {});

        setDashboard({
          totalEvents: nextEvents.length,
          totalArtists: new Set(nextEvents.map((event) => event.artists?.id ?? event.artist_id ?? event.id)).size,
          totalOrders: nextOrders.length,
          ticketsSold,
          ticketsRemaining,
          totalRevenue,
          salesByDate: Object.entries(salesByDate).map(([date, value]) => ({ date, ...value })).slice(-7),
        });
      })
      .catch((requestError: unknown) => {
        if (active) console.error(requestError);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [hydrated, router, user]);

  if (!hydrated || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0b0e15] text-[#ffb703]">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-[#ffb703] border-t-transparent" />
      </main>
    );
  }

  const statCards = [
    { label: "Total revenue", value: formatCurrency(dashboard?.totalRevenue ?? 0), icon: DollarSign },
    { label: "Tickets sold", value: dashboard?.ticketsSold ?? 0, icon: Ticket },
    { label: "Open events", value: dashboard?.totalEvents ?? 0, icon: CalendarDays },
    { label: "Artists", value: dashboard?.totalArtists ?? 0, icon: Users },
    { label: "Orders", value: dashboard?.totalOrders ?? 0, icon: BarChart3 },
    { label: "Tickets remaining", value: dashboard?.ticketsRemaining ?? 0, icon: CheckCircle2 },
  ];

  const chartMax = Math.max(...(dashboard?.salesByDate ?? []).map((item) => item.revenue), 1);

  return (
    <div className="min-h-screen bg-[#0b0e15] text-[#e1e2ec]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/25 bg-[#ffb703]/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin workspace
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white">Selamat Datang, {user?.name?.split(" ")[0]}.</h1>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/catalog" className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-4 py-2 text-xs font-bold text-[#10131a] hover:bg-[#ffdea9] transition-colors">
              Kelola Katalog
            </Link>
            <Link href="/events" className="inline-flex items-center gap-2 rounded-xl border border-[#232733] bg-[#141720] px-4 py-2 text-xs font-medium text-white hover:border-[#ffb703]/40 transition-colors">
              Lihat Konser <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map(({ label, value, icon: Icon }) => (
            <div key={label} className="rounded-[24px] border border-[#232733] bg-[#141720] p-5 shadow-2xl">
              <div className="flex items-center justify-between text-[#8a8d9b]">
                <span className="text-xs font-medium">{label}</span>
                <Icon className="h-4 w-4 text-[#ffb703]" />
              </div>
              <p className="mt-5 text-2xl font-bold text-white">{value}</p>
            </div>
          ))}
        </div>

        <section className="mt-12 rounded-[28px] border border-[#232733] bg-[#141720] p-6 shadow-2xl sm:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">Grafik Penjualan</p>
              <h2 className="mt-3 text-2xl font-bold text-white">Pendapatan Harian</h2>
            </div>
            <span className="text-xs text-[#8a8d9b]">7 Data Terakhir</span>
          </div>

          <div className="mt-8 flex h-56 items-end gap-2 border-b border-l border-[#232733] px-3 pb-0 pt-4 sm:gap-4">
            {(dashboard?.salesByDate ?? []).map((item) => (
              <div key={item.date} className="group flex h-full flex-1 flex-col justify-end gap-2">
                <div className="relative w-full rounded-t-xl bg-gradient-to-t from-[#ffb703]/30 to-[#ffb703] transition" style={{ height: `${Math.max((item.revenue / chartMax) * 100, 8)}%` }}>
                  <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-full bg-[#191c26] border border-[#232733] px-2 py-1 text-[10px] font-medium text-white shadow group-hover:block">{formatCurrency(item.revenue)}</span>
                </div>
                <span className="truncate text-center text-[9px] text-[#8a8d9b]">{item.date.slice(5)}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
