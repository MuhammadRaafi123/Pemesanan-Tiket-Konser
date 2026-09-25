import { Heart, ShieldCheck, Sparkles, Ticket } from "lucide-react";
import { AuthShell } from "@/components/auth/AuthShell";
import RegisterForm from "@/features/auth/components/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthShell
      eyebrow="Create your account"
      title="Mulai dari satu momen."
      description="Buat akun gratis dan temukan konser yang akan kamu ceritakan lagi berbulan-bulan ke depan."
      sideTitle="Make room for more live moments."
      sideDescription="Join fans who discover music, artists, and new stories together on stage."
      sideFeatures={[
        { icon: Ticket, title: "Early access", description: "Find selected events before they sell out." },
        { icon: Sparkles, title: "Personal recommendations", description: "Get a curation that feels relevant to you." },
        { icon: ShieldCheck, title: "Your data stays safe", description: "Manage your account and tickets with confidence." },
        { icon: Heart, title: "Keep the moments", description: "Your order history stays close at hand." },
      ]}
    >
      <RegisterForm />
    </AuthShell>
  );
}
