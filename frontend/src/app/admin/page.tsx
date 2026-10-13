"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowDownToLine, BadgeCheck, BarChart3, CalendarDays, Check, CircleDollarSign, ClipboardList, ExternalLink, LayoutDashboard, LoaderCircle, RefreshCw, Store, Ticket, Users, X } from "lucide-react";
import api from "@/lib/axios";
import type { ApiResponse } from "@/types/api";
import type { Event, TicketCategory } from "@/features/events/types";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/shared/ToastProvider";
import { formatCurrency } from "@/lib/format";
import { getApiErrorMessage } from "@/lib/apiError";
import { resolveMediaUrl } from "@/lib/media";
import { ScrollReveal } from "@/components/shared/ScrollReveal";
import { createOfflineOrder, fetchAdminEvents, fetchAdminOrders, verifyPayment, type AdminOrder } from "@/features/orders/adminApi";

interface DashboardData {
  totalEvents: number;
  totalArtists: number;
  totalOrders: number;
  ticketsSold: number;
  ticketsRemaining: number;
  totalRevenue: number;
  salesByDate: { date: string; orders: number; revenue: number }[];
}

type Section = "overview" | "orders" | "counter";

const panel = "rounded-2xl border border-white/10 bg-white/[0.04]";
const field = "h-11 w-full rounded-xl border border-white/10 bg-[#11110f] px-3 text-sm text-white outline-none transition focus:border-[#c9a85e]";

