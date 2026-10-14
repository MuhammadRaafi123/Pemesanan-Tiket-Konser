"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Minus, Plus, ShoppingBag, Ticket, Trash2 } from "lucide-react";
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

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-[#f4f8ff] text-[#102a43]">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-5 pb-24 pt-32">
          <div className="max-w-md rounded-[28px] border border-blue-100 bg-white p-8 text-center shadow-[0_30px_80px_-40px_rgba(37,99,235,0.35)]">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-[#2563eb]">
              <ShoppingBag className="h-7 w-7" />
            </div>
            <h1 className="mt-6 text-2xl font-bold text-[#123b6d]">Keranjang tiket kosong</h1>
            <p className="mt-3 text-sm text-[#5c789b]">Belum ada tiket yang kamu pilih. Jelajahi konser yang tersedia dan tambahkan tiket ke keranjang.</p>
            <Link href="/events" className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white">Jelajahi konser <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f8ff] text-[#102a43]">
      <Navbar />
      <main className="mx-auto w-full max-w-6xl px-5 pb-24 pt-28 sm:px-8 sm:pt-36">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2563eb]">Checkout</p>
            <h1 className="mt-3 font-display text-4xl tracking-[-0.05em] text-[#123b6d]">Ringkasan pesanan</h1>
          </div>
          <Link href="/events" className="inline-flex items-center gap-2 rounded-xl border border-blue-200 bg-white px-4 py-2 text-xs font-semibold text-[#123b6d]">Tambah tiket lain</Link>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.7fr]">
          <section className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_25px_80px_-40px_rgba(37,99,235,0.35)] sm:p-7">
            <div className="flex items-center justify-between gap-3 border-b border-blue-100 pb-4">
              <h2 className="flex items-center gap-2 text-lg font-bold text-[#123b6d]"><Ticket className="h-5 w-5 text-[#2563eb]" /> Tiket pilihanmu</h2>
              <span className="text-sm font-semibold text-[#2563eb]">{totalItems} tiket</span>
            </div>

            <div className="mt-5 space-y-4">
              {items.map((item) => (
                <div key={item.ticketCategoryId} className="rounded-2xl border border-blue-100 bg-[#f8fbff] p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#5c789b]">{item.categoryName}</p>
                      <h3 className="mt-2 text-lg font-bold text-[#123b6d]">{item.eventTitle}</h3>
                      <p className="mt-1 text-xs text-[#5c789b]">{item.eventLocation}</p>
                      <p className="mt-2 text-sm font-semibold text-[#2563eb]">{formatCurrency(item.price)} / tiket</p>
                    </div>

                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <div className="flex items-center rounded-full border border-blue-100 bg-white p-1">
                        <button type="button" onClick={() => updateQty(item.ticketCategoryId, item.qty - 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#5c789b] transition hover:bg-blue-50 hover:text-[#2563eb]" aria-label="Kurangi jumlah">
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-9 text-center text-sm font-semibold text-[#123b6d]">{item.qty}</span>
                        <button type="button" onClick={() => updateQty(item.ticketCategoryId, item.qty + 1)} className="flex h-8 w-8 items-center justify-center rounded-full text-[#5c789b] transition hover:bg-blue-50 hover:text-[#2563eb]" aria-label="Tambah jumlah">
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <button type="button" onClick={() => removeItem(item.ticketCategoryId)} className="flex h-9 w-9 items-center justify-center rounded-full border border-blue-100 bg-white text-[#5c789b] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600" aria-label="Hapus dari keranjang">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[28px] border border-blue-100 bg-white p-5 shadow-[0_25px_80px_-40px_rgba(37,99,235,0.35)] sm:p-7">
            <h2 className="text-lg font-bold text-[#123b6d]">Ringkasan</h2>
            <div className="mt-5 space-y-3 text-sm text-[#5c789b]">
              <div className="flex items-center justify-between gap-4"><span>Subtotal tiket</span><span className="font-semibold text-[#123b6d]">{formatCurrency(totalPrice)}</span></div>
              <div className="flex items-center justify-between gap-4"><span>Biaya layanan</span><span className="font-semibold text-emerald-600">Termasuk</span></div>
            </div>
            <div className="mt-5 border-t border-blue-100 pt-5">
              <div className="flex items-center justify-between gap-4"><span className="text-sm font-semibold text-[#123b6d]">Total pembayaran</span><span className="text-2xl font-black text-[#2563eb]">{formatCurrency(totalPrice)}</span></div>
            </div>
            <button type="button" onClick={handlePlaceOrder} disabled={isSubmitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#2563eb] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#1d4ed8] disabled:cursor-not-allowed disabled:opacity-70">
              {isSubmitting ? "Memproses..." : `Buat pesanan ? ${formatCurrency(totalPrice)}`}
              <ArrowRight className="h-4 w-4" />
            </button>
          </aside>
        </div>
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
