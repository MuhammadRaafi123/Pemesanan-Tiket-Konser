"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Trash2,
  User,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/shared/ToastProvider";
import { createOrder } from "@/features/orders/api";
import { EmptyState } from "@/components/shared/EmptyState";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";

export default function CheckoutPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { items, updateQty, removeItem, clearCart, getTotalPrice, getTotalItems } = useCartStore();
  const { success, error } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const grandTotal = totalPrice;

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      error("Keranjang belanja tiketmu masih kosong.");
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
      success(`Pesanan #${order.order_code} berhasil dibuat!`);
      router.push(`/payments/${order.id}`);
    } catch (requestError: unknown) {
      error(getApiErrorMessage(requestError, "Gagal membuat pesanan. Silakan coba lagi."));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pb-24 pt-32">
          <EmptyState
            icon={ShoppingBag}
            title="Keranjang tiket kosong"
            description="Kamu belum memilih tiket konser. Yuk eksplorasi konser musik seru sekarang!"
            actionLabel="Jelajahi konser"
            actionHref="/events"
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <PageHeader
          eyebrow="Langkah terakhir"
          title="Checkout & pembayaran"
          description="Periksa kembali tiket dan data pemesanmu sebelum menyelesaikan pesanan."
          actions={
            <Link href="/events">
              <Button variant="secondary" className="gap-1.5">
                <ShoppingBag className="h-4 w-4" />
                Tambah tiket lain
              </Button>
            </Link>
          }
        />

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-7">
            <Reveal>
              <section className="rounded-[28px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-8">
                <div className="flex items-center justify-between gap-4">
                  <h2 className="flex items-center gap-2.5">
                    <Ticket className="h-4 w-4 text-primary" />
                    <span className="font-display text-xl text-ink">Tiket pilihanmu</span>
                  </h2>
                  <span className="numeral text-sm text-primary">{totalItems} tiket</span>
                </div>

                <Stagger className="mt-6 space-y-3" step={70}>
                  {items.map((item) => (
                    <div
                      key={item.ticketCategoryId}
                      className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/40 p-4 transition-colors duration-300 hover:border-primary/20 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="meta-label">{item.categoryName}</p>
                        <h3 className="font-display mt-1.5 text-lg leading-snug text-ink">{item.eventTitle}</h3>
                        <p className="mt-1 text-xs text-muted-foreground">{item.eventLocation}</p>
                        <p className="numeral mt-2 text-sm text-primary">
                          {formatCurrency(item.price)} / tiket
                        </p>
                      </div>

                      <div className="flex items-center justify-between gap-3 border-t border-border pt-3 sm:border-t-0 sm:pt-0">
                        <div className="flex items-center rounded-full border border-border bg-white p-1">
                          <button
                            type="button"
                            onClick={() => updateQty(item.ticketCategoryId, item.qty - 1)}
                            aria-label="Kurangi jumlah"
                            className="press flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-primary"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="numeral w-8 text-center text-sm text-ink">{item.qty}</span>
                          <button
                            type="button"
                            onClick={() => updateQty(item.ticketCategoryId, item.qty + 1)}
                            aria-label="Tambah jumlah"
                            className="press flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition hover:bg-accent hover:text-primary"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.ticketCategoryId)}
                          aria-label="Hapus dari pesanan"
                          className="press flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </Stagger>
              </section>
            </Reveal>

            <Reveal delay={80}>
              <section className="rounded-[28px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-8">
                <h2 className="flex items-center gap-2.5">
                  <User className="h-4 w-4 text-primary" />
                  <span className="font-display text-xl text-ink">Data akun pemesan</span>
                </h2>
                <p className="mt-2 text-xs leading-6 text-muted-foreground">
                  Pesanan dan tiket digital akan terhubung ke akun ini. Pastikan data kontakmu sudah benar.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    { label: "Nama pemesan", value: user?.name },
                    { label: "Email akun", value: user?.email },
                    { label: "Nomor telepon", value: user?.phone },
                  ].map((detail) => (
                    <div key={detail.label} className="rounded-xl border border-border bg-muted/40 p-4">
                      <p className="meta-label">{detail.label}</p>
                      <p className="mt-1.5 truncate text-sm font-semibold text-ink">
                        {detail.value || "Belum diisi"}
                      </p>
                    </div>
                  ))}
                  <Link
                    href="/profile"
                    className="flex items-center justify-center rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3 text-xs font-semibold text-primary transition hover:bg-primary/[0.08]"
                  >
                    Perbarui data akun
                  </Link>
                </div>
              </section>
            </Reveal>
          </div>

          <Reveal variant="left" delay={100} className="lg:col-span-5">
            <div className="lg:sticky lg:top-28">
              <section className="rounded-[28px] border border-border bg-white p-6 shadow-[0_2px_6px_rgba(10,27,51,.05),0_40px_90px_-46px_rgba(13,38,84,.5)] sm:p-8">
                <div className="flex items-center justify-between border-b border-border pb-5">
                  <h2 className="flex items-center gap-2.5">
                    <ShoppingBag className="h-4 w-4 text-primary" />
                    <span className="font-display text-xl text-ink">Ringkasan</span>
                  </h2>
                  <span className="text-xs font-semibold text-primary">{totalItems} tiket</span>
                </div>

                <dl className="mt-6 space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between gap-4">
                    <dt>Subtotal tiket</dt>
                    <dd className="numeral text-ink">{formatCurrency(totalPrice)}</dd>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <dt>Biaya layanan</dt>
                    <dd className="font-semibold text-emerald-600">Termasuk harga tiket</dd>
                  </div>

                  <div className="mt-5 flex items-end justify-between gap-4 border-t border-border pt-5">
                    <dt className="text-sm font-semibold text-ink">Total pembayaran</dt>
                    <dd className="numeral text-2xl text-ink">{formatCurrency(grandTotal)}</dd>
                  </div>
                </dl>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-4 text-xs leading-6 text-emerald-800">
                  <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0" />
                  Stok dikonfirmasi saat pesanan dibuat. Tiket digital aktif setelah pembayaran diverifikasi.
                </div>

                <Button onClick={handlePlaceOrder} isLoading={isSubmitting} size="lg" className="mt-6 w-full gap-2">
                  Buat pesanan · {formatCurrency(grandTotal)}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </section>
            </div>
          </Reveal>
        </div>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
