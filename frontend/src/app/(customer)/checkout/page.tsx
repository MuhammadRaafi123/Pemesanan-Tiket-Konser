"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  CreditCard,
  MapPin,
  Minus,
  Plus,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Ticket,
  Trash2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/shared/ToastProvider";
import { createOrder } from "@/features/orders/api";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";

export default function CheckoutPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const { items, updateQty, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const { success, error } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      error("Keranjang tiketmu masih kosong.");
      return;
    }

    if (!user) {
      error("Silakan masuk terlebih dahulu untuk melanjutkan checkout.");
      router.push("/login?next=/checkout");
      return;
    }

    setIsSubmitting(true);

    try {
      const order = await createOrder({
        items: items.map((item) => ({
          ticket_category_id: item.ticketCategoryId,
          qty: item.qty,
        })),
      });

      clearCart();
      success(`Pesanan #${order.order_code} berhasil dibuat.`);
      router.push(`/payments/${order.id}`);
    } catch (requestError: unknown) {
      error(getApiErrorMessage(requestError, "Gagal membuat pesanan. Silakan coba lagi."));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout-page min-h-screen overflow-hidden bg-[#f5f2ff] text-[#211a39]">
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl px-5 pb-28 pt-28 sm:px-8 sm:pt-36">
        <div className="pointer-events-none absolute -right-36 top-24 h-96 w-96 rounded-full bg-[#d9ceff]/50 blur-3xl" />
        <div className="pointer-events-none absolute -left-44 top-[28rem] h-80 w-80 rounded-full bg-[#ffd8cb]/50 blur-3xl" />

        <div className="relative mb-8 flex flex-col gap-6 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <Link href="/events" className="inline-flex items-center gap-2 text-xs font-semibold text-[#766e8d] transition hover:text-[#7048e8]">
              <ArrowLeft className="h-3.5 w-3.5" /> Kembali ke konser
            </Link>
            <p className="mt-7 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-[#7048e8]">
              <Sparkles className="h-3.5 w-3.5" /> Checkout
            </p>
            <h1 className="mt-2 font-display text-4xl tracking-[-0.05em] text-[#211a39] sm:text-5xl">Amankan momenmu.</h1>
            <p className="mt-3 max-w-lg text-sm leading-6 text-[#766e8d]">Pastikan pilihan tiket dan jumlahnya sudah benar sebelum lanjut ke pembayaran.</p>
          </div>
          <div className="flex items-center gap-3 self-start rounded-full border border-[#e4def5] bg-white/80 px-4 py-2.5 shadow-sm sm:self-auto">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#7048e8] text-white"><Check className="h-4 w-4" /></div>
            <span className="text-xs font-semibold text-[#51486c]">1. Pilih tiket</span>
            <span className="h-px w-7 bg-[#d9d0eb]" />
            <span className="text-xs font-bold text-[#7048e8]">2. Checkout</span>
            <span className="h-px w-7 bg-[#d9d0eb]" />
            <span className="text-xs font-semibold text-[#a39bb5]">3. Bayar</span>
          </div>
        </div>

        {items.length === 0 ? (
          <section className="relative mx-auto max-w-xl overflow-hidden rounded-[32px] border border-white bg-white/90 p-8 text-center shadow-[0_30px_90px_-48px_rgba(67,45,126,.34)] sm:p-12">
            <div className="absolute inset-x-0 top-0 h-2 bg-linear-to-r from-[#7048e8] via-[#a889ff] to-[#ff987d]" />
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[22px] bg-[#f0ebff] text-[#7048e8]"><ShoppingBag className="h-7 w-7" /></div>
            <h2 className="mt-6 font-display text-3xl text-[#211a39]">Keranjangmu masih kosong</h2>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[#766e8d]">Pilih konser dan tiket favoritmu, lalu kami siapkan tempat untuk momen spesialmu.</p>
            <Link href="/events" className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#7048e8] px-6 py-3 text-sm font-bold text-white shadow-[0_12px_24px_-12px_rgba(112,72,232,.8)] transition hover:bg-[#5c36d2]">Jelajahi konser <ArrowRight className="h-4 w-4" /></Link>
          </section>
        ) : (
          <div className="relative grid items-start gap-6 lg:grid-cols-[1.35fr_.75fr]">
            <section className="rounded-[30px] border border-white bg-white/90 p-5 shadow-[0_24px_80px_-48px_rgba(67,45,126,.3)] backdrop-blur sm:p-7">
              <div className="flex items-center justify-between gap-4 border-b border-[#eeeaf6] pb-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#9a91ae]">Pilihan kamu</p>
                  <h2 className="mt-1 flex items-center gap-2 text-lg font-bold text-[#211a39]"><Ticket className="h-5 w-5 text-[#7048e8]" /> Tiket konser</h2>
                </div>
                <span className="rounded-full bg-[#f0ebff] px-3.5 py-2 text-xs font-bold text-[#7048e8]">{totalItems} tiket</span>
              </div>

              <div className="mt-5 space-y-4">
                {items.map((item) => (
                  <article key={item.ticketCategoryId} className="group relative overflow-hidden rounded-[24px] border border-[#e9e4f3] bg-[#fcfbff] transition hover:border-[#cfc0ff] hover:shadow-[0_16px_36px_-28px_rgba(112,72,232,.6)]">
                    <div className="absolute bottom-0 left-0 top-0 w-1 bg-linear-to-b from-[#7048e8] to-[#ff987d] opacity-70 transition group-hover:opacity-100" />
                    <div className="flex flex-col gap-5 p-4 pl-5 sm:flex-row sm:items-center sm:justify-between sm:p-5 sm:pl-6">
                      <div className="min-w-0 flex-1">
                        <span className="inline-flex rounded-full bg-[#f0ebff] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[.16em] text-[#7048e8]">{item.categoryName}</span>
                        <h3 className="mt-3 truncate text-lg font-bold text-[#211a39]">{item.eventTitle}</h3>
                        <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-[#817994]">
                          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-[#a38ae9]" />{item.eventLocation}</span>
                          <span className="inline-flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-[#a38ae9]" />Tiket elektronik</span>
                        </div>
                        <p className="mt-3 text-sm font-bold text-[#51486c]">{formatCurrency(item.price)} <span className="font-medium text-[#a39bb5]">/ tiket</span></p>
                      </div>
                      <div className="flex items-center justify-between gap-4 sm:justify-end">
                        <div className="flex items-center rounded-full border border-[#e9e4f3] bg-white p-1 shadow-sm">
                          <button type="button" onClick={() => updateQty(item.ticketCategoryId, item.qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#817994] transition hover:bg-[#f0ebff] hover:text-[#7048e8]" aria-label="Kurangi jumlah"><Minus className="h-3.5 w-3.5" /></button>
                          <span className="w-9 text-center text-sm font-bold tabular-nums text-[#211a39]">{item.qty}</span>
                          <button type="button" onClick={() => updateQty(item.ticketCategoryId, item.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#817994] transition hover:bg-[#f0ebff] hover:text-[#7048e8]" aria-label="Tambah jumlah"><Plus className="h-3.5 w-3.5" /></button>
                        </div>
                        <button type="button" onClick={() => removeItem(item.ticketCategoryId)} className="flex h-10 w-10 items-center justify-center rounded-full border border-[#eeeaf6] bg-white text-[#a39bb5] transition hover:border-[#ffd4cf] hover:bg-[#fff1ef] hover:text-[#df6659]" aria-label="Hapus dari keranjang"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              <Link href="/events" className="mt-5 inline-flex items-center gap-2 px-1 text-xs font-bold text-[#7048e8] transition hover:text-[#4f2bc4]"><Plus className="h-4 w-4" /> Tambah tiket lain</Link>
            </section>

            <aside className="overflow-hidden rounded-[30px] bg-[#241b3e] text-white shadow-[0_28px_70px_-30px_rgba(40,26,77,.6)]">
              <div className="relative overflow-hidden p-6 sm:p-7">
                <div className="absolute -right-16 -top-24 h-56 w-56 rounded-full bg-[#7048e8]/40 blur-3xl" />
                <div className="relative">
                  <p className="text-[10px] font-bold uppercase tracking-[.22em] text-[#c0b2f0]">Rincian pembayaran</p>
                  <h2 className="mt-2 font-display text-2xl">Hampir jadi!</h2>
                  <div className="mt-6 space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4 text-[#c7c0d6]"><span>Subtotal tiket <span className="text-[#958ba9]">({totalItems} tiket)</span></span><span className="font-semibold text-white">{formatCurrency(totalPrice)}</span></div>
                    <div className="flex items-center justify-between gap-4 text-[#c7c0d6]"><span>Biaya layanan</span><span className="font-semibold text-[#b8efcf]">Termasuk</span></div>
                  </div>
                  <div className="my-5 border-t border-white/10" />
                  <div className="flex items-end justify-between gap-4">
                    <span className="pb-1 text-xs font-semibold text-[#c7c0d6]">Total pembayaran</span>
                    <span className="font-display text-3xl tracking-tight text-white">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="mt-5 flex gap-3 rounded-2xl border border-[#b99fff]/20 bg-[#9673ff]/10 p-3.5 text-left">
                    <QrCode className="mt-0.5 h-4 w-4 shrink-0 text-[#c4b2ff]" />
                    <div>
                      <p className="text-xs font-bold text-white">QR demo tersedia setelah pesanan dibuat</p>
                      <p className="mt-1 text-[10px] leading-4 text-[#bdb3d2]">Pindai QR di halaman berikutnya, lalu tekan simulasi pembayaran. Tidak ada saldo sungguhan yang ditagih.</p>
                    </div>
                  </div>
                  <button type="button" onClick={handlePlaceOrder} disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-linear-to-r from-[#9673ff] to-[#7048e8] px-5 py-3.5 text-sm font-bold text-white shadow-[0_12px_30px_-12px_rgba(145,109,255,.85)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60">
                    {isSubmitting ? "Memproses pesanan..." : "Lanjut ke pembayaran"}
                    {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                  </button>
                  <p className="mt-3 text-center text-[10px] leading-5 text-[#a69db9]">Pesanan ditahan selama 15 menit setelah dibuat.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-white/10 bg-white/5">
                <div className="flex items-center gap-2.5 px-5 py-4 text-[10px] font-semibold text-[#d3cde0]"><ShieldCheck className="h-4 w-4 shrink-0 text-[#9c82f4]" /> Checkout aman</div>
                <div className="flex items-center gap-2.5 border-l border-white/10 px-5 py-4 text-[10px] font-semibold text-[#d3cde0]"><CreditCard className="h-4 w-4 shrink-0 text-[#ffad91]" /> Pembayaran mudah</div>
              </div>
            </aside>
          </div>
        )}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