export default function AdminPage() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const hydrated = useAuthStore((state) => state.hydrated);
  const { success, error } = useToast();
  const [section, setSection] = useState<Section>("overview");
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [userId, setUserId] = useState("");
  const [eventId, setEventId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [qty, setQty] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "bank_transfer" | "e_wallet">("cash");

  const loadData = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    try {
      const [dashboardResponse, nextOrders, nextEvents] = await Promise.all([
        api.get<ApiResponse<DashboardData>>("/dashboard"),
        fetchAdminOrders(),
        fetchAdminEvents(),
      ]);
      setDashboard(dashboardResponse.data.data || null);
      setOrders(nextOrders);
      setEvents(nextEvents);
    } catch (err) {
      setLoadError(getApiErrorMessage(err, "Data admin tidak dapat dimuat. Periksa koneksi backend lalu coba lagi."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!user || user.role !== "admin") {
      router.replace("/home");
      return;
    }
    void loadData();
  }, [hydrated, user, router, loadData]);

  const selectedEvent = events.find((event) => String(event.id) === eventId);
  const categories: TicketCategory[] = selectedEvent?.ticket_categories || [];
  const filteredOrders = useMemo(() => statusFilter === "all" ? orders : orders.filter((order) => order.status === statusFilter), [orders, statusFilter]);
  const pendingPayments = orders.filter((order) => order.payments?.some((payment) => payment.status === "pending")).length;
  const maxRevenue = Math.max(...(dashboard?.salesByDate || []).map((item) => item.revenue), 1);

  useEffect(() => {
    if (categories.length && !categories.some((category) => String(category.id) === categoryId)) setCategoryId(String(categories[0].id));
    if (!categories.length) setCategoryId("");
  }, [eventId, categories, categoryId]);

  const handleOfflineSale = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId || !eventId || !categoryId || qty < 1) return error("Lengkapi akun pelanggan, event, kategori, dan jumlah tiket.");
    setBusy(true);
    try {
      const order = await createOfflineOrder({ user_id: Number(userId), payment_method: paymentMethod, items: [{ ticket_category_id: Number(categoryId), qty }] });
      success(`Transaksi loket ${order.order_code} berhasil dibayar dan tiket dibuat.`);
      setUserId("");
      setQty(1);
      await loadData();
    } catch (err) {
      error(getApiErrorMessage(err, "Order loket gagal dibuat. Periksa akun pelanggan dan ketersediaan tiket."));
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async (order: AdminOrder, status: "approved" | "rejected") => {
    const payment = order.payments?.find((item) => item.status === "pending");
    if (!payment) return error("Tidak ada pembayaran yang menunggu verifikasi pada pesanan ini.");
    const reason = status === "rejected" ? window.prompt("Tuliskan alasan penolakan pembayaran:")?.trim() : undefined;
    if (status === "rejected" && (!reason || reason.length < 3)) return;
    setBusy(true);
    try {
      await verifyPayment(payment.id, status, reason);
      success(status === "approved" ? "Pembayaran disetujui. Order menjadi lunas dan tiket siap." : "Pembayaran ditolak dan reservasi tiket dilepas.");
      await loadData();
    } catch (err) {
      error(getApiErrorMessage(err, "Verifikasi pembayaran gagal."));
    } finally {
      setBusy(false);
    }
  };

  if (!hydrated || loading) return <main className="flex min-h-screen items-center justify-center bg-[#0b0b09] text-[#f5f0e5]"><LoaderCircle className="h-8 w-8 animate-spin text-[#c9a85e]" /></main>;

  const navItems: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
    { id: "overview", label: "Ringkasan", icon: LayoutDashboard },
    { id: "orders", label: "Pesanan & verifikasi", icon: ClipboardList },
    { id: "counter", label: "Penjualan loket", icon: Store },
  ];

  return (
    <main className="min-h-screen bg-[#0b0b09] text-[#f5f0e5]">
      <div className="mx-auto grid min-h-screen max-w-[1500px] lg:grid-cols-[250px_1fr]">
        <aside className="border-b border-white/10 bg-[#10100d] p-5 lg:border-b-0 lg:border-r lg:p-6">
          <a href="/" className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#c9a85e]/40 bg-[#c9a85e]/10 font-serif text-lg text-[#d8bd7c]">C</span><span><b className="block font-serif text-lg tracking-wide">CONCERTIX</b><small className="text-[10px] uppercase tracking-[.2em] text-white/40">Admin workspace</small></span></a>
          <nav className="mt-8 flex gap-2 overflow-x-auto lg:flex-col">
            {navItems.map(({ id, label, icon: Icon }) => <button key={id} onClick={() => setSection(id)} className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${section === id ? "bg-[#c9a85e]/15 text-[#dfc786]" : "text-white/55 hover:bg-white/5 hover:text-white"}`}><Icon className="h-4 w-4" />{label}{id === "orders" && pendingPayments > 0 && <span className="ml-auto rounded-full bg-[#c9a85e] px-2 py-0.5 text-[10px] font-semibold text-black">{pendingPayments}</span>}</button>)}
            <a href="/admin/catalog" className="flex shrink-0 items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-white/55 transition hover:bg-white/5 hover:text-white"><CalendarDays className="h-4 w-4" />Kelola katalog</a>
          </nav>
          <div className="mt-8 hidden rounded-xl border border-white/10 p-4 text-xs leading-5 text-white/45 lg:block"><p className="font-semibold text-white/75">{user?.name || "Administrator"}</p><p className="mt-1">Kelola penjualan online dan loket dari satu persediaan tiket.</p></div>
        </aside>

        <section className="min-w-0 px-5 py-7 sm:px-8 lg:px-10 lg:py-10">
          <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div><p className="text-[10px] font-semibold uppercase tracking-[.24em] text-[#c9a85e]">Concertix / Admin</p><h1 className="mt-2 font-serif text-3xl tracking-tight sm:text-4xl">{section === "overview" ? "Dashboard penjualan" : section === "orders" ? "Pesanan & verifikasi" : "Penjualan di loket"}</h1><p className="mt-2 text-sm text-white/45">{section === "overview" ? "Pantau event, pesanan, stok, dan pendapatan." : section === "orders" ? "Periksa bukti pembayaran pelanggan dan perbarui status pesanan." : "Buat order pelanggan dan konfirmasi pembayaran langsung."}</p></div>
            <button onClick={() => void loadData()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs text-white/65 transition hover:border-[#c9a85e]/50 hover:text-[#dfc786]"><RefreshCw className="h-3.5 w-3.5" />Muat ulang</button>
          </header>

          {loadError && <div className="mt-6 flex items-center justify-between gap-3 rounded-xl border border-rose-400/20 bg-rose-400/10 p-4 text-sm text-rose-200"><span>{loadError}</span><button onClick={() => void loadData()} className="shrink-0 underline">Coba lagi</button></div>}

          {section === "overview" && <>
            <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{[
              { label: "Total event", value: dashboard?.totalEvents ?? 0, icon: CalendarDays },
              { label: "Total artis", value: dashboard?.totalArtists ?? 0, icon: Users },
              { label: "Total pesanan", value: dashboard?.totalOrders ?? orders.length, icon: ClipboardList },
              { label: "Tiket terjual", value: dashboard?.ticketsSold ?? 0, icon: Ticket },
              { label: "Tiket tersisa", value: dashboard?.ticketsRemaining ?? 0, icon: ArrowDownToLine },
              { label: "Pendapatan", value: formatCurrency(dashboard?.totalRevenue ?? 0), icon: CircleDollarSign },
            ].map(({ label, value, icon: Icon }, index) => <ScrollReveal key={label} delay={index * 65}><article className={`${panel} p-5`}><div className="flex items-center justify-between text-xs text-white/45"><span>{label}</span><Icon className="h-4 w-4 text-[#c9a85e]" /></div><p className="mt-5 font-serif text-2xl text-[#f5f0e5]">{value}</p></article></ScrollReveal>)}</div>
            <section className={`${panel} mt-6 p-5 sm:p-7`}><div className="flex items-center justify-between"><div><div className="flex items-center gap-2 text-xs uppercase tracking-[.18em] text-[#c9a85e]"><BarChart3 className="h-4 w-4" />Penjualan</div><h2 className="mt-2 font-serif text-2xl">Pendapatan per hari</h2></div><span className="text-xs text-white/35">7 catatan terakhir</span></div><div className="mt-8 flex h-52 items-end gap-3 border-b border-l border-white/10 px-3 sm:gap-5">{(dashboard?.salesByDate || []).map((item) => <div key={item.date} className="group flex h-full flex-1 flex-col justify-end gap-2"><div title={formatCurrency(item.revenue)} className="w-full rounded-t-md bg-gradient-to-t from-[#8f7137] to-[#dfc786]" style={{ height: `${Math.max((item.revenue / maxRevenue) * 100, 4)}%` }} /><span className="truncate text-center text-[9px] text-white/35">{item.date.slice(5)}</span></div>)}{!dashboard?.salesByDate?.length && <p className="m-auto text-sm text-white/35">Belum ada data penjualan.</p>}</div></section>
            <section className={`${panel} mt-6 p-5 sm:p-7`}><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-serif text-2xl">Perlu tindakan</h2><p className="mt-1 text-sm text-white/45">Pembayaran transfer menunggu pemeriksaan admin.</p></div><button onClick={() => setSection("orders")} className="rounded-lg border border-[#c9a85e]/40 px-3 py-2 text-xs text-[#dfc786]">Buka {pendingPayments} verifikasi</button></div></section>
          </>}

          {section === "orders" && <section className={`${panel} mt-7 overflow-hidden`}><div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-4 sm:px-6"><div><h2 className="font-semibold">Daftar pesanan</h2><p className="mt-1 text-xs text-white/40">Online dan loket menggunakan stok tiket yang sama.</p></div><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="h-10 rounded-xl border border-white/10 bg-[#11110f] px-3 text-xs text-white"><option value="all">Semua status</option><option value="pending">Menunggu</option><option value="paid">Lunas</option><option value="rejected">Ditolak</option><option value="cancelled">Dibatalkan</option></select></div>
            <div className="divide-y divide-white/10">{filteredOrders.map((order, index) => { const pendingPayment = order.payments?.find((payment) => payment.status === "pending"); return <ScrollReveal key={order.id} delay={Math.min(index, 5) * 45}><article className="grid gap-4 p-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6"><div className="min-w-0"><div className="flex flex-wrap items-center gap-2"><span className="font-mono text-sm text-[#dfc786]">{order.order_code}</span><span className={`rounded-full px-2 py-1 text-[9px] uppercase tracking-wider ${order.status === "paid" ? "bg-emerald-400/10 text-emerald-300" : order.status === "pending" ? "bg-amber-400/10 text-amber-200" : "bg-white/10 text-white/50"}`}>{order.status}</span></div><p className="mt-2 truncate text-sm text-white/80">{order.users?.name || "Pelanggan"} · {order.order_items?.map((item) => `${item.qty}× ${item.ticket_categories?.category_name || "Tiket"}`).join(", ") || "Item tiket"}</p><p className="mt-1 text-xs text-white/40">{order.events?.title || order.order_items?.[0]?.ticket_categories?.events?.title || "Event"} · {formatCurrency(order.total)} · {pendingPayment ? `Pembayaran ${pendingPayment.payment_method}` : order.payments?.[0]?.payment_method || "Belum ada bukti pembayaran"}</p>{pendingPayment?.proof_image && <a href={resolveMediaUrl(pendingPayment.proof_image)} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs text-[#dfc786] hover:underline">Lihat bukti pembayaran <ExternalLink className="h-3 w-3" /></a>}</div>{pendingPayment && <div className="flex gap-2"><button disabled={busy} onClick={() => void handleVerify(order, "rejected")} className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-rose-300/20 px-3 text-xs text-rose-200 disabled:opacity-40"><X className="h-3.5 w-3.5" />Tolak</button><button disabled={busy} onClick={() => void handleVerify(order, "approved")} className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-[#c9a85e] px-3 text-xs font-semibold text-[#17140d] disabled:opacity-40"><Check className="h-3.5 w-3.5" />Setujui</button></div>}</article></ScrollReveal>; })}{!filteredOrders.length && <p className="p-10 text-center text-sm text-white/40">Belum ada pesanan untuk filter ini.</p>}</div>
          </section>}

          {section === "counter" && <div className="mt-7 grid gap-6 xl:grid-cols-[minmax(0,1fr)_350px]">
            <form onSubmit={handleOfflineSale} className={`${panel} space-y-5 p-5 sm:p-7`}><div><h2 className="font-serif text-2xl">Transaksi baru</h2><p className="mt-1 text-sm leading-6 text-white/45">Pembayaran langsung dicatat lunas, stok dikurangi, dan QR ticket dibuat oleh sistem.</p></div>
              <label className="block space-y-2 text-xs text-white/60"><span>ID akun pelanggan</span><input required inputMode="numeric" min="1" value={userId} onChange={(event) => setUserId(event.target.value)} placeholder="Masukkan ID pelanggan" className={field} /><span className="block text-[10px] leading-4 text-white/35">ID akun diperlukan oleh sistem untuk mengaitkan tiket dan riwayat transaksi.</span></label>
              <label className="block space-y-2 text-xs text-white/60"><span>Event</span><select required value={eventId} onChange={(event) => setEventId(event.target.value)} className={field}><option value="">Pilih event</option>{events.filter((event) => event.status === "open").map((event) => <option key={event.id} value={event.id}>{event.title}</option>)}</select></label>
              <div className="grid gap-4 sm:grid-cols-2"><label className="block space-y-2 text-xs text-white/60"><span>Kategori tiket</span><select required disabled={!categories.length} value={categoryId} onChange={(event) => setCategoryId(event.target.value)} className={field}><option value="">Pilih kategori</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.category_name} · sisa {category.remaining}</option>)}</select></label><label className="block space-y-2 text-xs text-white/60"><span>Jumlah tiket</span><input required type="number" min="1" max={categories.find((item) => String(item.id) === categoryId)?.remaining || undefined} value={qty} onChange={(event) => setQty(Number(event.target.value))} className={field} /></label></div>
              <label className="block space-y-2 text-xs text-white/60"><span>Metode pembayaran</span><select value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value as typeof paymentMethod)} className={field}><option value="cash">Tunai</option><option value="bank_transfer">Transfer bank di loket</option><option value="e_wallet">E-wallet</option></select></label>
              <div className="flex items-start gap-3 rounded-xl border border-[#c9a85e]/20 bg-[#c9a85e]/[0.06] p-4 text-xs leading-5 text-[#d7c58f]"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" />Pastikan pembayaran sudah diterima sebelum membuat transaksi. Order loket akan langsung berstatus lunas.</div>
              <button disabled={busy || !categories.length} className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#c9a85e] px-5 text-sm font-semibold text-[#17140d] transition hover:bg-[#dfc786] disabled:cursor-not-allowed disabled:opacity-50">{busy ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Store className="h-4 w-4" />}Buat order lunas</button>
            </form>
            <aside className={`${panel} h-fit p-5 sm:p-6`}><p className="text-[10px] uppercase tracking-[.2em] text-[#c9a85e]">Alur loket</p><ol className="mt-5 space-y-5">{["Pilih akun pelanggan dan tiket", "Sistem cek kuota yang sama dengan online", "Terima pembayaran tunai / transfer", "Order paid dan QR ticket diterbitkan"].map((text, index) => <li key={text} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#c9a85e]/30 text-xs text-[#dfc786]">{index + 1}</span><span className="pt-1 text-sm leading-5 text-white/60">{text}</span></li>)}</ol><div className="mt-6 border-t border-white/10 pt-5"><p className="text-xs text-white/40">Pilihan stok saat ini</p><p className="mt-2 text-sm text-white/80">{selectedEvent?.title || "Pilih event"}</p><p className="mt-1 text-xs text-white/45">{categories.find((item) => String(item.id) === categoryId)?.category_name || "Pilih kategori"}</p></div></aside>
          </div>}
        </section>
      </div>
    </main>
  );
}
