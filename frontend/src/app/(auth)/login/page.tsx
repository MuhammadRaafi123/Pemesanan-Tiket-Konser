import { ShieldCheck, Sparkles, Ticket, WalletCards } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import { GuestOnly } from "@/components/auth/GuestOnly";
import LoginForm from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <GuestOnly>
      <AuthShell
        eyebrow="Selamat datang kembali"
        title="Masuk ke akunmu"
        description="Masuk untuk menemukan konser dan menyimpan tiket digitalmu."
        sideTitle="Make room for more live moments."
        sideDescription="Bergabung dengan penonton yang menemukan musik, artis, dan cerita baru bersama di panggung."
        sideFeatures={[
          { icon: Ticket, title: "Akses lebih awal", description: "Temukan event pilihan sebelum kehabisan kuota." },
          { icon: Sparkles, title: "Rekomendasi personal", description: "Kurasi yang terasa relevan dengan dirimu." },
          { icon: WalletCards, title: "Semua tiketmu", description: "E-ticket QR tersimpan rapi dalam satu dompet." },
          { icon: ShieldCheck, title: "Transaksi aman", description: "Data akunmu terlindungi enkripsi end-to-end." },
        ]}
        heroImage="/login.jpg"
      >
        <LoginForm />
      </AuthShell>
    </GuestOnly>
  );
}
