import { CheckCircle2, KeyRound, MailCheck, ShieldCheck } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import ForgotPasswordForm from "@/features/auth/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow="Account recovery"
      title="Kembali ke akunmu."
      description="Tidak perlu khawatir. Kami akan mengirim tautan aman untuk membantumu membuat password baru."
      sideTitle="Your account is still here."
      sideDescription="Our account recovery is designed to keep the process simple while preserving the experience of finding and enjoying your tickets."
      sideFeatures={[
        { icon: MailCheck, title: "Check your inbox", description: "A reset link is sent to your registered email." },
        { icon: KeyRound, title: "Create a new password", description: "Choose something strong and easy to remember." },
        { icon: ShieldCheck, title: "Encrypted link", description: "The token is only valid for a limited time." },
        { icon: CheckCircle2, title: "Back to your account", description: "Return to your tickets without losing your data." },
      ]}
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
