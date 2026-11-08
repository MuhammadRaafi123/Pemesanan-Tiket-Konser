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
      >
        <RegisterForm />
      </AuthShell>
    </GuestOnly>
  );
}
