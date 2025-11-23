import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { TrustBanner } from "@/components/TrustBanner";
import { Features } from "@/components/Features";
import { ReviewsSection } from "@/components/ReviewsSection";
import { PodcastSection } from "@/components/PodcastSection";
import { About } from "@/components/About";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-secondary/30">
      <Navbar />
      <main>
        <Hero />
        <TrustBanner />
        <Features />
        <ReviewsSection />
        <PodcastSection />
        <About />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}