import { Loading } from "@/components/shared/Loading";

export default function AuthLoading() {
  return (
    <main className="min-h-screen bg-[#0b0e15] pt-24 text-[#e1e2ec]">
      <Loading message="Menyiapkan ruang akun..." />
    </main>
  );
}
