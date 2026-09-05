"use client";

import React from "react";
import Link from "next/link";
import { 
  Music2, 
  ShieldCheck, 
  Sparkles, 
  Ticket, 
  Headphones, 
  CreditCard, 
  Send,
  Heart
} from "lucide-react";
import { SoundVisualizer } from "@/components/shared/SoundVisualizer";

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/10 bg-[#060609] pt-16 pb-24 md:pb-12 text-white overflow-hidden">
      
      {/* Ambient background glow */}
      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-[radial-gradient(circle_at_bottom,rgba(139,92,246,0.12),transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Trust Guarantees Bar */}
        <div className="mb-16 grid grid-cols-2 gap-4 rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-xl sm:grid-cols-4 sm:p-8">
          
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-purple-500/20 bg-purple-950/40 text-purple-400 shrink-0">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">100% Tiket Resmi</p>
              <p className="text-[11px] text-white/50">Garansi tiket terverifikasi</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-500/20 bg-cyan-950/40 text-cyan-400 shrink-0">
              <Ticket className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">QR Code Instan</p>
              <p className="text-[11px] text-white/50">Langsung masuk akunmu</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink-500/20 bg-pink-950/40 text-pink-400 shrink-0">
              <CreditCard className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Pembayaran Mudah</p>
              <p className="text-[11px] text-white/50">QRIS, VA & E-Wallet</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-amber-500/20 bg-amber-950/40 text-amber-400 shrink-0">
              <Headphones className="h-6 w-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Layanan 24/7</p>
              <p className="text-[11px] text-white/50">Bantuan pelanggan siap siaga</p>
            </div>
          </div>

        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          
          {/* Brand & Bio */}
          <div className="md:col-span-4 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-purple-600 to-cyan-400 p-[2px]">
                <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-[#0a0a12]">
                  <Music2 className="h-5 w-5 text-purple-400" />
                </div>
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Concert<span className="text-purple-400">ix</span>
              </span>
            </Link>

            <p className="text-xs leading-relaxed text-white/60">
              Platform pemesanan tiket konser musik generasi terbaru di Indonesia.
              Nikmati kemudahan eksplorasi jadwal konser, booking tiket instan, dan tiket digital QR anti ribet.
            </p>

            <div className="pt-2">
              <SoundVisualizer barCount={16} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">
              Jelajahi
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <Link href="/events" className="hover:text-purple-400 transition">Semua Konser</Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-purple-400 transition">Daftar Artis</Link>
              </li>
              <li>
                <Link href="/events?genre=rock" className="hover:text-purple-400 transition">Konser Rock</Link>
              </li>
              <li>
                <Link href="/events?genre=edm" className="hover:text-purple-400 transition">EDM Festival</Link>
              </li>
              <li>
                <Link href="/events?genre=jazz" className="hover:text-purple-400 transition">Jazz & Pop</Link>
              </li>
            </ul>
          </div>

          {/* Customer Area */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
              Pengguna
            </h4>
            <ul className="space-y-2 text-xs text-white/60">
              <li>
                <Link href="/tickets" className="hover:text-cyan-400 transition">Tiket Saya</Link>
              </li>
              <li>
                <Link href="/orders" className="hover:text-cyan-400 transition">Riwayat Pesanan</Link>
              </li>
              <li>
                <Link href="/checkout" className="hover:text-cyan-400 transition">Checkout</Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-cyan-400 transition">Profil Akun</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-cyan-400 transition">Masuk Akun</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-pink-300">
              Dapatkan Info Konser Terbaru
            </h4>
            <p className="text-xs text-white/60">
              Daftarkan emailmu untuk notifikasi presale tiket, promo eksklusif, dan jadwal konser artis internasional.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="flex items-center gap-2">
              <input
                type="email"
                placeholder="nama@email.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder:text-white/30 focus:border-purple-500 focus:outline-none"
              />
              <button
                type="submit"
                className="flex h-10 items-center justify-center rounded-xl bg-purple-600 px-4 text-xs font-bold text-white hover:bg-purple-500 transition shadow-lg shadow-purple-600/30"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 flex flex-col items-center justify-between border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row gap-4">
          <p>© 2026 Concertix Inc. Hak Cipta Dilindungi.</p>
          <div className="flex items-center gap-1 text-white/50">
            Dibuat dengan <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 inline" /> untuk pecinta musik Indonesia
          </div>
        </div>

      </div>
    </footer>
  );
}
export default Footer;
