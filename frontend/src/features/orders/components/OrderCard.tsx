"use client";

import React from "react";
import Link from "next/link";
import { 
  Clock, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Ticket
} from "lucide-react";
import { useState } from "react";
import { Order } from "../types";
import { cancelOrder } from "../api";
import { useToast } from "@/components/shared/ToastProvider";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface OrderCardProps {
  order: Order;
}

export function OrderCard({ order }: OrderCardProps) {
  const [status, setStatus] = useState(order.status);
  const [cancelling, setCancelling] = useState(false);
  const { success, error } = useToast();
  const formattedDate = new Date(order.created_at).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const getStatusBadge = () => {
    switch (status) {
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
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-100 pb-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8aa4c1]">
            Nomor Pesanan
          </span>
          <p className="font-mono text-sm font-bold text-[#2563eb]">
            {order.order_code}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#8aa4c1]">{formattedDate}</span>
          {getStatusBadge()}
        </div>
      </div>

      {/* Body / Items */}
      <div className="space-y-3">
        {order.events && (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#2563eb]">
              <Ticket className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-bold text-[#123b6d] text-sm">{order.events.title}</h4>
              <p className="text-xs text-[#8aa4c1]">{order.events.location}</p>
            </div>
          </div>
        )}

        <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 space-y-2">
          {order.order_items?.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-xs text-[#17457f]">
              <span>
                {item.qty}x {item.ticket_categories?.category_name || "Tiket Konser"}
              </span>
              <span className="font-semibold text-[#123b6d]">
                Rp {item.subtotal.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer / Total & Action */}
      <div className="flex items-center justify-between border-t border-blue-100 pt-4">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#8aa4c1]">Total Tagihan</span>
          <p className="text-lg font-black text-[#2563eb]">
            Rp {order.total.toLocaleString("id-ID")}
          </p>
        </div>

        <div>
          {status === "paid" ? (
            <Link href="/tickets">
              <Button variant="glow" size="sm" className="gap-1.5 text-xs">
                <Ticket className="h-3.5 w-3.5 text-white" />
                Buka E-Ticket
              </Button>
            </Link>
          ) : status === "pending" ? (
            <div className="flex flex-wrap justify-end gap-2">
              <Link href={`/payments/${order.id}`}>
                <Button variant="amber" size="sm" className="gap-1.5 text-xs">
                  <CreditCard className="h-3.5 w-3.5" />
                  Bayar Sekarang
                </Button>
              </Link>
              {order.payment?.status !== "pending" && <Button variant="secondary" size="sm" disabled={cancelling} className="gap-1.5 text-xs" onClick={async () => {
                if (!window.confirm("Batalkan pesanan ini? Reservasi tiket akan dilepas.")) return;
                setCancelling(true);
                try {
                  await cancelOrder(order.id);
                  setStatus("cancelled");
                  success("Pesanan dibatalkan dan reservasi tiket dilepas.");
                } catch {
                  error("Pesanan tidak dapat dibatalkan. Coba muat ulang riwayat pesanan.");
                } finally {
                  setCancelling(false);
                }
              }}>{cancelling ? "Membatalkan…" : "Batalkan"}</Button>}
            </div>
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
