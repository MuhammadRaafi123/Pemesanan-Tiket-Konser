import { Loading } from "@/components/shared/Loading";

export default function CustomerLoading() {
  return (
    <main className="min-h-screen bg-background pt-24 text-ink">
      <Loading message="Menyiapkan dompet konsermu..." />
    </main>
  );
}
