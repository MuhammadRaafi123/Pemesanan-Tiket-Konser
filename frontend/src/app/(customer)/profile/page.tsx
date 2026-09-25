"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Phone,
  Ticket,
  ShoppingBag,
  Sparkles,
  Save,
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
  const router = useRouter();
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
      <div className="light-app min-h-screen bg-[#f4f8ff] flex flex-col">
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
    <div className="light-app min-h-screen bg-[#f4f8ff] text-[#123b6d] flex flex-col">
      <Navbar />

      <main className="flex-1 pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full space-y-8">
        
        {/* Profile Card Header */}
        <CardSpotlight className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8 border-blue-200 bg-white">
          <div className="relative flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-[#2563eb] p-1 shadow-[0_12px_30px_-16px_rgba(37,99,235,.45)]">
            <div className="flex h-full w-full items-center justify-center rounded-full bg-blue-50 text-3xl font-black text-[#123b6d]">
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

            <h1 className="text-2xl sm:text-3xl font-black text-[#123b6d]">{name}</h1>
            <p className="text-xs text-[#8aa4c1]">{email}</p>
          </div>

          <Button
            onClick={() => {
              logout();
              router.replace("/");
            }}
            variant="outline"
            size="sm"
            className="gap-1.5 border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        </CardSpotlight>

        {/* User Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center backdrop-blur-xl">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#2563eb]">
              <Ticket className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-[#123b6d]">{profile?.tickets_count || 2}</p>
            <p className="text-xs font-semibold text-[#8aa4c1] uppercase">Tiket Dimiliki</p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center backdrop-blur-xl">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
              <ShoppingBag className="h-5 w-5" />
            </div>
            <p className="text-2xl font-black text-sky-600">{profile?.orders_count || 2}</p>
            <p className="text-xs font-semibold text-[#8aa4c1] uppercase">Total Pesanan</p>
          </div>

          <div className="rounded-2xl border border-blue-100 bg-white p-5 text-center backdrop-blur-xl">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-[#2563eb]">
              <Heart className="h-5 w-5" />
            </div>
            <p className="text-lg font-bold text-[#2563eb] truncate">{favoriteGenre || "Pop / Rock"}</p>
            <p className="text-xs font-semibold text-[#8aa4c1] uppercase">Genre Favorit</p>
          </div>
        </div>

        {/* Edit Profile Form */}
        <CardSpotlight className="space-y-6">
          <div className="border-b border-blue-100 pb-4">
            <h3 className="text-lg font-bold text-[#123b6d] flex items-center gap-2">
              <User className="h-5 w-5 text-[#2563eb]" />
              Pengaturan Profil Akun
            </h3>
            <p className="text-xs text-[#8aa4c1] mt-1">
              Perbarui data informasi kontak dan preferensi musikmu.
            </p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#17457f]">Nama Lengkap</label>
                <Input
                  icon={<User className="h-4 w-4" />}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama Lengkap"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17457f]">Alamat Email</label>
                <Input
                  type="email"
                  icon={<Mail className="h-4 w-4" />}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#17457f]">Nomor Telepon</label>
                <Input
                  type="tel"
                  icon={<Phone className="h-4 w-4" />}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="081234567890"
                />
              </div>

              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-bold text-[#17457f]">Genre Musik Favorit</label>
                <Input
                  icon={<Sparkles className="h-4 w-4" />}
                  value={favoriteGenre}
                  onChange={(e) => setFavoriteGenre(e.target.value)}
                  placeholder="Contoh: Alternative Rock, EDM, Jazz"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-blue-100">
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
