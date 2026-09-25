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
      eyebrow="Secure your account"
      title="Buat password baru."
      description="Selesaikan satu langkah terakhir dan kembali ke akunmu dengan keamanan yang lebih baik."
      sideTitle="A fresh start, safely."
      sideDescription="Your new password will immediately protect access to your Concertix account and digital tickets."
      sideFeatures={[
        { icon: KeyRound, title: "Verified token", description: "Only an official link can be used." },
        { icon: ShieldCheck, title: "Encrypted password", description: "Your new details are stored securely." },
        { icon: CheckCircle2, title: "Ready to sign in", description: "No extra steps after this." },
      ]}
    >
      <ResetPasswordForm token={resetToken} />
    </AuthShell>
  );
}
