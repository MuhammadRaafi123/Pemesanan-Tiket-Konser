"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  LoaderCircle,
  MapPin,
  Music2,
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
import { formatEventDate } from "@/lib/format";
import { resolveMediaUrl } from "@/lib/media";
import type { Artist } from "@/features/artists/types";
import type { Event } from "@/features/events/types";
import type { ApiResponse } from "@/types/api";

type EventStatusFilter = "all" | "open" | "closed";

const field =
  "h-11 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm text-[#f5f0e5] outline-none transition placeholder:text-white/30 focus:border-[#c9a85e]";
const inputFile =
  "block w-full text-xs text-white/50 file:mr-3 file:rounded-lg file:border-0 file:bg-[#c9a85e]/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#dfc786]";

function localDateTimeValue(value: string) {
  const date = new Date(value);
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default function AdminEventsPage() {
  const { success, error } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventEdit, setEventEdit] = useState<Event | null>(null);

  const [artistId, setArtistId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [status, setStatus] = useState<"open" | "closed">("open");
  const [poster, setPoster] = useState<File | null>(null);

  const loadData = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const [eventResponse, artistResponse] = await Promise.all([
          api.get<ApiResponse<Event[]>>("/events"),
          api.get<ApiResponse<Artist[]>>("/artists"),
        ]);
        setEvents(eventResponse.data.data ?? []);
        setArtists(artistResponse.data.data ?? []);
      } catch (err) {
        error(getApiErrorMessage(err, "Data event tidak dapat dimuat."));
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

  const filteredEvents = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("id");
    return events.filter((event) => {
      const matchesStatus = statusFilter === "all" || event.status === statusFilter;
      const matchesSearch =
        !query ||
        [event.title, event.location, event.artists?.name]
          .filter(Boolean)
          .some((value) => value!.toLocaleLowerCase("id").includes(query));
      return matchesStatus && matchesSearch;
    });
  }, [events, search, statusFilter]);

  const resetForm = () => {
    setEventEdit(null);
    setArtistId("");
    setTitle("");
    setDescription("");
    setLocation("");
    setEventDate("");
    setStatus("open");
    setPoster(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEditDialog = (event: Event) => {
    setEventEdit(event);
    setArtistId(String(event.artist_id ?? ""));
    setTitle(event.title);
    setDescription(event.description);
    setLocation(event.location);
    setEventDate(localDateTimeValue(event.event_date));
    setStatus(event.status);
    setPoster(null);
    setDialogOpen(true);
  };

  const submitEvent = async (formEvent: FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    setSaving(true);
    try {
      const body = new FormData();
      body.append("artist_id", artistId);
      body.append("title", title.trim());
      body.append("description", description.trim());
      body.append("location", location.trim());
      body.append("event_date", new Date(eventDate).toISOString());
      if (eventEdit) body.append("status", status);
      if (poster) body.append("poster", poster);

      if (eventEdit) {
        await api.put(`/events/${eventEdit.id}`, body);
        success("Event berhasil diperbarui.");
      } else {
        await api.post("/events", body);
        success("Event berhasil ditambahkan.");
      }

      setDialogOpen(false);
      resetForm();
      await loadData(false);
    } catch (err) {
      error(getApiErrorMessage(err, "Event gagal disimpan."));
    } finally {
      setSaving(false);
    }
  };

  const deleteEvent = async (event: Event) => {
    if (
      !window.confirm(
        `Hapus event "${event.title}"? Kategori tiket terkait juga dapat terhapus.`,
      )
    ) {
      return;
    }

    setSaving(true);
    try {
      await api.delete(`/events/${event.id}`);
      success("Event berhasil dihapus.");
      await loadData(false);
    } catch (err) {
      error(getApiErrorMessage(err, "Event gagal dihapus."));
    } finally {
      setSaving(false);
    }
  };

  const openCount = events.filter((event) => event.status === "open").length;
  const closedCount = events.length - openCount;

  return (
    <div className="min-h-full px-5 py-8 text-[#f5f0e5] sm:px-8 sm:py-10">
      <div className="mx-auto max-w-7xl">
        <header className="flex flex-col justify-between gap-5 border-b border-[rgba(201,168,94,0.12)] pb-6 sm:flex-row sm:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#c9a85e]/70">
              Admin · Manajemen event
            </p>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
              Kelola Event
            </h1>
            <p className="mt-1 text-sm text-[#817a6a]">
              Buat dan atur informasi konser yang tersedia untuk pelanggan.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
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
              disabled={artists.length === 0}
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#c9a85e] px-4 text-xs font-bold text-[#17140d] transition hover:bg-[#dfc786] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus className="h-4 w-4" />
              Tambah event
            </button>
          </div>
        </header>

        {artists.length === 0 && !loading && (
          <p className="mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.06] px-4 py-3 text-xs leading-5 text-amber-200/80">
            Tambahkan artis terlebih dahulu di{" "}
            <a className="font-semibold underline underline-offset-2" href="/admin/catalog">
              Katalog
            </a>{" "}
            sebelum membuat event.
          </p>
        )}

        <section className="mt-6 grid gap-3 sm:grid-cols-3">
          {[
            { label: "Total event", value: events.length, icon: CalendarDays },
            { label: "Penjualan buka", value: openCount, icon: Ticket },
            { label: "Penjualan tutup", value: closedCount, icon: Music2 },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-center justify-between rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410] p-4"
            >
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-[#817a6a]">
                  {label}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a85e]/20 bg-[#c9a85e]/10 text-[#c9a85e]">
                <Icon className="h-4 w-4" />
              </span>
            </div>
          ))}
        </section>

        <section className="mt-6 overflow-hidden rounded-2xl border border-[rgba(201,168,94,0.13)] bg-[#141410]">
          <div className="flex flex-col gap-3 border-b border-white/[0.07] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div className="relative min-w-0 flex-1 sm:max-w-md">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#817a6a]" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama event, artis, atau lokasi..."
                aria-label="Cari event"
                className={`${field} pl-9`}
              />
            </div>
            <div className="flex gap-1 rounded-xl border border-white/[0.08] bg-black/20 p-1">
              {(
                [
                  ["all", "Semua"],
                  ["open", "Buka"],
                  ["closed", "Tutup"],
                ] as const
              ).map(([value, label]) => (
                <button
                  type="button"
                  key={value}
                  onClick={() => setStatusFilter(value)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    statusFilter === value
                      ? "bg-[#c9a85e]/15 text-[#dfc786]"
                      : "text-[#817a6a] hover:text-[#f5f0e5]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-64 items-center justify-center gap-3 text-sm text-[#817a6a]">
              <LoaderCircle className="h-5 w-5 animate-spin text-[#c9a85e]" />
              Memuat data event...
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center px-6 text-center">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#c9a85e]/20 bg-[#c9a85e]/10 text-[#c9a85e]">
                <Music2 className="h-5 w-5" />
              </span>
              <h2 className="mt-4 font-semibold">
                {events.length === 0 ? "Belum ada event" : "Event tidak ditemukan"}
              </h2>
              <p className="mt-1 max-w-sm text-xs leading-5 text-[#817a6a]">
                {events.length === 0
                  ? "Tambahkan event pertama untuk mulai mengelola jadwal konser."
                  : "Ubah kata kunci pencarian atau filter status untuk melihat event."}
              </p>
              {events.length === 0 && artists.length > 0 && (
                <button
                  type="button"
                  onClick={openCreateDialog}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#c9a85e] px-4 py-2.5 text-xs font-bold text-[#17140d] transition hover:bg-[#dfc786]"
                >
                  <Plus className="h-4 w-4" />
                  Tambah event
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[760px] text-left">
                  <thead>
                    <tr className="border-b border-white/[0.07] text-[10px] font-semibold uppercase tracking-[0.14em] text-[#817a6a]">
                      <th className="px-5 py-3">Event</th>
                      <th className="px-4 py-3">Artis & lokasi</th>
                      <th className="px-4 py-3">Jadwal</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-5 py-3 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.05]">
                    {filteredEvents.map((event) => (
                      <tr key={event.id} className="transition hover:bg-white/[0.02]">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {event.poster ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={resolveMediaUrl(event.poster)}
                                alt=""
                                className="h-14 w-11 rounded-lg border border-white/10 object-cover"
                              />
                            ) : (
                              <span className="flex h-14 w-11 items-center justify-center rounded-lg border border-white/10 bg-black/20 text-[#c9a85e]/60">
                                <Music2 className="h-4 w-4" />
                              </span>
                            )}
                            <span className="max-w-[260px]">
                              <span className="block truncate text-sm font-semibold text-[#f5f0e5]">
                                {event.title}
                              </span>
                              <span className="mt-1 block truncate text-[11px] text-[#817a6a]">
                                {event.description}
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-medium text-[#d8d1c1]">
                            {event.artists?.name ?? "Artis tidak tersedia"}
                          </p>
                          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#817a6a]">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="max-w-44 truncate">{event.location}</span>
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-xs text-[#d8d1c1]">
                          {formatEventDate(event.event_date, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                              event.status === "open"
                                ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                                : "border-white/10 bg-white/[0.04] text-[#aaa69b]"
                            }`}
                          >
                            {event.status === "open" ? "Penjualan buka" : "Penjualan tutup"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => openEditDialog(event)}
                              aria-label={`Edit ${event.title}`}
                              className="rounded-lg p-2 text-[#817a6a] transition hover:bg-[#c9a85e]/10 hover:text-[#dfc786]"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => void deleteEvent(event)}
                              disabled={saving}
                              aria-label={`Hapus ${event.title}`}
                              className="rounded-lg p-2 text-[#817a6a] transition hover:bg-rose-400/10 hover:text-rose-300 disabled:opacity-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="divide-y divide-white/[0.06] md:hidden">
                {filteredEvents.map((event) => (
                  <article key={event.id} className="flex gap-3 p-4">
                    {event.poster ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolveMediaUrl(event.poster)}
                        alt=""
                        className="h-24 w-16 shrink-0 rounded-xl border border-white/10 object-cover"
                      />
                    ) : (
                      <span className="flex h-24 w-16 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-black/20 text-[#c9a85e]/60">
                        <Music2 className="h-5 w-5" />
                      </span>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="line-clamp-2 text-sm font-semibold">{event.title}</h2>
                        <span
                          className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-semibold ${
                            event.status === "open"
                              ? "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300"
                              : "border-white/10 bg-white/[0.04] text-[#aaa69b]"
                          }`}
                        >
                          {event.status === "open" ? "Buka" : "Tutup"}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-xs text-[#c9a85e]">
                        {event.artists?.name ?? "Artis tidak tersedia"}
                      </p>
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] text-[#817a6a]">
                        <MapPin className="h-3 w-3 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </p>
                      <p className="mt-1 text-[11px] text-[#817a6a]">
                        {formatEventDate(event.event_date, {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <div className="mt-2 flex gap-1">
                        <button
                          type="button"
                          onClick={() => openEditDialog(event)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-[#dfc786] hover:bg-[#c9a85e]/10"
                        >
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => void deleteEvent(event)}
                          disabled={saving}
                          className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[11px] font-medium text-rose-300 hover:bg-rose-400/10 disabled:opacity-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <p className="border-t border-white/[0.06] px-5 py-3 text-[11px] text-[#817a6a]">
                Menampilkan {filteredEvents.length} dari {events.length} event
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
            aria-labelledby="event-dialog-title"
            className="relative my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[rgba(201,168,94,0.2)] bg-[#141410] p-5 shadow-2xl sm:p-7"
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
              Informasi konser
            </p>
            <h2 id="event-dialog-title" className="mt-1 text-xl font-bold">
              {eventEdit ? "Edit event" : "Tambah event"}
            </h2>
            <p className="mt-1 pr-8 text-xs leading-5 text-[#817a6a]">
              Lengkapi detail event. Poster menerima format JPG, PNG, atau WEBP hingga 5 MB.
            </p>

            <form onSubmit={submitEvent} className="mt-5 space-y-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#d8d1c1]">Artis</span>
                <select
                  required
                  value={artistId}
                  onChange={(event) => setArtistId(event.target.value)}
                  className={field}
                >
                  <option value="">Pilih artis</option>
                  {artists.map((artist) => (
                    <option key={artist.id} value={artist.id}>
                      {artist.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#d8d1c1]">Nama event</span>
                <input
                  required
                  minLength={3}
                  maxLength={255}
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                  placeholder="Contoh: Tur Konser 2026"
                  className={field}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#d8d1c1]">Lokasi</span>
                  <input
                    required
                    minLength={3}
                    maxLength={255}
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    placeholder="Nama venue, kota"
                    className={field}
                  />
                </label>
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#d8d1c1]">Tanggal & waktu</span>
                  <input
                    required
                    type="datetime-local"
                    value={eventDate}
                    onChange={(event) => setEventDate(event.target.value)}
                    className={`${field} [color-scheme:dark]`}
                  />
                </label>
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-medium text-[#d8d1c1]">Deskripsi</span>
                <textarea
                  required
                  minLength={10}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={4}
                  placeholder="Ceritakan informasi dan detail event..."
                  className={`${field} h-auto resize-y py-3`}
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1.5">
                  <span className="text-xs font-medium text-[#d8d1c1]">
                    Poster {eventEdit ? "(opsional untuk mengganti)" : "(opsional)"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={(event) => setPoster(event.target.files?.[0] ?? null)}
                    className={`${inputFile} min-h-11 rounded-xl border border-white/10 bg-[#11110f] px-3 py-2`}
                  />
                </label>
                {eventEdit && (
                  <label className="block space-y-1.5">
                    <span className="text-xs font-medium text-[#d8d1c1]">Status penjualan</span>
                    <select
                      value={status}
                      onChange={(event) =>
                        setStatus(event.target.value as "open" | "closed")
                      }
                      className={field}
                    >
                      <option value="open">Buka</option>
                      <option value="closed">Tutup</option>
                    </select>
                  </label>
                )}
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
                  disabled={saving || artists.length === 0}
                  className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#c9a85e] px-5 text-xs font-bold text-[#17140d] transition hover:bg-[#dfc786] disabled:opacity-50"
                >
                  {saving && <LoaderCircle className="h-4 w-4 animate-spin" />}
                  {eventEdit ? "Simpan perubahan" : "Buat event"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
