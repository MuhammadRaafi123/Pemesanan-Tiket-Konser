"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  LoaderCircle,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Ticket,
  Trash2,
  X,
} from "lucide-react";
import api from "@/lib/axios";
import { useToast } from "@/components/shared/ToastProvider";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatCurrency } from "@/lib/format";
import type { Event, TicketCategory } from "@/features/events/types";
import type { ApiResponse } from "@/types/api";

type AdminTicket = TicketCategory & {
  events?: { id: number | string; title: string };
};

const field =
  "h-11 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm text-[#f5f0e5] outline-none transition placeholder:text-white/30 focus:border-[#c9a85e]";

export default function AdminTicketsPage() {
  const { success, error } = useToast();
  const [tickets, setTickets] = useState<AdminTicket[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [ticketEdit, setTicketEdit] = useState<AdminTicket | null>(null);
  const [eventId, setEventId] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [price, setPrice] = useState("");
  const [quota, setQuota] = useState("");

  const loadData = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const [ticketResponse, eventResponse] = await Promise.all([
          api.get<ApiResponse<AdminTicket[]>>("/tickets"),
          api.get<ApiResponse<Event[]>>("/events"),
        ]);
        setTickets(ticketResponse.data.data ?? []);
        setEvents(eventResponse.data.data ?? []);
      } catch (err) {
        error(getApiErrorMessage(err, "Data kategori tiket tidak dapat dimuat."));
      } finally {
        setLoading(false);
      }
    },
    [error],
  );

  useEffect(() => {
    const timer = window.setTimeout(() => void loadData(), 0);
    return () => window.clearTimeout(timer);
  }, [loadData]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");
    if (!query) return tickets;
    return tickets.filter((ticket) =>
      [ticket.category_name, ticket.events?.title]
        .filter(Boolean)
        .some((value) => value!.toLocaleLowerCase("id").includes(query)),
    );
  }, [search, tickets]);

  const resetForm = () => {
    setTicketEdit(null);
    setEventId("");
    setCategoryName("");
    setPrice("");
    setQuota("");
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (ticket: AdminTicket) => {
    setTicketEdit(ticket);
    setEventId(String(ticket.event_id ?? ""));
    setCategoryName(ticket.category_name);
    setPrice(String(ticket.price));
    setQuota(String(ticket.quota));
    setDialogOpen(true);
  };

  const submitTicket = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const nextQuota = Number(quota);
    const sold = ticketEdit ? ticketEdit.quota - ticketEdit.remaining : 0;
    if (nextQuota < sold) {
      error(`Kuota tidak boleh kurang dari tiket terjual (${sold}).`);
      return;
    }

    setSaving(true);
    try {
      if (ticketEdit) {
        await api.put(`/tickets/${ticketEdit.id}`, {
          category_name: categoryName.trim(),
          price: Number(price),
          quota: nextQuota,
          remaining: nextQuota - sold,
        });
        success("Kategori tiket berhasil diperbarui.");
      } else {
        await api.post("/tickets", {
          event_id: Number(eventId),
          category_name: categoryName.trim(),
          price: Number(price),
          quota: nextQuota,
        });
        success("Kategori tiket berhasil ditambahkan.");
      }
      setDialogOpen(false);
      resetForm();
      await loadData(false);
    } catch (err) {
      error(getApiErrorMessage(err, "Kategori tiket gagal disimpan."));
    } finally {
      setSaving(false);
    }
  };

  const deleteTicket = async (ticket: AdminTicket) => {
    if (
      !window.confirm(
        `Hapus kategori "${ticket.category_name}"? Pastikan kategori ini tidak digunakan dalam transaksi.`,
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      await api.delete(`/tickets/${ticket.id}`);
      success("Kategori tiket berhasil dihapus.");
      await loadData(false);
    } catch (err) {
      error(getApiErrorMessage(err, "Kategori tiket gagal dihapus."));
    } finally {
      setSaving(false);
    }
  };

  const soldCount = (ticket: AdminTicket) => ticket.quota - ticket.remaining;
  const totalRemaining = tickets.reduce((sum, ticket) => sum + ticket.remaining, 0);

  return (
    <div className="min-h-full px-5 py-8 text-[#f5f0e5] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-[rgba(201,168,94,0.12)] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85e]/70">
              Admin · Manajemen tiket
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Kategori Tiket
            </h1>
            <p className="mt-1 text-sm text-[#817a6a]">
              Atur harga dan kuota tiket untuk setiap event.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => void loadData()}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[rgba(201,168,94,0.2)] bg-white/[0.03] px-3.5 text-xs font-semibold text-[#c9a85e] transition hover:bg-[#c9a85e]/10 disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              Muat ulang
            </button>
            <button
              type="button"
              onClick={openCreateDialog}
              disabled={events.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#c9a85e] px-4 text-xs font-bold text-[#17140d] transition hover:bg-[#dfc786] disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Tambah kategori
            </button>
          </div>
        </header>

        {events.length === 0 && !loading && (
          <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-xs leading-5 text-amber-200/80">
            Belum ada event. Buat event terlebih dahulu di halaman{" "}
            <a className="font-semibold underline underline-offset-2" href="/admin/events">
              Event
            </a>
            .
          </p>
        )}

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Kategori tiket", value: tickets.length },
            { label: "Tiket terjual", value: tickets.reduce((sum, ticket) => sum + soldCount(ticket), 0) },
            { label: "Tiket tersedia", value: totalRemaining },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410] p-4"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#817a6a]">
                {label}
              </p>
              <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410]">
          <div className="border-b border-white/[0.07] p-4 sm:p-5">
            <div className="relative max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#817a6a]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari kategori atau nama event..."
                aria-label="Cari kategori tiket"
                className={`${field} pl-9`}
              />
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#817a6a]">
              <LoaderCircle className="h-5 w-5 animate-spin text-[#c9a85e]" />
              Memuat kategori tiket...
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a85e]/20 bg-[#c9a85e]/10 text-[#c9a85e]">
                <Ticket className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold">
                {tickets.length === 0 ? "Belum ada kategori tiket" : "Kategori tidak ditemukan"}
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#817a6a]">
                {tickets.length === 0
                  ? "Buat kategori agar pelanggan dapat memesan tiket event."
                  : "Coba kata kunci pencarian yang lain."}
              </p>
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[700px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#817a6a]">
                      <th className="px-5 py-3">Kategori</th>
                      <th className="px-4 py-3">Event</th>
                      <th className="px-4 py-3">Harga</th>
                      <th className="px-4 py-3">Terjual / Kuota</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredTickets.map((ticket) => {
                      const sold = soldCount(ticket);
                      const percentage = ticket.quota ? Math.min((sold / ticket.quota) * 100, 100) : 0;
                      return (
                        <tr key={ticket.id} className="transition hover:bg-white/[0.02]">
                          <td className="px-5 py-4">
                            <p className="text-sm font-semibold">{ticket.category_name}</p>
                            <p className="mt-1 text-[11px] text-[#817a6a]">
                              {ticket.remaining} tiket tersisa
                            </p>
                          </td>
                          <td className="px-4 py-4 text-xs text-[#d8d1c1]">
                            {ticket.events?.title ?? "Event tidak tersedia"}
                          </td>
                          <td className="whitespace-nowrap px-4 py-4 text-xs font-medium text-[#dfc786]">
                            {formatCurrency(Number(ticket.price))}
                          </td>
                          <td className="px-4 py-4">
                            <p className="text-xs tabular-nums">
                              {sold} / {ticket.quota}
                            </p>
                            <div className="mt-2 h-1.5 w-28 overflow-hidden rounded-full bg-white/10">
                              <div
                                className="h-full rounded-full bg-[#c9a85e]"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => openEditDialog(ticket)}
                                aria-label={`Edit ${ticket.category_name}`}
                                className="rounded-lg p-2 text-[#817a6a] transition hover:bg-[#c9a85e]/10 hover:text-[#dfc786]"
                              >
                                <Pencil className="h-4 w-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => void deleteTicket(ticket)}
                                disabled={saving}
                                aria-label={`Hapus ${ticket.category_name}`}
                                className="rounded-lg p-2 text-[#817a6a] transition hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-white/[0.06] md:hidden">
                {filteredTickets.map((ticket) => (
                  <article key={ticket.id} className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-sm font-semibold">{ticket.category_name}</h2>
                        <p className="mt-1 truncate text-xs text-[#817a6a]">
                          {ticket.events?.title ?? "Event tidak tersedia"}
                        </p>
                      </div>
                      <p className="shrink-0 text-xs font-semibold text-[#dfc786]">
                        {formatCurrency(Number(ticket.price))}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#817a6a]">
                      <span>
                        Terjual {soldCount(ticket)} / {ticket.quota}
                      </span>
                      <span>{ticket.remaining} tersedia</span>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#c9a85e]"
                        style={{
                          width: `${ticket.quota ? Math.min((soldCount(ticket) / ticket.quota) * 100, 100) : 0}%`,
                        }}
                      />
                    </div>
                    <div className="mt-2 flex gap-1">
                      <button
                        type="button"
                        onClick={() => openEditDialog(ticket)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-[#dfc786] hover:bg-[#c9a85e]/10"
                      >
                        <Pencil className="h-3 w-3" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => void deleteTicket(ticket)}
                        disabled={saving}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-rose-300 hover:bg-rose-400/10 disabled:opacity-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Hapus
                      </button>
                    </div>
                  </article>
                ))}
              </div>
              <p className="border-t border-white/[0.06] px-5 py-3 text-[11px] text-[#817a6a]">
                Menampilkan {filteredTickets.length} dari {tickets.length} kategori
              </p>
            </>
          )}
        </section>
      </div>

      {dialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) setDialogOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="ticket-dialog-title"
            className="relative my-auto max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-[rgba(201,168,94,0.2)] bg-[#141410] p-5 shadow-2xl sm:p-7"
          >
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              disabled={saving}
              aria-label="Tutup form"
              className="absolute right-4 top-4 rounded-lg p-2 text-[#817a6a] transition hover:bg-white/[0.06] hover:text-white disabled:opacity-50"
            >
              <X className="h-4 w-4" />
            </button>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#c9a85e]/70">
              Penjualan tiket
            </p>
            <h2 id="ticket-dialog-title" className="mt-1 text-xl font-bold">
              {ticketEdit ? "Edit kategori" : "Tambah kategori tiket"}
            </h2>
            <form onSubmit={submitTicket} className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#d8d1c1]">Event</span>
                <select
                  required
                  disabled={Boolean(ticketEdit)}
                  value={eventId}
                  onChange={(event) => setEventId(event.target.value)}
                  className={`${field} disabled:opacity-60`}
                >
                  <option value="">Pilih event</option>
                  {events.map((event) => (
                    <option key={event.id} value={event.id}>
                      {event.title}
                    </option>
                  ))}
                </select>
                {ticketEdit && (
                  <span className="block text-[11px] text-[#817a6a]">
                    Kategori tidak dapat dipindahkan ke event lain.
                  </span>
                )}
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#d8d1c1]">Nama kategori</span>
                <input
                  required
                  minLength={2}
                  maxLength={100}
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="VIP, Festival, Regular..."
                  className={field}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#d8d1c1]">Harga (Rp)</span>
                  <input
                    required
                    type="number"
                    min="1"
                    step="1"
                    value={price}
                    onChange={(event) => setPrice(event.target.value)}
                    placeholder="250000"
                    className={field}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#d8d1c1]">Kuota</span>
                  <input
                    required
                    type="number"
                    min={ticketEdit ? Math.max(1, soldCount(ticketEdit)) : 1}
                    step="1"
                    value={quota}
                    onChange={(event) => setQuota(event.target.value)}
                    placeholder="100"
                    className={field}
                  />
                  {ticketEdit && (
                    <span className="block text-[11px] text-[#817a6a]">
                      Minimal {soldCount(ticketEdit)} sesuai tiket yang sudah terjual.
                    </span>
                  )}
                </label>
              </div>
              <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setDialogOpen(false)}
                  disabled={saving}
                  className="h-10 rounded-xl border border-white/10 px-4 text-xs font-semibold text-[#aaa69b] transition hover:bg-white/[0.04] disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving || events.length === 0}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#c9a85e] px-5 text-xs font-bold text-[#17140d] transition hover:bg-[#dfc786] disabled:opacity-50"
                >
                  {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {ticketEdit ? "Simpan perubahan" : "Buat kategori"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
