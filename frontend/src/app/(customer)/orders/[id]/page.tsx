"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
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
          setLoadError(
            getApiErrorMessage(requestError, "Gagal memuat detail pesanan.")
          );
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
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <div className="flex items-center gap-3 rounded-2xl border border-[#232733] bg-[#141720] px-5 py-4 text-sm font-medium text-white shadow-2xl">
            <Loader2 className="h-5 w-5 animate-spin text-[#ffb703]" />
            Memuat detail pesanan...
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <div className="max-w-md rounded-[28px] border border-[#232733] bg-[#141720] p-8 text-center shadow-2xl">
            <h1 className="text-2xl font-bold text-white">
              {loadError ? "Pesanan gagal dimuat" : "Pesanan tidak ditemukan"}
            </h1>
            <p className="mt-3 text-sm text-[#8a8d9b]">
              {loadError || "Data nomor pesanan tidak valid atau telah dihapus."}
            </p>
            <Link
              href="/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-sm font-semibold text-[#10131a] transition hover:bg-[#ffdea9]"
            >
              Kembali ke daftar pesanan
            </Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#0b0e15] text-[#e1e2ec] selection:bg-[#ffb703]/30 selection:text-white">
      <Navbar />

      <main className="relative mx-auto w-full max-w-4xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        {/* ── ambient background ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-40 h-60 w-60 rounded-full bg-[#ffb703]/[0.04] blur-[100px]" />
          <div className="absolute -right-32 top-80 h-48 w-48 rounded-full bg-[#6801d1]/[0.05] blur-[80px]" />
        </div>

        <Reveal className="relative mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-4 py-2.5 text-sm font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/30 hover:text-[#ffb703]"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali ke daftar pesanan
          </Link>
        </Reveal>

        <div className="relative">
          <OrderCard order={order} />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
