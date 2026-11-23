"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { OrderCard } from "@/features/orders/components/OrderCard";
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
  const [now, setNow] = useState(0);

  useEffect(() => {
    const timer = window.setTimeout(() => setNow(Date.now()), 0);
    return () => window.clearTimeout(timer);
  }, []);

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
      <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <div className="flex items-center gap-3 px-5 py-4 text-sm font-medium text-[#6264b5]">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-[#c8b7db] border-t-[#6264b5]" />
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
      <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <div className="max-w-md rounded-[28px] border border-[#e8e5ef] bg-white p-8 text-center shadow-xl">
            <h1 className="text-2xl font-bold text-[#071653]">
              {loadError ? "Pesanan gagal dimuat" : "Pesanan tidak ditemukan"}
            </h1>
            <p className="mt-3 text-sm text-[#5c6482]">
              {loadError || "Data nomor pesanan tidak valid atau telah dihapus."}
            </p>
            <Link
              href="/orders"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#6264b5] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#51539f]"
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
    <div className="landing-page flex min-h-screen flex-col bg-[#fffdf2] text-[#071653] selection:bg-[#6264b5]/25 selection:text-[#071653]">
      <Navbar />

      <main className="relative mx-auto w-full max-w-4xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        {/* ── ambient background ── */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-40 h-60 w-60 rounded-full bg-[#c8b7db]/30 blur-[100px]" />
          <div className="absolute -right-32 top-80 h-48 w-48 rounded-full bg-[#e6eefb]/50 blur-[80px]" />
        </div>

        <Reveal className="relative mb-8">
          <Link
            href="/orders"
            className="inline-flex items-center gap-2 rounded-xl border border-[#e8e5ef] bg-white px-4 py-2.5 text-sm font-semibold text-[#071653] transition hover:border-[#c8b7db] hover:text-[#6264b5]"
          >
            <ChevronLeft className="h-4 w-4" />
            Kembali ke daftar pesanan
          </Link>
        </Reveal>

        <div className="relative">
          <OrderCard order={order} now={now} />
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
