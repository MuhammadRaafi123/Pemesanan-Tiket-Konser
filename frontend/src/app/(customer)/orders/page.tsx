"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Filter,
  Package,
  Plus,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { fetchMyOrders } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";
import { getApiErrorMessage } from "@/lib/apiError";

/* ── filter tabs ── */
const FILTERS: {
  id: string;
  label: string;
  icon: React.ElementType;
  activeColor: string;
}[] = [
  { id: "all", label: "Semua", icon: Filter, activeColor: "bg-[#ffb703] text-[#10131a] shadow-[#ffb703]/25" },
  { id: "pending", label: "Menunggu", icon: Clock, activeColor: "bg-amber-500 text-white shadow-amber-500/25" },
  { id: "paid", label: "Lunas", icon: CheckCircle2, activeColor: "bg-emerald-500 text-white shadow-emerald-500/25" },
  { id: "rejected", label: "Ditolak", icon: XCircle, activeColor: "bg-rose-500 text-white shadow-rose-500/25" },
];

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    fetchMyOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(
            getApiErrorMessage(requestError, "Gagal memuat riwayat pesanan.")
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const filteredOrders = orders.filter((order) =>
    selectedStatus === "all" ? true : order.status === selectedStatus
  );

  /* ── quick stats ── */
  const totalOrders = orders.length;
  const paidCount = orders.filter((o) => o.status === "paid").length;
  const pendingCount = orders.filter((o) => o.status === "pending").length;

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] selection:bg-[#ffb703]/30 selection:text-white">
      <Navbar />

      <main className="relative flex-1">
        {/* ── ambient background ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-40 top-20 h-80 w-80 rounded-full bg-[#ffb703]/[0.04] blur-[120px]" />
          <div className="absolute -right-40 top-60 h-72 w-72 rounded-full bg-[#6801d1]/[0.06] blur-[100px]" />
        </div>

        <div className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
          {/* ── page header ── */}
          <Reveal>
            <div className="flex flex-col gap-6 border-b border-[#232733] pb-8 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#ffb703]">
                  Riwayat transaksi
                </p>
                <h1 className="mt-4 text-[2rem] font-extrabold leading-[1.06] text-white sm:text-[2.6rem]">
                  Pesanan tiket saya
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-[#8a8d98]">
                  Pantau status verifikasi pembayaran dan buka e-ticket digital
                  kamu di sini.
                </p>
              </div>
              <Link
                href="/events"
                className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:bg-[#ffdea9]"
              >
                <Plus className="h-4 w-4" />
                Pesan tiket baru
              </Link>
            </div>
          </Reveal>

          {/* ── quick stats ── */}
          <Reveal className="mt-8 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-[#232733] bg-[#14161f] p-4 text-center">
              <Package className="mx-auto h-5 w-5 text-[#ffb703]" />
              <p className="mt-2 text-2xl font-black text-white">{totalOrders}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7a7d88]">
                Total Pesanan
              </p>
            </div>
            <div className="rounded-2xl border border-[#232733] bg-[#14161f] p-4 text-center">
              <CheckCircle2 className="mx-auto h-5 w-5 text-emerald-400" />
              <p className="mt-2 text-2xl font-black text-emerald-400">{paidCount}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7a7d88]">
                Lunas
              </p>
            </div>
            <div className="rounded-2xl border border-[#232733] bg-[#14161f] p-4 text-center">
              <Clock className="mx-auto h-5 w-5 text-amber-400" />
              <p className="mt-2 text-2xl font-black text-amber-400">{pendingCount}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7a7d88]">
                Menunggu
              </p>
            </div>
          </Reveal>

          {/* ── filter tabs ── */}
          <Reveal className="mt-8 flex flex-wrap gap-2">
            {FILTERS.map((filter) => {
              const isSelected = selectedStatus === filter.id;
              const FilterIcon = filter.icon;
              const count =
                filter.id === "all"
                  ? orders.length
                  : orders.filter((o) => o.status === filter.id).length;
              return (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedStatus(filter.id)}
                  aria-pressed={isSelected}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-semibold transition-all duration-300 ${
                    isSelected
                      ? `${filter.activeColor} border-transparent shadow-lg`
                      : "border-[#2a2d36] bg-[#191b23] text-[#8a8d98] hover:border-[#ffb703]/30 hover:text-[#ffb703]"
                  }`}
                >
                  <FilterIcon className="h-3.5 w-3.5" />
                  {filter.label}
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      isSelected ? "bg-white/20" : "bg-[#232733] text-[#7a7d88]"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </Reveal>

          {/* ── order list ── */}
          <div className="mt-8">
            {loading ? (
              <Loading message="Memuat riwayat transaksi..." />
            ) : loadError ? (
              <ErrorState title="Riwayat gagal dimuat" message={loadError} />
            ) : filteredOrders.length > 0 ? (
              <Stagger className="space-y-4" step={80}>
                {filteredOrders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))}
              </Stagger>
            ) : (
              <EmptyState
                icon={ShoppingBag}
                title="Tidak ada pesanan"
                description="Belum ada transaksi pemesanan tiket dengan status ini."
                actionLabel="Eksplorasi konser"
                actionHref="/events"
                variant="dark"
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
