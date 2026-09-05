"use client";

import React from "react";
import Link from "next/link";
import { 
  ShoppingBag, 
  CalendarDays, 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  ArrowRight,
  Sparkles,
  Ticket
} from "lucide-react";
import { Order } from "../types";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const formattedDate = new Date(order.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const getStatusBadge = () => {
    switch (order.status) {
      case "paid":
        return (
          <Badge variant="success" className="gap-1 text-xs">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Pembayaran Berhasil
          </Badge>
        );
      case "pending":
        return (
          <Badge variant="warning" className="gap-1 text-xs">
            <Clock className="h-3.5 w-3.5" />
            Menunggu Pembayaran / Verifikasi
          </Badge>
        );
      case "rejected":
        return (
          <Badge variant="destructive" className="gap-1 text-xs">
            <XCircle className="h-3.5 w-3.5" />
            Pembayaran Ditolak
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="secondary" className="gap-1 text-xs">
            <XCircle className="h-3.5 w-3.5" />
            Dibatalkan
          </Badge>
        );
      default:
        return <Badge variant="secondary">{order.status}</Badge>;
    }
  };

  return (
    <CardSpotlight className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/40">
            Nomor Pesanan
          </span>
          <p className="font-mono text-sm font-bold text-purple-300">
            {order.order_code}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-white/50">{formattedDate}</span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Body / Items */}
      <div className="space-y-3">
        {order.events && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-white text-sm">{order.events.title}</h4>
              <p className="text-xs text-white/50">{order.events.location}</p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-2">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs text-white/80">
              <span>
                {item.qty}x {item.ticket_categories?.category_name || "Tiket Konser"}
              </span>
              <span className="font-semibold text-white">
                Rp {item.subtotal.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Total & Action */}
      <div className="flex items-center justify-between border-t border-white/10 pt-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-white/40">Total Tagihan</span>
          <p className="text-lg font-black text-purple-300">
            Rp {order.total.toLocaleString("id-ID")}
          </p>
        </div>

        <div>
          {order.status === "paid" ? (
            <Link href="/tickets">
              <Button variant="glow" size="sm" className="gap-1.5 text-xs">
                <Ticket className="h-3.5 w-3.5 text-cyan-300" />
                Buka E-Ticket
              </Button>
            </Link>
          ) : order.status === "pending" ? (
            <Link href={`/payments/${order.id}`}>
              <Button variant="amber" size="sm" className="gap-1.5 text-xs">
                <CreditCard className="h-3.5 w-3.5" />
                Bayar Sekarang
              </Button>
            </Link>
          ) : (
            <Link href={`/orders/${order.id}`}>
              <Button variant="secondary" size="sm" className="gap-1.5 text-xs">
                Detail
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </CardSpotlight>
  );
}
export default OrderCard;
