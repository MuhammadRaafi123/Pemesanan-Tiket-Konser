"use client";

import Link from "next/link";
import { ArrowUpRight, Camera, Music2, Send, Play, Mail, MapPin, MessageCircle, Ticket, CreditCard, Shield, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/layout/BrandMark";
import { Marquee } from "@/components/shared/Marquee";
import { useAuthStore } from "@/stores/authStore";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "Jadwal konser", href: "/events" },
      { label: "Artis & band", href: "/artists" },
      { label: "Konser terdekat", href: "/home" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Masuk", href: "/login" },
      { label: "Buat akun", href: "/register" },
      { label: "Pesanan saya", href: "/orders" },
      { label: "Tiket digital", href: "/tickets" },
    ],
  },
];

const TICKER = [
  "Sheila On 7",
  "Stray Kids",
  "Ed Sheeran",
  "Coldplay",
  "Bruno Major",
  "Raim Laode",
  "NIKI",
  "Tulus",
  "Hindia",
  "Payung Teduh",
];

const SOCIALS = [
  { label: "Instagram", icon: Camera },
  { label: "TikTok", icon: Music2 },
  { label: "Telegram", icon: Send },
  { label: "YouTube", icon: Play },
];

const PAYMENTS = ["QRIS", "BCA VA", "Mandiri VA", "BNI VA", "GoPay", "OVO", "Visa", "Mastercard"];

export function Footer() {
  const user = useAuthStore((state) => state.user);
  const columns = COLUMNS.map((column) =>
    column.title === "Account"
      ? {
          ...column,
          links: user
            ? [
                { label: "Beranda personal", href: "/home" },
                { label: "Profil saya", href: "/profile" },
                { label: "Pesanan saya", href: "/orders" },
                { label: "Tiket digital", href: "/tickets" },
              ]
            : [
                { label: "Masuk", href: "/login" },
                { label: "Buat akun", href: "/register" },
              ],
        }
      : column,
  );

  return (
    <footer className="border-t border-[#2a2d36] bg-[#0b0e15] pb-28 pt-16 md:pb-10">
      {/* Marquee */}
      <div className="border-b border-[#1e2128] py-5">
        <Marquee
          items={TICKER}
          className="text-[0.68rem] font-bold uppercase tracking-[0.2em] text-[#3a3d46]"
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Main grid */}
        <div className="grid gap-12 py-14 md:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">
          {/* Brand */}
          <div>
            <BrandMark />
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#8a8d98]">
              Kurasi pengalaman live untuk mereka yang masih percaya malam terbaik terjadi di ruangan
              penuh orang asing.
            </p>
            <div className="mt-7 flex items-center gap-2">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  title={label}
                  className="press flex h-9 w-9 items-center justify-center rounded-lg border border-[#2a2d36] text-[#8a8d98] transition hover:border-[#ffb703]/40 hover:text-[#ffb703]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
                {column.title}
              </p>
              <ul className="mt-6 space-y-3.5 text-sm text-[#8a8d98]">
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className="transition-colors hover:text-[#ffb703]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact + Payments */}
          <div className="space-y-6">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
                Layanan Pelanggan
              </p>
              <ul className="mt-5 space-y-3 text-sm text-[#8a8d98]">
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="h-4 w-4 text-[#ffb703]" />
                  <span>WhatsApp: +62 811-9876-5432</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#ffb703]" />
                  <span>support@concertix.id</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-[#ffb703]" />
                  <span>Senayan City Tower, Lt. 18, Jakarta</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#ffb703]">
                Metode Pembayaran
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {PAYMENTS.map((method) => (
                  <span
                    key={method}
                    className="rounded-md border border-[#2a2d36] bg-[#14161c] px-2.5 py-1 text-[10px] font-semibold text-[#8a8d98]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini CTA */}
            <div className="rounded-2xl border border-[#2a2d36] bg-[#14161c] p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#e1e2ec]">
                <Ticket className="h-4 w-4 text-[#ffb703]" />
                Catatan untuk jalan pulang.
              </div>
              <p className="mt-2 text-xs leading-6 text-[#8a8d98]">
                {user
                  ? "Lihat rekomendasi dan kelola semua pengalaman konsermu."
                  : "Dapatkan kurasi event dan cerita live terbaru langsung di inbox."}
              </p>
              <Link
                href={user ? "/home" : "/register"}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#ffb703] transition hover:gap-2.5"
              >
                {user ? "Buka dashboard" : "Gabung sekarang"} <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-[#1e2128] py-8">
          <div className="flex items-center gap-2 text-[11px] text-[#5a5d66]">
            <Shield className="h-4 w-4 text-emerald-400" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#5a5d66]">
            <CreditCard className="h-4 w-4 text-[#ffb703]" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#5a5d66]">
            <Sparkles className="h-4 w-4 text-[#d5baff]" />
            <span>Verified Tickets</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-[#1e2128] py-7 text-[0.68rem] text-[#5a5d66] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Concertix. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-[#ffb703]">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#ffb703]">
              Syarat & Ketentuan
            </Link>
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#ffb703]" />
              Dibuat untuk pencinta musik Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
