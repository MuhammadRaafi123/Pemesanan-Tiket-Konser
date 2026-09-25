"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ShoppingBag, Plus } from "lucide-react";
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
    <div className="light-app min-h-screen bg-[#f4f8ff] text-[#123b6d] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-6">
          <div>
            <Badge variant="gradient" className="gap-1.5 mb-2">
              <ShoppingBag className="h-3.5 w-3.5" />
              Riwayat Transaksi
            </Badge>
            <h1 className="text-3xl font-black tracking-tight text-[#123b6d]">
              Pesanan Tiket Saya
            </h1>
            <p className="text-xs text-[#8aa4c1] mt-1">
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
                    ? "border border-blue-500 bg-blue-600 text-white shadow-md shadow-blue-200"
                    : "border border-blue-100 bg-white text-[#6683a3] hover:bg-blue-50 hover:text-[#2563eb]"
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
