import { Loading } from "@/components/shared/Loading";

export default function PublicLoading() {
  return (
    <main className="min-h-screen bg-background pt-24 text-ink">
      <Loading message="Menyiapkan live experience..." />
    </main>
  );
}
