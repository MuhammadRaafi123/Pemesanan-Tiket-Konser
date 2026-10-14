"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
import { Button } from "@/components/ui/button";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Reveal } from "@/components/shared/Reveal";
import { fetchOrderById } from "@/features/orders/api";
import type { Order } from "@/features/orders/types";
import { getApiErrorMessage } from "@/lib/apiError";

export default function SingleOrderPage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let active = true;
    if (!id) return;

    fetchOrderById(id)
      .then((data) => {
        if (active) setOrder(data);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setLoadError(getApiErrorMessage(requestError, "Gagal memuat detail pesanan."));
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <Loading message="Memuat detail pesanan..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <ErrorState
            title={loadError ? "Pesanan gagal dimuat" : "Pesanan tidak ditemukan"}
            message={loadError || "Data nomor pesanan tidak valid atau telah dihapus."}
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-4xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <Reveal className="mb-8">
          <Link href="/orders">
            <Button variant="secondary" className="gap-1.5">
              <ChevronLeft className="h-4 w-4" />
              Kembali ke daftar pesanan
            </Button>
          </Link>
        </Reveal>

        <OrderCard order={order} />
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
