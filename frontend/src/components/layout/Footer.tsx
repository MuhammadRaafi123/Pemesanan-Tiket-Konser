"use client";

import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Camera, Music2, Send, Play, Mail, MapPin, MessageCircle, Ticket, CreditCard, Shield } from "lucide-react";
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
    <footer className="relative border-t border-[#c8b7db]/20 bg-[#071653] pb-28 pt-16 text-[#c8b7db] md:pb-10">
      {/* Top subtle cyber hairline */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#6264b5] to-transparent" />

      {/* Marquee */}
      <div className="border-b border-[#c8b7db]/10 py-5">
        <Marquee
          items={TICKER}
          className="text-[0.68rem] font-bold uppercase tracking-[0.25em] text-[#c8b7db]/70 hover:text-[#fffdf2] transition-colors"
        />
      </div>

      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        {/* Main grid */}
        <div className="grid gap-12 py-14 md:grid-cols-[1.4fr_0.7fr_0.7fr_1fr]">
          {/* Brand */}
          <div>
            <BrandMark />
            <p className="mt-6 max-w-xs text-sm leading-7 text-[#c8b7db]/90">
              Platform tiket konser resmi masa depan dengan enkripsi barcode dinamis, visualisasi panggung 3D interaktif, dan proteksi refund 100%.
            </p>
            <div className="mt-7 flex items-center gap-2">
              {SOCIALS.map(({ label, icon: Icon }) => (
                <span
                  key={label}
                  title={label}
                  className="press flex h-9 w-9 items-center justify-center rounded-lg border border-[#c8b7db]/20 bg-[#071653] text-[#c8b7db] transition hover:border-[#6264b5] hover:bg-[#6264b5]/20 hover:text-[#fffdf2]"
                >
                  <Icon className="h-3.5 w-3.5" />
                </span>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#fffdf2]">
                {column.title}
              </p>
              <ul className="mt-6 space-y-3.5 text-sm text-[#c8b7db]/80">
                {column.links.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <Link href={link.href} className="transition-colors hover:text-[#fffdf2]">
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
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#fffdf2]">
                Layanan Pelanggan
              </p>
              <ul className="mt-5 space-y-3 text-sm text-[#c8b7db]/90">
                <li className="flex items-center gap-2.5">
                  <MessageCircle className="h-4 w-4 text-[#6264b5]" />
                  <span>WhatsApp: +62 811-9876-5432</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#6264b5]" />
                  <span>support@tixora.id</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <MapPin className="h-4 w-4 text-[#6264b5]" />
                  <span>Senayan City Tower, Lt. 18, Jakarta</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#fffdf2]">
                Metode Pembayaran
              </p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {PAYMENTS.map((method) => (
                  <span
                    key={method}
                    className="rounded-md border border-[#c8b7db]/20 bg-[#0b1b5e]/50 px-2.5 py-1 text-[10px] font-semibold text-[#fffdf2]"
                  >
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {/* Mini CTA */}
            <div className="relative overflow-hidden rounded-2xl border border-[#c8b7db]/20 bg-[#0b1b5e]/70 p-5 shadow-[inset_0_1px_0_rgba(200,183,219,0.15)]">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#fffdf2]">
                <Ticket className="h-4 w-4 text-[#6264b5]" />
                Catatan untuk jalan pulang.
              </div>
              <p className="mt-2 text-xs leading-6 text-[#c8b7db]/90">
                {user
                  ? "Lihat rekomendasi dan kelola semua pengalaman konsermu."
                  : "Dapatkan kurasi event dan cerita live terbaru langsung di inbox."}
              </p>
              <Link
                href={user ? "/home" : "/register"}
                className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-[#fffdf2] transition hover:gap-2.5 hover:text-[#c8b7db]"
              >
                {user ? "Buka dashboard" : "Gabung sekarang"} <ArrowUpRight className="h-3.5 w-3.5 text-[#6264b5]" />
              </Link>
            </div>
          </div>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 border-t border-[#c8b7db]/10 py-8">
          <div className="flex items-center gap-2 text-[11px] text-[#c8b7db]/80">
            <Shield className="h-4 w-4 text-[#6264b5]" />
            <span>SSL 256-Bit Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#c8b7db]/80">
            <CreditCard className="h-4 w-4 text-[#6264b5]" />
            <span>PCI-DSS Level 1 Compliant</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#c8b7db]/80">
            <BadgeCheck className="h-4 w-4 text-[#6264b5]" />
            <span>100% Verified Promotor Tickets</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-3 border-t border-[#c8b7db]/10 py-7 text-[0.68rem] text-[#c8b7db]/70 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 Tixora. Seluruh hak cipta dilindungi.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-[#fffdf2]">
              Kebijakan Privasi
            </Link>
            <Link href="/terms" className="transition-colors hover:text-[#fffdf2]">
              Syarat & Ketentuan
            </Link>
            <p className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-[#6264b5]" />
              Dibuat untuk pencinta musik Indonesia
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
