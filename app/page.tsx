import { HeroPrompt } from "@/components/ui/ai-prompt";
import { Header } from "@/components/ui/navigation-menu";
import { ApplicationStats } from "@/components/ui/application-stats";
import { Footer } from "@/components/ui/footer/footer";
import { IconSection } from "@/components/ui/icon-section";
import { HowItWorks } from "@/components/ui/how-it-works";
import { FeaturesGrid } from "@/components/ui/features-grid";
import PromptingIsAllYouNeed from "@/components/ui/prompting";

export default function Home() {
  return (
    <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <Header />
      <main className="flex flex-col gap-16 items-center sm:items-start w-full max-w-6xl mx-auto px-4 md:px-6">
        <HeroPrompt 
          textareaName="prompt"
          placeholder="Describe your website (e.g., 'Create a landing page for a coffee shop')"
        />
        <FeaturesGrid />
        <PromptingIsAllYouNeed />
        <ApplicationStats />
        <HowItWorks />
        <IconSection />
      </main>
      <Footer />
    </div>
  );
}
