"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, 
  Ticket, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  ChevronLeft
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/shared/ToastProvider";
import { createOrder } from "@/features/orders/api";
import { EmptyState } from "@/components/shared/EmptyState";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, updateQty, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const { success, error } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      error("Keranjang belanja tiketmu masih kosong.");
      return;
    }

    if (!user) {
      error("Silakan masuk terlebih dahulu untuk memesan tiket.");
      router.push("/login?next=/checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        items: items.map((i) => ({
          ticket_category_id: i.ticketCategoryId,
          qty: i.qty,
        })),
      };

      const order = await createOrder(orderPayload);
      clearCart();
      success(`Pesanan #${order.order_code} berhasil dibuat!`);
      router.push(`/payments/${order.id}`);
    } catch {
      error("Gagal membuat pesanan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="light-app min-h-screen bg-[#f4f8ff] text-[#123b6d] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-28 pb-20 px-4">
          <EmptyState
            icon={ShoppingBag}
            title="Keranjang Tiket Kosong"
            description="Kamu belum memilih tiket konser. Yuk eksplorasi konser musik seru sekarang!"
            actionLabel="Jelajahi Konser"
            actionHref="/events"
          />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="light-app min-h-screen bg-[#f4f8ff] text-[#123b6d] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-blue-100 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2563eb] mb-1">
              <Sparkles className="h-4 w-4 text-sky-600" />
              Langkah Terakhir Booking
            </div>
            <h1 className="text-3xl font-black tracking-tight text-[#123b6d]">
              Checkout & Pembayaran Tiket
            </h1>
          </div>

          <Link href="/events">
            <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
              <ChevronLeft className="h-4 w-4" />
              Tambah Tiket Lain
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Order Items & Customer Info & Payment Method */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* Ticket Items List */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-[#123b6d] flex items-center gap-2">
                <Ticket className="h-5 w-5 text-[#2563eb]" />
                Daftar Tiket ({totalItems} Tiket)
              </h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <CardSpotlight
                    key={item.ticketCategoryId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-blue-100"
                  >
                    <div className="space-y-1 flex-1">
                      <Badge variant="gradient" className="text-[10px] py-0 px-2">
                        {item.categoryName}
                      </Badge>
                      <h4 className="font-bold text-[#123b6d] text-base leading-tight">
                        {item.eventTitle}
                      </h4>
                      <p className="text-xs text-[#8aa4c1]">{item.eventLocation}</p>
                      <p className="text-sm font-black text-[#2563eb] pt-1">
                        Rp {item.price.toLocaleString("id-ID")} / tiket
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-blue-100 pt-3 sm:pt-0">
                      {/* Stepper */}
                      <div className="flex items-center rounded-xl border border-blue-200 bg-blue-50 p-1">
                        <button
                          onClick={() => updateQty(item.ticketCategoryId, item.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6683a3] hover:bg-blue-50 hover:text-[#2563eb] transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-[#123b6d]">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.ticketCategoryId, item.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-[#6683a3] hover:bg-blue-50 hover:text-[#2563eb] transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.ticketCategoryId)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-50 text-[#8aa4c1] hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Hapus dari pesanan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardSpotlight>
                ))}
              </div>
            </div>

            <CardSpotlight className="space-y-3 border-blue-100">
              <h3 className="font-bold text-[#123b6d]">Akun pemesan</h3>
              <p className="text-sm text-[#6683a3]">Pesanan ini akan tercatat untuk {user?.name || "akun kamu"} ({user?.email || "akun pelanggan"}). Setelah reservasi berhasil, kamu akan memilih metode transfer dan mengunggah bukti pembayaran.</p>
            </CardSpotlight>

          </div>

          {/* Right: Sticky Summary Box */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <CardSpotlight className="space-y-5 border-blue-200 bg-white shadow-2xl backdrop-blur-2xl">
              
              <div className="flex items-center justify-between border-b border-blue-100 pb-4">
                <h3 className="text-base font-black text-[#123b6d] flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-[#2563eb]" />
                  Ringkasan Pembayaran
                </h3>
                <span className="text-xs text-[#2563eb] font-semibold">{totalItems} Tiket</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-[#6683a3]">
                <div className="flex justify-between">
                  <span>Subtotal Tiket ({totalItems}x)</span>
                  <span className="font-semibold text-[#123b6d]">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>

                <div className="pt-3 border-t border-blue-100 flex items-center justify-between text-base">
                  <span className="font-bold text-[#123b6d]">Total Pembayaran</span>
                  <span className="font-black text-xl text-[#2563eb]">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 flex items-center gap-2.5 text-xs text-emerald-700">
                <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
                <span>Transaksi diamankan dengan enkripsi SSL 256-bit dan jaminan tiket resmi 100%.</span>
              </div>

              {/* Action Button */}
              <Button
                onClick={handlePlaceOrder}
                isLoading={isSubmitting}
                variant="glow"
                size="lg"
                className="w-full text-base gap-2"
              >
                <span>Reservasi & lanjut bayar (Rp {totalPrice.toLocaleString("id-ID")})</span>
                <ArrowRight className="h-4 w-4" />
              </Button>

            </CardSpotlight>
          </div>

        </div>

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
