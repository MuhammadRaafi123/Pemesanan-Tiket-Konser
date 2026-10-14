"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  CheckCircle2,
  DollarSign,
  LayoutDashboard,
  Ticket,
  Users,
} from "lucide-react";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import { formatCurrency } from "@/lib/format";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CountUp } from "@/components/shared/CountUp";
import { PageHeader } from "@/components/shared/PageHeader";
import { Stagger } from "@/components/shared/Reveal";
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
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-2 border-primary/15 border-t-primary" />
      </main>
    );
  }

  const sales = dashboard?.salesByDate || [];
  const maxRevenue = Math.max(...sales.map((item) => item.revenue), 1);

  const metrics = [
    { label: "Total pendapatan", value: formatCurrency(dashboard?.totalRevenue || 0), icon: DollarSign, currency: true },
    { label: "Tiket terjual", value: dashboard?.ticketsSold || 0, icon: Ticket },
    { label: "Event terbuka", value: dashboard?.totalEvents || 0, icon: CalendarDays },
    { label: "Artis", value: dashboard?.totalArtists || 0, icon: Users },
    { label: "Pesanan", value: dashboard?.totalOrders || 0, icon: BarChart3 },
    { label: "Tiket tersisa", value: dashboard?.ticketsRemaining || 0, icon: CheckCircle2 },
  ];

  return (
    <div className="min-h-screen bg-background text-ink">
      <Navbar />

      <main className="mx-auto max-w-7xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <PageHeader
          eyebrow={
            <>
              <LayoutDashboard className="h-3.5 w-3.5" />
              Admin workspace
            </>
          }
          title={`Selamat datang, ${user?.name?.split(" ")[0] ?? "admin"}.`}
          description="Ringkasan tenang tentang apa yang sedang terjadi di seluruh Concertix."
          actions={
            <Link
              href="/events"
              className="press inline-flex h-11 items-center gap-2 rounded-full border border-border px-5 text-xs font-semibold text-ink transition hover:border-primary/35 hover:text-primary"
            >
              Buka katalog <ArrowUpRight className="h-4 w-4" />
            </Link>
          }
        />

        <Stagger className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" step={70}>
          {metrics.map(({ label, value, icon: Icon, currency }) => (
            <article key={label} className="panel panel-hover rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{label}</span>
                <Icon className="h-4 w-4 text-primary" />
              </div>
              {currency ? (
                <p className="numeral mt-5 text-2xl text-ink">
                  <CountUp value={dashboard?.totalRevenue || 0} format={formatCurrency} />
                </p>
              ) : (
                <p className="numeral mt-5 text-2xl text-ink">
                  <CountUp value={Number(value) || 0} />
                </p>
              )}
            </article>
          ))}
        </Stagger>

        <section className="mt-8 rounded-[28px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow">
                <BarChart3 className="h-3.5 w-3.5" />
                Sales pulse
              </p>
              <h2 className="font-display mt-3 text-3xl text-ink">Pendapatan per hari</h2>
            </div>
            <span className="meta-label">{sales.length} catatan terakhir</span>
          </div>

          {sales.length > 0 ? (
            <div className="mt-10 flex h-64 items-end gap-2 border-b border-l border-border px-4 pb-0 pt-6 sm:gap-4">
              {sales.map((item, index) => {
                const height = Math.max((item.revenue / maxRevenue) * 100, 3);
                return (
                  <div key={item.date} className="group flex h-full flex-1 flex-col justify-end gap-3">
                    <div className="relative w-full origin-bottom rounded-t-lg bg-gradient-to-t from-primary/25 to-primary transition-transform duration-500 ease-out hover:scale-y-[1.03] hover:from-primary/45"
                      style={{
                        height: `${height}%`,
                        animation: `bar-rise 900ms cubic-bezier(0.22,1,0.36,1) ${index * 70}ms both`,
                      }}
                    >
                      <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md border border-border bg-white px-2 py-1 text-[0.6rem] font-semibold text-ink opacity-0 shadow-sm transition-opacity duration-300 group-hover:opacity-100">
                        {formatCurrency(item.revenue)}
                      </span>
                    </div>
                    <span className="truncate text-center text-[0.6rem] text-muted-foreground">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="mt-8 text-sm text-muted-foreground">Belum ada data penjualan untuk ditampilkan.</p>
          )}
        </section>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
