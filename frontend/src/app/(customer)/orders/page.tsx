"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle2, 
  Filter, 
  Sparkles, 
  Ticket,
  Plus
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { fetchMyOrders, MOCK_ORDERS } from "@/features/orders/api";
import { Order } from "@/features/orders/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { Loading } from "@/components/shared/Loading";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(MOCK_ORDERS);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  const statuses = [
    { id: "all", label: "Semua Pesanan" },
    { id: "pending", label: "Menunggu Pembayaran" },
    { id: "paid", label: "Lunas (Paid)" },
  ];

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus === "all") return true;
    return o.status === selectedStatus;
  });

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <Badge variant="gradient" className="gap-1.5 mb-2">
              <ShoppingBag className="h-3.5 w-3.5" />
              Riwayat Transaksi
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-white">
              Pesanan Tiket Saya
            </h1>
            <p className="text-xs text-white/50 mt-1">
              Pantau status verifikasi pembayaran dan unduh bukti e-ticket kamu di sini.
            </p>
          </div>

          <Link href="/events">
            <Button variant="glow" size="sm" className="gap-1.5 text-xs">
              <Plus className="h-4 w-4" />
              Pesan Tiket Baru
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {statuses.map((s) => {
            const isSelected = selectedStatus === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
                  isSelected
                    ? "border border-purple-500 bg-purple-600 text-white shadow-md shadow-purple-600/30"
                    : "border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Orders List */}
        {loading ? (
          <Loading message="Memuat riwayat transaksi..." />
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="Tidak Ada Pesanan"
            description="Belum ada transaksi pemesanan tiket dengan status ini."
            actionLabel="Eksplorasi Konser"
            actionHref="/events"
          />
        )}

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
