"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Ticket, 
  ShoppingBag, 
  ShieldCheck, 
  Sparkles, 
  Save, 
  KeyRound, 
  LogOut,
  Heart
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { CardSpotlight } from "@/components/shared/CardSpotlight";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/shared/ToastProvider";
import { fetchProfile, updateProfile } from "@/features/profile/api";
import { UserProfile } from "@/features/profile/types";
import { Loading } from "@/components/shared/Loading";

export default function ProfilePage() {
  const { user, setUser, logout } = useAuthStore();
  const { success, error } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");

  useEffect(() => {
    fetchProfile().then((data) => {
      setProfile(data);
      setName(data.name);
      setEmail(data.email);
      setPhone(data.phone || "");
      setFavoriteGenre(data.favorite_genre || "Pop / Rock");
      setLoading(false);
    });
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updated = await updateProfile({
        name,
        email,
        phone,
        favorite_genre: favoriteGenre,
      });

      setProfile(updated);
      if (user) {
        setUser({ ...user, name, email });
      }
      success("Profil akun berhasil diperbarui!");
    } catch {
      error("Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080c] flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center pt-24">
          <Loading message="Memuat profil akun..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Profile Card Header */}
        <CardSpotlight className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 border-purple-500/30 bg-gradient-to-r from-purple-950/30 to-[#10101c]">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-1 shadow-[0_0_25px_rgba(168,85,247,0.5)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-[#0c0c16] text-3xl font-black text-white">
              {name ? name.charAt(0).toUpperCase() : "U"}
            </div>
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <Badge variant="gradient" className="text-xs">
                <Sparkles className="h-3 w-3" />
                VIP Concert Member
              </Badge>
              <Badge variant="secondary" className="text-xs">
                Bergabung {profile?.joined_date || "2026"}
              </Badge>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{name}</h1>
            <p className="text-xs text-white/50">{email}</p>
          </div>

          <Button
            onClick={() => {
              logout();
              window.location.href = "/";
            }}
            variant="outline"
            size="sm"
            className="gap-1.5 border-rose-500/30 text-rose-300 hover:bg-rose-500/10"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </CardSpotlight>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-xl">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-purple-600/20 text-purple-400">
              <Ticket className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-white">{profile?.tickets_count || 2}</p>
            <p className="text-xs font-semibold text-white/40 uppercase">Tiket Dimiliki</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-xl">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-600/20 text-cyan-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-cyan-300">{profile?.orders_count || 2}</p>
            <p className="text-xs font-semibold text-white/40 uppercase">Total Pesanan</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 text-center backdrop-blur-xl">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-pink-600/20 text-pink-400">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-pink-300 truncate">{favoriteGenre || "Pop / Rock"}</p>
            <p className="text-xs font-semibold text-white/40 uppercase">Genre Favorit</p>
          </div>
        </div>

        {/* Edit Profile Form */}
        <CardSpotlight className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <User className="h-5 w-5 text-purple-400" />
              Pengaturan Profil Akun
            </h3>
            <p className="text-xs text-white/50 mt-1">
              Perbarui data informasi kontak dan preferensi musikmu.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-white/70">Nama Lengkap</label>
                <Input
                  icon={<User className="h-4 w-4" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Alamat Email</label>
                <Input
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-white/70">Nomor Telepon</label>
                <Input
                  type="tel"
                  icon={<Phone className="h-4 w-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-white/70">Genre Musik Favorit</label>
                <Input
                  icon={<Sparkles className="h-4 w-4" />}
                  value={favoriteGenre}
                  onChange={(e) => setFavoriteGenre(e.target.value)}
                  placeholder="Contoh: Alternative Rock, EDM, Jazz"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <Button type="submit" isLoading={isSaving} variant="glow" size="default" className="gap-2">
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </Button>
            </div>
          </form>
        </CardSpotlight>

      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
