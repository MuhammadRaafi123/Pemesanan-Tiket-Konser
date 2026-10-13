"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LoaderCircle, Pencil, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Event, TicketCategory } from "@/features/events/types";
import type { Artist } from "@/features/artists/types";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/shared/ToastProvider";
import { getApiErrorMessage } from "@/lib/apiError";
import { formatCurrency } from "@/lib/format";

type CatalogTicket = TicketCategory & { events?: { id: number | string; title: string } };
const panel = "rounded-2xl border border-white/10 bg-white/[0.04] p-5 sm:p-6";
const field = "h-10 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm text-white outline-none focus:border-[#c9a85e]";
const inputFile = "block w-full text-xs text-white/50 file:mr-3 file:rounded-lg file:border-0 file:bg-[#c9a85e]/15 file:px-3 file:py-2 file:text-xs file:font-semibold file:text-[#dfc786]";

export default function AdminCatalogPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const { success, error } = useToast();
  const [artists, setArtists] = useState<Artist[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [tickets, setTickets] = useState<CatalogTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [artistEdit, setArtistEdit] = useState<Artist | null>(null);
  const [artistName, setArtistName] = useState("");
  const [artistDescription, setArtistDescription] = useState("");
  const [artistPhoto, setArtistPhoto] = useState<File | null>(null);

  const [eventEdit, setEventEdit] = useState<Event | null>(null);
  const [eventArtist, setEventArtist] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStatus, setEventStatus] = useState<"open" | "closed">("open");
  const [eventPoster, setEventPoster] = useState<File | null>(null);

  const [ticketEdit, setTicketEdit] = useState<CatalogTicket | null>(null);
  const [ticketEvent, setTicketEvent] = useState("");
  const [ticketName, setTicketName] = useState("");
  const [ticketPrice, setTicketPrice] = useState("");
  const [ticketQuota, setTicketQuota] = useState("");

  async function loadCatalog() {
    setLoading(true);
    try {
      const [artistResponse, eventResponse, ticketResponse] = await Promise.all([
        api.get<ApiResponse<Artist[]>>("/artists"),
        api.get<ApiResponse<Event[]>>("/events"),
        api.get<ApiResponse<CatalogTicket[]>>("/tickets"),
      ]);
      setArtists(artistResponse.data.data || []);
      setEvents(eventResponse.data.data || []);
      setTickets(ticketResponse.data.data || []);
    } catch (err) {
      error(getApiErrorMessage(err, "Katalog tidak dapat dimuat."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "admin") {
      router.replace("/home");
      return;
    }
    void loadCatalog();
  // loadCatalog is stable for the lifetime of this page.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, user, router]);

  const mutate = async (action: () => Promise<unknown>, message: string): Promise<boolean> => {
    setSaving(true);
    try {
      await action();
      success(message);
      await loadCatalog();
      return true;
    } catch (err) {
      error(getApiErrorMessage(err, "Perubahan katalog gagal disimpan."));
      return false;
    } finally {
      setSaving(false);
    }
  };

  const submitArtist = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = new FormData();
    body.append("name", artistName);
    body.append("description", artistDescription);
    if (artistPhoto) body.append("photo", artistPhoto);
    void mutate(() => artistEdit ? api.put(`/artists/${artistEdit.id}`, body) : api.post("/artists", body), artistEdit ? "Data artis diperbarui." : "Artis ditambahkan.").then((saved) => { if (!saved) return;
      setArtistEdit(null); setArtistName(""); setArtistDescription(""); setArtistPhoto(null);
    });
  };

  const submitEvent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = new FormData();
    body.append("artist_id", eventArtist);
    body.append("title", eventTitle);
    body.append("description", eventDescription);
    body.append("location", eventLocation);
    body.append("event_date", new Date(eventDate).toISOString());
    if (eventEdit) body.append("status", eventStatus);
    if (eventPoster) body.append("poster", eventPoster);
    void mutate(() => eventEdit ? api.put(`/events/${eventEdit.id}`, body) : api.post("/events", body), eventEdit ? "Event diperbarui." : "Event ditambahkan.").then((saved) => { if (!saved) return;
      setEventEdit(null); setEventArtist(""); setEventTitle(""); setEventDescription(""); setEventLocation(""); setEventDate(""); setEventStatus("open"); setEventPoster(null);
    });
  };

  const submitTicket = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const body = ticketEdit
      ? { category_name: ticketName, price: Number(ticketPrice), quota: Number(ticketQuota) }
      : { event_id: Number(ticketEvent), category_name: ticketName, price: Number(ticketPrice), quota: Number(ticketQuota) };
    void mutate(() => ticketEdit ? api.put(`/tickets/${ticketEdit.id}`, body) : api.post("/tickets", body), ticketEdit ? "Kategori tiket diperbarui." : "Kategori tiket ditambahkan.").then((saved) => { if (!saved) return;
      setTicketEdit(null); setTicketEvent(""); setTicketName(""); setTicketPrice(""); setTicketQuota("");
    });
  };

  const remove = (kind: "artists" | "events" | "tickets", id: number | string, label: string) => {
    if (!window.confirm(`Hapus ${label}? Data yang masih dipakai transaksi mungkin tidak dapat dihapus.`)) return;
    void mutate(() => api.delete(`/${kind}/${id}`), `${label} dihapus.`);
  };

  const startEditEvent = (event: Event) => {
    setEventEdit(event); setEventArtist(String(event.artist_id || "")); setEventTitle(event.title); setEventDescription(event.description); setEventLocation(event.location);
    const date = new Date(event.event_date);
    setEventDate(new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16));
    setEventStatus(event.status); setEventPoster(null);
  };

  if (!hydrated || loading) return <main className="flex min-h-screen items-center justify-center bg-[#0b0b09] text-[#dfc786]"><LoaderCircle className="h-8 w-8 animate-spin" /></main>;

  return <main className="min-h-screen bg-[#0b0b09] px-5 py-7 text-[#f5f0e5] sm:px-8 lg:px-12 lg:py-10"><div className="mx-auto max-w-7xl">
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6"><div><Link href="/admin" className="inline-flex items-center gap-2 text-xs text-[#dfc786]"><ArrowLeft className="h-3.5 w-3.5" />Kembali ke dashboard</Link><h1 className="mt-3 font-serif text-3xl sm:text-4xl">Kelola katalog</h1><p className="mt-2 text-sm text-white/45">Atur event, artis, dan kategori tiket yang ditampilkan ke pelanggan.</p></div><button onClick={() => void loadCatalog()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs text-white/60"><RefreshCw className="h-3.5 w-3.5" />Muat ulang</button></header>

    <div className="mt-7 grid items-start gap-6 xl:grid-cols-3">
      <section className={panel}><h2 className="font-serif text-xl">{artistEdit ? "Edit artis" : "Tambah artis"}</h2><form onSubmit={submitArtist} className="mt-4 space-y-3"><input required minLength={2} value={artistName} onChange={(e) => setArtistName(e.target.value)} placeholder="Nama artis" className={field} /><textarea value={artistDescription} onChange={(e) => setArtistDescription(e.target.value)} placeholder="Deskripsi singkat" className={`${field} h-24 resize-y py-3`} /><input type="file" accept="image/*" onChange={(e) => setArtistPhoto(e.target.files?.[0] || null)} className={inputFile} /><button disabled={saving} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#c9a85e] text-xs font-semibold text-[#17140d] disabled:opacity-50">{artistEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{artistEdit ? "Simpan artis" : "Tambah artis"}</button>{artistEdit && <button type="button" onClick={() => { setArtistEdit(null); setArtistName(""); setArtistDescription(""); setArtistPhoto(null); }} className="w-full text-xs text-white/45">Batalkan edit</button>}</form><div className="mt-6 max-h-80 space-y-2 overflow-y-auto border-t border-white/10 pt-4">{artists.map((artist) => <div key={artist.id} className="flex items-center justify-between gap-2 rounded-xl bg-black/20 px-3 py-2"><span className="truncate text-xs">{artist.name}</span><div className="flex shrink-0 gap-1"><button aria-label={`Edit ${artist.name}`} onClick={() => { setArtistEdit(artist); setArtistName(artist.name); setArtistDescription(artist.description || ""); setArtistPhoto(null); }} className="rounded-lg p-2 text-white/45 hover:text-[#dfc786]"><Pencil className="h-3.5 w-3.5" /></button><button aria-label={`Hapus ${artist.name}`} onClick={() => remove("artists", artist.id, artist.name)} className="rounded-lg p-2 text-white/45 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div></div>)}</div></section>

      <section className={panel}><h2 className="font-serif text-xl">{eventEdit ? "Edit event" : "Tambah event"}</h2><form onSubmit={submitEvent} className="mt-4 space-y-3"><select required value={eventArtist} onChange={(e) => setEventArtist(e.target.value)} className={field}><option value="">Pilih artis</option>{artists.map((artist) => <option key={artist.id} value={artist.id}>{artist.name}</option>)}</select><input required minLength={3} value={eventTitle} onChange={(e) => setEventTitle(e.target.value)} placeholder="Nama event" className={field} /><textarea required minLength={10} value={eventDescription} onChange={(e) => setEventDescription(e.target.value)} placeholder="Deskripsi event" className={`${field} h-24 resize-y py-3`} /><input required minLength={3} value={eventLocation} onChange={(e) => setEventLocation(e.target.value)} placeholder="Lokasi" className={field} /><input required type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className={field} /><div className="grid grid-cols-2 gap-3"><input type="file" accept="image/*" onChange={(e) => setEventPoster(e.target.files?.[0] || null)} className={`${inputFile} min-w-0`} />{eventEdit && <select value={eventStatus} onChange={(e) => setEventStatus(e.target.value as "open" | "closed")} className={field}><option value="open">Penjualan buka</option><option value="closed">Penjualan tutup</option></select>}</div><button disabled={saving || artists.length === 0} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#c9a85e] text-xs font-semibold text-[#17140d] disabled:opacity-50">{eventEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{eventEdit ? "Simpan event" : "Tambah event"}</button>{eventEdit && <button type="button" onClick={() => { setEventEdit(null); setEventArtist(""); setEventTitle(""); setEventDescription(""); setEventLocation(""); setEventDate(""); setEventPoster(null); }} className="w-full text-xs text-white/45">Batalkan edit</button>}</form><div className="mt-6 max-h-80 space-y-2 overflow-y-auto border-t border-white/10 pt-4">{events.map((event) => <div key={event.id} className="flex items-center justify-between gap-2 rounded-xl bg-black/20 px-3 py-2"><span className="min-w-0 truncate text-xs">{event.title}<small className="block text-[10px] text-white/35">{event.status === "open" ? "Penjualan buka" : "Penjualan tutup"}</small></span><div className="flex shrink-0 gap-1"><button aria-label={`Edit ${event.title}`} onClick={() => startEditEvent(event)} className="rounded-lg p-2 text-white/45 hover:text-[#dfc786]"><Pencil className="h-3.5 w-3.5" /></button><button aria-label={`Hapus ${event.title}`} onClick={() => remove("events", event.id, event.title)} className="rounded-lg p-2 text-white/45 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div></div>)}</div></section>

      <section className={panel}><h2 className="font-serif text-xl">{ticketEdit ? "Edit kategori" : "Tambah kategori tiket"}</h2><form onSubmit={submitTicket} className="mt-4 space-y-3"><select required disabled={Boolean(ticketEdit)} value={ticketEvent} onChange={(e) => setTicketEvent(e.target.value)} className={field}><option value="">Pilih event</option>{events.map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select><input required minLength={2} value={ticketName} onChange={(e) => setTicketName(e.target.value)} placeholder="Nama kategori (VIP, Festival...)" className={field} /><input required type="number" min="1" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} placeholder="Harga tiket (Rp)" className={field} /><input required type="number" min={ticketEdit ? Math.max(1, ticketEdit.quota - ticketEdit.remaining) : 1} value={ticketQuota} onChange={(e) => setTicketQuota(e.target.value)} placeholder="Kuota" className={field} /><button disabled={saving || (!ticketEdit && events.length === 0)} className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#c9a85e] text-xs font-semibold text-[#17140d] disabled:opacity-50">{ticketEdit ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}{ticketEdit ? "Simpan kategori" : "Tambah kategori"}</button>{ticketEdit && <button type="button" onClick={() => { setTicketEdit(null); setTicketEvent(""); setTicketName(""); setTicketPrice(""); setTicketQuota(""); }} className="w-full text-xs text-white/45">Batalkan edit</button>}</form><div className="mt-6 max-h-80 space-y-2 overflow-y-auto border-t border-white/10 pt-4">{tickets.map((ticket) => <div key={ticket.id} className="flex items-center justify-between gap-2 rounded-xl bg-black/20 px-3 py-2"><span className="min-w-0 truncate text-xs">{ticket.category_name}<small className="block text-[10px] text-white/35">{ticket.events?.title || "Event"} · {formatCurrency(ticket.price)} · sisa {ticket.remaining}/{ticket.quota}</small></span><div className="flex shrink-0 gap-1"><button aria-label={`Edit ${ticket.category_name}`} onClick={() => { setTicketEdit(ticket); setTicketEvent(String(ticket.event_id || "")); setTicketName(ticket.category_name); setTicketPrice(String(ticket.price)); setTicketQuota(String(ticket.quota)); }} className="rounded-lg p-2 text-white/45 hover:text-[#dfc786]"><Pencil className="h-3.5 w-3.5" /></button><button aria-label={`Hapus ${ticket.category_name}`} onClick={() => remove("tickets", ticket.id, ticket.category_name)} className="rounded-lg p-2 text-white/45 hover:text-rose-300"><Trash2 className="h-3.5 w-3.5" /></button></div></div>)}</div></section>
    </div>
  </div></main>;
}
