import { AuthShell } from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Pemulihan akun"
      title="Kembali ke akunmu."
      description="Tidak perlu khawatir. Kami akan mengirim tautan aman untuk membantumu membuat password baru."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
