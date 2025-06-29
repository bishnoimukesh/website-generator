import { HeroPrompt } from "@/components/ui/ai-promt";
import { Header } from "@/components/ui/navigation-menu";
import { ApplicationStats } from "@/components/ui/application-stats";
import { Footer } from "@/components/ui/footer/footer";
import { IconSection } from "@/components/ui/icon-section";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Header/>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <HeroPrompt />
        <IconSection />
        <ApplicationStats />
      </main>
      <Footer />
    </div>
  );
}
