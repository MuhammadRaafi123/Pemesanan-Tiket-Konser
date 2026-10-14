"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, ShoppingBag } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal } from "@/components/shared/Reveal";
import { Stagger } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { Loading } from "@/components/shared/Loading";
import { fetchMyOrders } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";
import { getApiErrorMessage } from "@/lib/apiError";

const FILTERS = [
  { id: "all", label: "Semua pesanan" },
  { id: "pending", label: "Menunggu pembayaran" },
  { id: "paid", label: "Lunas" },
  { id: "rejected", label: "Ditolak" },
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
          setLoadError(getApiErrorMessage(requestError, "Gagal memuat riwayat pesanan."));
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
    selectedStatus === "all" ? true : order.status === selectedStatus,
  );

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <PageHeader
          eyebrow="Riwayat transaksi"
          title="Pesanan tiket saya"
          description="Pantau status verifikasi pembayaran dan buka e-ticket digital kamu di sini."
          actions={
            <Link href="/events">
              <Button className="gap-1.5">
                <Plus className="h-4 w-4" />
                Pesan tiket baru
              </Button>
            </Link>
          }
        />

        <Reveal className="mt-8 flex flex-wrap gap-2">
          {FILTERS.map((filter) => {
            const isSelected = selectedStatus === filter.id;
            return (
              <button
                key={filter.id}
                type="button"
                onClick={() => setSelectedStatus(filter.id)}
                aria-pressed={isSelected}
                className={`press rounded-full border px-4 py-2 text-xs font-semibold transition-all duration-300 ${
                  isSelected
                    ? "border-primary bg-primary text-white shadow-[0_10px_22px_-14px_rgba(27,69,199,.9)]"
                    : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-primary"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </Reveal>

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
            />
          )}
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
