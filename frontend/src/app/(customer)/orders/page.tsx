"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Filter,
  PackageCheck,
  ShoppingBag,
  Ticket,
  XCircle,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { fetchMyOrders } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";
import { getApiErrorMessage } from "@/lib/apiError";

const FILTERS = [
  { id: "all", label: "Semua", icon: Filter },
  { id: "pending", label: "Menunggu", icon: Clock3 },
  { id: "paid", label: "Lunas", icon: CheckCircle2 },
  { id: "rejected", label: "Ditolak", icon: XCircle },
  { id: "cancelled", label: "Dibatalkan", icon: XCircle },
] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    fetchMyOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((requestError: unknown) => {
        if (active) setLoadError(getApiErrorMessage(requestError, "Gagal memuat riwayat pesanan."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [reloadKey]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => selectedStatus === "all" || order.status === selectedStatus),
    [orders, selectedStatus],
  );
  const paidCount = orders.filter((order) => order.status === "paid").length;
  const pendingCount = orders.filter((order) => order.status === "pending").length;
  const totalSpent = orders
    .filter((order) => order.status === "paid")
    .reduce((total, order) => total + order.total, 0);

  return (
    <div className="landing-page min-h-screen bg-[#fffdf2] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#eeebf4] p-6 sm:p-9">
          <div className="absolute -right-12 -top-28 h-80 w-80 rounded-full bg-[#c8b7db]/60 blur-3xl" />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.2em] text-[#6264b5]">
                <ShoppingBag className="h-4 w-4" /> Catatan transaksi
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight sm:text-5xl">Pesanan dan pembayaran.</h1>
              <p className="mt-3 max-w-xl text-sm leading-7 text-[#5c6482]">
                Semua invoice dan status pembayaran konsermu, tersusun jelas dalam satu daftar.
              </p>
            </div>
            <Link href="/home/events" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#071653] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#172b70]">
              <Ticket className="h-4 w-4 text-[#c8b7db]" /> Pesan tiket baru
            </Link>
          </div>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-4 rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeebf4] text-[#6264b5]"><ShoppingBag className="h-5 w-5" /></span>
            <div><p className="text-2xl font-extrabold">{orders.length}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">Total pesanan</p></div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#c7e0d1] bg-[#e6f1eb] p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#fffdf2] text-[#397557]"><PackageCheck className="h-5 w-5" /></span>
            <div><p className="text-2xl font-extrabold text-[#245d43]">{paidCount}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#397557]">Pembayaran lunas</p></div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eeebf4] text-[#6264b5]"><Clock3 className="h-5 w-5" /></span>
            <div><p className="text-2xl font-extrabold">{pendingCount}</p><p className="text-[10px] font-bold uppercase tracking-wider text-[#5c6482]">Menunggu pembayaran</p></div>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] p-4 shadow-[0_12px_35px_-28px_rgba(7,22,83,.25)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#6264b5]">Riwayat akunmu</p>
              <h2 className="mt-1 text-lg font-extrabold">Daftar pesanan</h2>
            </div>
            <p className="text-xs text-[#5c6482]">Total pembayaran lunas: <strong className="text-[#071653]">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalSpent)}</strong></p>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(({ id, label, icon: Icon }) => {
              const count = id === "all" ? orders.length : orders.filter((order) => order.status === id).length;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedStatus(id)}
                  aria-pressed={selectedStatus === id}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    selectedStatus === id ? "bg-[#6264b5] text-white" : "border border-[#e8e5ef] text-[#5c6482] hover:border-[#c8b7db]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}<span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          {loading ? (
            <div className="rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] py-16"><Loading message="Memuat riwayat transaksi..." /></div>
          ) : loadError ? (
            <div className="space-y-3">
              <ErrorState title="Riwayat gagal dimuat" message={loadError} />
              <div className="text-center">
                <button
                  type="button"
                  onClick={() => { setLoading(true); setLoadError(""); setReloadKey((key) => key + 1); }}
                  className="rounded-lg bg-[#6264b5] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#51539f]"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          ) : filteredOrders.length ? (
            <div className="space-y-4">
              {filteredOrders.map((order) => <OrderCard key={order.id} order={order} />)}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="Belum ada pesanan"
              description="Pesanan dengan status ini akan muncul di sini setelah kamu memilih konser."
              actionLabel="Jelajahi konser"
              actionHref="/home/events"
              variant="light"
            />
          )}
        </section>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
