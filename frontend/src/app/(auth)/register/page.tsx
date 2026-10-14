import { Heart, ShieldCheck, Sparkles, Ticket, WalletCards } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { GuestOnly } from "@/components/auth/GuestOnly";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <GuestOnly>
      <AuthShell
        eyebrow="Buat akunmu"
        title="Mulai dari satu momen."
        description="Buat akun gratis dan temukan konser yang akan kamu ceritakan lagi berbulan-bulan ke depan."
        sideTitle="Make room for more live moments."
        sideDescription="Bergabung dengan penonton yang menemukan musik, artis, dan cerita baru bersama di panggung."
        sideFeatures={[
          { icon: Ticket, title: "Akses lebih awal", description: "Temukan event pilihan sebelum kehabisan kuota." },
          { icon: Sparkles, title: "Rekomendasi personal", description: "Kurasi yang terasa relevan dengan dirimu." },
          { icon: WalletCards, title: "Dompet tiket", description: "Semua e-ticket tersimpan dalam satu tempat." },
          { icon: Heart, title: "Simpan momennya", description: "Riwayat pesanan tetap dekat kapan pun kamu butuh." },
          { icon: ShieldCheck, title: "Data tetap aman", description: "Kelola akun dan tiket dengan percaya diri." },
        ]}
      >
        <RegisterForm />
      </AuthShell>
    </GuestOnly>
  );
}
