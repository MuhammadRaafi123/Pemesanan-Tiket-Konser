"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle, Check, Crown, Minus, Plus, ShoppingBag, Ticket } from "lucide-react";
import type { Event, TicketCategory } from "../types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

    success(`${qty}x ${cat.category_name} berhasil ditambahkan ke keranjang!`);
    router.push("/checkout");
  };

  if (categories.length === 0) {
    return (
      <Reveal>
        <div className="rounded-[28px] border border-dashed border-primary/20 bg-white px-8 py-14 text-center">
          <AlertCircle className="mx-auto mb-4 h-8 w-8 text-amber-500" />
          <h3 className="font-display text-2xl text-ink">Kategori tiket belum tersedia</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Penyelenggara belum merilis kuota tiket untuk event ini.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <section className="space-y-6">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">
            <Ticket className="h-3.5 w-3.5" />
            Tiket
          </p>
          <h2 className="font-display mt-3 text-3xl text-ink">Pilih kategori tiket</h2>
        </div>
        <p className="max-w-sm text-sm leading-6 text-muted-foreground">
          Pilih kategori yang sesuai dengan preferensi tempat dudukmu. Maksimal {MAX_PER_ORDER} tiket per
          kategori.
        </p>
      </Reveal>

      <div className="space-y-4">
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
              delay={index * 70}
              className={`group relative overflow-hidden rounded-[26px] border bg-white p-6 transition-all duration-500 sm:p-7 ${
                isBest
                  ? "border-gold-soft/45 shadow-[0_24px_60px_-40px_rgba(168,132,63,.55)]"
                  : "border-border shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.3)]"
              } ${isSoldOut ? "opacity-70" : ""}`}
            >
              {isBest ? <span aria-hidden className="absolute inset-x-0 top-0 h-px hairline-gold" /> : null}

              <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0 flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="font-display text-xl text-ink">{cat.category_name}</h3>
                    {isBest ? (
                      <Badge variant="gold" className="gap-1">
                        <Crown className="h-3 w-3" />
                        Pandangan terbaik
                      </Badge>
                    ) : null}
                    {isSoldOut ? (
                      <Badge variant="secondary">{isEventClosed ? "Penjualan ditutup" : "Habis"}</Badge>
                    ) : isLowStock ? (
                      <Badge variant="warning">Tersisa {available}</Badge>
                    ) : null}
                  </div>

                  <div className="max-w-sm space-y-2">
                    <div className="flex items-center justify-between text-[0.68rem] text-muted-foreground">
                      <span>Terjual {soldPercentage}%</span>
                      <span>
                        Tersisa {available} / {cat.quota}
                      </span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full transition-[width] duration-[1200ms] ease-out ${
                          isSoldOut ? "bg-muted-foreground/40" : "bg-gradient-to-r from-primary to-[#3f6fe0]"
                        }`}
                        style={{ width: `${Math.max(soldPercentage, 2)}%` }}
                      />
                    </div>
                  </div>

                  {cat.perks && cat.perks.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {cat.perks.map((perk) => (
                        <span
                          key={perk}
                          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-2.5 py-1 text-[0.68rem] text-muted-foreground transition-colors hover:border-primary/25 hover:text-primary"
                        >
                          <Check className="h-3 w-3 text-primary" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col gap-5 border-t border-border pt-5 lg:w-64 lg:items-end lg:border-l lg:border-t-0 lg:pl-7 lg:pt-0">
                  <div className="lg:text-right">
                    <p className="meta-label">Harga tiket</p>
                    <p className="numeral mt-1 text-2xl text-ink">{formatCurrency(cat.price)}</p>
                    <p className="mt-1 text-[0.65rem] text-muted-foreground">Termasuk pajak & biaya layanan</p>
                  </div>

                  <div className="flex w-full items-center gap-3 lg:justify-end">
                    {!isSoldOut ? (
                      <div className="flex items-center rounded-full border border-border bg-muted/60 p-1">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, -1, maxQty)}
                          disabled={qty <= 1}
                          aria-label="Kurangi jumlah"
                          className="press flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white hover:text-primary disabled:opacity-30"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="numeral w-8 text-center text-sm text-ink">{qty}</span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(cat.id, 1, maxQty)}
                          disabled={qty >= maxQty}
                          aria-label="Tambah jumlah"
                          className="press flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-white hover:text-primary disabled:opacity-30"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : null}

                    <Button
                      type="button"
                      onClick={() => handleBuyTicket(cat)}
                      disabled={isSoldOut}
                      variant={isBest ? "default" : "secondary"}
                      className="flex-1 gap-2 lg:flex-none"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {isSoldOut ? "Habis" : "Beli"}
                    </Button>
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
