import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

type ResetPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ResetPasswordPage({ searchParams }: ResetPasswordPageProps) {
  const { token } = await searchParams;
  const resetToken = Array.isArray(token) ? token[0] ?? null : token ?? null;

  return (
    <AuthShell
      eyebrow="Amankan akunmu"
      title="Buat password baru."
      description="Selesaikan satu langkah terakhir dan kembali ke akunmu dengan keamanan yang lebih baik."
      sideTitle="A fresh start, safely."
      sideDescription="Password barumu akan langsung melindungi akses ke akun Concertix dan tiket digitalmu."
      sideFeatures={[
        { icon: KeyRound, title: "Token terverifikasi", description: "Hanya tautan resmi yang bisa digunakan." },
        { icon: ShieldCheck, title: "Password terenkripsi", description: "Detail barumu disimpan dengan aman." },
        { icon: CheckCircle2, title: "Siap masuk lagi", description: "Tidak ada langkah tambahan setelah ini." },
      ]}
    >
      <ResetPasswordForm token={resetToken} />
    </AuthShell>
  );
}
