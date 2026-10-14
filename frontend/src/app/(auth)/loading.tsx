import { Loading } from "@/components/shared/Loading";

export default function AuthLoading() {
  return (
    <main className="min-h-screen bg-background pt-24 text-ink">
      <Loading message="Menyiapkan ruang akun..." />
    </main>
  );
}
