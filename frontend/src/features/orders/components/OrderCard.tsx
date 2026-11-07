"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  CreditCard,
  MapPin,
  Ticket,
  XCircle,
} from "lucide-react";
import type { Order } from "../types";
import { formatCurrency, formatEventDate } from "@/lib/format";

interface OrderCardProps {
  order: Order;
}

/* ── status colour map (dark concert theme) ── */
const STATUS_META: Record<
  Order["status"],
  {
    label: string;
    border: string;
    bg: string;
    text: string;
    icon: typeof CheckCircle2;
    glow: string;
  }
> = {
  paid: {
    label: "Pembayaran berhasil",
    border: "border-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-400",
    icon: CheckCircle2,
    glow: "shadow-emerald-500/10",
  },
  pending: {
    label: "Menunggu pembayaran",
    border: "border-amber-500/30",
    bg: "bg-amber-500/10",
    text: "text-amber-400",
    icon: Clock,
    glow: "shadow-amber-500/10",
  },
  rejected: {
    label: "Pembayaran ditolak",
    border: "border-rose-500/30",
    bg: "bg-rose-500/10",
    text: "text-rose-400",
    icon: XCircle,
    glow: "shadow-rose-500/10",
  },
  cancelled: {
    label: "Dibatalkan",
    border: "border-[#3a3d48]/40",
    bg: "bg-[#2a2d36]/40",
    text: "text-[#8a8d98]",
    icon: XCircle,
    glow: "shadow-black/10",
  },
};

export function OrderCard({ order }: OrderCardProps) {
  const meta = STATUS_META[order.status] ?? STATUS_META.cancelled;
  const StatusIcon = meta.icon;

  return (
    <article
      className={`
        group relative overflow-hidden rounded-[24px]
        border border-[#232733] bg-[#14161f]
        shadow-xl shadow-black/30
        transition-all duration-500
        hover:border-[#ffb703]/20 hover:shadow-2xl hover:shadow-black/40
        hover:-translate-y-0.5
      `}
    >
      {/* ── ambient top-edge glow ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ffb703]/20 to-transparent" />

      {/* ── header ── */}
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#232733] px-6 py-5 sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8d98]">
            Nomor pesanan
          </p>
          <p className="mt-1.5 font-mono text-sm font-bold tracking-[0.08em] text-[#ffb703]">
            {order.order_code}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-[#7a7d88]">
            {formatEventDate(order.created_at)}
          </span>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${meta.border} ${meta.bg} ${meta.text}`}
          >
            <StatusIcon className="h-3.5 w-3.5" />
            {meta.label}
          </span>
        </div>
      </header>

      {/* ── body ── */}
      <div className="space-y-4 px-6 py-6 sm:px-7">
        {/* event info */}
        {order.events ? (
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#ffb703]/10 text-[#ffb703]">
              <Ticket className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-lg font-bold text-white">
                {order.events.title}
              </h3>
              <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-[#8a8d98]">
                <MapPin className="h-3 w-3 text-[#d5baff]" />
                {order.events.venue
                  ? `${order.events.venue}, ${order.events.location}`
                  : order.events.location}
              </p>
            </div>
          </div>
        ) : null}

        {/* ticket items */}
        <ul className="divide-y divide-[#232733] rounded-2xl border border-[#232733] bg-[#191b23] px-5">
          {(order.order_items || []).map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between gap-4 py-3.5 text-sm"
            >
              <span className="text-[#8a8d98]">
                <span className="font-mono font-semibold text-white">
                  {item.qty}×
                </span>{" "}
                {item.ticket_categories?.category_name || "Tiket konser"}
              </span>
              <span className="font-mono font-semibold text-white">
                {formatCurrency(item.subtotal)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* ── footer ── */}
      <footer className="flex flex-wrap items-center justify-between gap-4 border-t border-[#232733] bg-[#0f1118] px-6 py-5 sm:px-7">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#8a8d98]">
            Total tagihan
          </p>
          <p className="mt-1 font-mono text-xl font-black text-[#ffb703]">
            {formatCurrency(order.total)}
          </p>
        </div>

        {order.status === "paid" ? (
          <Link href="/tickets">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400"
            >
              <Ticket className="h-4 w-4" />
              Buka e-ticket
            </button>
          </Link>
        ) : order.status === "pending" ? (
          <Link href={`/payments/${order.id}`}>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl bg-[#ffb703] px-5 py-3 text-sm font-bold text-[#10131a] shadow-lg shadow-[#ffb703]/20 transition hover:bg-[#ffdea9]"
            >
              <CreditCard className="h-4 w-4" />
              Bayar sekarang
            </button>
          </Link>
        ) : (
          <Link href={`/orders/${order.id}`}>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-xl border border-[#2a2d36] bg-[#191b23] px-5 py-3 text-sm font-semibold text-[#e1e2ec] transition hover:border-[#ffb703]/30 hover:text-[#ffb703]"
            >
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
