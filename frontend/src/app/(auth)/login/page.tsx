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
      >
        <LoginForm />
      </AuthShell>
    </GuestOnly>
  );
}
