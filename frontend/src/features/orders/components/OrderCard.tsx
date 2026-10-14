"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, CreditCard, MapPin, Ticket, XCircle } from "lucide-react";
import type { Order } from "../types";
import { formatCurrency, formatEventDate } from "@/lib/format";

interface OrderCardProps {
  order: Order;
}

const STATUS_META: Record<
  Order["status"],
  { label: string; variant: "success" | "warning" | "destructive" | "secondary"; icon: typeof CheckCircle2 }
> = {
  paid: { label: "Pembayaran berhasil", variant: "success", icon: CheckCircle2 },
  pending: { label: "Menunggu pembayaran", variant: "warning", icon: Clock },
  rejected: { label: "Pembayaran ditolak", variant: "destructive", icon: XCircle },
  cancelled: { label: "Dibatalkan", variant: "secondary", icon: XCircle },
};

export function OrderCard({ order }: OrderCardProps) {
  const meta = STATUS_META[order.status] ?? STATUS_META.cancelled;
  const StatusIcon = meta.icon;

  return (
    <article className="overflow-hidden rounded-[28px] border border-border bg-white shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] transition-all duration-500 hover:border-primary/20 hover:shadow-[0_2px_6px_rgba(10,27,51,.05),0_30px_64px_-32px_rgba(13,38,84,.36)]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5 sm:px-7">
        <div>
          <p className="meta-label">Nomor pesanan</p>
          <p className="mt-1.5 font-mono text-sm font-semibold tracking-[0.08em] text-primary">{order.order_code}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">{formatEventDate(order.created_at)}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.variant === 'success' ? 'bg-emerald-100 text-emerald-700' : meta.variant === 'warning' ? 'bg-amber-100 text-amber-700' : meta.variant === 'destructive' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
            <StatusIcon className="h-3 w-3" />
            {meta.label}
          </span>
        </div>
      </header>

      <div className="space-y-4 px-6 py-6 sm:px-7">
        {order.events ? (
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent text-primary"><Ticket className="h-5 w-5" /></span>
            <div className="min-w-0">
              <h3 className="font-display truncate text-lg text-ink">{order.events.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 text-primary" />
                {order.events.venue ? `${order.events.venue}, ${order.events.location}` : order.events.location}
              </p>
            </div>
          </div>
        ) : null}

        <ul className="divide-y divide-border rounded-2xl border border-border bg-muted/40 px-5">
          {(order.order_items || []).map((item) => (
            <li key={item.id} className="flex items-center justify-between gap-4 py-3.5 text-sm">
              <span className="text-muted-foreground">
                <span className="numeral text-ink">{item.qty}?</span> {item.ticket_categories?.category_name || "Tiket konser"}
              </span>
              <span className="numeral text-ink">{formatCurrency(item.subtotal)}</span>
            </li>
          ))}
        </ul>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-border bg-muted/30 px-6 py-5 sm:px-7">
        <div>
          <p className="meta-label">Total tagihan</p>
          <p className="numeral mt-1 text-xl text-ink">{formatCurrency(order.total)}</p>
        </div>

        {order.status === "paid" ? (
          <Link href="/tickets">
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white">
              <Ticket className="h-4 w-4" />
              Buka e-ticket
            </button>
          </Link>
        ) : order.status === "pending" ? (
          <Link href={`/payments/${order.id}`}>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-semibold text-white">
              <CreditCard className="h-4 w-4" />
              Bayar sekarang
            </button>
          </Link>
        ) : (
          <Link href={`/orders/${order.id}`}>
            <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-semibold text-ink">
              Lihat detail
              <ArrowRight className="h-4 w-4" />
            </button>
          </Link>
        )}
      </footer>
    </article>
  );
}

export default OrderCard;
