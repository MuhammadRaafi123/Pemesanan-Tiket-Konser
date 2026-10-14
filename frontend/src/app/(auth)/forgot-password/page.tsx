import { CheckCircle2, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Pemulihan akun"
      title="Kembali ke akunmu."
      description="Tidak perlu khawatir. Kami akan mengirim tautan aman untuk membantumu membuat password baru."
      sideTitle="Your account is still here."
      sideDescription="Pemulihan akun dirancang agar prosesnya tetap sederhana tanpa mengorbankan pengalaman menemukan dan menikmati tiketmu."
      sideFeatures={[
        { icon: MailCheck, title: "Cek inbox kamu", description: "Link reset dikirim ke email terdaftar." },
        { icon: KeyRound, title: "Buat password baru", description: "Pilih yang kuat dan mudah kamu ingat." },
        { icon: ShieldCheck, title: "Tautan terenkripsi", description: "Token hanya berlaku untuk waktu terbatas." },
        { icon: CheckCircle2, title: "Kembali ke tiket", description: "Kembali tanpa kehilangan data pesanan." },
      ]}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
