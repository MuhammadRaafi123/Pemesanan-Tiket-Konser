import { AuthShell } from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";
import ResetPasswordForm from "@/features/auth/components/ResetPasswordForm";

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    token?: string | string[];
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const { token } = await searchParams;
  const resetToken = Array.isArray(token) ? token[0] ?? null : token ?? null;
  const isResetFlow = token !== undefined;

  return (
    <AuthShell
      eyebrow={isResetFlow ? "Amankan akunmu" : "Pemulihan akun"}
      title={isResetFlow ? "Buat password baru." : "Kembali ke akunmu."}
      description={
        isResetFlow
          ? "Selesaikan satu langkah terakhir dan kembali ke akunmu dengan keamanan yang lebih baik."
          : "Tidak perlu khawatir. Kami akan mengirim tautan aman untuk membantumu membuat password baru."
      }
      heroImage="/reset-password.png"
      heroImageAlt="Suasana konser Tixora"
    >
      {isResetFlow ? (
        <ResetPasswordForm token={resetToken} />
      ) : (
        <ForgotPasswordForm />
      )}
    </AuthShell>
  );
}
