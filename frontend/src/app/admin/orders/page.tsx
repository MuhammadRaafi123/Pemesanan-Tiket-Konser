"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  Clock3,
  ExternalLink,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/components/shared/ToastProvider";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatCurrency, formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import { fetchAdminOrders, type AdminOrder } from "@/features/orders/adminApi";
import type { ApiResponse } from "@/types/api";

type OrderStatusFilter = "all" | AdminOrder["status"];

const ORDER_STATUS: Record<AdminOrder["status"], { label: string; style: string }> = {
  pending: {
    label: "Menunggu pembayaran",
    style: "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
  },
  paid: {
    label: "Dibayar",
    style: "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
  },
  rejected: {
    label: "Ditolak",
    style: "border-rose-400/20 bg-rose-400/[0.08] text-rose-300",
  },
  cancelled: {
    label: "Dibatalkan",
    style: "border-white/10 bg-white/[0.04] text-[#aaa69b]",
  },
};

function paymentLabel(method?: string) {
  if (!method) return "Belum ada pembayaran";
  return method.replaceAll("_", " ");
}

export default function AdminOrdersPage() {
  const { success, error } = useToast();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatusFilter>("all");

  const loadOrders = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        setOrders(await fetchAdminOrders());
      } catch (err) {
        error(getApiErrorMessage(err, "Data pesanan tidak dapat dimuat."));
      } finally {
        setLoading(false);
      }
    },
    [error],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void loadOrders(), 0);
    return () => window.clearTimeout(timer);
  }, [loadOrders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");
    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const eventNames = order.order_items
        ?.map((item) => item.ticket_categories?.events?.title)
        .filter(Boolean)
        .join(" ");
      const matchesSearch =
        !query ||
        [order.order_code, order.users?.name, order.users?.email, eventNames]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("id").includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [orders, search, statusFilter]);

  const verify = async (
    order: AdminOrder,
    paymentId: number | string,
    decision: "approved" | "rejected",
  ) => {
    let rejectionReason: string | undefined;
    if (decision === "approved") {
      if (!window.confirm(`Setujui pembayaran untuk pesanan ${order.order_code}?`)) return;
    } else {
      const reason = window.prompt("Masukkan alasan penolakan pembayaran:");
      if (reason === null) return;
      rejectionReason = reason.trim();
      if (rejectionReason.length < 3) {
        error("Alasan penolakan minimal 3 karakter.");
        return;
      }
    }

    setUpdatingId(order.id);
    try {
      await api.patch<ApiResponse>(`/payments/${paymentId}/verify`, {
        status: decision,
        ...(rejectionReason ? { rejection_reason: rejectionReason } : {}),
      });
      success(
        decision === "approved"
          ? "Pembayaran berhasil disetujui."
          : "Pembayaran berhasil ditolak.",
      );
      await loadOrders(false);
    } catch (err) {
      error(getApiErrorMessage(err, "Status pembayaran gagal diperbarui."));
    } finally {
      setUpdatingId(null);
    }
  };

  const counts = {
    all: orders.length,
    pending: orders.filter((order) => order.status === "pending").length,
    paid: orders.filter((order) => order.status === "paid").length,
    rejected: orders.filter((order) => order.status === "rejected").length,
    cancelled: orders.filter((order) => order.status === "cancelled").length,
  };
  const revenue = orders.reduce(
    (sum, order) => sum + (order.status === "paid" ? Number(order.total) : 0),
    0,
  );

  const renderPaymentActions = (order: AdminOrder) => {
    const payment = order.payments?.[0];
    if (order.status !== "pending" || payment?.status !== "pending") return null;
    const isUpdating = updatingId === order.id;
    return (
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => void verify(order, payment.id, "approved")}
          disabled={updatingId !== null}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-emerald-500/10 px-2.5 text-[11px] font-semibold text-emerald-300 transition hover:bg-emerald-500/20 disabled:opacity-50"
        >
          {isUpdating ? (
            <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Check className="h-3.5 w-3.5" />
          )}
          Setujui
        </button>
        <button
          type="button"
          onClick={() => void verify(order, payment.id, "rejected")}
          disabled={updatingId !== null}
          className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-rose-500/10 px-2.5 text-[11px] font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-50"
        >
          <X className="h-3.5 w-3.5" />
          Tolak
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-full px-5 py-8 text-[#f5f0e5] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-[rgba(201,168,94,0.12)] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85e]/70">
              Admin · Transaksi
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Pesanan
            </h1>
            <p className="mt-1 text-sm text-[#817a6a]">
              Pantau transaksi dan verifikasi bukti pembayaran pelanggan.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadOrders()}
            disabled={loading}
            className="inline-flex h-10 items-center gap-2 self-start rounded-xl border border-[rgba(201,168,94,0.2)] bg-white/[0.03] px-3.5 text-xs font-semibold text-[#c9a85e] transition hover:bg-[#c9a85e]/10 disabled:opacity-50 sm:self-auto"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Muat ulang
          </button>
        </header>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Total pesanan", value: counts.all },
            { label: "Menunggu pembayaran", value: counts.pending },
            { label: "Pesanan dibayar", value: counts.paid },
            { label: "Pendapatan terbayar", value: formatCurrency(revenue) },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410] p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#817a6a]">
                {label}
              </p>
              <p className="mt-1 text-xl font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410]">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative min-w-0 flex-1 lg:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#817a6a]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kode pesanan, pelanggan, atau event..."
                aria-label="Cari pesanan"
                className="h-11 w-full rounded-xl border border-white/10 bg-[#11110f] pl-9 pr-3 text-sm text-[#f5f0e5] outline-none transition placeholder:text-white/30 focus:border-[#c9a85e]"
              />
            </div>
            <div className="flex gap-1 overflow-x-auto rounded-xl border border-white/[0.08] bg-black/20 p-1">
              {(
                [
                  ["all", "Semua"],
                  ["pending", "Menunggu"],
                  ["paid", "Dibayar"],
                  ["rejected", "Ditolak"],
                  ["cancelled", "Batal"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`shrink-0 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === value
                      ? "bg-[#c9a85e]/15 text-[#dfc786]"
                      : "text-[#817a6a] hover:text-[#f5f0e5]"
                  }`}
                >
                  {label}
                  <span className="ml-1.5 text-[10px] opacity-60">{counts[value]}</span>
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#817a6a]">
              <LoaderCircle className="h-5 w-5 animate-spin text-[#c9a85e]" />
              Memuat pesanan...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a85e]/20 bg-[#c9a85e]/10 text-[#c9a85e]">
                <Clock3 className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold">
                {orders.length === 0 ? "Belum ada pesanan" : "Pesanan tidak ditemukan"}
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#817a6a]">
                Ubah kata kunci pencarian atau filter status untuk melihat pesanan.
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto xl:block">
                <table className="w-full min-w-[1050px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#817a6a]">
                      <th className="px-5 py-3">Pesanan</th>
                      <th className="px-4 py-3">Pelanggan</th>
                      <th className="px-4 py-3">Event & tiket</th>
                      <th className="px-4 py-3">Total</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Pembayaran</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredOrders.map((order) => {
                      const status = ORDER_STATUS[order.status];
                      const payment = order.payments?.[0];
                      return (
                        <tr key={order.id} className="align-top transition hover:bg-white/[0.02]">
                          <td className="px-5 py-4">
                            <p className="font-mono text-xs font-semibold text-[#dfc786]">
                              {order.order_code}
                            </p>
                            <p className="mt-1 whitespace-nowrap text-[11px] text-[#817a6a]">
                              {formatEventDate(order.created_at, {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-xs font-medium">{order.users?.name ?? "—"}</p>
                            <p className="mt-1 text-[11px] text-[#817a6a]">
                              {order.users?.email ?? "—"}
                            </p>
                          </td>
                          <td className="max-w-60 px-4 py-4">
                            {order.order_items?.map((item) => (
                              <p key={item.id} className="mb-1 truncate text-xs text-[#d8d1c1]">
                                {item.ticket_categories?.events?.title ?? "Event"} ·{" "}
                                {item.ticket_categories?.category_name ?? "Tiket"} × {item.qty}
                              </p>
                            ))}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-xs font-semibold">
                            {formatCurrency(Number(order.total))}
                          </td>
                          <td className="px-4 py-4">
                            <span
                              className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.style}`}
                            >
                              {status.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right">
                            <p className="text-xs capitalize text-[#d8d1c1]">
                              {paymentLabel(payment?.payment_method)}
                            </p>
                            {payment?.payer_name && <p className="mt-1 text-[10px] text-[#aaa69b]">Pengirim: {payment.payer_name}</p>}
                            {payment?.transaction_reference && <p className="mt-1 max-w-52 truncate text-[10px] text-[#aaa69b]" title={payment.transaction_reference}>Ref: {payment.transaction_reference}</p>}
                            {payment?.paid_amount != null && <p className="mt-1 text-[10px] text-[#aaa69b]">Dibayar: {formatCurrency(Number(payment.paid_amount))}</p>}
                            {payment?.proof_image && (
                              <a
                                href={resolveMediaUrl(payment.proof_image)}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#c9a85e] hover:text-[#dfc786]"
                              >
                                Lihat bukti <ExternalLink className="h-3 w-3" />
                              </a>
                            )}
                            <div className="flex justify-end">{renderPaymentActions(order)}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-white/[0.06] xl:hidden">
                {filteredOrders.map((order) => {
                  const status = ORDER_STATUS[order.status];
                  const payment = order.payments?.[0];
                  return (
                    <article key={order.id} className="p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-xs font-semibold text-[#dfc786]">
                            {order.order_code}
                          </p>
                          <p className="mt-1 text-[11px] text-[#817a6a]">
                            {formatEventDate(order.created_at, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${status.style}`}
                        >
                          {status.label}
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#817a6a]">
                            Pelanggan
                          </p>
                          <p className="mt-1 truncate">{order.users?.name ?? "—"}</p>
                          <p className="mt-0.5 truncate text-[11px] text-[#817a6a]">
                            {order.users?.email ?? "—"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#817a6a]">
                            Pembayaran
                          </p>
                          <p className="mt-1 capitalize">{paymentLabel(payment?.payment_method)}</p>
                          {payment?.payer_name && <p className="mt-1 text-[11px] text-[#aaa69b]">Pengirim: {payment.payer_name}</p>}
                          {payment?.transaction_reference && <p className="mt-1 break-all text-[11px] text-[#aaa69b]">Ref: {payment.transaction_reference}</p>}
                          {payment?.paid_amount != null && <p className="mt-1 text-[11px] text-[#aaa69b]">Dibayar: {formatCurrency(Number(payment.paid_amount))}</p>}
                          {payment?.proof_image && (
                            <a
                              href={resolveMediaUrl(payment.proof_image)}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-1 inline-flex items-center gap-1 text-[11px] text-[#c9a85e]"
                            >
                              Lihat bukti <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                      <div className="mt-3 border-t border-white/[0.06] pt-3">
                        {order.order_items?.map((item) => (
                          <p key={item.id} className="mb-1 text-xs text-[#aaa69b]">
                            {item.ticket_categories?.events?.title ?? "Event"} ·{" "}
                            {item.ticket_categories?.category_name ?? "Tiket"} × {item.qty}
                          </p>
                        ))}
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-[11px] text-[#817a6a]">Total pesanan</span>
                          <span className="text-sm font-bold">
                            {formatCurrency(Number(order.total))}
                          </span>
                        </div>
                        {renderPaymentActions(order)}
                      </div>
                    </article>
                  );
                })}
              </div>
              <p className="border-t border-white/[0.06] px-5 py-3 text-[11px] text-[#817a6a]">
                Menampilkan {filteredOrders.length} dari {orders.length} pesanan
              </p>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
