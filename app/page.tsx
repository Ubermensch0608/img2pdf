import { Header } from "@/src/features/components/Header";
import { InnerContent } from "@/src/features/components/InnerContent";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center p-4 gap-4">
      <Header />
      <InnerContent />
    </main>
  );
}
