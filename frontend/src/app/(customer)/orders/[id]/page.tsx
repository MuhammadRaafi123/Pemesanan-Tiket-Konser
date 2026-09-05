"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { fetchOrderById } from "@/features/orders/api";
import { Order } from "@/features/orders/types";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";

export default function SingleOrderPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderById(id).then((data) => {
        setOrder(data);
        setLoading(false);
      });
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loading message="Memuat detail pesanan..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24 px-4">
          <ErrorState
            title="Pesanan Tidak Ditemukan"
            message="Data nomor pesanan tidak valid atau telah dihapus."
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-6">
        <div>
          <Link href="/orders">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <ChevronLeft className="h-4 w-4" />
              Kembali ke Daftar Pesanan
            </Button>
          </Link>
        </div>

        <OrderCard order={order} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
