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
  CreditCard, 
  User, 
  Mail, 
  Phone,
  ChevronLeft
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { PaymentMethodSelector } from "@/features/payments/components/PaymentMethodSelector";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  const [selectedMethod, setSelectedMethod] = useState<string>("QRIS");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customer info state
  const [customerName, setCustomerName] = useState(user?.name || "Muhammad Rafi");
  const [customerEmail, setCustomerEmail] = useState(user?.email || "rafi@concertix.id");
  const [customerPhone, setCustomerPhone] = useState(user?.phone || "081234567890");

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const adminFee = 15000;
  const grandTotal = totalPrice + (totalItems > 0 ? adminFee : 0);

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      error("Keranjang belanja tiketmu masih kosong.");
      return;
    }

    if (!customerName || !customerEmail || !customerPhone) {
      error("Harap lengkapi informasi data pemesan tiket.");
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
      <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
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
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-purple-400 mb-1">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              Langkah Terakhir Booking
            </div>
            <h1 className="text-3xl font-black tracking-tight text-white">
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
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket className="h-5 w-5 text-purple-400" />
                Daftar Tiket ({totalItems} Tiket)
              </h3>

              <div className="space-y-3">
                {items.map((item) => (
                  <CardSpotlight
                    key={item.ticketCategoryId}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-white/10"
                  >
                    <div className="space-y-1 flex-1">
                      <Badge variant="gradient" className="text-[10px] py-0 px-2">
                        {item.categoryName}
                      </Badge>
                      <h4 className="font-bold text-white text-base leading-tight">
                        {item.eventTitle}
                      </h4>
                      <p className="text-xs text-white/50">{item.eventLocation}</p>
                      <p className="text-sm font-black text-purple-300 pt-1">
                        Rp {item.price.toLocaleString("id-ID")} / tiket
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      {/* Stepper */}
                      <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-1">
                        <button
                          onClick={() => updateQty(item.ticketCategoryId, item.qty - 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-7 text-center text-xs font-bold text-white">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.ticketCategoryId, item.qty + 1)}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white transition"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>

                      {/* Remove */}
                      <button
                        onClick={() => removeItem(item.ticketCategoryId)}
                        className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-white/40 hover:bg-rose-500/20 hover:text-rose-400 transition"
                        title="Hapus dari pesanan"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </CardSpotlight>
                ))}
              </div>
            </div>

            {/* Customer Contact Details */}
            <CardSpotlight className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <User className="h-5 w-5 text-cyan-400" />
                Data Pemesan Tiket (Identitas E-Ticket)
              </h3>
              <p className="text-xs text-white/50">
                Nama dan email ini akan dicantumkan secara resmi pada E-Ticket digital QR Code kamu.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-bold text-white/70">Nama Lengkap (Sesuai KTP/Paspor)</label>
                  <Input
                    icon={<User className="h-4 w-4" />}
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Contoh: Muhammad Rafi"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70">Email Penerima Tiket</label>
                  <Input
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="nama@email.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-white/70">Nomor WhatsApp / HP</label>
                  <Input
                    type="tel"
                    icon={<Phone className="h-4 w-4" />}
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="081234567890"
                  />
                </div>
              </div>
            </CardSpotlight>

            {/* Payment Method Selector */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-pink-400" />
                Pilih Metode Pembayaran
              </h3>

              <PaymentMethodSelector
                selectedMethod={selectedMethod}
                onSelect={setSelectedMethod}
              />
            </div>

          </div>

          {/* Right: Sticky Summary Box */}
          <div className="lg:col-span-5 sticky top-28 space-y-6">
            <CardSpotlight className="space-y-5 border-purple-500/30 bg-[#0e0e1a]/95 shadow-2xl backdrop-blur-2xl">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-base font-black text-white flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4 text-purple-400" />
                  Ringkasan Pembayaran
                </h3>
                <span className="text-xs text-purple-300 font-semibold">{totalItems} Tiket</span>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2.5 text-xs text-white/70">
                <div className="flex justify-between">
                  <span>Subtotal Tiket ({totalItems}x)</span>
                  <span className="font-semibold text-white">Rp {totalPrice.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between">
                  <span>Biaya Layanan & Admin</span>
                  <span className="font-semibold text-white">Rp {adminFee.toLocaleString("id-ID")}</span>
                </div>

                <div className="flex justify-between text-emerald-400">
                  <span>Asuransi Pembeli & Garansi Resmi</span>
                  <span className="font-semibold">GRATIS</span>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-base">
                  <span className="font-bold text-white">Total Pembayaran</span>
                  <span className="font-black text-xl text-purple-300">
                    Rp {grandTotal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-3 flex items-center gap-2.5 text-xs text-emerald-300">
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
                <span>Bayar Sekarang (Rp {grandTotal.toLocaleString("id-ID")})</span>
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
