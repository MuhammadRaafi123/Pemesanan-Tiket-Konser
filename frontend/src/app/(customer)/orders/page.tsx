"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Clock3,
  Filter,
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
import { isOrderExpired, type Order } from "@/features/orders/types";
import { getApiErrorMessage } from "@/lib/apiError";

const FILTERS = [
  { id: "all", label: "Semua", icon: Filter },
  { id: "pending", label: "Menunggu", icon: Clock3 },
  { id: "paid", label: "Lunas", icon: CheckCircle2 },
  { id: "rejected", label: "Ditolak", icon: XCircle },
  { id: "cancelled", label: "Pesanan hangus", icon: XCircle },
] as const;

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [now, setNow] = useState(0);

  useEffect(() => {
    const initialClock = window.setTimeout(() => setNow(Date.now()), 0);
    const clock = window.setInterval(() => setNow(Date.now()), 5000);
    return () => { window.clearTimeout(initialClock); window.clearInterval(clock); };
  }, []);

  useEffect(() => {
    let active = true;
    const loadOrders = () => fetchMyOrders()
      .then((data) => {
        if (active) setOrders(data);
      })
      .catch((requestError: unknown) => {
        if (active) setLoadError(getApiErrorMessage(requestError, "Gagal memuat riwayat pesanan."));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    void loadOrders();
    const refresh = window.setInterval(() => { void loadOrders(); }, 30_000);
    return () => {
      active = false;
      window.clearInterval(refresh);
    };
  }, [reloadKey]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => {
      const status = isOrderExpired(order, now) ? "cancelled" : order.status;
      return selectedStatus === "all" || status === selectedStatus;
    }),
    [orders, selectedStatus, now],
  );
  const paidCount = orders.filter((order) => order.status === "paid").length;
  const pendingCount = orders.filter((order) => order.status === "pending" && !isOrderExpired(order, now)).length;
  const totalSpent = orders
    .filter((order) => order.status === "paid")
    .reduce((total, order) => total + order.total, 0);

  return (
    <div className="landing-page customer-lavender-page min-h-screen bg-[#f5f2ff] text-[#071653]">
      <Navbar />
      <main className="mx-auto max-w-7xl px-5 pb-20 pt-24 sm:px-8 sm:pt-28">
        <section className="grid gap-6 rounded-[28px] border border-[#e4def5] bg-white p-5 shadow-[0_18px_50px_-38px_rgba(98,100,181,.24)] sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div className="max-w-2xl">
            <p className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#6264b5]"><ShoppingBag className="h-4 w-4" />Riwayat transaksi</p>
            <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-[#071653] sm:text-5xl">Pesanan konsermu, <span className="text-[#6264b5]">tersusun rapi.</span></h1>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#68708a]">Pantau status pembayaran dan rincian setiap transaksi di satu tempat. Buka invoice untuk melihat detail pesanan, lanjutkan pembayaran yang masih menunggu, atau akses e-ticket setelah transaksi dinyatakan lunas.</p>
            <Link href="/home/events" className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#6264b5] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#51539f]">
              <Ticket className="h-4 w-4" /> Pesan tiket baru
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            <div className="min-w-0 rounded-2xl bg-[#f8f6ff] px-3 py-3.5 sm:px-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#68708a]">Pesanan</p><p className="mt-1 text-2xl font-bold text-[#071653]">{orders.length}</p></div>
            <div className="min-w-0 rounded-2xl bg-[#f0f6f2] px-3 py-3.5 sm:px-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#397557]">Lunas</p><p className="mt-1 text-2xl font-bold text-[#245d43]">{paidCount}</p></div>
            <div className="min-w-0 rounded-2xl bg-[#f8f6ff] px-3 py-3.5 sm:px-4"><p className="text-[9px] font-bold uppercase tracking-wider text-[#68708a]">Menunggu</p><p className="mt-1 text-2xl font-bold text-[#071653]">{pendingCount}</p></div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] border border-[#e4def5] bg-white p-4 shadow-[0_18px_50px_-38px_rgba(98,100,181,.2)] sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[.18em] text-[#6264b5]">Riwayat akunmu</p>
              <h2 className="mt-1 text-lg font-extrabold">Daftar pesanan</h2>
            </div>
            <p className="max-w-sm text-xs leading-5 text-[#68708a]">Pilih status untuk menyaring riwayat. Pesanan menunggu dapat dilanjutkan pembayarannya, sedangkan pesanan lunas menyediakan akses ke e-ticket.</p>
          </div>
          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {FILTERS.map(({ id, label, icon: Icon }) => {
              const count = id === "all" ? orders.length : orders.filter((order) =>
                (isOrderExpired(order, now) ? "cancelled" : order.status) === id,
              ).length;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedStatus(id)}
                  aria-pressed={selectedStatus === id}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                    selectedStatus === id ? "bg-[#6264b5] text-white" : "border border-[#e8e5ef] bg-[#fffdf2] text-[#5c6482] hover:border-[#c8b7db]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" /> {label}<span className="opacity-70">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-6">
          {!loading && !loadError && filteredOrders.length > 0 ? <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-white/75 px-1 py-2">
            <p className="text-sm text-[#68708a]">Menampilkan <strong className="text-[#071653]">{filteredOrders.length}</strong> pesanan</p>
            <p className="text-xs text-[#68708a]">Total pembayaran lunas: <strong className="text-[#071653]">{new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(totalSpent)}</strong></p>
          </div> : null}
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
              {filteredOrders.map((order) => <OrderCard key={order.id} order={order} now={now} />)}
            </div>
          ) : (
            <EmptyState
              icon={ShoppingBag}
              title="Belum ada pesanan"
              description="Pesanan dengan status ini akan muncul di sini setelah kamu memilih konser. Cek filter yang dipilih, atau jelajahi jadwal konser untuk membuat pesanan baru."
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
