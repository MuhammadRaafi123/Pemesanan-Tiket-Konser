"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Crown, 
  Sparkles, 
  Users, 
  Check, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight,
  Flame,
  AlertCircle
} from "lucide-react";
import { Event, TicketCategory } from "../types";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cartStore";
import { useToast } from "@/components/shared/ToastProvider";

interface EventTicketListProps {
  event: Event;
}

export function EventTicketList({ event }: EventTicketListProps) {
  const router = useRouter();
  const { addItem } = useCartStore();
  const { success, error } = useToast();

  const categories = event.ticket_categories || [];
  const [quantities, setQuantities] = useState<Record<string | number, number>>({});

  const handleQtyChange = (catId: string | number, delta: number, max: number) => {
    setQuantities((prev) => {
      const current = prev[catId] || 0;
      const next = Math.max(0, Math.min(max, current + delta));
      return { ...prev, [catId]: next };
    });
  };

  const handleBuyTicket = (cat: TicketCategory) => {
    const qty = quantities[cat.id] || 1;
    if (cat.remaining <= 0) {
      error("Maaf, kuota kategori tiket ini sudah habis.");
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
      qty
    );

    success(`${qty}x ${cat.category_name} berhasil ditambahkan ke keranjang!`);
    router.push("/checkout");
  };

  if (categories.length === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-amber-400 mb-3" />
        <h4 className="text-base font-bold text-white">Kategori Tiket Belum Tersedia</h4>
        <p className="text-xs text-white/50 mt-1">Penyelenggara belum merilis kuota tiket untuk event ini.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            Pilih Kategori Tiket
          </h3>
          <p className="text-xs text-white/50 mt-0.5">
            Pilih kategori tiket yang sesuai dengan preferensi tempat dudukmu.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5">
        {categories.map((cat, idx) => {
          const qty = quantities[cat.id] || 1;
          const isSoldOut = cat.remaining <= 0;
          const isLowStock = cat.remaining > 0 && cat.remaining <= 30;
          const percentage = Math.max(0, Math.min(100, Math.round(((cat.quota - cat.remaining) / cat.quota) * 100)));

          return (
            <CardSpotlight
              key={cat.id}
              spotlightColor={idx === 0 ? "rgba(245, 158, 11, 0.2)" : "rgba(139, 92, 246, 0.2)"}
              className={`border-white/10 ${idx === 0 ? "border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-[#12121e]/90" : ""}`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                
                {/* Category Info */}
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2.5">
                    <h4 className="text-lg font-bold text-white flex items-center gap-2">
                      {cat.category_name}
                      {idx === 0 && (
                        <Badge variant="warning" className="text-[10px] gap-1 py-0.5 px-2">
                          <Crown className="h-3 w-3" />
                          Best View
                        </Badge>
                      )}
                    </h4>

                    {isSoldOut ? (
                      <Badge variant="destructive" className="text-[10px]">Sold Out</Badge>
                    ) : isLowStock ? (
                      <Badge variant="destructive" className="text-[10px] gap-1">
                        <Flame className="h-3 w-3" />
                        Tersisa {cat.remaining}
                      </Badge>
                    ) : (
                      <Badge variant="success" className="text-[10px]">Tersedia</Badge>
                    )}
                  </div>

                  {/* Quota Progress Bar */}
                  <div className="max-w-xs space-y-1">
                    <div className="flex justify-between text-[11px] text-white/50">
                      <span>Terjual: {percentage}%</span>
                      <span>Sisa: {cat.remaining} / {cat.quota}</span>
                    </div>
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Perks Checklist */}
                  {cat.perks && cat.perks.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {cat.perks.map((perk, pIdx) => (
                        <span
                          key={pIdx}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/5 bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/70"
                        >
                          <Check className="h-3 w-3 text-cyan-400" />
                          {perk}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Pricing & Booking Controls */}
                <div className="flex flex-col sm:flex-row md:flex-col items-start sm:items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 gap-4 shrink-0">
                  <div className="text-left md:text-right">
                    <p className="text-[10px] uppercase font-bold text-white/40">Harga Tiket</p>
                    <p className="text-xl font-black text-purple-300">
                      Rp {cat.price.toLocaleString("id-ID")}
                    </p>
                    <p className="text-[10px] text-white/40">*Termasuk pajak & biaya admin</p>
                  </div>

                  {/* Qty Stepper and Button */}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    {!isSoldOut && (
                      <div className="flex items-center rounded-xl border border-white/15 bg-white/5 p-1">
                        <button
                          onClick={() => handleQtyChange(cat.id, -1, cat.remaining)}
                          disabled={qty <= 1}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 transition"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-white">{qty}</span>
                        <button
                          onClick={() => handleQtyChange(cat.id, 1, Math.min(4, cat.remaining))}
                          disabled={qty >= Math.min(4, cat.remaining)}
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 transition"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}

                    <Button
                      onClick={() => handleBuyTicket(cat)}
                      disabled={isSoldOut}
                      variant={idx === 0 ? "glow" : "default"}
                      size="sm"
                      className="gap-2 flex-1 sm:flex-none"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      {isSoldOut ? "Habis" : "Beli Sekarang"}
                    </Button>
                  </div>
                </div>

              </div>
            </CardSpotlight>
          );
        })}
      </div>
    </div>
  );
}
export default EventTicketList;
