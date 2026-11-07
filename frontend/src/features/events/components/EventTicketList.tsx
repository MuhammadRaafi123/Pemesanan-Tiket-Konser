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
        <div className="rounded-[28px] border border-dashed border-[#ffb703]/30 bg-[#14161f] px-8 py-14 text-center shadow-xl">
          <AlertCircle className="mx-auto mb-4 h-10 w-10 text-amber-400" />
          <h3 className="text-xl font-bold text-white">Kategori Tiket Belum Tersedia</h3>
          <p className="mt-2 text-xs text-[#8a8d98]">
            Penyelenggara belum merilis kuota tiket untuk event konser ini. Silakan pantau kembali.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <section className="space-y-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-4 border-b border-[#232733]/80 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#ffb703]/30 bg-[#ffb703]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffb703]">
            <Ticket className="h-3.5 w-3.5" />
            <span>Pilihan Tempat & Kursi</span>
          </div>
          <h2 className="mt-2.5 text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            Pilih Kategori Tiket Konser
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[#9da1b0] sm:text-sm">
          Pilih kategori yang sesuai dengan preferensi tempat dudukmu. Maksimal{" "}
          <strong className="text-[#ffdea9]">{MAX_PER_ORDER} tiket</strong> per transaksi akun.
        </p>
      </Reveal>

      <div className="space-y-5">
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
              className={`group relative overflow-hidden rounded-3xl border bg-[#14161f] p-6 transition-all duration-300 sm:p-7 shadow-xl ${
                isBest
                  ? "border-[#ffb703]/50 shadow-[0_0_30px_rgba(255,183,3,0.1)] hover:border-[#ffb703]"
                  : "border-[#262a38] hover:border-[#ffb703]/40 hover:shadow-2xl hover:shadow-black/60"
              } ${isSoldOut ? "opacity-60" : ""}`}
            >
              {isBest ? (
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#ffb703] via-[#ffdea9] to-[#ffb703]" />
              ) : null}

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                {/* Left: Category info & perks */}
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-xl font-black text-white sm:text-2xl">{cat.category_name}</h3>
                    {isBest ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ffb703]/40 bg-[#ffb703]/15 px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-[#ffdea9]">
                        <Crown className="h-3.5 w-3.5 text-[#ffb703]" />
                        Pandangan Terbaik
                      </span>
                    ) : null}
                    {isSoldOut ? (
                      <span className="rounded-full border border-white/10 bg-[#1d1f27] px-3 py-1 text-[10px] font-bold text-[#8a8d98]">
                        {isEventClosed ? "Penjualan Ditutup" : "Habis Terjual"}
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/15 px-3 py-1 text-[10px] font-bold text-rose-300 animate-pulse">
                        <Zap className="h-3 w-3" />
                        Tersisa {available} Tiket!
                      </span>
                    ) : (
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-300">
                        Tersedia
                      </span>
                    )}
                  </div>

                  {/* Quota Progress */}
                  <div className="max-w-md space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#8a8d98]">
                      <span>
                        Terjual <strong className="text-white">{soldPercentage}%</strong>
                      </span>
                      <span>
                        Sisa kuota: <strong className="text-[#ffdea9]">{available}</strong> / {cat.quota}
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-[#1b1e28]">
                      <div
                        className={`h-full rounded-full transition-all duration-1000 ease-out ${
                          isSoldOut
                            ? "bg-[#32353d]"
                            : "bg-gradient-to-r from-[#ffb703] to-[#ff9f00] shadow-[0_0_12px_rgba(255,183,3,0.3)]"
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
                          className="inline-flex items-center gap-1.5 rounded-xl border border-[#2a2d36] bg-[#1a1d27] px-3 py-1 text-xs font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/30"
                        >
                          <Check className="h-3.5 w-3.5 text-[#ffb703]" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                {/* Right: Price & Stepper Button */}
                <div className="flex shrink-0 flex-col gap-4 border-t border-[#232733] pt-5 lg:w-72 lg:items-end lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
                  <div className="lg:text-right">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#8a8d98]">
                      Harga Per Tiket
                    </span>
                    <p className="text-2xl sm:text-3xl font-black text-[#ffb703] drop-shadow-[0_2px_8px_rgba(255,183,3,0.25)]">
                      {formatCurrency(cat.price)}
                    </p>
                    <p className="mt-1 text-[11px] text-[#7a7d88]">Sudah termasuk pajak & fee layanan</p>
                  </div>

                  <div className="flex w-full items-center gap-3 lg:justify-end">
                    {!isSoldOut ? (
                      <div className="flex items-center rounded-xl border border-[#2a2d36] bg-[#1a1d27] p-1 shadow-inner">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, -1, maxQty)}
                          disabled={qty <= 1}
                          aria-label="Kurangi jumlah tiket"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a8d98] transition hover:bg-[#232733] hover:text-white disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, 1, maxQty)}
                          disabled={qty >= maxQty}
                          aria-label="Tambah jumlah tiket"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-[#8a8d98] transition hover:bg-[#232733] hover:text-white disabled:opacity-30"
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
                          ? "cursor-not-allowed border border-[#2a2d36] bg-[#1a1d27] text-[#555866]"
                          : "bg-[#ffb703] text-[#10131a] shadow-lg shadow-[#ffb703]/25 hover:bg-[#ffdea9] hover:shadow-[#ffb703]/40 press"
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
