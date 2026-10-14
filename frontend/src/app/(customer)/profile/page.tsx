"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, LogOut, Mail, Phone, Save, Sparkles, Ticket, User, WalletCards } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MobileNav } from "@/components/layout/MobileNav";
import { PageHeader } from "@/components/shared/PageHeader";
import { Reveal, Stagger } from "@/components/shared/Reveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CountUp } from "@/components/shared/CountUp";
import { useAuthStore } from "@/stores/authStore";
import { useToast } from "@/components/shared/ToastProvider";
import { fetchProfile, updateProfile } from "@/features/profile/api";
import type { UserProfile } from "@/features/profile/types";
import { Loading } from "@/components/shared/Loading";
import { formatEventDate } from "@/lib/format";

export default function ProfilePage() {
  const router = useRouter();
  const { user, setUser, logout } = useAuthStore();
  const { success, error } = useToast();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [favoriteGenre, setFavoriteGenre] = useState("");

  useEffect(() => {
    let active = true;

    fetchProfile()
      .then((data) => {
        if (!active) return;
        setProfile(data);
        setName(data.name);
        setEmail(data.email);
        setPhone(data.phone || "");
        setFavoriteGenre(data.favorite_genre || "");
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleSaveProfile = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);

    try {
      const updated = await updateProfile({
        name,
        email,
        phone,
        favorite_genre: favoriteGenre,
      });

      setProfile(updated);
      if (user) setUser({ ...user, name, email });
      success("Profil akun berhasil diperbarui!");
    } catch {
      error("Gagal memperbarui profil.");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-ink">
        <Navbar />
        <main className="flex flex-1 items-center justify-center px-4 pt-28">
          <Loading message="Memuat profil akun..." />
        </main>
        <Footer />
        <MobileNav />
      </div>
    );
  }

  const stats = [
    { label: "Tiket dimiliki", value: profile?.tickets_count ?? 0, icon: Ticket },
    { label: "Total pesanan", value: profile?.orders_count ?? 0, icon: WalletCards },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Navbar />

      <main className="mx-auto w-full max-w-5xl flex-1 px-5 pb-24 pt-32 sm:px-8 sm:pt-40">
        <PageHeader
          eyebrow="Akun saya"
          title={name || "Profil kamu"}
          description="Kelola data kontak dan preferensi musikmu di satu tempat."
          actions={
            <Button
              variant="secondary"
              onClick={() => {
                logout();
                router.replace("/");
              }}
              className="gap-1.5 border-rose-200 text-rose-600 hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </Button>
          }
        />

        <Stagger className="mt-8 grid gap-4 sm:grid-cols-3" step={80}>
          {stats.map(({ label, value, icon: Icon }) => (
            <div key={label} className="panel rounded-2xl p-6 text-center">
              <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent text-primary">
                <Icon className="h-5 w-5" />
              </span>
              <p className="numeral text-2xl text-ink">
                <CountUp value={value} />
              </p>
              <p className="meta-label mt-2">{label}</p>
            </div>
          ))}

          <div className="panel rounded-2xl p-6 text-center">
            <span className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fdf9f1] text-gold">
              <Heart className="h-5 w-5" />
            </span>
            <p className="font-display truncate text-lg text-ink">
              {favoriteGenre || "Belum diatur"}
            </p>
            <p className="meta-label mt-2">Genre favorit</p>
          </div>
        </Stagger>

        <Reveal delay={90} className="mt-6">
          <section className="rounded-[28px] border border-border bg-white p-6 shadow-[0_1px_2px_rgba(10,27,51,.04),0_18px_44px_-30px_rgba(13,38,84,.28)] sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
              <h2 className="flex items-center gap-2.5">
                <User className="h-4 w-4 text-primary" />
                <span className="font-display text-xl text-ink">Pengaturan profil</span>
              </h2>
              <span className="meta-label">
                Bergabung {profile?.joined_date ? formatEventDate(profile.joined_date) : "2026"}
              </span>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="profile-name">Nama lengkap</Label>
                  <Input
                    id="profile-name"
                    icon={<User className="h-4 w-4" />}
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Nama lengkap"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-email">Alamat email</Label>
                  <Input
                    id="profile-email"
                    type="email"
                    icon={<Mail className="h-4 w-4" />}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@email.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profile-phone">Nomor telepon</Label>
                  <Input
                    id="profile-phone"
                    type="tel"
                    icon={<Phone className="h-4 w-4" />}
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="081234567890"
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="profile-genre">Genre musik favorit</Label>
                  <Input
                    id="profile-genre"
                    icon={<Sparkles className="h-4 w-4" />}
                    value={favoriteGenre}
                    onChange={(event) => setFavoriteGenre(event.target.value)}
                    placeholder="Contoh: Alternative rock, EDM, jazz"
                  />
                </div>
              </div>

              <div className="flex justify-end border-t border-border pt-6">
                <Button type="submit" isLoading={isSaving} className="gap-2">
                  <Save className="h-4 w-4" />
                  Simpan perubahan
                </Button>
              </div>
            </form>
          </section>
        </Reveal>
      </main>

      <Footer />
      <MobileNav />
    </div>
  );
}
