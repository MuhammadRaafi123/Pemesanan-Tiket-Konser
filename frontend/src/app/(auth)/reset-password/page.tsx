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
    >
      <ResetPasswordForm token={resetToken} />
    </AuthShell>
  );
}
