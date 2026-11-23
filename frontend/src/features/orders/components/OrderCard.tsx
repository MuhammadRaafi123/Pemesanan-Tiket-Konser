"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  CreditCard,
  MapPin,
  Ticket,
  XCircle,
} from "lucide-react";
import { isOrderExpired, type Order } from "../types";
import { formatCurrency, formatEventDate } from "@/lib/format";

interface OrderCardProps {
  order: Order;
  now: number;
}

const STATUS_META: Record<Order["status"], { label: string; tone: string; icon: typeof CheckCircle2 }> = {
  paid: {
    label: "Pembayaran berhasil",
    tone: "border-[#c7e0d1] bg-[#e6f1eb] text-[#397557]",
    icon: CheckCircle2,
  },
  pending: {
    label: "Menunggu pembayaran",
    tone: "border-[#ead9ad] bg-[#f8f0df] text-[#8b6a2c]",
    icon: Clock3,
  },
  rejected: {
    label: "Pembayaran ditolak",
    tone: "border-rose-200 bg-rose-50 text-rose-700",
    icon: XCircle,
  },
  cancelled: {
    label: "Dibatalkan",
    tone: "border-[#e8e5ef] bg-[#f7f4fa] text-[#5c6482]",
    icon: XCircle,
  },
};

export function OrderCard({ order, now }: OrderCardProps) {
  const isExpired = isOrderExpired(order, now) || (order.status === "cancelled" && Boolean(
    order.expires_at && new Date(order.expires_at).getTime() <= now,
  ));
  const meta = isExpired
    ? { ...STATUS_META.cancelled, label: "Pesanan hangus" }
    : STATUS_META[order.status] ?? STATUS_META.cancelled;
  const StatusIcon = meta.icon;

  return (
    <article className="overflow-hidden rounded-2xl border border-[#e8e5ef] bg-[#fffdf2] shadow-[0_12px_35px_-28px_rgba(7,22,83,.25)] transition hover:border-[#c8b7db]">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8e5ef] px-5 py-4 sm:px-6">
        <div>
          <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#5c6482]">Nomor pesanan</p>
          <p className="mt-1 font-mono text-sm font-bold tracking-wider text-[#6264b5]">{order.order_code}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-xs text-[#5c6482]">{formatEventDate(order.created_at)}</span>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold ${meta.tone}`}>
            <StatusIcon className="h-3.5 w-3.5" /> {meta.label}
          </span>
        </div>
      </header>

      <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[1fr_auto] lg:items-center">
        <div className="space-y-4">
          {order.events ? (
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#eeebf4] text-[#6264b5]">
                <Ticket className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="font-bold text-[#071653]">{order.events.title}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-[#5c6482]">
                  <MapPin className="h-3.5 w-3.5 text-[#6264b5]" />
                  {order.events.venue ? `${order.events.venue}, ${order.events.location}` : order.events.location}
                </p>
              </div>
            </div>
          ) : null}
          <ul className="divide-y divide-[#e8e5ef] rounded-xl border border-[#e8e5ef] bg-[#fffdf2] px-4">
            {(order.order_items || []).map((item) => (
              <li key={item.id} className="flex items-center justify-between gap-4 py-3 text-xs">
                <span className="text-[#5c6482]">
                  <strong className="font-mono text-[#071653]">{item.qty}×</strong>{" "}
                  {item.ticket_categories?.category_name || "Tiket konser"}
                </span>
                <span className="font-mono font-bold text-[#071653]">{formatCurrency(item.subtotal)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e8e5ef] pt-4 sm:justify-end lg:min-w-52 lg:flex-col lg:items-end lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <div className="lg:text-right">
            <p className="text-[9px] font-bold uppercase tracking-[.18em] text-[#5c6482]">Total tagihan</p>
            <p className="mt-1 font-mono text-lg font-extrabold text-[#071653]">{formatCurrency(order.total)}</p>
          </div>
          {order.status === "paid" ? (
            <Link href="/tickets" className="inline-flex items-center gap-2 rounded-xl bg-[#6264b5] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#51539f]">
              <Ticket className="h-4 w-4" /> Buka e-ticket
            </Link>
          ) : order.status === "pending" && !isExpired ? (
            <Link href={`/payments/${order.id}`} className="inline-flex items-center gap-2 rounded-xl bg-[#071653] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#172b70]">
              <CreditCard className="h-4 w-4 text-[#c8b7db]" /> Bayar sekarang
            </Link>
          ) : (
            <Link href={`/orders/${order.id}`} className="inline-flex items-center gap-2 rounded-xl border border-[#e8e5ef] px-4 py-2.5 text-xs font-bold text-[#071653] transition hover:border-[#c8b7db] hover:bg-[#f7f4fa]">
              Lihat detail <ArrowRight className="h-3.5 w-3.5 text-[#6264b5]" />
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}

export default OrderCard;
