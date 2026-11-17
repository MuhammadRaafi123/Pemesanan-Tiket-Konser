"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Crown, Minus, Plus, ShoppingBag, Ticket, Zap } from "lucide-react";
import type { Event, TicketCategory } from "../types";
import { Reveal } from "@/components/shared/Reveal";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/components/shared/ToastProvider";
import { formatCurrency } from "@/lib/format";

interface EventTicketListProps {
  event: Event;
}

const MAX_PER_ORDER = 4;

export function EventTicketList({ event }: EventTicketListProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { success, error } = useToast();

  const categories = event.ticket_categories || [];
  const [quantities, setQuantities] = useState<Record<string | number, number>>({});

  const handleQtyChange = (catId: string | number, delta: number, max: number) => {
    setQuantities((prev) => {
      const current = prev[catId] || 1;
      const next = Math.max(1, Math.min(max, current + delta));
      return { ...prev, [catId]: next };
    });
  };

  const handleBuyTicket = (cat: TicketCategory) => {
    const qty = quantities[cat.id] || 1;
    const available = cat.available ?? cat.remaining;
    if (event.status !== "open") {
      error("Penjualan tiket untuk konser ini sudah ditutup.");
      return;
    }
    if (available <= 0 || qty > available) {
      error("Stok tersedia tidak mencukupi untuk jumlah tiket yang dipilih.");
      return;
    }

    addItem(
      {
        ticketCategoryId: cat.id,
        categoryName: cat.category_name,
        price: cat.price,
        eventId: event.id,
        eventTitle: event.title,
        eventDate: event.event_date,
        eventLocation: event.location,
        eventPoster: event.poster,
        artistName: event.artists?.name,
      },
      qty,
    );

    success(`${qty}x tiket ${cat.category_name} berhasil ditambahkan ke pesanan!`);
    router.push("/checkout");
  };

  if (categories.length === 0) {
    return (
      <Reveal>
        <div className="rounded-2xl border border-dashed border-[#c8b7db] bg-white px-8 py-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-[#6264b5]" />
          <h3 className="text-xl font-bold text-[#071653]">Kategori Tiket Belum Tersedia</h3>
          <p className="mt-2 text-xs text-[#5c6482]">
            Penyelenggara belum merilis kuota tiket untuk event konser ini. Silakan pantau kembali.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <section className="space-y-5">
      <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-[#e8e5ef] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#c8b7db] bg-[#eeebf4] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#6264b5]">
            <Ticket className="h-3.5 w-3.5" />
            <span>Pilihan Tempat & Kursi</span>
          </div>
          <h2 className="mt-2.5 text-2xl font-bold tracking-tight text-[#071653] sm:text-3xl">
            Pilih Tiket
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[#5c6482] sm:text-sm">
          Pilih kategori yang sesuai dengan preferensi tempat dudukmu. Maksimal{" "}
          <strong className="text-[#6264b5]">{MAX_PER_ORDER} tiket</strong> per transaksi akun.
        </p>
      </Reveal>

      <div className="space-y-3">
        {categories.map((cat, index) => {
          const qty = quantities[cat.id] || 1;
          const available = cat.available ?? cat.remaining;
          const isEventClosed = event.status !== "open";
          const isSoldOut = available <= 0 || isEventClosed;
          const isLowStock = available > 0 && available <= 30;
          const isBest = index === 0 && !isSoldOut;
          const soldPercentage = cat.quota
            ? Math.max(0, Math.min(100, Math.round(((cat.quota - cat.remaining) / cat.quota) * 100)))
            : 0;
          const maxQty = Math.min(MAX_PER_ORDER, available);

          return (
            <Reveal
              key={cat.id}
              delay={index * 60}
              className={`group relative overflow-hidden rounded-2xl border bg-white p-5 transition-colors duration-200 sm:p-6 ${
                isBest
                  ? "border-[#c8b7db] hover:border-[#6264b5]"
                  : "border-[#e8e5ef] hover:border-[#c8b7db]"
              } ${isSoldOut ? "opacity-70" : ""}`}
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Category info & perks */}
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-lg font-bold text-[#071653] sm:text-xl">{cat.category_name}</h3>
                    {isBest ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#c8b7db] bg-[#eeebf4] px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#6264b5]">
                        <Crown className="h-3.5 w-3.5 text-[#6264b5]" />
                        Pandangan Terbaik
                      </span>
                    ) : null}
                    {isSoldOut ? (
                      <span className="rounded-full border border-[#e8e5ef] bg-[#f7f4fa] px-3 py-1 text-[10px] font-bold text-[#5c6482]">
                        {isEventClosed ? "Penjualan Ditutup" : "Habis Terjual"}
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[10px] font-bold text-rose-700 animate-pulse">
                        <Zap className="h-3 w-3" />
                        Tersisa {available} Tiket!
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#c7e0d1] bg-[#e6f1eb] px-3 py-1 text-[10px] font-bold text-[#397557]">
                        Tersedia
                      </span>
                    )}
                  </div>

                  {/* Quota Progress */}
                  <div className="max-w-md space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-[#5c6482]">
                      <span>
                        Terjual                         <strong className="text-[#071653]">{soldPercentage}%</strong>
                      </span>
                      <span>
                        Sisa kuota:                         <strong className="text-[#6264b5]">{available}</strong> / {cat.quota}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#eeebf4]">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isSoldOut
                            ? "bg-[#c8b7db]"
                            : "bg-gradient-to-r from-[#6264b5] to-[#8587c9] shadow-[0_0_12px_rgba(98,100,181,0.25)]"
                        }`}
                        style={{ width: `${Math.max(soldPercentage, 3)}%` }}
                      />
                    </div>
                  </div>

                  {/* Perks list */}
                  {cat.perks && cat.perks.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {cat.perks.map((perk) => (
                        <span
                          key={perk}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] px-3 py-1 text-xs font-semibold text-[#071653] transition hover:border-[#c8b7db]"
                        >
                          <Check className="h-3.5 w-3.5 text-[#6264b5]" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Right: Price & Stepper Button */}
                <div className="flex shrink-0 flex-col gap-3 border-t border-[#e8e5ef] pt-4 lg:w-64 lg:items-end lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                  <div className="lg:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#5c6482]">
                      Harga Per Tiket
                    </span>
                    <p className="text-xl font-bold text-[#6264b5] sm:text-2xl">
                      {formatCurrency(cat.price)}
                    </p>
                    <p className="mt-1 text-[11px] text-[#5c6482]">Sudah termasuk pajak & fee layanan</p>
                  </div>

                  <div className="flex w-full items-center gap-3 lg:justify-end">
                    {!isSoldOut ? (
                      <div className="flex items-center rounded-xl border border-[#e8e5ef] bg-[#f7f4fa] p-1 shadow-inner">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, -1, maxQty)}
                          disabled={qty <= 1}
                          aria-label="Kurangi jumlah tiket"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5c6482] transition hover:bg-[#eeebf4] hover:text-[#071653] disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-[#071653]">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, 1, maxQty)}
                          disabled={qty >= maxQty}
                          aria-label="Tambah jumlah tiket"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#5c6482] transition hover:bg-[#eeebf4] hover:text-[#071653] disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}

                    <button
                      type="button"
                      onClick={() => handleBuyTicket(cat)}
                      disabled={isSoldOut}
                      className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-3 text-xs font-black transition-all lg:flex-none ${
                        isSoldOut
                          ? "cursor-not-allowed border border-[#e8e5ef] bg-[#f7f4fa] text-[#8790a8]"
                          : "bg-[#6264b5] text-white shadow-lg shadow-[#6264b5]/20 hover:bg-[#51539f] hover:shadow-[#6264b5]/30 press"
                      }`}
                    >
                      <ShoppingBag className="h-4 w-4" />
                      <span>{isSoldOut ? "Habis Terjual" : "Pesan Tiket"}</span>
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

export default EventTicketList;
